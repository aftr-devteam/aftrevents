// src/components/HeroCarousel.tsx
// Extracted so Index.tsx stays clean.
// Replace hero-1.jpg, hero-2.jpg, hero-3.jpg with real Aftr event photos.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroImages = [hero1, hero2, hero3];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroImages.length), 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {heroImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={img} alt="Aftr Events Alicante" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center section-padding max-w-4xl mx-auto">
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em] mb-4 animate-reveal-up"
          style={{ color: "hsl(var(--sand) / 0.9)" }}
        >
          Alicante & Elche · Since 2021
        </p>
        <h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1"
          style={{ color: "hsl(var(--sand-light))" }}
        >
          {t(
            "Where Alicante's locals and internationals actually meet",
            "Donde locales e internacionales de Alicante se encuentran de verdad"
          )}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mb-10 animate-reveal-up stagger-2"
          style={{ color: "hsl(var(--sand) / 0.8)" }}
        >
          {t(
            "Weekly events in Alicante and Elche. Come for the event. Stay for the community.",
            "Eventos semanales en Alicante y Elche. Ven por el evento. Quédate por la comunidad."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-reveal-up stagger-3">
          <Link to="/events">
            <Button variant="hero" size="lg">
              {t("See this week's events", "Ver eventos de esta semana")}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="hero-outline" size="lg">
              {t("Join free — open to everyone", "Únete gratis — abierto a todos")}
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-12 animate-reveal-up stagger-4">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "2rem" : "0.625rem",
                background: i === current ? "hsl(var(--sand-light))" : "hsl(var(--sand) / 0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
