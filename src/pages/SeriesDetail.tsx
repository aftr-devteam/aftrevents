import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  RefreshCw,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { eventSeries, getEventsBySeriesId } from "@/lib/eventData";
import type { EventSeries, Event } from "@/lib/eventData";

function DateCard({ event, lang }: { event: Event; lang: string }) {
  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", { weekday: "long" });
  const dateStr = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", { month: "short", day: "numeric" });
  const spotsLow = event.spotsLeft < event.totalSpots * 0.5;

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-center gap-4 sm:gap-6 bg-popover rounded-2xl border border-border p-4 sm:p-5 hover:shadow-lg transition-all duration-300 active:scale-[0.98] group"
    >
      <div className="text-center shrink-0 w-16">
        <p className="text-xs font-semibold text-primary uppercase">{dayName}</p>
        <p className="font-heading text-xl font-bold text-foreground leading-tight">{dateStr}</p>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{event.time}h</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        {spotsLow && (
          <p className="text-xs font-semibold text-destructive">
            {lang === "en"
              ? `${event.spotsLeft} spots left`
              : `${event.spotsLeft} plazas`}
          </p>
        )}
      </div>
      <div className="shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </Link>
  );
}

export default function SeriesDetail() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { ref, isVisible } = useScrollReveal(0.05);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const series = eventSeries.find((s) => s.id === id);

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {t("Series not found", "Serie no encontrada")}
          </h1>
          <Link to="/events">
            <Button variant="outline">{t("Back to Events", "Volver a Eventos")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const name = lang === "en" ? series.name : series.nameEs;
  const desc = lang === "en" ? series.description : series.descriptionEs;
  const longDesc = lang === "en" ? series.longDescription : series.longDescriptionEs;
  const frequency = lang === "en" ? series.frequency : series.frequencyEs;
  const whoItsFor = lang === "en" ? series.whoItsFor : series.whoItsForEs;
  const upcomingEvents = getEventsBySeriesId(series.id);
  const shareUrl = `${window.location.origin}/series/${series.id}`;
  const shareText = lang === "en"
    ? `Come to ${series.name} with me in Alicante → ${shareUrl}`
    : `Ven a ${series.nameEs} conmigo en Alicante → ${shareUrl}`;

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubscribed(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 overflow-hidden" style={{ backgroundColor: "hsl(var(--warm-dark))" }}>
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: series.colorAccent }} />

        <div className="relative z-10 section-padding py-16 lg:py-24 max-w-4xl mx-auto text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sand/60 text-sm mb-8 hover:text-sand/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("All Events", "Todos los Eventos")}
          </Link>

          <div className="text-6xl sm:text-7xl mb-6 animate-reveal-up">{series.emoji}</div>

          <h1
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-light mb-5 animate-reveal-up stagger-1"
            style={{ lineHeight: 1.1 }}
          >
            {name}
          </h1>

          <p className="text-sand/75 text-lg max-w-2xl mx-auto mb-6 animate-reveal-up stagger-2">{desc}</p>

          <Badge
            variant="outline"
            className="border-sand/30 text-sand/90 rounded-full px-4 py-1.5 text-sm font-semibold gap-1.5 animate-reveal-up stagger-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {frequency}
          </Badge>
        </div>
      </section>

      {/* Subscribe — the most important conversion */}
      <section className="section-padding -mt-1" style={{ backgroundColor: "hsl(var(--warm-dark))" }}>
        <div className="max-w-xl mx-auto pb-14">
          <div
            className="rounded-2xl p-6 sm:p-8 border animate-reveal-up stagger-4"
            style={{
              backgroundColor: `color-mix(in srgb, ${series.colorAccent} 8%, hsl(var(--warm-dark)))`,
              borderColor: `color-mix(in srgb, ${series.colorAccent} 25%, transparent)`,
            }}
          >
            {!subscribed ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-sand/80" />
                  <h2 className="font-heading text-lg font-semibold text-sand-light">
                    {t("Subscribe to this series", "Suscríbete a esta serie")}
                  </h2>
                </div>
                <p className="text-sand/60 text-sm mb-5">
                  {t(
                    `Get notified every time ${series.name} is announced. Never miss a session.`,
                    `Recibe una notificación cada vez que se anuncie ${series.nameEs}. No te pierdas ninguna sesión.`
                  )}
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("Your email", "Tu email")}
                    className="flex-1 rounded-xl bg-white/10 border-white/15 text-sand-light placeholder:text-sand/40 focus-visible:ring-sand/30"
                  />
                  <Button type="submit" variant="hero" className="shrink-0">
                    {t("Subscribe", "Suscribirse")}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-2">
                <Check className="w-8 h-8 mx-auto mb-2" style={{ color: series.colorAccent }} />
                <p className="font-heading text-lg font-semibold text-sand-light">
                  {t("You're subscribed!", "¡Estás suscrito!")}
                </p>
                <p className="text-sand/60 text-sm mt-1">
                  {t("We'll email you when the next edition is announced.", "Te avisaremos cuando se anuncie la próxima edición.")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming dates */}
      <section ref={ref} className="section-padding py-14 lg:py-20">
        <div className={`max-w-3xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            {t("Upcoming Dates", "Próximas Fechas")}
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((ev, i) => (
                <div key={ev.id} className={isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : "opacity-0"}>
                  <DateCard event={ev} lang={lang} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {t("No upcoming dates yet — subscribe above to be the first to know!", "Aún no hay próximas fechas — ¡suscríbete arriba para ser el primero en saberlo!")}
            </p>
          )}
        </div>
      </section>

      {/* About this series */}
      <section className="section-padding py-14 lg:py-20 bg-warm-gradient">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-5">
            {t("About This Series", "Sobre Esta Serie")}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-[0.95rem] mb-8">{longDesc}</p>

          <div className="bg-popover rounded-2xl border border-border p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
              {t("Who is it for?", "¿Para quién es?")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{whoItsFor}</p>
          </div>
        </div>
      </section>

      {/* Past editions counter */}
      <section className="section-padding py-14 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold text-primary">{series.totalPastAttendees}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("people have attended", "personas han asistido")}</p>
            </div>
            <div className="hidden sm:block w-px h-14 bg-border" />
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold text-primary">{series.totalPastEditions}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("editions so far", "ediciones hasta ahora")}</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-6 max-w-md mx-auto">
            {t(
              `${series.totalPastAttendees} people have attended this series across ${series.totalPastEditions} events.`,
              `${series.totalPastAttendees} personas han asistido a esta serie en ${series.totalPastEditions} eventos.`
            )}
          </p>
        </div>
      </section>

      {/* Bring a friend */}
      <section className="section-padding py-14 lg:py-16 bg-warm-gradient">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
            {t("Bring a Friend", "Trae a un Amigo")}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {t("Share this series with someone who'd love it.", "Comparte esta serie con alguien a quien le encantaría.")}
          </p>
          <div className="flex items-center gap-3 max-w-lg mx-auto bg-popover border border-border rounded-xl p-3">
            <p className="flex-1 text-sm text-muted-foreground truncate text-left">{shareText}</p>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t("Copied!", "¡Copiado!") : t("Copy", "Copiar")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
