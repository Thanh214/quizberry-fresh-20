
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ExamTitleProps {
  title: string;
  setTitle: (title: string) => void;
}

const ExamTitle: React.FC<ExamTitleProps> = ({ title, setTitle }) => {
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
      }
    }}>
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
  );
};

export default ExamTitle;
