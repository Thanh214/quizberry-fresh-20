
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { QuizResult } from "@/types/models";

const AdminResults: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getResults } = useQuiz();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      navigate("/role-selection");
      return;
    }

    // Load results
    const loadResults = () => {
      try {
        const quizResults = getResults();
        setResults(quizResults);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [getResults, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate("/role-selection");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) return `${seconds} giây`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center space-x-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/admin/questions")}
            >
              Quản lý câu hỏi
            </button>
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <TransitionWrapper delay={300}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Kết quả bài kiểm tra</h1>
          </div>
        </TransitionWrapper>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-3">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-lg text-muted-foreground">
                  Chưa có kết quả nào được ghi nhận
                </p>
              </Card>
            ) : (
              results.map((result, index) => (
                <TransitionWrapper key={result.id} delay={400 + index * 100}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{result.studentName}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          Lớp: {result.className}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ngày làm bài: {formatDate(result.submittedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end justify-between">
                        <div className="mb-2">
                          <span className="text-2xl font-bold text-primary">
                            {result.score.toFixed(1)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
                            / 10 điểm
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Số câu đúng:</span>{" "}
                            <span className="font-medium">
                              {result.answers.filter((a) => a.isCorrect).length} / {result.totalQuestions}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Thời gian trung bình:</span>{" "}
                            <span className="font-medium">
                              {formatTime(result.averageTimePerQuestion)}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Tổng thời gian:</span>{" "}
                            <span className="font-medium">
                              {formatTime(result.totalTime)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TransitionWrapper>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminResults;
