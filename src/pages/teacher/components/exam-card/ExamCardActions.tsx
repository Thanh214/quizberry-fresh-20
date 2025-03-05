
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";

interface ExamCardActionsProps {
  examId: string;
  isActive: boolean;
  hasStarted: boolean;
  onEdit: (examId: string) => void;
  setConfirmDelete: (examId: string | null) => void;
  setConfirmToggle: (examId: string | null) => void;
}

const ExamCardActions: React.FC<ExamCardActionsProps> = ({
  examId,
  isActive,
  hasStarted,
  onEdit,
  setConfirmDelete,
  setConfirmToggle
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap mt-2 sm:mt-0">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline" 
          size="icon"
          className="text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800 transition-all duration-300"
          onClick={() => onEdit(examId)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="icon"
          className={`
            transition-all duration-300
            ${isActive 
              ? 'text-amber-500 border-amber-200 bg-amber-50 hover:bg-amber-100' 
              : 'text-gray-500 border-gray-200 bg-gray-50 hover:bg-gray-100'}
            ${hasStarted ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => setConfirmToggle(examId)}
          disabled={hasStarted}
          title={hasStarted ? "Không thể đóng bài thi đang diễn ra" : ""}
        >
          {isActive ? (
            <ToggleRight className="h-4 w-4" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline" 
          size="icon"
          className={`
            text-red-500 border-red-200 bg-red-50 hover:bg-red-100 
            transition-all duration-300
            ${hasStarted ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => setConfirmDelete(examId)}
          disabled={hasStarted}
          title={hasStarted ? "Không thể xóa bài thi đang diễn ra" : ""}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ExamCardActions;
