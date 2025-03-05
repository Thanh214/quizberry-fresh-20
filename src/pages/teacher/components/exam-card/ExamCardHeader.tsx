
import React from "react";
import { Exam } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ExamCardHeaderProps {
  exam: Exam;
}

const ExamCardHeader: React.FC<ExamCardHeaderProps> = ({ exam }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <h3 className="text-xl font-bold">{exam.title}</h3>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Badge 
          variant={exam.isActive ? "success" : "secondary"} 
          className={`text-xs ${exam.isActive ? 'animate-pulse' : ''}`}
        >
          {exam.isActive ? "Đang mở" : "Đã đóng"}
        </Badge>
      </motion.div>
      {exam.hasStarted && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Badge variant="destructive" className="text-xs animate-pulse">
            Đã bắt đầu
          </Badge>
        </motion.div>
      )}
    </div>
  );
};

export default ExamCardHeader;
