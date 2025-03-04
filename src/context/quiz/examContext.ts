
import { Exam } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";

export const useExamState = () => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const storedExams = localStorage.getItem("quizExams");
    return storedExams ? JSON.parse(storedExams) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exam management functions
  const addExam = async (exam: Omit<Exam, "id" | "createdAt" | "updatedAt">): Promise<Exam> => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newExam: Exam = {
        id: Date.now().toString(),
        code: exam.code,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        teacherId: exam.teacherId,
        isActive: exam.isActive,
        createdAt: now,
        updatedAt: now,
        questionIds: exam.questionIds,
        hasStarted: false, // Initialize as not started
        shareLink: `${window.location.origin}/student/register?code=${exam.code}`
      };
      
      const updatedExams = [...exams, newExam];
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success("Thêm bài thi thành công");
      return newExam;
    } catch (error) {
      setError("Failed to add exam");
      setIsLoading(false);
      throw error;
    }
  };
  
  const updateExam = async (id: string, examData: Partial<Exam>) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) {
        throw new Error("Exam not found");
      }
      
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        ...examData,
        updatedAt: new Date().toISOString(),
      };
      
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success("Cập nhật bài thi thành công");
    } catch (error) {
      setError("Failed to update exam");
      setIsLoading(false);
      throw error;
    }
  };
  
  const deleteExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedExams = exams.filter(e => e.id !== id);
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success("Xóa bài thi thành công");
    } catch (error) {
      setError("Failed to delete exam");
      setIsLoading(false);
      throw error;
    }
  };
  
  const activateExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) {
        throw new Error("Exam not found");
      }
      
      const updatedExams = [...exams];
      const currentActive = updatedExams[examIndex].isActive;
      
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        isActive: !currentActive,
        updatedAt: new Date().toISOString(),
      };
      
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success(currentActive ? "Đã đóng bài thi" : "Đã mở bài thi");
    } catch (error) {
      setError("Failed to activate exam");
      setIsLoading(false);
      throw error;
    }
  };

  const startExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) {
        throw new Error("Exam not found");
      }
      
      const updatedExams = [...exams];
      
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        hasStarted: true,
        updatedAt: new Date().toISOString(),
      };
      
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success("Bài thi đã bắt đầu");
    } catch (error) {
      setError("Failed to start exam");
      setIsLoading(false);
      throw error;
    }
  };
  
  const getExamByCode = (code: string) => {
    return exams.find(e => e.code === code);
  };

  const getExamById = (id: string) => {
    return exams.find(e => e.id === id);
  };

  return {
    exams,
    addExam,
    updateExam,
    deleteExam,
    activateExam,
    startExam,
    getExamByCode,
    getExamById,
    isLoading,
    error,
  };
};
