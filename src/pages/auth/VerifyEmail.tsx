import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// This page handles three scenarios:
// 1. User arrives from a valid email confirmation link → auto-confirms, redirects
// 2. User arrives from an expired link → shows resend option
// 3. User just registered and needs to verify → prompt with resend option

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status,   setStatus]   = useState<"checking" | "success" | "expired" | "waiting">("checking");
  const [email,    setEmail]    = useState((location.state as any)?.email ?? "");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    // Check if Supabase put a confirmation token in the URL
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);

    const hasToken = hash.includes("access_token") ||
                     hash.includes("type=signup") ||
                     params.get("token_hash") ||
                     params.get("type") === "signup";

    if (hasToken) {
      // Supabase processes the hash automatically via onAuthStateChange
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            setStatus("success");
            setTimeout(() => navigate("/onboarding", { replace: true }), 2000);
          }
        }
      );

      // Also check immediately
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email_confirmed_at) {
          setStatus("success");
          setTimeout(() => navigate("/onboarding", { replace: true }), 2000);
        } else if (hasToken) {
          // Token in URL but not confirmed — likely expired
          setStatus("expired");
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // No token — user arrived here manually or was redirected after registration
      // Pre-fill email from current session if any
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) setEmail(user.email);
        if (user?.email_confirmed_at) {
          // Already verified — send to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          setStatus("waiting");
        }
      });
    }
  }, []);

  async function resendVerification() {
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setSending(true);

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });

    setSending(false);

    if (resendError) {
      // "User already confirmed" means they can just log in
      if (resendError.message.toLowerCase().includes("already confirmed")) {
        navigate("/login");
        return;
      }
      setError(resendError.message);
      return;
    }

    setSent(true);
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

          {/* ── Checking ── */}
          {status === "checking" && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Verifying your email…</p>
            </div>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-olive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Email verified! 🎉
              </h2>
              <p className="text-sm text-muted-foreground">
                Taking you to Aftr now…
              </p>
            </div>
          )}

          {/* ── Expired link ── */}
          {status === "expired" && !sent && (
            <>
              <div className="flex items-start gap-3 bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-4 mb-6">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Verification link expired</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Links expire after 24 hours. Enter your email below and we'll send a new one.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Your email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  onClick={resendVerification}
                  disabled={sending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  {sending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</>
                    : <>Resend verification email <ArrowRight className="w-4 h-4 ml-1" /></>
                  }
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Already verified?{" "}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Sign in →
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ── Waiting to verify (arrived after registration) ── */}
          {status === "waiting" && !sent && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground">
                  We sent a verification link to
                  {email && <><br /><strong className="text-foreground">{email}</strong></>}.
                  Click it to activate your account.
                </p>
              </div>

              <div
                className="rounded-xl px-4 py-3 mb-6 text-sm"
                style={{ background: "rgba(184,92,36,0.06)", borderLeft: "3px solid #b85c24" }}
              >
                <p className="font-semibold text-foreground mb-1">Didn't get it?</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you used the right email</li>
                  <li>• The link is valid for 24 hours</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Resend to a different email?
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  onClick={resendVerification}
                  disabled={sending}
                  variant="outline"
                  className="w-full"
                >
                  {sending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</>
                    : "Resend verification email"
                  }
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Already verified?{" "}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Sign in →
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ── Sent successfully ── */}
          {sent && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-olive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                New link sent!
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                We sent a fresh verification link to:
              </p>
              <p className="font-semibold text-foreground mb-6">{email}</p>
              <p className="text-xs text-muted-foreground mb-6">
                This link is valid for 24 hours. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Send again
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
