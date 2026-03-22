import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function Welcome() {
  const { t } = useLang();
  const { profile } = useAuth();

  const firstName = profile?.full_name?.split(" ")[0] ?? t("there", "ahí");

  const paths = [
    {
      icon: Calendar,
      color: "#b85c24",
      bg: "rgba(184,92,36,0.08)",
      title: t("Browse events", "Ver eventos"),
      desc: t(
        "Find upcoming Chat & Mingle, Digital Builders, Lingo Connect and more.",
        "Encuentra próximos Chat & Mingle, Digital Builders, Lingo Connect y más."
      ),
      cta: t("See events →", "Ver eventos →"),
      href: "/events",
    },
    {
      icon: Users,
      color: "#4b664a",
      bg: "rgba(75,102,74,0.08)",
      title: t("Meet the community", "Conocer la comunidad"),
      desc: t(
        "Browse the builders and connectors who make Aftr what it is.",
        "Conoce a los builders y connectors que hacen Aftr lo que es."
      ),
      cta: t("Meet them →", "Conocerlos →"),
      href: "/builders-connectors",
    },
    {
      icon: Sparkles,
      color: "#3f779d",
      bg: "rgba(63,119,157,0.08)",
      title: t("Organise your own events", "Organiza tus propios eventos"),
      desc: t(
        "Apply to become a Verified Aftr Organizer and list your events to our community.",
        "Solicita ser Organizador Verificado de Aftr y publica tus eventos en nuestra comunidad."
      ),
      cta: t("Apply now →", "Solicitar ahora →"),
      href: "/organizer/apply",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto section-padding pt-32 pb-20">

        {/* Greeting */}
        <div className="text-center mb-14">
          <div className="text-5xl mb-5">🎉</div>
          <h1
            className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3"
            style={{ lineHeight: 1.15 }}
          >
            {t(`Welcome to Aftr, ${firstName}!`, `¡Bienvenido a Aftr, ${firstName}!`)}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t(
              "Your account is ready. Here's how to get started.",
              "Tu cuenta está lista. Aquí te explicamos cómo empezar."
            )}
          </p>
        </div>

        {/* Path cards */}
        <div className="space-y-4 mb-10">
          {paths.map((path, i) => (
            <Link
              key={i}
              to={path.href}
              className="flex items-center gap-5 bg-popover border border-border rounded-2xl px-6 py-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: path.bg }}
              >
                <path.icon className="w-6 h-6" style={{ color: path.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-0.5">{path.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{path.desc}</p>
              </div>
              <ArrowRight
                className="w-5 h-5 text-primary flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </Link>
          ))}
        </div>

        {/* Complete profile nudge */}
        <div
          className="rounded-2xl border px-6 py-5 flex items-start gap-4"
          style={{ background: "hsl(38 95% 64% / 0.06)", borderColor: "hsl(38 95% 64% / 0.25)" }}
        >
          <div className="text-xl mt-0.5">💡</div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-1">
              {t("Complete your profile", "Completa tu perfil")}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {t(
                "Add your bio, photo, and social links so other community members can find and connect with you.",
                "Añade tu bio, foto y redes sociales para que otros miembros de la comunidad puedan encontrarte y conectar contigo."
              )}
            </p>
            <Link to="/profile">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("Set up your profile", "Configurar tu perfil")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
