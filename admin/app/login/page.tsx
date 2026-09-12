"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4 relative overflow-hidden">
      {/* Soft mint atmospheric ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-mint-light rounded-full blur-[100px] opacity-70" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-mint/10 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-white/95 backdrop-blur-xl border border-border rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(37,114,85,0.12)]">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-light to-mint/10 border border-mint-border text-mint mb-4 shadow-xs">
              <Lock className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-mint mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Cresol Jewelry</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Admin Portal</h1>
            <p className="text-xs text-text-secondary mt-1 text-center">
              Please enter your password to access the management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-text-secondary mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl bg-[#fafcfb] border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white focus:border-mint focus:ring-2 focus:ring-mint/15 transition-all"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-white hover:bg-mint-dark transition-all duration-200 shadow-xs hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
