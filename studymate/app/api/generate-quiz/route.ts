import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { generateQuiz } from "@/lib/quizGenerator";
import { Timestamp } from "firebase-admin/firestore";

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

    const { videoId, transcript, title } = body;

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'videoId' field." },
        { status: 400 }
      );
    }
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'transcript' field." },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'title' field." },
        { status: 400 }
      );
    }

    // 1. Check if the quiz is already cached in Firestore
    const quizDocRef = adminDb.collection("quizzes").doc(videoId);
    const quizDocSnap = await quizDocRef.get();

    if (quizDocSnap.exists) {
      console.log(`Returning cached quiz from Firestore for video ID: ${videoId}`);
      // Return cached quiz directly
      return NextResponse.json(quizDocSnap.data());
    }

    // 2. Not cached: Generate quiz using Gemini SDK
    // Calculate intelligent number of questions based on transcript word count
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    let numQuestions = 8;
    if (wordCount < 400) {
      numQuestions = 5;
    } else if (wordCount < 1200) {
      numQuestions = 8;
    } else if (wordCount < 2500) {
      numQuestions = 12;
    } else if (wordCount < 5000) {
      numQuestions = 16;
    } else if (wordCount < 10000) {
      numQuestions = 20;
    } else {
      numQuestions = 25;
    }

    console.log(`Generating quiz via Gemini for video ID: ${videoId} with ${numQuestions} questions (word count: ${wordCount})`);
    const questions = await generateQuiz(transcript, numQuestions);

    const now = Timestamp.now();
    const quizData = {
      videoId,
      questions,
      createdAt: now,
    };

    const videoData = {
      videoId,
      title,
      transcriptFetchedAt: now,
      quizGeneratedAt: now,
    };

    // 3. Save to Firestore (quizzes and videos collections)
    await Promise.all([
      quizDocRef.set(quizData),
      adminDb.collection("videos").doc(videoId).set(videoData),
    ]);

    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error("Error in generate-quiz API route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate or cache the quiz." },
      { status: 500 }
    );
  }
}
