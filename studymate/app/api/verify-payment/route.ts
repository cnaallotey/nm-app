import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { reference, userId, email, displayName } = await req.json();

    if (!reference || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: reference and userId" },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey || paystackSecretKey.includes("PASTE_YOUR")) {
      console.error("PAYSTACK_SECRET_KEY not configured in .env.local");
      return NextResponse.json(
        { error: "Payment gateway not configured. Please contact support." },
        { status: 503 }
      );
    }

    // 1. Verify the transaction with Paystack's API
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paystackRes.ok) {
      const errText = await paystackRes.text();
      console.error("Paystack verification HTTP error:", paystackRes.status, errText);
      return NextResponse.json(
        { error: "Payment verification failed. Please try again." },
        { status: 402 }
      );
    }

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      console.warn("Paystack verification non-success status:", paystackData.data?.status);
      return NextResponse.json(
        { error: "Payment was not completed. Please try again." },
        { status: 402 }
      );
    }

    const txData = paystackData.data;

    // 2. Write to Firestore (server-side with Admin SDK — bypasses client security rules)
    const db = adminDb;

    // Check for duplicate reference (idempotency guard)
    const existingQuery = await db
      .collection("payments")
      .where("reference", "==", reference)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      // Already processed — still return success so client can update state
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // Record the payment
    await db.collection("payments").add({
      userId,
      email: email || txData.customer?.email || "",
      displayName: displayName || "",
      reference,
      transactionId: String(txData.id),
      amount: txData.amount / 100, // Paystack stores in kobo (smallest unit)
      currency: txData.currency,
      plan: "Pro",
      channel: txData.channel,
      paidAt: txData.paid_at,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Upgrade the user's plan
    await db.collection("users").doc(userId).update({
      plan: "Pro",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("verify-payment route error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please contact support." },
      { status: 500 }
    );
  }
}
