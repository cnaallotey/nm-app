"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Sparkles,
  History,
  LogOut,
  Lock,
  Shield,
  CreditCard,
} from "lucide-react";
import FeedbackWidget from "@/components/FeedbackWidget";
import CheckoutModal from "@/components/CheckoutModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, isAdmin, signInWithGoogle, logout } = useAuth();
  const pathname = usePathname();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Validating session...</span>
        </div>
      </div>
    );
  }

  // Auth Protection Wall
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafc] text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white antialiased">
        <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
            ← Home
          </Link>
          <span className="text-lg font-display font-extrabold tracking-tight text-slate-900">
            StudyMate
          </span>
          <div className="w-16" />
        </header>

        <main className="max-w-md mx-auto w-full px-6 py-20 flex-grow flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm w-full"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 mx-auto mb-6">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-display font-bold text-slate-900 mb-2 uppercase tracking-wide">Access Protected</h2>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-semibold">
              Please sign in with Google to enter your dashboard, track quiz scores, and generate learning lessons.
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              Sign In with Google
            </button>
          </motion.div>
        </main>

        <footer className="py-6 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-200/50 bg-white">
          <p>© {new Date().getFullYear()} StudyMate. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: BarChart3 },
    { name: "Lessons Catalog", path: "/dashboard/lessons", icon: BookOpen },
    { name: "Generate New", path: "/dashboard/generate", icon: Sparkles },
    { name: "Attempts Log", path: "/dashboard/attempts", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col md:flex-row antialiased font-sans relative">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-200/60 bg-white flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-sm text-xs">
                S
              </div>
              <span className="text-base font-display font-extrabold tracking-tight text-slate-900">
                StudyMate
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive
                      ? "bg-indigo-50/60 border-indigo-100/50 text-indigo-700 font-extrabold"
                      : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Admin Panel — only visible to charlesallotey1995@gmail.com */}
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  pathname === "/dashboard/admin"
                    ? "bg-amber-50/60 border-amber-100/50 text-amber-800 font-extrabold"
                    : "border-transparent text-amber-600 hover:bg-amber-50/30"
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Sidebar Footer — User Card */}
        <div className="p-4 border-t border-slate-100 bg-[#fafafc]/50 space-y-3">
          <div className="bg-white border border-slate-200/65 p-3 rounded-2xl shadow-sm space-y-2.5">
            {/* Avatar + Name + Sign Out */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[9px] text-white shrink-0 shadow-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="truncate text-xs font-bold text-slate-700">
                  {user.displayName || "User"}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all active:scale-95 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>

            {/* Plan Status */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Plan</span>
              {profile?.plan === "Pro" ? (
                <span className="text-[8px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 border border-indigo-100 text-indigo-700">
                  PRO MEMBER
                </span>
              ) : (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="text-[8px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-2.5 h-2.5" />
                  <span>UPGRADE TO PRO</span>
                </button>
              )}
            </div>

            {/* Admin badge (no toggle — purely email-gated) */}
            {isAdmin && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Access</span>
                <span className="text-[8px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 border border-amber-100 text-amber-700 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  ADMIN
                </span>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="block text-center text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 overflow-y-auto px-6 py-8 md:px-10 md:py-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Global floating feedback widget */}
      <FeedbackWidget />

      {/* Paystack billing modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
