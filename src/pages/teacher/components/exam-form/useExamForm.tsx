
import { useState, useEffect } from "react";
import { Exam } from "@/types/models";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseMutation } from "@/hooks/use-supabase";

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
  const { add: addExam, update: updateExam } = useSupabaseMutation("exams");

  const isEditMode = !!initialData?.id;

  // Generate a unique code for new exams
  useEffect(() => {
    if (!isEditMode && !code) {
      // Generate a random alphanumeric code of 6 characters
      const generateUniqueCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;
        let result = '';
        
        do {
          result = 'EPU';
          for (let i = 0; i < codeLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          
          // Kiểm tra xem mã đã tồn tại chưa
          const { data } = await supabase
            .from("exams")
            .select('code')
            .eq('code', result)
            .single();
            
          if (!data) break; // Nếu không tìm thấy, mã là duy nhất
          
        } while (true);
        
        setCode(result);
      };
      
      generateUniqueCode();
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
    
    try {
      // Tạo đường dẫn chia sẻ
      const shareLink = `${window.location.origin}/student/register?code=${code.toUpperCase()}`;
      
      // Submit exam data
      const examData = {
        title,
        description,
        code: code.toUpperCase(),
        duration,
        teacher_id: teacherId,
        is_active: initialData?.isActive || false,
        has_started: initialData?.hasStarted || false,
        share_link: shareLink
      };
      
      await onSubmit(examData as any);
      
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
      console.error(error);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    code,
    setCode,
    duration,
    setDuration,
    isEditMode,
    handleSubmit
  };
};
