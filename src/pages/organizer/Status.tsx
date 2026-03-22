import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Check, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyApplication, getMySubscription,
  APPLICATION_STATUS_LABELS, PLAN_PRICES,
  type OrganizerApplication, type OrganizerSubscription,
} from "@/lib/supabase";
import { useRequireAuth } from "@/hooks/useAuth";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DaysBar({ endsAt }: { endsAt: string }) {
  const total = 30;
  const end = new Date(endsAt);
  const now = new Date();
  const remaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const pct = Math.round((remaining / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">Days remaining</span>
        <span className="font-semibold text-foreground">{remaining} days</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function OrganizerStatus() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useRequireAuth();
  const [app, setApp] = useState<OrganizerApplication | null>(null);
  const [sub, setSub] = useState<OrganizerSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment proof form
  const [proofMethod, setProofMethod] = useState<"bizum" | "bank_transfer">("bizum");
  const [proofDate, setProofDate] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofNotes, setProofNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      Promise.all([getMyApplication(), getMySubscription()]).then(([a, s]) => {
        setApp(a);    // null is fine — we handle it below
        setSub(s);
        setLoading(false);
      });
    }
  }, [authLoading, user]);

  async function submitPaymentProof() {
    if (!app || !proofDate) { setUploadError("Please fill in the payment date"); return; }
    setUploading(true);
    setUploadError("");

    let proofUrl = null;

    if (proofFile) {
      const ext = proofFile.name.split(".").pop();
      const path = `${user.id}/${app.id}.${ext}`;
      const { error: storageErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, proofFile, { upsert: true });

      if (storageErr) {
        setUploading(false);
        setUploadError("Failed to upload image. Please try again.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      proofUrl = publicUrl;
    }

    const amount = PLAN_PRICES[app.preferred_plan].euros;

    const { error: dbErr } = await supabase.from("payment_proofs").insert({
      application_id: app.id,
      user_id: user.id,
      plan: app.preferred_plan,
      amount_euros: amount,
      payment_method: proofMethod,
      payment_date: proofDate,
      proof_image_url: proofUrl,
      notes: proofNotes || null,
    });

    if (dbErr) {
      setUploading(false);
      setUploadError("Failed to save proof. Please email us directly.");
      return;
    }

    await supabase.from("organizer_applications")
      .update({ status: "payment_submitted" })
      .eq("id", app.id);

    setApp(prev => prev ? { ...prev, status: "payment_submitted" } : prev);
    setUploading(false);
    setUploadDone(true);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!app) return (
    <div className="min-h-screen bg-background flex items-center justify-center section-padding">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
          No application found
        </h2>
        <p className="text-muted-foreground mb-6">
          You haven't applied to become a Builder yet. Start your application to get your events in front of 2,220+ Aftr members.
        </p>
        <Link to="/apply-role?role=builder">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Apply as Builder →
          </Button>
        </Link>
        <div className="mt-4">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  const statusLabel = APPLICATION_STATUS_LABELS[app.status];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-popover sticky top-0 z-10">
        <div className="max-w-3xl mx-auto section-padding h-16 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-foreground">
            Aftr<span className="text-primary">.</span>
          </Link>
          <span className="text-sm text-muted-foreground">Application Status</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto section-padding py-12">
        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8"
          style={{ background: statusLabel.bg, color: statusLabel.color }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: statusLabel.color }} />
          {statusLabel.en}
        </div>

        {/* ── PENDING REVIEW ── */}
        {app.status === "pending_review" && (
          <div className="bg-popover rounded-2xl border border-border p-8">
            <div className="text-4xl mb-4">🔍</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Your application is being reviewed
            </h1>
            <p className="text-muted-foreground mb-6">
              We review every application personally. You'll hear from us within 3 business days with next steps.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Applied", value: new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                { label: "Plan", value: PLAN_PRICES[app.preferred_plan].label },
                { label: "Reference", value: app.payment_reference || "—" },
              ].map(item => (
                <div key={item.label} className="bg-muted rounded-xl p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="font-semibold text-foreground text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCREENING BOOKED ── */}
        {app.status === "screening_booked" && (
          <div className="bg-popover rounded-2xl border border-border p-8">
            <div className="text-4xl mb-4">📞</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Your screening call is confirmed
            </h1>
            {app.screening_date && (
              <div className="bg-primary/8 border border-primary/20 rounded-xl p-5 mb-5">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Your call is scheduled for</div>
                <div className="font-heading text-xl font-bold text-foreground">
                  {new Date(app.screening_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <div className="text-muted-foreground text-sm mt-1">
                  {new Date(app.screening_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            )}
            <p className="text-muted-foreground">
              We'll discuss your events, experience, and how Aftr works. The call takes about 30 minutes. You'll receive the meeting link via email.
            </p>
          </div>
        )}

        {/* ── APPROVED PENDING PAYMENT ── */}
        {app.status === "approved_pending_payment" && (
          <div className="space-y-6">
            <div className="bg-popover rounded-2xl border border-border p-8">
              <div className="text-4xl mb-4">🎉</div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
                Congratulations — you're approved!
              </h1>
              <p className="text-muted-foreground mb-6">
                Complete your payment to activate your Verified Organizer subscription.
              </p>

              {/* Payment instructions */}
              <div className="bg-muted rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Your payment reference</span>
                </div>
                <div className="font-heading text-2xl font-bold text-foreground flex items-center gap-1">
                  {app.payment_reference}
                  <CopyButton text={app.payment_reference || ""} />
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount to pay</span>
                    <span className="font-bold text-foreground">€{PLAN_PRICES[app.preferred_plan].euros}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-foreground">{PLAN_PRICES[app.preferred_plan].label}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="text-sm font-semibold text-foreground">Option 1 — Bizum</div>
                  <div className="text-sm text-muted-foreground">
                    Send to <strong className="text-foreground">+34 644 48 58 73</strong> (Joana Faye Beriso)
                    <br />Use <strong className="text-foreground">{app.payment_reference}</strong> as the concept/message
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="text-sm font-semibold text-foreground">Option 2 — Bank transfer</div>
                  <div className="text-sm text-muted-foreground">
                    Contact us at{" "}
                    <a href="mailto:afterworkclubinternational@gmail.com" className="text-primary">
                      afterworkclubinternational@gmail.com
                    </a>{" "}
                    for bank details. Use <strong className="text-foreground">{app.payment_reference}</strong> as the subject.
                  </div>
                </div>
              </div>
            </div>

            {/* Upload proof */}
            {!uploadDone ? (
              <div className="bg-popover rounded-2xl border border-border p-8">
                <h2 className="font-heading text-xl font-bold text-foreground mb-5">
                  Upload your payment proof
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Payment method</label>
                    <div className="flex gap-3">
                      {(["bizum", "bank_transfer"] as const).map(m => (
                        <label key={m} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${proofMethod === m ? "border-primary bg-primary/5" : "border-border"}`}>
                          <input type="radio" name="method" value={m} checked={proofMethod === m} onChange={() => setProofMethod(m)} className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium capitalize">{m.replace("_", " ")}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Payment date <span className="text-primary">*</span></label>
                    <input type="date" value={proofDate} onChange={e => setProofDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Screenshot of payment</label>
                    <label className="flex items-center gap-3 w-full rounded-xl border border-dashed border-border bg-muted px-4 py-5 cursor-pointer hover:border-primary/40 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {proofFile ? proofFile.name : "Click to upload image (JPG, PNG)"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setProofFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <textarea value={proofNotes} onChange={e => setProofNotes(e.target.value)}
                      placeholder="Any additional notes for the Aftr team..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
                  </div>
                  {uploadError && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{uploadError}</div>
                  )}
                  <Button onClick={submitPaymentProof} disabled={uploading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                    {uploading ? "Submitting…" : "Submit payment proof"}
                    {!uploading && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-popover rounded-2xl border border-border p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">Proof submitted!</h2>
                <p className="text-muted-foreground text-sm">We'll confirm your payment within 24 hours and send you a welcome email.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PAYMENT SUBMITTED ── */}
        {app.status === "payment_submitted" && (
          <div className="bg-popover rounded-2xl border border-border p-8">
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Payment received — confirming now
            </h1>
            <p className="text-muted-foreground">
              We've received your payment proof and will confirm within 24 hours. You'll get an email once you're activated.
            </p>
          </div>
        )}

        {/* ── ACTIVE ── */}
        {app.status === "active" && sub && (
          <div className="space-y-5">
            <div className="bg-popover rounded-2xl border border-border p-8">
              <div className="text-4xl mb-4">✅</div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
                You're a Verified Aftr Organizer
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Plan", value: PLAN_PRICES[sub.plan].label },
                  { label: "Started", value: new Date(sub.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: "Renews", value: new Date(sub.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                ].map(item => (
                  <div key={item.label} className="bg-muted rounded-xl p-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-semibold text-foreground text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
              <DaysBar endsAt={sub.ends_at} />
            </div>
            <Link to="/organizer/dashboard">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to your dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* ── EXPIRED ── */}
        {app.status === "expired" && (
          <div className="bg-popover rounded-2xl border border-border p-8">
            <div className="text-4xl mb-4">🕐</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Your subscription has expired
            </h1>
            <p className="text-muted-foreground mb-6">
              Renew to continue posting events and accessing Aftr Circle.
            </p>
            <a href="mailto:afterworkclubinternational@gmail.com?subject=Subscription renewal">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Renew subscription <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
        )}

        {/* ── REJECTED ── */}
        {app.status === "rejected" && (
          <div className="bg-popover rounded-2xl border border-border p-8">
            <div className="text-4xl mb-4">💌</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Application not approved this time
            </h1>
            {app.rejection_reason && (
              <div className="bg-muted rounded-xl p-4 mb-5 text-sm text-muted-foreground">
                <div className="font-semibold text-foreground mb-1">Feedback from Aftr:</div>
                {app.rejection_reason}
              </div>
            )}
            <p className="text-muted-foreground">
              You're welcome to reapply in 3 months. If you have questions, reach out to us directly.
            </p>
          </div>
        )}

        {/* Footer contact */}
        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Questions?{" "}
            <a href="mailto:afterworkclubinternational@gmail.com" className="text-primary hover:underline">
              Contact afterworkclubinternational@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
