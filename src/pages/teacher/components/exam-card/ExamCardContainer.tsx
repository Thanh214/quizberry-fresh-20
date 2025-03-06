
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExamCardContainerProps {
  children: React.ReactNode;
  borderColor?: string;
  className?: string;
}

const ExamCardContainer: React.FC<ExamCardContainerProps> = ({
  children,
  borderColor = "#cbd5e1",
  className
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative p-5 sm:p-6 rounded-xl mb-4 overflow-hidden",
        "backdrop-blur-sm bg-white/60 dark:bg-black/30",
        "border transition-all duration-300",
        className
      )}
      style={{
        borderColor,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 0 2px ${borderColor}33, 0 0 0 1px ${borderColor}20`
      }}
    >
      {children}
    </motion.div>
  );
};

export default ExamCardContainer;
