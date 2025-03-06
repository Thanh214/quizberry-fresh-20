
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { SearchX, PlusCircle, Sparkles, LogOut, BookMarked } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExamList from "./components/ExamList";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { exams, deleteExam, activateExam, startExam, updateExam } = useQuiz();
  const { participants } = useExam();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExams, setFilteredExams] = useState(exams);
  const [confirmEnd, setConfirmEnd] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not teacher
    if (!user || user.role !== "teacher") {
      navigate("/role-selection");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Filter exams by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = exams.filter(
        exam => 
          exam.title.toLowerCase().includes(term) || 
          exam.code.toLowerCase().includes(term) ||
          exam.description?.toLowerCase().includes(term)
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
  }, [exams, searchTerm]);

  const handleCreateExam = () => {
    navigate("/teacher/create-exam");
  };

  const handleEditExam = (examId: string) => {
    // Updated to use the dedicated edit page
    navigate(`/teacher/edit-exam/${examId}`);
  };

  const handleDeleteExam = (examId: string) => {
    deleteExam(examId);
  };

  const handleActivateExam = (examId: string) => {
    activateExam(examId);
  };

  const handleStartExam = (examId: string) => {
    startExam(examId);
  };

  const handleEndExam = (examId: string) => {
    // Mark the exam as ended (not active, not started)
    updateExam(examId, {
      hasStarted: false,
      isActive: false
    });
  };
  
  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công");
    navigate("/role-selection");
  };

  // Button animation variants
  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: { 
      scale: 0.95, 
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <TransitionWrapper>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Quản lý bài thi</h1>
              <p className="text-muted-foreground mt-1">
                Tạo và quản lý các bài thi của bạn
              </p>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
                  <Button
                    onClick={handleCreateExam}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none relative group overflow-hidden w-full sm:w-auto"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
                    
                    <BookMarked className="h-4 w-4 mr-2" />
                    Tạo bài thi mới
                  </Button>
                </NeonEffect>
              </motion.div>
            </div>
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={100}>
          <div className="mb-6">
            <Input
              placeholder="Tìm kiếm bài thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            />
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={200}>
          {filteredExams.length === 0 && searchTerm ? (
            <div className="text-center py-20 border border-dashed rounded-md border-muted">
              <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">Không tìm thấy bài thi</h3>
              <p className="text-muted-foreground mt-2">
                Không có bài thi nào phù hợp với từ khóa "{searchTerm}"
              </p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col items-center max-w-md mx-auto">
                <div className="p-4 mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <BookMarked className="h-12 w-12 text-purple-500" />
                </div>
                
                <h3 className="text-xl font-medium mb-2">Chưa có bài thi nào</h3>
                
                <p className="text-muted-foreground mb-6">
                  Hãy tạo bài thi đầu tiên của bạn để bắt đầu. Bạn có thể thêm câu hỏi, thiết lập thời gian và chia sẻ bài thi với học viên.
                </p>
              </div>
            </div>
          ) : (
            <ExamList
              exams={filteredExams.sort((a, b) => {
                // Sort by active status first (active exams on top)
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;
                // Then sort by created date (newest first)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })}
              participants={participants}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
              onActivate={handleActivateExam}
              onStart={handleStartExam}
              onEnd={handleEndExam}
              setConfirmEnd={setConfirmEnd}
            />
          )}
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default TeacherExams;
