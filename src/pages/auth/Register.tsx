import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.agreed) e.agreed = "You must agree to continue";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setErrors({ email: "This email is already registered. Sign in instead." });
      } else {
        setErrors({ general: error.message });
      }
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/welcome", { replace: true }), 2000);
  }

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center section-padding">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Account created!</h2>
          <p className="text-muted-foreground">Taking you to your application…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center section-padding py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-heading text-3xl font-bold text-foreground">
              Aftr<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        <div className="bg-popover rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Create your Aftr account</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Full name</label>
              <input
                type="text"
                {...field("fullName")}
                placeholder="Joana Faye Beriso"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email address</label>
              <input
                type="email"
                {...field("email")}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone number</label>
              <input
                type="tel"
                {...field("phone")}
                placeholder="+34 600 000 000"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  {...field("password")}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Confirm password</label>
              <input
                type="password"
                {...field("confirmPassword")}
                placeholder="Repeat your password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to Aftr's{" "}
                  <a href="mailto:afterworkclubinternational@gmail.com" className="text-primary hover:underline">
                    terms and community guidelines
                  </a>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-destructive mt-1">{errors.agreed}</p>}
            </div>

            {errors.general && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to Aftr</Link>
        </p>
      </div>
    </div>
  );
}
