import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseExam } from "@/hooks/supabase";
import { Exam } from "@/types/models";
import { ExamActions } from "./types";

/**
 * Hook for exam CRUD operations
 */
export const useExamActions = (
  isLoading: boolean, 
  setIsLoading: (value: boolean) => void,
  setError: (value: string | null) => void,
  addExamToState: (exam: Exam) => void,
  updateExamInState: (id: string, exam: Exam) => void,
  removeExamFromState: (id: string) => void,
  exams: Exam[]
): ExamActions => {

  const addExam = async (
    exam: Omit<Exam, "id" | "createdAt" | "updatedAt">
  ): Promise<Exam> => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      // Include all required fields for Supabase
      const newExam = {
        code: exam.code,
        title: exam.title,
        description: exam.description || "",
        duration: exam.duration,
        teacher_id: exam.teacherId,
        is_active: exam.isActive,
        has_started: exam.hasStarted,
        created_at: now,
        updated_at: now,
        question_ids: JSON.stringify(exam.questionIds || []), // Convert to JSON string
        share_link: exam.shareLink || ""
      };

      // Add exam to Supabase
      const { data, error } = await supabase
        .from('exams')
        .insert(newExam)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the snake_case data to camelCase for our model
      const supabaseExam = data as SupabaseExam;
      const addedExam: Exam = {
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
        questionIds: supabaseExam.question_ids ? JSON.parse(supabaseExam.question_ids) : [], // Parse JSON string
        shareLink: supabaseExam.share_link || ""
      };
      
      // Update state
      addExamToState(addedExam);
      
      toast.success("Thêm bài thi thành công");
      
      return addedExam;
    } catch (error: any) {
      setError("Failed to add exam");
      toast.error(`Lỗi khi thêm bài thi: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
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
        dbData.question_ids = JSON.stringify(examData.questionIds); // Convert to JSON string
        delete dbData.questionIds;
      }
      
      if (examData.shareLink !== undefined) {
        dbData.share_link = examData.shareLink;
        delete dbData.shareLink;
      }
      
      // Update data in Supabase
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
        questionIds: supabaseExam.question_ids ? JSON.parse(supabaseExam.question_ids) : [], // Parse JSON string
        shareLink: supabaseExam.share_link || ""
      };
      
      // Update state
      updateExamInState(id, updatedExam);
      
      toast.success("Cập nhật bài thi thành công");
    } catch (error: any) {
      setError("Failed to update exam");
      toast.error(`Lỗi khi cập nhật bài thi: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from state
      removeExamFromState(id);
      
      toast.success("Xóa bài thi thành công");
    } catch (error: any) {
      setError("Failed to delete exam");
      toast.error(`Lỗi khi xóa bài thi: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
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
    addExam,
    updateExam,
    deleteExam,
    activateExam,
    startExam,
    endExam,
    getExamByCode,
    getExamById
  };
};
