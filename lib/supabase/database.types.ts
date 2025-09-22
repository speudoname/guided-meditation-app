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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string | null
          icon_url: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_presets: {
        Row: {
          created_at: string | null
          exhale_seconds: number
          hold_exhale_seconds: number | null
          hold_inhale_seconds: number | null
          id: string
          inhale_seconds: number
          instructions: string | null
          is_system: boolean | null
          name: string
          pattern: string
          purpose: string | null
        }
        Insert: {
          created_at?: string | null
          exhale_seconds: number
          hold_exhale_seconds?: number | null
          hold_inhale_seconds?: number | null
          id?: string
          inhale_seconds: number
          instructions?: string | null
          is_system?: boolean | null
          name: string
          pattern: string
          purpose?: string | null
        }
        Update: {
          created_at?: string | null
          exhale_seconds?: number
          hold_exhale_seconds?: number | null
          hold_inhale_seconds?: number | null
          id?: string
          inhale_seconds?: number
          instructions?: string | null
          is_system?: boolean | null
          name?: string
          pattern?: string
          purpose?: string | null
        }
        Relationships: []
      }
      breathing_sessions: {
        Row: {
          abandoned_at: string | null
          completed_at: string | null
          created_at: string | null
          custom_pattern: Json | null
          duration_minutes: number | null
          id: string
          preset_id: string | null
          rounds_completed: number | null
          rounds_target: number | null
          started_at: string
          state: Database["public"]["Enums"]["session_state"]
          tokens_charged: number | null
          user_id: string
        }
        Insert: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          custom_pattern?: Json | null
          duration_minutes?: number | null
          id?: string
          preset_id?: string | null
          rounds_completed?: number | null
          rounds_target?: number | null
          started_at: string
          state: Database["public"]["Enums"]["session_state"]
          tokens_charged?: number | null
          user_id: string
        }
        Update: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          custom_pattern?: Json | null
          duration_minutes?: number | null
          id?: string
          preset_id?: string | null
          rounds_completed?: number | null
          rounds_target?: number | null
          started_at?: string
          state?: Database["public"]["Enums"]["session_state"]
          tokens_charged?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_sessions_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "breathing_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breathing_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          completed_sessions: number[] | null
          course_id: string
          current_session: number | null
          enrolled_at: string | null
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_sessions?: number[] | null
          course_id: string
          current_session?: number | null
          enrolled_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_sessions?: number[] | null
          course_id?: string
          current_session?: number | null
          enrolled_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          audio_url: string
          course_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_locked: boolean | null
          session_number: number
          title: string
        }
        Insert: {
          audio_url: string
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_locked?: boolean | null
          session_number: number
          title: string
        }
        Update: {
          audio_url?: string
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_locked?: boolean | null
          session_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          categories: string[]
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          intro_video_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          schedule_config: Json | null
          scheduling_mode: Database["public"]["Enums"]["course_scheduling_mode"]
          tags: string[] | null
          teacher_id: string
          title: string
          total_sessions: number
          updated_at: string | null
        }
        Insert: {
          categories: string[]
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intro_video_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          schedule_config?: Json | null
          scheduling_mode?: Database["public"]["Enums"]["course_scheduling_mode"]
          tags?: string[] | null
          teacher_id: string
          title: string
          total_sessions?: number
          updated_at?: string | null
        }
        Update: {
          categories?: string[]
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intro_video_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          schedule_config?: Json | null
          scheduling_mode?: Database["public"]["Enums"]["course_scheduling_mode"]
          tags?: string[] | null
          teacher_id?: string
          title?: string
          total_sessions?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_sessions: {
        Row: {
          abandoned_at: string | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number
          elapsed_minutes: number | null
          id: string
          interval_minutes: number | null
          paused_at: string | null
          resumed_at: string | null
          settings: Json | null
          sound_pack_id: string | null
          started_at: string
          state: Database["public"]["Enums"]["session_state"]
          tokens_charged: number | null
          user_id: string
        }
        Insert: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes: number
          elapsed_minutes?: number | null
          id?: string
          interval_minutes?: number | null
          paused_at?: string | null
          resumed_at?: string | null
          settings?: Json | null
          sound_pack_id?: string | null
          started_at: string
          state: Database["public"]["Enums"]["session_state"]
          tokens_charged?: number | null
          user_id: string
        }
        Update: {
          abandoned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number
          elapsed_minutes?: number | null
          id?: string
          interval_minutes?: number | null
          paused_at?: string | null
          resumed_at?: string | null
          settings?: Json | null
          sound_pack_id?: string | null
          started_at?: string
          state?: Database["public"]["Enums"]["session_state"]
          tokens_charged?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meditation_sessions_sound_pack_id_fkey"
            columns: ["sound_pack_id"]
            isOneToOne: false
            referencedRelation: "sound_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meditation_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meditations: {
        Row: {
          audio_url: string
          categories: string[] | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_published: boolean | null
          play_count: number | null
          tags: string[] | null
          teacher_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          categories?: string[] | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_published?: boolean | null
          play_count?: number | null
          tags?: string[] | null
          teacher_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          categories?: string[] | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean | null
          play_count?: number | null
          tags?: string[] | null
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meditations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      session_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_played_at: string | null
          last_position_seconds: number | null
          session_id: string
          session_type: string
          started_at: string | null
          state: Database["public"]["Enums"]["session_state"] | null
          tokens_charged: number | null
          total_listened_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_played_at?: string | null
          last_position_seconds?: number | null
          session_id: string
          session_type: string
          started_at?: string | null
          state?: Database["public"]["Enums"]["session_state"] | null
          tokens_charged?: number | null
          total_listened_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_played_at?: string | null
          last_position_seconds?: number | null
          session_id?: string
          session_type?: string
          started_at?: string | null
          state?: Database["public"]["Enums"]["session_state"] | null
          tokens_charged?: number | null
          total_listened_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sound_packs: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          is_premium: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_premium?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_premium?: boolean | null
          name?: string
        }
        Relationships: []
      }
      sounds: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          event_type: string | null
          file_url: string
          id: string
          name: string
          pack_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          event_type?: string | null
          file_url: string
          id?: string
          name: string
          pack_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          event_type?: string | null
          file_url?: string
          id?: string
          name?: string
          pack_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sounds_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "sound_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          monthly_tokens: number
          price_cents: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          monthly_tokens: number
          price_cents?: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          monthly_tokens?: number
          price_cents?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          specialty: string[] | null
          total_students: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          specialty?: string[] | null
          total_students?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          specialty?: string[] | null
          total_students?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_pricing: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          cost_per_minute: number | null
          created_at: string | null
          description: string | null
          download_cost: number | null
          flat_cost: number | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          cost_per_minute?: number | null
          created_at?: string | null
          description?: string | null
          download_cost?: number | null
          flat_cost?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          cost_per_minute?: number | null
          created_at?: string | null
          description?: string | null
          download_cost?: number | null
          flat_cost?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_downloads: {
        Row: {
          content_id: string
          content_type: string
          downloaded_at: string | null
          expires_at: string | null
          file_size_mb: number | null
          id: string
          tokens_charged: number | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          downloaded_at?: string | null
          expires_at?: string | null
          file_size_mb?: number | null
          id?: string
          tokens_charged?: number | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          downloaded_at?: string | null
          expires_at?: string | null
          file_size_mb?: number | null
          id?: string
          tokens_charged?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          practice_plan: Json | null
          settings: Json | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tokens_balance: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          practice_plan?: Json | null
          settings?: Json | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tokens_balance?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          practice_plan?: Json | null
          settings?: Json | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tokens_balance?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          grace_days_used: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          grace_days_used?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          grace_days_used?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "timer"
        | "guided_meditation"
        | "course_session"
        | "breathing"
      course_scheduling_mode:
        | "linear_daily"
        | "day_part"
        | "freeform"
        | "challenge"
      session_state:
        | "started"
        | "paused"
        | "resumed"
        | "abandoned"
        | "completed"
      subscription_tier: "free" | "premium"
      transaction_type:
        | "credit"
        | "debit"
        | "monthly_allocation"
        | "purchase"
        | "refund"
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
      activity_type: [
        "timer",
        "guided_meditation",
        "course_session",
        "breathing",
      ],
      course_scheduling_mode: [
        "linear_daily",
        "day_part",
        "freeform",
        "challenge",
      ],
      session_state: ["started", "paused", "resumed", "abandoned", "completed"],
      subscription_tier: ["free", "premium"],
      transaction_type: [
        "credit",
        "debit",
        "monthly_allocation",
        "purchase",
        "refund",
      ],
    },
  },
} as const
