import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar, MapPin, Clock, Users, Globe, Share2, Heart,
  ExternalLink, Instagram, Facebook, ArrowRight,
  Loader2, Check, RefreshCw, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useEventById, useRelatedEvents, useEventSave, type DbEvent } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── HELPERS ──────────────────────────────────────────────────

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(
    lang === "en" ? "en-GB" : "es-ES",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );
}

function generateICS(event: DbEvent): string {
  const start = `${event.event_date.replace(/-/g, "")}T${event.start_time.replace(/:/g, "")}00`;
  const end   = event.end_time
    ? `${event.event_date.replace(/-/g, "")}T${event.end_time.replace(/:/g, "")}00`
    : start;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aftr Events//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `LOCATION:${event.venue_name}${event.address ? `, ${event.address}` : ""}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `URL:${window.location.href}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(event: DbEvent) {
  const blob = new Blob([generateICS(event)], { type: "text/calendar" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyShareLink() {
  navigator.clipboard.writeText(window.location.href);
}

// ─── RSVP FORM ────────────────────────────────────────────────

function RSVPPanel({ event }: { event: DbEvent }) {
  const { t } = useLang();
  const { user, profile } = useAuth();

  const [name, setName]           = useState(profile?.full_name ?? "");
  const [email, setEmail]         = useState(user?.email ?? "");
  const [phone, setPhone]         = useState(profile?.phone ?? "");
  const [whatsapp, setWhatsapp]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  const spotsLeft = event.total_spots
    ? event.total_spots - event.spots_reserved
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError(t("Name and email are required.", "Nombre y email son obligatorios."));
      return;
    }
    setError("");
    setSubmitting(true);

    const { error: dbErr } = await supabase.from("rsvps").insert({
      event_id:       event.id,
      user_id:        user?.id ?? null,
      guest_name:     name.trim(),
      guest_email:    email.trim().toLowerCase(),
      guest_phone:    phone.trim() || null,
      wants_whatsapp: whatsapp,
      status:         "confirmed",
      source:         "website",
    });

    setSubmitting(false);

    if (dbErr) {
      if (dbErr.code === "23505") {
        setError(t("You're already registered for this event.", "Ya estás registrado para este evento."));
      } else {
        setError(t("Something went wrong. Please try again.", "Algo salió mal. Inténtalo de nuevo."));
      }
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-popover rounded-2xl border border-border p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">
          {t("You're in!", "¡Ya estás dentro!")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t(
            "We'll send a confirmation to your email. See you there!",
            "Te enviaremos una confirmación a tu email. ¡Nos vemos allí!"
          )}
        </p>
        {event.meetup_url && (
          <a href={event.meetup_url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors">
            {t("Also confirm on Meetup →", "También confirmar en Meetup →")}
          </a>
        )}
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="bg-popover rounded-2xl border border-border p-6 text-center">
        <div className="text-4xl mb-3">😔</div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">
          {t("This event is full", "Este evento está lleno")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("Check back — cancellations do happen.", "Vuelve a revisar — hay cancelaciones a veces.")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-popover rounded-2xl border border-border overflow-hidden">
      {/* Price header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-baseline justify-between">
          <div>
            <span className={`text-3xl font-heading font-bold ${event.is_free ? "text-olive" : "text-primary"}`}>
              {event.is_free ? t("Free", "Gratis") : `€${event.price_euros}`}
            </span>
            {!event.is_free && (
              <span className="text-sm text-muted-foreground ml-1">{t("per person", "por persona")}</span>
            )}
          </div>
          {spotsLeft !== null && (
            <div className={`text-sm font-semibold ${spotsLeft <= 5 ? "text-destructive" : "text-muted-foreground"}`}>
              {spotsLeft <= 5
                ? `⚡ ${t(`Only ${spotsLeft} left`, `Solo ${spotsLeft} restantes`)}`
                : `${spotsLeft} ${t("spots available", "plazas disponibles")}`
              }
            </div>
          )}
        </div>
        {event.is_recurring && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <RefreshCw className="w-3 h-3" />
            {t("Recurring event", "Evento recurrente")}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t("Your name", "Tu nombre")} <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t("Full name", "Nombre completo")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t("Email", "Email")} <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t("WhatsApp (optional)", "WhatsApp (opcional)")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={whatsapp}
            onChange={e => setWhatsapp(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary"
          />
          <span className="text-sm text-muted-foreground">
            {t("Add me to the Aftr WhatsApp community", "Añádeme a la comunidad WhatsApp de Aftr")}
          </span>
        </label>

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t("Registering…", "Registrando…")}</>
            : event.is_free
              ? t("RSVP — it's free", "Reservar — es gratis")
              : t(`Get your spot — €${event.price_euros}`, `Reservar plaza — €${event.price_euros}`)
          }
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {event.is_free
            ? t("No payment required.", "No se requiere pago.")
            : t("Pay at the door via Bizum or cash.", "Paga en la puerta con Bizum o efectivo.")
          }
        </p>
      </form>

      {event.meetup_url && (
        <div className="px-6 pb-5">
          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              {t("New to Aftr?", "¿Nuevo en Aftr?")}
            </p>
            <a
              href={event.meetup_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-semibold hover:underline"
            >
              {t("Also available on Meetup →", "También disponible en Meetup →")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RELATED EVENT CARD ───────────────────────────────────────

function RelatedCard({ event }: { event: DbEvent }) {
  const { lang, t } = useLang();
  const title = lang === "en" ? event.title : (event.title_es ?? event.title);

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex gap-4 bg-popover rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {event.cover_image_url
          ? <img src={event.cover_image_url} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">📅</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
          {event.category_label ?? event.category_key}
        </p>
        <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(event.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" · "}{event.venue_name}
        </p>
      </div>
      <div className="flex-shrink-0 self-center">
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${event.is_free ? "bg-olive/10 text-olive" : "bg-primary/10 text-primary"}`}>
          {event.is_free ? t("Free", "Gratis") : `€${event.price_euros}`}
        </span>
      </div>
    </Link>
  );
}

// ─── ORGANIZER CARD ───────────────────────────────────────────

function OrganizerCard({ organizer }: { organizer: NonNullable<DbEvent["organizer"]> }) {
  const { t } = useLang();
  const initials = organizer.full_name
    ? organizer.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <Link
      to={`/profile/${organizer.id}`}
      className="flex items-center gap-4 bg-muted/50 rounded-xl px-5 py-4 hover:bg-muted transition-colors group"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
        {organizer.avatar_url
          ? <img src={organizer.avatar_url} alt={organizer.full_name ?? ""} className="w-full h-full object-cover" />
          : <span className="font-heading font-bold text-primary">{initials}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
            {organizer.full_name ?? t("Aftr Organizer", "Organizador Aftr")}
          </p>
          {organizer.is_verified_organizer && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓ Verified</span>
          )}
        </div>
        {organizer.bio && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{organizer.bio}</p>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </Link>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLang();
  const { user } = useAuth();

  const { event, loading, error } = useEventById(id);
  const { events: related }       = useRelatedEvents(event, 3);
  const { saved, toggle: toggleSave } = useEventSave(id ?? "", user?.id);

  const [copied, setCopied] = useState(false);

  function handleShare() {
    copyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto section-padding pt-32 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {t("Event not found", "Evento no encontrado")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("This event may have ended or been removed.", "Este evento puede haber terminado o sido eliminado.")}
          </p>
          <Link to="/events">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("Browse all events", "Ver todos los eventos")} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title   = lang === "en" ? event.title   : (event.title_es ?? event.title);
  const desc    = lang === "en" ? event.description : (event.description_es ?? event.description);
  const hiList  = (lang === "en" ? event.highlights : event.highlights_es) ?? [];
  const links   = event.external_links ?? {};

  const categoryColors: Record<string, string> = {
    chat: "#b85c24", digital: "#3f779d", lingo: "#4b664a", hub: "#9b5d9e", unplug: "#2d8c6b",
  };
  const accentColor = categoryColors[event.category_key] ?? "#888";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── COVER IMAGE ── */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden bg-muted">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-8xl opacity-20"
            style={{ background: `${accentColor}15` }}
          >
            {{ chat: "🗣️", digital: "💻", lingo: "🌐", hub: "🎨", unplug: "🏔️" }[event.category_key] ?? "📅"}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 50%)" }} />
        {/* Color accent strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: accentColor }} />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-6xl mx-auto section-padding pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 -mt-8 relative">

          {/* ── LEFT: Event content ── */}
          <div className="lg:col-span-2">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
              <NavLink to="/events" className="hover:text-foreground transition-colors">{t("Events", "Eventos")}</NavLink>
              <span>/</span>
              <span style={{ color: accentColor }} className="font-semibold">
                {event.category_label ?? event.category_key}
              </span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{ background: `${accentColor}15`, color: accentColor }}
              >
                {event.category_label ?? event.category_key}
              </span>
              {event.is_free ? (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-olive/10 text-olive">
                  {t("Free", "Gratis")}
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  €{event.price_euros}
                </span>
              )}
              {event.is_recurring && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> {t("Recurring", "Recurrente")}
                </span>
              )}
              {event.language !== "bilingual" && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {event.language === "en" ? "English" : "Español"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-5" style={{ lineHeight: 1.1 }}>
              {title}
            </h1>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-7">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
                {copied ? t("Copied!", "¡Copiado!") : t("Share", "Compartir")}
              </button>
              <button
                onClick={() => downloadICS(event)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {t("Add to calendar", "Añadir al calendario")}
              </button>
              {user && (
                <button
                  onClick={toggleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    saved
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? "fill-primary" : ""}`} />
                  {saved ? t("Saved", "Guardado") : t("Save", "Guardar")}
                </button>
              )}
            </div>

            {/* Key info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                {
                  icon: Calendar,
                  label: t("Date", "Fecha"),
                  value: formatDate(event.event_date, lang),
                },
                {
                  icon: Clock,
                  label: t("Time", "Hora"),
                  value: event.end_time
                    ? `${event.start_time.slice(0, 5)} – ${event.end_time.slice(0, 5)}`
                    : event.start_time.slice(0, 5),
                },
                {
                  icon: MapPin,
                  label: t("Location", "Lugar"),
                  value: `${event.venue_name}${event.address ? ` · ${event.address}` : ""} · ${event.city}`,
                  href: event.maps_url ?? undefined,
                },
                ...(event.total_spots ? [{
                  icon: Users,
                  label: t("Capacity", "Aforo"),
                  value: `${event.total_spots - event.spots_reserved} / ${event.total_spots} ${t("spots available", "plazas disponibles")}`,
                }] : []),
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-3 bg-muted/50 rounded-xl px-4 py-3">
                  <info.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      {info.label}
                    </div>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1 transition-colors">
                        {info.value} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-foreground">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {hiList.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  {t("What to expect", "Qué esperar")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hiList.filter(Boolean).map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                {t("About this event", "Sobre este evento")}
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {desc}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {event.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* External links */}
            {(links.website || links.instagram || links.facebook || links.eventbrite) && (
              <div className="mb-8">
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                  {t("Links", "Enlaces")}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {links.website && (
                    <a href={links.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
                      <Globe className="w-4 h-4 text-primary" /> {t("Website", "Sitio web")}
                    </a>
                  )}
                  {links.instagram && (
                    <a href={links.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
                      <Instagram className="w-4 h-4 text-primary" /> Instagram
                    </a>
                  )}
                  {links.facebook && (
                    <a href={links.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
                      <Facebook className="w-4 h-4 text-primary" /> Facebook
                    </a>
                  )}
                  {links.eventbrite && (
                    <a href={links.eventbrite} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
                      <ExternalLink className="w-4 h-4 text-primary" /> Eventbrite
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Video */}
            {event.video_url && (
              <div className="mb-8">
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                  {t("Video", "Vídeo")}
                </h2>
                <a href={event.video_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-muted rounded-xl px-5 py-4 hover:bg-muted/80 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {t("Watch video", "Ver vídeo")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{event.video_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Map */}
            {event.maps_url && (
              <div className="mb-8">
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                  {t("Getting there", "Cómo llegar")}
                </h2>
                <div className="bg-muted rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-foreground text-sm">{event.venue_name}</p>
                    {event.address && <p className="text-xs text-muted-foreground mt-0.5">{event.address}, {event.city}</p>}
                  </div>
                  <div className="p-4">
                    <a href={event.maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {t("Open in Google Maps", "Abrir en Google Maps")}
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="mb-8">
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                  {t("Organised by", "Organizado por")}
                </h2>
                <OrganizerCard organizer={event.organizer} />
              </div>
            )}

            {/* Accessibility */}
            {(event.accessibility_notes || event.cancellation_policy) && (
              <div className="bg-muted/50 rounded-2xl border border-border p-5 mb-8 space-y-3">
                {event.accessibility_notes && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {t("Accessibility", "Accesibilidad")}
                    </p>
                    <p className="text-sm text-foreground">{event.accessibility_notes}</p>
                  </div>
                )}
                {event.cancellation_policy && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {t("Cancellation policy", "Política de cancelación")}
                    </p>
                    <p className="text-sm text-foreground">{event.cancellation_policy}</p>
                  </div>
                )}
              </div>
            )}

            {/* Related events */}
            {related.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-5">
                  {t("Similar events", "Eventos similares")}
                </h2>
                <div className="space-y-3">
                  {related.map(rel => <RelatedCard key={rel.id} event={rel} />)}
                </div>
                <div className="mt-5">
                  <Link to={`/events?category=${event.category_key}`}>
                    <Button variant="outline" size="sm">
                      {t("See all similar events", "Ver todos los eventos similares")}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: RSVP Panel (sticky) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RSVPPanel event={event} />

              {/* Gallery thumbnails */}
              {event.gallery_urls && event.gallery_urls.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t("Photos", "Fotos")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {event.gallery_urls.slice(0, 6).map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
