
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ExamDurationProps {
  duration: number;
  setDuration: (duration: number) => void;
}

const ExamDuration: React.FC<ExamDurationProps> = ({ duration, setDuration }) => {
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
      }
    }}>
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
  );
};

export default ExamDuration;
