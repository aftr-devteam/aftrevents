import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, BookOpen, Menu, X, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  APPLICATION_STATUS_LABELS, PLAN_PRICES,
  type OrganizerApplication, type ApplicationStatus,
} from "@/lib/supabase";
import { useRequireAdmin } from "@/hooks/useAuth";

// ─── SHARED ADMIN SIDEBAR ─────────────────────────────────────

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/admin",                  icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/applications",     icon: Users,           label: "Applications" },
    { to: "/admin/events",           icon: CalendarDays,    label: "Events" },
    { to: "/admin/onboarding",       icon: BookOpen,        label: "Onboarding" },
  ];

  return (
    <div className="h-full flex flex-col bg-warm-dark">
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link to="/" className="font-heading text-xl font-bold" style={{ color: "hsl(var(--sand-light))" }}>
          Aftr<span className="text-primary">.</span>
        </Link>
        <div className="text-xs mt-0.5 font-semibold" style={{ color: "hsl(38 95% 64%)" }}>Admin</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === to ? "bg-primary/20 text-primary" : "hover:bg-white/5"
            }`}
            style={location.pathname !== to ? { color: "hsl(var(--sand) / 0.7)" } : {}}>
            <Icon className="w-4 h-4" />
            {label}
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
          <span className="font-heading text-lg font-bold text-foreground">Aftr<span className="text-primary">.</span> <span className="text-xs font-body text-muted-foreground">Admin</span></span>
          <button onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="section-padding py-8 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD (/admin) ─────────────────────────────────

export function AdminDashboard() {
  const { profile, loading } = useRequireAdmin();
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, pendingEvents: 0 });

  useEffect(() => {
    if (!loading && profile?.is_admin) {
      Promise.all([
        supabase.from("organizer_applications").select("status"),
        supabase.from("events").select("status").eq("status", "pending_approval"),
      ]).then(([{ data: apps }, { data: events }]) => {
        if (apps) {
          setStats({
            total: apps.length,
            pending: apps.filter(a => a.status === "pending_review").length,
            active: apps.filter(a => a.status === "active").length,
            pendingEvents: events?.length || 0,
          });
        }
      });
    }
  }, [loading, profile]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Loading…</div></div>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Overview</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total applications", value: stats.total },
          { label: "Pending review",     value: stats.pending, alert: stats.pending > 0 },
          { label: "Active organizers",  value: stats.active },
          { label: "Events pending",     value: stats.pendingEvents, alert: stats.pendingEvents > 0 },
        ].map(s => (
          <div key={s.label} className={`bg-popover rounded-2xl border p-5 ${s.alert ? "border-primary/40" : "border-border"}`}>
            <div className={`font-heading text-3xl font-bold mb-1 ${s.alert ? "text-primary" : "text-foreground"}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/applications" className="flex items-center justify-between bg-popover rounded-2xl border border-border px-6 py-5 hover:shadow-md transition-all">
          <div>
            <div className="font-semibold text-foreground mb-0.5">Manage applications</div>
            <div className="text-sm text-muted-foreground">{stats.pending} pending review</div>
          </div>
          <ArrowRight className="w-5 h-5 text-primary" />
        </Link>
        <Link to="/admin/events" className="flex items-center justify-between bg-popover rounded-2xl border border-border px-6 py-5 hover:shadow-md transition-all">
          <div>
            <div className="font-semibold text-foreground mb-0.5">Review events</div>
            <div className="text-sm text-muted-foreground">{stats.pendingEvents} pending approval</div>
          </div>
          <ArrowRight className="w-5 h-5 text-primary" />
        </Link>
      </div>
    </AdminLayout>
  );
}

// ─── ADMIN APPLICATIONS LIST (/admin/applications) ────────────

const ALL_STATUSES: ApplicationStatus[] = [
  "pending_review", "screening_booked", "approved_pending_payment",
  "payment_submitted", "active", "rejected",
];

