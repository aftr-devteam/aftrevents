import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Upload, X, Eye,
  Calendar, MapPin, Clock, Users, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useRequireOrganizer } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AftrLogo from "@/components/AftrLogo";
// STRIPE: import { STRIPE_ENABLED } from "@/lib/config";
// When STRIPE_ENABLED = true, add online payment option to the form.

const inputCls  = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
const labelCls  = "block text-sm font-semibold text-foreground mb-2";

const CATEGORIES = [
  { key: "chat",    labelEn: "Chat & Mingle",     labelEs: "Chat & Mingle" },
  { key: "digital", labelEn: "Digital Builders",  labelEs: "Digital Builders" },
  { key: "lingo",   labelEn: "Lingo Connect",     labelEs: "Lingo Connect" },
  { key: "hub",     labelEn: "Hub Cultural",      labelEs: "Hub Cultural" },
  { key: "unplug",  labelEn: "Unplug & Play",     labelEs: "Unplug & Play" },
  { key: "other",   labelEn: "Other",             labelEs: "Otro" },
];

const CITIES = ["Alicante", "Elche", "Benidorm", "Torrevieja", "Other"];

const LANGUAGES = [
  { key: "bilingual", labelEn: "Bilingual (EN + ES)", labelEs: "Bilingüe (EN + ES)" },
  { key: "en",        labelEn: "English only",        labelEs: "Solo inglés" },
  { key: "es",        labelEn: "Spanish only",        labelEs: "Solo español" },
];

const PAYMENT_METHODS = [
  { key: "bizum", labelEn: "Bizum at door",        labelEs: "Bizum en la puerta" },
  { key: "cash",  labelEn: "Cash at door",          labelEs: "Efectivo en la puerta" },
  // STRIPE: uncomment when STRIPE_ENABLED = true
  // { key: "stripe", labelEn: "Online payment (Stripe)", labelEs: "Pago online (Stripe)" },
];

const STEPS = [
  { en: "Event details",  es: "Detalles del evento" },
  { en: "Location & time", es: "Lugar y hora" },
  { en: "Media & links",  es: "Medios y enlaces" },
  { en: "Review",         es: "Revisar" },
];

interface EventForm {
  title:        string;
  titleEs:      string;
  description:  string;
  descriptionEs:string;
  highlights:   string[];
  categoryKey:  string;
  tags:         string;
  language:     string;
  isRecurring:  boolean;
  // Location
  eventDate:    string;
  startTime:    string;
  endTime:      string;
  venueName:    string;
  address:      string;
  city:         string;
  mapsUrl:      string;
  // Capacity & price
  isFree:       boolean;
  priceEuros:   string;
  paymentMethod:string;
  totalSpots:   string;
  // Media
  coverFile:    File | null;
  coverPreview: string;
  galleryFiles: File[];
  galleryPreviews: string[];
  videoUrl:     string;
  // Links
  websiteUrl:   string;
  instagramUrl: string;
  facebookUrl:  string;
  // Policies
  cancellationPolicy:  string;
  accessibilityNotes:  string;
  adminNotes:          string;
}

const EMPTY: EventForm = {
  title: "", titleEs: "", description: "", descriptionEs: "",
  highlights: ["", "", "", ""],
  categoryKey: "chat", tags: "", language: "bilingual", isRecurring: false,
  eventDate: "", startTime: "", endTime: "",
  venueName: "", address: "", city: "Alicante", mapsUrl: "",
  isFree: true, priceEuros: "", paymentMethod: "bizum", totalSpots: "",
  coverFile: null, coverPreview: "", galleryFiles: [], galleryPreviews: [],
  videoUrl: "",
  websiteUrl: "", instagramUrl: "", facebookUrl: "",
  cancellationPolicy: "", accessibilityNotes: "", adminNotes: "",
};

// ─── LIVE PREVIEW CARD ────────────────────────────────────────

