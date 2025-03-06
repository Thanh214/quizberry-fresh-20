
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExamList from "./components/ExamList";
import { motion } from "framer-motion";

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={100}>
          <div className="mb-6 relative">
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
            <div className="text-center py-16 border border-dashed rounded-md border-muted glass-effect dark:glass-effect-dark">
              <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">Không tìm thấy bài thi</h3>
              <p className="text-muted-foreground mt-2">
                Không có bài thi nào phù hợp với từ khóa "{searchTerm}"
              </p>
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
