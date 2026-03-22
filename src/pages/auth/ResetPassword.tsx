import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [validLink, setValidLink] = useState<boolean | null>(null);

  // Supabase puts the session in the URL hash when the user clicks
  // the reset link. We need to detect this and confirm the session.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidLink(true);
      }
    });

    // Also check if there's already a valid session from the link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidLink(true);
      else {
        // Give it a moment for the hash to be processed
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            setValidLink(!!session);
          });
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/dashboard", { replace: true }), 2500);
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

          {/* Loading / checking link */}
          {validLink === null && (
            <div className="text-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Verifying your link…</p>
            </div>
          )}

          {/* Invalid or expired link */}
          {validLink === false && (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                Link expired or invalid
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Password reset links expire after 1 hour. Please request a new one.
              </p>
              <Link to="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Request a new link →
                </Button>
              </Link>
            </div>
          )}

          {/* Set new password form */}
          {validLink === true && !done && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                Set a new password
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Choose a strong password for your Aftr account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
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

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
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
                  {loading ? "Updating…" : "Update password"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            </>
          )}

          {/* Success */}
          {done && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-olive mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Password updated!
              </h2>
              <p className="text-sm text-muted-foreground">
                Taking you to your dashboard…
              </p>
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
