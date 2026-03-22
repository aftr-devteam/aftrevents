import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, RefreshCw } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Event } from "@/lib/eventData";

interface Props {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: Props) {
  const { lang, t } = useLang();

  const title = lang === "en" ? event.title : (event.titleEs || event.title);
  const desc  = lang === "en" ? event.description : (event.descriptionEs || event.description);

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Support both old (spotsLeft) and new (isFree, totalSpots) data shapes
  const isFree      = "isFree" in event ? event.isFree : event.price === 0;
  const price       = event.price ?? 0;
  const spotsLeft   = "spotsLeft" in event ? (event as any).spotsLeft : null;
  const totalSpots  = (event as any).totalSpots ?? null;
  const isRecurring = (event as any).isRecurring ?? false;

  const almostFull  = spotsLeft !== null && spotsLeft <= 6;
  const spotsPercent = totalSpots && spotsLeft !== null
    ? Math.round(((totalSpots - spotsLeft) / totalSpots) * 100)
    : null;

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group block bg-popover rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out stagger-${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={event.image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-popover/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{dateStr}</span>
        </div>

        {/* Price / Free badge */}
        <div
          className={`absolute top-3 right-3 rounded-lg px-3 py-1.5 ${
            isFree ? "bg-olive" : "bg-primary"
          }`}
        >
          <span className="text-sm font-bold text-white">
            {isFree ? t("Free", "Gratis") : `€${price}`}
          </span>
        </div>

        {/* Recurring badge */}
        {isRecurring && (
          <div className="absolute bottom-3 right-3 bg-popover/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {t("Recurring", "Recurrente")}
            </span>
          </div>
        )}

        {/* Almost full badge */}
        {almostFull && (
          <div className="absolute bottom-3 left-3 bg-destructive/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-xs font-medium text-destructive-foreground">
              ⚡ {t(`${spotsLeft} spots left`, `${spotsLeft} plazas`)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          {event.category}
        </p>
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{desc}</p>

        {/* Spots progress bar — only when more than 50% full */}
        {spotsPercent !== null && spotsPercent > 50 && spotsLeft !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{t("Filling up", "Llenándose")}</span>
              <span>{spotsLeft} {t("left", "restantes")}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-muted-foreground">{event.time}</span>
            <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
