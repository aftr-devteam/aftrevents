import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, categories, categoriesEs } from "@/lib/eventData";

function EventsListing() {
  const { t, lang } = useLang();
  const { ref, isVisible } = useScrollReveal(0.05);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchCat = activeCategory === "All" || e.category === activeCategory;
      const title = lang === "en" ? e.title : e.titleEs;
      const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, lang]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">{t("Discover", "Descubre")}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              {t("Paid Events in Alicante", "Eventos de Pago en Alicante")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                "Curated, high-quality experiences. Every event is hand-picked for quality and exclusivity.",
                "Experiencias curadas y de alta calidad. Cada evento es seleccionado a mano."
              )}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("Search events or locations…", "Buscar eventos o lugares…")}
                className="w-full bg-popover border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {lang === "en" ? cat : (categoriesEs[cat] || cat)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isVisible ? "" : "opacity-0"}`}>
            {filtered.map((event, i) => (
              <div key={event.id} className={isVisible ? `animate-reveal-up stagger-${Math.min(i + 1, 6)}` : ""}>
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">{t("No events found matching your criteria.", "No se encontraron eventos con tus criterios.")}</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
                {t("Clear Filters", "Limpiar Filtros")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Events() {
  return <EventsListing />;
}
