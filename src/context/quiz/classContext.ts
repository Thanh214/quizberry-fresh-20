
import { Class } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";

export const useClassState = () => {
  const [classes, setClasses] = useState<Class[]>(() => {
    const storedClasses = localStorage.getItem("quizClasses");
    return storedClasses ? JSON.parse(storedClasses) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Class management functions
  const addClass = async (name: string, description?: string) => {
    try {
      setIsLoading(true);
      
      const now = new Date().toISOString();
      const newClass: Class = {
        id: Date.now().toString(),
        name,
        description,
        isQuizActive: false,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedClasses = [...classes, newClass];
      setClasses(updatedClasses);
      localStorage.setItem("quizClasses", JSON.stringify(updatedClasses));
      
      setIsLoading(false);
      toast.success("Thêm lớp học thành công");
    } catch (error) {
      setError("Failed to add class");
      setIsLoading(false);
      throw error;
    }
  };
  
  const updateClass = async (id: string, classData: Partial<Class>) => {
    try {
      setIsLoading(true);
      
      const classIndex = classes.findIndex(c => c.id === id);
      if (classIndex === -1) {
        throw new Error("Class not found");
      }
      
      const updatedClasses = [...classes];
      updatedClasses[classIndex] = {
        ...updatedClasses[classIndex],
        ...classData,
        updatedAt: new Date().toISOString(),
      };
      
      setClasses(updatedClasses);
      localStorage.setItem("quizClasses", JSON.stringify(updatedClasses));
      
      setIsLoading(false);
      toast.success("Cập nhật lớp học thành công");
    } catch (error) {
      setError("Failed to update class");
      setIsLoading(false);
      throw error;
    }
  };
  
  const deleteClass = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      localStorage.setItem("quizClasses", JSON.stringify(updatedClasses));
      
      setIsLoading(false);
      toast.success("Xóa lớp học thành công");
    } catch (error) {
      setError("Failed to delete class");
      setIsLoading(false);
      throw error;
    }
  };
  
  const toggleQuizActive = async (classId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      const classIndex = classes.findIndex(c => c.id === classId);
      if (classIndex === -1) {
        throw new Error("Class not found");
      }
      
      const updatedClasses = [...classes];
      updatedClasses[classIndex] = {
        ...updatedClasses[classIndex],
        isQuizActive: isActive,
        updatedAt: new Date().toISOString(),
      };
      
      setClasses(updatedClasses);
      localStorage.setItem("quizClasses", JSON.stringify(updatedClasses));
      
      setIsLoading(false);
      toast.success(isActive ? "Đã mở bài thi cho lớp" : "Đã đóng bài thi cho lớp");
    } catch (error) {
      setError("Failed to toggle quiz status");
      setIsLoading(false);
      throw error;
    }
  };

  return {
    classes,
    addClass,
    updateClass,
    deleteClass,
    toggleQuizActive,
  };
};
