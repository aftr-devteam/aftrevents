import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, Sparkles, CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, eventSeries, categories, categoriesEs } from "@/lib/eventData";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroImages = [hero1, hero2, hero3];

// ─── HERO ─────────────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroImages.length), 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    // h-screen so the carousel fills the full viewport behind the fixed navbar
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {heroImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt="Aftr Events Alicante"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center section-padding max-w-4xl mx-auto">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
          style={{ color: "hsl(var(--sand) / 0.9)" }}
        >
          Alicante & Elche · Since 2021
        </p>
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
          style={{ color: "hsl(var(--sand-light))" }}
        >
          {t(
            "Where Alicante's locals and internationals actually meet",
            "Donde locales e internacionales de Alicante se encuentran de verdad"
          )}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mb-10 animate-reveal-up stagger-2"
          style={{ color: "hsl(var(--sand) / 0.8)" }}
        >
          {t(
            "Weekly events in Alicante and Elche. Come for the event. Stay for the community.",
            "Eventos semanales en Alicante y Elche. Ven por el evento. Quédate por la comunidad."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-reveal-up stagger-3">
          <Link to="/events">
            <Button variant="hero" size="lg">
              {t("See this week's events", "Ver eventos de esta semana")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="hero-outline" size="lg">
              {t("Join free — open to everyone", "Únete gratis — abierto a todos")}
            </Button>
          </Link>
        </div>

        {/* Carousel dots */}
        <div className="flex gap-2 mt-12 animate-reveal-up stagger-4">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8"
                  : "w-2.5"
              }`}
              style={{
                background: i === current
                  ? "hsl(var(--sand-light))"
                  : "hsl(var(--sand) / 0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TRUST STRIP ──────────────────────────────────────────────

function TrustStrip() {
  const { t } = useLang();

  const stats = [
    { value: "2.220+", label: t("active members", "miembros activos") },
    { value: "250+",   label: t("events since 2021", "eventos desde 2021") },
    { value: "60/40",  label: t("international / local", "internacional / local") },
    { value: "5+",     label: t("venue partners", "locales colaboradores") },
  ];

  const badges = [
    "Acción Contra el Hambre",
    "Cámara de Comercio",
  ];

  return (
    <div className="bg-warm-dark section-padding py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="font-heading text-xl font-bold"
                style={{ color: "hsl(var(--sand-light))" }}
              >
                {s.value}
              </span>
              <span className="text-sm" style={{ color: "hsl(var(--sand) / 0.55)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "hsl(var(--sand) / 0.35)" }}
          >
            {t("Recognised by", "Reconocidos por")}
          </span>
          {badges.map((b, i) => (
            <span
              key={i}
              className="text-sm font-medium"
              style={{ color: "hsl(var(--sand) / 0.65)" }}
            >
              {b}{i < badges.length - 1 && <span style={{ color: "hsl(var(--sand) / 0.25)", marginLeft: "0.5rem" }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEATURED EVENTS ──────────────────────────────────────────

function FeaturedEvents() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  const [activeCategory, setActiveCategory] = useState("All");
  const [showFree, setShowFree] = useState<boolean | null>(null);

  const filtered = events
    .filter(e => activeCategory === "All" || e.category === activeCategory)
    .filter(e => showFree === null || e.isFree === showFree)
    .slice(0, 6);

  const catLabel = (cat: string) =>
    lang === "en" ? cat : (categoriesEs[cat] ?? cat);

  const hasFilters = activeCategory !== "All" || showFree !== null;

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">
              {t("Upcoming in Alicante & Elche", "Próximos en Alicante y Elche")}
            </p>
            <h2
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
              style={{ lineHeight: 1.15 }}
            >
              {t("Events this month", "Eventos este mes")}
            </h2>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm">
              {t("View all", "Ver todos")}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-popover text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {catLabel(cat)}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <button
            onClick={() => setShowFree(showFree === true ? null : true)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              showFree === true
                ? "bg-olive text-primary-foreground border-olive"
                : "bg-popover text-muted-foreground border-border hover:border-olive/40"
            }`}
          >
            {t("Free", "Gratis")}
          </button>
          <button
            onClick={() => setShowFree(showFree === false ? null : false)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              showFree === false
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-popover text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {t("Paid", "De pago")}
          </button>
          {hasFilters && (
            <button
              onClick={() => { setActiveCategory("All"); setShowFree(null); }}
              className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("Clear", "Limpiar")} ✕
            </button>
          )}
        </div>

        {/* 2-row grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <div
                key={event.id}
                className={isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"}
              >
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-3">
              {t("No events match this filter.", "Ningún evento coincide con este filtro.")}
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setShowFree(null); }}
              className="text-primary font-semibold text-sm hover:underline"
            >
              {t("Clear filters", "Limpiar filtros")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── THIS WEEK ────────────────────────────────────────────────

function ThisWeek() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const now     = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(now.getDate() + 7);

  const thisWeek = events.filter(e => {
    const d = new Date(e.date);
    return d >= now && d <= weekEnd;
  }).slice(0, 4);

  if (thisWeek.length === 0) return null;

  return (
    <section ref={ref} className="py-10 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">
            {t("Happening this week", "Esta semana")}
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {thisWeek.map(event => {
            const d       = new Date(event.date);
            const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
            const dayNum  = d.getDate();
            const month   = d.toLocaleDateString("en-GB", { month: "short" });
            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="flex-shrink-0 bg-popover border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 min-w-[280px]"
              >
                <div className="w-14 text-center flex-shrink-0">
                  <div className="text-xs font-semibold text-primary uppercase">{dayName}</div>
                  <div className="font-heading text-2xl font-bold text-foreground leading-none mt-0.5">{dayNum}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{month}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 truncate">
                    {event.category}
                  </p>
                  <p className="font-semibold text-foreground text-sm leading-tight truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.time} · {event.location}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={
                      event.isFree
                        ? { background: "hsl(var(--olive) / 0.1)", color: "hsl(var(--olive))" }
                        : { background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }
                    }
                  >
                    {event.isFree ? t("Free", "Gratis") : `€${event.price}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── EVENT SERIES ─────────────────────────────────────────────

function EventSeriesSection() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Aftr Social Club", "Aftr Social Club")}
          </p>
          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ lineHeight: 1.15 }}
          >
            {t("5 formats. All year round.", "5 formatos. Todo el año.")}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
            {t(
              "Each series runs on a recurring schedule. Come once or subscribe to your favourites.",
              "Cada serie tiene un calendario recurrente. Ven una vez o suscríbete a tus favoritas."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventSeries.map((series, i) => (
            <Link
              key={series.id}
              to={`/series/${series.id}`}
              className={`group bg-popover rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col ${
                isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{series.emoji}</div>
                <div
                  className="w-3 h-3 rounded-full mt-1"
                  style={{ background: series.color }}
                />
              </div>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: series.color }}
              >
                {lang === "en" ? series.frequency : series.frequencyEs}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {lang === "en" ? series.name : series.nameEs}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                {lang === "en" ? series.description : series.descriptionEs}
              </p>
              <div className="flex items-center justify-between mt-5">
                <span className="text-xs font-semibold text-primary">
                  {t("See upcoming dates", "Ver próximas fechas")}
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/community">
            <Button variant="outline" size="lg">
              {t("Learn about membership", "Conocer membresía")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FOR WHOM ─────────────────────────────────────────────────

function ForWhom() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const audiences = [
    {
      icon: Globe,
      en: "You just moved to Alicante",
      es: "Acabas de llegar a Alicante",
      descEn: "And you want real friends — not just other expats. You want to actually belong somewhere.",
      descEs: "Y quieres amigos de verdad, no solo otros expatriados. Quieres pertenecer a algún lugar.",
    },
    {
      icon: Users,
      en: "You're a local curious about the world",
      es: "Eres local y sientes curiosidad por el mundo",
      descEn: "Practice English, meet people from 50+ countries, expand your network in your own city.",
      descEs: "Practica inglés, conoce gente de más de 50 países, amplía tu red en tu propia ciudad.",
    },
    {
      icon: Sparkles,
      en: "You work in tech or run something",
      es: "Trabajas en tech o tienes tu proyecto",
      descEn: "Digital Builders is your monthly tribe. Real conversations with people building real things.",
      descEs: "Digital Builders es tu tribu mensual. Conversaciones reales con personas que construyen.",
    },
    {
      icon: CalendarDays,
      en: "You want to do more on weekends",
      es: "Quieres hacer más los fines de semana",
      descEn: "Hikes, beach days, cultural nights, language exchange — all organized, all social.",
      descEs: "Senderismo, días de playa, noches culturales, intercambios — todo organizado y social.",
    },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("This is for you", "Esto es para ti")}
          </p>
          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ lineHeight: 1.15 }}
          >
            {t("You'll feel at home here if…", "Te sentirás como en casa si…")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((a, i) => (
            <div
              key={i}
              className={`bg-popover rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 ${
                isVisible ? `animate-reveal-up stagger-${i + 2}` : "opacity-0"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <a.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {t(a.en, a.es)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(a.descEn, a.descEs)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMMUNITY BUILDERS TEASER ────────────────────────────────

function CommunityBuilders() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const faces = [
    { initials: "JR", color: "#b85c24" },
    { initials: "CC", color: "#3f779d" },
    { initials: "PF", color: "#2d8c6b" },
    { initials: "AH", color: "#9b5d9e" },
    { initials: "AL", color: "#4b664a" },
  ];

  return (
    <section ref={ref} className="py-12 section-padding bg-warm-dark">
      <div
        className={`max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isVisible ? "animate-reveal-up" : "opacity-0"
        }`}
      >
        <div>
          <p
            className="text-sm uppercase tracking-widest mb-1"
            style={{ color: "hsl(var(--sand) / 0.45)" }}
          >
            {t("Built by real people", "Construido por personas reales")}
          </p>
          <h3
            className="font-heading text-xl sm:text-2xl font-bold"
            style={{ color: "hsl(var(--sand-light))" }}
          >
            {t("15 people building Aftr", "15 personas construyendo Aftr")}
          </h3>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--sand) / 0.5)" }}>
            {t("Volunteers & hosts from 8+ countries.", "Voluntarios y hosts de más de 8 países.")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {faces.map((f, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: f.color,
                  borderColor: "hsl(var(--warm-dark))",
                }}
              >
                {f.initials}
              </div>
            ))}
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{
                background: "hsl(var(--sand) / 0.15)",
                borderColor: "hsl(var(--warm-dark))",
                color: "hsl(var(--sand) / 0.7)",
              }}
            >
              +10
            </div>
          </div>
          <Link to="/community-builders">
            <Button variant="hero-outline" size="sm">
              {t("Meet the team", "Conocer el equipo")}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────

function NewsletterSection() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section ref={ref} className="py-20 lg:py-28 section-padding bg-primary">
      <div
        className={`max-w-3xl mx-auto text-center ${isVisible ? "animate-reveal-up" : "opacity-0"}`}
      >
        <h2
          className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4"
          style={{ lineHeight: 1.15 }}
        >
          {t(
            "Get weekly Alicante event picks — free",
            "Recibe selección semanal de eventos en Alicante — gratis"
          )}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          {t(
            "Drop your email. Every week we send the best upcoming events in Alicante province. No spam, unsubscribe any time.",
            "Deja tu email. Cada semana enviamos los mejores eventos próximos en la provincia. Sin spam, cancela cuando quieras."
          )}
        </p>

        {submitted ? (
          <div className="bg-primary-foreground/15 border border-primary-foreground/25 rounded-2xl px-8 py-6">
            <p className="text-primary-foreground text-lg font-semibold">
              {t("You're in! 🎉 Check your inbox for the first edition.", "¡Ya estás dentro! 🎉 Revisa tu bandeja de entrada.")}
            </p>
          </div>
        ) : (
          <>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("Your email address", "Tu dirección de email")}
                required
                className="flex-1 bg-primary-foreground/15 border border-primary-foreground/25 rounded-xl px-5 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
              />
              <Button type="submit" variant="hero-outline" className="shrink-0">
                {t("Subscribe", "Suscribirse")}
              </Button>
            </form>
            <p className="text-primary-foreground/40 text-xs mt-3">
              {t("No spam. Unsubscribe any time.", "Sin spam. Cancela cuando quieras.")}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <TrustStrip />
      <FeaturedEvents />
      <ThisWeek />
      <EventSeriesSection />
      <ForWhom />
      <CommunityBuilders />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
