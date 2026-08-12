export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AppRole = 'member' | 'coach' | 'admin'
export type MembershipTier = 'individual' | 'relationship' | 'community'
export type MembershipStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
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
          starts_at?: string
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tier?: MembershipTier
          status?: MembershipStatus
          starts_at?: string
          ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      has_membership_tier: {
        Args: { required_tier: MembershipTier }
        Returns: boolean
      }
    }
    Enums: {
      app_role: AppRole
      membership_tier: MembershipTier
      membership_status: MembershipStatus
    }
    CompositeTypes: Record<never, never>
  }
}
