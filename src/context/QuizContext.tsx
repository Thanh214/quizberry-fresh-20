
import React, { createContext, useContext, useState } from "react";
import { Question, Option, QuizSession, QuizResult, ShuffledQuestion } from "@/types/models";

type QuizContextType = {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  startQuiz: (studentName: string, className: string) => QuizSession;
  submitAnswer: (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => void;
  finishQuiz: (sessionId: string) => QuizResult;
  getResults: () => QuizResult[];
  currentSession: QuizSession | null;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Mock data for initial questions
const mockQuestions: Question[] = [
  {
    id: "1",
    content: "Thủ đô của Việt Nam là gì?",
    options: [
      { id: "1a", content: "Hà Nội", isCorrect: true },
      { id: "1b", content: "Hồ Chí Minh", isCorrect: false },
      { id: "1c", content: "Đà Nẵng", isCorrect: false },
      { id: "1d", content: "Huế", isCorrect: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    content: "1 + 1 = ?",
    options: [
      { id: "2a", content: "1", isCorrect: false },
      { id: "2b", content: "2", isCorrect: true },
      { id: "2c", content: "3", isCorrect: false },
      { id: "2d", content: "4", isCorrect: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    content: "Đâu không phải là một ngôn ngữ lập trình?",
    options: [
      { id: "3a", content: "JavaScript", isCorrect: false },
      { id: "3b", content: "Python", isCorrect: false },
      { id: "3c", content: "HTML", isCorrect: true },
      { id: "3d", content: "Java", isCorrect: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // For now, we'll just use the mock data
      setQuestions(mockQuestions);
      setError(null);
    } catch (error) {
      setError("Không thể tải câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true);
      const newQuestion: Question = {
        ...question,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setQuestions((prev) => [...prev, newQuestion]);
    } catch (error) {
      setError("Không thể thêm câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = async (id: string, questionData: Partial<Question>) => {
    try {
      setIsLoading(true);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
            : q
        )
      );
    } catch (error) {
      setError("Không thể cập nhật câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setIsLoading(true);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      setError("Không thể xóa câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = (studentName: string, className: string) => {
    // Shuffle questions and options
    const shuffledQuestions: ShuffledQuestion[] = shuffleArray(questions).map((q) => ({
      ...q,
      shuffledOptions: shuffleArray(q.options),
    }));

    const session: QuizSession = {
      id: Date.now().toString(),
      studentName,
      className,
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      questions: shuffledQuestions,
      answers: [],
    };

    setCurrentSession(session);
    return session;
  };

  const submitAnswer = (
    sessionId: string,
    questionId: string,
    optionId: string | null,
    timeSpent: number
  ) => {
    if (!currentSession || currentSession.id !== sessionId) return;

    // Find the question
    const questionIndex = currentSession.questions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1) return;

    const question = currentSession.questions[questionIndex];
    
    // Determine if the answer is correct
    const isCorrect = optionId
      ? question.options.find((o) => o.id === optionId)?.isCorrect || false
      : false;

    // Record the answer
    const answer = {
      questionId,
      selectedOptionId: optionId,
      isCorrect,
      timeSpent,
    };

    // Update the session
    const updatedSession = {
      ...currentSession,
      currentQuestionIndex: currentSession.currentQuestionIndex + 1,
      answers: [...currentSession.answers, answer],
    };

    setCurrentSession(updatedSession);
  };

  const finishQuiz = (sessionId: string): QuizResult => {
    if (!currentSession || currentSession.id !== sessionId) {
      throw new Error("Phiên làm bài không hợp lệ");
    }

    // Calculate score
    const correctAnswers = currentSession.answers.filter((a) => a.isCorrect).length;
    const totalQuestions = currentSession.questions.length;
    const score = (correctAnswers / totalQuestions) * 10; // Scale to 10

    // Calculate time metrics
    const totalTime = currentSession.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTimePerQuestion = totalTime / totalQuestions;

    // Create result
    const result: QuizResult = {
      id: sessionId,
      studentName: currentSession.studentName,
      className: currentSession.className,
      score,
      totalQuestions,
      averageTimePerQuestion,
      totalTime,
      submittedAt: new Date().toISOString(),
      answers: currentSession.answers,
    };

    // Save result
    setResults((prev) => [...prev, result]);
    setCurrentSession(null);

    return result;
  };

  const getResults = () => {
    return results;
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        isLoading,
        error,
        fetchQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        startQuiz,
        submitAnswer,
        finishQuiz,
        getResults,
        currentSession,
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
