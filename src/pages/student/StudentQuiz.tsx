
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { ShuffledQuestion, QuizSession } from "@/types/models";
import { toast } from "sonner";
import { AlertTriangle, Clock } from "lucide-react";
import { useExam } from "@/context/ExamContext";

const StudentQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startQuiz, submitAnswer, finishQuiz, currentSession } = useQuiz();
  const { exams } = useExam();
  
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ShuffledQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Refs to track current question index and progress
  const currentIndexRef = useRef(0);
  const totalQuestionsRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user is a student
    if (!user || user.role !== "student") {
      navigate("/role-selection");
      return;
    }

    // Initialize quiz if not already started
    if (!currentSession) {
      // Đảm bảo có studentId và examId
      if (!user.studentId || !session?.examId) {
        toast.error("Thiếu thông tin sinh viên hoặc bài thi");
        navigate("/student/waiting");
        return;
      }

      const newSession = startQuiz(
        user.name || "Học sinh", 
        user.studentId || "", 
        user.className || "Không xác định",
        session?.examId || ""
      );
      
      setSession(newSession);
      totalQuestionsRef.current = newSession.questions.length;
      
      // Set first question
      if (newSession.questions.length > 0) {
        setCurrentQuestion(newSession.questions[0]);
        setQuestionStartTime(Date.now());
        currentIndexRef.current = 0;
      }

      // Tìm thời gian làm bài từ đề thi
      const exam = exams.find(e => e.id === newSession.examId);
      if (exam) {
        setRemainingTime(exam.duration * 60); // Chuyển phút thành giây
      }
    } else {
      setSession(currentSession);
      totalQuestionsRef.current = currentSession.questions.length;
      
      // Set current question based on session state
      if (currentSession.questions.length > currentSession.currentQuestionIndex) {
        setCurrentQuestion(currentSession.questions[currentSession.currentQuestionIndex]);
        setQuestionStartTime(Date.now());
        currentIndexRef.current = currentSession.currentQuestionIndex;
      }
    }

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSession, navigate, startQuiz, user, exams, session?.examId]);

  // Thiết lập bộ đếm ngược
  useEffect(() => {
    if (remainingTime > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Hết giờ, tự động nộp bài
            if (timerRef.current) clearInterval(timerRef.current);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!session || !currentQuestion) return;
    
    setIsSubmitting(true);
    
    // Calculate time spent on this question
    const timeSpent = Date.now() - questionStartTime;
    
    // Submit answer
    submitAnswer(session.id, currentQuestion.id, selectedOption, timeSpent);
    
    // Move to next question or finish quiz
    if (currentIndexRef.current + 1 < totalQuestionsRef.current) {
      // Next question
      currentIndexRef.current += 1;
      const nextQuestion = session.questions[currentIndexRef.current];
      
      setTimeout(() => {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setQuestionStartTime(Date.now());
        setIsSubmitting(false);
      }, 500); // Short delay for animation
    } else {
      // End of quiz - show confirmation
      setConfirmSubmit(true);
      setIsSubmitting(false);
    }
  };

  const handleFinishQuiz = () => {
    if (!session) return;
    
    try {
      // Kiểm tra xem đã làm hết các câu hỏi chưa
      const unansweredCount = session.questions.length - session.answers.length;
      
      if (unansweredCount > 0 && !window.confirm(`Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?`)) {
        setConfirmSubmit(false);
        return;
      }
      
      const result = finishQuiz(session.id);
      
      // Dừng bộ đếm thời gian
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      navigate("/student/results", { state: { result } });
    } catch (error) {
      toast.error("Lỗi khi hoàn thành bài kiểm tra");
      console.error(error);
    }
  };

  const handleCancelSubmit = () => {
    setConfirmSubmit(false);
  };

  const handleQuit = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Dừng bộ đếm thời gian
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    logout();
    navigate("/role-selection");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const progressPercentage = totalQuestionsRef.current > 0
    ? (currentIndexRef.current / totalQuestionsRef.current) * 100
    : 0;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center gap-4">
            {/* Đồng hồ đếm ngược */}
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 text-primary" />
              <span className={remainingTime <= 300 ? "text-red-500 font-medium" : ""}>
                {formatTime(remainingTime)}
              </span>
            </div>
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={handleQuit}
            >
              Thoát
            </button>
          </div>
        </header>

        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-3">Xác nhận thoát</h3>
              <p className="mb-5 text-muted-foreground">Bạn có chắc chắn muốn thoát? Mọi tiến trình làm bài sẽ bị mất.</p>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-input rounded-md text-sm"
                  onClick={cancelLogout}
                >
                  Hủy
                </button>
                <button 
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm"
                  onClick={confirmLogout}
                >
                  Xác nhận thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmSubmit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-2">Xác nhận nộp bài</h3>
              
              {session && session.answers.length < session.questions.length && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Bạn còn {session.questions.length - session.answers.length} câu hỏi chưa trả lời. 
                    Bạn có chắc chắn muốn nộp bài?
                  </p>
                </div>
              )}
              
              <p className="mb-5 text-muted-foreground">Sau khi nộp bài, bạn sẽ không thể quay lại để sửa đổi câu trả lời.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-input rounded-md text-sm"
                  onClick={handleCancelSubmit}
                >
                  Quay lại làm bài
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                  onClick={handleFinishQuiz}
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        )}

        {!currentQuestion ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-3">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <TransitionWrapper delay={200}>
              <div className="mb-6">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>
                    Câu hỏi {currentIndexRef.current + 1}/{totalQuestionsRef.current}
                  </span>
                  <span>{user?.name} - {user?.studentId}</span>
                </div>
              </div>
            </TransitionWrapper>

            {/* Question */}
            <TransitionWrapper
              delay={300}
              className={`transition-opacity duration-500 ${
                isSubmitting ? "opacity-0" : "opacity-100"
              }`}
            >
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-medium mb-8">
                  {currentIndexRef.current + 1}. {currentQuestion.content}
                </h2>
                <div className="space-y-4">
                  {currentQuestion.shuffledOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-md border cursor-pointer transition-all duration-300 ${
                        selectedOption === option.id
                          ? "bg-primary/10 border-primary"
                          : "bg-background hover:bg-muted/50 border-input"
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            selectedOption === option.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          } mr-3 flex items-center justify-center`}
                        >
                          {selectedOption === option.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>{option.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TransitionWrapper>

            {/* Navigation Buttons */}
            <TransitionWrapper delay={400}>
              <div className="flex justify-end">
                <button
                  className={`inline-flex h-10 items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors 
                    ${
                      selectedOption
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption || isSubmitting}
                >
                  {currentIndexRef.current + 1 < totalQuestionsRef.current
                    ? "Câu tiếp theo"
                    : "Hoàn thành"}
                </button>
              </div>
            </TransitionWrapper>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentQuiz;
