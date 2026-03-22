import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, PlusCircle, User, CreditCard, LogOut, Menu, X, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMySubscription, PLAN_PRICES, type OrganizerSubscription, type DbEvent } from "@/lib/supabase";
import { useRequireOrganizer } from "@/hooks/useAuth";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  draft:            { label: "Draft",            color: "#374151", bg: "#f3f4f6" },
  pending_approval: { label: "Pending approval", color: "#92400e", bg: "#fef3c7" },
  published:        { label: "Published",        color: "#065f46", bg: "#d1fae5" },
  cancelled:        { label: "Cancelled",        color: "#991b1b", bg: "#fee2e2" },
  completed:        { label: "Completed",        color: "#374151", bg: "#f3f4f6" },
};

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/organizer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/organizer/events",    icon: CalendarDays,   label: "My Events" },
    { to: "/organizer/events/new", icon: PlusCircle,    label: "Create Event", accent: true },
    { to: "/organizer/profile",   icon: User,           label: "My Profile" },
    { to: "/organizer/subscription", icon: CreditCard, label: "Subscription" },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="h-full flex flex-col bg-warm-dark">
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link to="/" className="font-heading text-xl font-bold" style={{ color: "hsl(var(--sand-light))" }}>
          Aftr<span className="text-primary">.</span>
        </Link>
        <div className="text-xs mt-0.5" style={{ color: "hsl(var(--sand) / 0.5)" }}>Organizer Portal</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label, accent }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === to
                ? "bg-primary/20 text-primary"
                : accent
                  ? "text-primary hover:bg-primary/10"
                  : "hover:bg-white/5"
            }`}
            style={location.pathname !== to && !accent ? { color: "hsl(var(--sand) / 0.7)" } : {}}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-white/5"
          style={{ color: "hsl(var(--sand) / 0.5)" }}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const { user, profile } = useRequireOrganizer();
  const [sub, setSub] = useState<OrganizerSubscription | null>(null);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [subData, { data: eventsData }] = await Promise.all([
        getMySubscription(),
        supabase.from("events").select("*").eq("organizer_id", user.id).order("event_date", { ascending: true }),
      ]);
      setSub(subData);
      setEvents(eventsData || []);

      if (eventsData?.length) {
        const ids = eventsData.map(e => e.id);
        const { data: rsvps } = await supabase
          .from("rsvps")
          .select("event_id")
          .in("event_id", ids)
          .eq("status", "confirmed");

        const counts: Record<string, number> = {};
        rsvps?.forEach(r => { counts[r.event_id] = (counts[r.event_id] || 0) + 1; });
        setRsvpCounts(counts);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.event_date) >= now && e.status === "published");
  const totalRsvps = Object.values(rsvpCounts).reduce((a, b) => a + b, 0);
  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.ends_at).getTime() - now.getTime()) / 86400000)) : 0;

  const stats = [
    { label: "Events published", value: events.filter(e => e.status === "published").length },
    { label: "Total RSVPs",      value: totalRsvps },
    { label: "Upcoming events",  value: upcoming.length },
    { label: "Days remaining",   value: daysLeft, suffix: " days" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 flex-shrink-0 fixed top-0 bottom-0 left-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64">
            <Sidebar onClose={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-popover sticky top-0 z-40">
          <span className="font-heading text-lg font-bold text-foreground">
            Aftr<span className="text-primary">.</span>
          </span>
          <button onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="section-padding py-8 max-w-5xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground text-sm">Here's what's happening with your events.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-popover rounded-2xl border border-border p-5">
                <div className="font-heading text-3xl font-bold text-primary mb-1">
                  {s.value}{s.suffix || ""}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Create new event", to: "/organizer/events/new", primary: true },
              { label: "View my profile on Aftr", to: "/community-builders", external: false },
              { label: "Book onboarding session", href: "mailto:afterworkclubinternational@gmail.com?subject=Onboarding session booking" },
            ].map((a, i) => (
              a.href ? (
                <a key={i} href={a.href}
                  className="flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-popover hover:shadow-md transition-all text-sm font-semibold text-foreground">
                  {a.label} <ArrowRight className="w-4 h-4 text-primary" />
                </a>
              ) : (
                <Link key={i} to={a.to!}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all text-sm font-semibold ${
                    a.primary
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "border-border bg-popover text-foreground hover:shadow-md"
                  }`}>
                  {a.label} <ArrowRight className="w-4 h-4" />
                </Link>
              )
            ))}
          </div>

          {/* Events table */}
          <div className="bg-popover rounded-2xl border border-border overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">My upcoming events</h2>
              <Link to="/organizer/events/new">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="w-4 h-4 mr-1" /> New event
                </Button>
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-3xl mb-3">📅</div>
                <p className="text-muted-foreground text-sm mb-4">No events yet. Create your first one.</p>
                <Link to="/organizer/events/new">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create event <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Event", "Date", "Type", "Status", "RSVPs", "Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {events.slice(0, 10).map(ev => {
                      const st = STATUS_STYLES[ev.status] || STATUS_STYLES.draft;
                      return (
                        <tr key={ev.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-5 py-4 font-medium text-foreground max-w-xs truncate">{ev.title}</td>
                          <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                            {new Date(ev.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground capitalize">{ev.category_key}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ background: st.bg, color: st.color }}>{st.label}</span>
                          </td>
                          <td className="px-5 py-4 text-foreground font-medium">{rsvpCounts[ev.id] || 0}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Link to={`/organizer/events/${ev.id}/edit`}
                                className="text-xs font-semibold text-primary hover:underline">Edit</Link>
                              <Link to={`/events/${ev.id}`} target="_blank"
                                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                                View <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Subscription card */}
          {sub && (
            <div className="bg-popover rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Your subscription</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-foreground">{PLAN_PRICES[sub.plan].label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Renews {new Date(sub.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}<span className={daysLeft < 14 ? "text-destructive font-semibold" : ""}>{daysLeft} days left</span>
                  </div>
                </div>
                <a href="mailto:afterworkclubinternational@gmail.com?subject=Subscription renewal">
                  <Button variant="outline" size="sm">Renew subscription</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
