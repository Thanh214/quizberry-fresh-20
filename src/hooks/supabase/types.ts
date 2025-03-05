
import { Session, AuthError, User } from "@supabase/supabase-js";

// Define table names
export type TableNames = "exams" | "profiles" | "questions" | "quiz_results" | "options" | "exam_participants" | "question_answers" | "quiz_sessions";

// Define interfaces for Supabase table data
export interface SupabaseExamParticipant {
  id: string;
  exam_id: string;
  student_name: string;
  student_id: string;
  class_name: string;
  status: string;
  start_time: string;
  end_time?: string | null;
  join_link?: string | null;
  exit_count?: number | null;
  last_exit_time?: string | null;
  score?: number | null;
  user_id?: string | null;
}

export interface SupabaseExam {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  duration: number;
  teacher_id?: string | null;
  is_active: boolean;
  has_started: boolean;
  created_at: string;
  updated_at: string;
  question_ids?: string[] | null;
  share_link?: string | null;
}

// Simple base type for all Supabase data responses
export type SupabaseData = Record<string, any>;

// Options for querying Supabase
export interface QueryOptions {
  columns?: string;
  eq?: [string, any][];
  order?: [string, "asc" | "desc"];
  limit?: number;
  select?: string;
}

// Define type for auth result
export interface AuthResult {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}
