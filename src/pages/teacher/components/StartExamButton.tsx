
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartExamButtonProps {
  examId: string;
  isActive: boolean;
  hasStarted: boolean;
  waitingCount: number;
  onStart: (examId: string) => void;
  onEnd?: (examId: string) => void;
  setConfirmStart?: (examId: string | null) => void;
  setConfirmEnd?: (examId: string | null) => void;
}

const StartExamButton: React.FC<StartExamButtonProps> = ({
  examId,
  isActive,
  hasStarted,
  waitingCount,
  onStart,
  onEnd,
  setConfirmStart,
  setConfirmEnd
}) => {
  // If not active, don't show any button
  if (!isActive) {
    return null;
  }

  // If exam has started, show "End Exam" button
  if (hasStarted && onEnd) {
    return (
      <div className="flex justify-end">
        <Button
          variant="destructive"
          className="gap-2 font-medium transition-all duration-300 hover:scale-105"
          onClick={() => setConfirmEnd && setConfirmEnd(examId)}
        >
          <StopCircle size={16} />
          Kết thúc bài thi
        </Button>
      </div>
    );
  }

  // If exam is active but not started, show "Start Exam" button
  return (
    <div className="flex justify-end">
      <Button
        className={cn(
          "gap-2 bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 hover:scale-105",
          waitingCount === 0 && "opacity-70 cursor-not-allowed"
        )}
        disabled={waitingCount === 0}
        onClick={() => {
          if (waitingCount > 0 && setConfirmStart) {
            setConfirmStart(examId);
          }
        }}
      >
        <PlayCircle size={16} />
        Bắt đầu bài thi
        {waitingCount > 0 && ` (${waitingCount} học viên)`}
      </Button>
    </div>
  );
};

export default StartExamButton;
