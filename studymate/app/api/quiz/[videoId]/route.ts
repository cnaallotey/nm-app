import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId parameter." },
        { status: 400 }
      );
    }

    const quizDocSnap = await adminDb.collection("quizzes").doc(videoId).get();

    if (!quizDocSnap.exists) {
      return NextResponse.json(
        { error: "Quiz not found. It has not been generated yet." },
        { status: 404 }
      );
    }

    return NextResponse.json(quizDocSnap.data());
  } catch (error: any) {
    console.error(`Error retrieving quiz for video ID ${error?.message}:`, error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
