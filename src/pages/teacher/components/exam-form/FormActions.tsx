
import React from "react";
import { Button } from "@/components/ui/button";
import NeonEffect from "@/components/NeonEffect";
import { ArrowLeft, FilePlus2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  onCancel: (e: React.MouseEvent) => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditMode, isLoading, onCancel }) => {
  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 24 }
        }
      }} 
      className="flex justify-between space-x-3 pt-4"
      onClick={(e) => e.stopPropagation()} // Stop click propagation
    >
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCancel(e);
        }}
        className="border-slate-300 transition-all duration-300 hover:bg-slate-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isEditMode ? "Hủy" : "Quay lại"}
      </Button>
      
      <NeonEffect 
        color={isEditMode ? "blue" : "purple"} 
        padding="p-0" 
        className="rounded-md overflow-hidden"
      >
        <Button
          type="submit"
          disabled={isLoading}
          onClick={(e) => e.stopPropagation()} // Stop click propagation
          className={`
            border-none w-full relative overflow-hidden group
            ${isEditMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}
          `}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
          
          {isLoading ? (
            "Đang xử lý..."
          ) : (
            <>
              {isEditMode ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Tạo bài thi
                </>
              )}
            </>
          )}
        </Button>
      </NeonEffect>
    </motion.div>
  );
};

export default FormActions;
