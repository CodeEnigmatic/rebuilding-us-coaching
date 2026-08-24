export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AppRole = 'member' | 'coach' | 'admin'
export type MembershipTier = 'individual' | 'relationship' | 'community'
export type MembershipStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired'
export type AccessSource = 'manual' | 'stripe' | 'trial' | 'promotional'
export type SupportRequestStatus = 'new' | 'reviewed' | 'closed'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          email: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          email?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          role: AppRole
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role?: AppRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          role?: AppRole
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          tier: MembershipTier
          status: MembershipStatus
          source: AccessSource
          starts_at: string
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: MembershipTier
          status?: MembershipStatus
          source?: AccessSource
          starts_at?: string
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tier?: MembershipTier
          status?: MembershipStatus
          source?: AccessSource
          starts_at?: string
          ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          id: string
          actor_user_id: string | null
          target_user_id: string | null
          event_type: string
          metadata: Json
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      support_requests: {
        Row: {
          id: string
          user_id: string
          email: string
          display_name: string | null
          message: string
          status: SupportRequestStatus
          email_delivery_id: string | null
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      course_tracks: {
        Row: { id: string; slug: string; title: string; subtitle: string; description: string; transformation_statement: string; audience: string; estimated_weeks: number; access_level: MembershipTier; status: 'draft' | 'published' | 'archived'; display_order: number; created_at: string; updated_at: string }
        Insert: never
        Update: never
        Relationships: []
      }
      course_modules: {
        Row: { id: string; track_id: string; slug: string; framework_principle: string; title: string; summary: string; desired_outcome: string; guiding_question: string | null; applied_work: Json; module_type: 'orientation' | 'framework' | 'capstone'; display_order: number; is_required: boolean; status: 'draft' | 'published' | 'archived' }
        Insert: never
        Update: never
        Relationships: []
      }
      course_lessons: {
        Row: { id: string; module_id: string; slug: string; title: string; objective: string; content: string; content_status: 'outline' | 'draft' | 'final'; media_url: string | null; reflection_prompts: Json; display_order: number; is_required: boolean; estimated_minutes: number }
        Insert: never
        Update: never
        Relationships: []
      }
      lesson_progress: {
        Row: { id: string; user_id: string; lesson_id: string; status: 'not_started' | 'in_progress' | 'completed'; started_at: string | null; completed_at: string | null; updated_at: string }
        Insert: { id?: string; user_id: string; lesson_id: string; status?: 'not_started' | 'in_progress' | 'completed'; started_at?: string | null; completed_at?: string | null; updated_at?: string }
        Update: { status?: 'not_started' | 'in_progress' | 'completed'; started_at?: string | null; completed_at?: string | null; updated_at?: string }
        Relationships: []
      }
      journal_entries: {
        Row: { id: string; user_id: string; lesson_id: string | null; module_id: string | null; prompt_key: string; content: string; visibility: 'private' | 'coach_shared'; updated_at: string }
        Insert: { id?: string; user_id: string; lesson_id?: string | null; module_id?: string | null; prompt_key: string; content: string; visibility?: 'private' | 'coach_shared'; updated_at?: string }
        Update: { content?: string; visibility?: 'private' | 'coach_shared'; updated_at?: string }
        Relationships: []
      }
      course_assessments: {
        Row: { id: string; track_id: string; assessment_type: 'entry' | 'midpoint' | 'exit'; title: string; version: number; status: 'draft' | 'published' | 'archived' }
        Insert: never
        Update: never
        Relationships: []
      }
      assessment_questions: {
        Row: { id: string; assessment_id: string; dimension: string; prompt: string; response_type: string; options: Json; scoring_rule: Json; display_order: number }
        Insert: never
        Update: never
        Relationships: []
      }
      assessment_attempts: {
        Row: { id: string; user_id: string; assessment_id: string; started_at: string; completed_at: string | null; dimension_scores: Json }
        Insert: { id?: string; user_id: string; assessment_id: string; started_at?: string; completed_at?: string | null; dimension_scores?: Json }
        Update: { completed_at?: string | null; dimension_scores?: Json }
        Relationships: []
      }
      assessment_responses: {
        Row: { id: string; attempt_id: string; question_id: string; response: Json; score: number | null }
        Insert: { id?: string; attempt_id: string; question_id: string; response: Json; score?: number | null }
        Update: { response?: Json; score?: number | null }
        Relationships: []
      }
      course_exercises: {
        Row: { id: string; module_id: string | null; lesson_id: string | null; slug: string; title: string; instructions: string; response_schema: Json; visibility: 'private' | 'coach_shared'; display_order: number }
        Insert: never
        Update: never
        Relationships: []
      }
      exercise_submissions: {
        Row: { id: string; user_id: string; exercise_id: string; response: Json; status: 'not_started' | 'in_progress' | 'completed'; coach_feedback: string | null; submitted_at: string | null; updated_at: string }
        Insert: { id?: string; user_id: string; exercise_id: string; response: Json; status?: 'not_started' | 'in_progress' | 'completed'; submitted_at?: string | null; updated_at?: string }
        Update: { response?: Json; status?: 'not_started' | 'in_progress' | 'completed'; submitted_at?: string | null; updated_at?: string }
        Relationships: []
      }
      course_safety_resources: {
        Row: { id: string; track_id: string; title: string; body: string; resource_url: string | null; region: string | null; status: 'draft' | 'published' | 'archived'; display_order: number }
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      has_membership_tier: {
        Args: { required_tier: MembershipTier }
        Returns: boolean
      }
      admin_list_clients: {
        Args: Record<never, never>
        Returns: {
          user_id: string
          display_name: string | null
          email: string | null
          role: AppRole
          tier: MembershipTier | null
          membership_status: MembershipStatus | null
          membership_id: string | null
          membership_ends_at: string | null
        }[]
      }
      admin_grant_membership: {
        Args: { target_user_id: string; granted_tier: MembershipTier; grant_ends_at?: string | null }
        Returns: string
      }
      admin_revoke_membership: {
        Args: { target_membership_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: AppRole
      membership_tier: MembershipTier
      membership_status: MembershipStatus
      access_source: AccessSource
      support_request_status: SupportRequestStatus
    }
    CompositeTypes: Record<never, never>
  }
}
