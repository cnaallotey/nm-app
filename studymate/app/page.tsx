"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  BookOpen, 
  Activity, 
  FileText,
  Clock,
  Layers
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleAuthAction = async () => {
    if (user) {
      router.push("/dashboard");
    } else {
      try {
        await signInWithGoogle();
        router.push("/dashboard");
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const featuresList = [
    "Unlimited Video Quizzes",
    "Instant Explanation Sheets",
    "Interactive Lessons History",
    "Score Analytics Tracking",
    "Personalized Pass Rates",
    "Self-Paced Quiz Taking",
  ];

  // Framer Motion Variants for Staggered Hero Entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Scroll Reveal Animation Variants
  const scrollRevealVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const marqueeVariants = {
    animate: {
      x: [0, -1200],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 30,
          ease: "linear" as const,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white antialiased overflow-x-hidden">
      {/* Premium glowing background layout elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-indigo-100/30 via-violet-100/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header / Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-200/50 bg-[#fafafc]/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-600/10 text-sm">
              S
            </div>
            <span className="text-lg font-display font-extrabold tracking-tight text-slate-900">
              StudyMate
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500">
            <button onClick={() => scrollToSection("problem")} className="hover:text-indigo-650 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-indigo-650 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-indigo-650 transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-indigo-650 transition-colors cursor-pointer">FAQ</button>
          </nav>
          <div>
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm hover:shadow active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={handleAuthAction}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 transition-all text-slate-705 active:scale-95 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
          <span>Active Learning for YouTube</span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 leading-[1.1] mb-6"
        >
          Turn Any YouTube Video <br className="hidden sm:inline" />
          Into a Personalized Quiz
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
        >
          Paste a video link, check your comprehension, and track your retention. Stop just watching and start truly understanding.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleAuthAction}
            className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>{user ? "Go to Dashboard" : "Get Started Free"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection("problem")}
            className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 transition-all text-slate-705 active:scale-95 cursor-pointer"
          >
            See How It Works
          </button>
        </motion.div>
        
        <motion.p 
          variants={itemVariants}
          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-6"
        >
          No credit card required. Generate up to 3 quizzes per month.
        </motion.p>
      </motion.section>

      {/* Infinite Scroll Continuous Marquee */}
      <div className="relative w-full overflow-hidden bg-indigo-50/40 border-y border-indigo-100/40 py-5 my-8">
        <motion.div
          className="flex gap-20 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-indigo-700/80"
          variants={marqueeVariants}
          animate="animate"
        >
          {[...featuresList, ...featuresList, ...featuresList].map((feat, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {feat}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Problem / Positioning Section */}
      <motion.section 
        id="problem" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 leading-tight">
              You watched it. <br />Did you actually learn it?
            </h2>
            <p className="text-slate-550 leading-relaxed text-sm md:text-base font-normal">
              Millions of people use YouTube daily to acquire technical skills. But watching a tutorial is passive. Without immediate retrieval, we forget up to 70% of new information within 24 hours. StudyMate bridges the gap by building instant quizzes directly from transcripts, checking what stuck.
            </p>
          </div>
          <div className="md:col-span-2 bg-white border border-slate-200/60 p-8 rounded-3xl text-center shadow-sm hover:shadow transition-shadow duration-300">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4 border border-indigo-100">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 uppercase tracking-wider text-[11px]">Retrieval Practice</h4>
            <p className="text-xs text-slate-555 leading-relaxed font-medium">
              Quizzing triggers memory retrieval, strengthening neural connections and doubling retention.
            </p>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200/50">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={scrollRevealVariants}
          className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 text-center mb-16"
        >
          Simple three-step learning loop
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              step: "01",
              title: "Paste video link",
              desc: "Drop in any YouTube video URL. As long as captions are available, we handle the rest."
            },
            {
              step: "02",
              title: "Generate quiz",
              desc: "Gemini extracts key concepts directly from the transcript to compile structured questions."
            },
            {
              step: "03",
              title: "Check retention",
              desc: "Complete the quiz, review scoring analytics, and read targeted explanations."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={scrollRevealVariants}
              className="p-8 rounded-3xl bg-white border border-slate-200/60 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-800 mb-6 text-xs">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3 uppercase tracking-wide text-xs">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200/50">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={scrollRevealVariants}
          className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 text-center mb-16"
        >
          Crafted for self-directed learners
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Instant generator",
              desc: "Retrieve structured multiple-choice questions instantly without manual overhead."
            },
            {
              title: "Detailed explanations",
              desc: "Review context-rich descriptions for correct answers to fix logical gaps."
            },
            {
              title: "Supports any subject",
              desc: "Programmatic lessons, tech deep dives, history, or science — if it has captions, it works."
            },
            {
              title: "Progress analytics",
              desc: "Access your attempts log, calculate pass accuracy, and track metrics."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={scrollRevealVariants}
              className="p-6 rounded-3xl bg-white border border-slate-200/60 hover:border-indigo-300 transition-all duration-300 flex items-start gap-4 shadow-sm hover:shadow"
            >
              <div className="mt-0.5 text-indigo-650 bg-indigo-50 border border-indigo-100/50 p-1.5 rounded-full shrink-0 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-xs">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            variants={scrollRevealVariants}
            className="p-6 rounded-3xl bg-slate-100/30 border border-slate-200/50 flex items-start gap-4 md:col-span-2 shadow-inner"
          >
            <div className="mt-0.5 text-slate-400 bg-slate-50 border border-slate-100 p-1.5 rounded-full shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide text-xs">Essay evaluations (coming soon)</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Provide custom written answers, and receive detailed grading reviews from AI.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200/50">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={scrollRevealVariants}
          className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 text-center mb-16"
        >
          Flexible pricing plans
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {/* Free Tier */}
          <motion.div 
            variants={scrollRevealVariants}
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all duration-300"
          >
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-2 uppercase tracking-wide text-xs">Free</h3>
              <div className="text-3xl font-black text-slate-900 mb-6">$0<span className="text-xs text-slate-400 font-normal">/month</span></div>
              <ul className="space-y-3.5 text-xs text-slate-500 font-semibold mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> 3 quizzes per month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Multiple-choice questions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> Basic score history logs</li>
              </ul>
            </div>
            <button 
              onClick={handleAuthAction} 
              className="w-full py-3 bg-slate-55 hover:bg-slate-100 border border-slate-205 text-slate-700 font-bold text-xs rounded-full transition-all uppercase tracking-wider cursor-pointer"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            variants={scrollRevealVariants}
            className="p-8 rounded-3xl bg-white border-2 border-indigo-650 shadow-md relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-bl-2xl">
              Popular
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-2 uppercase tracking-wide text-xs">Pro</h3>
              <div className="text-3xl font-black text-slate-900 mb-6">$10<span className="text-xs text-slate-400 font-normal">/month</span></div>
              <ul className="space-y-3.5 text-xs text-slate-500 font-semibold mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Unlimited quiz creation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Full attempts log progress analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Priority prompt generation speeds</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Early access to essay evaluations</li>
              </ul>
            </div>
            <button 
              onClick={handleAuthAction} 
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow active:scale-98 uppercase tracking-wider cursor-pointer"
            >
              {user ? "Go to Dashboard" : "Start Free Trial"}
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-200/50">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={scrollRevealVariants}
          className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 text-center mb-16"
        >
          FAQ
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {[
            {
              q: "Does this work on any YouTube video?",
              a: "It works on any video that has captions available (auto-generated or manual). If a video has no captions, we cannot generate a quiz from it.",
            },
            {
              q: "How accurate are the questions?",
              a: "Questions are generated directly from the video's transcript, ensuring they are grounded in the actual facts stated.",
            },
            {
              q: "Can I use this for essay-style questions?",
              a: "Essay mode is coming soon. Currently, quizzes are multiple-choice to guarantee fast responses and precise grading.",
            },
            {
              q: "Is there a free trial for Pro?",
              a: "Yes, the Free plan lets you try out the platform with up to 3 quizzes per month without a credit card. Upgrade whenever you need unlimited access.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={scrollRevealVariants}
              className="border border-slate-200/70 bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50/50 cursor-pointer"
              >
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-800">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-xs text-slate-500 border-t border-slate-100 pt-4 leading-relaxed font-semibold">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200/50 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-6">
          Stop just watching. Start testing yourself.
        </h2>
        <button
          onClick={handleAuthAction}
          className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 uppercase tracking-wider cursor-pointer"
        >
          {user ? "Go to Dashboard" : "Generate Your First Quiz"}
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <p>© {new Date().getFullYear()} StudyMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
