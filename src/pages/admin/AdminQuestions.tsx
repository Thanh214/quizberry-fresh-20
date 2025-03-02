
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { Question } from "@/types/models";
import { toast } from "@/components/ui/sonner";

const AdminQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { questions, fetchQuestions, deleteQuestion } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      navigate("/role-selection");
      return;
    }

    // Fetch questions
    const loadQuestions = async () => {
      try {
        await fetchQuestions();
      } catch (error) {
        toast.error("Không thể tải danh sách câu hỏi");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [fetchQuestions, navigate, user]);

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
      try {
        await deleteQuestion(id);
        toast.success("Xóa câu hỏi thành công");
      } catch (error) {
        toast.error("Không thể xóa câu hỏi");
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/role-selection");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center space-x-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/admin/results")}
            >
              Xem kết quả
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý câu hỏi</h1>
            <button
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/admin/questions/new")}
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Thêm câu hỏi
            </button>
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
            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-lg text-muted-foreground">
                  Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!
                </p>
              </Card>
            ) : (
              questions.map((question, index) => (
                <TransitionWrapper key={question.id} delay={400 + index * 100}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">
                          {index + 1}. {question.content}
                        </h3>
                        <ul className="space-y-2 mb-4">
                          {question.options.map((option) => (
                            <li
                              key={option.id}
                              className={`text-sm ${
                                option.isCorrect
                                  ? "text-green-600 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {option.content}
                              {option.isCorrect && " ✓"}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground">
                          Ngày tạo: {formatDate(question.createdAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-muted-foreground hover:text-primary"
                          onClick={() => navigate(`/admin/questions/edit/${question.id}`)}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
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

export default AdminQuestions;
