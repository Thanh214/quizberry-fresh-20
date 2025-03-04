
import React from "react";
import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  studentName?: string;
  studentId?: string;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  studentName,
  studentId,
}) => {
  const progressPercentage = (currentIndex / totalQuestions) * 100;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
            <p className="text-sm font-semibold text-primary">
              Câu {currentIndex + 1}/{totalQuestions}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {studentName && studentId && `${studentName} (${studentId})`}
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium">{Math.round(progressPercentage)}%</span> hoàn thành
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2 bg-muted overflow-hidden relative transition-all"
      >
        <div className="absolute inset-0 flex">
          <div className="h-full w-full bg-gradient-to-r from-primary to-purple-500"></div>
          
          {/* Glowing effect */}
          <div
            className="absolute inset-0 blur-sm opacity-40 bg-gradient-to-r from-primary/70 to-purple-500/70"
            style={{ 
              transform: `translateX(${progressPercentage - 100}%)`,
              transition: 'transform 0.3s ease'
            }}
          />
          
          {/* Moving light trail */}
          <div
            className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ 
              transform: `translateX(${progressPercentage - 40}%)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
      </Progress>
    </div>
  );
};

export default QuizProgress;
