export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          added_at: string
          artist_mbid: string
          artist_name: string
        }
        Insert: {
          added_at?: string
          artist_mbid: string
          artist_name: string
        }
        Update: {
          added_at?: string
          artist_mbid?: string
          artist_name?: string
        }
        Relationships: []
      }
      collections_contents: {
        Row: {
          artist_mbid: string
          changelog: Json | null
          collection_id: number
          id: number
          inserted_at: string
          item_position: number | null
          notes: string | null
          recording_mbid: string | null
          release_group_mbid: string | null
          updated_at: string
        }
        Insert: {
          artist_mbid: string
          changelog?: Json | null
          collection_id: number
          id?: number
          inserted_at?: string
          item_position?: number | null
          notes?: string | null
          recording_mbid?: string | null
          release_group_mbid?: string | null
          updated_at?: string
        }
        Update: {
          artist_mbid?: string
          changelog?: Json | null
          collection_id?: number
          id?: number
          inserted_at?: string
          item_position?: number | null
          notes?: string | null
          recording_mbid?: string | null
          release_group_mbid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_contents_artist_mbid_fkey"
            columns: ["artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
          {
            foreignKeyName: "collections_contents_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "aggregate_collection_contents"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_contents_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections_info"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_contents_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "view_permissions_collections"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_contents_recording_mbid_fkey"
            columns: ["recording_mbid"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["recording_mbid"]
          },
          {
            foreignKeyName: "collections_contents_release_group_mbid_fkey"
            columns: ["release_group_mbid"]
            isOneToOne: false
            referencedRelation: "release_groups"
            referencedColumns: ["release_group_mbid"]
          },
        ]
      }
      collections_info: {
        Row: {
          changelog: Json | null
          collection_id: number
          created_at: string
          created_by: string
          description_text: string | null
          owner_id: string
          spotlight_requested: boolean
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          changelog?: Json | null
          collection_id?: number
          created_at?: string
          created_by: string
          description_text?: string | null
          owner_id: string
          spotlight_requested?: boolean
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          changelog?: Json | null
          collection_id?: number
          created_at?: string
          created_by?: string
          description_text?: string | null
          owner_id?: string
          spotlight_requested?: boolean
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_info_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections_social: {
        Row: {
          changelog: Json | null
          collection_id: number
          follows_now: boolean
          id: number
          updated_at: string
          user_id: string
          user_role: string
        }
        Insert: {
          changelog?: Json | null
          collection_id: number
          follows_now?: boolean
          id?: number
          updated_at?: string
          user_id: string
          user_role?: string
        }
        Update: {
          changelog?: Json | null
          collection_id?: number
          follows_now?: boolean
          id?: number
          updated_at?: string
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_social_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "aggregate_collection_contents"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_social_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections_info"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_social_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "view_permissions_collections"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collections_social_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections_updates: {
        Row: {
          collection_id: number
          id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          collection_id: number
          id?: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          collection_id?: number
          id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_collections_updates_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "aggregate_collection_contents"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "public_collections_updates_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections_info"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "public_collections_updates_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "view_permissions_collections"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "public_collections_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          changelog: Json | null
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          changelog?: Json | null
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          changelog?: Json | null
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recordings: {
        Row: {
          added_at: string | null
          artist_mbid: string
          recording_mbid: string
          recording_name: string
          release_date: string | null
          release_groupd_mbid: string | null
          remixer_artist_mbid: string | null
        }
        Insert: {
          added_at?: string | null
          artist_mbid: string
          recording_mbid: string
          recording_name: string
          release_date?: string | null
          release_groupd_mbid?: string | null
          remixer_artist_mbid?: string | null
        }
        Update: {
          added_at?: string | null
          artist_mbid?: string
          recording_mbid?: string
          recording_name?: string
          release_date?: string | null
          release_groupd_mbid?: string | null
          remixer_artist_mbid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_recordings_artist_mbid_fkey"
            columns: ["artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
          {
            foreignKeyName: "recordings_release_groupd_mbid_fkey"
            columns: ["release_groupd_mbid"]
            isOneToOne: false
            referencedRelation: "release_groups"
            referencedColumns: ["release_group_mbid"]
          },
          {
            foreignKeyName: "recordings_remixer_artist_mbid_fkey"
            columns: ["remixer_artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
        ]
      }
      release_groups: {
        Row: {
          added_at: string | null
          artist_mbid: string
          img_url: string | null
          label: string | null
          release_date: string
          release_group_mbid: string
          release_group_name: string
        }
        Insert: {
          added_at?: string | null
          artist_mbid: string
          img_url?: string | null
          label?: string | null
          release_date: string
          release_group_mbid: string
          release_group_name: string
        }
        Update: {
          added_at?: string | null
          artist_mbid?: string
          img_url?: string | null
          label?: string | null
          release_date?: string
          release_group_mbid?: string
          release_group_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "release_groups_artist_mbid_fkey"
            columns: ["artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
        ]
      }
      social_graph: {
        Row: {
          changelog: Json | null
          follows_now: boolean
          id: number
          target_user_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          changelog?: Json | null
          follows_now?: boolean
          id?: number
          target_user_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          changelog?: Json | null
          follows_now?: boolean
          id?: number
          target_user_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_graph_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_graph_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      aggregate_collection_contents: {
        Row: {
          artist_mbid: string | null
          artist_name: string | null
          collection_content_item_id: number | null
          collection_contents_item_changelog: Json | null
          collection_id: number | null
          created_at: string | null
          created_by: string | null
          img_url: string | null
          item_position: number | null
          label: string | null
          notes: string | null
          owner_id: string | null
          recording_mbid: string | null
          recording_name: string | null
          recording_release_date: string | null
          release_group_mbid: string | null
          release_group_name: string | null
          release_group_release_date: string | null
          remixer_artist_mbid: string | null
          social_user_id: string | null
          status: string | null
          title: string | null
          type: string | null
          user_role: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_contents_artist_mbid_fkey"
            columns: ["artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
          {
            foreignKeyName: "collections_contents_recording_mbid_fkey"
            columns: ["recording_mbid"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["recording_mbid"]
          },
          {
            foreignKeyName: "collections_contents_release_group_mbid_fkey"
            columns: ["release_group_mbid"]
            isOneToOne: false
            referencedRelation: "release_groups"
            referencedColumns: ["release_group_mbid"]
          },
          {
            foreignKeyName: "collections_info_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_social_user_id_fkey"
            columns: ["social_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recordings_remixer_artist_mbid_fkey"
            columns: ["remixer_artist_mbid"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["artist_mbid"]
          },
        ]
      }
      view_permissions_collections: {
        Row: {
          avatar_url: string | null
          collection_id: number | null
          description_text: string | null
          display_name: string | null
          modified_at: string | null
          owner_id: string | null
          status: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
          user_role: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_social_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_collections_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
