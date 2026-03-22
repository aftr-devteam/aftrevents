import { useState } from "react";
import { ArrowRight, Search, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hosts } from "@/lib/eventData";

// ─────────────────────────────────────────────────────────────
// SEARCH TAGS — these power the filter pills.
// Add new tags here as your team grows.
// Each tag must also appear in at least one host's `tags` array
// in eventData.ts for it to be filterable.
// ─────────────────────────────────────────────────────────────
const SEARCH_TAGS = [
  "All",
  "Community",
  "Events",
  "Languages",
  "Tech & Digital",
  "Branding & Design",
  "Creative & Culture",
  "Outdoor",
  "Strategy",
  "Marketing",
];

// ─── HERO ─────────────────────────────────────────────────────

function Hero() {
  const { t } = useLang();
  return (
    <section className="bg-warm-dark section-padding py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
          style={{ color: "hsl(var(--sand))" }}
        >
          {t("Aftr Social Club", "Aftr Social Club")}
        </p>
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
          style={{ color: "hsl(var(--sand-light))" }}
        >
          {t("Builders & Connectors", "Builders & Connectors")}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mb-10 animate-reveal-up stagger-2"
          style={{ color: "hsl(var(--sand) / 0.7)" }}
        >
          {t(
            "The people who make Aftr happen — locals and internationals from 8+ countries, building community in Alicante every week. Browse by expertise, event type, or service to find who you need.",
            "Las personas que hacen posible Aftr — locales e internacionales de más de 8 países, construyendo comunidad en Alicante cada semana. Busca por experiencia, tipo de evento o servicio para encontrar a quien necesitas."
          )}
        </p>
        {/* Quick CTA */}
        <div className="flex flex-col sm:flex-row gap-3 animate-reveal-up stagger-3">
          <a href="mailto:afterworkclubinternational@gmail.com?subject=Aftr Host Application">
            <Button variant="hero" size="lg">
              {t("Apply to be a host", "Solicitar ser host")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </a>
          <NavLink to="/collaborate">
            <Button variant="hero-outline" size="lg">
              {t("See collaboration options", "Ver opciones de colaboración")}
            </Button>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

// ─── STATS STRIP ──────────────────────────────────────────────

function StatsStrip() {
  const { t } = useLang();
  const stats = [
    { value: "15+", label: t("active builders", "builders activos") },
    { value: "8+",  label: t("nationalities",   "nacionalidades") },
    { value: "250+",label: t("events together", "eventos juntos") },
    { value: "2021",label: t("since",           "desde") },
  ];
  return (
    <div
      className="bg-warm-dark border-t section-padding py-5"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="font-heading text-xl font-bold"
              style={{ color: "hsl(var(--sand-light))" }}
            >
              {s.value}
            </span>
            <span className="text-sm" style={{ color: "hsl(var(--sand) / 0.5)" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PEOPLE GRID WITH SEARCH ──────────────────────────────────

function PeopleGrid() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  const [query, setQuery]     = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // Filter hosts by search query and tag
  // NOTE: For tags to work, add a `tags: string[]` field to the Host
  // interface in eventData.ts and populate them per host.
  // Until then, search works across name, role, and bio.
  const filtered = hosts.filter(host => {
    const q = query.toLowerCase();
    const roleTxt = lang === "en" ? host.role : host.roleEs;
    const bioTxt  = lang === "en" ? host.bio  : host.bioEs;
    const tags    = (host as any).tags as string[] | undefined;

    const matchSearch =
      !q ||
      host.name.toLowerCase().includes(q) ||
      roleTxt.toLowerCase().includes(q) ||
      bioTxt.toLowerCase().includes(q) ||
      (tags || []).some(tag => tag.toLowerCase().includes(q));

    const matchTag =
      activeTag === "All" ||
      (tags || []).includes(activeTag);

    return matchSearch && matchTag;
  });

  const hasFilters = query !== "" || activeTag !== "All";

  return (
    <section ref={ref} className="py-12 lg:py-20 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

        {/* ── SEARCH + FILTER BAR ── */}
        <div className="mb-10">
          {/* Search input */}
          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t(
                "Search by name, expertise, event type, or service…",
                "Buscar por nombre, experiencia, tipo de evento o servicio…"
              )}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2">
            {SEARCH_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-popover text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => { setQuery(""); setActiveTag("All"); }}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("Clear", "Limpiar")} ✕
              </button>
            )}
          </div>

          {/* Result count */}
          {hasFilters && (
            <p className="text-sm text-muted-foreground mt-3">
              {t(`${filtered.length} people found`, `${filtered.length} personas encontradas`)}
            </p>
          )}
        </div>

        {/* ── CARDS ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              {t("No one found", "Nadie encontrado")}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("Try a different search or clear the filter.", "Prueba con otro término o limpia el filtro.")}
            </p>
            <button
              onClick={() => { setQuery(""); setActiveTag("All"); }}
              className="text-primary font-semibold text-sm hover:underline"
            >
              {t("Clear filters", "Limpiar filtros")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((host, i) => (
              <div
                key={host.id}
                className={`bg-popover rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 flex flex-col ${
                  isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"
                }`}
              >
                {/* Avatar + flag */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden"
                    style={{ background: host.avatarColor }}
                  >
                    {host.avatar ? (
                      <img
                        src={host.avatar}
                        alt={host.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      host.initials
                    )}
                  </div>
                  <span className="text-2xl mt-1">{host.flag}</span>
                </div>

                {/* Name */}
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  {host.name}
                </h3>

                {/* Role */}
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 leading-relaxed">
                  {lang === "en" ? host.role : host.roleEs}
                </p>

                {/* Tags — shown if host has them */}
                {(host as any).tags && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {((host as any).tags as string[]).slice(0, 3).map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => { setActiveTag(SEARCH_TAGS.includes(tag) ? tag : "All"); }}
                        className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                  {lang === "en" ? host.bio : host.bioEs}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-sm font-semibold text-foreground">
                      {host.eventsHosted}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {t("events", "eventos")}
                    </span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t("Since", "Desde")} {host.joinedYear}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {host.instagram && (
                      <a
                        href={host.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${host.name} Instagram`}
                        className="w-7 h-7 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                    {host.linkedin && (
                      <a
                        href={host.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${host.name} LinkedIn`}
                        className="w-7 h-7 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder cards for spots not yet filled */}
            {Array.from({ length: Math.max(0, 15 - hosts.length) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="bg-muted/50 rounded-2xl p-6 border border-dashed border-border flex flex-col items-center justify-center text-center min-h-[220px]"
              >
                <div className="w-14 h-14 rounded-full bg-border/80 flex items-center justify-center mb-3 text-2xl">
                  🤝
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {t("This could be you", "Esto podrías ser tú")}
                </p>
                <a
                  href="mailto:afterworkclubinternational@gmail.com?subject=Aftr Host Application"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  {t("Apply to join →", "Solicitar unirse →")}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── JOIN CTA ─────────────────────────────────────────────────

function JoinCTA() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const perks = [
    t("Official Aftr Host or Collaborator title", "Título oficial de Aftr Host o Colaborador"),
    t("Free visibility for your brand or services", "Visibilidad gratuita de tu marca o servicios"),
    t("Free feature on Meetup and our social channels", "Aparición gratuita en Meetup y nuestros canales"),
    t("Free events management training (monthly)", "Formación gratuita en gestión de eventos (mensual)"),
    t("Access to the Aftr Circle private group", "Acceso al grupo privado Aftr Circle"),
    t("Posting rights on Aftr WhatsApp & socials", "Derechos de publicación en WhatsApp y redes de Aftr"),
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-5xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — pitch */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              {t("Get involved", "Involúcrate")}
            </p>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-5"
              style={{ lineHeight: 1.15 }}
            >
              {t(
                "Want to be one of these people?",
                "¿Quieres ser una de estas personas?"
              )}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t(
                "Being an Aftr Host is volunteer work — but it's far from ordinary volunteering. You help shape the energy at our events, build genuine connections across cultures, and grow your own visibility in the community.",
                "Ser Aftr Host es trabajo voluntario — pero está lejos de ser un voluntariado ordinario. Ayudas a dar forma a la energía en nuestros eventos, construyes conexiones genuinas entre culturas y haces crecer tu visibilidad en la comunidad."
              )}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(
                "We look for people who already show up — to events, to the community, to each other. If that sounds like you, apply below.",
                "Buscamos personas que ya aparecen — a los eventos, a la comunidad, los unos a los otros. Si eso te describe, solicita abajo."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="mailto:afterworkclubinternational@gmail.com?subject=Aftr Host Application">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("Apply to be a host", "Solicitar ser host")}
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </a>
              <NavLink to="/collaborate">
                <Button variant="outline" size="lg">
                  {t("See all ways to collaborate", "Ver todas las formas de colaborar")}
                </Button>
              </NavLink>
            </div>

            {/* Process steps */}
            <div className="mt-10">
              <p className="text-sm font-semibold text-foreground mb-4">
                {t("How it works", "Cómo funciona")}
              </p>
              <div className="space-y-3">
                {[
                  { step: "1", en: "Email us with a short intro about yourself", es: "Escríbenos con una breve presentación" },
                  { step: "2", en: "We have a quick chat to see if it's a good fit", es: "Tenemos una charla rápida para ver si encaja" },
                  { step: "3", en: "You attend one event as an observer", es: "Asistes a un evento como observador" },
                  { step: "4", en: "You co-host your first event — we're with you", es: "Co-organizas tu primer evento — estamos contigo" },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">{item.step}</span>
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {t(item.en, item.es)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — what you get */}
          <div className="bg-popover rounded-2xl border border-border p-7">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">🎁</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {t("What Aftr Hosts get", "Qué reciben los Aftr Hosts")}
              </h3>
            </div>
            <ul className="space-y-4 mb-7">
              {perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{perk}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial placeholder */}
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "hsl(var(--primary) / 0.05)",
                borderColor: "hsl(var(--primary) / 0.15)",
              }}
            >
              <p className="text-sm text-foreground italic leading-relaxed mb-2">
                {t(
                  '"Hosting at Aftr gave me a network I couldn\'t have built anywhere else in Alicante — and I\'ve made genuine friends along the way."',
                  '"Ser host en Aftr me dio una red que no habría podido construir en ningún otro lugar de Alicante — y he hecho amigos de verdad en el camino."'
                )}
              </p>
              <p className="text-xs font-semibold text-primary">
                {t("— Aftr Host, 2023", "— Aftr Host, 2023")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function BuildersConnectors() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsStrip />
      <PeopleGrid />
      <JoinCTA />
      <Footer />
    </div>
  );
}
