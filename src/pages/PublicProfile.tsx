import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Instagram, Linkedin, Globe, MapPin, Loader2, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AftrBadge, getBadgesForProfile } from "@/components/AftrBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { DbEvent } from "@/hooks/useEvents";

// ─── EVENT MINI CARD ──────────────────────────────────────────

function MiniEventCard({ event }: { event: DbEvent }) {
  const { lang } = useLang();
  const title = lang === "en" ? event.title : (event.title_es ?? event.title);

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex gap-3 bg-muted/50 rounded-xl border border-border p-3 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {event.cover_image_url
          ? <img src={event.cover_image_url} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">📅</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
          {event.category_label ?? event.category_key}
        </p>
        <p className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors mt-0.5">
          {title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(event.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" · "}{event.venue_name}
        </p>
      </div>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-lg self-start flex-shrink-0"
        style={event.is_free
          ? { background: "rgba(75,102,74,0.1)", color: "#4b664a" }
          : { background: "rgba(184,92,36,0.1)", color: "#b85c24" }
        }
      >
        {event.is_free ? "Free" : `€${event.price_euros}`}
      </span>
    </Link>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function PublicProfile() {
  const { id }          = useParams<{ id: string }>();
  const { t }           = useLang();
  const { user }        = useAuth();

  const [profile,    setProfile]    = useState<any | null>(null);
  const [events,     setEvents]     = useState<DbEvent[]>([]);
  const [connected,  setConnected]  = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    async function load() {
      // Fetch profile — only show if they have a badge (featured)
      // Exception: let anyone see their own profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Non-featured profiles are not publicly visible (unless viewing own)
      const hasBadge =
        profileData.is_admin ||
        profileData.is_verified_organizer ||
        profileData.is_connector ||
        profileData.is_community_builder;

      if (!hasBadge && !isOwnProfile) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch their published events (organizers only)
      if (profileData.is_verified_organizer) {
        const today = new Date().toISOString().split("T")[0];
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", id)
          .eq("status", "published")
          .gte("event_date", today)
          .order("event_date", { ascending: true })
          .limit(4);
        setEvents((eventsData as unknown as DbEvent[]) ?? []);
      }

      // Check connection status
      if (user && user.id !== id) {
        const { data: conn } = await supabase
          .from("connections")
          .select("id, status")
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .or(`requester_id.eq.${id},addressee_id.eq.${id}`)
          .maybeSingle();

        setConnected(conn?.status === "accepted");
      }

      setLoading(false);
    }

    load();
  }, [id, user]);

  async function handleAddToCircle() {
    if (!user || !id) return;
    setConnecting(true);
    await supabase.from("connections").insert({
      requester_id: user.id,
      addressee_id: id,
      status: "pending",
    });
    setConnected(true);
    setConnecting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto section-padding pt-32 text-center">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {t("Profile not found", "Perfil no encontrado")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t(
              "This profile doesn't exist or isn't publicly visible yet.",
              "Este perfil no existe o todavía no es visible públicamente."
            )}
          </p>
          <Link to="/builders-connectors">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("Meet the community →", "Conoce la comunidad →")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const badges   = getBadgesForProfile(profile);
  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const INTEREST_LABELS: Record<string, { en: string; es: string; icon: string }> = {
    social:    { en: "Social & Meetups",      es: "Social y Meetups",    icon: "🗣️" },
    tech:      { en: "Tech & Digital",        es: "Tech y Digital",      icon: "💻" },
    language:  { en: "Language & Culture",    es: "Idiomas y Cultura",   icon: "🌐" },
    arts:      { en: "Arts & Creative",       es: "Arte y Creatividad",  icon: "🎨" },
    outdoor:   { en: "Outdoor & Active",      es: "Aire libre",          icon: "🏕️" },
    food:      { en: "Food & Drinks",         es: "Gastronomía",         icon: "🍷" },
    learning:  { en: "Learning & Growth",     es: "Aprendizaje",         icon: "📚" },
    business:  { en: "Business & Networking", es: "Negocios",            icon: "💼" },
    nightlife: { en: "Nightlife",             es: "Vida Nocturna",       icon: "🎉" },
  };

  const LOOKING_LABELS: Record<string, { en: string; es: string }> = {
    friends:           { en: "Making friends",         es: "Hacer amigos" },
    language_exchange: { en: "Language exchange",      es: "Intercambio de idiomas" },
    cofounder:         { en: "Co-founder",             es: "Co-fundador" },
    networking:        { en: "Networking",             es: "Networking" },
    exploring:         { en: "Just exploring",         es: "Solo explorando" },
  };

  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto section-padding pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Profile card ── */}
          <div className="lg:col-span-1">
            <div className="bg-popover border border-border rounded-2xl p-6 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center mb-3">
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    : <span className="font-heading text-3xl font-bold text-primary">{initials}</span>
                  }
                </div>
                <h1 className="font-heading text-xl font-bold text-foreground mb-2">
                  {profile.full_name}
                </h1>
                <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                  {badges.map(b => <AftrBadge key={b} type={b} size="sm" />)}
                </div>
                {profile.nationality && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.city ? `${profile.city} · ` : ""}{profile.nationality}
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 text-center">
                  {profile.bio}
                </p>
              )}

              {/* Actions */}
              <div className="space-y-2.5">
                {isOwnProfile ? (
                  <Link to="/profile">
                    <Button variant="outline" className="w-full" size="sm">
                      {t("Edit my profile", "Editar mi perfil")}
                    </Button>
                  </Link>
                ) : user ? (
                  connected ? (
                    <div className="text-center">
                      <span className="text-sm font-semibold text-olive">
                        ✓ {t("In your Aftr Circle", "En tu Círculo Aftr")}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAddToCircle}
                      disabled={connecting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      <Users className="w-4 h-4 mr-1.5" />
                      {connecting
                        ? t("Adding…", "Añadiendo…")
                        : t("Add to my Aftr Circle", "Añadir a mi Círculo Aftr")
                      }
                    </Button>
                  )
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="w-full" size="sm">
                      {t("Log in to connect", "Inicia sesión para conectar")}
                    </Button>
                  </Link>
                )}

                {/* Social links — only visible to logged-in users */}
                {user && (connected || isOwnProfile) && (
                  <div className="flex justify-center gap-2 pt-2">
                    {profile.instagram_handle && (
                      <a
                        href={`https://instagram.com/${profile.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                )}

                {/* Show "Log in to see contacts" hint for guests */}
                {!user && (profile.instagram_handle || profile.linkedin_url || profile.website) && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    🔒 {t("Log in to see contact links", "Inicia sesión para ver los enlaces de contacto")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Interests */}
            {profile.languages_spoken?.length > 0 || profile.looking_for?.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-3">
                  {profile.languages_spoken?.length > 0 && (
                    <div className="bg-popover border border-border rounded-2xl p-5 flex-1 min-w-[200px]">
                      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {t("Languages", "Idiomas")}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages_spoken.map((l: string) => (
                          <span key={l} className="text-sm px-3 py-1 bg-muted rounded-full text-foreground font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.looking_for?.length > 0 && (
                    <div className="bg-popover border border-border rounded-2xl p-5 flex-1 min-w-[200px]">
                      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {t("Open to", "Abierto a")}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {profile.looking_for.map((l: string) => {
                          const item = LOOKING_LABELS[l];
                          return (
                            <span key={l} className="text-sm px-3 py-1 bg-muted rounded-full text-foreground font-medium">
                              {item ? (lang === "en" ? item.en : item.es) : l}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Upcoming events — Builders and Connectors */}
            {events.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {t("Upcoming events", "Próximos eventos")}
                  </h2>
                  <Link
                    to={`/events?organizer=${id}`}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    {t("See all →", "Ver todos →")}
                  </Link>
                </div>
                <div className="space-y-3">
                  {events.map(event => (
                    <MiniEventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Member since */}
            <div className="text-xs text-muted-foreground">
              {t("Aftr member since", "Miembro de Aftr desde")}{" "}
              {new Date(profile.created_at).toLocaleDateString(
                lang === "en" ? "en-GB" : "es-ES",
                { month: "long", year: "numeric" }
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
