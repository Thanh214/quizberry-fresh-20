
import React, { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ initialTime, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (remainingTime > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
      <Clock className="h-4 w-4 text-primary" />
      <span className={remainingTime <= 300 ? "text-red-500 font-medium" : ""}>
        {formatTime(remainingTime)}
      </span>
    </div>
  );
};

export default QuizTimer;
