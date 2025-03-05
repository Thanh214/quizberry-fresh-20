
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
  question_ids?: string; // JSON string of question IDs
  share_link?: string;
}

// Export all types from this module
export * from './types';
