
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface ExamDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

const ExamDescription: React.FC<ExamDescriptionProps> = ({ description, setDescription }) => {
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
      }
    }}>
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
  );
};

export default ExamDescription;
