import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { collaborators } from "@/lib/eventData";

export default function Collaborators() {
  const { t, lang } = useLang();
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">{t("Our Network", "Nuestra Red")}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              {t("Verified Hosts & Venues", "Anfitriones y Locales Verificados")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                "Every collaborator is vetted for quality. They bring the best experiences to our community.",
                "Cada colaborador es verificado por calidad. Traen las mejores experiencias a nuestra comunidad."
              )}
            </p>
          </div>

          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {collaborators.map((c, i) => (
              <div
                key={c.id}
                className={`bg-popover rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group ${isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{c.name}</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">{t(c.type, c.typeEs)}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t(c.bio, c.bioEs)}</p>
                  <p className="text-xs text-muted-foreground mb-4">{c.eventsHosted} {t("events hosted", "eventos realizados")}</p>

                  <div className="flex items-center gap-2">
                    <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                      <Instagram className="w-4 h-4 text-foreground" />
                    </a>
                    <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                      <Linkedin className="w-4 h-4 text-foreground" />
                    </a>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs">
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      {t("Message", "Mensaje")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
