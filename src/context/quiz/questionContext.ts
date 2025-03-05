
import { Question, Option } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useQuestionState = () => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for state management with Supabase
  const addQuestionToState = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
  };
  
  const updateQuestionInState = (id: string, updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
  };
  
  const removeQuestionFromState = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Question management functions
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch questions from Supabase
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          options(*)
        `);
        
      if (error) throw error;
      
      if (data) {
        setQuestions(data as unknown as Question[]);
      }
      
      setIsLoading(false);
    } catch (error: any) {
      setError("Failed to fetch questions");
      setIsLoading(false);
      toast.error(`Lỗi khi tải câu hỏi: ${error.message}`);
      throw error;
    }
  };

  const addQuestion = async (
    question: Omit<Question, "id" | "createdAt" | "updatedAt">
  ): Promise<Question> => {
    try {
      setIsLoading(true);
      
      // Tạo câu hỏi mới trong Supabase
      const now = new Date().toISOString();
      const newQuestionData = {
        content: question.content,
        exam_id: question.examId,
        created_at: now,
        updated_at: now
      };
      
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert(newQuestionData)
        .select()
        .single();
        
      if (questionError) throw questionError;
      
      // Thêm các lựa chọn cho câu hỏi
      const options = question.options || [];
      if (options.length > 0) {
        const optionsData = options.map(option => ({
          content: option.content,
          is_correct: option.isCorrect,
          question_id: questionData.id
        }));
        
        const { error: optionsError } = await supabase
          .from('options')
          .insert(optionsData);
          
        if (optionsError) throw optionsError;
      }
      
      // Fetch lại câu hỏi với options để có dữ liệu đầy đủ
      const { data: fullQuestion, error: fetchError } = await supabase
        .from('questions')
        .select(`
          *,
          options(*)
        `)
        .eq('id', questionData.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newQuestion = {
        ...fullQuestion,
        options: fullQuestion.options.map((opt: any) => ({
          id: opt.id,
          content: opt.content,
          isCorrect: opt.is_correct
        }))
      } as unknown as Question;
      
      // Cập nhật state
      addQuestionToState(newQuestion);
      
      toast.success("Thêm câu hỏi thành công");
      setIsLoading(false);
      
      return newQuestion;
    } catch (error: any) {
      setError("Failed to add question");
      setIsLoading(false);
      toast.error(`Lỗi khi thêm câu hỏi: ${error.message}`);
      throw error;
    }
  };

  const updateQuestion = async (id: string, questionUpdate: Partial<Question>) => {
    try {
      setIsLoading(true);
      
      // Update question in Supabase
      const { error: questionError } = await supabase
        .from('questions')
        .update({
          content: questionUpdate.content,
          exam_id: questionUpdate.examId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (questionError) throw questionError;
      
      // Update options if provided
      if (questionUpdate.options) {
        // First, delete existing options
        const { error: deleteError } = await supabase
          .from('options')
          .delete()
          .eq('question_id', id);
          
        if (deleteError) throw deleteError;
        
        // Then add new options
        const optionsData = questionUpdate.options.map(option => ({
          content: option.content,
          is_correct: option.isCorrect,
          question_id: id
        }));
        
        const { error: optionsError } = await supabase
          .from('options')
          .insert(optionsData);
          
        if (optionsError) throw optionsError;
      }
      
      // Fetch updated question with options
      const { data: updatedQuestion, error: fetchError } = await supabase
        .from('questions')
        .select(`
          *,
          options(*)
        `)
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const formattedQuestion = {
        ...updatedQuestion,
        options: updatedQuestion.options.map((opt: any) => ({
          id: opt.id,
          content: opt.content,
          isCorrect: opt.is_correct
        }))
      } as unknown as Question;
      
      // Update state
      updateQuestionInState(id, formattedQuestion);
      
      toast.success("Cập nhật câu hỏi thành công");
      setIsLoading(false);
    } catch (error: any) {
      setError("Failed to update question");
      setIsLoading(false);
      toast.error(`Lỗi khi cập nhật câu hỏi: ${error.message}`);
      throw error;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete question from Supabase (options will be automatically deleted due to foreign key constraint)
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state
      removeQuestionFromState(id);
      
      toast.success("Xóa câu hỏi thành công");
      setIsLoading(false);
    } catch (error: any) {
      setError("Failed to delete question");
      setIsLoading(false);
      toast.error(`Lỗi khi xóa câu hỏi: ${error.message}`);
      throw error;
    }
  };

  return {
    questions,
    setQuestions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addQuestionToState,
    updateQuestionInState,
    removeQuestionFromState
  };
};
