
import React from "react";
import { Exam } from "@/types/models";
import { 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Clock4 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ExitWarning from "./ExitWarning"; // Import component mới
import { useExam } from "@/context/ExamContext"; // Import useExam hook

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
  const { participants } = useExam(); // Lấy danh sách thí sinh

  // Tính phần trăm hoàn thành
  const completionPercentage = totalParticipants > 0
    ? Math.round((completedCount / totalParticipants) * 100)
    : 0;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
          <Clock className="h-3.5 w-3.5" />
          <span>{exam.duration} phút</span>
        </div>
        
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
          <Users className="h-3.5 w-3.5" />
          <span>{totalParticipants} thí sinh</span>
        </div>
        
        {waitingCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium">
            <Clock4 className="h-3.5 w-3.5" />
            <span>{waitingCount} đang chờ</span>
          </div>
        )}
        
        {inProgressCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{inProgressCount} đang làm bài</span>
          </div>
        )}
        
        {completedCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{completedCount} hoàn thành</span>
          </div>
        )}
        
        {/* Thêm component cảnh báo thoát màn hình */}
        <ExitWarning participants={participants} examId={exam.id} />
      </div>
      
      {totalParticipants > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Tiến độ làm bài: {completionPercentage}%</span>
            <span>{completedCount}/{totalParticipants} thí sinh</span>
          </div>
          <Progress value={completionPercentage} className="h-1.5" />
        </div>
      )}
    </div>
  );
};

export default ExamStatistics;
