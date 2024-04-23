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
      colors: {
        Row: {
          code: string
          created_at: string
          id: string
          model_id: string
          name: string
          price: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          model_id: string
          name: string
          price: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          model_id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_colors_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      interiors: {
        Row: {
          code: string
          created_at: string
          id: string
          model_id: string
          name: string
          price: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          model_id?: string
          name: string
          price: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          model_id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_interiors_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      seatings: {
        Row: {
          created_at: string
          id: string
          price: number
          seat_count: number
          trim_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          seat_count: number
          trim_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          seat_count?: number
          trim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_seatings_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
            referencedColumns: ["id"]
          },
        ]
      }
      steerings: {
        Row: {
          code: string
          created_at: string
          id: string
          model_id: string
          name: string
          price: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          model_id?: string
          name: string
          price: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          model_id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_steerings_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      trims: {
        Row: {
          code: string
          created_at: string
          id: string
          model_id: string
          name: string | null
          slug: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          model_id: string
          name?: string | null
          slug: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          model_id?: string
          name?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trims_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      wheels: {
        Row: {
          code: string
          created_at: string
          id: string
          inch: number
          name: string
          price: number
          trim_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          inch: number
          name: string
          price: number
          trim_id?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          inch?: number
          name?: string
          price?: number
          trim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_wheels_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
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
