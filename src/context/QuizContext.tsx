
import React, { createContext, useContext, useEffect } from "react";
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
  startExam: (id: string) => Promise<void>;
  getExamByCode: (code: string) => Exam | undefined;
  getExamById: (id: string) => Exam | undefined;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use all the state hooks
  const questionState = useQuestionState();
  const classState = useClassState();
  const requestState = useRequestState();
  const examState = useExamState();
  const sessionState = useSessionState(() => questionState.questions);

  // Add demo data for testing if no data exists
  useEffect(() => {
    const addDemoData = async () => {
      // Check if there are already questions
      if (questionState.questions.length === 0) {
        // Add sample questions
        const demoQuestions = [
          {
            content: "Thủ đô của Việt Nam là gì?",
            options: [
              { id: "opt1", content: "Hà Nội", isCorrect: true },
              { id: "opt2", content: "Hồ Chí Minh", isCorrect: false },
              { id: "opt3", content: "Đà Nẵng", isCorrect: false },
              { id: "opt4", content: "Huế", isCorrect: false },
            ]
          },
          {
            content: "1 + 1 = ?",
            options: [
              { id: "opt5", content: "1", isCorrect: false },
              { id: "opt6", content: "2", isCorrect: true },
              { id: "opt7", content: "3", isCorrect: false },
              { id: "opt8", content: "4", isCorrect: false },
            ]
          },
          {
            content: "HTML là viết tắt của?",
            options: [
              { id: "opt9", content: "Hyper Text Markup Language", isCorrect: true },
              { id: "opt10", content: "Hyper Transfer Markup Language", isCorrect: false },
              { id: "opt11", content: "High Tech Markup Language", isCorrect: false },
              { id: "opt12", content: "Home Tool Markup Language", isCorrect: false },
            ]
          }
        ];

        for (const q of demoQuestions) {
          await questionState.addQuestion(q);
        }
      }

      // Check if there are already exams
      if (examState.exams.length === 0) {
        // Add a sample exam
        const demoExam = {
          title: "Bài kiểm tra mẫu",
          description: "Đây là bài kiểm tra mẫu để thử nghiệm hệ thống",
          code: "DEMO123",
          duration: 30,
          teacherId: "teacher1",
          isActive: true,
          questionIds: questionState.questions.map(q => q.id),
          hasStarted: false,
        };

        await examState.addExam(demoExam);
      }
    };

    addDemoData();
  }, []);

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
