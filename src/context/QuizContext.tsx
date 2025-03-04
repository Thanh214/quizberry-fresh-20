
import React, { createContext, useContext, useState, useEffect } from "react";
import { Question, Option, QuizSession, QuizResult, QuizRequest, Class } from "@/types/models";
import { toast } from "sonner";

// Kiểu dữ liệu cho context
type QuizContextType = {
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Promise<Question>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  
  // Thêm các function cho class management
  classes: Class[];
  addClass: (name: string, description?: string) => Promise<void>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  toggleQuizActive: (classId: string, isActive: boolean) => Promise<void>;
  
  // Thêm các function cho quiz requests
  quizRequests: QuizRequest[];
  approveQuizRequest: (requestId: string) => Promise<void>;
  rejectQuizRequest: (requestId: string) => Promise<void>;
  
  // Thêm các function cho quiz session
  startQuiz: (studentName: string, studentId: string, className: string, examId: string) => QuizSession;
  submitAnswer: (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => void;
  finishQuiz: (sessionId: string) => QuizResult;
  currentSession: QuizSession | null;
  
  // Thêm function cho results
  getResults: () => QuizResult[];
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Thêm state cho class management
  const [classes, setClasses] = useState<Class[]>(() => {
    const storedClasses = localStorage.getItem("quizClasses");
    return storedClasses ? JSON.parse(storedClasses) : [];
  });
  
  // Thêm state cho quiz requests
  const [quizRequests, setQuizRequests] = useState<QuizRequest[]>(() => {
    const storedRequests = localStorage.getItem("quizRequests");
    return storedRequests ? JSON.parse(storedRequests) : [];
  });
  
  // Thêm state cho quiz session
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  
  // Thêm state cho results
  const [results, setResults] = useState<QuizResult[]>(() => {
    const storedResults = localStorage.getItem("quizResults");
    return storedResults ? JSON.parse(storedResults) : [];
  });

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);
  
  useEffect(() => {
    localStorage.setItem("quizClasses", JSON.stringify(classes));
  }, [classes]);
  
  useEffect(() => {
    localStorage.setItem("quizRequests", JSON.stringify(quizRequests));
  }, [quizRequests]);
  
  useEffect(() => {
    localStorage.setItem("quizResults", JSON.stringify(results));
  }, [results]);

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
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setIsLoading(false);
      
      toast.success("Thêm câu hỏi thành công");
      
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
        updatedAt: new Date().toISOString(),
      };

      setQuestions(updatedQuestions);
      setIsLoading(false);
      
      toast.success("Cập nhật câu hỏi thành công");
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
      
      toast.success("Xóa câu hỏi thành công");
    } catch (error) {
      setError("Failed to delete question");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Thêm class mới
  const addClass = async (name: string, description?: string) => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newClass: Class = {
        id: Date.now().toString(),
        name,
        description,
        isQuizActive: false,
        createdAt: now,
        updatedAt: now,
      };
      
      setClasses([...classes, newClass]);
      setIsLoading(false);
      
      toast.success("Thêm lớp học thành công");
    } catch (error) {
      setError("Failed to add class");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Cập nhật class
  const updateClass = async (id: string, classData: Partial<Class>) => {
    try {
      setIsLoading(true);
      
      const classIndex = classes.findIndex(c => c.id === id);
      if (classIndex === -1) {
        throw new Error("Class not found");
      }
      
      const updatedClasses = [...classes];
      updatedClasses[classIndex] = {
        ...updatedClasses[classIndex],
        ...classData,
        updatedAt: new Date().toISOString(),
      };
      
      setClasses(updatedClasses);
      setIsLoading(false);
      
      toast.success("Cập nhật lớp học thành công");
    } catch (error) {
      setError("Failed to update class");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Xóa class
  const deleteClass = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      
      setIsLoading(false);
      
      toast.success("Xóa lớp học thành công");
    } catch (error) {
      setError("Failed to delete class");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Bật/tắt quiz cho một lớp
  const toggleQuizActive = async (classId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      const classIndex = classes.findIndex(c => c.id === classId);
      if (classIndex === -1) {
        throw new Error("Class not found");
      }
      
      const updatedClasses = [...classes];
      updatedClasses[classIndex] = {
        ...updatedClasses[classIndex],
        isQuizActive: isActive,
        updatedAt: new Date().toISOString(),
      };
      
      setClasses(updatedClasses);
      setIsLoading(false);
      
      toast.success(isActive ? "Đã mở bài thi cho lớp" : "Đã đóng bài thi cho lớp");
    } catch (error) {
      setError("Failed to toggle quiz status");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Phê duyệt yêu cầu tham gia quiz
  const approveQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      
      const requestIndex = quizRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new Error("Request not found");
      }
      
      const updatedRequests = [...quizRequests];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        status: "approved",
      };
      
      setQuizRequests(updatedRequests);
      setIsLoading(false);
      
      toast.success("Đã phê duyệt yêu cầu tham gia");
    } catch (error) {
      setError("Failed to approve request");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Từ chối yêu cầu tham gia quiz
  const rejectQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      
      const requestIndex = quizRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new Error("Request not found");
      }
      
      const updatedRequests = [...quizRequests];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        status: "rejected",
      };
      
      setQuizRequests(updatedRequests);
      setIsLoading(false);
      
      toast.success("Đã từ chối yêu cầu tham gia");
    } catch (error) {
      setError("Failed to reject request");
      setIsLoading(false);
      throw error;
    }
  };
  
  // Bắt đầu một quiz session mới
  const startQuiz = (studentName: string, studentId: string, className: string, examId: string): QuizSession => {
    try {
      // Lấy câu hỏi từ bài thi
      const questionsForExam = questions.filter(q => q.examId === examId || !q.examId);
      
      if (questionsForExam.length === 0) {
        throw new Error("Không có câu hỏi nào cho bài thi này");
      }
      
      // Tạo bản sao của các câu hỏi và xáo trộn các tùy chọn
      const shuffledQuestions = questionsForExam.map(q => {
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        return {
          ...q,
          shuffledOptions,
        };
      });
      
      // Tạo quiz session mới
      const newSession: QuizSession = {
        id: Date.now().toString(),
        studentName,
        studentId,
        className,
        examId,
        startedAt: new Date().toISOString(),
        currentQuestionIndex: 0,
        questions: shuffledQuestions,
        answers: [],
      };
      
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      toast.error((error as Error).message || "Không thể bắt đầu bài kiểm tra");
      throw error;
    }
  };
  
  // Gửi câu trả lời cho một câu hỏi
  const submitAnswer = (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => {
    if (!currentSession || currentSession.id !== sessionId) {
      toast.error("Phiên làm bài không hợp lệ");
      return;
    }
    
    try {
      // Tìm câu hỏi
      const question = currentSession.questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error("Câu hỏi không tồn tại");
      }
      
      // Kiểm tra câu trả lời đúng hay sai
      const isCorrect = optionId 
        ? question.options.find(o => o.id === optionId)?.isCorrect || false
        : false;
      
      // Tạo câu trả lời mới
      const answer = {
        questionId,
        selectedOptionId: optionId,
        isCorrect,
        timeSpent,
      };
      
      // Thêm câu trả lời vào session
      const updatedSession = {
        ...currentSession,
        answers: [...currentSession.answers, answer],
        currentQuestionIndex: currentSession.currentQuestionIndex + 1,
      };
      
      setCurrentSession(updatedSession);
    } catch (error) {
      toast.error((error as Error).message || "Không thể gửi câu trả lời");
    }
  };
  
  // Hoàn thành bài kiểm tra
  const finishQuiz = (sessionId: string): QuizResult => {
    if (!currentSession || currentSession.id !== sessionId) {
      toast.error("Phiên làm bài không hợp lệ");
      throw new Error("Invalid quiz session");
    }
    
    try {
      // Tính điểm và các chỉ số khác
      const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
      const totalQuestions = currentSession.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Tính thời gian trung bình cho mỗi câu hỏi
      const totalTimeSpent = currentSession.answers.reduce((total, a) => total + a.timeSpent, 0);
      const averageTimePerQuestion = currentSession.answers.length > 0 
        ? totalTimeSpent / currentSession.answers.length 
        : 0;
      
      // Tạo kết quả
      const result: QuizResult = {
        id: Date.now().toString(),
        studentName: currentSession.studentName,
        studentId: currentSession.studentId,
        className: currentSession.className,
        examId: currentSession.examId,
        score,
        totalQuestions,
        averageTimePerQuestion,
        totalTime: totalTimeSpent,
        submittedAt: new Date().toISOString(),
        answers: currentSession.answers,
      };
      
      // Lưu kết quả
      setResults([...results, result]);
      
      // Xóa phiên hiện tại
      setCurrentSession(null);
      
      return result;
    } catch (error) {
      toast.error((error as Error).message || "Không thể hoàn thành bài kiểm tra");
      throw error;
    }
  };
  
  // Lấy danh sách kết quả
  const getResults = () => {
    return results;
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
        classes,
        addClass,
        updateClass,
        deleteClass,
        toggleQuizActive,
        quizRequests,
        approveQuizRequest,
        rejectQuizRequest,
        startQuiz,
        submitAnswer,
        finishQuiz,
        currentSession,
        getResults,
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
