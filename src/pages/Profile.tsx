import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { useRequireAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── HELPERS ──────────────────────────────────────────────────

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}{required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

// ─── PAGE ─────────────────────────────────────────────────────

export default function Profile() {
  const { t } = useLang();
  const { user, profile, loading: authLoading } = useRequireAuth();

  const [form, setForm] = useState({
    fullName:    "",
    phone:       "",
    bio:         "",
    nationality: "",
    city:        "Alicante",
    instagram:   "",
    linkedin:    "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-fill from existing profile
  useEffect(() => {
    if (profile) {
      setForm({
        fullName:    profile.full_name    ?? "",
        phone:       profile.phone        ?? "",
        bio:         profile.bio          ?? "",
        nationality: profile.nationality  ?? "",
        city:        profile.city         ?? "Alicante",
        instagram:   profile.instagram_handle ?? "",
        linkedin:    profile.linkedin_url ?? "",
      });
      setAvatarUrl(profile.avatar_url ?? null);
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Avatar upload ──
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (upErr) { setUploading(false); setError(t("Failed to upload photo.", "Error al subir foto.")); return; }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    setAvatarUrl(url);
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setUploading(false);
  }

  // ── Save profile ──
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.fullName.trim()) { setError(t("Full name is required.", "El nombre completo es obligatorio.")); return; }
    setError("");
    setSaving(true);

    const { error: dbErr } = await supabase.from("profiles").update({
      full_name:        form.fullName.trim(),
      phone:            form.phone.trim()       || null,
      bio:              form.bio.trim()          || null,
      nationality:      form.nationality.trim()  || null,
      city:             form.city.trim()         || "Alicante",
      instagram_handle: form.instagram.trim()    || null,
      linkedin_url:     form.linkedin.trim()     || null,
      updated_at:       new Date().toISOString(),
    }).eq("id", user.id);

    setSaving(false);
    if (dbErr) { setError(t("Failed to save. Please try again.", "Error al guardar. Inténtalo de nuevo.")); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = form.fullName
    ? form.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto section-padding pt-24 pb-20">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">
            {t("Account", "Cuenta")}
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t("Your profile", "Tu perfil")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t(
              "This is how other Aftr members see you.",
              "Así es como otros miembros de Aftr te ven."
            )}
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
            {user?.email}
          </span>
          {profile?.is_verified_organizer && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
              ✓ {t("Verified Organizer", "Organizador Verificado")}
            </span>
          )}
          {profile?.is_admin && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
              ✓ Admin
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={form.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-2xl font-bold text-primary">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
              >
                {uploading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Camera className="w-3.5 h-3.5" />
                }
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                {t("Profile photo", "Foto de perfil")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("JPG or PNG. Shown on your events and the Builders page.", "JPG o PNG. Se muestra en tus eventos y en la página Builders.")}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label={t("Full name", "Nombre completo")} required>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder="Joana Faye Beriso"
                className={inputCls}
              />
            </Field>
            <Field label={t("Phone", "Teléfono")}>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+34 600 000 000"
                className={inputCls}
              />
            </Field>
            <Field label={t("Nationality", "Nacionalidad")}>
              <input
                type="text"
                value={form.nationality}
                onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                placeholder={t("e.g. Spanish, British, Colombian…", "ej. Español, Británico, Colombiano…")}
                className={inputCls}
              />
            </Field>
            <Field label={t("City", "Ciudad")}>
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className={inputCls}
              >
                <option value="Alicante">Alicante</option>
                <option value="Elche">Elche</option>
                <option value="Benidorm">Benidorm</option>
                <option value="Other">{t("Other", "Otra")}</option>
              </select>
            </Field>
          </div>

          {/* Bio */}
          <Field
            label={t("Bio", "Bio")}
            hint={t(
              "Tell the community who you are and what you're about. Max 300 characters.",
              "Cuéntale a la comunidad quién eres. Máximo 300 caracteres."
            )}
          >
            <div className="relative">
              <textarea
                value={form.bio}
                onChange={e => e.target.value.length <= 300 && setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder={t(
                  "I'm a freelance designer based in Alicante, passionate about connecting people…",
                  "Soy diseñador freelance en Alicante, apasionado por conectar personas…"
                )}
                rows={4}
                className={`${inputCls} resize-none`}
              />
              <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {form.bio.length}/300
              </span>
            </div>
          </Field>

          <div className="border-t border-border" />

          {/* Socials */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">
              {t("Social links", "Redes sociales")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Instagram">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={e => setForm(f => ({ ...f, instagram: e.target.value.replace("@", "") }))}
                    placeholder="yourhandle"
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </Field>
              <Field label="LinkedIn">
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Save button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {profile?.is_verified_organizer && (
                <Link to="/organizer/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1">
                  {t("Go to organizer dashboard", "Ir al dashboard de organizador")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {!profile?.is_verified_organizer && (
                <Link to="/organizer/apply" className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 transition-colors">
                  {t("Want to organise events? Apply →", "¿Quieres organizar eventos? Solicitar →")}
                </Link>
              )}
            </div>
            <Button
              type="submit"
              disabled={saving || saved}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t("Saving…", "Guardando…")}</>
              ) : saved ? (
                <><Check className="w-4 h-4 mr-2" />{t("Saved!", "¡Guardado!")}</>
              ) : (
                t("Save profile", "Guardar perfil")
              )}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
