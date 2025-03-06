
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
      className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="p-4 mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
          <FileQuestion className="h-12 w-12 text-purple-500" />
        </div>
        
        <h3 className="text-xl font-medium mb-2">Chưa có bài thi nào</h3>
        
        <p className="text-muted-foreground mb-6">
          Hãy tạo bài thi đầu tiên của bạn để bắt đầu. Bạn có thể thêm câu hỏi, thiết lập thời gian và chia sẻ bài thi với học viên.
        </p>
        
        <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
          <Button
            onClick={() => navigate("/teacher/create-exam")}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
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
