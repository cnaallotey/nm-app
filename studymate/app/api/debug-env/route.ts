import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { ai } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("pass");

  // Secure password check to protect environment statistics
  if (password !== "studydebug") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: any = {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      GEMINI_API_KEY_exists: !!process.env.GEMINI_API_KEY,
      GEMINI_API_KEY_length: process.env.GEMINI_API_KEY?.length || 0,
      GEMINI_API_KEY_prefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) : "none",
      
      FIREBASE_SERVICE_ACCOUNT_KEY_exists: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      FIREBASE_SERVICE_ACCOUNT_KEY_length: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0,
      FIREBASE_SERVICE_ACCOUNT_KEY_prefix: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? process.env.FIREBASE_SERVICE_ACCOUNT_KEY.substring(0, 20) : "none",

      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "none",
    },
    firebase: {
      status: "untested",
      error: null,
      stack: null,
    },
    gemini: {
      status: "untested",
      error: null,
      stack: null,
    }
  };

  // Test Firebase Admin Firestore query
  try {
    const snap = await adminDb.collection("quizzes").limit(1).get();
    results.firebase.status = `success: retrieved ${snap.size} documents`;
  } catch (err: any) {
    results.firebase.status = "failed";
    results.firebase.error = err.message || String(err);
    results.firebase.stack = err.stack || null;
  }

  // Test Gemini API call
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    results.gemini.status = "success";
    results.gemini.text = response.text || "no text response";
  } catch (err: any) {
    results.gemini.status = "failed";
    results.gemini.error = err.message || String(err);
    results.gemini.stack = err.stack || null;
  }

  return NextResponse.json(results);
}
