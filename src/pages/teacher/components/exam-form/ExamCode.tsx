
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ExamCodeProps {
  code: string;
  isEditMode: boolean;
}

const ExamCode: React.FC<ExamCodeProps> = ({ code, isEditMode }) => {
  if (isEditMode) return null;
  
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
      }
    }}>
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
  );
};

export default ExamCode;
