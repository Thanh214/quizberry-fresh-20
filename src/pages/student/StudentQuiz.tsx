
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { ShuffledQuestion, QuizSession } from "@/types/models";
import { toast } from "sonner";
import { useExam } from "@/context/ExamContext";
import QuizTimer from "./components/QuizTimer";
import QuizProgress from "./components/QuizProgress";
import QuizQuestion from "./components/QuizQuestion";
import ConfirmDialog from "./components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import NeonDecoration from "@/components/NeonDecoration";

const StudentQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startQuiz, submitAnswer, finishQuiz, currentSession, exams } = useQuiz();
  
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

    // Get the exam code from user data
    const examCode = user.examCode;
    if (!examCode) {
      toast.error("Không tìm thấy mã bài thi");
      navigate("/student/register");
      return;
    }

    // Find the exam based on the code
    const exam = exams.find(e => e.code === examCode);
    if (!exam) {
      toast.error("Không tìm thấy bài thi");
      navigate("/student/register");
      return;
    }

    // Initialize quiz if not already started
    if (!currentSession) {
      // Ensure we have studentId
      if (!user.studentId) {
        toast.error("Thiếu thông tin sinh viên");
        navigate("/student/waiting");
        return;
      }

      const newSession = startQuiz(
        user.name || "Học sinh", 
        user.studentId || "", 
        user.className || "Không xác định",
        exam.id
      );
      
      setSession(newSession);
      totalQuestionsRef.current = newSession.questions.length;
      
      // Set first question
      if (newSession.questions.length > 0) {
        setCurrentQuestion(newSession.questions[0]);
        setQuestionStartTime(Date.now());
        currentIndexRef.current = 0;
      }

      // Set remaining time from exam duration
      setRemainingTime(exam.duration * 60); // Convert minutes to seconds
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
  }, [currentSession, navigate, startQuiz, user, exams]);

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

  const handleTimeUp = () => {
    handleFinishQuiz();
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen relative">
        {/* Neon decorations */}
        <NeonDecoration color="green" position="bottom-right" size="sm" opacity={0.1} />
        
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center gap-4">
            {/* Đồng hồ đếm ngược */}
            {remainingTime > 0 && (
              <QuizTimer 
                initialTime={remainingTime} 
                onTimeUp={handleTimeUp} 
              />
            )}
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={handleQuit}
            >
              Thoát
            </button>
          </div>
        </header>

        {showLogoutConfirm && (
          <ConfirmDialog
            title="Xác nhận thoát"
            message="Bạn có chắc chắn muốn thoát? Mọi tiến trình làm bài sẽ bị mất."
            cancelText="Hủy"
            confirmText="Xác nhận thoát"
            onCancel={cancelLogout}
            onConfirm={confirmLogout}
          />
        )}

        {confirmSubmit && session && (
          <ConfirmDialog
            title="Xác nhận nộp bài"
            message="Sau khi nộp bài, bạn sẽ không thể quay lại để sửa đổi câu trả lời."
            cancelText="Quay lại làm bài"
            confirmText="Nộp bài"
            onCancel={handleCancelSubmit}
            onConfirm={handleFinishQuiz}
            warning={
              session.answers.length < session.questions.length
                ? `Bạn còn ${session.questions.length - session.answers.length} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?`
                : undefined
            }
          />
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
            <QuizProgress
              currentIndex={currentIndexRef.current}
              totalQuestions={totalQuestionsRef.current}
              studentName={user?.name}
              studentId={user?.studentId}
            />

            {/* Question */}
            <QuizQuestion
              question={currentQuestion}
              questionNumber={currentIndexRef.current + 1}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              isSubmitting={isSubmitting}
            />

            {/* Navigation Buttons */}
            <Button
              className={`ml-auto ${
                selectedOption
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || isSubmitting}
            >
              {currentIndexRef.current + 1 < totalQuestionsRef.current
                ? "Câu tiếp theo"
                : "Hoàn thành"}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentQuiz;
