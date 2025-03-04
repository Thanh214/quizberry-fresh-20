
import React, { createContext, useContext } from "react";
import { useQuestionState } from "./quiz/questionContext";
import { useClassState } from "./quiz/classContext";
import { useRequestState } from "./quiz/requestContext";
import { useExamState } from "./quiz/examContext";
import { useSessionState } from "./quiz/sessionContext";
import { Question, Option, QuizSession, QuizResult, QuizRequest, Class, Exam } from "@/types/models";

// Type for the context
type QuizContextType = {
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Promise<Question>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  
  // Class management
  classes: Class[];
  addClass: (name: string, description?: string) => Promise<void>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  toggleQuizActive: (classId: string, isActive: boolean) => Promise<void>;
  
  // Quiz requests
  quizRequests: QuizRequest[];
  approveQuizRequest: (requestId: string) => Promise<void>;
  rejectQuizRequest: (requestId: string) => Promise<void>;
  
  // Quiz session
  startQuiz: (studentName: string, studentId: string, className: string, examId: string) => QuizSession;
  submitAnswer: (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => void;
  finishQuiz: (sessionId: string) => QuizResult;
  currentSession: QuizSession | null;
  
  // Results
  getResults: () => QuizResult[];

  // Exam management
  exams: Exam[];
  addExam: (exam: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<Exam>;
  updateExam: (id: string, examData: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  activateExam: (id: string) => Promise<void>;
  getExamByCode: (code: string) => Exam | undefined;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use all the state hooks
  const questionState = useQuestionState();
  const classState = useClassState();
  const requestState = useRequestState();
  const examState = useExamState();
  const sessionState = useSessionState(() => questionState.questions);

  // Combine all state and functions into a single context value
  const contextValue: QuizContextType = {
    ...questionState,
    ...classState,
    ...requestState,
    ...examState,
    ...sessionState,
  };

  return (
    <QuizContext.Provider value={contextValue}>
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
