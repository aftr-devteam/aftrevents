import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useRequireAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AftrLogo from "@/components/AftrLogo";

// ─── QUESTION DEFINITIONS ─────────────────────────────────────

const JOIN_REASONS = [
  { key: "new_to_alicante",              iconEn: "🌍", labelEn: "I just moved to Alicante",                     labelEs: "Acabo de llegar a Alicante",                    descEn: "Looking for real connections in a new city",           descEs: "Busco conexiones reales en una ciudad nueva" },
  { key: "remote_worker",                iconEn: "💻", labelEn: "I work remotely and want community",            labelEs: "Trabajo en remoto y quiero comunidad",           descEn: "Remote life can be lonely — let's change that",        descEs: "El trabajo remoto puede ser solitario — cambiémoslo" },
  { key: "local_meet_internationals",    iconEn: "🤝", labelEn: "I'm local and want to meet internationals",    labelEs: "Soy local y quiero conocer a internacionales",   descEn: "Expand your world without leaving Alicante",           descEs: "Amplía tu mundo sin salir de Alicante" },
  { key: "building_something",           iconEn: "🚀", labelEn: "I'm building something and need connections",  labelEs: "Estoy construyendo algo y necesito contactos",   descEn: "Founders, freelancers, and doers welcome",             descEs: "Fundadores, freelancers y emprendedores bienvenidos" },
  { key: "just_fun",                     iconEn: "🎉", labelEn: "I just want to have fun and go to events",     labelEs: "Solo quiero divertirme e ir a eventos",          descEn: "Honest and valid — we're glad you're here",            descEs: "Honesto y válido — nos alegra que estés aquí" },
];

const EVENT_INTERESTS = [
  { key: "social",     iconEn: "🗣️", labelEn: "Social & Meetups",        labelEs: "Social y Meetups" },
  { key: "tech",       iconEn: "💻", labelEn: "Tech & Digital",           labelEs: "Tech y Digital" },
  { key: "language",   iconEn: "🌐", labelEn: "Language & Culture",       labelEs: "Idiomas y Cultura" },
  { key: "arts",       iconEn: "🎨", labelEn: "Arts & Creative",          labelEs: "Arte y Creatividad" },
  { key: "outdoor",    iconEn: "🏕️", labelEn: "Outdoor & Active",        labelEs: "Aire libre y Deporte" },
  { key: "food",       iconEn: "🍷", labelEn: "Food & Drinks",            labelEs: "Gastronomía y Bebidas" },
  { key: "learning",   iconEn: "📚", labelEn: "Learning & Growth",        labelEs: "Aprendizaje y Desarrollo" },
  { key: "business",   iconEn: "💼", labelEn: "Business & Networking",    labelEs: "Negocios y Networking" },
  { key: "nightlife",  iconEn: "🎉", labelEn: "Nightlife & Entertainment",labelEs: "Vida Nocturna" },
  { key: "other",      iconEn: "✍️", labelEn: "Other",                    labelEs: "Otro" },
];

const LOOKING_FOR = [
  { key: "friends",          iconEn: "👫", labelEn: "Making real friends",       labelEs: "Hacer amigos de verdad" },
  { key: "language_exchange",iconEn: "🗣️", labelEn: "Language exchange partner", labelEs: "Compañero de intercambio" },
  { key: "cofounder",        iconEn: "🤝", labelEn: "Co-founder or collaborator",labelEs: "Co-fundador o colaborador" },
  { key: "networking",       iconEn: "💼", labelEn: "Professional networking",   labelEs: "Networking profesional" },
  { key: "exploring",        iconEn: "🧭", labelEn: "Just exploring for now",    labelEs: "Solo explorando por ahora" },
];

const HOW_FOUND = [
  { key: "instagram",  labelEn: "Instagram",        labelEs: "Instagram" },
  { key: "meetup",     labelEn: "Meetup.com",        labelEs: "Meetup.com" },
  { key: "friend",     labelEn: "Friend or word of mouth", labelEs: "Amigo o recomendación" },
  { key: "google",     labelEn: "Google search",     labelEs: "Búsqueda en Google" },
  { key: "event",      labelEn: "I attended an event",labelEs: "Asistí a un evento" },
  { key: "other",      labelEn: "Other",             labelEs: "Otro" },
];

// ─── MULTI-SELECT CHIP ────────────────────────────────────────

