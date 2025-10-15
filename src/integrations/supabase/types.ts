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
      jobs: {
        Row: {
          application_url: string | null
          brand_color: string | null
          company_logo_url: string | null
          company_name: string
          created_at: string
          description: string
          experience_level: string | null
          id: string
          is_active: boolean | null
          is_priority: boolean | null
          job_type: string | null
          location: string
          salary_max: number | null
          salary_min: number | null
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          application_url?: string | null
          brand_color?: string | null
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          description: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          is_priority?: boolean | null
          job_type?: string | null
          location: string
          salary_max?: number | null
          salary_min?: number | null
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          application_url?: string | null
          brand_color?: string | null
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          description?: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          is_priority?: boolean | null
          job_type?: string | null
          location?: string
          salary_max?: number | null
          salary_min?: number | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          type: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          type?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          adventure_theme: string
          ai_personality: string
          created_at: string | null
          current_streak: number | null
          id: string
          level: number | null
          longest_streak: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          adventure_theme: string
          ai_personality: string
          created_at?: string | null
          current_streak?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          adventure_theme?: string
          ai_personality?: string
          created_at?: string | null
          current_streak?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      rsvp_responses: {
        Row: {
          attendance: string
          created_at: string
          guest_count: number | null
          id: string
          message: string | null
          name: string
        }
        Insert: {
          attendance: string
          created_at?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
        }
        Update: {
          attendance?: string
          created_at?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
        }
        Relationships: []
      }
      subscription_categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          badge_color: string | null
          billing_cycle: string
          brand_color: string | null
          category: string
          created_at: string
          currency: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          next_billing_date: string
          notes: string | null
          payment_method: string | null
          payment_provider: string | null
          price: number
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          badge_color?: string | null
          billing_cycle?: string
          brand_color?: string | null
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          next_billing_date: string
          notes?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          price: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          badge_color?: string | null
          billing_cycle?: string
          brand_color?: string | null
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          next_billing_date?: string
          notes?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          price?: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_logos: {
        Row: {
          created_at: string
          id: string
          name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      workflow_edges: {
        Row: {
          created_at: string
          data: Json | null
          edge_id: string
          id: string
          source_handle: string | null
          source_node_id: string
          style: Json | null
          target_handle: string | null
          target_node_id: string
          type: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          edge_id: string
          id?: string
          source_handle?: string | null
          source_node_id: string
          style?: Json | null
          target_handle?: string | null
          target_node_id: string
          type?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          edge_id?: string
          id?: string
          source_handle?: string | null
          source_node_id?: string
          style?: Json | null
          target_handle?: string | null
          target_node_id?: string
          type?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_edges_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          created_at: string
          data: Json
          id: string
          node_id: string
          position_x: number
          position_y: number
          style: Json | null
          type: string
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          node_id: string
          position_x: number
          position_y: number
          style?: Json | null
          type: string
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          node_id?: string
          position_x?: number
          position_y?: number
          style?: Json | null
          type?: string
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
