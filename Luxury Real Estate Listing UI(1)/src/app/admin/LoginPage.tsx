import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { KeyRound, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(token.trim());
    setLoading(false);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid token. Ensure it has repo access.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-7 h-7 text-[#C9A96E]" />
          </div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-white mb-2">
            Admin Access
          </h1>
          <p className="font-['Montserrat'] text-sm text-white/50">
            Enter your GitHub Personal Access Token to manage properties
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="token"
              className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
            >
              GitHub Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              required
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
            />
            <p className="font-['Montserrat'] text-[10px] text-white/30 mt-2">
              Requires <code className="text-[#C9A96E]/60">repo</code> scope
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-['Montserrat'] text-xs">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full px-8 py-4 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
