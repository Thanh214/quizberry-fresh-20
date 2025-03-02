
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { QuizResult } from "@/types/models";

const StudentResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const result = location.state?.result as QuizResult;

  useEffect(() => {
    // Check if user is a student
    if (!user || user.role !== "student") {
      navigate("/role-selection");
      return;
    }

    // Check if result exists
    if (!result) {
      navigate("/student/quiz");
      return;
    }
  }, [navigate, result, user]);

  const handleFinish = () => {
    logout();
    navigate("/role-selection");
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) return `${seconds} giây`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  if (!result) {
    return null; // Will redirect in useEffect
  }

  const correctAnswers = result.answers.filter((a) => a.isCorrect).length;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-center mb-12">
          <Logo />
        </header>

        <div className="max-w-2xl mx-auto w-full">
          <TransitionWrapper delay={300}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Kết quả bài kiểm tra</h1>
              <p className="text-muted-foreground">
                {result.studentName} - {result.className}
              </p>
            </div>
          </TransitionWrapper>

          <TransitionWrapper delay={500}>
            <Card className="p-8 text-center mb-8">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-75"></div>
                  <div className="relative bg-background rounded-full p-6">
                    <span className="text-5xl font-bold text-gradient">
                      {result.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Điểm số (thang điểm 10)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <div className="text-2xl font-bold text-primary">
                    {correctAnswers}/{result.totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Số câu trả lời đúng</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <div className="text-2xl font-bold text-primary">
                    {formatTime(result.totalTime)}
                  </div>
                  <p className="text-sm text-muted-foreground">Tổng thời gian làm bài</p>
                </div>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <div className="text-xl font-bold text-primary">
                  {formatTime(result.averageTimePerQuestion)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Thời gian trung bình mỗi câu
                </p>
              </div>
            </Card>
          </TransitionWrapper>

          <TransitionWrapper delay={700}>
            <div className="flex justify-center">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleFinish}
              >
                Hoàn thành
              </button>
            </div>
          </TransitionWrapper>
        </div>
      </div>
    </Layout>
  );
};

export default StudentResults;
