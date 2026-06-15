"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Redirecting to Dashboard...");
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      let message = "Invalid email or password.";
      if (err.code === "auth/user-not-found") message = "User account not found.";
      if (err.code === "auth/wrong-password") message = "Incorrect password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 font-['Montserrat']">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Mansion Background"
          className="w-full h-full object-cover opacity-20 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/50 to-[#0F0F0F]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fbbf24]">
            Nouvelle Maison Ltd
          </span>
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-white mt-2 mb-3">
            Admin Console
          </h1>
          <p className="text-sm font-light text-white/50">
            Please log in using your admin credentials.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Email Address
            </label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:border-[#fbbf24] transition-colors">
              <Mail className="w-5 h-5 text-white/40 absolute left-4" />
              <input
                type="email"
                placeholder="admin@nouvellemaison.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/30 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Password
            </label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:border-[#fbbf24] transition-colors">
              <Lock className="w-5 h-5 text-white/40 absolute left-4" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/30 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#fbbf24] hover:bg-[#D4B87E] disabled:bg-[#fbbf24]/50 disabled:cursor-not-allowed text-[#1A1A1A] rounded-lg font-semibold uppercase tracking-[0.1em] text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#fbbf24]/10 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
