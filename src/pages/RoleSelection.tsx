
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, UserCog, Award, ChevronRight, Sparkles } from "lucide-react";
import SeasonalEffects from "@/components/SeasonalEffects";
import { motion } from "framer-motion";

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
    <Layout className="overflow-hidden">
      {/* Seasonal Background Effect */}
      <SeasonalEffects intensity="medium" />

      {/* Main container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-[85vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo with enhanced effects */}
        <TransitionWrapper>
          <motion.div 
            className="mb-8 text-center relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-festival-gold opacity-20 animate-float"></div>
            <Logo className="mx-auto transform hover:scale-105 transition-transform duration-300 drop-shadow-lg" />
            <motion.div 
              className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-festival-red/10 text-festival-red border border-festival-red/20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Award className="w-4 h-4 mr-1" /> 
              <span className="text-sm font-medium">Phiên bản Tết 2024</span>
            </motion.div>
          </motion.div>
        </TransitionWrapper>

        {/* Page title with enhanced animations */}
        <TransitionWrapper delay={300}>
          <div className="mb-10 text-center relative">
            <motion.h1 
              className="text-5xl font-bold mb-3 text-festival-red drop-shadow-sm relative inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="absolute -top-6 -left-6 h-5 w-5 text-festival-gold animate-pulse" />
              <span className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-festival-gold opacity-80 animate-pulse"></span>
              EPUTest
              <span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-festival-pink opacity-70"></span>
              <Sparkles className="absolute -bottom-6 -right-6 h-5 w-5 text-festival-pink animate-pulse" />
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Chọn vai trò của bạn để bắt đầu
            </motion.p>
          </div>
        </TransitionWrapper>

        {/* Role selection cards with enhanced animations */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl">
          {/* Teacher card */}
          <TransitionWrapper delay={500}>
            <motion.div 
              className="festival-card-red relative overflow-hidden cursor-pointer group"
              onClick={() => navigate("/admin/login")}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(230, 57, 70, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 border-festival-red shadow-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <UserCog 
                  className="h-8 w-8 text-festival-red" 
                  strokeWidth={1.5}
                />
              </motion.div>
              <h2 className="text-2xl font-semibold text-center mb-2 text-festival-red">
                Giáo viên
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Đăng nhập để quản lý câu hỏi, lớp học và xem kết quả
              </p>
              <motion.div 
                className="absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:bg-festival-red transition-colors"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight className="w-5 h-5 text-festival-red group-hover:text-white transition-colors" />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-festival-red opacity-10"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-festival-pink opacity-10"></div>
            </motion.div>
          </TransitionWrapper>

          {/* Student card */}
          <TransitionWrapper delay={700}>
            <motion.div 
              className="festival-card-gold relative overflow-hidden cursor-pointer group"
              onClick={() => navigate("/student/register")}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(241, 196, 15, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 border-festival-gold shadow-sm"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap 
                  className="h-8 w-8 text-festival-gold" 
                  strokeWidth={1.5}
                />
              </motion.div>
              <h2 className="text-2xl font-semibold text-center mb-2 text-festival-gold">
                Học sinh
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Nhập tên và lớp của bạn để tham gia làm bài kiểm tra
              </p>
              <motion.div 
                className="absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:bg-festival-gold transition-colors"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight className="w-5 h-5 text-festival-gold group-hover:text-white transition-colors" />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-festival-gold opacity-10"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-festival-yellow opacity-10"></div>
            </motion.div>
          </TransitionWrapper>
        </div>

        {/* Footer with enhanced animations */}
        <TransitionWrapper delay={900}>
          <motion.div 
            className="mt-16 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p>© 2024 EPUTest - Hệ thống kiểm tra trực tuyến</p>
            <p className="mt-1">Phát triển bởi Lovable</p>
          </motion.div>
        </TransitionWrapper>
      </motion.div>
    </Layout>
  );
};

export default RoleSelection;
