// Single source of truth for the Supabase client.
// Re-exports Lovable's auto-generated client so all imports are consistent.
export { supabase } from "@/integrations/supabase/client";

// ─── PLAN PRICES ─────────────────────────────────────────────

export type SubscriptionPlan = "monthly" | "biannual" | "annual";

export const PLAN_PRICES: Record<
  SubscriptionPlan,
  { euros: number; label: string; months: number; saving?: string }
> = {
  monthly:  { euros: 18,  label: "€18 / month",               months: 1  },
  biannual: { euros: 90,  label: "€90 for 6 months (€15/mo)", months: 6,  saving: "Save 17%" },
  annual:   { euros: 150, label: "€150 / year (€12.50/mo)",   months: 12, saving: "Save 31%" },
};

// ─── TYPES ───────────────────────────────────────────────────

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  instagram_handle: string | null;
  linkedin_url: string | null;
  bio: string | null;
  nationality: string | null;
  city: string;
  avatar_url: string | null;
  is_verified_organizer: boolean;
  is_admin: boolean;
  created_at: string;
};

export type ApplicationStatus =
  | "pending_review"
  | "screening_booked"
  | "approved_pending_payment"
  | "payment_submitted"
  | "active"
  | "expired"
  | "cancelled"
  | "rejected";

export type OrganizerApplication = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  instagram_handle: string | null;
  linkedin_url: string | null;
  website: string | null;
  bio: string;
  event_types: string[];
  experience: string;
  why_aftr: string;
  social_proof: string | null;
  preferred_plan: SubscriptionPlan;
  status: ApplicationStatus;
  admin_notes: string | null;
  rejection_reason: string | null;
  screening_date: string | null;
  approved_at: string | null;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentProof = {
  id: string;
  application_id: string;
  user_id: string;
  plan: SubscriptionPlan;
  amount_euros: number;
  payment_method: "bizum" | "bank_transfer";
  payment_date: string;
  proof_image_url: string | null;
  notes: string | null;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
};

export type OrganizerSubscription = {
  id: string;
  user_id: string;
  application_id: string;
  plan: SubscriptionPlan;
  amount_euros: number;
  started_at: string;
  ends_at: string;
  cancelled_at: string | null;
  is_active: boolean;
};

export type DbEvent = {
  id: string;
  organizer_id: string;
  title: string;
  title_es: string | null;
  description: string;
  description_es: string | null;
  highlights: string[] | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  is_recurring: boolean;
  series_id: string | null;
  venue_name: string;
  address: string | null;
  city: "alicante" | "elche" | "other";
  is_free: boolean;
  price_euros: number;
  total_spots: number | null;
  spots_reserved: number;
  category_key: string;
  cover_image_url: string | null;
  status: "draft" | "pending_approval" | "published" | "cancelled" | "completed";
  published_at: string | null;
  meetup_url: string | null;
  created_at: string;
};

// ─── STATUS LABELS ────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<
  ApplicationStatus,
  { en: string; es: string; color: string; bg: string }
> = {
  pending_review:           { en: "Under review",                es: "En revisión",                  color: "#92400e", bg: "#fef3c7" },
  screening_booked:         { en: "Screening call booked",       es: "Llamada agendada",             color: "#1e40af", bg: "#dbeafe" },
  approved_pending_payment: { en: "Approved — awaiting payment", es: "Aprobado — pendiente de pago", color: "#5b21b6", bg: "#ede9fe" },
  payment_submitted:        { en: "Payment under review",        es: "Pago en revisión",             color: "#92400e", bg: "#fef3c7" },
  active:                   { en: "Active",                      es: "Activo",                       color: "#065f46", bg: "#d1fae5" },
  expired:                  { en: "Expired",                     es: "Expirado",                     color: "#374151", bg: "#f3f4f6" },
  cancelled:                { en: "Cancelled",                   es: "Cancelado",                    color: "#374151", bg: "#f3f4f6" },
  rejected:                 { en: "Not approved",                es: "No aprobado",                  color: "#991b1b", bg: "#fee2e2" },
};

// ─── ASYNC HELPERS ────────────────────────────────────────────
// These use a local import to avoid circular reference.
// Always import { supabase } from "@/lib/supabase" in your pages.

import { supabase as _sb } from "@/integrations/supabase/client";

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await _sb.auth.getUser();
  if (!user) return null;
  const { data } = await _sb.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function getMyApplication(): Promise<OrganizerApplication | null> {
  const { data: { user } } = await _sb.auth.getUser();
  if (!user) return null;
  const { data } = await _sb
    .from("organizer_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getMySubscription(): Promise<OrganizerSubscription | null> {
  const { data: { user } } = await _sb.auth.getUser();
  if (!user) return null;
  const { data } = await _sb
    .from("organizer_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}
