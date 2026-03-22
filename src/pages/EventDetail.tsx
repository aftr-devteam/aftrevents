import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  RefreshCw,
  Users,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, getRelatedEvents, categoryColors } from "@/lib/eventData";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EventDetail() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { ref, isVisible } = useScrollReveal(0.05);
  const [showRsvp, setShowRsvp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: "", email: "", whatsapp: "" });

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {t("Event not found", "Evento no encontrado")}
          </h1>
          <Link to="/events">
            <Button variant="outline">{t("Back to Events", "Volver a Eventos")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = lang === "en" ? event.title : event.titleEs;
  const desc = lang === "en"
    ? (event.fullDescription || event.description)
    : (event.fullDescriptionEs || event.descriptionEs);
  const highlights = lang === "en" ? event.highlights : event.highlightsEs;
  const hostRole = lang === "en" ? (event.hostRole || "") : (event.hostRoleEs || "");

  const dateObj = new Date(event.date);
  const dateStrLong = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateStrShort = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const related = getRelatedEvents(event.id, event.category);
  const spotsLow = event.spotsLeft < event.totalSpots * 0.5;
  const catColor = categoryColors[event.categoryKey] || "bg-muted text-muted-foreground";
  const mapsQuery = encodeURIComponent(event.address || event.location);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero image */}
      <div className="pt-20">
        <div className="relative h-[40vh] min-h-[280px] lg:h-[45vh]">
          <img src={event.image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 section-padding">
            <div className="max-w-6xl mx-auto">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sand/80 text-sm mb-4 hover:text-sand-light transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("All Events", "Todos los Eventos")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={ref} className="max-w-6xl mx-auto section-padding py-10 lg:py-14">
        <div className={`grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-14 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>

          {/* LEFT COLUMN — 70% */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${catColor} border-0 rounded-full px-3 py-1 text-xs font-semibold`}>
                {lang === "en" ? event.category : (
                  { Gastronomy: "Gastronomía", Networking: "Networking", "Music & Culture": "Música y Cultura", Workshop: "Taller", Wellness: "Bienestar" }[event.category] || event.category
                )}
              </Badge>
              {event.isRecurring && (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {t("Recurring", "Recurrente")}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground"
              style={{ lineHeight: 1.1 }}
            >
              {title}
            </h1>

            {/* Host row */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: event.hostAvatarColor || "hsl(var(--primary))" }}
              >
                {getInitials(event.host)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{event.host}</p>
                <p className="text-sm text-muted-foreground">
                  {hostRole}
                  {event.hostEventsCount && (
                    <span className="ml-2 text-xs">
                      · {event.hostEventsCount} {t("events", "eventos")}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="bg-popover rounded-2xl border border-border p-6">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                  {t("Highlights", "Destacados")}
                </h2>
                <ul className="space-y-2.5">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="text-base leading-5">{h.slice(0, 2)}</span>
                      <span>{h.slice(3)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                {t("About This Event", "Sobre Este Evento")}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[0.95rem] whitespace-pre-line">
                {desc}
              </p>
            </div>

            {/* Getting there */}
            <div className="bg-popover rounded-2xl border border-border p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                {t("Getting There", "Cómo Llegar")}
              </h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{event.location}</p>
                  {event.address && (
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  )}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("Open in Google Maps", "Abrir en Google Maps")}
                </Button>
              </a>
            </div>

            {/* Similar events */}
            {related.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-5">
                  {t("Similar Events", "Eventos Similares")}
                </h2>
                <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                  {related.map((ev, i) => (
                    <div key={ev.id} className="min-w-[260px] max-w-[280px] snap-start shrink-0">
                      <EventCard event={ev} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — 30%, sticky */}
          <div className="lg:col-span-3">
            <div className="bg-popover rounded-2xl border border-border p-6 shadow-sm lg:sticky lg:top-24 space-y-5">
              {/* Date & time */}
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-heading text-lg font-semibold">{dateStrShort}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{event.time}h</span>
                </div>
              </div>

              {/* Location pill */}
              <div className="flex items-center justify-center gap-2 bg-muted rounded-xl px-4 py-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground font-medium truncate">{event.location}</span>
              </div>

              {/* Price */}
              <div className="text-center">
                {event.isFree ? (
                  <p className="text-2xl font-bold text-olive font-heading">{t("Free", "Gratis")}</p>
                ) : (
                  <p className="text-3xl font-bold text-primary font-heading">€{event.price}</p>
                )}
                {!event.isFree && (
                  <p className="text-xs text-muted-foreground mt-1">{t("per person", "por persona")}</p>
                )}
              </div>

              {/* Spots remaining */}
              {spotsLow && (
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {t(
                      `Only ${event.spotsLeft} spots left!`,
                      `¡Solo quedan ${event.spotsLeft} plazas!`
                    )}
                  </span>
                </div>
              )}

              {/* CTA / RSVP */}
              {!showRsvp && !submitted && (
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => setShowRsvp(true)}
                >
                  {event.isFree
                    ? t("RSVP — it's free", "RSVP — es gratis")
                    : t(`Get your spot — €${event.price}`, `Reserva tu plaza — €${event.price}`)}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}

              {/* Inline RSVP form */}
              {showRsvp && !submitted && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    required
                    placeholder={t("Your name", "Tu nombre")}
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    className="rounded-xl"
                  />
                  <Input
                    required
                    type="email"
                    placeholder={t("Email address", "Correo electrónico")}
                    value={rsvpData.email}
                    onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder={t("WhatsApp (optional)", "WhatsApp (opcional)")}
                    value={rsvpData.whatsapp}
                    onChange={(e) => setRsvpData({ ...rsvpData, whatsapp: e.target.value })}
                    className="rounded-xl"
                  />
                  <Button variant="hero" className="w-full" type="submit">
                    {t("Confirm", "Confirmar")}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowRsvp(false)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    {t("Cancel", "Cancelar")}
                  </button>
                </form>
              )}

              {/* Confirmation */}
              {submitted && (
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-olive mx-auto" />
                  <p className="font-heading text-lg font-semibold text-foreground">
                    {t("You're in!", "¡Estás dentro!")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Join our WhatsApp community to get reminders and meet others going:",
                      "Únete a nuestra comunidad de WhatsApp para recordatorios y conocer a otros asistentes:"
                    )}
                  </p>
                  {event.whatsappUrl && (
                    <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="sea" size="sm" className="gap-2 mt-2">
                        <MessageCircle className="w-4 h-4" />
                        {t("Join WhatsApp Group", "Unirse al Grupo de WhatsApp")}
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Meetup link */}
              {event.meetupUrl && !submitted && (
                <a
                  href={event.meetupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("New to Aftr? Also on Meetup →", "¿Nuevo en Aftr? También en Meetup →")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
