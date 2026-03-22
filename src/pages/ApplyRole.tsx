import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";
import { useRequireAuth } from "@/hooks/useAuth";
import { AftrBadge } from "@/components/AftrBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CONNECTOR_BENEFITS,
  BUILDER_FOUNDING_BENEFITS,
  BUILDER_MONTHLY_EXTRAS,
  BUILDER_BIANNUAL_EXTRAS,
  BUILDER_ANNUAL_EXTRAS,
  getAvailablePlans,
  isFoundingPeriodActive,
  foundingDaysRemaining,
  type PlanKey,
} from "@/lib/config";

// ─── PLAN CARD ────────────────────────────────────────────────

function PlanCard({
  planKey, selected, onClick,
}: {
  planKey: PlanKey;
  selected: boolean;
  onClick: () => void;
}) {
  const { lang } = useLang();
  const plans = getAvailablePlans();
  const plan  = plans.find(p => p.key === planKey);
  if (!plan) return null;

  const name   = lang === "en" ? plan.nameEn   : plan.nameEs;
  const saving = lang === "en" ? plan.saving   : plan.savingEs;
  const tag    = lang === "en" ? plan.tagEn    : plan.tagEs;

  const daysLeft = plan.isFounding ? foundingDaysRemaining() : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 relative ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-popover hover:border-primary/40"
      }`}
    >
      {plan.popular && !selected && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: "hsl(var(--primary))" }}
        >
          {lang === "en" ? "Most popular" : "Más popular"}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-heading text-base font-bold text-foreground">{name}</span>
            {tag && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: plan.tagColor ?? "#ffc24a", color: "#272727" }}
              >
                {tag}
              </span>
            )}
            {saving && (
              <span className="text-xs font-semibold text-olive">{saving}</span>
            )}
          </div>
          {plan.isFounding && daysLeft !== null && (
            <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-0.5">
              <Clock className="w-3 h-3" />
              {lang === "en"
                ? `${daysLeft} days left — offer ends 31 Dec 2026`
                : `${daysLeft} días restantes — oferta hasta el 31 dic 2026`
              }
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-heading text-2xl font-bold text-primary">€{plan.euros}</div>
          <div className="text-xs text-muted-foreground">
            {plan.months === 1
              ? (lang === "en" ? "/ month" : "/ mes")
              : (lang === "en" ? `/ ${plan.months} months` : `/ ${plan.months} meses`)
            }
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {lang === "en" ? plan.perMonthEn : plan.perMonthEs}
        {plan.months > 1 && (
          <span className="ml-1 font-semibold text-foreground">
            {lang === "en" ? `— billed €${plan.euros} total` : `— total €${plan.euros}`}
          </span>
        )}
      </div>

      {selected && (
        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

// ─── BENEFITS LIST ────────────────────────────────────────────

function BenefitsList({ items }: { items: Array<{ en: string; es: string; highlight?: boolean }> }) {
  const { lang } = useLang();
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-2.5 text-sm ${item.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.highlight ? "bg-primary" : "bg-primary/10"}`}>
            <Check className={`w-2.5 h-2.5 ${item.highlight ? "text-white" : "text-primary"}`} />
          </div>
          {lang === "en" ? item.en : item.es}
        </li>
      ))}
    </ul>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function ApplyRole() {
  const { t, lang }     = useLang();
  const { user }        = useRequireAuth();
  const navigate        = useNavigate();
  const [params]        = useSearchParams();

  const initialRole = (params.get("role") as "connector" | "builder" | null) ?? null;
  const [role, setRole]     = useState<"connector" | "builder" | null>(initialRole);
  const [plan, setPlan]     = useState<PlanKey>("founding");

  const availablePlans = getAvailablePlans();
  const foundingActive = isFoundingPeriodActive();
  const daysLeft       = foundingDaysRemaining();

  function handleApply() {
    if (!user) { navigate("/login"); return; }
    if (role === "connector") {
      navigate("/apply/connector");
    } else if (role === "builder") {
      navigate(`/apply/builder?plan=${plan}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto section-padding pt-24 pb-20">

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Get more from Aftr", "Saca más de Aftr")}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4" style={{ lineHeight: 1.12 }}>
            {t("Choose your role", "Elige tu rol")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              "Whether you want to volunteer as a host or grow your own community through Aftr — there's a path for you.",
              "Tanto si quieres ser host voluntario como si quieres hacer crecer tu propia comunidad con Aftr — hay un camino para ti."
            )}
          </p>
        </div>

        {/* Founding urgency banner */}
        {foundingActive && (
          <div
            className="rounded-2xl border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-10"
            style={{ background: "rgba(255,194,74,0.08)", borderColor: "rgba(255,194,74,0.35)" }}
          >
            <div>
              <p className="font-semibold text-foreground text-sm">
                ⭐ {t("Founding Builder offer active", "Oferta de Builder Fundador activa")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "en"
                  ? `Start your community for €10 for 6 months. ${daysLeft} days left — closes 31 December 2026.`
                  : `Empieza tu comunidad por €10 durante 6 meses. ${daysLeft} días restantes — cierra el 31 de diciembre 2026.`
                }
              </p>
            </div>
            <div className="flex-shrink-0">
              <div
                className="text-sm font-bold px-4 py-2 rounded-xl"
                style={{ background: "#ffc24a", color: "#272727" }}
              >
                {lang === "en" ? `${daysLeft} days left` : `${daysLeft} días`}
              </div>
            </div>
          </div>
        )}

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Connector */}
          <div
            onClick={() => setRole("connector")}
            className={`rounded-2xl border p-7 cursor-pointer transition-all duration-200 ${
              role === "connector"
                ? "border-olive bg-olive/5 shadow-md"
                : "border-border bg-popover hover:border-olive/40"
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <AftrBadge type="connector" size="md" />
              {role === "connector" && (
                <div className="w-6 h-6 rounded-full bg-olive flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">
              {t("Connector", "Connector")}
            </h2>
            <div className="inline-block bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
              {t("Free — volunteer role", "Gratis — rol voluntario")}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t(
                "Host Aftr events as a volunteer. Get featured on the website, build your personal brand, and become part of the team that makes Aftr happen.",
                "Organiza eventos de Aftr como voluntario. Destaca en el sitio web, construye tu marca personal y forma parte del equipo que hace posible Aftr."
              )}
            </p>
            <BenefitsList items={CONNECTOR_BENEFITS} />
          </div>

          {/* Builder */}
          <div
            onClick={() => setRole("builder")}
            className={`rounded-2xl border p-7 cursor-pointer transition-all duration-200 ${
              role === "builder"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-popover hover:border-primary/40"
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2">
                <AftrBadge type="builder" size="md" />
                {foundingActive && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#ffc24a", color: "#272727" }}
                  >
                    {t("Founding offer", "Oferta fundador")}
                  </span>
                )}
              </div>
              {role === "builder" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">
              {t("Builder", "Builder")}
            </h2>
            <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
              {foundingActive
                ? t("From €10 / 6 months", "Desde €10 / 6 meses")
                : t("From €18 / month", "Desde €18 / mes")
              }
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t(
                "Post your own branded events, grow your community through Aftr, and get real visibility in front of 2,220+ members.",
                "Publica tus propios eventos con tu marca, haz crecer tu comunidad a través de Aftr y consigue visibilidad real ante más de 2.220 miembros."
              )}
            </p>
            <BenefitsList items={BUILDER_FOUNDING_BENEFITS} />
          </div>
        </div>

        {/* Plan selector — only shows when Builder is selected */}
        {role === "builder" && (
          <div className="bg-popover border border-border rounded-2xl p-7 mb-8 animate-fade-in">
            <h3 className="font-heading text-xl font-bold text-foreground mb-5">
              {t("Choose your plan", "Elige tu plan")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePlans.map(p => (
                <PlanCard
                  key={p.key}
                  planKey={p.key}
                  selected={plan === p.key}
                  onClick={() => setPlan(p.key)}
                />
              ))}
            </div>

            {/* Plan-specific extra benefits */}
            {(plan === "monthly" || plan === "biannual" || plan === "annual") && (
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("Extra benefits on this plan:", "Beneficios adicionales en este plan:")}
                </p>
                <BenefitsList items={
                  plan === "monthly"  ? BUILDER_MONTHLY_EXTRAS :
                  plan === "biannual" ? [...BUILDER_MONTHLY_EXTRAS, ...BUILDER_BIANNUAL_EXTRAS] :
                  [...BUILDER_MONTHLY_EXTRAS, ...BUILDER_BIANNUAL_EXTRAS, ...BUILDER_ANNUAL_EXTRAS]
                } />
              </div>
            )}

            {/* Payment note */}
            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {/* STRIPE: replace this paragraph when STRIPE_ENABLED = true */}
                {t(
                  "Payment via Bizum or bank transfer — instructions sent after admin approval. No credit card required.",
                  "Pago por Bizum o transferencia bancaria — instrucciones enviadas tras la aprobación del administrador. No se requiere tarjeta de crédito."
                )}
                {/* WHEN STRIPE IS LIVE: remove the paragraph above and add Stripe checkout here */}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        {role && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/50 border border-border rounded-2xl px-6 py-5 animate-fade-in">
            <div>
              <p className="font-semibold text-foreground">
                {role === "connector"
                  ? t("Apply as Connector — free", "Solicitar como Connector — gratis")
                  : t(`Apply as Builder — €${getAvailablePlans().find(p => p.key === plan)?.euros}`, `Solicitar como Builder — €${getAvailablePlans().find(p => p.key === plan)?.euros}`)
                }
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(
                  "Admin reviews all applications. We'll be in touch within 3 business days.",
                  "El admin revisa todas las solicitudes. Nos pondremos en contacto en 3 días hábiles."
                )}
              </p>
            </div>
            <Button
              onClick={handleApply}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
            >
              {t("Apply now", "Solicitar ahora")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {!role && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("Select a role above to continue.", "Selecciona un rol arriba para continuar.")}
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
