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
      leads: {
        Row: {
          id: string
          email: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          email_domain: string | null
          marketing_consent: boolean
          is_test: boolean
          user_id: string | null
          claimed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          email_domain?: string | null
          marketing_consent?: boolean
          is_test?: boolean
          user_id?: string | null
          claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          email_domain?: string | null
          marketing_consent?: boolean
          is_test?: boolean
          user_id?: string | null
          claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          id: string
          lead_id: string
          survey_version: string
          total_score: number
          max_possible_score: number
          results_token: string
          is_test: boolean
          completed_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          survey_version?: string
          total_score: number
          max_possible_score?: number
          results_token: string
          is_test?: boolean
          completed_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          survey_version?: string
          total_score?: number
          max_possible_score?: number
          results_token?: string
          is_test?: boolean
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      survey_answers: {
        Row: {
          id: string
          response_id: string
          question_id: string
          answer: boolean
          created_at: string
        }
        Insert: {
          id?: string
          response_id: string
          question_id: string
          answer: boolean
          created_at?: string
        }
        Update: {
          id?: string
          response_id?: string
          question_id?: string
          answer?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_answers_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_responses"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      survey_stats: {
        Row: {
          survey_version: string | null
          total_responses: number | null
          avg_score: number | null
          avg_percentage: number | null
          median_score: number | null
          p25_score: number | null
          p75_score: number | null
          min_score: number | null
          max_score: number | null
          last_updated: string | null
        }
        Relationships: []
      }
      question_stats: {
        Row: {
          question_id: string | null
          survey_version: string | null
          total_responses: number | null
          yes_percentage: number | null
          yes_count: number | null
          no_count: number | null
          last_updated: string | null
        }
        Relationships: []
      }
      category_stats: {
        Row: {
          category: string | null
          survey_version: string | null
          total_responses: number | null
          avg_percentage: number | null
          last_updated: string | null
        }
        Relationships: []
      }
      score_distribution: {
        Row: {
          survey_version: string | null
          total_score: number | null
          frequency: number | null
          cumulative_count: number | null
          total_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_test_data: {
        Args: Record<string, never>
        Returns: undefined
      }
      cleanup_all_test_data: {
        Args: Record<string, never>
        Returns: {
          answers_deleted: number
          responses_deleted: number
          leads_deleted: number
        }[]
      }
    }
    Enums: {
      user_role:
        | "clinical_director"
        | "bcba"
        | "bcaba"
        | "rbt"
        | "owner"
        | "qa_manager"
        | "consultant"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

// Convenience type aliases
export type Lead = Tables<"leads">
export type InsertLead = InsertTables<"leads">
export type UpdateLead = UpdateTables<"leads">

export type SurveyResponse = Tables<"survey_responses">
export type InsertSurveyResponse = InsertTables<"survey_responses">
export type UpdateSurveyResponse = UpdateTables<"survey_responses">

export type SurveyAnswer = Tables<"survey_answers">
export type InsertSurveyAnswer = InsertTables<"survey_answers">
export type UpdateSurveyAnswer = UpdateTables<"survey_answers">

export type SurveyStats = Views<"survey_stats">
export type QuestionStats = Views<"question_stats">
export type CategoryStats = Views<"category_stats">
export type ScoreDistribution = Views<"score_distribution">

export type UserRole = Enums<"user_role">
