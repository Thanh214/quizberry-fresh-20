
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

  // Generate a unique exam code
  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
    let result = '';
    
    do {
      result = 'EPU';
      for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // Check if this code already exists
    } while (exams.some(e => e.code === result));
    
    return result;
  };

  // Exam management functions
  const addExam = async (exam: Omit<Exam, "id" | "createdAt" | "updatedAt">): Promise<Exam> => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newExam: Exam = {
        id: Date.now().toString(),
        code: exam.code || generateUniqueCode(),
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        teacherId: exam.teacherId,
        isActive: exam.isActive,
        createdAt: now,
        updatedAt: now,
        questionIds: exam.questionIds,
        hasStarted: false, // Initialize as not started
        shareLink: `${window.location.origin}/student/register?code=${exam.code || generateUniqueCode()}`
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
      const hasStarted = updatedExams[examIndex].hasStarted;
      
      // If the exam has already started and trying to deactivate, show warning
      if (hasStarted && currentActive) {
        toast.warning("Bài thi đã bắt đầu và không thể đóng. Hãy chờ đến khi bài thi kết thúc.");
        setIsLoading(false);
        return;
      }
      
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
      const isActive = updatedExams[examIndex].isActive;
      const hasStarted = updatedExams[examIndex].hasStarted;
      
      // Check if the exam is active
      if (!isActive) {
        toast.error("Không thể bắt đầu bài thi đã đóng. Hãy mở bài thi trước.");
        setIsLoading(false);
        return;
      }
      
      // Check if the exam has already started
      if (hasStarted) {
        toast.info("Bài thi đã bắt đầu.");
        setIsLoading(false);
        return;
      }
      
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

  const endExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) {
        throw new Error("Exam not found");
      }
      
      const updatedExams = [...exams];
      
      // Set the exam as not active and not started
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        hasStarted: false,
        isActive: false,
        updatedAt: new Date().toISOString(),
      };
      
      setExams(updatedExams);
      localStorage.setItem("quizExams", JSON.stringify(updatedExams));
      
      setIsLoading(false);
      toast.success("Bài thi đã kết thúc sớm");
    } catch (error) {
      setError("Failed to end exam");
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
    endExam,
    getExamByCode,
    getExamById,
    isLoading,
    error,
  };
};
