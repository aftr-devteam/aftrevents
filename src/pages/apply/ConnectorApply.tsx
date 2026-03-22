import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useRequireAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AftrLogo from "@/components/AftrLogo";

const AFTR_FORMATS = [
  { key: "chat",    labelEn: "Chat & Mingle",     labelEs: "Chat & Mingle",     descEn: "Weekly social mixers",              descEs: "Mezcladores sociales semanales" },
  { key: "digital", labelEn: "Digital Builders",  labelEs: "Digital Builders",  descEn: "Monthly tech & startup meetup",     descEs: "Encuentro mensual tech & startups" },
  { key: "lingo",   labelEn: "Lingo Connect",     labelEs: "Lingo Connect",     descEn: "Weekly language exchange",          descEs: "Intercambio de idiomas semanal" },
  { key: "hub",     labelEn: "Hub Cultural",      labelEs: "Hub Cultural",      descEn: "Monthly arts & culture events",     descEs: "Eventos de arte y cultura mensuales" },
  { key: "unplug",  labelEn: "Unplug & Play",     labelEs: "Unplug & Play",     descEn: "Outdoor & active adventures",       descEs: "Aventuras al aire libre" },
];

const AVAILABILITY = [
  { key: "weekdays",  labelEn: "Weekday evenings",   labelEs: "Tardes entre semana" },
  { key: "weekends",  labelEn: "Weekends",            labelEs: "Fines de semana" },
  { key: "flexible",  labelEn: "Flexible",            labelEs: "Flexible" },
];

