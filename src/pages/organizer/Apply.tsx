import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMyApplication, PLAN_PRICES, type SubscriptionPlan } from "@/lib/supabase";
import { useRequireAuth } from "@/hooks/useAuth";

const EVENT_TYPES = [
  "Social / Meetups",
  "Language exchange",
  "Tech & Digital",
  "Cultural & Arts",
  "Outdoor & Sports",
  "Workshops",
  "Other",
];

const STEPS = ["About you", "Your events", "Why Aftr"];

export default function OrganizerApply() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useRequireAuth();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    instagram: "",
    linkedin: "",
    website: "",
    nationality: "",
    bio: "",
    eventTypes: [] as string[],
    otherType: "",
    experience: "",
    socialProof: "",
    whyAftr: "",
    plan: "monthly" as SubscriptionPlan,
    agreedScreening: false,
    agreedOnboarding: false,
  });

  useEffect(() => {
    if (!authLoading && user) {
      // Pre-fill from profile
      if (profile) {
        setForm(f => ({
          ...f,
          fullName: profile.full_name || "",
          phone: profile.phone || "",
          instagram: profile.instagram_handle || "",
          linkedin: profile.linkedin_url || "",
          nationality: profile.nationality || "",
        }));
      }
      // Check for existing application
      getMyApplication().then(app => {
        if (app) navigate("/organizer/status", { replace: true });
        else setChecking(false);
      });
    }
  }, [authLoading, user, profile]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  function toggleEventType(t: string) {
    setForm(f => ({
      ...f,
      eventTypes: f.eventTypes.includes(t)
        ? f.eventTypes.filter(x => x !== t)
        : [...f.eventTypes, t],
    }));
  }

  function validateStep(): string {
    if (step === 0) {
      if (!form.fullName.trim()) return "Full name is required";
      if (!form.phone.trim()) return "Phone number is required";
      if (!form.nationality.trim()) return "Nationality is required";
      if (!form.bio.trim()) return "Short bio is required";
    }
    if (step === 1) {
      if (form.eventTypes.length === 0) return "Select at least one event type";
      if (form.experience.length < 50) return "Please describe your experience (min 50 characters)";
    }
    if (step === 2) {
      if (form.whyAftr.length < 50) return "Please tell us why you want to join (min 50 characters)";
      if (!form.agreedScreening) return "Please confirm you understand the screening process";
      if (!form.agreedOnboarding) return "Please confirm you'll attend an onboarding session";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  }

  async function submit() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);

    const types = form.eventTypes.includes("Other") && form.otherType
      ? [...form.eventTypes.filter(t => t !== "Other"), form.otherType]
      : form.eventTypes;

    const { error: dbError } = await supabase.from("organizer_applications").insert({
      user_id: user.id,
      full_name: form.fullName,
      email: user.email,
      phone: form.phone,
      instagram_handle: form.instagram || null,
      linkedin_url: form.linkedin || null,
      website: form.website || null,
      bio: form.bio,
      nationality: form.nationality,
      event_types: types,
      experience: form.experience,
      social_proof: form.socialProof || null,
      why_aftr: form.whyAftr,
      preferred_plan: form.plan,
    });

    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong. Please try again or email us.");
      return;
    }

    navigate("/organizer/status", { replace: true });
  }

  const planOptions: Array<{ key: SubscriptionPlan; popular?: boolean }> = [
    { key: "monthly" },
    { key: "biannual", popular: true },
    { key: "annual" },
  ];

  const selectedPlan = PLAN_PRICES[form.plan];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-popover sticky top-0 z-10">
        <div className="max-w-6xl mx-auto section-padding h-16 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-foreground">
            Aftr<span className="text-primary">.</span>
          </Link>
          <div className="text-sm text-muted-foreground">Organizer Application</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto section-padding py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 sm:w-16 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-popover rounded-2xl border border-border p-8">

              {/* Step 0 — About You */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-1">About you</h2>
                    <p className="text-muted-foreground text-sm">Tell us who you are</p>
                  </div>
                  {[
                    { label: "Full name", key: "fullName", placeholder: "Your full name", required: true },
                    { label: "Phone number", key: "phone", placeholder: "+34 600 000 000", required: true },
                    { label: "Instagram handle", key: "instagram", placeholder: "@yourhandle", required: false },
                    { label: "LinkedIn URL", key: "linkedin", placeholder: "https://linkedin.com/in/...", required: false },
                    { label: "Personal website", key: "website", placeholder: "https://yoursite.com", required: false },
                    { label: "Nationality", key: "nationality", placeholder: "e.g. Spanish, British, Colombian…", required: true },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {f.label} {f.required && <span className="text-primary">*</span>}
                      </label>
                      <input
                        type="text"
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-foreground">
                        Short bio <span className="text-primary">*</span>
                      </label>
                      <span className="text-xs text-muted-foreground">{form.bio.length}/300</span>
                    </div>
                    <textarea
                      value={form.bio}
                      onChange={e => e.target.value.length <= 300 && setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Tell us about yourself in a few sentences..."
                      rows={4}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 1 — Your Events */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Your events</h2>
                    <p className="text-muted-foreground text-sm">Tell us about your experience</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      What types of events do you organize? <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {EVENT_TYPES.map(t => (
                        <label key={t} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                          form.eventTypes.includes(t)
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40"
                        }`}>
                          <input
                            type="checkbox"
                            checked={form.eventTypes.includes(t)}
                            onChange={() => toggleEventType(t)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm font-medium">{t}</span>
                        </label>
                      ))}
                    </div>
                    {form.eventTypes.includes("Other") && (
                      <input
                        type="text"
                        value={form.otherType}
                        onChange={e => setForm(f => ({ ...f, otherType: e.target.value }))}
                        placeholder="Describe the event type..."
                        className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Describe your experience organizing events <span className="text-primary">*</span>
                    </label>
                    <textarea
                      value={form.experience}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      placeholder="Tell us about events you've organized, how many people attended, what worked well..."
                      rows={5}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{form.experience.length} characters (min 50)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Links to past events, photos, or social proof
                      <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                    </label>
                    <textarea
                      value={form.socialProof}
                      onChange={e => setForm(f => ({ ...f, socialProof: e.target.value }))}
                      placeholder="Instagram posts, Facebook event links, photos, articles..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 — Why Aftr */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Why Aftr?</h2>
                    <p className="text-muted-foreground text-sm">Help us understand your goals</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Why do you want to be a Verified Aftr Organizer? <span className="text-primary">*</span>
                    </label>
                    <textarea
                      value={form.whyAftr}
                      onChange={e => setForm(f => ({ ...f, whyAftr: e.target.value }))}
                      placeholder="What are your goals? What kind of events do you want to run through Aftr? What do you bring to the community?"
                      rows={5}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{form.whyAftr.length} characters (min 50)</p>
                  </div>

                  {/* Plan selector */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Choose your subscription plan <span className="text-primary">*</span>
                    </label>
                    <div className="space-y-3">
                      {planOptions.map(({ key, popular }) => {
                        const p = PLAN_PRICES[key];
                        return (
                          <label key={key} className={`flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all ${
                            form.plan === key
                              ? "border-primary bg-primary/5"
                              : "border-border bg-background hover:border-primary/40"
                          }`}>
                            <input
                              type="radio"
                              name="plan"
                              value={key}
                              checked={form.plan === key}
                              onChange={() => setForm(f => ({ ...f, plan: key }))}
                              className="w-4 h-4 text-primary"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{p.label}</span>
                                {popular && (
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: "hsl(38 95% 64%)", color: "hsl(20 12% 16%)" }}>
                                    Popular
                                  </span>
                                )}
                                {p.saving && (
                                  <span className="text-xs font-semibold text-olive">{p.saving}</span>
                                )}
                              </div>
                            </div>
                            <span className="font-heading text-lg font-bold text-primary">€{p.euros}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-3">
                    {[
                      {
                        key: "agreedScreening",
                        text: "I understand the application requires a screening call with the Aftr team before activation"
                      },
                      {
                        key: "agreedOnboarding",
                        text: "I commit to attending at least one onboarding session after approval"
                      },
                    ].map(({ key, text }) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(form as any)[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 rounded border-border text-primary"
                        />
                        <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {step > 0 ? (
                  <Button variant="outline" onClick={() => { setStep(s => s - 1); setError(""); }}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                ) : <div />}

                {step < 2 ? (
                  <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={submit} disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {submitting ? "Submitting…" : "Submit application"}
                    {!submitting && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* What happens next */}
            <div className="bg-popover rounded-2xl border border-border p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">What happens next?</h3>
              <div className="space-y-4">
                {[
                  { icon: "📝", text: "We review your application (1–3 business days)" },
                  { icon: "📞", text: "We book a 30-min screening call with you" },
                  { icon: "✅", text: "If approved, we send payment instructions" },
                  { icon: "💳", text: "You pay via Bizum or bank transfer" },
                  { icon: "🎓", text: "You attend one free onboarding session" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing summary */}
            <div className="bg-popover rounded-2xl border border-border p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Selected plan</h3>
              <div className="text-center py-3">
                <div className="font-heading text-3xl font-bold text-primary">€{selectedPlan.euros}</div>
                <div className="text-sm text-muted-foreground mt-1">{selectedPlan.label}</div>
                {selectedPlan.saving && (
                  <div className="text-xs font-semibold text-olive mt-1">{selectedPlan.saving}</div>
                )}
              </div>
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-xs text-muted-foreground text-center">
                  Payment only required after approval. Via Bizum or bank transfer.
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-muted rounded-xl px-5 py-4 text-sm text-center">
              <p className="text-muted-foreground mb-2">Questions about the program?</p>
              <a
                href="mailto:afterworkclubinternational@gmail.com"
                className="text-primary font-semibold hover:underline"
              >
                Email us →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
