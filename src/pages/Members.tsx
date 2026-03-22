import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Download, ChevronDown, ChevronUp, LayoutDashboard, Users, CalendarDays, BookOpen, Menu, X, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AftrBadge } from "@/components/AftrBadge";
import AftrLogo from "@/components/AftrLogo";

// ─── INLINE ADMIN LAYOUT ──────────────────────────────────────

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const links = [
    { to: "/admin",                  icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/members",          icon: Users,           label: "Members" },
    { to: "/admin/applications",     icon: CalendarDays,    label: "Applications" },
  ];
  return (
    <div className="h-full flex flex-col bg-warm-dark">
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link to="/"><AftrLogo className="h-6 w-auto text-white" /></Link>
        <div className="text-xs mt-1 font-semibold" style={{ color: "hsl(38 95% 64%)" }}>Admin</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === to ? "bg-primary/20 text-primary" : "hover:bg-white/5"
            }`}
            style={location.pathname !== to ? { color: "hsl(var(--sand) / 0.7)" } : {}}>
            <Icon className="w-4 h-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-5">
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-white/5"
          style={{ color: "hsl(var(--sand) / 0.4)" }}>← Back to site</Link>
      </div>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:block w-60 flex-shrink-0 fixed top-0 bottom-0 left-0">
        <AdminSidebar />
      </div>
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64"><AdminSidebar onClose={() => setMobileNav(false)} /></div>
        </div>
      )}
      <div className="flex-1 lg:ml-60">
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-popover sticky top-0 z-40">
          <AftrLogo className="h-6 w-auto text-foreground" />
          <button onClick={() => setMobileNav(v => !v)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="section-padding py-8 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── TYPES ────────────────────────────────────────────────────

interface MemberRow {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  nationality: string | null;
  city: string | null;
  is_verified_organizer: boolean;
  is_community_builder: boolean;
  is_connector: boolean;
  onboarding_completed: boolean;
  joined_at: string;
  join_reason: string | null;
  event_interests: string[] | null;
  event_interests_other: string | null;
  occupation: string | null;
  country_from: string | null;
  how_found_aftr: string | null;
  looking_for: string[] | null;
  wants_weekly_email: boolean | null;
  interested_in_hosting: boolean | null;
  current_plan: string | null;
  membership_status: string | null;
  total_rsvps: number;
  total_saves: number;
}

const JOIN_LABELS: Record<string, string> = {
  new_to_alicante: "New to Alicante",
  remote_worker: "Remote worker",
  local_meet_internationals: "Local seeking internationals",
  building_something: "Building something",
  just_fun: "Just for fun",
};

const HOW_FOUND_LABELS: Record<string, string> = {
  instagram: "Instagram", meetup: "Meetup", friend: "Word of mouth",
  google: "Google", event: "Attended an event", other: "Other",
};

// ─── EXPORT CSV ───────────────────────────────────────────────

function exportCSV(members: MemberRow[]) {
  const headers = [
    "Full name","Email","Phone","Nationality","City","Country from",
    "Occupation","Join reason","Event interests","Looking for",
    "How found","Weekly email","Wants hosting",
    "Organizer","Connector","Plan","Total RSVPs","Total saves","Joined",
  ];
  const rows = members.map(m => [
    m.full_name ?? "", m.email, m.phone ?? "", m.nationality ?? "",
    m.city ?? "", m.country_from ?? "", m.occupation ?? "",
    JOIN_LABELS[m.join_reason ?? ""] ?? m.join_reason ?? "",
    (m.event_interests ?? []).join("; "),
    (m.looking_for ?? []).join("; "),
    HOW_FOUND_LABELS[m.how_found_aftr ?? ""] ?? m.how_found_aftr ?? "",
    m.wants_weekly_email ? "Yes" : "No",
    m.interested_in_hosting ? "Yes" : "No",
    m.is_verified_organizer ? "Builder" : "",
    (m.is_connector || m.is_community_builder) ? "Connector" : "",
    m.current_plan ?? "", m.total_rsvps, m.total_saves,
    new Date(m.joined_at).toLocaleDateString("en-GB"),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `aftr-members-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

// ─── MEMBER ROW ───────────────────────────────────────────────

function MemberTableRow({ member }: { member: MemberRow }) {
  const [expanded, setExpanded] = useState(false);
  const isBuilder   = member.is_verified_organizer;
  const isConnector = member.is_connector || member.is_community_builder;

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(v => !v)}>
        <td className="px-5 py-4">
          <p className="font-semibold text-sm text-foreground">{member.full_name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </td>
        <td className="px-5 py-4">
          <div className="flex flex-wrap gap-1">
            {isBuilder   && <AftrBadge type="builder"   size="xs" />}
            {isConnector && <AftrBadge type="connector" size="xs" />}
            {!isBuilder && !isConnector && <span className="text-xs text-muted-foreground">Member</span>}
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-muted-foreground">{member.country_from ?? member.nationality ?? "—"}</td>
        <td className="px-5 py-4 text-sm text-muted-foreground">{JOIN_LABELS[member.join_reason ?? ""] ?? "—"}</td>
        <td className="px-5 py-4 text-center"><span className="text-sm font-semibold text-foreground">{member.total_rsvps}</span></td>
        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
          {new Date(member.joined_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </td>
        <td className="px-5 py-4">
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-muted/20">
          <td colSpan={7} className="px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {[
                { label: "Phone",          value: member.phone },
                { label: "City",           value: member.city },
                { label: "Occupation",     value: member.occupation },
                { label: "How found Aftr", value: HOW_FOUND_LABELS[member.how_found_aftr ?? ""] ?? member.how_found_aftr },
                { label: "Weekly email",   value: member.wants_weekly_email ? "✓ Yes" : "✗ No" },
                { label: "Wants to host",  value: member.interested_in_hosting ? "✓ Yes" : "✗ No" },
                { label: "Saved events",   value: member.total_saves },
                { label: "Plan",           value: member.current_plan ?? "None" },
                { label: "Onboarding",     value: member.onboarding_completed ? "✓ Complete" : "✗ Not done" },
              ].map(({ label, value }) => value != null && (
                <div key={label}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-foreground">{String(value)}</p>
                </div>
              ))}
              {member.event_interests && member.event_interests.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Event interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.event_interests.map(i => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-muted rounded-full text-foreground">{i}</span>
                    ))}
                    {member.event_interests_other && (
                      <span className="text-xs px-2.5 py-1 bg-muted rounded-full text-foreground italic">{member.event_interests_other}</span>
                    )}
                  </div>
                </div>
              )}
              {member.looking_for && member.looking_for.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Open to</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.looking_for.map(l => (
                      <span key={l} className="text-xs px-2.5 py-1 bg-muted rounded-full text-foreground">{l.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="sm:col-span-3 pt-2">
                <Link to={`/profile/${member.id}`} target="_blank">
                  <Button size="sm" variant="outline">View public profile →</Button>
                </Link>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function AdminMembers() {
  const { profile, loading: authLoading } = useRequireAdmin();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all"|"builder"|"connector"|"member"|"wants_hosting">("all");

  useEffect(() => {
    if (!authLoading && profile?.is_admin) {
      supabase.from("admin_members_view").select("*").then(({ data }) => {
        setMembers((data as MemberRow[]) ?? []);
        setLoading(false);
      });
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (m.full_name ?? "").toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.occupation ?? "").toLowerCase().includes(q) ||
      (m.country_from ?? "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all"           ? true :
      filter === "builder"       ? m.is_verified_organizer :
      filter === "connector"     ? (m.is_connector || m.is_community_builder) :
      filter === "wants_hosting" ? !!m.interested_in_hosting :
      !m.is_verified_organizer && !m.is_connector && !m.is_community_builder;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "Total members",         value: members.length },
    { label: "Builders",              value: members.filter(m => m.is_verified_organizer).length },
    { label: "Connectors",            value: members.filter(m => m.is_connector || m.is_community_builder).length },
    { label: "Want to host",          value: members.filter(m => m.interested_in_hosting).length },
    { label: "Onboarding done",       value: members.filter(m => m.onboarding_completed).length },
    { label: "Weekly email opt-in",   value: members.filter(m => m.wants_weekly_email).length },
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground text-sm">{members.length} total</p>
        </div>
        <Button onClick={() => exportCSV(filtered)} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV ({filtered.length})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-popover border border-border rounded-xl p-3 text-center">
            <div className="font-heading text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, occupation, country…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-popover text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all","builder","connector","member","wants_hosting"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}>
              {f === "wants_hosting" ? "Wants to host" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-popover border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Member","Role","From","Joined for","RSVPs","Joined",""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No members found</td></tr>
              ) : (
                filtered.map(m => <MemberTableRow key={m.id} member={m} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