const STEPS = [
  { en: "About you",   es: "Sobre ti" },
  { en: "Your hosting", es: "Tu hosting" },
  { en: "Confirm",     es: "Confirmar" },
];

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function ConnectorApply() {
  const { t, lang }   = useLang();
  const navigate       = useNavigate();
  const { user, profile, loading: authLoading } = useRequireAuth();

  const [step,       setStep]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [done,       setDone]       = useState(false);

  const [form, setForm] = useState({
    fullName:      "",
    phone:         "",
    bio:           "",
    instagram:     "",
    linkedin:      "",
    website:       "",
    languages:     [] as string[],
    langInput:     "",
    eventFormats:  [] as string[],
    whyConnector:  "",
    availability:  "",
    agreedOnboarding: false,
  });

  useEffect(() => {
    if (!authLoading && profile) {
      setForm(f => ({
        ...f,
        fullName:  profile.full_name    ?? "",
        phone:     profile.phone        ?? "",
        instagram: profile.instagram_handle ?? "",
        linkedin:  profile.linkedin_url ?? "",
      }));
    }
  }, [authLoading, profile]);

  function toggleFormat(key: string) {
    setForm(f => ({
      ...f,
      eventFormats: f.eventFormats.includes(key)
        ? f.eventFormats.filter(k => k !== key)
        : [...f.eventFormats, key],
    }));
  }

  function addLanguage() {
    const lang = form.langInput.trim();
    if (lang && !form.languages.includes(lang)) {
      setForm(f => ({ ...f, languages: [...f.languages, lang], langInput: "" }));
    }
  }

  function validate(): string {
    if (step === 0) {
      if (!form.fullName.trim()) return t("Full name is required.", "El nombre completo es obligatorio.");
      if (!form.bio.trim()) return t("Please write a short bio.", "Por favor escribe una bio breve.");
    }
    if (step === 1) {
      if (form.eventFormats.length === 0) return t("Select at least one event format.", "Selecciona al menos un formato de evento.");
      if (!form.whyConnector.trim() || form.whyConnector.length < 50)
        return t("Tell us why (min 50 characters).", "Cuéntanos por qué (mín. 50 caracteres).");
      if (!form.availability) return t("Please select your availability.", "Por favor selecciona tu disponibilidad.");
    }
    if (step === 2) {
      if (!form.agreedOnboarding) return t("Please confirm the onboarding session.", "Por favor confirma la sesión de onboarding.");
    }
    return "";
  }

  function next() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  }

  async function submit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);

    const { error: dbErr } = await supabase.from("connector_applications").insert({
      user_id:      user!.id,
      full_name:    form.fullName,
      email:        user!.email,
      phone:        form.phone   || null,
      bio:          form.bio,
      why_connector: form.whyConnector,
      event_formats: form.eventFormats,
      availability:  form.availability || null,
      instagram:    form.instagram || null,
      linkedin:     form.linkedin  || null,
      website:      form.website   || null,
      languages:    form.languages.length > 0 ? form.languages : null,
    });

    setSubmitting(false);
    if (dbErr) { setError(t("Something went wrong. Please try again.", "Algo salió mal. Inténtalo de nuevo.")); return; }
    setDone(true);
  }

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-background flex items-center justify-center section-padding">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
          {t("Application submitted!", "¡Solicitud enviada!")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t(
            "The Aftr team will review your application and get back to you within 3 business days.",
            "El equipo de Aftr revisará tu solicitud y se pondrá en contacto en 3 días hábiles."
          )}
        </p>
        <Link to="/dashboard">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t("Back to dashboard", "Volver al dashboard")} →
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-popover">
        <div className="max-w-2xl mx-auto section-padding h-16 flex items-center justify-between">
          <Link to="/"><AftrLogo className="h-6 w-auto text-foreground" /></Link>
          <div className="text-sm text-muted-foreground">
            {t("Connector Application", "Solicitud Connector")}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto section-padding py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? "bg-olive text-white" : i === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {lang === "en" ? s.en : s.es}
              </span>
              {i < STEPS.length - 1 && <div className={`h-px w-8 sm:w-12 ${i < step ? "bg-olive" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-popover rounded-2xl border border-border p-8">

          {/* Step 0 — About you */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">{t("About you", "Sobre ti")}</h2>
                <p className="text-muted-foreground text-sm">{t("Tell us who you are", "Cuéntanos quién eres")}</p>
              </div>
              {[
                { label: t("Full name", "Nombre completo"),   key: "fullName",  type: "text",  required: true,  placeholder: "Your full name" },
                { label: t("Phone number", "Teléfono"),       key: "phone",     type: "tel",   required: false, placeholder: "+34 600 000 000" },
                { label: t("Instagram", "Instagram"),         key: "instagram", type: "text",  required: false, placeholder: "@yourhandle" },
                { label: t("LinkedIn", "LinkedIn"),           key: "linkedin",  type: "url",   required: false, placeholder: "https://linkedin.com/in/..." },
                { label: t("Website", "Sitio web"),           key: "website",   type: "url",   required: false, placeholder: "https://yoursite.com" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {f.label} {f.required && <span className="text-primary">*</span>}
                  </label>
                  <input type={f.type} placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("Short bio", "Bio breve")} <span className="text-primary">*</span>
                </label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={4} placeholder={t("Tell us about yourself…", "Cuéntanos sobre ti…")}
                  className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("Languages you speak", "Idiomas que hablas")}
                </label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={form.langInput}
                    onChange={e => setForm(f => ({ ...f, langInput: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    placeholder={t("e.g. English, Spanish…", "ej. Inglés, Español…")}
                    className={`${inputCls} flex-1`} />
                  <Button type="button" onClick={addLanguage} variant="outline" size="sm" className="flex-shrink-0">
                    {t("Add", "Añadir")}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.languages.map(l => (
                    <span key={l} className="text-xs px-3 py-1.5 rounded-full bg-muted text-foreground flex items-center gap-1.5">
                      {l}
                      <button onClick={() => setForm(f => ({ ...f, languages: f.languages.filter(x => x !== l) }))}
                        className="text-muted-foreground hover:text-foreground">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Hosting */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">{t("Your hosting", "Tu hosting")}</h2>
                <p className="text-muted-foreground text-sm">{t("Which Aftr events would you like to host?", "¿Qué eventos de Aftr te gustaría organizar?")}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  {t("Event formats", "Formatos de eventos")} <span className="text-primary">*</span>
                </label>
                <div className="space-y-2">
                  {AFTR_FORMATS.map(f => (
                    <label key={f.key} className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                      form.eventFormats.includes(f.key)
                        ? "border-olive bg-olive/5 text-foreground"
                        : "border-border hover:border-olive/40 text-muted-foreground"
                    }`}>
                      <input type="checkbox" checked={form.eventFormats.includes(f.key)}
                        onChange={() => toggleFormat(f.key)} className="mt-0.5 w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold">{lang === "en" ? f.labelEn : f.labelEs}</p>
                        <p className="text-xs opacity-70">{lang === "en" ? f.descEn : f.descEs}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("Why do you want to be a Connector?", "¿Por qué quieres ser Connector?")} <span className="text-primary">*</span>
                </label>
                <textarea value={form.whyConnector} onChange={e => setForm(f => ({ ...f, whyConnector: e.target.value }))}
                  rows={5} placeholder={t("What motivates you? What will you bring to Aftr events?", "¿Qué te motiva? ¿Qué aportarás a los eventos de Aftr?")}
                  className={`${inputCls} resize-none`} />
                <p className="text-xs text-muted-foreground mt-1">{form.whyConnector.length} {t("characters (min 50)", "caracteres (mín. 50)")}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  {t("When are you available?", "¿Cuándo estás disponible?")} <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY.map(a => (
                    <button key={a.key} type="button" onClick={() => setForm(f => ({ ...f, availability: a.key }))}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        form.availability === a.key
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}>
                      {lang === "en" ? a.labelEn : a.labelEs}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">{t("Almost there!", "¡Casi listo!")}</h2>
                <p className="text-muted-foreground text-sm">{t("One last confirmation.", "Una última confirmación.")}</p>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-xl p-5 space-y-3 text-sm">
                {[
                  { label: t("Name", "Nombre"),       value: form.fullName },
                  { label: t("Email", "Email"),        value: user?.email },
                  { label: t("Formats", "Formatos"),   value: form.eventFormats.join(", ") },
                  { label: t("Available", "Disponible"), value: AVAILABILITY.find(a => a.key === form.availability)?.[lang === "en" ? "labelEn" : "labelEs"] },
                ].map(item => item.value && (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground text-right max-w-[60%] truncate">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* What happens next */}
              <div className="space-y-3">
                {[
                  { step: "1", en: "Aftr team reviews your application (1–3 days)",           es: "El equipo Aftr revisa tu solicitud (1–3 días)" },
                  { step: "2", en: "If approved, we book a 30-min onboarding call with you",  es: "Si se aprueba, agendamos una llamada de onboarding de 30 min" },
                  { step: "3", en: "You attend your first Aftr event as an observer",          es: "Asistes a tu primer evento Aftr como observador" },
                  { step: "4", en: "You co-host your first event — we're with you the whole time", es: "Co-organizas tu primer evento — estamos contigo todo el tiempo" },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-olive/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-olive text-xs font-bold">{item.step}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lang === "en" ? item.en : item.es}</p>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreedOnboarding}
                  onChange={e => setForm(f => ({ ...f, agreedOnboarding: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded text-primary" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "I understand a 30-minute onboarding session with the Aftr team is required before my first event.",
                    "Entiendo que se requiere una sesión de onboarding de 30 minutos con el equipo Aftr antes de mi primer evento."
                  )}
                </span>
              </label>

              <p className="text-xs text-muted-foreground">
                🌿 {t("Connector is a free volunteer role. No payment required.", "Connector es un rol voluntario gratuito. No se requiere pago.")}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0
              ? <Button variant="outline" onClick={() => { setStep(s => s - 1); setError(""); }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> {t("Back", "Atrás")}
                </Button>
              : <Link to="/apply-role"><button className="text-sm text-muted-foreground hover:text-foreground transition-colors">← {t("Back", "Atrás")}</button></Link>
            }
            {step < 2
              ? <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("Continue", "Continuar")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              : <Button onClick={submit} disabled={submitting} className="bg-olive text-white hover:bg-olive/90">
                  {submitting ? t("Submitting…", "Enviando…") : t("Submit application", "Enviar solicitud")}
                  {!submitting && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
