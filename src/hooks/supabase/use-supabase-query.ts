
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableNames, QueryOptions } from "./types";

/**
 * Custom hook to fetch data from Supabase
 */
export function useSupabaseQuery<T>(
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
        
        // Fix excessive type instantiation depth error with explicit casting
        setData(result as T[]);
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
