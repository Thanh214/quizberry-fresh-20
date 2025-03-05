
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, UserCog, Award, ChevronRight } from "lucide-react";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Hiệu ứng để chuyển hướng người dùng đã xác thực
  React.useEffect(() => {
    // Nếu người dùng đã xác thực, chuyển hướng đến bảng điều khiển thích hợp
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/questions");
      } else if (user?.role === "student") {
        navigate("/student/quiz");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <Layout className="bg-festival-gradient min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden z-0 opacity-20">
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-festival-red opacity-20"></div>
        <div className="absolute right-20 top-20 w-32 h-32 rounded-full bg-festival-gold opacity-30"></div>
        <div className="absolute left-10 top-16 w-24 h-24 rounded-full bg-festival-orange opacity-20"></div>
        <div className="absolute right-1/3 top-32 w-16 h-16 rounded-full bg-festival-pink opacity-20 animate-floating"></div>
      </div>

      {/* Container chính */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] animate-fade-in">
        {/* Logo nâng cao với hiệu ứng */}
        <TransitionWrapper>
          <div className="mb-8 text-center relative">
            <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-festival-gold opacity-20 animate-floating"></div>
            <Logo className="mx-auto transform hover:scale-105 transition-transform duration-300 drop-shadow-lg" />
            <div className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-festival-red/10 text-festival-red border border-festival-red/20">
              <Award className="w-4 h-4 mr-1" /> 
              <span className="text-sm font-medium">Phiên bản Tết 2024</span>
            </div>
          </div>
        </TransitionWrapper>

        {/* Tiêu đề trang với gradient */}
        <TransitionWrapper delay={300}>
          <div className="mb-10 text-center relative">
            <h1 className="text-5xl font-bold mb-3 text-festival-red drop-shadow-sm relative inline-block">
              <span className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-festival-gold opacity-80 animate-pulse"></span>
              EPUTest
              <span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-festival-pink opacity-70"></span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Chọn vai trò của bạn để bắt đầu
            </p>
          </div>
        </TransitionWrapper>

        {/* Thẻ lựa chọn vai trò */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl">
          {/* Thẻ giáo viên */}
          <TransitionWrapper delay={500}>
            <div 
              className="festival-card-red relative overflow-hidden cursor-pointer group"
              onClick={() => navigate("/admin/login")}
            >
              <div className="festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 border-festival-red shadow-sm group-hover:scale-110 transition-transform">
                <UserCog 
                  className="h-8 w-8 text-festival-red" 
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2 text-festival-red">
                Giáo viên
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Đăng nhập để quản lý câu hỏi, lớp học và xem kết quả
              </p>
              <div className="absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:bg-festival-red transition-colors">
                <ChevronRight className="w-5 h-5 text-festival-red group-hover:text-white transition-colors" />
              </div>
            </div>
          </TransitionWrapper>

          {/* Thẻ học sinh */}
          <TransitionWrapper delay={700}>
            <div 
              className="festival-card-gold relative overflow-hidden cursor-pointer group"
              onClick={() => navigate("/student/register")}
            >
              <div className="festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 border-festival-gold shadow-sm group-hover:scale-110 transition-transform">
                <GraduationCap 
                  className="h-8 w-8 text-festival-gold" 
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2 text-festival-gold">
                Học sinh
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Nhập tên và lớp của bạn để tham gia làm bài kiểm tra
              </p>
              <div className="absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:bg-festival-gold transition-colors">
                <ChevronRight className="w-5 h-5 text-festival-gold group-hover:text-white transition-colors" />
              </div>
            </div>
          </TransitionWrapper>
        </div>

        {/* Chân trang với thông tin ứng dụng */}
        <TransitionWrapper delay={900}>
          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p>© 2024 EPUTest - Hệ thống kiểm tra trực tuyến</p>
            <p className="mt-1">Phát triển bởi Lovable</p>
          </div>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default RoleSelection;
