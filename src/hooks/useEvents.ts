// src/hooks/useEvents.ts
// Replaces static eventData.ts with real Supabase queries.
// Import these hooks anywhere you previously imported from @/lib/eventData.
//
// Usage:
//   const { events, loading, error } = usePublishedEvents();
//   const { events } = usePublishedEvents({ city: 'alicante', isFree: true });
//   const { event } = useEventById('some-uuid');

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── TYPES ────────────────────────────────────────────────────

export interface DbEvent {
  id: string;
  organizer_id: string;
  title: string;
  title_es: string | null;
  description: string;
  description_es: string | null;
  highlights: string[] | null;
  highlights_es: string[] | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_name: string;
  address: string | null;
  city: string;
  maps_url: string | null;
  is_free: boolean;
  price_euros: number;
  total_spots: number | null;
  spots_reserved: number;
  rsvp_count: number;
  category_key: string;
  category_label: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  external_links: {
    website?: string;
    instagram?: string;
    facebook?: string;
    eventbrite?: string;
    other?: string;
  } | null;
  video_url: string | null;
  language: string;
  tags: string[] | null;
  cancellation_policy: string | null;
  accessibility_notes: string | null;
  is_recurring: boolean;
  series_id: string | null;
  status: string;
  is_featured: boolean;
  views_count: number;
  published_at: string | null;
  meetup_url: string | null;
  created_at: string;
  // Joined from profiles
  organizer?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    instagram_handle: string | null;
    linkedin_url: string | null;
    website: string | null;
    bio: string | null;
    is_verified_organizer: boolean;
  };
}

export interface DbProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  nationality: string | null;
  city: string;
  avatar_url: string | null;
  instagram_handle: string | null;
  linkedin_url: string | null;
  website: string | null;
  languages_spoken: string[] | null;
  looking_for: string[] | null;
  is_verified_organizer: boolean;
  is_community_builder: boolean;
  is_admin: boolean;
  created_at: string;
}

// ─── FILTER INTERFACE ─────────────────────────────────────────

export interface EventFilters {
  city?: string;
  categoryKey?: string;
  isFree?: boolean;
  featuredOnly?: boolean;
  organizerId?: string;
  search?: string;
  limit?: number;
  dateFrom?: string; // ISO date string
}

// ─── usePublishedEvents ───────────────────────────────────────
// Fetches published events with optional filters.
// Used on: homepage, events list page.

