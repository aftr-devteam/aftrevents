import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Instagram, Linkedin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCommunityBuilders } from "@/hooks/useEvents";
import { AftrBadge, getBadgesForProfile } from "@/components/AftrBadge";
import { foundingDaysRemaining, isFoundingPeriodActive } from "@/lib/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SEARCH_TAGS = [
  "All", "Community", "Events", "Languages", "Tech & Digital",
  "Branding & Design", "Creative & Culture", "Outdoor", "Strategy",
];

export default function BuildersConnectors() {
  const { t, lang }       = useLang();
  const { ref, isVisible } = useScrollReveal();
  const { builders, loading } = useCommunityBuilders();

  const [search, setSearch]     = useState("");
  const [tagFilter, setTagFilter] = useState("All");

  const foundingActive = isFoundingPeriodActive();
  const daysLeft       = foundingDaysRemaining();

  const filtered = builders.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (b.full_name ?? "").toLowerCase().includes(q) ||
      (b.bio ?? "").toLowerCase().includes(q);
    const matchTag = tagFilter === "All"; // tags filter works once profiles have tags
    return matchSearch && matchTag;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-warm-dark section-padding pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
            style={{ color: "hsl(var(--sand))" }}>
            {t("Aftr Social Club", "Aftr Social Club")}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
            style={{ color: "hsl(var(--sand-light))" }}>
            {t("Builders & Connectors", "Builders & Connectors")}
          </h1>
          <p className="text-lg max-w-2xl mb-10 animate-reveal-up stagger-2"
            style={{ color: "hsl(var(--sand) / 0.7)" }}>
            {t(
              "The people who make Aftr happen — locals and internationals from 8+ countries, building community in Alicante every week.",
              "Las personas que hacen posible Aftr — locales e internacionales de más de 8 países, construyendo comunidad en Alicante cada semana."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 animate-reveal-up stagger-3">
            <a href="mailto:afterworkclubinternational@gmail.com?subject=Aftr Host Application">
              <Button variant="hero" size="lg">
                {t("Apply to be a Host", "Solicitar ser Host")}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </a>
            <Link to="/apply-role">
              <Button variant="hero-outline" size="lg">
                {t("See all ways to join", "Ver formas de unirse")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-warm-dark border-t section-padding py-5"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
          {[
            { value: "15+", labelEn: "active builders", labelEs: "builders activos" },
            { value: "8+",  labelEn: "nationalities",   labelEs: "nacionalidades" },
            { value: "250+",labelEn: "events together", labelEs: "eventos juntos" },
            { value: "2021",labelEn: "since",           labelEs: "desde" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold"
                style={{ color: "hsl(var(--sand-light))" }}>{s.value}</span>
              <span className="text-sm" style={{ color: "hsl(var(--sand) / 0.5)" }}>
                {t(s.labelEn, s.labelEs)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOUNDING URGENCY BANNER ── */}
      {foundingActive && (
        <div className="section-padding py-4"
          style={{ background: "rgba(255,194,74,0.07)", borderBottom: "1px solid rgba(255,194,74,0.2)" }}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground text-sm">
                ⭐ {t("Founding Builder offer — €10 / 6 months", "Oferta Builder Fundador — €10 / 6 meses")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "en"
                  ? `${daysLeft} days left · closes 31 December 2026 · same full Builder benefits`
                  : `${daysLeft} días restantes · cierra el 31 dic 2026 · mismos beneficios completos Builder`
                }
              </p>
            </div>
            <Link to="/apply-role?role=builder">
              <Button size="sm" style={{ background: "#ffc24a", color: "#272727", fontWeight: 700 }}>
                {t(`${daysLeft} days left — apply now`, `${daysLeft} días — solicitar ahora`)}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── SEARCH + FILTERS ── */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto section-padding py-4">
          <div className="relative max-w-lg mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("Search by name, expertise, or service…", "Buscar por nombre, experiencia o servicio…")}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="flex flex-wrap gap-2">
            {SEARCH_TAGS.map(tag => (
              <button key={tag} onClick={() => setTagFilter(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  tagFilter === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-popover text-muted-foreground border-border hover:border-primary/40"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PEOPLE GRID ── */}
      <section ref={ref} className="py-12 lg:py-20 section-padding">
        <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 && !search ? (
            // No builders in DB yet — show placeholder state
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                {t("Builders coming soon", "Builders próximamente")}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {t(
                  "We're building our team. Apply to be one of the first.",
                  "Estamos construyendo nuestro equipo. Solicita ser uno de los primeros."
                )}
              </p>
              <Link to="/apply-role">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("Apply now", "Solicitar ahora")} →
                </Button>
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-3">{t("No one found for that search.", "Nadie encontrado para esa búsqueda.")}</p>
              <button onClick={() => setSearch("")} className="text-primary font-semibold text-sm hover:underline">
                {t("Clear search", "Limpiar búsqueda")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((builder, i) => {
                const badges  = getBadgesForProfile(builder);
                const initials = builder.full_name
                  ? builder.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                  : "?";

                return (
                  <Link key={builder.id} to={`/profile/${builder.id}`}
                    className={`group bg-popover rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col ${
                      isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"
                    }`}>
                    {/* Avatar + flag */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {builder.avatar_url
                          ? <img src={builder.avatar_url} alt={builder.full_name ?? ""} className="w-full h-full object-cover" />
                          : <span className="font-heading text-lg font-bold text-primary">{initials}</span>
                        }
                      </div>
                      <span className="text-2xl">
                        {builder.nationality?.slice(0, 2) ?? "🌍"}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {builder.full_name}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {badges.map(b => <AftrBadge key={b} type={b} size="xs" />)}
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                      {builder.bio ?? ""}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {builder.city ?? "Alicante"}
                      </span>
                      <div className="flex items-center gap-2">
                        {builder.instagram_handle && (
                          <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                          </span>
                        )}
                        {builder.linkedin_url && (
                          <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* "This could be you" placeholder cards */}
              {Array.from({ length: Math.max(0, 4 - filtered.length) }).map((_, i) => (
                <Link key={`placeholder-${i}`} to="/apply-role"
                  className="bg-muted/40 rounded-2xl p-6 border border-dashed border-border flex flex-col items-center justify-center text-center min-h-[220px] hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <div className="text-3xl mb-2">🤝</div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t("This could be you", "Esto podrías ser tú")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("Apply to join →", "Solicitar unirse →")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section className="py-16 section-padding bg-warm-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4" style={{ lineHeight: 1.2 }}>
            {t("Want to be one of these people?", "¿Quieres ser una de estas personas?")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(
              "Apply as a Connector (free host) or Builder (post your own events). Both roles get you featured here and in front of the Aftr community.",
              "Solicita ser Connector (host gratuito) o Builder (publica tus propios eventos). Ambos roles te destacan aquí y ante la comunidad Aftr."
            )}
          </p>
          <Link to="/apply-role">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("See collaboration options", "Ver opciones de colaboración")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
