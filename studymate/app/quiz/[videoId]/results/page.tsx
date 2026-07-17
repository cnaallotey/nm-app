"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft,
  BookOpen,
  Video
} from "lucide-react";

interface Question {
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  explanation: string;
}

export default function ResultsPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswersList, setCorrectAnswersList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef guard to prevent double submit in strict mode
  const hasSubmitted = useRef(false);

  useEffect(() => {
    async function fetchAndGrade() {
      try {
        if (attemptId) {
          // Load existing attempt directly from Firestore
          const attemptSnap = await getDoc(doc(db, "attempts", attemptId));
          if (!attemptSnap.exists()) {
            throw new Error("Specified attempt record not found.");
          }
          const attemptData = attemptSnap.data();
          setUserAnswers(attemptData.answers || []);
          setScore(attemptData.score);

          // Fetch quiz details to match question list and correct answers
          const quizRes = await fetch(`/api/quiz/${videoId}`);
          if (!quizRes.ok) {
            throw new Error("Failed to load quiz data.");
          }
          const quizData = await quizRes.json();
          const quizQuestions = quizData.questions || [];
          setQuestions(quizQuestions);
          setCorrectAnswersList(quizQuestions.map((q: any) => q.correctAnswerIndex));
          return;
        }

        // No attemptId parameter in URL -> User just finished taking quiz, submit new attempt
        if (hasSubmitted.current) return;
        hasSubmitted.current = true;

        // 1. Get answers from sessionStorage
        const savedAnswers = sessionStorage.getItem(`quiz_answers_${videoId}`);
        if (!savedAnswers) {
          throw new Error("No quiz attempt found. Please take the quiz first.");
        }
        const answers = JSON.parse(savedAnswers) as number[];
        setUserAnswers(answers);

        // 2. Fetch quiz details
        const quizRes = await fetch(`/api/quiz/${videoId}`);
        if (!quizRes.ok) {
          throw new Error("Failed to load quiz data.");
        }
        const quizData = await quizRes.json();
        const quizQuestions = quizData.questions || [];
        setQuestions(quizQuestions);

        // 3. Submit and Grade
        const headers: HeadersInit = { "Content-Type": "application/json" };
        const cachedToken = localStorage.getItem("firebase_id_token");
        if (cachedToken) {
          headers["Authorization"] = `Bearer ${cachedToken}`;
        }

        const gradeRes = await fetch("/api/submit-attempt", {
          method: "POST",
          headers,
          body: JSON.stringify({ videoId, answers }),
        });

        if (!gradeRes.ok) {
          let errMsg = "Failed to grade answers.";
          try {
            const errData = await gradeRes.json();
            errMsg = errData.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }

        const gradeData = await gradeRes.json();

        setScore(gradeData.score);
        setCorrectAnswersList(gradeData.correctAnswers || []);

        // Clear sessionStorage and redirect URL to prevent submit re-trigger
        sessionStorage.removeItem(`quiz_answers_${videoId}`);
        if (gradeData.attemptId) {
          router.replace(`/quiz/${videoId}/results?attemptId=${gradeData.attemptId}`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "An error occurred while grading your quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (videoId) {
      fetchAndGrade();
    }
  }, [videoId, attemptId, router]);

  const handleRetake = () => {
    sessionStorage.removeItem(`quiz_answers_${videoId}`);
    router.push(`/quiz/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-6 w-6 text-indigo-650" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-450 text-[10px] font-bold uppercase tracking-wider">Grading your answers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-6">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-display font-bold text-slate-900 mb-2 uppercase tracking-wide text-xs">Error</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-semibold">{error}</p>
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

  const totalQuestions = questions.length;
  const rawScore = score !== null ? score : 0;
  const percentage = totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 font-sans selection:bg-indigo-650 selection:text-white antialiased pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/dashboard"
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-3.5 py-1 rounded-full uppercase tracking-wider">
            Results Sheet
          </span>
        </div>

        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-200/60 rounded-3xl p-8 mb-12 flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-shadow duration-300"
        >
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="58" strokeWidth="8" stroke="rgb(241 245 249)" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="58"
                strokeWidth="8"
                stroke="rgb(79 70 229)"
                fill="transparent"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * percentage) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-display font-black text-slate-900">{percentage}%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Score</span>
            </div>
          </div>

          <h2 className="text-base font-display font-bold text-slate-900 uppercase tracking-wide">
            You got {rawScore} out of {totalQuestions} correct!
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed font-semibold">
            {percentage >= 80 ? "Excellent retention! You've successfully passed this lesson." : "Good try! Look over the explanations below to improve."}
          </p>

          {!user && (
            <div className="mt-5 px-4 py-3 bg-indigo-50/50 border border-indigo-105 rounded-2xl max-w-xs text-[10px] font-semibold text-indigo-700 flex items-start gap-2 text-left">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-indigo-850">Sign in</span> to save your quiz history and track your learning progress over time!
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8 w-full max-w-xs">
            <button
              onClick={handleRetake}
              className="flex-grow py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] rounded-full transition-all uppercase tracking-wider cursor-pointer"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider cursor-pointer"
            >
              New Lesson
            </button>
          </div>
        </motion.div>

        {/* Detailed Question Review Layout */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Question Review</h3>
        <p className="text-[11px] text-slate-450 mb-6 font-semibold uppercase tracking-wider">Scrub through the reference lesson video on the side to verify concepts.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Column (Sticky Video Player) */}
          <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Reference Lesson</span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube Video Player"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                Use the player to check the explanation content and locate reference timestamps.
              </div>
            </div>
          </div>

          {/* Right Column (Question Review Feed) */}
          <div className="lg:col-span-3 space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const correctAnswer = correctAnswersList[idx] ?? q.correctAnswerIndex;
              const isUserCorrect = userAnswer === correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border bg-white transition-all shadow-sm ${
                    isUserCorrect ? "border-emerald-100" : "border-rose-100"
                  }`}
                >
                  {/* Question Index & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 uppercase tracking-wider ${
                        isUserCorrect
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-rose-50 border-rose-100 text-rose-600"
                      }`}
                    >
                      {isUserCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-sm font-bold text-slate-900 mb-6 leading-snug">
                    {q.question}
                  </h4>

                  {/* Options Review */}
                  <div className="space-y-3.5 mb-6">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isCorrect = correctAnswer === optIdx;

                      let optionStyle = "border-slate-200 bg-slate-50/20 text-slate-600";
                      if (isSelected) {
                        optionStyle = isUserCorrect
                          ? "border-emerald-400 bg-emerald-50/20 text-emerald-700"
                          : "border-rose-450 bg-rose-50/20 text-rose-700";
                      } else if (isCorrect) {
                        optionStyle = "border-emerald-450 bg-emerald-50/20 text-emerald-700";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`px-5 py-3 rounded-full border text-xs font-semibold flex items-center justify-between gap-4 ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {isSelected && !isUserCorrect && <span className="text-[8px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Your Answer</span>}
                          {isSelected && isUserCorrect && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Correct</span>}
                          {isCorrect && !isSelected && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Correct Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex gap-3.5 items-start">
                    <BookOpen className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">Explanation</h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
