// src/lib/config.ts
// ─────────────────────────────────────────────────────────────
// FEATURE FLAGS
// Toggle features on/off without breaking the app.
// ─────────────────────────────────────────────────────────────

// STRIPE: Set to true once you have a Stripe account configured.
// When false: all payments show manual Bizum/bank transfer instructions.
// When true:  Stripe checkout appears for subscriptions and paid events.
// DELETE THIS COMMENT and set to true once Stripe is live.
export const STRIPE_ENABLED = false;

// INNER_CIRCLE: Set to true when Aftr Inner Circle is ready to launch.
export const INNER_CIRCLE_ENABLED = false;

// PODCAST: Set to true when the video podcast series is ready.
export const PODCAST_ENABLED = false;

// FOUNDING_MEMBER_DEADLINE: ISO date string — promo ends at midnight on this date.
export const FOUNDING_MEMBER_DEADLINE = "2026-12-31T23:59:59Z";

// Max founding members — set to a number to create scarcity, or null for unlimited.
// Recommended: start with null, add a cap if demand is high.
export const FOUNDING_MEMBER_CAP: number | null = null;

// ─────────────────────────────────────────────────────────────
// PLAN DEFINITIONS
// Single source of truth for all pricing and benefits.
// ─────────────────────────────────────────────────────────────

export type PlanKey =
  | "founding"
  | "monthly"
  | "biannual"
  | "annual";

export type TierKey = "member" | "connector" | "builder";

export interface Plan {
  key:         PlanKey;
  nameEn:      string;
  nameEs:      string;
  euros:       number;
  months:      number;
  perMonthEn:  string;
  perMonthEs:  string;
  saving?:     string;
  savingEs?:   string;
  tagEn?:      string;       // e.g. "Founding offer"
  tagEs?:      string;
  tagColor?:   string;
  popular?:    boolean;
  isFounding?: boolean;
  deadlineNote?: string;
  // STRIPE: add priceId here once Stripe is configured.
  // stripePriceId?: string;
}

export const PLANS: Plan[] = [
  {
    key:        "founding",
    nameEn:     "Founding Builder",
    nameEs:     "Builder Fundador",
    euros:      10,
    months:     6,
    perMonthEn: "€1.67 / month",
    perMonthEs: "€1,67 / mes",
    tagEn:      "Early supporter offer",
    tagEs:      "Oferta de apoyo inicial",
    tagColor:   "#ffc24a",
    isFounding: true,
    deadlineNote: "Available until 31 December 2026",
    // stripePriceId: "price_XXXX", // ADD WHEN STRIPE IS LIVE
  },
  {
    key:        "monthly",
    nameEn:     "Monthly",
    nameEs:     "Mensual",
    euros:      18,
    months:     1,
    perMonthEn: "€18 / month",
    perMonthEs: "€18 / mes",
    // stripePriceId: "price_XXXX",
  },
  {
    key:        "biannual",
    nameEn:     "6 Months",
    nameEs:     "6 Meses",
    euros:      90,
    months:     6,
    perMonthEn: "€15 / month",
    perMonthEs: "€15 / mes",
    saving:     "Save 17%",
    savingEs:   "Ahorra 17%",
    popular:    true,
    // stripePriceId: "price_XXXX",
  },
  {
    key:        "annual",
    nameEn:     "Annual",
    nameEs:     "Anual",
    euros:      150,
    months:     12,
    perMonthEn: "€12.50 / month",
    perMonthEs: "€12,50 / mes",
    saving:     "Save 31%",
    savingEs:   "Ahorra 31%",
    // stripePriceId: "price_XXXX",
  },
];

// Check if founding member promo is still active
export function isFoundingPeriodActive(): boolean {
  return new Date() < new Date(FOUNDING_MEMBER_DEADLINE);
}

// Days remaining in founding period
export function foundingDaysRemaining(): number {
  const diff = new Date(FOUNDING_MEMBER_DEADLINE).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

// Get available plans (hides founding if deadline passed)
export function getAvailablePlans(): Plan[] {
  return PLANS.filter(p => {
    if (p.isFounding && !isFoundingPeriodActive()) return false;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────
// BENEFITS COPY
// Defined here so they stay consistent across all UI.
// ─────────────────────────────────────────────────────────────

export const CONNECTOR_BENEFITS = [
  { en: "Host Aftr-branded events",                         es: "Organiza eventos con la marca Aftr" },
  { en: "🌿 Connector badge on your profile",               es: "Insignia 🌿 Connector en tu perfil" },
  { en: "Featured on /builders-connectors page",            es: "Destacado en la página de comunidad" },
  { en: "Listed as host on event pages",                    es: "Apareces como host en los eventos" },
  { en: "Mentioned in event promotion (story + WhatsApp)",  es: "Mencionado en promoción del evento" },
  { en: "Access to Aftr venue partnerships",                es: "Acceso a los locales colaboradores de Aftr" },
  { en: "30-min onboarding with the Aftr team",             es: "Onboarding de 30 min con el equipo Aftr" },
  { en: "Monthly hosts coordination session",               es: "Sesión mensual de coordinación de hosts" },
];

export const BUILDER_FOUNDING_BENEFITS = [
  { en: "Everything in Connector",                          es: "Todo lo incluido en Connector", highlight: true },
  { en: "Post your OWN branded events",                     es: "Publica tus propios eventos con tu marca" },
  { en: "🔶 Builder badge on your profile",                 es: "Insignia 🔶 Builder en tu perfil" },
  { en: "Your events listed on Aftr website + Meetup",      es: "Tus eventos en el sitio web de Aftr + Meetup" },
  { en: "Weekly community lineup (WhatsApp + story)",       es: "Lineup semanal comunitario (WhatsApp + story)" },
  { en: "Your logo on the Aftr website",                    es: "Tu logo en el sitio web de Aftr" },
  { en: "Included in monthly Aftr Builder spotlight post",  es: "Incluido en el post mensual de spotlight Builders" },
  { en: "30-min personalised onboarding with Jaan",         es: "Onboarding personalizado de 30 min con Jaan" },
  ...(INNER_CIRCLE_ENABLED ? [
    { en: "First invitation to Aftr Inner Circle",          es: "Primera invitación al Aftr Inner Circle" },
  ] : [
    { en: "⏳ Early access: Aftr Inner Circle (coming soon)", es: "⏳ Acceso anticipado: Aftr Inner Circle (próximamente)" },
  ]),
  ...(PODCAST_ENABLED ? [
    { en: "Invitation to Aftr video podcast series",        es: "Invitación a la serie de videopodcast de Aftr" },
  ] : [
    { en: "⏳ Early access: Aftr video podcast (coming soon)", es: "⏳ Acceso anticipado: videopodcast Aftr (próximamente)" },
  ]),
];

export const BUILDER_MONTHLY_EXTRAS = [
  { en: "2 dedicated Builder spotlight inclusions / month", es: "2 inclusiones en spotlight Builder al mes" },
  { en: "Featured in monthly Aftr email digest",            es: "Incluido en el digest mensual de Aftr por email" },
];

export const BUILDER_BIANNUAL_EXTRAS = [
  { en: "Priority event scheduling (first pick of venues)", es: "Prioridad en programación de eventos" },
  { en: "Co-branding option for special events",            es: "Opción de co-marca para eventos especiales" },
];

export const BUILDER_ANNUAL_EXTRAS = [
  { en: "Annual spotlight feature (long-form post + story series)", es: "Spotlight anual (post largo + serie de stories)" },
  { en: "Input into Aftr's yearly programming",             es: "Participación en la programación anual de Aftr" },
];