function Chip({
  selected, onClick, icon, labelEn, labelEs, desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  labelEn: string;
  labelEs: string;
  desc?: string;
}) {
  const { lang } = useLang();
  const label = lang === "en" ? labelEn : labelEs;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/8 text-foreground"
          : "border-border bg-popover text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {icon && <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold block">{label}</span>
        {desc && <span className="text-xs opacity-70 block mt-0.5">{desc}</span>}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

// ─── PROGRESS DOTS ────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width:   i === current ? "1.5rem" : "0.5rem",
            height:  "0.5rem",
            background: i <= current ? "hsl(var(--primary))" : "hsl(var(--border))",
          }}
        />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function Onboarding() {
  const { t, lang } = useLang();
  const navigate     = useNavigate();
  const { user, profile } = useRequireAuth();

  const [step, setStep]     = useState(0);
  const [saving, setSaving] = useState(false);

  const [answers, setAnswers] = useState({
    join_reason:             "" as string,
    event_interests:         [] as string[],
    event_interests_other:   "",
    occupation:              "",
    country_from:            "",
    how_found_aftr:          "",
    looking_for:             [] as string[],
    wants_weekly_email:      true,
    interested_in_hosting:   false,
  });

  const TOTAL_STEPS = 5;

  function toggleArray(key: "event_interests" | "looking_for", val: string) {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter(v => v !== val)
        : [...prev[key], val],
    }));
  }

  function canAdvance(): boolean {
    if (step === 0) return !!answers.join_reason;
    if (step === 1) return answers.event_interests.length > 0;
    return true; // steps 2-4 are optional
  }

  async function handleFinish() {
    if (!user) return;
    setSaving(true);

    await supabase.from("onboarding_answers").upsert({
      user_id:               user.id,
      join_reason:           answers.join_reason,
      event_interests:       answers.event_interests,
      event_interests_other: answers.event_interests_other || null,
      occupation:            answers.occupation || null,
      country_from:          answers.country_from || null,
      how_found_aftr:        answers.how_found_aftr || null,
      looking_for:           answers.looking_for,
      wants_weekly_email:    answers.wants_weekly_email,
      interested_in_hosting: answers.interested_in_hosting,
    }, { onConflict: "user_id" });

    await supabase.from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    setSaving(false);
    navigate("/dashboard");
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? t("there", "ahí");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-lg mx-auto section-padding pt-10 pb-6 flex items-center justify-between">
        <AftrLogo className="h-6 w-auto text-foreground" />
        <button
          onClick={handleFinish}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("Skip for now", "Omitir por ahora")}
        </button>
      </div>

      <div className="max-w-lg mx-auto section-padding pb-20">
        {/* Progress */}
        <div className="mb-8">
          <ProgressDots total={TOTAL_STEPS} current={step} />
          <p className="text-center text-xs text-muted-foreground mt-3">
            {t(`${step + 1} of ${TOTAL_STEPS}`, `${step + 1} de ${TOTAL_STEPS}`)}
          </p>
        </div>

        {/* ── STEP 0 — Why are you here? ── */}
        {step === 0 && (
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
              {t(`Welcome, ${firstName}! 👋`, `¡Bienvenido, ${firstName}! 👋`)}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t(
                "Quick question — what brought you to Aftr?",
                "Una pregunta rápida — ¿qué te trajo a Aftr?"
              )}
            </p>
            <div className="space-y-3">
              {JOIN_REASONS.map(r => (
                <Chip
                  key={r.key}
                  selected={answers.join_reason === r.key}
                  onClick={() => setAnswers(a => ({ ...a, join_reason: r.key }))}
                  icon={r.iconEn}
                  labelEn={r.labelEn}
                  labelEs={r.labelEs}
                  desc={lang === "en" ? r.descEn : r.descEs}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — What experiences? ── */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
              {t("What gets you excited?", "¿Qué te entusiasma?")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t(
                "Pick everything that resonates — we'll show you the right events.",
                "Elige todo lo que te resuene — te mostraremos los eventos adecuados."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EVENT_INTERESTS.map(i => (
                <Chip
                  key={i.key}
                  selected={answers.event_interests.includes(i.key)}
                  onClick={() => toggleArray("event_interests", i.key)}
                  icon={i.iconEn}
                  labelEn={i.labelEn}
                  labelEs={i.labelEs}
                />
              ))}
            </div>
            {answers.event_interests.includes("other") && (
              <input
                type="text"
                value={answers.event_interests_other}
                onChange={e => setAnswers(a => ({ ...a, event_interests_other: e.target.value }))}
                placeholder={t("What else are you into?", "¿Qué más te gusta?")}
                className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            )}
          </div>
        )}

        {/* ── STEP 2 — About you ── */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
              {t("Tell us a bit about you", "Cuéntanos algo sobre ti")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t(
                "All optional — helps us understand our community.",
                "Todo opcional — nos ayuda a entender nuestra comunidad."
              )}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("What do you do?", "¿A qué te dedicas?")}
                  <span className="font-normal text-muted-foreground ml-1">
                    {t("(optional)", "(opcional)")}
                  </span>
                </label>
                <input
                  type="text"
                  value={answers.occupation}
                  onChange={e => setAnswers(a => ({ ...a, occupation: e.target.value }))}
                  placeholder={t(
                    "e.g. Designer, Developer, Teacher, Student…",
                    "ej. Diseñador, Desarrollador, Profesor, Estudiante…"
                  )}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("Where are you originally from?", "¿De dónde eres originalmente?")}
                  <span className="font-normal text-muted-foreground ml-1">
                    {t("(optional)", "(opcional)")}
                  </span>
                </label>
                <input
                  type="text"
                  value={answers.country_from}
                  onChange={e => setAnswers(a => ({ ...a, country_from: e.target.value }))}
                  placeholder={t(
                    "e.g. Spain, Colombia, UK, Philippines…",
                    "ej. España, Colombia, Reino Unido, Filipinas…"
                  )}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t("How did you find Aftr?", "¿Cómo encontraste Aftr?")}
                  <span className="font-normal text-muted-foreground ml-1">
                    {t("(optional)", "(opcional)")}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HOW_FOUND.map(h => (
                    <button
                      key={h.key}
                      type="button"
                      onClick={() => setAnswers(a => ({ ...a, how_found_aftr: a.how_found_aftr === h.key ? "" : h.key }))}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                        answers.how_found_aftr === h.key
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {lang === "en" ? h.labelEn : h.labelEs}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 — What are you open to? ── */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
              {t("What are you open to?", "¿A qué estás abierto?")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t(
                "This helps people in the community connect with you better.",
                "Esto ayuda a las personas de la comunidad a conectar contigo mejor."
              )}
            </p>
            <div className="space-y-3">
              {LOOKING_FOR.map(l => (
                <Chip
                  key={l.key}
                  selected={answers.looking_for.includes(l.key)}
                  onClick={() => toggleArray("looking_for", l.key)}
                  icon={l.iconEn}
                  labelEn={l.labelEn}
                  labelEs={l.labelEs}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4 — Preferences ── */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
              {t("Almost done! 🎉", "¡Casi listo! 🎉")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t(
                "Two quick preferences and you're in.",
                "Dos preferencias rápidas y ya estás dentro."
              )}
            </p>
            <div className="space-y-4">
              {/* Weekly email */}
              <label className="flex items-start gap-4 bg-popover border border-border rounded-2xl px-5 py-4 cursor-pointer hover:border-primary/30 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">
                    {t("Send me the weekly event picks", "Envíame la selección semanal de eventos")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(
                      "Every week, the best upcoming events in Alicante. Free, no spam.",
                      "Cada semana, los mejores eventos en Alicante. Gratis, sin spam."
                    )}
                  </p>
                </div>
                <div
                  onClick={() => setAnswers(a => ({ ...a, wants_weekly_email: !a.wants_weekly_email }))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                    answers.wants_weekly_email ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      answers.wants_weekly_email ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              {/* Hosting interest */}
              <label className="flex items-start gap-4 bg-popover border border-border rounded-2xl px-5 py-4 cursor-pointer hover:border-primary/30 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">
                    {t("I'm interested in hosting events someday", "Me interesa organizar eventos algún día")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(
                      "We'll let you know when Connector and Builder spots open up.",
                      "Te avisaremos cuando haya plazas de Connector y Builder disponibles."
                    )}
                  </p>
                </div>
                <div
                  onClick={() => setAnswers(a => ({ ...a, interested_in_hosting: !a.interested_in_hosting }))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                    answers.interested_in_hosting ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      answers.interested_in_hosting ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t("Back", "Atrás")}
            </button>
          ) : <div />}

          {step < TOTAL_STEPS - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("Continue", "Continuar")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving
                ? t("Saving…", "Guardando…")
                : t("Let's go! 🎉", "¡Vamos! 🎉")
              }
              {!saving && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
