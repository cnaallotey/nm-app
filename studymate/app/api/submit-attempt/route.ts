import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth, Timestamp } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const { videoId, answers } = body;

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'videoId' field." },
        { status: 400 }
      );
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing or invalid 'answers' field. Expected an array of numbers." },
        { status: 400 }
      );
    }

    // 1. Fetch cached quiz from Firestore to score answers
    const quizDocSnap = await adminDb.collection("quizzes").doc(videoId).get();
    if (!quizDocSnap.exists) {
      return NextResponse.json(
        { error: "Quiz not found. Please generate the quiz before submitting an attempt." },
        { status: 404 }
      );
    }

    const quizData = quizDocSnap.data();
    const questions = quizData?.questions || [];
    const totalQuestions = questions.length;

    if (answers.length !== totalQuestions) {
      return NextResponse.json(
        { error: `Answer count mismatch. Expected ${totalQuestions} answers, got ${answers.length}.` },
        { status: 400 }
      );
    }

    // 2. Score the answers
    let correctCount = 0;
    const correctAnswers = questions.map((q: any, idx: number) => {
      const isCorrect = q.correctAnswerIndex === answers[idx];
      if (isCorrect) {
        correctCount++;
      }
      return q.correctAnswerIndex;
    });

    const score = correctCount; // Raw score count, can compute % on client

    // 3. Optional User Auth Check to record the attempt
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.substring(7);
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userId = decodedToken.uid;
      } catch (authError) {
        console.warn("Failed to verify user ID token for recording attempt:", authError);
        // Continue without saving (or return auth error, but guest usage is allowed)
      }
    }

    let attemptId: string | null = null;

    // 4. Save attempt if authenticated
    if (userId) {
      const attemptData = {
        userId,
        videoId,
        answers,
        score,
        completedAt: Timestamp.now(),
      };
      
      // Auto-generated ID for each attempt
      const docRef = await adminDb.collection("attempts").add(attemptData);
      attemptId = docRef.id;
      console.log(`Saved authenticated quiz attempt ${attemptId} for user ${userId} and video ${videoId}`);
    }

    return NextResponse.json({
      score,
      totalQuestions,
      correctAnswers,
      attemptId,
    });
  } catch (error: any) {
    console.error("Error in submit-attempt API route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit and grade attempt." },
      { status: 500 }
    );
  }
}
