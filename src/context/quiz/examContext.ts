
import { Exam } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseExam } from "@/hooks/use-supabase";

export const useExamState = () => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const storedExams = localStorage.getItem("exams");
    return storedExams ? JSON.parse(storedExams) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for state management with Supabase
  const addExamToState = (newExam: Exam) => {
    setExams(prev => [...prev, newExam]);
  };
  
  const updateExamInState = (id: string, updatedExam: Exam) => {
    setExams(prev => prev.map(e => e.id === id ? updatedExam : e));
  };
  
  const removeExamFromState = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Exam management functions
  const addExam = async (
    exam: Omit<Exam, "id" | "createdAt" | "updatedAt">
  ): Promise<Exam> => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newExam = {
        ...exam,
        created_at: now,
        updated_at: now,
        // Chuyển đổi từ camelCase sang snake_case cho Supabase
        question_ids: exam.questionIds || []
      };

      // Thêm exam vào Supabase
      const { data, error } = await supabase
        .from('exams')
        .insert(newExam)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the snake_case data to camelCase for our model
      const addedExam: Exam = {
        id: data.id,
        code: data.code,
        title: data.title,
        description: data.description,
        duration: data.duration,
        teacherId: data.teacher_id,
        isActive: data.is_active,
        hasStarted: data.has_started,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        questionIds: data.question_ids || [],
        shareLink: data.share_link
      };
      
      // Cập nhật state
      addExamToState(addedExam);
      
      toast.success("Thêm bài thi thành công");
      setIsLoading(false);
      
      return addedExam;
    } catch (error: any) {
      setError("Failed to add exam");
      setIsLoading(false);
      toast.error(`Lỗi khi thêm bài thi: ${error.message}`);
      throw error;
    }
  };

  const updateExam = async (id: string, examData: Partial<Exam>) => {
    try {
      setIsLoading(true);
      
      // Transform camelCase to snake_case for Supabase
      const dbData: any = {
        ...examData,
        updated_at: new Date().toISOString()
      };
      
      // Handle specific field transformations
      if (examData.hasStarted !== undefined) {
        dbData.has_started = examData.hasStarted;
        delete dbData.hasStarted;
      }
      
      if (examData.isActive !== undefined) {
        dbData.is_active = examData.isActive;
        delete dbData.isActive;
      }
      
      if (examData.teacherId !== undefined) {
        dbData.teacher_id = examData.teacherId;
        delete dbData.teacherId;
      }
      
      if (examData.questionIds !== undefined) {
        dbData.question_ids = examData.questionIds;
        delete dbData.questionIds;
      }
      
      if (examData.shareLink !== undefined) {
        dbData.share_link = examData.shareLink;
        delete dbData.shareLink;
      }
      
      // Cập nhật dữ liệu trong Supabase
      const { data, error } = await supabase
        .from('exams')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const supabaseExam = data as SupabaseExam;
      
      // Transform the snake_case data to camelCase for our model
      const updatedExam: Exam = {
        id: supabaseExam.id,
        code: supabaseExam.code,
        title: supabaseExam.title,
        description: supabaseExam.description || "",
        duration: supabaseExam.duration,
        teacherId: supabaseExam.teacher_id || "",
        isActive: supabaseExam.is_active,
        hasStarted: supabaseExam.has_started,
        createdAt: supabaseExam.created_at,
        updatedAt: supabaseExam.updated_at,
        questionIds: supabaseExam.question_ids || [],
        shareLink: supabaseExam.share_link || ""
      };
      
      // Cập nhật state
      updateExamInState(id, updatedExam);
      
      setIsLoading(false);
      toast.success("Cập nhật bài thi thành công");
    } catch (error: any) {
      setError("Failed to update exam");
      setIsLoading(false);
      toast.error(`Lỗi khi cập nhật bài thi: ${error.message}`);
      throw error;
    }
  };

  const deleteExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Xóa trong Supabase
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Xóa khỏi state
      removeExamFromState(id);
      
      setIsLoading(false);
      toast.success("Xóa bài thi thành công");
    } catch (error: any) {
      setError("Failed to delete exam");
      setIsLoading(false);
      toast.error(`Lỗi khi xóa bài thi: ${error.message}`);
      throw error;
    }
  };

  const activateExam = async (id: string) => {
    try {
      await updateExam(id, { isActive: true });
    } catch (error) {
      throw error;
    }
  };

  const startExam = async (id: string) => {
    try {
      await updateExam(id, { hasStarted: true });
    } catch (error) {
      throw error;
    }
  };

  const endExam = async (id: string) => {
    try {
      await updateExam(id, { hasStarted: false, isActive: false });
    } catch (error) {
      throw error;
    }
  };

  const getExamByCode = (code: string) => {
    return exams.find(e => e.code === code);
  };

  const getExamById = (id: string) => {
    return exams.find(e => e.id === id);
  };

  return {
    exams,
    setExams,
    isLoading,
    error,
    addExam,
    updateExam,
    deleteExam,
    activateExam,
    startExam,
    endExam,
    getExamByCode,
    getExamById,
    addExamToState,
    updateExamInState,
    removeExamFromState
  };
};