function PreviewCard({ form }: { form: EventForm }) {
  const { t } = useLang();
  const cat = CATEGORIES.find(c => c.key === form.categoryKey);
  const catColors: Record<string, string> = {
    chat: "#b85c24", digital: "#3f779d", lingo: "#4b664a",
    hub: "#9b5d9e", unplug: "#2d8c6b", other: "#888",
  };
  const color = catColors[form.categoryKey] ?? "#888";

  return (
    <div className="bg-popover rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="h-1.5" style={{ background: color }} />
      <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
        {form.coverPreview ? (
          <img src={form.coverPreview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <Eye className="w-8 h-8" />
            <span className="text-xs">{t("Cover image", "Imagen portada")}</span>
          </div>
        )}
        {form.eventDate && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800">
            {new Date(form.eventDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          </div>
        )}
        <div className={`absolute top-3 right-3 rounded-lg px-3 py-1.5 ${form.isFree ? "bg-olive" : "bg-primary"}`}>
          <span className="text-xs font-bold text-white">
            {form.isFree ? t("Free", "Gratis") : `€${form.priceEuros || "0"}`}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>
          {cat?.labelEn ?? "Category"}
        </p>
        <h3 className="font-heading text-base font-bold text-foreground leading-snug mb-1.5 line-clamp-2">
          {form.title || t("Event title", "Título del evento")}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {form.description || t("Your description here…", "Tu descripción aquí…")}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{form.venueName || t("Venue", "Local")} · {form.city}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────

export default function NewEvent() {
  const { t, lang } = useLang();
  const navigate     = useNavigate();
  const { user }     = useRequireOrganizer();

  const [step,       setStep]       = useState(0);
  const [form,       setForm]       = useState<EventForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const coverRef   = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function set(key: keyof EventForm, val: any) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function setHighlight(i: number, val: string) {
    const arr = [...form.highlights];
    arr[i] = val;
    set("highlights", arr);
  }

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    set("coverFile", file);
    set("coverPreview", URL.createObjectURL(file));
  }

  function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6 - form.galleryFiles.length);
    const previews = files.map(f => URL.createObjectURL(f));
    set("galleryFiles",    [...form.galleryFiles,    ...files]);
    set("galleryPreviews", [...form.galleryPreviews, ...previews]);
  }

  function removeGallery(i: number) {
    set("galleryFiles",    form.galleryFiles.filter((_,    idx) => idx !== i));
    set("galleryPreviews", form.galleryPreviews.filter((_, idx) => idx !== i));
  }

  function validate(): string {
    if (step === 0) {
      if (!form.title.trim())       return t("Event title is required.", "El título del evento es obligatorio.");
      if (!form.description.trim()) return t("Description is required.", "La descripción es obligatoria.");
    }
    if (step === 1) {
      if (!form.eventDate)          return t("Event date is required.", "La fecha es obligatoria.");
      if (!form.startTime)          return t("Start time is required.", "La hora de inicio es obligatoria.");
      if (!form.venueName.trim())   return t("Venue name is required.", "El nombre del local es obligatorio.");
    }
    return "";
  }

  async function uploadImage(file: File, path: string): Promise<string | null> {
    const { error } = await supabase.storage.from("event-covers").upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("event-covers").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(status: "draft" | "pending_approval") {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);

    const eventId = crypto.randomUUID();

    // Upload cover image
    let coverUrl: string | null = null;
    if (form.coverFile) {
      coverUrl = await uploadImage(
        form.coverFile,
        `${user!.id}/${eventId}/cover.${form.coverFile.name.split(".").pop()}`
      );
    }

    // Upload gallery images
    const galleryUrls: string[] = [];
    for (let i = 0; i < form.galleryFiles.length; i++) {
      const file = form.galleryFiles[i];
      const url  = await uploadImage(
        file,
        `${user!.id}/${eventId}/gallery-${i}.${file.name.split(".").pop()}`
      );
      if (url) galleryUrls.push(url);
    }

    const externalLinks: Record<string, string> = {};
    if (form.websiteUrl)   externalLinks.website   = form.websiteUrl;
    if (form.instagramUrl) externalLinks.instagram  = form.instagramUrl;
    if (form.facebookUrl)  externalLinks.facebook   = form.facebookUrl;

    const { error: dbErr } = await supabase.from("events").insert({
      id:              eventId,
      organizer_id:    user!.id,
      title:           form.title.trim(),
      title_es:        form.titleEs.trim() || null,
      description:     form.description.trim(),
      description_es:  form.descriptionEs.trim() || null,
      highlights:      form.highlights.filter(Boolean),
      category_key:    form.categoryKey,
      category_label:  CATEGORIES.find(c => c.key === form.categoryKey)?.labelEn ?? null,
      tags:            form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      language:        form.language,
      is_recurring:    form.isRecurring,
      event_date:      form.eventDate,
      start_time:      form.startTime,
      end_time:        form.endTime || null,
      venue_name:      form.venueName.trim(),
      address:         form.address.trim() || null,
      city:            form.city.toLowerCase(),
      maps_url:        form.mapsUrl || null,
      is_free:         form.isFree,
      price_euros:     form.isFree ? 0 : parseFloat(form.priceEuros) || 0,
      total_spots:     form.totalSpots ? parseInt(form.totalSpots) : null,
      spots_reserved:  0,
      cover_image_url: coverUrl,
      gallery_urls:    galleryUrls.length > 0 ? galleryUrls : [],
      external_links:  Object.keys(externalLinks).length > 0 ? externalLinks : {},
      video_url:       form.videoUrl || null,
      cancellation_policy: form.cancellationPolicy || null,
      accessibility_notes: form.accessibilityNotes || null,
      status,
      views_count:     0,
      rsvp_count:      0,
    });

    setSubmitting(false);

    if (dbErr) {
      setError(t("Failed to save event. Please try again.", "Error al guardar el evento. Inténtalo de nuevo."));
      return;
    }

    navigate("/organizer/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <div className="sticky top-0 z-10 border-b border-border bg-popover">
        <div className="max-w-6xl mx-auto section-padding h-16 flex items-center justify-between">
          <Link to="/organizer/dashboard"><AftrLogo className="h-6 w-auto text-foreground" /></Link>
          <span className="text-sm text-muted-foreground">{t("Create event", "Crear evento")}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto section-padding py-8">
        {/* Step tabs */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { if (i < step) setStep(i); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                i === step ? "bg-primary text-primary-foreground" :
                i < step   ? "bg-muted text-foreground cursor-pointer hover:bg-muted/80" :
                "bg-muted/40 text-muted-foreground cursor-default"
              }`}
            >
              {i < step ? "✓ " : `${i + 1}. `}
              {lang === "en" ? s.en : s.es}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-popover border border-border rounded-2xl p-8">

              {/* ── STEP 0: Event details ── */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">{t("Event details", "Detalles del evento")}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t("Title (English)", "Título (inglés)")} <span className="text-primary">*</span></label>
                      <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                        placeholder="Chat & Mingle — Thursday Edition" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("Title (Spanish)", "Título (español)")}</label>
                      <input type="text" value={form.titleEs} onChange={e => set("titleEs", e.target.value)}
                        placeholder="Chat & Mingle — Edición del Jueves" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{t("Description (English)", "Descripción (inglés)")} <span className="text-primary">*</span></label>
                    <textarea value={form.description} onChange={e => set("description", e.target.value)}
                      rows={5} placeholder={t("Describe your event…", "Describe tu evento…")} className={`${inputCls} resize-none`} />
                    <p className="text-xs text-muted-foreground mt-1">{form.description.length} characters</p>
                  </div>

                  <div>
                    <label className={labelCls}>{t("Description (Spanish)", "Descripción (español)")}</label>
                    <textarea value={form.descriptionEs} onChange={e => set("descriptionEs", e.target.value)}
                      rows={4} className={`${inputCls} resize-none`} />
                  </div>

                  <div>
                    <label className={labelCls}>{t("What to expect (highlights)", "Qué esperar (puntos clave)")}</label>
                    <div className="space-y-2">
                      {form.highlights.map((h, i) => (
                        <input key={i} type="text" value={h} onChange={e => setHighlight(i, e.target.value)}
                          placeholder={`${t("e.g.", "ej.")} 🌍 ${t("Mix of 30+ nationalities", "Mezcla de +30 nacionalidades")}`}
                          className={inputCls} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t("Category", "Categoría")}</label>
                      <select value={form.categoryKey} onChange={e => set("categoryKey", e.target.value)} className={inputCls}>
                        {CATEGORIES.map(c => <option key={c.key} value={c.key}>{lang === "en" ? c.labelEn : c.labelEs}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("Language", "Idioma del evento")}</label>
                      <select value={form.language} onChange={e => set("language", e.target.value)} className={inputCls}>
                        {LANGUAGES.map(l => <option key={l.key} value={l.key}>{lang === "en" ? l.labelEn : l.labelEs}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{t("Tags (comma-separated)", "Tags (separados por coma)")}</label>
                    <input type="text" value={form.tags} onChange={e => set("tags", e.target.value)}
                      placeholder={t("e.g. beginner friendly, networking, outdoors", "ej. principiantes, networking, exterior")}
                      className={inputCls} />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isRecurring} onChange={e => set("isRecurring", e.target.checked)} className="w-4 h-4 rounded text-primary" />
                    <span className="text-sm font-medium text-foreground">{t("This is a recurring event", "Este es un evento recurrente")}</span>
                  </label>
                </div>
              )}

              {/* ── STEP 1: Location & time ── */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">{t("Location & time", "Lugar y hora")}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>{t("Date", "Fecha")} <span className="text-primary">*</span></label>
                      <input type="date" value={form.eventDate} onChange={e => set("eventDate", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("Start time", "Hora inicio")} <span className="text-primary">*</span></label>
                      <input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("End time", "Hora fin")}</label>
                      <input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t("Venue name", "Nombre del local")} <span className="text-primary">*</span></label>
                      <input type="text" value={form.venueName} onChange={e => set("venueName", e.target.value)}
                        placeholder="Gustav Klimt" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("City", "Ciudad")}</label>
                      <select value={form.city} onChange={e => set("city", e.target.value)} className={inputCls}>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{t("Address", "Dirección")}</label>
                    <input type="text" value={form.address} onChange={e => set("address", e.target.value)}
                      placeholder="Calle Mayor 1, Alicante" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>{t("Google Maps link", "Enlace a Google Maps")}</label>
                    <input type="url" value={form.mapsUrl} onChange={e => set("mapsUrl", e.target.value)}
                      placeholder="https://maps.google.com/?q=..." className={inputCls} />
                  </div>

                  <div className="border-t border-border pt-5 space-y-4">
                    <h3 className="font-semibold text-foreground">{t("Capacity & pricing", "Aforo y precio")}</h3>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.isFree} onChange={e => set("isFree", e.target.checked)} className="w-4 h-4 rounded text-primary" />
                      <span className="text-sm font-medium text-foreground">{t("This is a free event", "Este evento es gratuito")}</span>
                    </label>

                    {!form.isFree && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t("Price (€)", "Precio (€)")} <span className="text-primary">*</span></label>
                          <input type="number" min="0" step="0.5" value={form.priceEuros} onChange={e => set("priceEuros", e.target.value)}
                            placeholder="10" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>{t("Payment method", "Método de pago")}</label>
                          <select value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)} className={inputCls}>
                            {PAYMENT_METHODS.map(m => (
                              <option key={m.key} value={m.key}>{lang === "en" ? m.labelEn : m.labelEs}</option>
                            ))}
                          </select>
                          {/* STRIPE: When STRIPE_ENABLED = true, the 'stripe' option will appear above */}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className={labelCls}>{t("Max capacity (leave empty for unlimited)", "Aforo máximo (dejar vacío para ilimitado)")}</label>
                      <input type="number" min="1" value={form.totalSpots} onChange={e => set("totalSpots", e.target.value)}
                        placeholder="50" className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Media & links ── */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">{t("Media & links", "Medios y enlaces")}</h2>

                  {/* Cover image */}
                  <div>
                    <label className={labelCls}>{t("Cover image", "Imagen de portada")}</label>
                    {form.coverPreview ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-[2/1] mb-2">
                        <img src={form.coverPreview} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => { set("coverFile", null); set("coverPreview", ""); }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-3 w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 py-10 cursor-pointer hover:border-primary/40 hover:bg-muted/50 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground">{t("Upload cover image", "Subir imagen de portada")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("JPG or PNG, max 5MB. Recommended: 1200×630px", "JPG o PNG, máx 5MB. Recomendado: 1200×630px")}</p>
                        </div>
                        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
                      </label>
                    )}
                  </div>

                  {/* Gallery */}
                  <div>
                    <label className={labelCls}>{t("Photo gallery (up to 6)", "Galería de fotos (hasta 6)")}</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {form.galleryPreviews.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => removeGallery(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {form.galleryPreviews.length < 6 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/30">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <label className={labelCls}>{t("Video link (YouTube / Instagram Reel)", "Enlace de vídeo (YouTube / Instagram Reel)")}</label>
                    <input type="url" value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                  </div>

                  {/* External links */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-foreground">{t("External links", "Enlaces externos")}</h3>
                    {[
                      { label: "Website", key: "websiteUrl",   placeholder: "https://yoursite.com" },
                      { label: "Instagram", key: "instagramUrl", placeholder: "https://instagram.com/yourevent" },
                      { label: "Facebook", key: "facebookUrl",  placeholder: "https://facebook.com/events/..." },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">{f.label}</label>
                        <input type="url" value={(form as any)[f.key]} onChange={e => set(f.key as any, e.target.value)}
                          placeholder={f.placeholder} className={inputCls} />
                      </div>
                    ))}
                  </div>

                  {/* Policies */}
                  <div className="space-y-4 pt-2 border-t border-border">
                    <h3 className="font-semibold text-sm text-foreground">{t("Policies & notes", "Políticas y notas")}</h3>
                    <div>
                      <label className={labelCls}>{t("Cancellation policy", "Política de cancelación")}</label>
                      <input type="text" value={form.cancellationPolicy} onChange={e => set("cancellationPolicy", e.target.value)}
                        placeholder={t("e.g. No refunds for paid events", "ej. Sin reembolsos para eventos de pago")} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("Accessibility notes", "Notas de accesibilidad")}</label>
                      <input type="text" value={form.accessibilityNotes} onChange={e => set("accessibilityNotes", e.target.value)}
                        placeholder={t("e.g. Wheelchair accessible, outdoor event", "ej. Acceso en silla de ruedas, evento al aire libre")} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("Notes for Aftr admin", "Notas para el admin de Aftr")}</label>
                      <textarea value={form.adminNotes} onChange={e => set("adminNotes", e.target.value)}
                        rows={3} placeholder={t("Anything the Aftr team should know about this event", "Algo que el equipo Aftr debería saber sobre este evento")}
                        className={`${inputCls} resize-none`} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Review ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-bold text-foreground">{t("Review & submit", "Revisar y enviar")}</h2>

                  <div className="bg-muted/50 rounded-xl p-5 space-y-3 text-sm">
                    {[
                      { label: t("Title", "Título"),         value: form.title },
                      { label: t("Category", "Categoría"),   value: CATEGORIES.find(c => c.key === form.categoryKey)?.labelEn },
                      { label: t("Date", "Fecha"),            value: form.eventDate },
                      { label: t("Time", "Hora"),             value: `${form.startTime}${form.endTime ? ` – ${form.endTime}` : ""}` },
                      { label: t("Venue", "Local"),           value: `${form.venueName}, ${form.city}` },
                      { label: t("Price", "Precio"),          value: form.isFree ? t("Free", "Gratis") : `€${form.priceEuros}` },
                      { label: t("Language", "Idioma"),       value: LANGUAGES.find(l => l.key === form.language)?.labelEn },
                      { label: t("Cover image", "Portada"),   value: form.coverPreview ? t("Uploaded ✓", "Subida ✓") : t("Not added", "No añadida") },
                    ].map(item => item.value && (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground text-right max-w-xs truncate">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      📋 {t("Admin review required", "Revisión del admin requerida")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "Your event will be reviewed by the Aftr team before going live. This usually takes 24–48 hours. You'll be notified when it's approved.",
                        "Tu evento será revisado por el equipo Aftr antes de publicarse. Normalmente tarda 24–48 horas. Se te notificará cuando sea aprobado."
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={() => handleSubmit("draft")}
                      disabled={submitting}
                      variant="outline"
                      className="flex-1"
                    >
                      {t("Save as draft", "Guardar como borrador")}
                    </Button>
                    <Button
                      onClick={() => handleSubmit("pending_approval")}
                      disabled={submitting}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {submitting
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t("Submitting…", "Enviando…")}</>
                        : t("Submit for approval", "Enviar para aprobación")
                      }
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Navigation */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  {step > 0
                    ? <Button variant="outline" onClick={() => { setStep(s => s - 1); setError(""); }}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> {t("Back", "Atrás")}
                      </Button>
                    : <div />
                  }
                  <Button onClick={() => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("Continue", "Continuar")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: live preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t("Live preview", "Vista previa en vivo")}
              </p>
              <PreviewCard form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
