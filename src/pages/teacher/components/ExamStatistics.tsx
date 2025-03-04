
import React from "react";
import { Exam } from "@/types/models";
import { Clock, Users, Eye } from "lucide-react";
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-blue-500" />
        <span>{exam.duration} phút</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Eye className="h-4 w-4 text-purple-500" />
        <span>{exam.questionIds.length} câu hỏi</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 text-green-500" />
        <span>
          {totalParticipants} thí sinh
          {waitingCount > 0 && (
            <span className="ml-1 text-amber-500">({waitingCount} đang chờ)</span>
          )}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-gray-500" />
        <span>
          {formatDistanceToNow(new Date(exam.createdAt), {
            addSuffix: true,
            locale: vi
          })}
        </span>
      </div>
    </div>
  );
};

export default ExamStatistics;
