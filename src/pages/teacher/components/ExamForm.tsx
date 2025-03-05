
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Exam } from "@/types/models";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import { SaveIcon, ArrowLeft, FilePlus2, CheckCircle } from "lucide-react";

interface ExamFormProps {
  onSubmit: (examData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  teacherId: string;
  isLoading?: boolean;
  initialData?: Partial<Exam>;
}

const ExamForm: React.FC<ExamFormProps> = ({ 
  onSubmit, 
  onCancel, 
  teacherId,
  isLoading = false,
  initialData
}) => {
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

  // Fix the handleSubmit function to use the correct React.FormEvent type
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

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-5"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {isEditMode ? (
            <>
              <span className="text-blue-600 mr-2">✏️</span>
              Chỉnh sửa bài thi
            </>
          ) : (
            <>
              <span className="text-purple-600 mr-2">✨</span>
              Tạo bài thi mới
            </>
          )}
        </h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-sm font-medium" htmlFor="exam-title">
          Tiêu đề bài thi
        </label>
        <Input
          id="exam-title"
          placeholder="Nhập tiêu đề bài thi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />
      </motion.div>
      
      {!isEditMode && (
        <motion.div variants={itemVariants}>
          <label className="text-sm font-medium" htmlFor="exam-code">
            Mã bài thi
          </label>
          <Input
            id="exam-code"
            placeholder="Mã bài thi sẽ được tạo tự động"
            value={code}
            readOnly
            disabled
            className="bg-gray-100 transition-all duration-300"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Mã bài thi được tạo tự động để tránh trùng lặp
          </p>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <label className="text-sm font-medium" htmlFor="exam-description">
          Mô tả bài thi
        </label>
        <Textarea
          id="exam-description"
          placeholder="Nhập mô tả bài thi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          neon
          neonColor="purple"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <label className="text-sm font-medium" htmlFor="exam-duration">
          Thời gian làm bài (phút)
        </label>
        <Input
          id="exam-duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="flex justify-between space-x-3 pt-4"
        onClick={(e) => e.stopPropagation()} // Stop click propagation
      >
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          className="border-slate-300 transition-all duration-300 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isEditMode ? "Hủy" : "Quay lại"}
        </Button>
        
        <NeonEffect 
          color={isEditMode ? "blue" : "purple"} 
          padding="p-0" 
          className="rounded-md overflow-hidden"
        >
          <Button
            type="submit"
            disabled={isLoading}
            onClick={(e) => e.stopPropagation()} // Stop click propagation
            className={`
              border-none w-full relative overflow-hidden group
              ${isEditMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}
            `}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
            
            {isLoading ? (
              "Đang xử lý..."
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </>
                ) : (
                  <>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Tạo bài thi
                  </>
                )}
              </>
            )}
          </Button>
        </NeonEffect>
      </motion.div>
    </motion.form>
  );
};

export default ExamForm;
