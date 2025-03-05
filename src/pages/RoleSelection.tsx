
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, UserCog, Award, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeonEffect from "@/components/NeonEffect";

type Season = "spring" | "summer" | "autumn" | "winter";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentSeason, setCurrentSeason] = useState<Season>(() => {
    const savedSeason = localStorage.getItem('preferred-season') as Season | null;
    return savedSeason || "spring";
  });

  // Hiệu ứng để chuyển hướng người dùng đã xác thực
  useEffect(() => {
    // Nếu người dùng đã xác thực, chuyển hướng đến bảng điều khiển thích hợp
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/questions");
      } else if (user?.role === "student") {
        navigate("/student/quiz");
      }
    }
  }, [isAuthenticated, navigate, user]);
  
  // Season-specific styling
  const getSeasonStyles = () => {
    switch (currentSeason) {
      case "spring":
        return {
          teacherCard: "festival-card-red",
          studentCard: "festival-card-gold",
          teacherIcon: "text-festival-red",
          studentIcon: "text-festival-gold",
          teacherCircle: "border-festival-red",
          studentCircle: "border-festival-gold", 
          textTitle: "text-festival-red",
        };
      case "summer":
        return {
          teacherCard: "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200/50",
          studentCard: "bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-200/50",
          teacherIcon: "text-amber-500",
          studentIcon: "text-orange-500",
          teacherCircle: "border-amber-300",
          studentCircle: "border-orange-300",
          textTitle: "text-amber-600",
        };
      case "autumn":
        return {
          teacherCard: "bg-gradient-to-br from-orange-50 to-red-100 border-2 border-orange-200/50",
          studentCard: "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200/50",
          teacherIcon: "text-orange-600",
          studentIcon: "text-amber-600",
          teacherCircle: "border-orange-300",
          studentCircle: "border-amber-300",
          textTitle: "text-orange-700",
        };
      case "winter":
        return {
          teacherCard: "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200/50",
          studentCard: "bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200/50",
          teacherIcon: "text-blue-600",
          studentIcon: "text-cyan-600",
          teacherCircle: "border-blue-300",
          studentCircle: "border-cyan-300",
          textTitle: "text-blue-700",
        };
    }
  };
  
  const seasonStyles = getSeasonStyles();
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };
  
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    hover: { 
      y: -5, 
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    exit: { 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };
  
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10,
        delay: 0.2 
      }
    },
    hover: { 
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 0.5 }
    }
  };
  
  const circleVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const titleEffect = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 10,
        delay: 0.4
      }
    }
  };
  
  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      transition: { 
        duration: 0.5,
        delay: 0.6,
      }
    }
  };

  return (
    <Layout className="overflow-hidden">
      {/* Main container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-[85vh]"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Logo with enhanced effects */}
        <motion.div 
          className="mb-8 text-center relative"
          variants={logoVariants}
          whileHover="hover"
        >
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-festival-gold opacity-20 animate-float"></div>
          <Logo className="mx-auto transform transition-transform duration-300 drop-shadow-lg" />
          <motion.div 
            className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-festival-red/10 text-festival-red border border-festival-red/20"
            variants={titleEffect}
          >
            <Award className="w-4 h-4 mr-1" /> 
            <span className="text-sm font-medium">Phiên bản Tết 2024</span>
          </motion.div>
        </motion.div>

        {/* Page title with enhanced animations */}
        <div className="mb-10 text-center relative">
          <motion.h1 
            className={`text-5xl font-bold mb-3 ${seasonStyles.textTitle} drop-shadow-sm relative inline-block`}
            variants={titleEffect}
          >
            <motion.div
              className="absolute -top-6 -left-6"
              variants={sparkleVariants}
            >
              <Sparkles className="h-5 w-5 text-festival-gold animate-pulse" />
            </motion.div>
            <motion.span className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-festival-gold opacity-80 animate-pulse"></motion.span>
            EPUTest
            <motion.span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-festival-pink opacity-70"></motion.span>
            <motion.div
              className="absolute -bottom-6 -right-6"
              variants={sparkleVariants}
            >
              <Sparkles className="h-5 w-5 text-festival-pink animate-pulse" />
            </motion.div>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            variants={titleEffect}
          >
            Chọn vai trò của bạn để bắt đầu
          </motion.p>
        </div>

        {/* Role selection cards with enhanced animations */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl">
          {/* Teacher card */}
          <motion.div 
            className={`${seasonStyles.teacherCard} relative overflow-hidden cursor-pointer group rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-xl`}
            onClick={() => navigate("/admin/login")}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div 
              className={`festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 ${seasonStyles.teacherCircle} shadow-sm`}
              variants={circleVariants}
            >
              <UserCog 
                className={`h-8 w-8 ${seasonStyles.teacherIcon}`}
                strokeWidth={1.5}
              />
            </motion.div>
            <h2 className={`text-2xl font-semibold text-center mb-2 ${seasonStyles.teacherIcon}`}>
              Giáo viên
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Đăng nhập để quản lý câu hỏi, lớp học và xem kết quả
            </p>
            <motion.div 
              className={`absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:${seasonStyles.teacherIcon === 'text-festival-red' ? 'bg-festival-red' : 'bg-amber-500'} transition-colors`}
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronRight className={`w-5 h-5 ${seasonStyles.teacherIcon} group-hover:text-white transition-colors`} />
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-red-200 to-rose-200 opacity-20"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-tr from-pink-200 to-rose-200 opacity-20"></div>
          </motion.div>

          {/* Student card */}
          <motion.div 
            className={`${seasonStyles.studentCard} relative overflow-hidden cursor-pointer group rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-xl`}
            onClick={() => navigate("/student/register")}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div 
              className={`festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 ${seasonStyles.studentCircle} shadow-sm`}
              variants={circleVariants}
            >
              <GraduationCap 
                className={`h-8 w-8 ${seasonStyles.studentIcon}`}
                strokeWidth={1.5}
              />
            </motion.div>
            <h2 className={`text-2xl font-semibold text-center mb-2 ${seasonStyles.studentIcon}`}>
              Học sinh
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Nhập tên và lớp của bạn để tham gia làm bài kiểm tra
            </p>
            <motion.div 
              className={`absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:${seasonStyles.studentIcon === 'text-festival-gold' ? 'bg-festival-gold' : 'bg-amber-500'} transition-colors`}
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronRight className={`w-5 h-5 ${seasonStyles.studentIcon} group-hover:text-white transition-colors`} />
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-yellow-200 to-amber-200 opacity-20"></div>
          </motion.div>
        </div>

        {/* Footer with enhanced animations */}
        <motion.div 
          className="mt-16 text-center text-sm text-muted-foreground"
          variants={itemVariants}
          transition={{ delay: 0.8 }}
        >
          <p>© 2024 EPUTest - Hệ thống kiểm tra trực tuyến</p>
          <p className="mt-1">Phát triển bởi Lovable</p>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default RoleSelection;
