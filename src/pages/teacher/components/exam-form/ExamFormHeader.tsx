
import React from "react";
import { motion } from "framer-motion";

interface ExamFormHeaderProps {
  isEditMode: boolean;
}

const ExamFormHeader: React.FC<ExamFormHeaderProps> = ({ isEditMode }) => {
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
      }
    }}>
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
  );
};

export default ExamFormHeader;
