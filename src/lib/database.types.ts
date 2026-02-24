export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          kvk_number: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          kvk_number?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          kvk_number?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "member";
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          name: string;
          publisher: string;
          cost: number;
          currency: string;
          billing_cycle:
            | "monthly"
            | "quarterly"
            | "semi-annual"
            | "annual"
            | "one-time";
          category: string;
          context: "personal" | "organisation";
          organization_id: string | null;
          user_id: string;
          next_billing_date: string;
          start_date: string;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          publisher: string;
          cost: number;
          currency: string;
          billing_cycle:
            | "monthly"
            | "quarterly"
            | "semi-annual"
            | "annual"
            | "one-time";
          category: string;
          context: "personal" | "organisation";
          organization_id?: string | null;
          user_id: string;
          next_billing_date: string;
          start_date: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          publisher?: string;
          cost?: number;
          currency?: string;
          billing_cycle?:
            | "monthly"
            | "quarterly"
            | "semi-annual"
            | "annual"
            | "one-time";
          category?: string;
          context?: "personal" | "organisation";
          organization_id?: string | null;
          user_id?: string;
          next_billing_date?: string;
          start_date?: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
