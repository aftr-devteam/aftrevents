export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          approved_by: string | null
          category_key: Database["public"]["Enums"]["event_category"] | null
          category_label: string | null
          city: Database["public"]["Enums"]["event_city"] | null
          cover_image_url: string | null
          created_at: string | null
          description: string
          description_es: string | null
          end_time: string | null
          event_date: string
          gallery_urls: string[] | null
          highlights: string[] | null
          highlights_es: string[] | null
          id: string
          is_free: boolean | null
          is_recurring: boolean | null
          maps_url: string | null
          meetup_posted: boolean | null
          meetup_url: string | null
          organizer_id: string | null
          post_to_meetup: boolean | null
          price_euros: number | null
          published_at: string | null
          rejection_reason: string | null
          series_id: string | null
          spots_reserved: number | null
          start_time: string
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          title_es: string | null
          total_spots: number | null
          updated_at: string | null
          venue_name: string
        }
        Insert: {
          address?: string | null
          approved_by?: string | null
          category_key?: Database["public"]["Enums"]["event_category"] | null
          category_label?: string | null
          city?: Database["public"]["Enums"]["event_city"] | null
          cover_image_url?: string | null
          created_at?: string | null
          description: string
          description_es?: string | null
          end_time?: string | null
          event_date: string
          gallery_urls?: string[] | null
          highlights?: string[] | null
          highlights_es?: string[] | null
          id?: string
          is_free?: boolean | null
          is_recurring?: boolean | null
          maps_url?: string | null
          meetup_posted?: boolean | null
          meetup_url?: string | null
          organizer_id?: string | null
          post_to_meetup?: boolean | null
          price_euros?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          series_id?: string | null
          spots_reserved?: number | null
          start_time: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          title_es?: string | null
          total_spots?: number | null
          updated_at?: string | null
          venue_name: string
        }
        Update: {
          address?: string | null
          approved_by?: string | null
          category_key?: Database["public"]["Enums"]["event_category"] | null
          category_label?: string | null
          city?: Database["public"]["Enums"]["event_city"] | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string
          description_es?: string | null
          end_time?: string | null
          event_date?: string
          gallery_urls?: string[] | null
          highlights?: string[] | null
          highlights_es?: string[] | null
          id?: string
          is_free?: boolean | null
          is_recurring?: boolean | null
          maps_url?: string | null
          meetup_posted?: boolean | null
          meetup_url?: string | null
          organizer_id?: string | null
          post_to_meetup?: boolean | null
          price_euros?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          series_id?: string | null
          spots_reserved?: number | null
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          title_es?: string | null
          total_spots?: number | null
          updated_at?: string | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_attendees: {
        Row: {
          application_id: string | null
          attended: boolean | null
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          attended?: boolean | null
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          attended?: boolean | null
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_attendees_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_attendees_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "organizer_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          max_attendees: number | null
          notes: string | null
          session_date: string
          title: string
          zoom_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          max_attendees?: number | null
          notes?: string | null
          session_date: string
          title?: string
          zoom_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          max_attendees?: number | null
          notes?: string | null
          session_date?: string
          title?: string
          zoom_url?: string | null
        }
        Relationships: []
      }
      organizer_applications: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          bio: string
          created_at: string | null
          email: string
          event_types: string[]
          experience: string
          full_name: string
          id: string
          instagram_handle: string | null
          linkedin_url: string | null
          payment_reference: string | null
          phone: string
          preferred_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          rejection_reason: string | null
          screened_by: string | null
          screening_date: string | null
          screening_notes: string | null
          social_proof: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          why_aftr: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bio: string
          created_at?: string | null
          email: string
          event_types: string[]
          experience: string
          full_name: string
          id?: string
          instagram_handle?: string | null
          linkedin_url?: string | null
          payment_reference?: string | null
          phone: string
          preferred_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          rejection_reason?: string | null
          screened_by?: string | null
          screening_date?: string | null
          screening_notes?: string | null
          social_proof?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          why_aftr: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bio?: string
          created_at?: string | null
          email?: string
          event_types?: string[]
          experience?: string
          full_name?: string
          id?: string
          instagram_handle?: string | null
          linkedin_url?: string | null
          payment_reference?: string | null
          phone?: string
          preferred_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          rejection_reason?: string | null
          screened_by?: string | null
          screening_date?: string | null
          screening_notes?: string | null
          social_proof?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          why_aftr?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizer_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_applications_screened_by_fkey"
            columns: ["screened_by"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_applications_screened_by_fkey"
            columns: ["screened_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizer_subscriptions: {
        Row: {
          amount_euros: number
          application_id: string | null
          cancelled_at: string | null
          created_at: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          renewal_reminder_sent: boolean | null
          renewed_from: string | null
          started_at: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_euros: number
          application_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          renewal_reminder_sent?: boolean | null
          renewed_from?: string | null
          started_at: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_euros?: number
          application_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          renewal_reminder_sent?: boolean | null
          renewed_from?: string | null
          started_at?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizer_subscriptions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_subscriptions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "organizer_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_subscriptions_renewed_from_fkey"
            columns: ["renewed_from"]
            isOneToOne: false
            referencedRelation: "organizer_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          amount_euros: number
          application_id: string | null
          confirmed: boolean | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          proof_image_url: string | null
          user_id: string | null
        }
        Insert: {
          amount_euros: number
          application_id?: string | null
          confirmed?: boolean | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_method: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          proof_image_url?: string | null
          user_id?: string | null
        }
        Update: {
          amount_euros?: number
          application_id?: string | null
          confirmed?: boolean | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          proof_image_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "organizer_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          instagram_handle: string | null
          is_admin: boolean | null
          is_verified_organizer: boolean | null
          linkedin_url: string | null
          nationality: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          instagram_handle?: string | null
          is_admin?: boolean | null
          is_verified_organizer?: boolean | null
          linkedin_url?: string | null
          nationality?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          is_admin?: boolean | null
          is_verified_organizer?: boolean | null
          linkedin_url?: string | null
          nationality?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attended: boolean | null
          created_at: string | null
          event_id: string | null
          guest_email: string
          guest_name: string | null
          guest_phone: string | null
          id: string
          source: string | null
          status: string | null
          user_id: string | null
          wants_whatsapp: boolean | null
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          event_id?: string | null
          guest_email: string
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          source?: string | null
          status?: string | null
          user_id?: string | null
          wants_whatsapp?: boolean | null
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          event_id?: string | null
          guest_email?: string
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          source?: string | null
          status?: string | null
          user_id?: string | null
          wants_whatsapp?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_organizers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string | null
          ends_at: string | null
          events_created: number | null
          events_published: number | null
          full_name: string | null
          id: string | null
          instagram_handle: string | null
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          started_at: string | null
        }
        Relationships: []
      }
      applications_dashboard: {
        Row: {
          amount_euros: number | null
          approved_at: string | null
          created_at: string | null
          email: string | null
          event_types: string[] | null
          full_name: string | null
          id: string | null
          instagram_handle: string | null
          is_verified_organizer: boolean | null
          payment_confirmed: boolean | null
          payment_method: string | null
          payment_reference: string | null
          phone: string | null
          preferred_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          screening_date: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          subscription_ends: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_subscription_expiry: { Args: never; Returns: undefined }
      get_spots_left: {
        Args: { event_row: Database["public"]["Tables"]["events"]["Row"] }
        Returns: number
      }
    }
    Enums: {
      application_status:
        | "pending_review"
        | "screening_booked"
        | "approved_pending_payment"
        | "payment_submitted"
        | "active"
        | "expired"
        | "cancelled"
        | "rejected"
      event_category: "chat" | "digital" | "lingo" | "hub" | "unplug" | "other"
      event_city: "alicante" | "elche" | "other"
      event_status:
        | "draft"
        | "pending_approval"
        | "published"
        | "cancelled"
        | "completed"
      subscription_plan: "monthly" | "biannual" | "annual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "pending_review",
        "screening_booked",
        "approved_pending_payment",
        "payment_submitted",
        "active",
        "expired",
        "cancelled",
        "rejected",
      ],
      event_category: ["chat", "digital", "lingo", "hub", "unplug", "other"],
      event_city: ["alicante", "elche", "other"],
      event_status: [
        "draft",
        "pending_approval",
        "published",
        "cancelled",
        "completed",
      ],
      subscription_plan: ["monthly", "biannual", "annual"],
    },
  },
} as const
