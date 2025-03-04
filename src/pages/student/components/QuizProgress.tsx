
import React from "react";
import TransitionWrapper from "@/components/TransitionWrapper";

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
  studentId
}) => {
  const progressPercentage = totalQuestions > 0
    ? (currentIndex / totalQuestions) * 100
    : 0;

  return (
    <TransitionWrapper delay={200}>
      <div className="mb-6">
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Câu hỏi {currentIndex + 1}/{totalQuestions}
          </span>
          {studentName && studentId && (
            <span>{studentName} - {studentId}</span>
          )}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default QuizProgress;
