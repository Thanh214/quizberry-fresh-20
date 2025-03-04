
import React, { createContext, useContext, useState, useEffect } from "react";
import { Question, Option } from "@/types/models";
import { toast } from "sonner";

// Kiểu dữ liệu cho context
type QuizContextType = {
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt">) => Promise<Question>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lưu câu hỏi vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);

  // Tải danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      // Trong thực tế, đây sẽ là API call
      // Ở đây chúng ta đã tải từ localStorage trong useState
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setIsLoading(false);
      throw error;
    }
  };

  // Thêm câu hỏi mới
  const addQuestion = async (
    question: Omit<Question, "id" | "createdAt">
  ): Promise<Question> => {
    try {
      setIsLoading(true);
      
      // Generate unique IDs for options if they don't have one
      const optionsWithIds = question.options.map((option, index) => ({
        ...option,
        id: option.id || `option-${Date.now()}-${index}`
      }));

      const newQuestion: Question = {
        id: Date.now().toString(),
        content: question.content,
        options: optionsWithIds,
        createdAt: new Date().toISOString(),
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setIsLoading(false);
      
      // Trả về câu hỏi mới để có thể sử dụng
      return newQuestion;
    } catch (error) {
      setError("Failed to add question");
      setIsLoading(false);
      throw error;
    }
  };

  // Cập nhật câu hỏi
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
      };

      setQuestions(updatedQuestions);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to update question");
      setIsLoading(false);
      throw error;
    }
  };

  // Xóa câu hỏi
  const deleteQuestion = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      
      setIsLoading(false);
    } catch (error) {
      setError("Failed to delete question");
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        fetchQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        isLoading,
        error,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
