import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, UserCog, Award, ChevronRight, Sparkles, Stars } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import NeonEffect from "@/components/NeonEffect";
type Season = "spring" | "summer" | "autumn" | "winter";
const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const cardControlsTeacher = useAnimation();
  const cardControlsStudent = useAnimation();
  const [currentSeason, setCurrentSeason] = useState<Season>(() => {
    const savedSeason = localStorage.getItem('preferred-season') as Season | null;
    return savedSeason || "spring";
  });

  // Listen for season changes throughout the app
  useEffect(() => {
    const handleSeasonChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        season: Season;
      }>;
      setCurrentSeason(customEvent.detail.season);

      // Animate the cards when season changes
      cardControlsTeacher.start({
        scale: [1, 0.95, 1.02, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 0.7,
          ease: "easeInOut"
        }
      });
      cardControlsStudent.start({
        scale: [1, 0.95, 1.02, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 0.7,
          ease: "easeInOut",
          delay: 0.1
        }
      });
    };
    document.addEventListener('seasonchange', handleSeasonChange);
    return () => document.removeEventListener('seasonchange', handleSeasonChange);
  }, [cardControlsTeacher, cardControlsStudent]);

  // Update season from localStorage in case it changes
  useEffect(() => {
    const checkSeason = () => {
      const savedSeason = localStorage.getItem('preferred-season') as Season | null;
      if (savedSeason && savedSeason !== currentSeason) {
        setCurrentSeason(savedSeason);
      }
    };

    // Check immediately and then on focus
    checkSeason();
    window.addEventListener('focus', checkSeason);
    return () => window.removeEventListener('focus', checkSeason);
  }, [currentSeason]);

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
          teacherCard: "festival-card-red bg-gradient-to-br from-pink-50 to-red-100 border-2 border-pink-200/70",
          studentCard: "festival-card-gold bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-200/70",
          teacherIcon: "text-festival-red",
          studentIcon: "text-festival-gold",
          teacherCircle: "border-festival-red",
          studentCircle: "border-festival-gold",
          textTitle: "text-festival-red",
          teacherGlow: "shadow-lg shadow-red-200",
          studentGlow: "shadow-lg shadow-amber-200",
          teacherHover: "hover:shadow-xl hover:shadow-red-300/60 hover:border-red-300",
          studentHover: "hover:shadow-xl hover:shadow-amber-300/60 hover:border-amber-300",
          teacherDecoration: "bg-gradient-to-br from-red-200 to-rose-200 opacity-20",
          studentDecoration: "bg-gradient-to-br from-amber-200 to-yellow-200 opacity-20"
        };
      case "summer":
        return {
          teacherCard: "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200/70",
          studentCard: "bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-200/70",
          teacherIcon: "text-amber-500",
          studentIcon: "text-orange-500",
          teacherCircle: "border-amber-300",
          studentCircle: "border-orange-300",
          textTitle: "text-amber-600",
          teacherGlow: "shadow-lg shadow-amber-200",
          studentGlow: "shadow-lg shadow-orange-200",
          teacherHover: "hover:shadow-xl hover:shadow-amber-300/60 hover:border-amber-300",
          studentHover: "hover:shadow-xl hover:shadow-orange-300/60 hover:border-orange-300",
          teacherDecoration: "bg-gradient-to-br from-amber-200 to-yellow-200 opacity-20",
          studentDecoration: "bg-gradient-to-br from-orange-200 to-amber-200 opacity-20"
        };
      case "autumn":
        return {
          teacherCard: "bg-gradient-to-br from-orange-50 to-red-100 border-2 border-orange-200/70",
          studentCard: "bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200/70",
          teacherIcon: "text-orange-600",
          studentIcon: "text-amber-600",
          teacherCircle: "border-orange-300",
          studentCircle: "border-amber-300",
          textTitle: "text-orange-700",
          teacherGlow: "shadow-lg shadow-orange-200",
          studentGlow: "shadow-lg shadow-amber-200",
          teacherHover: "hover:shadow-xl hover:shadow-orange-300/60 hover:border-orange-300",
          studentHover: "hover:shadow-xl hover:shadow-amber-300/60 hover:border-amber-300",
          teacherDecoration: "bg-gradient-to-br from-orange-200 to-red-200 opacity-20",
          studentDecoration: "bg-gradient-to-br from-amber-200 to-yellow-200 opacity-20"
        };
      case "winter":
        return {
          teacherCard: "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200/70",
          studentCard: "bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200/70",
          teacherIcon: "text-blue-600",
          studentIcon: "text-cyan-600",
          teacherCircle: "border-blue-300",
          studentCircle: "border-cyan-300",
          textTitle: "text-blue-700",
          teacherGlow: "shadow-lg shadow-blue-200",
          studentGlow: "shadow-lg shadow-cyan-200",
          teacherHover: "hover:shadow-xl hover:shadow-blue-300/60 hover:border-blue-300",
          studentHover: "hover:shadow-xl hover:shadow-cyan-300/60 hover:border-cyan-300",
          teacherDecoration: "bg-gradient-to-br from-blue-200 to-indigo-200 opacity-20",
          studentDecoration: "bg-gradient-to-br from-cyan-200 to-blue-200 opacity-20"
        };
    }
  };
  const seasonStyles = getSeasonStyles();

  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0
    },
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
      transition: {
        duration: 0.3
      }
    }
  };
  const itemVariants = {
    initial: {
      y: 20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  const logoVariants = {
    initial: {
      scale: 0.8,
      opacity: 0
    },
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
      transition: {
        duration: 0.5
      }
    }
  };
  const circleVariants = {
    initial: {
      scale: 0.8,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  const titleEffect = {
    initial: {
      opacity: 0,
      y: -20
    },
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
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      transition: {
        duration: 0.5,
        delay: 0.6
      }
    }
  };

  // Season-specific floating decorative elements
  const renderSeasonalDecorations = () => {
    switch (currentSeason) {
      case "spring":
        return <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => <motion.div key={`spring-flower-${i}`} className="absolute w-4 h-4 text-pink-400 opacity-60" initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0
          }} animate={{
            y: window.innerHeight + 20,
            rotate: 360,
            x: (Math.random() - 0.5) * 100 + Math.random() * window.innerWidth
          }} transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 20
          }}>
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,22.2c-5.6,0-10.2-4.6-10.2-10.2S6.4,1.8,12,1.8S22.2,6.4,22.2,12S17.6,22.2,12,22.2z M12,3.8c-4.5,0-8.2,3.7-8.2,8.2 s3.7,8.2,8.2,8.2s8.2-3.7,8.2-8.2S16.5,3.8,12,3.8z" />
                  <path d="M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S14.2,16,12,16z" />
                </svg>
              </motion.div>)}
          </div>;
      case "summer":
        return <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => <motion.div key={`summer-sun-${i}`} className="absolute w-6 h-6 text-amber-400 opacity-60" initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            scale: 0.5
          }} animate={{
            y: window.innerHeight + 20,
            scale: [0.5, 0.8, 0.5],
            x: (Math.random() - 0.5) * 200 + Math.random() * window.innerWidth
          }} transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            scale: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            },
            delay: Math.random() * 15
          }}>
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12,2V4" />
                  <path d="M12,20v2" />
                  <path d="M4.93,4.93l1.41,1.41" />
                  <path d="M17.66,17.66l1.41,1.41" />
                  <path d="M2,12H4" />
                  <path d="M20,12h2" />
                  <path d="M6.34,17.66l-1.41,1.41" />
                  <path d="M19.07,4.93l-1.41,1.41" />
                </svg>
              </motion.div>)}
          </div>;
      case "autumn":
        return <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => <motion.div key={`autumn-leaf-${i}`} className="absolute w-5 h-5 text-orange-500 opacity-60" initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0
          }} animate={{
            y: window.innerHeight + 20,
            rotate: 360,
            x: (Math.random() - 0.5) * 300 + Math.random() * window.innerWidth
          }} transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: [0.1, 0.4, 0.3, 1]
          }}>
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,22.2c-5.6,0-10.2-4.6-10.2-10.2S6.4,1.8,12,1.8S22.2,6.4,22.2,12S17.6,22.2,12,22.2z M12,3.8c-4.5,0-8.2,3.7-8.2,8.2s3.7,8.2,8.2,8.2s8.2-3.7,8.2-8.2S16.5,3.8,12,3.8z" />
                </svg>
              </motion.div>)}
          </div>;
      case "winter":
        return <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => <motion.div key={`winter-snow-${i}`} className="absolute w-2 h-2 bg-white rounded-full opacity-80" initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            scale: Math.random() * 0.5 + 0.5
          }} animate={{
            y: window.innerHeight + 20,
            x: (Math.random() - 0.5) * 100 + Math.random() * window.innerWidth
          }} transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: [0.1, 0.4, 0.3, 1]
          }} />)}
          </div>;
      default:
        return null;
    }
  };
  return <Layout className="overflow-hidden">
      {/* Seasonal decorative elements */}
      {renderSeasonalDecorations()}
      
      {/* Main container */}
      <motion.div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh]" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        {/* Logo with enhanced effects */}
        <motion.div className="mb-8 text-center relative" variants={logoVariants} whileHover="hover">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-festival-gold opacity-20 animate-float"></div>
          <Logo className="mx-auto transform transition-transform duration-300 drop-shadow-lg" />
          <motion.div className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-festival-red/10 text-festival-red border border-festival-red/20" variants={titleEffect}>
            <Award className="w-4 h-4 mr-1" /> 
            <span className="text-sm font-medium">Phiên bản Tết 2024</span>
          </motion.div>
        </motion.div>

        {/* Page title with enhanced animations */}
        <div className="mb-10 text-center relative">
          <motion.h1 className={`text-5xl font-bold mb-3 ${seasonStyles.textTitle} drop-shadow-sm relative inline-block`} variants={titleEffect}>
            <motion.div className="absolute -top-6 -left-6" variants={sparkleVariants}>
              <Sparkles className="h-5 w-5 text-festival-gold animate-pulse" />
            </motion.div>
            <motion.span className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-festival-gold opacity-80 animate-pulse"></motion.span>
            EPUTest
            <motion.span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-festival-pink opacity-70"></motion.span>
            <motion.div className="absolute -bottom-6 -right-6" variants={sparkleVariants}>
              <Sparkles className="h-5 w-5 text-festival-pink animate-pulse" />
            </motion.div>
          </motion.h1>
          <motion.p className="text-xl text-muted-foreground" variants={titleEffect}>
            Chọn vai trò của bạn để bắt đầu
          </motion.p>
        </div>

        {/* Role selection cards with enhanced animations */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl">
          {/* Teacher card */}
          <motion.div className={`${seasonStyles.teacherCard} relative overflow-hidden cursor-pointer group rounded-xl p-4 transition-all duration-500 ${seasonStyles.teacherGlow} ${seasonStyles.teacherHover}`} onClick={() => navigate("/admin/login")} variants={itemVariants} whileHover="hover" whileTap="tap" animate={cardControlsTeacher} key={`teacher-card-${currentSeason}`}>
            <motion.div className={`festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 ${seasonStyles.teacherCircle} shadow-sm`} variants={circleVariants}>
              <UserCog className={`h-8 w-8 ${seasonStyles.teacherIcon}`} strokeWidth={1.5} />
            </motion.div>
            <h2 className={`text-2xl font-semibold text-center mb-2 ${seasonStyles.teacherIcon}`}>Giảng Viên</h2>
            <p className="text-center text-muted-foreground mb-6">
              Đăng nhập để quản lý câu hỏi, lớp học và xem kết quả
            </p>
            <motion.div className={`absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:${seasonStyles.teacherIcon === 'text-festival-red' ? 'bg-festival-red' : 'bg-amber-500'} transition-colors`} whileHover={{
            scale: 1.2,
            rotate: 90
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <ChevronRight className={`w-5 h-5 ${seasonStyles.teacherIcon} group-hover:text-white transition-colors`} />
            </motion.div>
            
            {/* Decorative elements */}
            <div className={`absolute -top-12 -left-12 w-24 h-24 rounded-full ${seasonStyles.teacherDecoration}`}></div>
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full ${seasonStyles.teacherDecoration}`}></div>
          </motion.div>

          {/* Student card */}
          <motion.div className={`${seasonStyles.studentCard} relative overflow-hidden cursor-pointer group rounded-xl p-4 transition-all duration-500 ${seasonStyles.studentGlow} ${seasonStyles.studentHover}`} onClick={() => navigate("/student/register")} variants={itemVariants} whileHover="hover" whileTap="tap" animate={cardControlsStudent} key={`student-card-${currentSeason}`}>
            <motion.div className={`festival-circle w-16 h-16 mx-auto mb-4 bg-white border-2 ${seasonStyles.studentCircle} shadow-sm`} variants={circleVariants}>
              <GraduationCap className={`h-8 w-8 ${seasonStyles.studentIcon}`} strokeWidth={1.5} />
            </motion.div>
            <h2 className={`text-2xl font-semibold text-center mb-2 ${seasonStyles.studentIcon}`}>
              Học sinh
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Nhập tên và lớp của bạn để tham gia làm bài kiểm tra
            </p>
            <motion.div className={`absolute bottom-4 right-4 w-8 h-8 festival-circle bg-white shadow-sm group-hover:${seasonStyles.studentIcon === 'text-festival-gold' ? 'bg-festival-gold' : 'bg-amber-500'} transition-colors`} whileHover={{
            scale: 1.2,
            rotate: 90
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <ChevronRight className={`w-5 h-5 ${seasonStyles.studentIcon} group-hover:text-white transition-colors`} />
            </motion.div>
            
            {/* Decorative elements */}
            <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full ${seasonStyles.studentDecoration}`}></div>
            <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${seasonStyles.studentDecoration}`}></div>
          </motion.div>
        </div>

        {/* Footer with enhanced animations */}
        <motion.div className="mt-16 text-center text-sm text-muted-foreground" variants={itemVariants} transition={{
        delay: 0.8
      }}>
          <p>© 2024 EPUTest - Hệ thống kiểm tra trực tuyến</p>
          <p className="mt-1">Phát triển bởi Lovable</p>
        </motion.div>
      </motion.div>
    </Layout>;
};
export default RoleSelection;