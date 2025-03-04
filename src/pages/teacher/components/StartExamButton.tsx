
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import { toast } from "sonner";

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
  const handleStartExam = (examId: string) => {
    onStart(examId);
    toast.success("Bài thi đã bắt đầu");
  };

  if (!isActive || hasStarted || waitingCount <= 0) {
    return null;
  }

  return (
    <div className="mt-4 flex justify-end">
      <NeonEffect color="green" padding="p-0" className="rounded-md overflow-hidden">
        <Button
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none"
          onClick={() => handleStartExam(examId)}
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          Bắt đầu bài thi ({waitingCount} học sinh đang chờ)
        </Button>
      </NeonEffect>
    </div>
  );
};

export default StartExamButton;
