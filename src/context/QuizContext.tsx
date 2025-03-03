import React, { createContext, useContext, useState } from "react";
import { Question, Option, QuizSession, QuizResult, ShuffledQuestion, Class, QuizRequest } from "@/types/models";

// Define the shape of our context
type QuizContextType = {
  // Quiz and question management
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Promise<Question>; // Fix return type
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  
  // Quiz session management
  startQuiz: (studentName: string, studentId: string, className: string, examId: string) => QuizSession;
  submitAnswer: (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => void;
  finishQuiz: (sessionId: string) => QuizResult;
  getResults: () => QuizResult[];
  currentSession: QuizSession | null;
  
  // Class management (new)
  classes: Class[];
  addClass: (className: string, description?: string) => Promise<void>;
  updateClass: (id: string, data: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  toggleQuizActive: (classId: string, isActive: boolean) => Promise<void>;
  
  // Quiz requests (new)
  quizRequests: QuizRequest[];
  requestQuizAccess: (studentName: string, studentId: string, className: string) => Promise<QuizRequest>;
  approveQuizRequest: (requestId: string) => Promise<void>;
  rejectQuizRequest: (requestId: string) => Promise<void>;
  getPendingRequests: () => QuizRequest[];
  
  // Student verification status (new)
  checkStudentApproval: (studentName: string, className: string) => Promise<"pending" | "approved" | "rejected" | null>;
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

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: "1",
    name: "10A1",
    description: "Lớp 10 chuyên Toán",
    isQuizActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "10A2",
    description: "Lớp 10 chuyên Lý",
    isQuizActive: false,
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
  // State management
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizRequests, setQuizRequests] = useState<QuizRequest[]>([]);

  // Questions management functions
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

  const addQuestion = async (question: Omit<Question, "id" | "createdAt" | "updatedAt">): Promise<Question> => {
    try {
      setIsLoading(true);
      const newQuestion: Question = {
        ...question,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setQuestions((prev) => [...prev, newQuestion]);
      return newQuestion; // Return the created question
    } catch (error) {
      setError("Không thể thêm câu hỏi");
      console.error(error);
      throw error;
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

  // Class management functions (new)
  const addClass = async (className: string, description?: string) => {
    try {
      setIsLoading(true);
      // Create a new class
      const newClass: Class = {
        id: Date.now().toString(),
        name: className,
        description,
        isQuizActive: false, // Default to inactive
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClasses((prev) => [...prev, newClass]);
    } catch (error) {
      setError("Không thể thêm lớp học");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClass = async (id: string, data: Partial<Class>) => {
    try {
      setIsLoading(true);
      setClasses((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...data, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      setError("Không thể cập nhật lớp học");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      setIsLoading(true);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      // Also remove any related quiz requests
      setQuizRequests((prev) => 
        prev.filter((request) => 
          !classes.find((c) => c.id === id && c.name === request.className)
        )
      );
    } catch (error) {
      setError("Không thể xóa lớp học");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuizActive = async (classId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId
            ? { ...c, isQuizActive: isActive, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      setError("Không thể thay đổi trạng thái bài kiểm tra");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quiz request functions (new)
  const requestQuizAccess = async (studentName: string, studentId: string, className: string) => {
    try {
      setIsLoading(true);
      // Check if class exists
      const classExists = classes.find((c) => c.name === className);
      if (!classExists) {
        throw new Error("Lớp học không tồn tại");
      }

      // Check if class is accepting quiz requests
      if (!classExists.isQuizActive) {
        throw new Error("Bài kiểm tra chưa được mở cho lớp này");
      }

      // Create a new request
      const newRequest: QuizRequest = {
        id: Date.now().toString(),
        studentName,
        studentId, // Thêm studentId vào đây
        className,
        status: "pending",
        requestedAt: new Date().toISOString(),
      };
      
      setQuizRequests((prev) => [...prev, newRequest]);
      return newRequest;
    } catch (error) {
      setError((error as Error).message || "Không thể gửi yêu cầu tham gia kiểm tra");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      setQuizRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: "approved" }
            : request
        )
      );
    } catch (error) {
      setError("Không thể phê duyệt yêu cầu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      setQuizRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: "rejected" }
            : request
        )
      );
    } catch (error) {
      setError("Không thể từ chối yêu cầu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPendingRequests = () => {
    return quizRequests.filter((request) => request.status === "pending");
  };

  const checkStudentApproval = async (studentName: string, className: string) => {
    // Find the most recent request for this student and class
    const studentRequests = quizRequests
      .filter(req => req.studentName === studentName && req.className === className)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    
    if (studentRequests.length === 0) {
      return null; // No request found
    }
    
    return studentRequests[0].status; // Return the most recent status
  };

  // Quiz session functions
  const startQuiz = (studentName: string, studentId: string, className: string, examId: string) => {
    // Shuffle questions and options
    const shuffledQuestions: ShuffledQuestion[] = shuffleArray(questions).map((q) => ({
      ...q,
      shuffledOptions: shuffleArray(q.options),
    }));

    const session: QuizSession = {
      id: Date.now().toString(),
      studentName,
      studentId, // Thêm studentId
      className,
      examId, // Thêm examId
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      questions: shuffledQuestions,
      answers: [],
      status: "approved", // Since this is called after approval, set status to approved
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
      studentId: currentSession.studentId, // Thêm studentId
      className: currentSession.className,
      examId: currentSession.examId, // Thêm examId
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
        // New class management values
        classes,
        addClass,
        updateClass,
        deleteClass,
        toggleQuizActive,
        // New quiz request values
        quizRequests,
        requestQuizAccess,
        approveQuizRequest,
        rejectQuizRequest,
        getPendingRequests,
        checkStudentApproval,
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
