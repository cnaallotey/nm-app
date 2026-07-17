"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, Info } from "lucide-react";

export default function GenerateQuizPage() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep("Connecting to YouTube and extracting video transcript...");

    try {
      // Step 1: Call API to extract transcript and title
      const transcriptRes = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      if (!transcriptRes.ok) {
        let errMsg = "Failed to extract transcript from YouTube.";
        try {
          const errData = await transcriptRes.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const transcriptData = await transcriptRes.json();
      const { videoId, transcript, title } = transcriptData;

      // Step 2: Call API to generate quiz (caches if already generated)
      setLoadingStep("AI is reading the transcript and designing multiple-choice questions...");
      const quizRes = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, transcript, title }),
      });

      if (!quizRes.ok) {
        let errMsg = "Failed to generate the quiz.";
        try {
          const errData = await quizRes.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const quizData = await quizRes.json();

      setLoadingStep("Success! Launching your quiz session...");
      router.push(`/quiz/${videoId}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 mx-auto">
          <Sparkles className="w-4 h-4" />
        </div>
        <h1 className="text-xl font-display font-black text-slate-900">Generate New Quiz</h1>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Paste any YouTube URL that contains captions to automatically build a custom quiz.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow transition-shadow duration-300">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              YouTube Video Link
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={isLoading}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white text-slate-800 transition-all font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !videoUrl.trim()}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-350 disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              "Generate Quiz"
            )}
          </button>
        </form>

        {/* Loading details */}
        {isLoading && (
          <div className="mt-6 px-4 py-3 bg-indigo-50/50 border border-indigo-100/30 rounded-2xl animate-pulse">
            <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider mb-0.5">Status</p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{loadingStep}</p>
          </div>
        )}

        {/* Error handling */}
        {error && (
          <div className="mt-6 px-4 py-3 bg-rose-50/80 border border-rose-100 rounded-2xl flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] text-rose-700 font-bold uppercase tracking-wider mb-0.5">Error</p>
              <p className="text-[11px] text-rose-650 leading-relaxed font-semibold">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tips panel (No emojis, Lucide Info icon) */}
      <div className="p-6 bg-slate-100/40 border border-slate-200/50 rounded-3xl flex gap-3.5 items-start">
        <Info className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
        <div className="space-y-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">Tips for success</span>
          <ul className="list-disc pl-4 space-y-1 font-semibold leading-relaxed">
            <li>Ensure the video has captions available (auto-generated captions are supported).</li>
            <li>For videos with rich, technical transcripts (tutorials, lectures, documents), Gemini works best.</li>
            <li>Quizzes will generate 8 multiple choice questions to comprehensively test retention.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
