
import { Question, Option } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";

export const useQuestionState = () => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Question management functions
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      // This would be an API call in a real app
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setIsLoading(false);
      throw error;
    }
  };

  const addQuestion = async (
    question: Omit<Question, "id" | "createdAt" | "updatedAt">
  ): Promise<Question> => {
    try {
      setIsLoading(true);
      
      // Generate unique IDs for options if they don't have one
      const optionsWithIds = question.options.map((option, index) => ({
        ...option,
        id: option.id || `option-${Date.now()}-${index}`
      }));

      const now = new Date().toISOString();
      const newQuestion: Question = {
        id: Date.now().toString(),
        content: question.content,
        options: optionsWithIds,
        createdAt: now,
        updatedAt: now,
        examId: question.examId,
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions));
      
      setIsLoading(false);
      toast.success("Thêm câu hỏi thành công");
      
      return newQuestion;
    } catch (error) {
      setError("Failed to add question");
      setIsLoading(false);
      throw error;
    }
  };

  const updateQuestion = async (id: string, questionUpdate: Partial<Question>) => {
    try {
      setIsLoading(true);
      
      const questionIndex = questions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        throw new Error("Question not found");
      }

      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        ...questionUpdate,
        updatedAt: new Date().toISOString(),
      };

      setQuestions(updatedQuestions);
      localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions));
      
      setIsLoading(false);
      toast.success("Cập nhật câu hỏi thành công");
    } catch (error) {
      setError("Failed to update question");
      setIsLoading(false);
      throw error;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions));
      
      setIsLoading(false);
      toast.success("Xóa câu hỏi thành công");
    } catch (error) {
      setError("Failed to delete question");
      setIsLoading(false);
      throw error;
    }
  };

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
};
