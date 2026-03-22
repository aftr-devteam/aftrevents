import { Link } from "react-router-dom";
import { ArrowRight, Check, Users, Globe, Sparkles, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { eventSeries } from "@/lib/eventData";

// ─── HERO ─────────────────────────────────────────────────────

function Hero() {
  const { t } = useLang();
  return (
    <section className="bg-warm-dark section-padding py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
          style={{ color: "hsl(var(--sand))" }}>
          {t("Aftr Social Club", "Aftr Social Club")}
        </p>
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
          style={{ color: "hsl(var(--sand-light))" }}
        >
          {t(
            "Where Alicante's locals and\ninternationals actually meet",
            "Donde locales e internacionales\nde Alicante se encuentran de verdad"
          )}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mb-10 animate-reveal-up stagger-2"
          style={{ color: "hsl(var(--sand) / 0.75)" }}
        >
          {t(
            "5 event formats. All year. Open to everyone — locals, internationals, and everyone in between.",
            "5 formatos de eventos. Todo el año. Abierto a todos — locales, internacionales y todos los que hay en medio."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-reveal-up stagger-3">
          <Link to="/events">
            <Button variant="hero" size="lg">
              {t("Browse events", "Ver eventos")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/events?filter=week">
            <Button variant="hero-outline" size="lg">
              {t("See this week", "Ver esta semana")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── BILATERAL SPLIT ──────────────────────────────────────────

function BilateralSplit() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const internationalBenefits = [
    t("Make real local friends — not just other expats", "Haz amigos locales de verdad — no solo otros expatriados"),
    t("Practice Spanish in a relaxed, judgment-free setting", "Practica español en un ambiente relajado y sin juicios"),
    t("Feel at home in Alicante, not just passing through", "Siéntete como en casa en Alicante, no solo de paso"),
    t("Access professional networks in your new city", "Accede a redes profesionales en tu nueva ciudad"),
    t("Discover Alicante like a local — not a tourist", "Descubre Alicante como un local — no como turista"),
  ];

  const localBenefits = [
    t("Practice English and other languages every week", "Practica inglés y otros idiomas cada semana"),
    t("Connect with international professionals in your city", "Conecta con profesionales internacionales en tu ciudad"),
    t("Expand your global network without leaving Alicante", "Amplía tu red global sin salir de Alicante"),
    t("Meet fascinating people from 50+ countries", "Conoce gente fascinante de más de 50 países"),
    t("Be part of Alicante's most active multicultural community", "Sé parte de la comunidad multicultural más activa de Alicante"),
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* For internationals */}
          <div className="rounded-3xl p-8 lg:p-10 bg-warm-dark">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="font-heading text-2xl font-bold mb-6" style={{ color: "hsl(var(--sand-light))" }}>
              {t("For internationals", "Para internacionales")}
            </h3>
            <ul className="space-y-4">
              {internationalBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed" style={{ color: "hsl(var(--sand) / 0.75)" }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For locals */}
          <div className="rounded-3xl p-8 lg:p-10 bg-popover border border-border">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t("For locals", "Para locales")}
            </h3>
            <ul className="space-y-4">
              {localBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5 EVENT FORMATS ──────────────────────────────────────────

function EventFormats() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Our formats", "Nuestros formatos")}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
            {t("5 event formats. All year round.", "5 formatos de eventos. Todo el año.")}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
            {t(
              "Each series runs on a recurring schedule. Come once or come every week — both are welcome.",
              "Cada serie tiene un calendario recurrente. Ven una vez o cada semana — ambas opciones son bienvenidas."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventSeries.map((series, i) => (
            <div
              key={series.id}
              className={`bg-popover rounded-2xl p-7 border border-border hover:shadow-lg transition-all duration-500 flex flex-col ${isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{series.emoji}</div>
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: series.colorAccent }} />
              </div>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: series.colorAccent }}
              >
                {lang === "en" ? series.frequency : series.frequencyEs}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {lang === "en" ? series.name : series.nameEs}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {lang === "en" ? series.description : series.descriptionEs}
              </p>
              <Link
                to={`/series/${series.id}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-200"
              >
                {t("See upcoming dates", "Ver próximas fechas")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MEMBERSHIP TIERS ─────────────────────────────────────────

function MembershipTiers() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const tiers = [
    {
      badge: t("Free forever", "Gratis siempre"),
      badgeStyle: { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" },
      name: "Wanderer",
      tagline: t("You're exploring — no commitment", "Estás explorando — sin compromiso"),
      price: "€0",
      priceNote: t("Join any time, no credit card", "Únete cuando quieras, sin tarjeta"),
      benefits: [
        t("2 events per month", "2 eventos por mes"),
        t("Join our WhatsApp community", "Únete a nuestra comunidad de WhatsApp"),
        t("Access to all event listings", "Acceso a todos los eventos"),
      ],
      cta: t("Join on Meetup", "Únete en Meetup"),
      ctaHref: "https://www.meetup.com/afterwork-club-international/",
      ctaExternal: true,
      featured: false,
    },
    {
      badge: t("Most popular", "Más popular"),
      badgeStyle: { background: "hsl(38 95% 64%)", color: "hsl(var(--warm-dark))" },
      name: "Local",
      tagline: t("You belong here — you show up", "Perteneces aquí — tú apareces"),
      price: t("Coming soon", "Próximamente"),
      priceNote: t("Founding rate for early members", "Tarifa fundacional para primeros miembros"),
      benefits: [
        t("Unlimited events all month", "Eventos ilimitados todo el mes"),
        t("Member discounts at partner venues", "Descuentos en locales colaboradores"),
        t("Early access to special events", "Acceso anticipado a eventos especiales"),
        t("Aftr member profile", "Perfil de miembro Aftr"),
      ],
      cta: t("Get notified", "Recibir aviso"),
      ctaHref: "mailto:afterworkclubinternational@gmail.com",
      ctaExternal: false,
      featured: true,
    },
    {
      badge: t("Networker", "Networker"),
      badgeStyle: { background: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" },
      name: "Connector",
      tagline: t("You make things happen", "Tú haces que las cosas pasen"),
      price: t("Coming soon", "Próximamente"),
      priceNote: t("For professionals & builders", "Para profesionales y builders"),
      benefits: [
        t("Everything in Local", "Todo lo de Local"),
        t("Digital Builders sessions access", "Acceso a sesiones Digital Builders"),
        t("Bring a guest for free each month", "Trae un invitado gratis al mes"),
        t("Featured in member directory", "Destacado en el directorio de miembros"),
      ],
      cta: t("Get notified", "Recibir aviso"),
      ctaHref: "mailto:afterworkclubinternational@gmail.com",
      ctaExternal: false,
      featured: false,
    },
    {
      badge: t("Inner circle", "Círculo íntimo"),
      badgeStyle: { background: "hsl(var(--olive) / 0.12)", color: "hsl(var(--olive))" },
      name: "Circle",
      tagline: t("You're at the heart of Aftr", "Estás en el corazón de Aftr"),
      price: t("Coming soon", "Próximamente"),
      priceNote: t("For founders & entrepreneurs", "Para fundadores y emprendedores"),
      benefits: [
        t("Everything in Connector", "Todo lo de Connector"),
        t("Co-founder matching program", "Programa de matching de cofundadores"),
        t("Concierge event recommendations", "Recomendaciones personalizadas de eventos"),
        t("Aftr Circle private group access", "Acceso al grupo privado Aftr Circle"),
        t("Free visibility for your services", "Visibilidad gratuita de tus servicios"),
      ],
      cta: t("Get notified", "Recibir aviso"),
      ctaHref: "mailto:afterworkclubinternational@gmail.com",
      ctaExternal: false,
      featured: false,
    },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Membership", "Membresía")}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
            {t("Find your place in Aftr", "Encuentra tu lugar en Aftr")}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
            {t(
              "Join at whatever level makes sense right now. Upgrade any time — there's no wrong way to be part of Aftr.",
              "Únete al nivel que tenga sentido ahora mismo. Mejora cuando quieras — no hay forma equivocada de ser parte de Aftr."
            )}
          </p>
        </div>

        {/* Coming soon note */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="rounded-xl border px-5 py-4 text-sm text-muted-foreground flex items-start gap-3"
            style={{ background: "hsl(38 95% 64% / 0.08)", borderColor: "hsl(38 95% 64% / 0.3)" }}>
            <span className="text-base mt-0.5">💡</span>
            <span>
              {t(
                "Paid memberships are coming soon. Express interest and early members get a special founding rate.",
                "Las membresías de pago llegan pronto. Muestra interés y los primeros miembros obtienen una tarifa fundacional especial."
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 border flex flex-col transition-transform hover:-translate-y-1 duration-300 ${
                tier.featured
                  ? "bg-warm-dark border-warm-dark"
                  : "bg-popover border-border"
              } ${isVisible ? `animate-reveal-up stagger-${Math.min(i + 2, 6)}` : "opacity-0"}`}
            >
              {/* Badge */}
              <div
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block self-start mb-4"
                style={tier.badgeStyle}
              >
                {tier.badge}
              </div>

              {/* Name + tagline */}
              <div className={`font-heading text-2xl font-bold mb-1 ${tier.featured ? "text-sand-light" : "text-foreground"}`}
                style={tier.featured ? { color: "hsl(var(--sand-light))" } : {}}>
                {tier.name}
              </div>
              <p className={`text-sm mb-4 ${tier.featured ? "opacity-60" : "text-muted-foreground"}`}
                style={tier.featured ? { color: "hsl(var(--sand))" } : {}}>
                {tier.tagline}
              </p>

              {/* Price */}
              <div className={`font-heading text-2xl font-bold mb-1 ${tier.featured ? "" : "text-primary"}`}
                style={tier.featured ? { color: "hsl(38 95% 64%)" } : {}}>
                {tier.price}
              </div>
              <p className={`text-xs mb-5 ${tier.featured ? "opacity-50" : "text-muted-foreground"}`}
                style={tier.featured ? { color: "hsl(var(--sand))" } : {}}>
                {tier.priceNote}
              </p>

              {/* Divider */}
              <div className={`border-t mb-4 ${tier.featured ? "border-white/10" : "border-border"}`} />

              {/* Benefits */}
              <ul className="space-y-3 flex-1 mb-6">
                {tier.benefits.map((b, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.featured ? "text-primary" : "text-olive"}`} />
                    <span className={`text-sm leading-snug ${tier.featured ? "opacity-70" : "text-muted-foreground"}`}
                      style={tier.featured ? { color: "hsl(var(--sand))" } : {}}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaExternal ? (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-full py-2.5 text-sm font-bold transition-all duration-200"
                  style={{ background: "hsl(var(--warm-dark))", color: "#fff" }}
                >
                  {tier.cta}
                </a>
              ) : (
                <a
                  href={tier.ctaHref}
                  className={`block text-center rounded-full py-2.5 text-sm font-bold transition-all duration-200 ${
                    tier.featured
                      ? "hover:opacity-90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                  style={tier.featured ? { background: "hsl(38 95% 64%)", color: "hsl(var(--warm-dark))" } : {}}
                >
                  {tier.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BAND ─────────────────────────────────────────────────

function CTABand() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-28 section-padding bg-primary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4" style={{ lineHeight: 1.15 }}>
          {t("Ready to find your people?", "¿Listo para encontrar a tu gente?")}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10">
          {t("Come to one event. See what happens.", "Ven a un evento. Mira qué pasa.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/events">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              style={{ background: "#fff", color: "hsl(var(--primary))", fontWeight: 700 }}
            >
              {t("See upcoming events", "Ver eventos próximos")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <a
            href="https://www.meetup.com/afterwork-club-international/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
              {t("Join on Meetup (new visitors)", "Únete en Meetup (nuevos visitantes)")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <BilateralSplit />
      <EventFormats />
      <MembershipTiers />
      <CTABand />
      <Footer />
    </div>
  );
}
