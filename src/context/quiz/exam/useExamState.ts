
import { useState } from "react";
import { Exam } from "@/types/models";
import { ExamState, ExamStateActions } from "./types";

/**
 * Hook for managing exam state
 */
export const useExamState = (): ExamState & ExamStateActions => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const storedExams = localStorage.getItem("exams");
    return storedExams ? JSON.parse(storedExams) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for state management
  const addExamToState = (newExam: Exam) => {
    setExams(prev => [...prev, newExam]);
  };
  
  const updateExamInState = (id: string, updatedExam: Exam) => {
    setExams(prev => prev.map(e => e.id === id ? updatedExam : e));
  };
  
  const removeExamFromState = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  return {
    exams,
    setExams,
    isLoading,
    error,
    addExamToState,
    updateExamInState,
    removeExamFromState
  };
};
