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
      exam_participants: {
        Row: {
          class_name: string
          end_time: string | null
          exam_id: string
          exit_count: number | null
          id: string
          join_link: string | null
          last_exit_time: string | null
          score: number | null
          start_time: string
          status: string
          student_id: string
          student_name: string
          user_id: string | null
        }
        Insert: {
          class_name: string
          end_time?: string | null
          exam_id: string
          exit_count?: number | null
          id?: string
          join_link?: string | null
          last_exit_time?: string | null
          score?: number | null
          start_time?: string
          status?: string
          student_id: string
          student_name: string
          user_id?: string | null
        }
        Update: {
          class_name?: string
          end_time?: string | null
          exam_id?: string
          exit_count?: number | null
          id?: string
          join_link?: string | null
          last_exit_time?: string | null
          score?: number | null
          start_time?: string
          status?: string
          student_id?: string
          student_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_participants_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          code: string
          created_at: string
          description: string | null
          duration: number
          has_started: boolean
          id: string
          is_active: boolean
          share_link: string | null
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          duration?: number
          has_started?: boolean
          id?: string
          is_active?: boolean
          share_link?: string | null
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          duration?: number
          has_started?: boolean
          id?: string
          is_active?: boolean
          share_link?: string | null
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      options: {
        Row: {
          content: string
          id: string
          is_correct: boolean
          question_id: string
        }
        Insert: {
          content: string
          id?: string
          is_correct?: boolean
          question_id: string
        }
        Update: {
          content?: string
          id?: string
          is_correct?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          class_name: string | null
          created_at: string
          faculty: string | null
          id: string
          name: string | null
          role: string
          student_id: string | null
          username: string | null
        }
        Insert: {
          class_name?: string | null
          created_at?: string
          faculty?: string | null
          id: string
          name?: string | null
          role?: string
          student_id?: string | null
          username?: string | null
        }
        Update: {
          class_name?: string | null
          created_at?: string
          faculty?: string | null
          id?: string
          name?: string | null
          role?: string
          student_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      question_answers: {
        Row: {
          id: string
          is_correct: boolean
          question_id: string
          quiz_result_id: string
          selected_option_id: string | null
          time_spent: number
        }
        Insert: {
          id?: string
          is_correct?: boolean
          question_id: string
          quiz_result_id: string
          selected_option_id?: string | null
          time_spent: number
        }
        Update: {
          id?: string
          is_correct?: boolean
          question_id?: string
          quiz_result_id?: string
          selected_option_id?: string | null
          time_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_quiz_result_id_fkey"
            columns: ["quiz_result_id"]
            isOneToOne: false
            referencedRelation: "quiz_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content: string
          created_at: string
          exam_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          exam_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          exam_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          average_time_per_question: number
          class_name: string
          exam_id: string
          id: string
          score: number
          student_id: string
          student_name: string
          submitted_at: string
          total_questions: number
          total_time: number
          user_id: string | null
        }
        Insert: {
          average_time_per_question: number
          class_name: string
          exam_id: string
          id?: string
          score: number
          student_id: string
          student_name: string
          submitted_at?: string
          total_questions: number
          total_time: number
          user_id?: string | null
        }
        Update: {
          average_time_per_question?: number
          class_name?: string
          exam_id?: string
          id?: string
          score?: number
          student_id?: string
          student_name?: string
          submitted_at?: string
          total_questions?: number
          total_time?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          class_name: string
          current_question_index: number
          exam_id: string
          id: string
          started_at: string
          status: string | null
          student_id: string
          student_name: string
          user_id: string | null
        }
        Insert: {
          class_name: string
          current_question_index?: number
          exam_id: string
          id?: string
          started_at?: string
          status?: string | null
          student_id: string
          student_name: string
          user_id?: string | null
        }
        Update: {
          class_name?: string
          current_question_index?: number
          exam_id?: string
          id?: string
          started_at?: string
          status?: string | null
          student_id?: string
          student_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