export function usePublishedEvents(filters: EventFilters = {}) {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("events")
        .select(`
          *,
          organizer:profiles!organizer_id (
            id, full_name, avatar_url, instagram_handle,
            linkedin_url, website, bio, is_verified_organizer
          )
        `)
        .eq("status", "published")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true });

      if (filters.city && filters.city !== "all")
        query = query.eq("city", filters.city);

      if (filters.categoryKey && filters.categoryKey !== "all")
        query = query.eq("category_key", filters.categoryKey);

      if (filters.isFree !== undefined)
        query = query.eq("is_free", filters.isFree);

      if (filters.featuredOnly)
        query = query.eq("is_featured", true);

      if (filters.organizerId)
        query = query.eq("organizer_id", filters.organizerId);

      if (filters.dateFrom)
        query = query.gte("event_date", filters.dateFrom);

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,venue_name.ilike.%${filters.search}%`
        );
      }

      if (filters.limit)
        query = query.limit(filters.limit);

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setEvents((data as unknown as DbEvent[]) ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { events, loading, error, refetch: fetch };
}

// ─── useEventById ─────────────────────────────────────────────
// Fetches a single event with full details + organizer profile.
// Used on: event detail page.

export function useEventById(id: string | undefined) {
  const [event, setEvent]   = useState<DbEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    async function fetch() {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from("events")
        .select(`
          *,
          organizer:profiles!organizer_id (
            id, full_name, avatar_url, instagram_handle,
            linkedin_url, website, bio, is_verified_organizer
          )
        `)
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (dbError) setError(dbError.message);
      else setEvent(data as unknown as DbEvent);
      setLoading(false);

      // Increment view count silently
      if (data) {
        await supabase.rpc("increment_event_views", { event_id: id });
      }
    }

    fetch();
  }, [id]);

  return { event, loading, error };
}

// ─── useRelatedEvents ─────────────────────────────────────────
// Gets events in the same category, excluding the current event.
// Used on: event detail page "You might also like" section.

export function useRelatedEvents(event: DbEvent | null, limit = 3) {
  const [events, setEvents] = useState<DbEvent[]>([]);

  useEffect(() => {
    if (!event) return;

    supabase
      .from("events")
      .select("*, organizer:profiles!organizer_id(id,full_name,avatar_url,is_verified_organizer)")
      .eq("status", "published")
      .eq("category_key", event.category_key)
      .neq("id", event.id)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(limit)
      .then(({ data }) => setEvents((data as unknown as DbEvent[]) ?? []));
  }, [event?.id, event?.category_key, limit]);

  return { events };
}

// ─── useFeaturedEvents ────────────────────────────────────────
// Gets admin-featured events for the homepage hero/featured strip.

export function useFeaturedEvents(limit = 6) {
  return usePublishedEvents({ featuredOnly: true, limit });
}

// ─── useThisWeekEvents ────────────────────────────────────────
// Gets events happening in the next 7 days.

export function useThisWeekEvents() {
  const today   = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(today.getDate() + 7);

  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*, organizer:profiles!organizer_id(id,full_name,avatar_url)")
      .eq("status", "published")
      .gte("event_date", today.toISOString().split("T")[0])
      .lte("event_date", weekEnd.toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        setEvents((data as unknown as DbEvent[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { events, loading };
}

// ─── useCommunityBuilders ─────────────────────────────────────
// Gets approved community builders for the builders page.

export function useCommunityBuilders() {
  const [builders, setBuilders] = useState<DbProfile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("is_community_builder", true)
      .order("created_at", { ascending: true })
      .then(({ data, error: dbError }) => {
        if (dbError) setError(dbError.message);
        else setBuilders((data as DbProfile[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { builders, loading, error };
}

// ─── usePublicProfile ─────────────────────────────────────────
// Gets a single public profile by ID.

export function usePublicProfile(id: string | undefined) {
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProfile(data as DbProfile);
        setLoading(false);
      });
  }, [id]);

  return { profile, loading };
}

// ─── useOrganizerEvents ───────────────────────────────────────
// Gets all events for a specific organizer (all statuses).
// Used on: organizer dashboard.

export function useOrganizerEvents(organizerId: string | undefined) {
  const [events, setEvents]   = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizerId) { setLoading(false); return; }

    supabase
      .from("events")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("event_date", { ascending: false })
      .then(({ data }) => {
        setEvents((data as unknown as DbEvent[]) ?? []);
        setLoading(false);
      });
  }, [organizerId]);

  const refetch = () => {
    if (!organizerId) return;
    setLoading(true);
    supabase
      .from("events")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("event_date", { ascending: false })
      .then(({ data }) => {
        setEvents((data as unknown as DbEvent[]) ?? []);
        setLoading(false);
      });
  };

  return { events, loading, refetch };
}

// ─── useEventSave ─────────────────────────────────────────────
// Toggle save/bookmark on an event. Returns saved state + toggle fn.

export function useEventSave(eventId: string, userId: string | undefined) {
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("event_saves")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [eventId, userId]);

  async function toggle() {
    if (!userId) return;
    setLoading(true);

    if (saved) {
      await supabase
        .from("event_saves")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);
      setSaved(false);
    } else {
      await supabase
        .from("event_saves")
        .insert({ event_id: eventId, user_id: userId });
      setSaved(true);
    }

    setLoading(false);
  }

  return { saved, loading, toggle };
}
