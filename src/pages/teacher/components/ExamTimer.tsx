
import React, { useState, useEffect } from "react";
import { format, differenceInSeconds } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, TimerOff } from "lucide-react";
import { motion } from "framer-motion";

interface ExamTimerProps {
  exam: {
    duration: number;
    hasStarted: boolean;
    updatedAt: string;
  };
}

const ExamTimer: React.FC<ExamTimerProps> = ({ exam }) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!exam.hasStarted) {
      setRemainingTime(exam.duration * 60); // Convert minutes to seconds
      return;
    }

    // Calculate the end time based on when the exam was started (updatedAt)
    const startTime = new Date(exam.updatedAt);
    const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);
    const now = new Date();

    // Calculate initial remaining time
    const initialRemaining = differenceInSeconds(endTime, now);
    
    if (initialRemaining <= 0) {
      setRemainingTime(0);
      setIsExpired(true);
      return;
    }

    setRemainingTime(initialRemaining);

    // Set up timer
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = differenceInSeconds(endTime, now);
      
      if (remaining <= 0) {
        clearInterval(timer);
        setRemainingTime(0);
        setIsExpired(true);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam.hasStarted, exam.duration, exam.updatedAt]);

  if (remainingTime === null) {
    return null;
  }

  // Format remaining time
  const formatRemainingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculation
  const totalSeconds = exam.duration * 60;
  const elapsedPercent = ((totalSeconds - (remainingTime || 0)) / totalSeconds) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col gap-1 ${exam.hasStarted ? 'block' : 'hidden'}`}
    >
      <div className="flex items-center gap-1.5">
        {isExpired ? (
          <TimerOff className="h-4 w-4 text-red-500" />
        ) : (
          <Clock className={`h-4 w-4 ${
            remainingTime && remainingTime < 300 ? 'text-red-500 animate-pulse' : 'text-blue-500'
          }`} />
        )}
        <span className={`font-mono font-medium ${
          isExpired ? 'text-red-500' : 
          (remainingTime && remainingTime < 300 ? 'text-red-500 animate-pulse' : '')
        }`}>
          {isExpired ? "Hết giờ" : formatRemainingTime(remainingTime || 0)}
        </span>
      </div>
      
      {exam.hasStarted && !isExpired && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${
              remainingTime && remainingTime < 300 
                ? 'bg-red-500' 
                : 'bg-blue-500'
            }`}
            initial={{ width: "0%" }}
            animate={{ width: `${elapsedPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ExamTimer;
