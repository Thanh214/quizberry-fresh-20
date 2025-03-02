
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, UserCog } from "lucide-react"; // Import icons

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Effect to redirect authenticated users
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
      {/* Main container with enhanced styling */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] animate-fade-in">
        {/* Enhanced logo with animation */}
        <TransitionWrapper>
          <Logo className="mb-12 transform hover:scale-105 transition-transform duration-300" />
        </TransitionWrapper>

        {/* Page title with gradient */}
        <TransitionWrapper delay={300}>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EPUTest
            </h1>
            <p className="text-xl text-muted-foreground">
              Chọn vai trò của bạn để bắt đầu
            </p>
          </div>
        </TransitionWrapper>

        {/* Role selection cards with enhanced styling */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl">
          {/* Teacher card with glassmorphism effect */}
          <TransitionWrapper delay={500}>
            <Card
              className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-primary/20 hover:border-primary/50"
              onClick={() => navigate("/admin/login")}
            >
              <div className="p-5 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 w-fit mx-auto mb-6 group-hover:bg-primary/40 transition-colors">
                <UserCog 
                  className="h-12 w-12 text-primary group-hover:text-primary-foreground transition-colors" 
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-3 group-hover:text-primary transition-colors">
                Giáo viên
              </h2>
              <p className="text-center text-muted-foreground">
                Đăng nhập để quản lý câu hỏi, lớp học và xem kết quả của học sinh
              </p>
              <div className="mt-6 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary group-hover:text-white transition-all">
                  Đăng nhập
                </span>
              </div>
            </Card>
          </TransitionWrapper>

          {/* Student card with glassmorphism effect */}
          <TransitionWrapper delay={700}>
            <Card
              className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-accent/20 hover:border-accent/50"
              onClick={() => navigate("/student/register")}
            >
              <div className="p-5 rounded-full bg-gradient-to-br from-accent/10 to-accent/30 w-fit mx-auto mb-6 group-hover:bg-accent/40 transition-colors">
                <GraduationCap 
                  className="h-12 w-12 text-accent group-hover:text-accent-foreground transition-colors" 
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-3 group-hover:text-accent transition-colors">
                Học sinh
              </h2>
              <p className="text-center text-muted-foreground">
                Nhập tên và lớp của bạn để tham gia làm bài kiểm tra
              </p>
              <div className="mt-6 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium group-hover:bg-accent group-hover:text-white transition-all">
                  Bắt đầu
                </span>
              </div>
            </Card>
          </TransitionWrapper>
        </div>

        {/* Footer with app info */}
        <TransitionWrapper delay={900}>
          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p>© 2023 EPUTest - Hệ thống kiểm tra trực tuyến</p>
            <p className="mt-1">Phát triển bởi Lovable</p>
          </div>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default RoleSelection;
