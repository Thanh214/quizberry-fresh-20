
import React from "react";
import { Exam } from "@/types/models";
import { Clock, Users, Eye, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ExamStatisticsProps {
  exam: Exam;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  totalParticipants: number;
}

const ExamStatistics: React.FC<ExamStatisticsProps> = ({ 
  exam, 
  waitingCount, 
  inProgressCount, 
  completedCount, 
  totalParticipants 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 mb-4">
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Hash className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Mã bài thi:</span>
          <span className="font-mono font-medium">{exam.code}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Thời gian:</span>
          <span>{exam.duration} phút</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Eye className="h-4 w-4 text-purple-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Số câu hỏi:</span>
          <span>{exam.questionIds.length} câu hỏi</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Thí sinh:</span>
          <span className="flex flex-wrap items-center">
            <span className="mr-1">{totalParticipants}</span>
            {waitingCount > 0 && (
              <span className="text-amber-500">({waitingCount} đang chờ)</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamStatistics;
