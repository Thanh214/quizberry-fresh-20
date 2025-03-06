
import React from "react";
import { motion } from "framer-motion";
import { FileQuestion, PlusCircle } from "lucide-react";
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
      className="text-center py-12 px-8 border-2 border-dashed border-purple-300/50 dark:border-purple-700/30 rounded-xl glass-effect dark:glass-effect-dark"
    >
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="p-5 mb-6 bg-purple-100/70 dark:bg-purple-900/20 rounded-full shadow-md">
          <FileQuestion className="h-16 w-16 text-purple-500" />
        </div>
        
        <h3 className="text-2xl font-medium mb-3">Chưa có bài thi nào</h3>
        
        <p className="text-muted-foreground mb-8 text-base">
          Hãy tạo bài thi đầu tiên của bạn để bắt đầu. Bạn có thể thêm câu hỏi, thiết lập thời gian và chia sẻ bài thi với học viên.
        </p>
        
        <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
          <Button
            onClick={() => navigate("/teacher/create-exam")}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-base px-6 py-6 h-auto"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" />
            Tạo bài thi mới
          </Button>
        </NeonEffect>
      </div>
    </motion.div>
  );
};

export default NoExams;
