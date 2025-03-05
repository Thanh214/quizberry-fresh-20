
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Sparkles } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface StartExamButtonProps {
  examId: string;
  isActive: boolean;
  hasStarted: boolean;
  waitingCount: number;
  onStart: (examId: string) => void;
}

const StartExamButton: React.FC<StartExamButtonProps> = ({
  examId,
  isActive,
  hasStarted,
  waitingCount,
  onStart,
}) => {
  // This function handles the direct start of the exam without confirmation
  const handleStartExam = () => {
    onStart(examId);
    toast.success("Bài thi đã bắt đầu", {
      description: `${waitingCount} học sinh bắt đầu làm bài`,
      icon: <Sparkles className="h-4 w-4 text-yellow-400" />,
    });
  };

  if (!isActive || hasStarted || waitingCount <= 0) {
    return null;
  }

  return (
    <motion.div 
      className="mt-4 flex justify-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NeonEffect color="green" padding="p-0" className="rounded-full overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none rounded-full relative overflow-hidden group"
            onClick={handleStartExam}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0 opacity-0 group-hover:opacity-100 animate-shine" />
            <PlayCircle className="h-4 w-4 mr-2" />
            <span>Bắt đầu bài thi</span>
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {waitingCount} học sinh đang chờ
            </span>
          </Button>
        </motion.div>
      </NeonEffect>
    </motion.div>
  );
};

export default StartExamButton;
