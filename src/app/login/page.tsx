"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, BarChart3, User, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthView = "login" | "signup" | "forgot_password";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("login");
  
  // Input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();

  // Reset error/success state when switching views
  const switchView = (newView: AuthView) => {
    setView(newView);
    setError("");
    setSuccessMessage("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setError("Authentication service is not configured. Please check your environment variables.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.session) throw new Error("No session returned from authentication.");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setError("Authentication service is not configured. Please check your environment variables.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      // Supabase email confirmation might be required
      if (data.user && data.session === null) {
        setSuccessMessage("Registration successful! Please check your email inbox to confirm your account.");
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
      
      // Clear form
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setError("Authentication service is not configured. Please check your environment variables.");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?update_password=true`,
      });

      if (resetError) throw resetError;

      setSuccessMessage("Password reset instructions have been sent to your email address.");
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0a0a0f" }}
    >
      {/* Left panel - Branding and Testimonials */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0d1a 0%, #12121f 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Background orbs */}
        <div
          className="absolute top-20 left-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}
          >
            <Building2 size={20} color="white" />
          </div>
          <div>
            <span className="font-bold text-white text-xl">AgencyOS</span>
            <p className="text-xs" style={{ color: "#475569" }}>Business Management Suite</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1
            className="text-4xl font-black mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg, #f1f5f9, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Manage your agency<br />like a pro
          </h1>
          <p className="text-base mb-8" style={{ color: "#64748b" }}>
            One platform for clients, projects, invoices, expenses, and team management. Built for modern digital agencies.
          </p>
          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: <Shield size={16} />, label: "Role-based access control", color: "#6366f1" },
              { icon: <Zap size={16} />, label: "Real-time cloud sync via Supabase", color: "#10b981" },
              { icon: <BarChart3 size={16} />, label: "Advanced revenue analytics", color: "#f59e0b" },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}20`, color }}
                >
                  {icon}
                </div>
                <span className="text-sm" style={{ color: "#94a3b8" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div
          className="relative z-10 p-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm italic mb-2" style={{ color: "#94a3b8" }}>
            "AgencyOS transformed how we manage our clients and revenue. It's like having a CFO and PM in one app."
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              R
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Rohit K.</p>
              <p className="text-xs" style={{ color: "#475569" }}>Founder, DigitalEdge Studio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Interactive Forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
              <Building2 size={16} color="white" />
            </div>
            <span className="font-bold text-white">AgencyOS</span>
          </div>

          {/* ==================== LOGIN VIEW ==================== */}
          {view === "login" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-sm mb-8" style={{ color: "#475569" }}>Sign in with your Supabase account credentials</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#475569" }}>Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourdomain.com"
                      style={{ paddingLeft: "2.25rem" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium block" style={{ color: "#475569" }}>Password</label>
                    <button
                      type="button"
                      onClick={() => switchView("forgot_password")}
                      className="text-xs hover:underline cursor-pointer"
                      style={{ color: "#6366f1" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ color: "#475569", background: "transparent", border: "none" }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="p-3 rounded-xl text-xs"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                  >
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div
                    className="p-3 rounded-xl text-xs flex items-center gap-2"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
                  >
                    <CheckCircle2 size={14} />
                    {successMessage}
                  </div>
                )}

                {!isSupabaseConfigured && (
                  <div
                    className="p-3 rounded-xl text-xs"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}
                  >
                    ⚠️ Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full justify-center mt-2"
                  style={{ padding: "0.75rem", fontSize: "0.9rem" }}
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs mt-6 text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => switchView("signup")}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: "#6366f1" }}
                >
                  Create an account
                </button>
              </p>
            </div>
          )}

          {/* ==================== SIGN UP VIEW ==================== */}
          {view === "signup" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
              <p className="text-sm mb-8" style={{ color: "#475569" }}>Register and set up your premium admin profile</p>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#475569" }}>Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      style={{ paddingLeft: "2.25rem" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#475569" }}>Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourdomain.com"
                      style={{ paddingLeft: "2.25rem" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#475569" }}>Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ color: "#475569", background: "transparent", border: "none" }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="p-3 rounded-xl text-xs"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                  >
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div
                    className="p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
                  >
                    <CheckCircle2 size={14} />
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full justify-center mt-2"
                  style={{ padding: "0.75rem", fontSize: "0.9rem" }}
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Register Profile <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs mt-6 text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() => switchView("login")}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: "#6366f1" }}
                >
                  Sign In instead
                </button>
              </p>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD VIEW ==================== */}
          {view === "forgot_password" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-1">Forgot password?</h2>
              <p className="text-sm mb-8" style={{ color: "#475569" }}>No worries, we'll send you reset instructions.</p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#475569" }}>Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourdomain.com"
                      style={{ paddingLeft: "2.25rem" }}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="p-3 rounded-xl text-xs"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                  >
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div
                    className="p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
                  >
                    <CheckCircle2 size={14} />
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full justify-center mt-2"
                  style={{ padding: "0.75rem", fontSize: "0.9rem" }}
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Instructions <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs mt-6 text-slate-500">
                Back to{" "}
                <button
                  onClick={() => switchView("login")}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: "#6366f1" }}
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          <p className="text-center text-xs mt-8" style={{ color: "#334155" }}>
            © 2025 AgencyOS · Powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
