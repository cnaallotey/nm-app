import { NextRequest, NextResponse } from "next/server";

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
      
      FIREBASE_SERVICE_ACCOUNT_KEY_exists: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      FIREBASE_SERVICE_ACCOUNT_KEY_length: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0,

      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "none",
    },
    firebaseImport: {
      status: "untested",
      error: null,
      stack: null,
    },
    geminiImport: {
      status: "untested",
      error: null,
      stack: null,
    },
    firebaseQuery: {
      status: "untested",
      error: null,
    },
    geminiQuery: {
      status: "untested",
      error: null,
    }
  };

  // 1. Test importing firebaseAdmin dynamically
  let firebaseAdminModule: any = null;
  try {
    console.log("Dynamically importing firebaseAdmin...");
    firebaseAdminModule = await import("@/lib/firebaseAdmin");
    results.firebaseImport.status = "success";
  } catch (err: any) {
    results.firebaseImport.status = "failed";
    results.firebaseImport.error = err.message || String(err);
    results.firebaseImport.stack = err.stack || null;
  }

  // 2. Test importing gemini dynamically
  let geminiModule: any = null;
  try {
    console.log("Dynamically importing gemini...");
    geminiModule = await import("@/lib/gemini");
    results.geminiImport.status = "success";
  } catch (err: any) {
    results.geminiImport.status = "failed";
    results.geminiImport.error = err.message || String(err);
    results.geminiImport.stack = err.stack || null;
  }

  // 3. Test Firebase query if import succeeded
  if (firebaseAdminModule) {
    try {
      const snap = await firebaseAdminModule.adminDb.collection("quizzes").limit(1).get();
      results.firebaseQuery.status = `success: retrieved ${snap.size} documents`;
    } catch (err: any) {
      results.firebaseQuery.status = "failed";
      results.firebaseQuery.error = err.message || String(err);
    }
  }

  // 4. Test Gemini query if import succeeded
  if (geminiModule) {
    try {
      const response = await geminiModule.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello",
      });
      results.geminiQuery.status = "success";
      results.geminiQuery.text = response.text || "no text";
    } catch (err: any) {
      results.geminiQuery.status = "failed";
      results.geminiQuery.error = err.message || String(err);
    }
  }

  return NextResponse.json(results);
}
