
// Table names in your Supabase database
export type TableNames = 'profiles' | 'exams' | 'questions' | 'options' | 'quiz_results' | 'quiz_sessions' | 'exam_participants';

// Generic query options
export interface QueryOptions {
  select?: string;
  eq?: [string, any][];
  order?: [string, "asc" | "desc"];
  limit?: number;
}

// Generic data type for Supabase operations
export type SupabaseData = Record<string, any>;

// Supabase exam structure (snake_case)
export interface SupabaseExam {
  id: string;
  code: string;
  title: string;
  description?: string;
  duration: number;
  teacher_id?: string;
  is_active: boolean;
  has_started: boolean;
  created_at: string;
  updated_at: string;
  question_ids: string[]; // Always a string array
  share_link?: string;
}

// Supabase exam participant structure (snake_case)
export interface SupabaseExamParticipant {
  id: string;
  exam_id: string;
  student_name: string;
  student_id: string;
  class_name: string;
  status: string;
  start_time: string;
  end_time?: string;
  join_link?: string;
  exit_count?: number;
  last_exit_time?: string;
  score?: number;
  user_id?: string;
}

// Auth result type for authentication operations
export interface AuthResult {
  data: {
    user: any | null;
    session: any | null;
  };
  error: Error | null;
}
