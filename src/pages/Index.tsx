import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, Sparkles, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  usePublishedEvents,
  useThisWeekEvents,
  type DbEvent,
  type EventFilters,
} from "@/hooks/useEvents";
import { eventSeries } from "@/lib/eventData";
import HeroCarousel from "@/components/HeroCarousel";

// ─── SHARED EVENT CARD ────────────────────────────────────────
// Renders a real DbEvent from Supabase (not the old static type)

function LiveEventCard({ event }: { event: DbEvent }) {
  const { lang, t } = useLang();

  const title = lang === "en" ? event.title : (event.title_es ?? event.title);
  const desc  = lang === "en" ? event.description : (event.description_es ?? event.description);

  const dateStr = new Date(event.event_date).toLocaleDateString(
    lang === "en" ? "en-GB" : "es-ES",
    { weekday: "short", day: "numeric", month: "short" }
  );

  const spotsLeft = event.total_spots
    ? event.total_spots - event.spots_reserved
    : null;

  const almostFull = spotsLeft !== null && spotsLeft <= 6;

  const categoryColors: Record<string, string> = {
    chat:    "#b85c24",
    digital: "#3f779d",
    lingo:   "#4b664a",
    hub:     "#9b5d9e",
    unplug:  "#2d8c6b",
    other:   "#888",
  };
  const color = categoryColors[event.category_key] ?? "#888";

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-popover rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Color strip */}
      <div className="h-1.5" style={{ background: color }} />

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            {{ chat: "🗣️", digital: "💻", lingo: "🌐", hub: "🎨", unplug: "🏔️" }[event.category_key] ?? "📅"}
          </div>
        )}

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-popover/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground">{dateStr}</span>
        </div>

        {/* Price badge */}
        <div className={`absolute top-3 right-3 rounded-lg px-3 py-1.5 ${event.is_free ? "bg-olive" : "bg-primary"}`}>
          <span className="text-sm font-bold text-white">
            {event.is_free ? t("Free", "Gratis") : `€${event.price_euros}`}
          </span>
        </div>

        {/* Almost full */}
        {almostFull && (
          <div className="absolute bottom-3 left-3 bg-destructive/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-xs font-medium text-white">
              ⚡ {t(`${spotsLeft} spots left`, `${spotsLeft} plazas`)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          {event.category_label ?? event.category_key}
        </p>
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{desc}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{event.venue_name} · {event.city}</span>
          <span>{event.start_time.slice(0, 5)}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── SKELETON CARD ────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-popover rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="h-1.5 bg-muted" />
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
}

// ─── TRUST STRIP ──────────────────────────────────────────────

function TrustStrip() {
  const { t } = useLang();
  return (
    <div className="bg-warm-dark section-padding py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {[
            { value: "2.220+", labelEn: "active members",     labelEs: "miembros activos" },
            { value: "250+",   labelEn: "events since 2021",  labelEs: "eventos desde 2021" },
            { value: "60/40",  labelEn: "international/local",labelEs: "internacional/local" },
            { value: "5+",     labelEn: "venue partners",     labelEs: "locales colaboradores" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold" style={{ color: "hsl(var(--sand-light))" }}>
                {s.value}
              </span>
              <span className="text-sm" style={{ color: "hsl(var(--sand) / 0.55)" }}>
                {t(s.labelEn, s.labelEs)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-widest" style={{ color: "hsl(var(--sand) / 0.35)" }}>
            {t("Recognised by", "Reconocidos por")}
          </span>
          {["Acción Contra el Hambre", "Cámara de Comercio"].map((b, i) => (
            <span key={i} className="text-sm font-medium" style={{ color: "hsl(var(--sand) / 0.65)" }}>
              {b}{i === 0 && <span style={{ color: "hsl(var(--sand) / 0.25)", marginLeft: "0.5rem" }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEATURED EVENTS ──────────────────────────────────────────

// Generic discovery categories — what people actually search for,
// not Aftr's internal brand names. Maps to category_key in the DB.
const CATEGORIES = [
  { key: "all",      labelEn: "All",               labelEs: "Todos" },
  { key: "social",   labelEn: "Social & Meetups",  labelEs: "Social y Meetups",   dbKeys: ["chat"] },
  { key: "tech",     labelEn: "Tech & Digital",    labelEs: "Tech y Digital",      dbKeys: ["digital"] },
  { key: "language", labelEn: "Language Exchange", labelEs: "Intercambio de idiomas", dbKeys: ["lingo"] },
  { key: "arts",     labelEn: "Arts & Culture",    labelEs: "Arte y Cultura",      dbKeys: ["hub"] },
  { key: "outdoor",  labelEn: "Outdoor & Active",  labelEs: "Aire libre y Deporte",dbKeys: ["unplug"] },
];

// Maps generic filter key → DB category_key(s) for the query
function categoryKeyForFilter(key: string): string | undefined {
  if (key === "all") return undefined;
  const cat = CATEGORIES.find(c => c.key === key);
  return cat?.dbKeys?.[0];
}

function FeaturedEvents() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  const [activeCategory, setActiveCategory] = useState("all");
  const [showFree, setShowFree]             = useState<boolean | null>(null);

  const filters: EventFilters = {
    limit: 6,
    ...(activeCategory !== "all" && { categoryKey: categoryKeyForFilter(activeCategory) }),
    ...(showFree !== null && { isFree: showFree }),
  };

  const { events, loading } = usePublishedEvents(filters);
  const hasFilters = activeCategory !== "all" || showFree !== null;

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">
              {t("Upcoming in Alicante & Elche", "Próximos en Alicante y Elche")}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
              {t("Events this month", "Eventos este mes")}
            </h2>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm">
              {t("View all", "Ver todos")} <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-popover text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {lang === "en" ? cat.labelEn : cat.labelEs}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <button
            onClick={() => setShowFree(showFree === true ? null : true)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              showFree === true ? "bg-olive text-white border-olive" : "bg-popover text-muted-foreground border-border hover:border-olive/40"
            }`}
          >
            {t("Free", "Gratis")}
          </button>
          <button
            onClick={() => setShowFree(showFree === false ? null : false)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              showFree === false ? "bg-primary text-white border-primary" : "bg-popover text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {t("Paid", "De pago")}
          </button>
          {hasFilters && (
            <button onClick={() => { setActiveCategory("all"); setShowFree(null); }}
              className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
              {t("Clear", "Limpiar")} ✕
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-muted-foreground mb-3">
              {t("No events match this filter.", "Ningún evento coincide con este filtro.")}
            </p>
            <button onClick={() => { setActiveCategory("all"); setShowFree(null); }}
              className="text-primary font-semibold text-sm hover:underline">
              {t("Clear filters", "Limpiar filtros")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => <LiveEventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── THIS WEEK STRIP ──────────────────────────────────────────

function ThisWeek() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();
  const { events, loading } = useThisWeekEvents();

  if (!loading && events.length === 0) return null;

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
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 min-w-[280px] h-20 bg-muted rounded-2xl animate-pulse" />
              ))
            : events.map(event => {
                const d = new Date(event.event_date);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex-shrink-0 bg-popover border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-primary/30 transition-all min-w-[280px]"
                  >
                    <div className="w-14 text-center flex-shrink-0">
                      <div className="text-xs font-semibold text-primary uppercase">
                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                      </div>
                      <div className="font-heading text-2xl font-bold text-foreground leading-none mt-0.5">{d.getDate()}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {d.toLocaleDateString("en-GB", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 truncate">
                        {event.category_label ?? event.category_key}
                      </p>
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.start_time.slice(0, 5)} · {event.venue_name}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
                      style={event.is_free
                        ? { background: "hsl(var(--olive) / 0.1)", color: "hsl(var(--olive))" }
                        : { background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }
                      }
                    >
                      {event.is_free ? t("Free", "Gratis") : `€${event.price_euros}`}
                    </span>
// ─── EVENT SERIES CAROUSEL ────────────────────────────────────

function EventSeriesSection() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);

  const series = eventSeries;
  const current = series[active];
  if (!current) return null;

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Aftr Social Club", "Aftr Social Club")}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
            {t("5 formats. All year round.", "5 formatos. Todo el año.")}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
            {t(
              "Recurring events you can come back to every week or month.",
              "Eventos recurrentes a los que puedes volver cada semana o mes."
            )}
          </p>
        </div>

        {/* Carousel */}
        <div className="bg-popover rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">

            {/* Left: photo */}
            <div className="relative overflow-hidden bg-muted min-h-[240px] lg:min-h-0">
              {/* Color overlay matching series */}
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{ background: `${current.color}22` }}
              />
              {/* Placeholder visual — replace with real event photos */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl shadow-xl"
                  style={{ background: `${current.color}18`, border: `2px solid ${current.color}30` }}
                >
                  {current.emoji}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                  style={{ background: `${current.color}15`, color: current.color }}
                >
                  {lang === "en" ? current.frequency : current.frequencyEs}
                </div>
              </div>
              {/* Add a real cover image by setting series.coverImage in eventData.ts:
                  {current.coverImage && (
                    <img src={current.coverImage} alt="" className="w-full h-full object-cover" />
                  )} */}
            </div>

            {/* Right: info */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: current.color }}
                >
                  {lang === "en" ? current.frequency : current.frequencyEs}
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3" style={{ lineHeight: 1.15 }}>
                  {lang === "en" ? current.name : current.nameEs}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {lang === "en" ? current.description : current.descriptionEs}
                </p>

                {/* Quick info pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: "📅", label: lang === "en" ? current.frequency : current.frequencyEs },
                    { icon: "📍", label: "Alicante & Elche" },
                    { icon: "🆓", label: t("Free to attend", "Gratis para asistir") },
                  ].map((pill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted text-foreground font-medium"
                    >
                      <span>{pill.icon}</span>
                      {pill.label}
                    </span>
                  ))}
                </div>

                <Link to={`/events?category=${current.categoryKey ?? current.id}`}>
                  <button
                    className="flex items-center gap-2 font-semibold text-sm transition-colors"
                    style={{ color: current.color }}
                  >
                    {t("Browse upcoming dates", "Ver próximas fechas")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Dot navigation */}
              <div className="flex items-center gap-3 mt-8">
                {series.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    title={lang === "en" ? s.name : s.nameEs}
                    className="flex items-center gap-2 transition-all duration-200"
                  >
                    <div
                      className="rounded-full transition-all duration-300 flex items-center justify-center"
                      style={{
                        width:  i === active ? "2.5rem" : "2rem",
                        height: i === active ? "2.5rem" : "2rem",
                        background: i === active ? current.color : "hsl(var(--muted))",
                        fontSize: i === active ? "1rem" : "0.8rem",
                      }}
                    >
                      {s.emoji}
                    </div>
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  {active + 1} / {series.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/community">
            <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mx-auto">
              {t("Learn about membership", "Conocer membresía")}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
              <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {lang === "en" ? series.name : series.nameEs}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                {lang === "en" ? series.description : series.descriptionEs}
              </p>
              <div className="flex items-center justify-between mt-5">
                <span className="text-xs font-semibold text-primary">
                  {t("Browse events", "Ver eventos")}
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
    { icon: Globe,       en: "You just moved to Alicante",         es: "Acabas de llegar a Alicante",            descEn: "And you want real friends — not just other expats.",               descEs: "Y quieres amigos de verdad, no solo otros expatriados." },
    { icon: Users,       en: "You're a local curious about the world", es: "Eres local y sientes curiosidad",    descEn: "Practice English, meet people from 50+ countries.",                descEs: "Practica inglés, conoce gente de más de 50 países." },
    { icon: Sparkles,    en: "You work in tech or run something",   es: "Trabajas en tech o tienes tu proyecto",  descEn: "Digital Builders is your monthly tribe.",                          descEs: "Digital Builders es tu tribu mensual." },
    { icon: CalendarDays,en: "You want to do more on weekends",     es: "Quieres hacer más los fines de semana", descEn: "Hikes, beach days, cultural nights — all organized.",               descEs: "Senderismo, días de playa, noches culturales — todo organizado." },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">{t("This is for you", "Esto es para ti")}</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
            {t("You'll feel at home here if…", "Te sentirás como en casa si…")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((a, i) => (
            <div key={i} className={`bg-popover rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 ${isVisible ? `animate-reveal-up stagger-${i + 2}` : "opacity-0"}`}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <a.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{t(a.en, a.es)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(a.descEn, a.descEs)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMMUNITY BUILDERS TEASER ────────────────────────────────

function CommunityBuilderTeaser() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const faces = [
    { initials: "JR", color: "#b85c24" }, { initials: "CC", color: "#3f779d" },
    { initials: "PF", color: "#2d8c6b" }, { initials: "AH", color: "#9b5d9e" },
    { initials: "AL", color: "#4b664a" },
  ];

  return (
    <section ref={ref} className="py-12 section-padding bg-warm-dark">
      <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div>
          <p className="text-sm uppercase tracking-widest mb-1" style={{ color: "hsl(var(--sand) / 0.45)" }}>
            {t("Built by real people", "Construido por personas reales")}
          </p>
          <h3 className="font-heading text-xl sm:text-2xl font-bold" style={{ color: "hsl(var(--sand-light))" }}>
            {t("15 people building Aftr", "15 personas construyendo Aftr")}
          </h3>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--sand) / 0.5)" }}>
            {t("Volunteers & hosts from 8+ countries.", "Voluntarios y hosts de más de 8 países.")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {faces.map((f, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: f.color, borderColor: "hsl(var(--warm-dark))" }}>
                {f.initials}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{ background: "hsl(var(--sand) / 0.15)", borderColor: "hsl(var(--warm-dark))", color: "hsl(var(--sand) / 0.7)" }}>
              +10
            </div>
          </div>
          <Link to="/builders-connectors">
            <Button variant="hero-outline" size="sm">
              {t("Meet the team", "Conocer el equipo")} <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

  return (
    <section ref={ref} className="py-20 lg:py-28 section-padding bg-primary">
      <div className={`max-w-3xl mx-auto text-center ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4" style={{ lineHeight: 1.15 }}>
          {t("Get weekly Alicante event picks — free", "Recibe selección semanal de eventos — gratis")}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          {t("Drop your email. No spam, unsubscribe any time.", "Deja tu email. Sin spam, cancela cuando quieras.")}
        </p>
        {submitted ? (
          <div className="bg-primary-foreground/15 border border-primary-foreground/25 rounded-2xl px-8 py-6">
            <p className="text-primary-foreground text-lg font-semibold">
              {t("You're in! 🎉 Check your inbox.", "¡Ya estás dentro! 🎉 Revisa tu bandeja.")}
            </p>
          </div>
        ) : (
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder={t("Your email address", "Tu dirección de email")}
              className="flex-1 bg-primary-foreground/15 border border-primary-foreground/25 rounded-xl px-5 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50" />
            <Button type="submit" variant="hero-outline" className="shrink-0">
              {t("Subscribe", "Suscribirse")}
            </Button>
          </form>
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
      <CommunityBuilderTeaser />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
