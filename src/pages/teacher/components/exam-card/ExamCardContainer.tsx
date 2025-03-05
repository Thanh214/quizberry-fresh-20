
import React from "react";
import Card from "@/components/Card";
import { motion } from "framer-motion";

interface ExamCardContainerProps {
  children: React.ReactNode;
  borderColor: string;
}

const ExamCardContainer: React.FC<ExamCardContainerProps> = ({ children, borderColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="p-5 hover:shadow-lg transition-shadow duration-300 border-l-4 relative overflow-hidden group" 
        style={{ borderLeftColor: borderColor }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default ExamCardContainer;
