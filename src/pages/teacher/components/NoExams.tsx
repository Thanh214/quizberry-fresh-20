
import React from "react";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NeonEffect from "@/components/NeonEffect";

const NoExams: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/70 dark:bg-gray-900/30 backdrop-blur-md"
    >
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="p-4 mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
          <BookMarked className="h-12 w-12 text-purple-500" />
        </div>
        
        <h3 className="text-xl font-medium mb-2">Chưa có bài thi nào</h3>
        
        <p className="text-muted-foreground mb-6">
          Hãy tạo bài thi đầu tiên của bạn để bắt đầu. Bạn có thể thêm câu hỏi, thiết lập thời gian và chia sẻ bài thi với học viên.
        </p>
        
        <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
          <Button
            onClick={() => navigate("/teacher/create-exam")}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none relative group overflow-hidden"
            size="lg"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
            
            <BookMarked className="h-5 w-5" />
            Tạo bài thi mới
          </Button>
        </NeonEffect>
      </div>
    </motion.div>
  );
};

export default NoExams;