export function AdminApplications() {
  const { profile, loading } = useRequireAdmin();
  const [apps, setApps] = useState<OrganizerApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && profile?.is_admin) {
      supabase.from("organizer_applications").select("*").order("created_at", { ascending: false })
        .then(({ data }) => { setApps(data || []); setFetching(false); });
    }
  }, [loading, profile]);

  if (loading || fetching) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Loading…</div></div>;

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Applications</h1>
        <p className="text-muted-foreground text-sm">{apps.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
          All ({apps.length})
        </button>
        {ALL_STATUSES.map(s => {
          const count = apps.filter(a => a.status === s).length;
          if (count === 0) return null;
          const lbl = APPLICATION_STATUS_LABELS[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {lbl.en} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-popover rounded-2xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground text-sm">No applications in this category</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Email", "Applied", "Plan", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(app => {
                  const st = APPLICATION_STATUS_LABELS[app.status];
                  return (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-foreground">{app.full_name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{app.email}</td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{PLAN_PRICES[app.preferred_plan]?.label}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: st.bg, color: st.color }}>{st.en}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/admin/applications/${app.id}`}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                          Review <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ─── ADMIN APPLICATION DETAIL (/admin/applications/:id) ───────

type DialogState =
  | { type: "screening"; date: string; notes: string }
  | { type: "approve" }
  | { type: "reject"; reason: string }
  | { type: "confirm_payment" }
  | { type: "suspend" }
  | null;

export function AdminApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile: adminProfile, loading: authLoading } = useRequireAdmin();
  const navigate = useNavigate();
  const [app, setApp] = useState<OrganizerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [acting, setActing] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [paymentProof, setPaymentProof] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && adminProfile?.is_admin && id) {
      Promise.all([
        supabase.from("organizer_applications").select("*").eq("id", id).single(),
        supabase.from("payment_proofs").select("*").eq("application_id", id).maybeSingle(),
      ]).then(([{ data: appData }, { data: proof }]) => {
        setApp(appData);
        setPaymentProof(proof);
        setLoading(false);
      });
    }
  }, [authLoading, adminProfile, id]);

  async function logAction(action: string, notes?: string) {
    await supabase.from("admin_log").insert({
      admin_id: adminProfile!.id,
      action,
      target_type: "application",
      target_id: id,
      notes: notes || null,
    });
  }

  async function updateAppStatus(status: ApplicationStatus, extra?: Record<string, any>) {
    await supabase.from("organizer_applications")
      .update({ status, updated_at: new Date().toISOString(), ...extra })
      .eq("id", id!);
    setApp(prev => prev ? { ...prev, status, ...extra } : prev);
  }

  async function handleBookScreening() {
    if (dialog?.type !== "screening" || !dialog.date) return;
    setActing(true);
    await updateAppStatus("screening_booked", { screening_date: dialog.date, screening_notes: dialog.notes });
    await logAction("screening_booked", dialog.notes);
    setActing(false);
    setDialog(null);
    setActionMsg("Screening call booked successfully.");
  }

  async function handleApprove() {
    setActing(true);
    await updateAppStatus("approved_pending_payment", { approved_at: new Date().toISOString(), approved_by: adminProfile!.id });
    await logAction("approved");
    setActing(false);
    setDialog(null);
    setActionMsg("Application approved. Applicant will receive payment instructions.");
  }

  async function handleReject() {
    if (dialog?.type !== "reject") return;
    setActing(true);
    await updateAppStatus("rejected", { rejection_reason: dialog.reason });
    await logAction("rejected", dialog.reason);
    setActing(false);
    setDialog(null);
    setActionMsg("Application rejected.");
  }

  async function handleConfirmPayment() {
    if (!paymentProof) return;
    setActing(true);
    // 1. Confirm payment proof
    await supabase.from("payment_proofs").update({ confirmed: true, confirmed_at: new Date().toISOString(), confirmed_by: adminProfile!.id }).eq("id", paymentProof.id);
    // 2. Create subscription
    const startDate = new Date();
    const endDate = new Date();
    const months = PLAN_PRICES[app!.preferred_plan]?.months || 1;
    endDate.setMonth(endDate.getMonth() + months);
    await supabase.from("organizer_subscriptions").insert({
      user_id: app!.user_id,
      application_id: app!.id,
      plan: app!.preferred_plan,
      amount_euros: PLAN_PRICES[app!.preferred_plan]?.euros,
      started_at: startDate.toISOString(),
      ends_at: endDate.toISOString(),
      is_active: true,
    });
    // 3. Activate profile
    await supabase.from("profiles").update({ is_verified_organizer: true }).eq("id", app!.user_id);
    // 4. Update app status
    await updateAppStatus("active");
    await logAction("payment_confirmed_and_activated");
    setActing(false);
    setDialog(null);
    setActionMsg("Payment confirmed. Organizer is now active!");
  }

  async function handleSuspend() {
    setActing(true);
    await supabase.from("profiles").update({ is_verified_organizer: false }).eq("id", app!.user_id);
    await supabase.from("organizer_subscriptions").update({ is_active: false }).eq("user_id", app!.user_id);
    await updateAppStatus("cancelled");
    await logAction("suspended");
    setActing(false);
    setDialog(null);
    setActionMsg("Organizer suspended.");
  }

  if (authLoading || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Loading…</div></div>;
  if (!app) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Application not found</div></div>;

  const st = APPLICATION_STATUS_LABELS[app.status];

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link to="/admin/applications" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          ← Back to applications
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{app.full_name}</h1>
            <p className="text-muted-foreground text-sm">{app.email} · Applied {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <span className="inline-flex px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0"
            style={{ background: st.bg, color: st.color }}>{st.en}</span>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {actionMsg}
        </div>
      )}

      {/* Action buttons based on status */}
      <div className="mb-6 flex flex-wrap gap-3">
        {app.status === "pending_review" && (
          <Button onClick={() => setDialog({ type: "screening", date: "", notes: "" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90">
            Book screening call
          </Button>
        )}
        {app.status === "screening_booked" && (
          <>
            <Button onClick={() => setDialog({ type: "approve" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90">
              Mark as approved
            </Button>
            <Button variant="outline" onClick={() => setDialog({ type: "reject", reason: "" })}
              className="border-destructive/30 text-destructive hover:bg-destructive/5">
              Reject application
            </Button>
          </>
        )}
        {app.status === "payment_submitted" && paymentProof && (
          <>
            <Button onClick={() => setDialog({ type: "confirm_payment" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90">
              Confirm payment & activate
            </Button>
            <Button variant="outline" onClick={async () => {
              await supabase.from("organizer_applications").update({ admin_notes: "Requested new payment proof", updated_at: new Date().toISOString() }).eq("id", id!);
              setActionMsg("Requested new payment proof. Applicant has been notified.");
            }}>
              Request new proof
            </Button>
          </>
        )}
        {app.status === "active" && (
          <Button variant="outline" onClick={() => setDialog({ type: "suspend" })}
            className="border-destructive/30 text-destructive hover:bg-destructive/5">
            Suspend organizer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application details */}
        <div className="space-y-5">
          <div className="bg-popover rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Application details</h2>
            <div className="space-y-3">
              {[
                { label: "Phone", value: app.phone },
                { label: "Plan", value: PLAN_PRICES[app.preferred_plan]?.label },
                { label: "Payment ref", value: app.payment_reference },
                { label: "Nationality", value: (app as any).nationality || "—" },
                { label: "Instagram", value: app.instagram_handle || "—" },
                { label: "LinkedIn", value: app.linkedin_url || "—" },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground text-right max-w-xs truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-popover rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Event types</h2>
            <div className="flex flex-wrap gap-2">
              {app.event_types.map(t => (
                <span key={t} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground">{t}</span>
              ))}
            </div>
          </div>

          {paymentProof && (
            <div className="bg-popover rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">Payment proof</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium capitalize">{paymentProof.payment_method?.replace("_", " ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{paymentProof.payment_date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">€{paymentProof.amount_euros}</span></div>
              </div>
              {paymentProof.proof_image_url && (
                <a href={paymentProof.proof_image_url} target="_blank" rel="noopener noreferrer"
                  className="block w-full rounded-xl overflow-hidden border border-border">
                  <img src={paymentProof.proof_image_url} alt="Payment proof" className="w-full max-h-48 object-cover" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Long text fields */}
        <div className="space-y-5">
          {[
            { label: "Bio", value: app.bio },
            { label: "Experience", value: app.experience },
            { label: "Why Aftr", value: app.why_aftr },
            { label: "Social proof", value: app.social_proof },
          ].filter(f => f.value).map(f => (
            <div key={f.label} className="bg-popover rounded-2xl border border-border p-6">
              <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">{f.label}</h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-popover rounded-2xl border border-border p-7 w-full max-w-md shadow-xl">

            {dialog.type === "screening" && (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-5">Book screening call</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Date & time <span className="text-primary">*</span></label>
                    <input type="datetime-local" value={dialog.date}
                      onChange={e => setDialog({ ...dialog, date: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Notes for applicant (optional)</label>
                    <textarea value={dialog.notes} onChange={e => setDialog({ ...dialog, notes: e.target.value })}
                      rows={3} placeholder="Meeting link, prep instructions..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleBookScreening} disabled={acting || !dialog.date}
                    className="flex-1 bg-primary text-primary-foreground">{acting ? "Saving…" : "Confirm booking"}</Button>
                  <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                </div>
              </>
            )}

            {dialog.type === "approve" && (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">Approve application</h3>
                <p className="text-muted-foreground text-sm mb-6">This will move {app.full_name} to the payment step. They'll receive instructions to pay via Bizum or bank transfer.</p>
                <div className="flex gap-3">
                  <Button onClick={handleApprove} disabled={acting} className="flex-1 bg-primary text-primary-foreground">{acting ? "Approving…" : "Approve"}</Button>
                  <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                </div>
              </>
            )}

            {dialog.type === "reject" && (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">Reject application</h3>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-foreground mb-2">Reason (shown to applicant)</label>
                  <textarea value={dialog.reason} onChange={e => setDialog({ ...dialog, reason: e.target.value })}
                    rows={4} placeholder="Explain why this application isn't approved..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleReject} disabled={acting}
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">{acting ? "Rejecting…" : "Reject application"}</Button>
                  <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                </div>
              </>
            )}

            {dialog.type === "confirm_payment" && (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">Confirm payment & activate</h3>
                <p className="text-muted-foreground text-sm mb-6">This will confirm the payment, create a subscription for <strong>{PLAN_PRICES[app.preferred_plan]?.months} months</strong>, and activate {app.full_name} as a Verified Organizer.</p>
                <div className="flex gap-3">
                  <Button onClick={handleConfirmPayment} disabled={acting} className="flex-1 bg-primary text-primary-foreground">{acting ? "Activating…" : "Confirm & activate"}</Button>
                  <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                </div>
              </>
            )}

            {dialog.type === "suspend" && (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">Suspend organizer</h3>
                <p className="text-muted-foreground text-sm mb-6">This will remove {app.full_name}'s verified status and deactivate their subscription.</p>
                <div className="flex gap-3">
                  <Button onClick={handleSuspend} disabled={acting}
                    className="flex-1 bg-destructive text-destructive-foreground">{acting ? "Suspending…" : "Suspend"}</Button>
                  <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
