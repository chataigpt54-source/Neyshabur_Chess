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
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          image_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          image_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          name: string;
          photo_url: string | null;
          bio: string | null;
          achievements: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          photo_url?: string | null;
          bio?: string | null;
          achievements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          photo_url?: string | null;
          bio?: string | null;
          achievements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          status: 'upcoming' | 'ongoing' | 'past';
          registration_open: boolean;
          image_url: string | null;
          location: string | null;
          max_participants: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          status?: 'upcoming' | 'ongoing' | 'past';
          registration_open?: boolean;
          image_url?: string | null;
          location?: string | null;
          max_participants?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          status?: 'upcoming' | 'ongoing' | 'past';
          registration_open?: boolean;
          image_url?: string | null;
          location?: string | null;
          max_participants?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          id: string;
          tournament_id: string;
          full_name: string;
          phone: string;
          email: string | null;
          national_id: string | null;
          notes: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          national_id?: string | null;
          notes?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          national_id?: string | null;
          notes?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'registrations_tournament_id_fkey';
            columns: ['tournament_id'];
            isOneToOne: false;
            referencedRelation: 'tournaments';
            referencedColumns: ['id'];
          }
        ];
      };
      gallery: {
        Row: {
          id: string;
          title: string | null;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          image_url?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          created_at?: string;
        };
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type News = Database['public']['Tables']['news']['Row'];
export type Player = Database['public']['Tables']['players']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type Registration = Database['public']['Tables']['registrations']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type Page = Database['public']['Tables']['pages']['Row'];
export type Setting = Database['public']['Tables']['settings']['Row'];
export type Admin = Database['public']['Tables']['admins']['Row'];