/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Zap, 
  Info,
  ChevronRight,
  Lightbulb,
  Target,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ReviewResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  refinedPrompt: string;
  explanation: string;
  tips: string[];
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const reviewPrompt = async () => {
    if (!prompt.trim()) return;

    setIsReviewing(true);
    setError(null);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert Prompt Engineer. Analyze the following AI prompt and provide a detailed review. 
        
        Prompt to analyze: "${prompt}"
        
        Return the analysis in JSON format with the following structure:
        {
          "score": number (0-100),
          "strengths": string[],
          "weaknesses": string[],
          "refinedPrompt": string,
          "explanation": string,
          "tips": string[]
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              refinedPrompt: { type: Type.STRING },
              explanation: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "strengths", "weaknesses", "refinedPrompt", "explanation", "tips"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
      
      // Scroll to result after a short delay to allow animation to start
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Error reviewing prompt:", err);
      setError("Failed to analyze the prompt. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3" />
              <span>AI Prompt Optimizer</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Prompt Architect
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Transform basic instructions into powerful AI prompts. Get instant feedback, scoring, and optimized refinements.
            </p>
          </motion.div>
        </header>

        {/* Input Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
            <div className="relative bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  <span>Your Draft Prompt</span>
                </div>
                <div className="text-xs text-zinc-500">
                  {prompt.length} characters
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste your AI prompt here (e.g., 'Write a blog post about coffee')"
                className="w-full h-48 p-6 bg-transparent text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none text-lg leading-relaxed"
              />
              <div className="p-4 bg-zinc-900/30 flex justify-end">
                <button
                  onClick={reviewPrompt}
                  disabled={isReviewing || !prompt.trim()}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300",
                    isReviewing || !prompt.trim()
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95"
                  )}
                >
                  {isReviewing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Review Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-zinc-800"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * result.score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn(
                          result.score >= 80 ? "text-emerald-500" : 
                          result.score >= 50 ? "text-amber-500" : "text-red-500"
                        )}
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{result.score}</span>
                  </div>
                  <h3 className="font-semibold text-zinc-300">Efficiency Score</h3>
                  <p className="text-xs text-zinc-500 mt-1">Based on clarity, context, and constraints</p>
                </div>

                <div className="md:col-span-2 bg-[#121214] border border-zinc-800 rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-zinc-200 mb-4">
                    <Target className="w-4 h-4 text-indigo-400" />
                    Quick Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Strengths</span>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Weaknesses</span>
                      <ul className="space-y-2">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refined Prompt */}
              <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-zinc-800 bg-indigo-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Architect's Refinement</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(result.refinedPrompt)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 bg-zinc-900/20">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-200 leading-relaxed italic">
                      "{result.refinedPrompt}"
                    </p>
                  </div>
                </div>
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/40">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Why this works better</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>

              {/* Expert Tips */}
              <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6">
                <h3 className="flex items-center gap-2 font-semibold text-zinc-200 mb-6">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Pro Tips for this Prompt
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-zinc-400">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
          <p>© 2026 Prompt Architect • Powered by Gemini 3</p>
        </footer>
      </main>
    </div>
  );
}
