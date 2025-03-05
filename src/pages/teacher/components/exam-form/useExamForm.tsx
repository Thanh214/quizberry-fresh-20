
import { useState, useEffect } from "react";
import { Exam } from "@/types/models";
import { toast } from "sonner";

interface UseExamFormProps {
  initialData?: Partial<Exam>;
  onSubmit: (examData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  teacherId: string;
}

export const useExamForm = ({ initialData, onSubmit, teacherId }: UseExamFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [duration, setDuration] = useState(initialData?.duration || 30); // Default 30 minutes

  const isEditMode = !!initialData?.id;

  // Generate a unique code for new exams
  useEffect(() => {
    if (!isEditMode && !code) {
      // Generate a random alphanumeric code of 6 characters
      const generateUniqueCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;
        let result = '';
        
        for (let i = 0; i < codeLength; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return `EPU${result}`;
      };
      
      setCode(generateUniqueCode());
    }
  }, [isEditMode, code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Add this to prevent event bubbling
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi");
      return;
    }
    
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã bài thi");
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0");
      return;
    }
    
    // Submit exam data
    await onSubmit({
      title,
      description,
      code: code.toUpperCase(),
      duration,
      teacherId,
      isActive: initialData?.isActive || false,
      questionIds: initialData?.questionIds || [],
      hasStarted: initialData?.hasStarted || false,
    });
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    code,
    duration,
    setDuration,
    isEditMode,
    handleSubmit
  };
};
