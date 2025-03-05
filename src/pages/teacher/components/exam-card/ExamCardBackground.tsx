
import React from "react";
import { motion } from "framer-motion";

interface ExamCardBackgroundProps {
  isActive: boolean;
  hasStarted: boolean;
}

const ExamCardBackground: React.FC<ExamCardBackgroundProps> = ({ isActive, hasStarted }) => {
  // Get background gradient based on exam status
  const getBackgroundGradient = () => {
    if (hasStarted) return 'from-red-600/10 to-transparent';
    if (isActive) return 'from-green-600/10 to-transparent';
    return 'from-slate-400/5 to-transparent';
  };
  
  return (
    <motion.div 
      className={`absolute inset-0 bg-gradient-to-r ${getBackgroundGradient()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default ExamCardBackground;
