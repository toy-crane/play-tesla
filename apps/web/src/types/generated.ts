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
          color_code: string
          created_at: string
          id: string
          korean_name: string
          model_id: string
          name: string
          price: number
        }
        Insert: {
          code: string
          color_code: string
          created_at?: string
          id?: string
          korean_name: string
          model_id: string
          name: string
          price: number
        }
        Update: {
          code?: string
          color_code?: string
          created_at?: string
          id?: string
          korean_name?: string
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
      driving_assist_options: {
        Row: {
          code: string
          created_at: string
          id: string
          korean_name: string
          model_id: string
          name: string
          price: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          korean_name: string
          model_id?: string
          name: string
          price: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          korean_name?: string
          model_id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "driving_assist_options_model_id_fkey"
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
          color_code: string
          created_at: string
          id: string
          korean_name: string
          name: string
          price: number
          trim_id: string | null
        }
        Insert: {
          code: string
          color_code: string
          created_at?: string
          id?: string
          korean_name: string
          name: string
          price: number
          trim_id?: string | null
        }
        Update: {
          code?: string
          color_code?: string
          created_at?: string
          id?: string
          korean_name?: string
          name?: string
          price?: number
          trim_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interiors_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
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
          slug: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      region_subsidies: {
        Row: {
          created_at: string
          id: string
          initial_quota: number
          intaked_quota: number
          region_code: string
          remaining_quota: number
          shipped_quota: number
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          initial_quota: number
          intaked_quota: number
          region_code: string
          remaining_quota: number
          shipped_quota: number
          snapshot_date: string
        }
        Update: {
          created_at?: string
          id?: string
          initial_quota?: number
          intaked_quota?: number
          region_code?: string
          remaining_quota?: number
          shipped_quota?: number
          snapshot_date?: string
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
      subsidies: {
        Row: {
          created_at: string
          id: string
          local_subsidy: number
          national_subsidy: number
          region_code: string
          trim_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          local_subsidy: number
          national_subsidy: number
          region_code: string
          trim_id?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          local_subsidy?: number
          national_subsidy?: number
          region_code?: string
          trim_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_subsidies_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
            referencedColumns: ["id"]
          },
        ]
      }
      trim_delivery_estimates: {
        Row: {
          created_at: string
          id: number
          max_week: number
          min_week: number
          set_at: string
          trim_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          max_week: number
          min_week: number
          set_at: string
          trim_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          max_week?: number
          min_week?: number
          set_at?: string
          trim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trim_delivery_estimates_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
            referencedColumns: ["id"]
          },
        ]
      }
      trim_prices: {
        Row: {
          created_at: string
          id: string
          price: number
          price_set_at: string
          trim_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          price_set_at: string
          trim_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          price_set_at?: string
          trim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trim_prices_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trims"
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
