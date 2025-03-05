
import React from "react";
import { Exam } from "@/types/models";
import { Clock, Users, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 mt-4 mb-4">
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="truncate">{exam.duration} phút</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Eye className="h-4 w-4 text-purple-500 flex-shrink-0" />
        <span className="truncate">{exam.questionIds.length} câu hỏi</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md overflow-hidden">
        <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
        <div className="flex flex-wrap items-center truncate">
          <span className="mr-1 whitespace-nowrap">{totalParticipants} thí sinh</span>
          {waitingCount > 0 && (
            <span className="text-amber-500 whitespace-nowrap">({waitingCount} đang chờ)</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm bg-white/30 dark:bg-gray-800/30 p-2 rounded-md">
        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="truncate">
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
