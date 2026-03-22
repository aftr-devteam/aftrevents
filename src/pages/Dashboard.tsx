import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays, Heart, Users, ArrowRight,
  Settings, PlusCircle, Clock, MapPin,
  LogOut, AlertCircle, Loader2, LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useRequireAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AftrLogo from "@/components/AftrLogo";
import { AftrBadge, getBadgesForProfile } from "@/components/AftrBadge";
import Footer from "@/components/Footer";

// ─── LAYOUT ───────────────────────────────────────────────────

function Sidebar({ profile, onClose }: { profile: any; onClose?: () => void }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const path = window.location.pathname;

  const isBuilder   = profile?.is_verified_organizer;
  const isConnector = profile?.is_connector || profile?.is_community_builder;
  const isAdmin     = profile?.is_admin;

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const badges = getBadgesForProfile(profile ?? {});

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const navLinks = [
    { icon: LayoutDashboard, label: t("Dashboard", "Dashboard"),       href: "/dashboard" },
    { icon: CalendarDays,    label: t("My RSVPs", "Mis RSVPs"),         href: "/dashboard/rsvps" },
    { icon: Heart,           label: t("Saved events", "Eventos guardados"), href: "/dashboard/saved" },
    { icon: Users,           label: t("My circle", "Mi círculo"),        href: "/dashboard/circle" },
    { icon: Settings,        label: t("My profile", "Mi perfil"),        href: "/profile" },
  ];

  const builderLinks = [
    { icon: PlusCircle,   label: t("Create event", "Crear evento"),    href: "/organizer/events/new" },
    { icon: CalendarDays, label: t("My events", "Mis eventos"),         href: "/organizer/dashboard" },
  ];

  return (
    <div className="h-full flex flex-col" style={{ background: "hsl(20 12% 16%)" }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <Link to="/" onClick={onClose}>
          <AftrLogo className="h-6 w-auto text-white" />
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {profile?.full_name ?? t("Member", "Miembro")}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {badges.length > 0
                ? badges.map(b => <AftrBadge key={b} type={b} size="xs" />)
                : <span className="text-xs" style={{ color: "rgba(246,242,233,0.4)" }}>{t("Member", "Miembro")}</span>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            to={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              path === href ? "bg-primary/20 text-primary" : "hover:bg-white/5"
            }`}
            style={path !== href ? { color: "rgba(246,242,233,0.6)" } : {}}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}

        {/* Builder tools */}
        {isBuilder && (
          <>
            <div className="px-4 pt-4 pb-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(246,242,233,0.3)" }}>
                {t("Builder tools", "Herramientas Builder")}
              </p>
            </div>
            {builderLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                to={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  path === href ? "bg-primary/20 text-primary" : "hover:bg-white/5"
                }`}
                style={path !== href ? { color: "rgba(246,242,233,0.6)" } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </>
        )}

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "rgba(63,119,157,0.9)" }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin panel
          </Link>
        )}
      </nav>

      {/* Upgrade nudge */}
      {!isBuilder && !isConnector && !isAdmin && (
        <div className="mx-3 mb-3 rounded-xl p-4" style={{ background: "rgba(184,92,36,0.12)" }}>
          <p className="text-xs font-semibold text-primary mb-1">
            {t("Want to post events?", "¿Quieres publicar eventos?")}
          </p>
          <p className="text-xs mb-3" style={{ color: "rgba(246,242,233,0.5)" }}>
            {t("Apply as Connector or Builder.", "Solicita ser Connector o Builder.")}
          </p>
          <Link to="/apply-role" onClick={onClose}>
            <button className="w-full text-xs font-semibold text-white bg-primary rounded-lg px-3 py-2 hover:bg-primary/90 transition-colors">
              {t("Learn more →", "Más info →")}
            </button>
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm w-full text-left hover:bg-white/5 transition-colors"
          style={{ color: "rgba(246,242,233,0.35)" }}
        >
          <LogOut className="w-4 h-4" />
          {t("Log out", "Cerrar sesión")}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD LAYOUT (exported for reuse in sub-pages) ────────

export function DashboardLayout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: any;
}) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-40">
        <Sidebar profile={profile} />
      </div>

      {/* Mobile overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-72 z-10">
            <Sidebar profile={profile} onClose={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b border-border"
          style={{ background: "hsl(var(--background) / 0.95)", backdropFilter: "blur(8px)" }}
        >
          <Link to="/"><AftrLogo className="h-6 w-auto text-foreground" /></Link>
          <button
            onClick={() => setMobileNav(v => !v)}
            className="w-9 h-9 rounded-xl border border-border flex flex-col items-center justify-center gap-1.5 hover:bg-muted transition-colors"
          >
            <div className="w-4 h-0.5 bg-foreground rounded" />
            <div className="w-4 h-0.5 bg-foreground rounded" />
          </button>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full section-padding py-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────

export default function Dashboard() {
  const { t } = useLang();
  const { user, profile, loading: authLoading } = useRequireAuth();
  const navigate = useNavigate();

  const [rsvps,   setRsvps]   = useState<any[]>([]);
  const [saves,   setSaves]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Redirect admin straight to admin panel
    if (profile?.is_admin) {
      navigate("/admin", { replace: true });
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    Promise.all([
      // Upcoming RSVPs
      supabase
        .from("rsvps")
        .select("event_id, events!inner(id,title,event_date,start_time,venue_name,cover_image_url,category_key,is_free,price_euros)")
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .gte("events.event_date", today)
        .order("events(event_date)", { ascending: true })
        .limit(5),

      // Saved events
      supabase
        .from("event_saves")
        .select("event_id, events!inner(id,title,event_date,start_time,venue_name,cover_image_url,category_key,is_free,price_euros)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
    ]).then(([{ data: rsvpData }, { data: saveData }]) => {
      setRsvps((rsvpData ?? []).map((r: any) => r.events).filter(Boolean));
      setSaves((saveData ?? []).map((s: any) => s.events).filter(Boolean));
      setLoading(false);
    });
  }, [user, profile]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const firstName   = profile?.full_name?.split(" ")[0] ?? t("there", "ahí");
  const isBuilder   = profile?.is_verified_organizer;
  const isConnector = profile?.is_connector || profile?.is_community_builder;
  const badges      = getBadgesForProfile(profile ?? {});

  // Profile completeness
  const profileChecks = [
    { key: "full_name",   label: t("Full name", "Nombre") },
    { key: "bio",         label: t("Bio", "Bio") },
    { key: "avatar_url",  label: t("Photo", "Foto") },
    { key: "nationality", label: t("Nationality", "Nacionalidad") },
  ];
  const filled = profileChecks.filter(f => !!(profile as any)?.[f.key]).length;
  const pct    = Math.round((filled / profileChecks.length) * 100);

  return (
    <DashboardLayout profile={profile}>

      {/* Greeting */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {t(`Hey ${firstName} 👋`, `Hola ${firstName} 👋`)}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {badges.map(b => <AftrBadge key={b} type={b} size="sm" />)}
            {badges.length === 0 && (
              <span className="text-sm text-muted-foreground">
                {t("Aftr Member", "Miembro de Aftr")}
              </span>
            )}
          </div>
        </div>
        <Link to="/profile">
          <div className="w-11 h-11 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-border hover:border-primary transition-colors">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <span className="font-bold text-foreground text-sm">{firstName[0]}</span>
            }
          </div>
        </Link>
      </div>

      {/* Role status cards */}
      {(isBuilder || isConnector) && (
        <div
          className="rounded-2xl border px-6 py-4 mb-8 flex flex-wrap items-center justify-between gap-4"
          style={{
            background: isBuilder ? "rgba(184,92,36,0.05)" : "rgba(75,102,74,0.05)",
            borderColor: isBuilder ? "rgba(184,92,36,0.2)" : "rgba(75,102,74,0.2)",
          }}
        >
          <div>
            <p className="font-semibold text-foreground text-sm mb-0.5">
              {isBuilder
                ? t("You can create and post your own events", "Puedes crear y publicar tus propios eventos")
                : t("You're featured on the Aftr community page", "Estás destacado en la página de comunidad Aftr")
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {isBuilder
                ? t("Events go live after Aftr admin review", "Los eventos se publican tras revisión del admin Aftr")
                : t("Members can find you on /builders-connectors", "Los miembros pueden encontrarte en /builders-connectors")
              }
            </p>
          </div>
          {isBuilder
            ? (
              <Link to="/organizer/events/new">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  {t("Create event", "Crear evento")}
                </Button>
              </Link>
            ) : (
              <Link to={`/profile/${user?.id}`}>
                <Button size="sm" variant="outline">
                  {t("View my public profile", "Ver mi perfil público")} →
                </Button>
              </Link>
            )
          }
        </div>
      )}

      {/* Profile nudge */}
      {pct < 100 && (
        <div className="bg-muted/50 rounded-2xl border border-border px-5 py-4 flex items-start gap-4 mb-8">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">
                {t(`Profile ${pct}% complete`, `Perfil ${pct}% completo`)}
              </p>
              <Link to="/profile" className="text-xs text-primary font-semibold hover:underline flex-shrink-0 ml-2">
                {t("Complete →", "Completar →")}
              </Link>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {profileChecks.map(f => {
                const done = !!(profile as any)?.[f.key];
                return (
                  <span
                    key={f.key}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={done
                      ? { background: "rgba(75,102,74,0.12)", color: "#4b664a" }
                      : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {done ? "✓ " : "○ "}{f.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Apply nudge — plain members only */}
      {!isBuilder && !isConnector && (
        <div className="bg-popover border border-border rounded-2xl px-6 py-5 mb-8">
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">
            {t("Want to do more with Aftr?", "¿Quieres hacer más con Aftr?")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              "Volunteer as a Connector host, or post your own events as a Builder. Both roles get you featured publicly on the Aftr platform.",
              "Sé voluntario como host Connector, o publica tus propios eventos como Builder. Ambos roles te destacan públicamente en la plataforma Aftr."
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/apply-role?role=connector">
              <Button variant="outline" size="sm">
                🌿 {t("Apply as Connector (free)", "Solicitar como Connector (gratis)")}
              </Button>
            </Link>
            <Link to="/apply-role?role=builder">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                🔶 {t("Apply as Builder", "Solicitar como Builder")}
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Upcoming RSVPs ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">
              {t("Upcoming events", "Próximos eventos")}
            </h2>
            <Link to="/events" className="text-xs text-primary font-semibold hover:underline">
              {t("Browse more →", "Ver más →")}
            </Link>
          </div>

          {rsvps.length === 0 ? (
            <div className="bg-muted/40 rounded-2xl border border-border px-6 py-10 text-center">
              <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground mb-3">
                {t("No upcoming events yet.", "No tienes eventos próximos todavía.")}
              </p>
              <Link to="/events">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("Browse events", "Ver eventos")}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {rsvps.map((event: any) => {
                const d = new Date(event.event_date);
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex items-center gap-4 bg-popover border border-border rounded-2xl px-4 py-3 hover:shadow-md hover:border-primary/30 transition-all group"
                  >
                    {/* Date */}
                    <div className="w-12 text-center flex-shrink-0">
                      <div className={`text-xs font-bold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                        {isToday ? t("TODAY", "HOY") : d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase()}
                      </div>
                      <div className="font-heading text-xl font-bold text-foreground leading-none">{d.getDate()}</div>
                      <div className="text-xs text-muted-foreground">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
                    </div>
                    {/* Cover */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      {event.cover_image_url
                        ? <img src={event.cover_image_url} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full flex items-center justify-center text-xl opacity-30">📅</div>
                      }
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{event.start_time?.slice(0,5)}
                        <span className="mx-1">·</span>
                        <MapPin className="w-3 h-3" />{event.venue_name}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Saved events ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">
              {t("Saved events", "Eventos guardados")}
            </h2>
            <Link to="/dashboard/saved" className="text-xs text-primary font-semibold hover:underline">
              {t("See all →", "Ver todos →")}
            </Link>
          </div>

          {saves.length === 0 ? (
            <div className="bg-muted/40 rounded-2xl border border-border px-6 py-10 text-center">
              <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">
                {t(
                  "Save events you're interested in — tap the heart icon on any event.",
                  "Guarda los eventos que te interesan — pulsa el corazón en cualquier evento."
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {saves.map((event: any) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group bg-popover border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {event.cover_image_url
                      ? <img src={event.cover_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📅</div>
                    }
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-xs text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links row */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("Browse events", "Ver eventos"),         href: "/events",                icon: "📅" },
          { label: t("My profile",    "Mi perfil"),           href: "/profile",               icon: "👤" },
          { label: t("Community",     "Comunidad"),           href: "/community",             icon: "🌍" },
          { label: t("Apply for role","Solicitar rol"),       href: "/apply-role",            icon: "🚀" },
        ].map(item => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-2.5 bg-popover border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
