import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Login handles three views inline:
// "login"  → normal sign-in form
// "reset"  → forgot password (enter email → Supabase sends reset link)
// "sent"   → confirmation that the email was sent

type View = "login" | "reset" | "sent";

export default function Login() {
  const navigate = useNavigate();

  const [view,     setView]     = useState<View>("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // ── Sign in ──────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes("Invalid login credentials")) {
        setError("Wrong email or password. Please try again.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Please check your inbox and verify your email before signing in.");
      } else {
        setError(authError.message);
      }
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, is_verified_organizer")
        .eq("id", data.user.id)
        .single();

      // Always go to dashboard — it handles role-based routing internally
      navigate("/dashboard", { replace: true });
    }
  }

  // ── Forgot password ──────────────────────────────────────────

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);

    // Supabase sends a password reset email.
    // The link in the email will redirect to /reset-password (handled below).
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setView("sent");
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-heading text-3xl font-bold text-foreground">
              Aftr<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        <div className="bg-popover rounded-2xl border border-border p-8 shadow-sm">

          {/* ── VIEW: Login ── */}
          {view === "login" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Register →
                </Link>
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-foreground">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setError(""); setView("reset"); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Signing in…" : "Sign in"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            </>
          )}

          {/* ── VIEW: Reset password ── */}
          {view === "reset" && (
            <>
              <button
                onClick={() => { setError(""); setView("login"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>

              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
                Reset your password
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                Enter your email and we'll send you a link to set a new password.
              </p>

              <form onSubmit={handleResetRequest} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Sending…" : "Send reset link"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            </>
          )}

          {/* ── VIEW: Email sent ── */}
          {view === "sent" && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-olive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                We sent a password reset link to:
              </p>
              <p className="font-semibold text-foreground mb-6">{email}</p>
              <p className="text-xs text-muted-foreground mb-8">
                Click the link in the email to set a new password. It expires in 1 hour.
                If you don't see it, check your spam folder.
              </p>
              <button
                onClick={() => { setView("login"); setError(""); }}
                className="text-sm text-primary font-semibold hover:underline"
              >
                ← Back to sign in
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to Aftr</Link>
        </p>
      </div>
    </div>
  );
}
