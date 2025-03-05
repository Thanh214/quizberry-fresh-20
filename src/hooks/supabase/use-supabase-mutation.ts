
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { TableNames, SupabaseData } from "./types";

/**
 * Hook for adding/updating/deleting data in Supabase
 */
export function useSupabaseMutation(tableName: TableNames) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const add = async <T extends SupabaseData>(data: T): Promise<Record<string, any>> => {
    try {
      setLoading(true);
      // Cast to any to avoid type compatibility issues
      const dataToInsert = data as any;
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(dataToInsert)
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
      const dataToUpdate = data as any;
      const { data: result, error } = await supabase
        .from(tableName)
        .update(dataToUpdate)
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
