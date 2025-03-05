
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Session, AuthError, User } from "@supabase/supabase-js";

// Định nghĩa các bảng supabase được phép truy cập
export type TableNames = "exams" | "profiles" | "questions" | "quiz_results" | "options" | "exam_participants" | "question_answers" | "quiz_sessions";

/**
 * Custom hook để lấy dữ liệu từ Supabase
 */
export function useSupabaseQuery<T>(
  tableName: TableNames,
  options?: {
    columns?: string;
    eq?: [string, any][];
    order?: [string, "asc" | "desc"];
    limit?: number;
    select?: string;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(tableName).select(options?.select || "*");

        // Thêm điều kiện lọc nếu có
        if (options?.eq) {
          options.eq.forEach(([column, value]) => {
            query = query.eq(column, value);
          });
        }

        // Thêm sắp xếp nếu có
        if (options?.order) {
          const [column, direction] = options.order;
          query = query.order(column, { ascending: direction === "asc" });
        }

        // Thêm giới hạn nếu có
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        
        // Cast to T[] - this assumes that the data returned from Supabase
        // can be safely converted to type T[]
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
 * Hook để thêm/cập nhật/xóa dữ liệu trong Supabase
 */
export function useSupabaseMutation(tableName: TableNames) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const add = async <T extends Record<string, any>>(data: T) => {
    try {
      setLoading(true);
      // Use as any to avoid type constraints - we know what we're doing here
      // since we're passing valid table names as TableNames
      const { data: result, error } = await supabase.from(tableName).insert(data as any).select();
      if (error) throw error;
      return result[0];
    } catch (err: any) {
      console.error("Lỗi khi thêm dữ liệu vào Supabase:", err);
      setError(err);
      toast.error(`Lỗi khi thêm dữ liệu: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async <T extends Record<string, any>>(id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      // Use as any to avoid type constraints
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data as any)
        .eq("id", id)
        .select();
      if (error) throw error;
      return result[0];
    } catch (err: any) {
      console.error("Lỗi khi cập nhật dữ liệu trong Supabase:", err);
      setError(err);
      toast.error(`Lỗi khi cập nhật dữ liệu: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
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

interface AuthResult {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

/**
 * Hook để quản lý xác thực người dùng
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Lấy phiên hiện tại
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    
    getInitialSession();

    // Theo dõi thay đổi trạng thái xác thực
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
