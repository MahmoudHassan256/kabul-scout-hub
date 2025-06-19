// types/database.types.ts

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
      news_items: {
        Row: {
          id: string;
          title: string;
          category: string | null;
          content: string | null;
          imageUrl: string | null;
          isPublished: boolean;
          summary: string | null;
          publishDate: string;
        };
        Insert: {
          id?: string;
          title: string;
          category?: string | null;
          content?: string | null;
          imageUrl?: string | null;
          isPublished?: boolean;
          summary?: string | null;
          publishDate?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string | null;
          content?: string | null;
          imageUrl?: string | null;
          isPublished?: boolean;
          summary?: string | null;
          publishDate?: string;
        };
        Relationships: [];
      };

      scouts: {
        Row: {
          id: string;
          fullName: string;
          phone: string | null;
          parentPhone: string | null;
          class: string;
          joinDate: string | null;
          hasHealthProblem: string | null;
        };
        Insert: {
          id?: string;
          fullName: string;
          phone?: string | null;
          parentPhone?: string | null;
          class: string;
          joinDate?: string | null;
          hasHealthProblem?: string | null;
        };
        Update: {
          id?: string;
          fullName?: string;
          phone?: string | null;
          parentPhone?: string | null;
          class?: string;
          joinDate?: string | null;
          hasHealthProblem?: string | null;
        };
        Relationships: [];
      };

      presence_records: {
        Row: {
          id: string;
          date: string;
          scout_id: string | null;
          is_present: boolean;
          notes: string | null;
          custom_columns: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          scout_id?: string | null;
          is_present?: boolean;
          notes?: string | null;
          custom_columns?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          scout_id?: string | null;
          is_present?: boolean;
          notes?: string | null;
          custom_columns?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "presence_records_scout_id_fkey";
            columns: ["scout_id"];
            isOneToOne: false;
            referencedRelation: "scouts";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// Helpers
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
