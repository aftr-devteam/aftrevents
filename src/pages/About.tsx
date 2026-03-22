import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export default function About() {
  const { t } = useLang();
  const { ref: ref1, isVisible: v1 } = useScrollReveal();
  const { ref: ref2, isVisible: v2 } = useScrollReveal();
  const { ref: ref3, isVisible: v3 } = useScrollReveal();
  const { ref: ref4, isVisible: v4 } = useScrollReveal();
  const { ref: ref5, isVisible: v5 } = useScrollReveal();

  const timeline = [
    {
      year: "2021",
      en: "Born in Elche",
      es: "Nacido en Elche",
      descEn: "A small language exchange group starts meeting after work in Elche. The energy is infectious, and 'Aftr' begins to take shape.",
      descEs: "Un pequeño grupo de intercambio de idiomas empieza a reunirse después del trabajo en Elche. La energía es contagiosa y 'Aftr' empieza a tomar forma.",
    },
    {
      year: "2023",
      en: "Expansion to Alicante",
      es: "Expansión a Alicante",
      descEn: "The community grows beyond language exchange.",
      descEs: "La comunidad crece más allá del intercambio de idiomas.",
    },
    {
      year: "2024",
      en: "Institutional Recognition",
      es: "Reconocimiento de instituciones",
      descEn: "Recognised by Acción Contra el Hambre and Cámara de Comercio for social integration work. Community crosses 2,000 active members.",
      descEs: "Reconocidos por Acción Contra el Hambre y la Cámara de Comercio por el trabajo de integración social. La comunidad supera los 2.000 miembros activos.",
    },
    {
      year: "2026",
      en: "Formalising & scaling",
      es: "Formalización y crecimiento",
      descEn: "Aftr Events is established as a professional organization. Memberships, venue partnerships, and expansion planned across the province.",
      descEs: "Aftr Events se establece como organización profesional. Se planifican membresías, colaboraciones con locales y expansión por la provincia.",
    },
  ];

  const stats = [
    { value: "2.220+", labelEn: "active members",     labelEs: "miembros activos" },
    { value: "250+",   labelEn: "events organized",   labelEs: "eventos organizados" },
    { value: "8–12",   labelEn: "events every month", labelEs: "eventos cada mes" },
    { value: "5+",     labelEn: "venue partners",     labelEs: "locales colaboradores" },
  ];

  const recognition = [
    {
      org: "Acción Contra el Hambre",
      year: "2025",
      descEn: "Recognised for bilateral social integration work in Alicante.",
      descEs: "Reconocidos por el trabajo de integración social bilateral en Alicante.",
    },
    {
      org: "Cámara de Comercio",
      year: "2026",
      descEn: "Recognised as an active community contributor to the local economy.",
      descEs: "Reconocidos como contribuidor activo de la comunidad a la economía local.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={hero2} alt="Aftr community" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-center section-padding max-w-5xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
            style={{ color: "hsl(var(--sand) / 0.8)" }}
          >
            {t("Since 2021 · Alicante Province", "Desde 2021 · Provincia de Alicante")}
          </p>
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-5 animate-reveal-up stagger-1"
            style={{ color: "hsl(var(--sand-light))" }}
          >
            {t("Built for the people who show up", "Construido para la gente que aparece")}
          </h1>
          <p
            className="text-lg max-w-2xl animate-reveal-up stagger-2"
            style={{ color: "hsl(var(--sand) / 0.75)" }}
          >
            {t(
              "Aftr started as a language exchange club in Elche. Today it's Alicante province's most active bilateral community — 60% international, 40% local, 100% real.",
              "Aftr empezó como un club de intercambio de idiomas en Elche. Hoy es la comunidad bilateral más activa de la provincia de Alicante — 60% internacional, 40% local, 100% real."
            )}
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-warm-dark section-padding py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="font-heading text-3xl sm:text-4xl font-bold" style={{ color: "hsl(38 95% 64%)" }}>
                {s.value}
              </div>
              <div className="text-sm mt-1" style={{ color: "hsl(var(--sand) / 0.55)" }}>
                {t(s.labelEn, s.labelEs)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <section ref={ref1} className="py-16 lg:py-24 section-padding">
        <div className={`max-w-5xl mx-auto ${v1 ? "animate-reveal-up" : "opacity-0"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                {t("Our mission", "Nuestra misión")}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ lineHeight: 1.15 }}>
                {t(
                  "Eliminate social segregation in Spain's multicultural cities",
                  "Eliminar la segregación social en las ciudades multiculturales de España"
                )}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t(
                  "Most communities serve either locals or internationals. We serve both — because real integration only happens when both sides show up. Our events are designed so that everyone leaves with connections they couldn't have made anywhere else.",
                  "La mayoría de comunidades sirven a locales o a internacionales. Nosotros servimos a ambos — porque la integración real solo ocurre cuando los dos lados aparecen. Nuestros eventos están diseñados para que todos se vayan con conexiones que no podrían haber hecho en ningún otro lugar."
                )}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  "We're not an app. We're not an algorithm. We're a team of real people who show up every week and make it happen.",
                  "No somos una app. No somos un algoritmo. Somos un equipo de personas reales que aparece cada semana y lo hace posible."
                )}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <img src={hero3} alt="Aftr community event" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section ref={ref2} className="py-16 lg:py-24 section-padding bg-warm-gradient">
        <div className={`max-w-5xl mx-auto ${v2 ? "animate-reveal-up" : "opacity-0"}`}>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              {t("Our story", "Nuestra historia")}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
              {t("How Aftr got here", "Cómo llegó Aftr hasta aquí")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {timeline.map((item, i) => (
              <div
                key={i}
                className={`bg-popover rounded-2xl border border-border p-7 ${v2 ? `animate-reveal-up stagger-${Math.min(i + 1, 4)}` : "opacity-0"}`}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full font-heading font-bold text-sm text-white mb-4"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  {item.year}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {t(item.en, item.es)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(item.descEn, item.descEs)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section ref={ref3} className="py-16 lg:py-24 section-padding">
        <div className={`max-w-5xl mx-auto ${v3 ? "animate-reveal-up" : "opacity-0"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Team photo placeholder */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
              <img src={hero1} alt="The Aftr team" className="w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, hsl(var(--warm-dark) / 0.7) 0%, transparent 60%)" }}
              />
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {["#b85c24","#3f779d","#2d8c6b","#9b5d9e","#4b664a"].map((c, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                        style={{ background: c, borderColor: "hsl(var(--warm-dark))" }}
                      />
                    ))}
                    <div
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--warm-dark))", color: "hsl(var(--muted-foreground))" }}
                    >
                      +10
                    </div>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm">
                  {t("15 people · 8+ nationalities", "15 personas · 8+ nacionalidades")}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                {t("The team", "El equipo")}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-5" style={{ lineHeight: 1.15 }}>
                {t("Locals and internationals — building together", "Locales e internacionales — construyendo juntos")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t(
                  "Aftr is run by a team of 15 volunteers and contributors from across the world — event hosts, designers, strategists, community builders — all based in Alicante and united by the belief that real communities are built in person.",
                  "Aftr está dirigido por un equipo de 15 voluntarios y colaboradores de todo el mundo — hosts de eventos, diseñadores, estrategas, constructores de comunidad — todos con base en Alicante y unidos por la creencia de que las comunidades reales se construyen en persona."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/people">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("Meet the people of Aftr", "Conocer a la gente de Aftr")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a href="mailto:afterworkclubinternational@gmail.com">
                  <Button variant="outline" size="lg">
                    {t("Join the team", "Unirse al equipo")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECOGNITION ── */}
      <section ref={ref4} className="py-16 section-padding bg-warm-gradient">
        <div className={`max-w-5xl mx-auto ${v4 ? "animate-reveal-up" : "opacity-0"}`}>
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              {t("Recognition", "Reconocimientos")}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground" style={{ lineHeight: 1.2 }}>
              {t("Recognised for our impact", "Reconocidos por nuestro impacto")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {recognition.map((r, i) => (
              <div
                key={i}
                className={`bg-popover rounded-2xl border border-border p-6 ${v4 ? `animate-reveal-up stagger-${i + 1}` : "opacity-0"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">🏆</div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">{r.org}</div>
                    <div className="text-xs text-primary font-semibold mb-2">{r.year}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(r.descEn, r.descEs)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR BUSINESSES ── */}
      <section ref={ref5} className="py-16 lg:py-24 section-padding">
        <div className={`max-w-5xl mx-auto ${v5 ? "animate-reveal-up" : "opacity-0"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                {t("For businesses", "Para empresas")}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ lineHeight: 1.15 }}>
                {t("We also work with venues and brands", "También trabajamos con locales y marcas")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t(
                  "Beyond the community, Aftr Events offers professional event organization, IRL community management, and digital marketing services for venues, brands, and institutions in Alicante province.",
                  "Más allá de la comunidad, Aftr Events ofrece organización profesional de eventos, gestión de comunidades IRL y servicios de marketing digital para locales, marcas e instituciones en la provincia de Alicante."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/collaborate">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("Work with us", "Trabajar con nosotros")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a href="mailto:afterworkclubinternational@gmail.com">
                  <Button variant="outline" size="lg">{t("Contact us", "Contacta con nosotros")}</Button>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { value: "30–50", labelEn: "attendees guaranteed per event",     labelEs: "asistentes garantizados por evento",         icon: "👥" },
                { value: "€300–600", labelEn: "revenue impact per 2-hour event", labelEs: "impacto en ingresos por evento de 2 horas",   icon: "💶" },
                { value: "60%+", labelEn: "of attendees are first-time visitors", labelEs: "de los asistentes son visitantes nuevos",     icon: "🆕" },
                { value: "5+",   labelEn: "active venue partners in Alicante",   labelEs: "locales colaboradores activos en Alicante",   icon: "🏠" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 bg-popover border border-border rounded-xl px-5 py-4 ${v5 ? `animate-reveal-up stagger-${i + 1}` : "opacity-0"}`}
                >
                  <div className="text-2xl flex-shrink-0">{stat.icon}</div>
                  <div>
                    <div className="font-heading text-xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{t(stat.labelEn, stat.labelEs)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 section-padding bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4" style={{ lineHeight: 1.15 }}>
            {t("Come say hello", "Ven a saludar")}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            {t(
              "We're always happy to meet new people — online or at the next event.",
              "Siempre estamos felices de conocer gente nueva — online o en el próximo evento."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" style={{ background: "#fff", color: "hsl(var(--primary))", fontWeight: 700 }}>
                {t("Browse events", "Ver eventos")}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <a href="mailto:afterworkclubinternational@gmail.com">
              <Button variant="hero-outline" size="lg">{t("Contact us", "Contacta con nosotros")}</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
