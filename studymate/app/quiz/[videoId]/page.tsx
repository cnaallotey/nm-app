"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  explanation: string;
}

export default function QuizPage({ params }: { params: Promise<{ videoId: string }> }) {
  const router = useRouter();
  const { videoId } = use(params);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quiz/${videoId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Quiz not found. Please generate the quiz from the dashboard.");
          }
          throw new Error("Failed to load the quiz.");
        }
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load the quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (videoId) {
      fetchQuiz();
    }
  }, [videoId]);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Map answers into an ordered array
    const answersArray = questions.map((_, idx) => {
      const selected = selectedAnswers[idx];
      return typeof selected === "number" ? selected : -1;
    });

    // Save selected answers in sessionStorage for the results page to score
    sessionStorage.setItem(`quiz_answers_${videoId}`, JSON.stringify(answersArray));

    // Redirect to results page
    router.push(`/quiz/${videoId}/results`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-6 w-6 text-indigo-650" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-405 text-[10px] font-bold uppercase tracking-wider">Loading quiz questions...</span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-600 mx-auto mb-6">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-display font-bold text-slate-900 mb-2 uppercase tracking-wide text-xs">Oops!</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-semibold">{error || "No quiz questions found."}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-sm hover:shadow uppercase tracking-wider"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const hasSelected = typeof selectedAnswers[currentIdx] === "number";
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-650 selection:text-white antialiased">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
              router.push("/dashboard");
            }
          }}
          className="text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Quiz</span>
        </button>
        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50/60 border border-indigo-100/50 px-3 py-1 rounded-full uppercase tracking-wider">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <div className="w-20 hidden sm:block" />
      </header>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-200/40 h-1 shrink-0">
        <div
          className="bg-indigo-600 h-1 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Body */}
      <main className="max-w-2xl mx-auto w-full px-6 py-12 flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow transition-shadow duration-300"
          >
            {/* Question Text */}
            <h2 className="text-base md:text-lg font-display font-bold text-slate-900 mb-8 leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswers[currentIdx] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full text-left px-5 py-4 rounded-full border text-xs font-bold transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/40 border-indigo-500 text-indigo-700 shadow-sm"
                        : "bg-slate-50/20 border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-650"
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "border-indigo-650 bg-indigo-650 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-slate-200/50 bg-white py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-slate-50 text-[10px] font-bold transition-all shrink-0 cursor-pointer uppercase tracking-wider"
          >
            Previous
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!hasSelected}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-350 disabled:opacity-55 text-white text-[10px] font-bold shadow-sm hover:shadow transition-all shrink-0 cursor-pointer uppercase tracking-wider"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasSelected}
              className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-[10px] font-bold transition-all shrink-0 cursor-pointer uppercase tracking-wider"
            >
              Next
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
