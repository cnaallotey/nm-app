"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Sparkles, Trophy, XCircle, ChevronRight, Zap } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

interface Attempt {
  id: string;
  videoId: string;
  score: number;
  answers: number[];
  completedAt: any;
  videoTitle?: string;
  totalQuestions?: number;
}

export default function DashboardOverview() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    passedCount: 0,
    failedCount: 0,
    passRate: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const attemptsRef = collection(db, "attempts");
        const q = query(attemptsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const rawAttempts: Attempt[] = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Attempt[];

        // Sort by date descending
        rawAttempts.sort((a, b) => {
          const aTime = a.completedAt?.toMillis() || 0;
          const bTime = b.completedAt?.toMillis() || 0;
          return bTime - aTime;
        });

        // Group attempts by videoId to calculate unique statistics
        const videoGroups: { [videoId: string]: Attempt[] } = {};
        rawAttempts.forEach((a) => {
          if (!videoGroups[a.videoId]) {
            videoGroups[a.videoId] = [];
          }
          videoGroups[a.videoId].push(a);
        });

        let passedCount = 0;
        let failedCount = 0;

        Object.keys(videoGroups).forEach((vId) => {
          const group = videoGroups[vId];
          let highestPct = 0;
          group.forEach((a) => {
            const totalQ = a.answers.length;
            const pct = totalQ > 0 ? a.score / totalQ : 0;
            if (pct > highestPct) {
              highestPct = pct;
            }
          });

          if (highestPct >= 0.8) {
            passedCount++;
          } else {
            failedCount++;
          }
        });

        const totalUnique = passedCount + failedCount;
        const rate = totalUnique > 0 ? Math.round((passedCount / totalUnique) * 100) : 0;

        setStats({
          totalAttempts: totalUnique,
          passedCount,
          failedCount,
          passRate: rate,
        });

        // Enrich 3 most recent attempts
        const top3 = rawAttempts.slice(0, 3);
        const enriched = await Promise.all(
          top3.map(async (attempt) => {
            let videoTitle = "YouTube Video";
            let totalQuestions = attempt.answers.length;

            try {
              const vSnap = await getDoc(doc(db, "videos", attempt.videoId));
              if (vSnap.exists()) {
                videoTitle = vSnap.data().title || "YouTube Video";
              }
              const qSnap = await getDoc(doc(db, "quizzes", attempt.videoId));
              if (qSnap.exists()) {
                const qData = qSnap.data();
                if (qData.questions) {
                  totalQuestions = qData.questions.length;
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

        setRecentAttempts(enriched);
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <svg className="animate-spin h-6 w-6 text-indigo-655" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-405 text-[10px] font-bold uppercase tracking-wider">Assembling dashboard analytics...</span>
      </div>
    );
  }

  const isFreePlan = profile?.plan !== "Pro";

  return (
    <div className="space-y-10">
      {/* Welcome Block & Billing Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-slate-900 mb-1">
            Welcome back, {user?.displayName || "Learner"}!
          </h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Here is your learning progress dashboard. Keep generating quizzes to reinforce what you watch.
          </p>
        </div>

        {/* Upgrade Banner for Free Plan */}
        {isFreePlan && (
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-xs font-bold rounded-full transition-all hover:bg-indigo-100/60 uppercase tracking-wider cursor-pointer shadow-sm hover:shadow"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Unlock Pro Access</span>
          </button>
        )}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200/60 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow transition-shadow duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quizzes Taken</span>
          <span className="text-3xl font-display font-black text-slate-900 mt-4">{stats.totalAttempts}</span>
        </div>
        <div className="p-6 bg-white border border-slate-200/60 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow transition-shadow duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed Quizzes</span>
          </span>
          <span className="text-3xl font-display font-black text-emerald-600 mt-4">{stats.passedCount}</span>
        </div>
        <div className="p-6 bg-white border border-slate-200/60 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow transition-shadow duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-455 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failed Quizzes</span>
          </span>
          <span className="text-3xl font-display font-black text-rose-600 mt-4">{stats.failedCount}</span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        {/* Radial Pass Rate */}
        <div className="p-8 bg-white border border-slate-200/60 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-shadow duration-300 md:col-span-2">
          <div className="relative w-32 h-32 flex items-center justify-center mb-5">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="50" strokeWidth="8" stroke="rgb(241 245 249)" fill="transparent" />
              <circle
                cx="64"
                cy="64"
                r="50"
                strokeWidth="8"
                stroke="rgb(79 70 229)"
                fill="transparent"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * stats.passRate) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-display font-black text-slate-900">{stats.passRate}%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pass Rate</span>
            </div>
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Passing Accuracy</h3>
          <p className="text-[10px] text-slate-400 mt-1.5 max-w-[170px] leading-relaxed font-semibold">
            Goal: Score 80% or higher to pass quizzes.
          </p>
        </div>

        {/* Generate Card */}
        <div className="p-8 bg-white border border-slate-200/60 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow transition-all duration-300 md:col-span-3">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 uppercase tracking-wide">
              {isFreePlan ? "Create a new lesson quiz (Free)" : "Create a new lesson quiz (Pro)"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-semibold">
              {isFreePlan 
                ? "You are currently on the Free plan. Generate up to 3 quizzes per month, or upgrade to Pro to unlock unlimited quizzes."
                : "Enjoy unrestricted access! Paste any YouTube video and build quizzes instantly."
              }
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/dashboard/generate"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider cursor-pointer"
            >
              Generate Quiz
            </Link>
            {isFreePlan && (
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-full transition-all uppercase tracking-wider cursor-pointer"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Attempts Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Attempts</h3>
          <Link
            href="/dashboard/attempts"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider"
          >
            View All Attempts →
          </Link>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="p-12 border border-slate-200/60 bg-white rounded-3xl text-center text-slate-400 text-xs shadow-sm">
            No quiz attempts yet. Paste a link to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {recentAttempts.map((attempt) => {
              const totalQ = attempt.totalQuestions || attempt.answers.length;
              const isPassed = totalQ > 0 ? (attempt.score / totalQ) >= 0.8 : false;
              const date = attempt.completedAt
                ? attempt.completedAt.toDate().toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              return (
                <div
                  key={attempt.id}
                  className="p-5 bg-white border border-slate-200/60 hover:border-slate-350 transition-all rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate max-w-sm md:max-w-md">
                      {attempt.videoTitle}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{date}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-sm text-slate-650">
                      {attempt.score}/{totalQ}
                    </span>
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border ${
                        isPassed
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      {isPassed ? "PASS" : "FAIL"}
                    </span>
                    <Link
                      href={`/quiz/${attempt.videoId}/results?attemptId=${attempt.id}`}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upgrade checkout modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
