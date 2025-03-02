
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/questions");
      } else if (user?.role === "student") {
        navigate("/student/quiz");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-12" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <h1 className="text-3xl font-bold text-center mb-8">Chọn vai trò của bạn</h1>
        </TransitionWrapper>

        <div className="grid gap-6 md:grid-cols-2 w-full max-w-lg">
          <TransitionWrapper delay={500}>
            <Card
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate("/admin/login")}
            >
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg
                  className="h-8 w-8 text-primary"
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Giáo viên</h2>
              <p className="text-sm text-center text-muted-foreground">
                Đăng nhập để quản lý câu hỏi và xem kết quả của học sinh
              </p>
            </Card>
          </TransitionWrapper>

          <TransitionWrapper delay={700}>
            <Card
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate("/student/register")}
            >
              <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <svg
                  className="h-8 w-8 text-accent"
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-4-4h-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Học sinh</h2>
              <p className="text-sm text-center text-muted-foreground">
                Nhập tên và lớp của bạn để bắt đầu làm bài kiểm tra
              </p>
            </Card>
          </TransitionWrapper>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;
