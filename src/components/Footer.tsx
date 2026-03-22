import { Instagram, Linkedin, Mail } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();

  const activeCls = "text-sand-light";
  const linkCls   = "text-sand/65 text-sm hover:text-sand-light transition-colors";

  return (
    <footer className="bg-warm-dark text-sand-light">
      <div className="max-w-7xl mx-auto section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── BRAND ── */}
          <div>
            <NavLink to="/" className="inline-block mb-4">
              <h3 className="font-heading text-2xl font-bold text-sand-light">
                Aftr<span className="text-primary">.</span>
              </h3>
            </NavLink>
            <p className="text-sand/65 text-sm leading-relaxed mb-5">
              {t(
                "Connecting locals and internationals in Alicante province through real in-person events. Since 2021.",
                "Conectando locales e internacionales en la provincia de Alicante a través de eventos presenciales reales. Desde 2021."
              )}
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/aftrsocialclub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-sand/10 hover:bg-sand/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/aftrevents"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-sand/10 hover:bg-sand/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:afterworkclubinternational@gmail.com"
                aria-label="Email"
                className="p-2 rounded-lg bg-sand/10 hover:bg-sand/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ── EVENTS ── */}
          <div>
            <h4 className="font-body font-semibold text-sand-light mb-4 text-sm uppercase tracking-wider">
              {t("Events", "Eventos")}
            </h4>
            <div className="flex flex-col gap-2.5">
              <NavLink to="/events"     className={linkCls} activeClassName={activeCls}>
                {t("Browse all events", "Ver todos los eventos")}
              </NavLink>
              <NavLink to="/community"  className={linkCls} activeClassName={activeCls}>
                Chat &amp; Mingle
              </NavLink>
              <NavLink to="/community"  className={linkCls} activeClassName={activeCls}>
                Digital Builders
              </NavLink>
              <NavLink to="/community"  className={linkCls} activeClassName={activeCls}>
                Lingo Connect
              </NavLink>
              <NavLink to="/community"  className={linkCls} activeClassName={activeCls}>
                Hub Cultural
              </NavLink>
              <NavLink to="/community"  className={linkCls} activeClassName={activeCls}>
                Unplug &amp; Play
              </NavLink>
              <a
                href="https://www.meetup.com/afterwork-club-international/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                {t("Free Events on Meetup", "Eventos Gratis en Meetup")}
              </a>
            </div>
          </div>

          {/* ── GET INVOLVED ── */}
          <div>
            <h4 className="font-body font-semibold text-sand-light mb-4 text-sm uppercase tracking-wider">
              {t("Get involved", "Involúcrate")}
            </h4>
            <div className="flex flex-col gap-2.5">
              <NavLink to="/community"       className={linkCls} activeClassName={activeCls}>
                {t("Join the community", "Únete a la comunidad")}
              </NavLink>
              <NavLink to="/builders-connectors" className={linkCls} activeClassName={activeCls}>
                {t("Builders & Connectors", "Builders & Connectors")}
              </NavLink>
              <NavLink to="/collaborate"     className={linkCls} activeClassName={activeCls}>
                {t("Become an Aftr Host", "Ser Aftr Host")}
              </NavLink>
              <NavLink to="/collaborate"     className={linkCls} activeClassName={activeCls}>
                {t("Venue partnership", "Partnership de local")}
              </NavLink>
              <NavLink to="/organizer/apply" className={linkCls} activeClassName={activeCls}>
                {t("Verified Organizer", "Organizador Verificado")}
              </NavLink>
              <NavLink to="/about"           className={linkCls} activeClassName={activeCls}>
                {t("About Aftr", "Sobre Aftr")}
              </NavLink>
            </div>
          </div>

          {/* ── NEWSLETTER ── */}
          <div>
            <h4 className="font-body font-semibold text-sand-light mb-4 text-sm uppercase tracking-wider">
              {t("Stay in the loop", "Mantente al día")}
            </h4>
            <p className="text-sand/65 text-sm mb-4 leading-relaxed">
              {t(
                "Weekly event picks for Alicante province. Free, no spam.",
                "Selección semanal de eventos en la provincia. Gratis, sin spam."
              )}
            </p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("Your email", "Tu email")}
                className="flex-1 bg-sand/10 border border-sand/20 rounded-lg px-3 py-2 text-sm text-sand-light placeholder:text-sand/40 focus:outline-none focus:border-primary/50 min-w-0"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.97] flex-shrink-0"
              >
                {t("Join", "Unirse")}
              </button>
            </form>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-sand/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sand/40 text-xs">
            © 2026 Aftr Events &amp; Comunidades · Alicante, Spain 🇪🇸
          </p>
          <div className="flex items-center gap-5">
            <a
              href="mailto:afterworkclubinternational@gmail.com"
              className="text-sand/40 text-xs hover:text-sand-light transition-colors"
            >
              afterworkclubinternational@gmail.com
            </a>
            <NavLink
              to="/login"
              className="text-sand/40 text-xs hover:text-sand-light transition-colors"
              activeClassName="text-sand-light"
            >
              {t("Organizer login", "Acceso organizadores")}
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
