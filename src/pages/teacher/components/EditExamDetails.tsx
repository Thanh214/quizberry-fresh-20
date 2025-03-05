
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";

interface EditExamDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  examCode: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
}

const EditExamDetails: React.FC<EditExamDetailsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  examCode,
  handleSubmit,
  handleCancel,
  isLoading
}) => {
  // Form animation variants
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
        <label className="text-sm font-medium" htmlFor="exam-title">
          Tiêu đề bài thi
        </label>
        <Input
          id="exam-title"
          placeholder="Nhập tiêu đề bài thi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <label className="text-sm font-medium" htmlFor="exam-code">
          Mã bài thi
        </label>
        <Input
          id="exam-code"
          value={examCode}
          readOnly
          disabled
          className="bg-gray-100 transition-all duration-300"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mã bài thi không thể thay đổi sau khi đã tạo
        </p>
      </motion.div>
      
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
          neonColor="blue"
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
          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex justify-between space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-slate-300 transition-all duration-300 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Hủy thay đổi
        </Button>
        
        <NeonEffect 
          color="blue" 
          padding="p-0" 
          className="rounded-md overflow-hidden"
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="border-none w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
            
            {isLoading ? (
              "Đang xử lý..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Xác nhận thay đổi
              </>
            )}
          </Button>
        </NeonEffect>
      </motion.div>
    </motion.form>
  );
};

export default EditExamDetails;
