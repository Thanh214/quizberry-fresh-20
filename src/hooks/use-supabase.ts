
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

/**
 * Custom hook to fetch data from Supabase
 */
export function useSupabaseQuery<T extends Record<string, any>>(
  tableName: TableNames,
  options?: QueryOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(tableName).select(options?.select || "*");

        // Add filter conditions if any
        if (options?.eq) {
          options.eq.forEach(([column, value]) => {
            query = query.eq(column, value);
          });
        }

        // Add sorting if specified
        if (options?.order) {
          const [column, direction] = options.order;
          query = query.order(column, { ascending: direction === "asc" });
        }

        // Add limit if specified
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        
        // Use double type assertion with unknown as intermediate step to avoid deep instantiation error
        setData(result as unknown as T[]);
      } catch (err: any) {
        console.error("Lỗi khi truy vấn Supabase:", err);
        setError(err);
        toast.error(`Lỗi khi tải dữ liệu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, JSON.stringify(options)]);

  return { data, loading, error };
}

/**
 * Hook for adding/updating/deleting data in Supabase
 */
export function useSupabaseMutation(tableName: TableNames) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const add = async <T extends SupabaseData>(data: T): Promise<Record<string, any>> => {
    try {
      setLoading(true);
      // Use explicit type assertion to avoid compatibility issues
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data as any)
        .select();
      
      if (error) throw error;
      return result[0] as Record<string, any>;
    } catch (err: any) {
      console.error("Lỗi khi thêm dữ liệu vào Supabase:", err);
      setError(err);
      toast.error(`Lỗi khi thêm dữ liệu: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async <T extends SupabaseData>(id: string, data: Partial<T>): Promise<Record<string, any>> => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data as any)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return result[0] as Record<string, any>;
    } catch (err: any) {
      console.error("Lỗi khi cập nhật dữ liệu trong Supabase:", err);
      setError(err);
      toast.error(`Lỗi khi cập nhật dữ liệu: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error("Lỗi khi xóa dữ liệu từ Supabase:", err);
      setError(err);
      toast.error(`Lỗi khi xóa dữ liệu: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    add,
    update,
    remove,
    loading,
    error,
  };
}

// Define type for auth result
export interface AuthResult {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

/**
 * Hook for managing user authentication
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get current session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    getInitialSession();

    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi đăng nhập: ${err.message}`);
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực.");
      return { data, error: null };
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi đăng ký: ${err.message}`);
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Đã đăng xuất thành công");
    } catch (err: any) {
      setError(err);
      toast.error(`Lỗi đăng xuất: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}
