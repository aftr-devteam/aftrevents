import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, BarChart3, Globe, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { venuePartners } from "@/lib/eventData";

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
          {t("Work with Aftr", "Trabaja con Aftr")}
        </p>
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
          style={{ color: "hsl(var(--sand-light))" }}
        >
          {t("Three ways to collaborate", "Tres formas de colaborar")}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl animate-reveal-up stagger-2"
          style={{ color: "hsl(var(--sand) / 0.7)" }}
        >
          {t(
            "Whether you want to help run events, host them at your venue, or grow your own community — there's a path for you.",
            "Tanto si quieres ayudar a organizar eventos, acogerlos en tu local o hacer crecer tu propia comunidad — hay un camino para ti."
          )}
        </p>
      </div>
    </section>
  );
}

// ─── THREE COLLABORATION CARDS ────────────────────────────────

function CollaborationCards() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const cards = [
    {
      dark: true,
      chip: t("Volunteer · No cost", "Voluntario · Sin coste"),
      chipStyle: { background: "hsl(38 95% 64%)", color: "hsl(var(--warm-dark))" },
      icon: "🎙️",
      title: t("Aftr Host / Collaborator", "Aftr Host / Colaborador"),
      description: t(
        "You create the mood and energy at our branded events. Hosts are the heartbeat of Aftr — the people who make strangers feel welcome from the very first second.",
        "Tú creas el ambiente y la energía en nuestros eventos de marca. Los hosts son el corazón de Aftr — las personas que hacen que los desconocidos se sientan bienvenidos desde el primer segundo."
      ),
      benefits: [
        t("Official Aftr Host or Collaborator title", "Título oficial de Aftr Host o Colaborador"),
        t("Free visibility for your personal brand or services", "Visibilidad gratuita de tu marca personal o servicios"),
        t("Free feature on Meetup and our social channels", "Aparición gratuita en Meetup y nuestros canales"),
        t("Free events management training", "Formación gratuita en gestión de eventos"),
        t("Access to the Aftr Circle private group", "Acceso al grupo privado Aftr Circle"),
        t("Posting rights on Aftr WhatsApp & socials", "Derechos de publicación en WhatsApp y redes de Aftr"),
      ],
      cta: t("Apply to be a host →", "Solicitar ser host →"),
      ctaHref: "mailto:afterworkclubinternational@gmail.com",
      ctaStyle: { color: "hsl(38 95% 64%)", borderColor: "hsl(38 95% 64%)" },
    },
    {
      dark: false,
      chip: t("Per negotiation", "Por negociación"),
      chipStyle: { background: "hsl(var(--accent) / 0.12)", color: "hsl(var(--accent))" },
      icon: "🏠",
      title: t("Venue Partner", "Local Colaborador"),
      description: t(
        "Turn empty weeknights into lively events with a ready-made audience of locals and internationals. We handle logistics — you host the crowd and earn the revenue.",
        "Convierte las noches de diario vacías en eventos animados con una audiencia lista de locales e internacionales. Nosotros gestionamos la logística — tú acoge a la gente y genera ingresos."
      ),
      benefits: [
        t("Regular organized events with a dedicated Aftr host", "Eventos regulares organizados con un host Aftr dedicado"),
        t("Guaranteed 30–50 attendees per event", "30-50 asistentes garantizados por evento"),
        t("€300–600 revenue impact per 2-hour event", "€300-600 de impacto en ingresos por evento de 2 horas"),
        t("Social media coverage, reels, and photography", "Cobertura en redes sociales, reels y fotografía"),
        t("Logo on Aftr website and printed materials", "Logo en el sitio web de Aftr y materiales impresos"),
        t("60%+ of attendees are first-time visitors", "El 60%+ de los asistentes son visitantes por primera vez"),
      ],
      cta: t("Partner with us →", "Conviértete en partner →"),
      ctaHref: "mailto:afterworkclubinternational@gmail.com",
      ctaStyle: { color: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" },
    },
    {
      dark: false,
      chip: t("Paid membership", "Membresía de pago"),
      chipStyle: { background: "hsl(var(--olive) / 0.12)", color: "hsl(var(--olive))" },
      icon: "📣",
      title: t("Verified Events Organizer", "Organizador de Eventos Verificado"),
      description: t(
        "You run your own IRL community or events brand and want to grow it. We give you tools, training, audience access, and visibility through Aftr's network.",
        "Tienes tu propia comunidad IRL o marca de eventos y quieres hacerla crecer. Te damos herramientas, formación, acceso a audiencia y visibilidad a través de la red de Aftr."
      ),
      benefits: [
        t("IRL Community Management & Marketing training", "Formación en gestión de comunidades IRL y marketing"),
        t("Event hosting under Aftr's Meetup umbrella", "Organización de eventos bajo el paraguas de Aftr en Meetup"),
        t("Feature on Instagram, LinkedIn & Aftr podcast", "Aparición en Instagram, LinkedIn y el podcast de Aftr"),
        t("Publicity on WhatsApp groups & website", "Publicidad en grupos de WhatsApp y sitio web"),
        t("Onboarding session + Aftr Verified badge", "Sesión de onboarding + badge Aftr Verificado"),
      ],
      cta: t("Get in touch →", "Contacta con nosotros →"),
      ctaHref: "/organizer/apply",
      ctaStyle: { color: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" },
      ctaInternal: true,
    },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-1 duration-300 ${
                card.dark
                  ? "bg-warm-dark"
                  : "bg-popover border border-border"
              } ${isVisible ? `animate-reveal-up stagger-${i + 1}` : "opacity-0"}`}
            >
              {/* Chip */}
              <div
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block self-start mb-5"
                style={card.chipStyle}
              >
                {card.chip}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{card.icon}</div>

              {/* Title */}
              <h3
                className="font-heading text-xl font-bold mb-4"
                style={card.dark ? { color: "hsl(var(--sand-light))" } : { color: "hsl(var(--foreground))" }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-6"
                style={card.dark ? { color: "hsl(var(--sand) / 0.65)" } : { color: "hsl(var(--muted-foreground))" }}
              >
                {card.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-3 flex-1 mb-8">
                {card.benefits.map((b, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <ArrowRight
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: card.dark ? "hsl(38 95% 64%)" : "hsl(var(--primary))" }}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={card.dark ? { color: "hsl(var(--sand) / 0.7)" } : { color: "hsl(var(--muted-foreground))" }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {card.ctaInternal ? (
                <Link
                  to={card.ctaHref}
                  className="inline-flex items-center font-bold text-sm border-b-2 pb-0.5 self-start transition-opacity hover:opacity-70"
                  style={card.ctaStyle}
                >
                  {card.cta}
                </Link>
              ) : (
                <a
                  href={card.ctaHref}
                  className="inline-flex items-center font-bold text-sm border-b-2 pb-0.5 self-start transition-opacity hover:opacity-70"
                  style={card.ctaStyle}
                >
                  {card.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VENUE PARTNERS STRIP ─────────────────────────────────────

function VenuePartnersStrip() {
  const { ref, isVisible } = useScrollReveal();
  const { t, lang } = useLang();

  return (
    <section ref={ref} className="py-14 section-padding bg-warm-gradient">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">
            {t("Where we host", "Dónde organizamos")}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {t("Our current venue partners", "Nuestros locales colaboradores actuales")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {venuePartners.map((venue, i) => (
            <div
              key={venue.id}
              className={`bg-popover rounded-xl border border-border p-5 text-center hover:shadow-md transition-all duration-300 ${isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 5)}` : "opacity-0"}`}
            >
              {/* Venue initials circle */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-sm">
                  {venue.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{venue.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {lang === "en" ? venue.type : venue.typeEs}
              </p>
              <p className="text-xs text-muted-foreground">{venue.city}</p>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs font-semibold text-primary">
                  {venue.eventsHosted} {t("events", "eventos")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-4">
            {t("Interested in hosting Aftr events at your venue?", "¿Interesado en acoger eventos de Aftr en tu local?")}
          </p>
          <a href="mailto:afterworkclubinternational@gmail.com">
            <Button variant="outline" size="lg">
              {t("Get in touch", "Contacta con nosotros")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── BUSINESS SERVICES ────────────────────────────────────────

function BusinessServices() {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useLang();

  const services = [
    {
      icon: Calendar,
      color: "hsl(var(--primary) / 0.1)",
      iconColor: "text-primary",
      title: t("Events Organization", "Organización de Eventos"),
      description: t(
        "Workshops, cultural activities, tardeos, team building, corporate events, and product launches. We design and execute from start to finish.",
        "Talleres, actividades culturales, tardeos, team building, eventos corporativos y lanzamientos de productos. Diseñamos y ejecutamos de principio a fin."
      ),
      tags: [t("Corporate", "Corporativo"), t("Team building", "Team building"), t("Cultural", "Cultural")],
    },
    {
      icon: Users,
      color: "hsl(var(--olive) / 0.1)",
      iconColor: "text-olive",
      title: t("IRL Community Management", "Gestión de Comunidades IRL"),
      description: t(
        "We help brands and organizations build real in-person communities. Strategy, event formats, engagement systems — the full playbook.",
        "Ayudamos a marcas y organizaciones a construir comunidades presenciales reales. Estrategia, formatos de eventos, sistemas de engagement — el manual completo."
      ),
      tags: [t("Training available", "Formación disponible")],
    },
    {
      icon: Megaphone,
      color: "hsl(var(--accent) / 0.1)",
      iconColor: "text-accent",
      title: t("Digital Marketing & Branding", "Marketing Digital y Branding"),
      description: t(
        "Social media strategy, content creation, brand identity, and community-led marketing for events businesses and local venues.",
        "Estrategia en redes sociales, creación de contenido, identidad de marca y marketing impulsado por la comunidad para negocios de eventos y locales."
      ),
      tags: [t("Social", "Social"), t("Content", "Contenido"), t("Brand", "Marca")],
    },
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 section-padding">
      <div className={`max-w-7xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            {t("Aftr Events — The Organization", "Aftr Events — La Organización")}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground" style={{ lineHeight: 1.15 }}>
            {t("We also work with businesses", "También trabajamos con empresas")}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl">
            {t(
              "Beyond the community, Aftr Events offers professional services for companies, institutions, and brands in Alicante.",
              "Más allá de la comunidad, Aftr Events ofrece servicios profesionales para empresas, instituciones y marcas en Alicante."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-popover rounded-2xl border border-border p-7 hover:shadow-lg transition-all duration-500 ${isVisible ? `animate-reveal-up stagger-${i + 1}` : "opacity-0"}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: s.color }}
              >
                <s.icon className={`w-6 h-6 ${s.iconColor}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "hsl(var(--accent) / 0.08)", color: "hsl(var(--accent))" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
          {t("Want to work together?", "¿Quieres trabajar juntos?")}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10">
          {t(
            "Tell us what you're building. We'll figure it out together.",
            "Cuéntanos qué estás construyendo. Lo descubriremos juntos."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:afterworkclubinternational@gmail.com">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              style={{ background: "#fff", color: "hsl(var(--primary))", fontWeight: 700 }}
            >
              {t("Send us a message", "Envíanos un mensaje")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </a>
          <a href="https://instagram.com/aftrsocialclub" target="_blank" rel="noopener noreferrer">
            <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
              @aftrsocialclub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function Collaborate() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CollaborationCards />
      <VenuePartnersStrip />
      <BusinessServices />
      <CTABand />
      <Footer />
    </div>
  );
}
