"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { FileText, RotateCcw, Eye } from "lucide-react";

interface Attempt {
  id: string;
  videoId: string;
  userId: string;
  answers: number[];
  score: number;
  completedAt: any; // Firestore Timestamp
  videoTitle?: string;
  totalQuestions?: number;
}

export default function AttemptsLogPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        setError(null);
        // 1. Query attempts
        const attemptsRef = collection(db, "attempts");
        const q = query(attemptsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const rawAttempts: Attempt[] = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Attempt[];

        // 2. Sort by completedAt descending locally
        rawAttempts.sort((a, b) => {
          const aTime = a.completedAt?.toMillis() || 0;
          const bTime = b.completedAt?.toMillis() || 0;
          return bTime - aTime;
        });

        // 3. Resolve video info concurrently
        const enrichedAttempts = await Promise.all(
          rawAttempts.map(async (attempt) => {
            let videoTitle = "YouTube Video";
            let totalQuestions = attempt.answers.length;

            try {
              const videoSnap = await getDoc(doc(db, "videos", attempt.videoId));
              if (videoSnap.exists()) {
                videoTitle = videoSnap.data().title || "YouTube Video";
              }
              
              const quizSnap = await getDoc(doc(db, "quizzes", attempt.videoId));
              if (quizSnap.exists()) {
                const quizData = quizSnap.data();
                if (quizData.questions) {
                  totalQuestions = quizData.questions.length;
                }
              }
            } catch (err) {
              console.error(err);
            }

            return {
              ...attempt,
              videoTitle,
              totalQuestions,
            };
          })
        );

        setAttempts(enrichedAttempts);
      } catch (err: any) {
        console.error("Error retrieving attempts:", err);
        setError("Failed to retrieve attempts history log.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <svg className="animate-spin h-6 w-6 text-indigo-650" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-450 text-[10px] font-bold uppercase tracking-wider">Assembling history records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-black text-slate-900 mb-1">Attempts Log</h1>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          A historical view of all quizzes you have taken, sorted by date completed.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl text-xs text-rose-605 font-bold">
          {error}
        </div>
      )}

      {attempts.length === 0 ? (
        /* Empty State */
        <div className="p-12 bg-white border border-slate-200/60 rounded-3xl text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wide text-xs">No attempts logged yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 font-semibold">
            Head to the lessons catalog or generate page to take your first quiz.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider cursor-pointer"
          >
            Create a Quiz
          </Link>
        </div>
      ) : (
        /* Table Log */
        <div className="border border-slate-200/60 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Lesson Topic</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Completed</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {attempts.map((attempt) => {
                  const date = attempt.completedAt
                    ? attempt.completedAt.toDate().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const totalQuestions = attempt.totalQuestions || attempt.answers.length;
                  const isPassed = totalQuestions > 0 ? (attempt.score / totalQuestions) >= 0.8 : false;

                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Topic Title */}
                      <td className="px-6 py-5 max-w-xs md:max-w-md">
                        <div className="font-bold text-slate-800 line-clamp-1 mb-1.5 text-xs">
                          {attempt.videoTitle}
                        </div>
                        <span className="inline-block text-[8px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-200">
                          ID: {attempt.videoId}
                        </span>
                      </td>
                      {/* Score */}
                      <td className="px-6 py-5">
                        <span className="font-extrabold text-slate-800 text-xs">
                          {attempt.score}/{totalQuestions}
                        </span>
                      </td>
                      {/* Pass/Fail Status Badge */}
                      <td className="px-6 py-5">
                        <span
                          className={`text-[8px] px-2.5 py-0.5 rounded-full font-bold border ${
                            isPassed
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}
                        >
                          {isPassed ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-6 py-5 text-slate-400 font-medium">
                        {date}
                      </td>
                      {/* Review Link */}
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3.5">
                          <Link
                            href={`/quiz/${attempt.videoId}`}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 uppercase tracking-wider"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retake</span>
                          </Link>
                          <Link
                            href={`/quiz/${attempt.videoId}/results?attemptId=${attempt.id}`}
                            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-full transition-all flex items-center gap-1 uppercase tracking-wider"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Review</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
