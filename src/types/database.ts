// Hand-authored Database types matching supabase/migrations/000001_initial.sql.
// Regenerate with `supabase gen types typescript` once the project is linked.

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
          handler: string | null;
          accent: string;
          plan: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          handler?: string | null;
          accent?: string;
          plan?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          handler?: string | null;
          accent?: string;
          plan?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          user_id: string;
          brand: string;
          status: string;
          deliverable: string | null;
          value: number | null;
          due_date: string | null;
          notes: string | null;
          links: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          brand: string;
          status?: string;
          deliverable?: string | null;
          value?: number | null;
          due_date?: string | null;
          notes?: string | null;
          links?: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          brand?: string;
          status?: string;
          deliverable?: string | null;
          value?: number | null;
          due_date?: string | null;
          notes?: string | null;
          links?: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          deal_id: string | null;
          amount: number;
          expected_date: string | null;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deal_id?: string | null;
          amount: number;
          expected_date?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deal_id?: string | null;
          amount?: number;
          expected_date?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          platform: string | null;
          post_type: string | null;
          status: string;
          event_date: string;
          linked_deal_id: string | null;
          caption: string | null;
          notes: string | null;
          repeat_type: string | null;
          repeat_until: string | null;
          scheduled_time: string | null;
          media_refs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          platform?: string | null;
          post_type?: string | null;
          status?: string;
          event_date: string;
          linked_deal_id?: string | null;
          caption?: string | null;
          notes?: string | null;
          repeat_type?: string | null;
          repeat_until?: string | null;
          scheduled_time?: string | null;
          media_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          platform?: string | null;
          post_type?: string | null;
          status?: string;
          event_date?: string;
          linked_deal_id?: string | null;
          caption?: string | null;
          notes?: string | null;
          repeat_type?: string | null;
          repeat_until?: string | null;
          scheduled_time?: string | null;
          media_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      ideas: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          stage: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          stage?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          stage?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          body: string;
          updated_at: string;
        };
        Insert: { id?: string; user_id: string; body?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; body?: string; updated_at?: string };
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          done: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; user_id: string; title: string; done?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; title?: string; done?: boolean; created_at?: string; updated_at?: string };
      };
      deal_checklist: {
        Row: {
          id: string;
          user_id: string;
          deal_id: string;
          title: string;
          done: boolean;
          created_at: string;
        };
        Insert: { id?: string; user_id: string; deal_id: string; title: string; done?: boolean; created_at?: string };
        Update: { id?: string; user_id?: string; deal_id?: string; title?: string; done?: boolean; created_at?: string };
      };
      deal_files: {
        Row: {
          id: string;
          user_id: string;
          deal_id: string;
          name: string;
          path: string;
          size_bytes: number | null;
          mime: string | null;
          created_at: string;
        };
        Insert: { id?: string; user_id: string; deal_id: string; name: string; path: string; size_bytes?: number | null; mime?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; deal_id?: string; name?: string; path?: string; size_bytes?: number | null; mime?: string | null; created_at?: string };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
