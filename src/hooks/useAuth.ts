import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
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

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}

// Redirect-aware hook for protected pages
export function useRequireAuth(redirectTo = "/login") {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo]);

  return { user, profile, loading };
}

// Admin-only guard
export function useRequireAdmin() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login", { replace: true });
      else if (profile && !profile.is_admin) navigate("/", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}

// Organizer-only guard — used on pages only Builders should access
// Non-organizers go to /dashboard (which explains the Builder role)
// NOT /organizer/status — that caused a redirect loop
export function useRequireOrganizer() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login", { replace: true });
      else if (profile && !profile.is_verified_organizer) navigate("/dashboard", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
