
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { ShuffledQuestion, QuizSession } from "@/types/models";
import { toast } from "@/components/ui/sonner";

const StudentQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startQuiz, questions, submitAnswer, finishQuiz, currentSession } = useQuiz();
  
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ShuffledQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs to track current question index and progress
  const currentIndexRef = useRef(0);
  const totalQuestionsRef = useRef(0);

  useEffect(() => {
    // Check if user is a student
    if (!user || user.role !== "student") {
      navigate("/role-selection");
      return;
    }

    // Check if there are questions
    if (questions.length === 0) {
      toast.error("Không có câu hỏi nào được tìm thấy");
      navigate("/role-selection");
      return;
    }

    // Initialize quiz if not already started
    if (!currentSession) {
      const newSession = startQuiz(user.name || "Học sinh", user.className || "Không xác định");
      setSession(newSession);
      totalQuestionsRef.current = newSession.questions.length;
      
      // Set first question
      if (newSession.questions.length > 0) {
        setCurrentQuestion(newSession.questions[0]);
        setQuestionStartTime(Date.now());
        currentIndexRef.current = 0;
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
  }, [currentSession, navigate, questions, startQuiz, user]);

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
      // End of quiz
      try {
        const result = finishQuiz(session.id);
        navigate("/student/results", { state: { result } });
      } catch (error) {
        toast.error("Lỗi khi hoàn thành bài kiểm tra");
        console.error(error);
      }
    }
  };

  const handleQuit = () => {
    if (window.confirm("Bạn có chắc chắn muốn thoát? Mọi tiến trình sẽ bị mất.")) {
      logout();
      navigate("/role-selection");
    }
  };

  const progressPercentage = totalQuestionsRef.current > 0
    ? (currentIndexRef.current / totalQuestionsRef.current) * 100
    : 0;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={handleQuit}
          >
            Thoát
          </button>
        </header>

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
                  <span>{user?.name}</span>
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
