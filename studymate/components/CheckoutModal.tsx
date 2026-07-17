"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { X, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Amount in the smallest currency unit.
// Paystack processes NGN in kobo (1 NGN = 100 kobo).
// Change PLAN_AMOUNT_KOBO and PLAN_LABEL to match your pricing.
const PLAN_AMOUNT_KOBO = 500000; // ₦5,000
const PLAN_CURRENCY = "NGN";
const PLAN_LABEL = "₦5,000 / month";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, any>;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `SM-${timestamp}-${random}`;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { user } = useAuth();
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Dynamically load Paystack inline JS once
  useEffect(() => {
    if (scriptRef.current || typeof window === "undefined") return;

    const existingScript = document.getElementById("paystack-inline-js");
    if (existingScript) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () =>
      setError("Failed to load payment SDK. Please check your internet connection.");
    document.body.appendChild(script);
    scriptRef.current = script;
  }, []);

  if (!isOpen || !user) return null;

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const isKeyConfigured = publicKey && !publicKey.includes("PASTE_YOUR");

  const handlePay = async () => {
    setError(null);

    if (!isKeyConfigured) {
      setError(
        "Paystack public key is not configured. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to .env.local and restart the server."
      );
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      setError("Payment SDK is still loading. Please wait a moment and try again.");
      return;
    }

    const reference = generateReference();

    const handler = window.PaystackPop.setup({
      key: publicKey!,
      email: user.email!,
      amount: PLAN_AMOUNT_KOBO,
      currency: PLAN_CURRENCY,
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: "User ID", variable_name: "user_id", value: user.uid },
          { display_name: "Display Name", variable_name: "display_name", value: user.displayName || "" },
          { display_name: "Plan", variable_name: "plan", value: "Pro" },
        ],
      },
      onClose: () => {
        if (!success) {
          setIsProcessing(false);
          setError("Payment window closed before completion.");
        }
      },
      callback: async (response) => {
        setIsProcessing(true);
        setError(null);

        try {
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: response.reference,
              userId: user.uid,
              email: user.email,
              displayName: user.displayName,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || "Payment verification failed.");
          }

          setSuccess(true);
        } catch (err: any) {
          console.error("Payment verification error:", err);
          setError(
            err.message ||
              "Your payment was received but we couldn't activate your plan. Please contact support with your reference: " +
                response.reference
          );
        } finally {
          setIsProcessing(false);
        }
      },
    });

    handler.openIframe();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isProcessing && onClose()}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: "spring", damping: 26, stiffness: 360 }}
          className="relative w-full max-w-md bg-white border border-slate-200/60 rounded-3xl p-7 md:p-9 shadow-2xl mx-4"
        >
          {/* Close */}
          {!isProcessing && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {success ? (
            /* ── Success ── */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">
                  Subscription Active
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Your account has been upgraded to StudyMate Pro. Enjoy unlimited quiz generation and priority features.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all uppercase tracking-wider shadow-sm hover:shadow cursor-pointer"
              >
                Return to Dashboard
              </button>
            </motion.div>
          ) : (
            /* ── Upgrade form ── */
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h3 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">
                  Upgrade to Pro
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Get unlimited quiz generations, priority speeds, and detailed analytics for {PLAN_LABEL}.
                </p>
              </div>

              {/* Plan summary card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</span>
                  <span className="text-xs font-bold text-indigo-700">StudyMate Pro</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed Monthly</span>
                  <span className="text-lg font-display font-black text-slate-900">{PLAN_LABEL}</span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-rose-600 font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isProcessing || !paystackLoaded}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying Payment...
                  </>
                ) : !paystackLoaded ? (
                  "Loading payment SDK..."
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Pay Securely with Paystack
                  </>
                )}
              </button>

              <div className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Secured by Paystack · SSL Encrypted
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
