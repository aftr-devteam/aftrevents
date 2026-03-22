import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/supabase";

// ─── BASE HOOK ────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (mounted) setProfile(data);
      }

      if (mounted) setLoading(false);
    }

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (mounted) setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }

        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}

// ─── GUARDS ───────────────────────────────────────────────────

/** Redirects to /login if not authenticated */
export function useRequireAuth(redirectTo = "/login") {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, profile, loading };
}

/** Redirects to /login if not authenticated, or / if not admin */
export function useRequireAdmin() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (profile && !profile.is_admin) {
      navigate("/", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}

/** Redirects to /login if not authenticated, or /organizer/status if not verified */
export function useRequireOrganizer() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (profile && !profile.is_verified_organizer) {
      navigate("/organizer/status", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
