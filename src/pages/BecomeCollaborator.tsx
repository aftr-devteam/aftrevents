import { Link } from "react-router-dom";
import { Check, ArrowRight, Star, Users, CalendarDays, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { en: "Post unlimited paid events on Aftr Events", es: "Publica eventos de pago ilimitados en Aftr Events" },
  { en: "Get featured in our weekly newsletter", es: "Aparece en nuestra newsletter semanal" },
  { en: "Access our curated community of attendees", es: "Accede a nuestra comunidad curada de asistentes" },
  { en: "Dedicated host profile with social links", es: "Perfil de anfitrión dedicado con redes sociales" },
  { en: "Event statistics and attendee insights", es: "Estadísticas de eventos y datos de asistentes" },
  { en: "Priority support and admin approval", es: "Soporte prioritario y aprobación del admin" },
];

export default function BecomeCollaborator() {
  const { t } = useLang();
  const { ref, isVisible } = useScrollReveal();
  const { ref: ref2, isVisible: isVisible2 } = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">{t("For Hosts & Venues", "Para Anfitriones y Locales")}</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6" style={{ lineHeight: 1.08 }}>
              {t("Become an Aftr Events Collaborator", "Conviértete en Colaborador de Aftr Events")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                "Reach our exclusive community of quality event-goers across Alicante. Post paid workshops, classes, and experiences.",
                "Llega a nuestra comunidad exclusiva de asistentes de calidad en Alicante. Publica talleres, clases y experiencias de pago."
              )}
            </p>
          </div>

          {/* Benefits */}
          <div ref={ref} className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
            {benefits.map((b, i) => (
              <div key={i} className={`flex items-start gap-3 bg-popover rounded-xl p-5 shadow-sm ${isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : ""}`}>
                <div className="w-6 h-6 rounded-full bg-olive/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-olive" />
                </div>
                <span className="text-foreground font-medium text-sm">{t(b.en, b.es)}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div ref={ref2} className={`max-w-lg mx-auto ${isVisible2 ? "animate-reveal-up" : "opacity-0"}`}>
            <div className="bg-popover rounded-3xl p-8 lg:p-10 shadow-lg border border-border text-center">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
                <Star className="w-3.5 h-3.5" />
                {t("Most Popular", "Más Popular")}
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Collaborator Plan", "Plan Colaborador")}</h2>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-heading text-5xl font-bold text-primary">€39</span>
                <span className="text-muted-foreground text-sm">/{t("month", "mes")}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-8">{t("Cancel anytime. No commitment.", "Cancela cuando quieras. Sin compromiso.")}</p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  { icon: CalendarDays, en: "Unlimited event listings", es: "Listados de eventos ilimitados" },
                  { icon: Users, en: "Access to 2,000+ members", es: "Acceso a 2.000+ miembros" },
                  { icon: BarChart3, en: "Analytics dashboard", es: "Panel de estadísticas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{t(item.en, item.es)}</span>
                  </div>
                ))}
              </div>

              <Button variant="hero" size="lg" className="w-full mb-3">
                {t("Apply to Become a Collaborator", "Solicita Ser Colaborador")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <p className="text-xs text-muted-foreground">{t("Application reviewed within 48 hours", "Solicitud revisada en 48 horas")}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
