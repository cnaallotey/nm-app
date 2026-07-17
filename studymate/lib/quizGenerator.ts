import { ai } from "./gemini";

export interface Question {
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  explanation: string;
}

const quizSchema = {
  type: "ARRAY",
  description: "List of multiple-choice questions.",
  items: {
    type: "OBJECT",
    properties: {
      question: { 
        type: "STRING", 
        description: "The text of the multiple choice question." 
      },
      options: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "Exactly 4 options for answers. Only one option must be correct."
      },
      correctAnswerIndex: {
        type: "INTEGER",
        description: "The 0-based index of the correct option (0, 1, 2, or 3)."
      },
      explanation: {
        type: "STRING",
        description: "A brief, clear explanation explaining why the correct option is the right answer based strictly on the transcript."
      }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

/**
 * Generates a structured multiple-choice quiz based on a video transcript using Google Gemini.
 * Includes schema enforcement and up to 2 automatic retries on parse or structure validation failure.
 */
export async function generateQuiz(transcript: string, numQuestions = 8): Promise<Question[]> {
  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate exactly ${numQuestions} multiple-choice questions based strictly on the following transcript to test comprehension of its content. Do not include questions that require external knowledge not stated in the text.\n\nTranscript:\n${transcript}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema,
          systemInstruction: 
            "You are a professional assessment designer. Your task is to generate high-quality multiple-choice questions " +
            "to test a learner's comprehension of the provided video transcript.\n\n" +
            "Strict Guidelines:\n" +
            "1. All questions, options, and explanations must be based strictly and solely on the information directly stated in the transcript.\n" +
            "2. Do not introduce outside facts, general knowledge, or assumptions not covered in the transcript.\n" +
            "3. Each question must have exactly 4 options.\n" +
            "4. Options should be plausible but have only one clearly correct answer based on the transcript.\n" +
            "5. Provide a clear, brief explanation for the correct answer, pointing out what was stated in the video."
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received empty response text from Gemini API.");
      }

      const questions = JSON.parse(responseText) as Question[];

      // Validate structure matches expectations
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (
          !q.question ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          typeof q.correctAnswerIndex !== "number" ||
          !q.explanation
        ) {
          throw new Error(`Structure validation failed at question index ${i}`);
        }
        if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
          throw new Error(`correctAnswerIndex ${q.correctAnswerIndex} at question index ${i} is out of bounds (must be 0-3)`);
        }
      }

      return questions;
    } catch (error) {
      attempt++;
      console.warn(`Quiz generation attempt ${attempt} failed:`, error);
      if (attempt > maxRetries) {
        throw new Error("Failed to generate a valid quiz from the transcript after multiple attempts.");
      }
    }
  }

  throw new Error("Unexpected end of retry loop");
}
