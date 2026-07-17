"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { MessageSquare, X, Send, AlertTriangle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "improvement">("improvement");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null; // Only authenticated users can leave feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        email: user.email || "anonymous@example.com",
        displayName: user.displayName || "Anonymous",
        type: feedbackType,
        message: message.trim(),
        status: "new",
        createdAt: new Date()
      });

      setSubmitted(true);
      setMessage("");
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-80 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-3xl p-5 shadow-lg overflow-hidden flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Submit Feedback</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Feedback Submitted</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Thank you for helping us improve StudyMate!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200/60 p-1 rounded-full">
                  <button
                    type="button"
                    onClick={() => setFeedbackType("improvement")}
                    className={`py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      feedbackType === "improvement"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Idea</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType("bug")}
                    className={`py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      feedbackType === "bug"
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Bug</span>
                  </button>
                </div>

                {/* Message input */}
                <div className="space-y-1">
                  <textarea
                    rows={4}
                    placeholder={
                      feedbackType === "bug"
                        ? "Describe the issue or error you encountered..."
                        : "Share your idea, suggestions, or requests..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-205 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white text-slate-800 transition-all font-semibold resize-none"
                  />
                </div>

                {error && (
                  <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider px-1">
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-[10px] rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : (
                    <>
                      <span>Submit</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-indigo-650 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-indigo-500/30"
        title="Leave Feedback"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}
