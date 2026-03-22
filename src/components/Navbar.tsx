import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, LogIn, UserCircle, LayoutDashboard, Shield, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// ─── NAV DATA ─────────────────────────────────────────────────

const mainLinks = [
  { en: "Events",      es: "Eventos",    href: "/events" },
  { en: "Collaborate", es: "Colaborar",  href: "/collaborate" },
  { en: "About",       es: "Sobre Aftr", href: "/about" },
];

const communityLinks = [
  { en: "Community",          es: "Comunidad",    href: "/community" },
  
  { en: "Builders & Connectors", es: "Builders & Connectors", href: "/builders-connectors" },
];

// ─── COMPONENT ────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  const { lang, toggle, t } = useLang();
  const { user, profile }   = useAuth();
  const location            = useLocation();
  const navigate            = useNavigate();

  const isHome = location.pathname === "/";

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Transparent ↔ solid on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  // Style helpers
  const solid    = scrolled || !isHome;
  const navBg    = solid
    ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
    : "bg-transparent";
  const textCls  = solid ? "text-foreground"  : "text-white";
  const logoCls  = solid ? "text-primary"     : "text-white";
  const hoverBg  = solid ? "hover:bg-primary/8" : "hover:bg-white/10";
  const activeCls = solid ? "font-semibold text-primary" : "font-semibold text-white";

  // Where to send the logged-in user
  const dashHref = profile?.is_admin
    ? "/admin"
    : profile?.is_verified_organizer
      ? "/organizer/dashboard"
      : "/organizer/status";

  const dashLabel = profile?.is_admin
    ? t("Admin panel", "Panel admin")
    : profile?.is_verified_organizer
      ? t("My dashboard", "Mi dashboard")
      : t("My application", "Mi solicitud");

  const userInitial = profile?.full_name
    ? profile.full_name[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  // Is any community sub-link active?
  const communityActive = communityLinks.some(l => location.pathname === l.href);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16 lg:h-[4.5rem]">

        {/* ── LOGO ── */}
        <NavLink
          to="/"
          className={`font-heading text-xl font-bold tracking-tight transition-colors ${logoCls}`}
        >
          Aftr<span className={solid ? "text-primary" : "opacity-60"}>.</span>
        </NavLink>

        {/* ── DESKTOP NAV ── */}
        <div className="hidden lg:flex items-center gap-0.5">

          {/* Community dropdown */}
          <div className="relative group">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${textCls} ${hoverBg} ${
                communityActive ? activeCls : ""
              }`}
            >
              {t("Community", "Comunidad")}
              <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown panel */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-1">
                {communityLinks.map(link => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground rounded-xl hover:bg-muted transition-colors"
                    activeClassName="bg-primary/8 text-primary font-semibold"
                  >
                    {t(link.en, link.es)}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Main links */}
          {mainLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${textCls} ${hoverBg}`}
              activeClassName={activeCls}
            >
              {t(link.en, link.es)}
            </NavLink>
          ))}

          {/* Meetup external */}
          <a
            href="https://www.meetup.com/afterwork-club-international/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${textCls} ${hoverBg}`}
          >
            {t("Free Events", "Eventos Gratis")}
          </a>
        </div>

        {/* ── DESKTOP RIGHT ── */}
        <div className="hidden lg:flex items-center gap-2">

          {/* Language toggle */}
          <button
            onClick={toggle}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${textCls} ${hoverBg}`}
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "ES" : "EN"}
          </button>

          {user ? (
            /* ── Logged in: avatar + dropdown ── */
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${hoverBg} ${textCls}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {userInitial}
                </div>
                <span className="max-w-[100px] truncate">
                  {profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {profile?.is_verified_organizer && (
                      <p className="text-xs font-semibold text-primary mt-0.5">
                        {t("Verified Organizer", "Organizador Verificado")} ✓
                      </p>
                    )}
                    {profile?.is_admin && (
                      <p className="text-xs font-semibold text-primary mt-0.5">Admin ✓</p>
                    )}
                  </div>
                  <div className="p-1">
                    <NavLink
                      to={dashHref}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground rounded-xl hover:bg-muted transition-colors"
                    >
                      {profile?.is_admin
                        ? <Shield className="w-4 h-4 text-primary" />
                        : <LayoutDashboard className="w-4 h-4 text-primary" />
                      }
                      {dashLabel}
                    </NavLink>
                    {!profile?.is_verified_organizer && !profile?.is_admin && (
                      <NavLink
                        to="/organizer/apply"
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground rounded-xl hover:bg-muted transition-colors"
                      >
                        <UserCircle className="w-4 h-4 text-muted-foreground" />
                        {t("Become an organizer", "Ser organizador")}
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive rounded-xl hover:bg-muted transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("Log out", "Cerrar sesión")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged out ── */
            <>
              <NavLink to="/login">
                <button className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${textCls} ${hoverBg}`}>
                  <LogIn className="w-4 h-4" />
                  {t("Log in", "Entrar")}
                </button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="hero" size="sm">
                  {t("Join Aftr", "Unirse a Aftr")}
                </Button>
              </NavLink>
            </>
          )}
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${textCls} ${hoverBg}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="max-w-7xl mx-auto section-padding py-4 flex flex-col gap-1">

            {/* Community links with label */}
            <p className="px-4 pt-1 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("Community", "Comunidad")}
            </p>
            {communityLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                activeClassName="bg-muted font-semibold text-primary"
              >
                {t(link.en, link.es)}
              </NavLink>
            ))}

            <div className="border-t border-border my-1" />

            {/* Main links */}
            {mainLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                activeClassName="bg-muted font-semibold text-primary"
              >
                {t(link.en, link.es)}
              </NavLink>
            ))}

            <a
              href="https://www.meetup.com/afterwork-club-international/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
            >
              {t("Free Events (Meetup)", "Eventos Gratis (Meetup)")}
            </a>

            <div className="border-t border-border my-1" />

            {/* Auth */}
            {user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs text-muted-foreground">{t("Signed in as", "Conectado como")}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                </div>
                <NavLink
                  to={dashHref}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                >
                  {profile?.is_admin
                    ? <Shield className="w-4 h-4 text-primary" />
                    : <LayoutDashboard className="w-4 h-4 text-primary" />
                  }
                  {dashLabel}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-destructive font-medium hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t("Log out", "Cerrar sesión")}
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                >
                  <LogIn className="w-4 h-4 text-primary" />
                  {t("Log in", "Entrar")}
                </NavLink>
                <div className="px-4 mt-1">
                  <NavLink to="/register">
                    <Button variant="hero" className="w-full">
                      {t("Join Aftr", "Unirse a Aftr")}
                    </Button>
                  </NavLink>
                </div>
              </>
            )}

            {/* Language */}
            <div className="flex items-center gap-2 mt-2 px-4">
              <button
                onClick={toggle}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                {lang === "en" ? "Switch to Español" : "Cambiar a English"}
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
