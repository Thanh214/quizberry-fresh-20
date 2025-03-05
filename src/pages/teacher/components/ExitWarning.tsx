
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExamParticipant } from '@/types/models';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ExitWarningProps {
  participants: ExamParticipant[];
  examId: string;
}

const ExitWarning: React.FC<ExitWarningProps> = ({ participants, examId }) => {
  // Lọc chỉ những người tham gia có bài thi này và có lịch sử thoát
  const exitParticipants = participants
    .filter(p => p.examId === examId && p.exitCount && p.exitCount > 0)
    .sort((a, b) => ((b.exitCount || 0) - (a.exitCount || 0)));
  
  if (exitParticipants.length === 0) {
    return null;
  }
  
  // Hiển thị badge cảnh báo với số lượng thoát
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium cursor-help">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{exitParticipants.length} thí sinh thoát màn hình</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-0">
          <div className="p-2 max-h-64 overflow-auto">
            <h4 className="font-medium text-sm mb-2">Danh sách thí sinh thoát màn hình:</h4>
            <div className="space-y-1">
              {exitParticipants.map((p) => (
                <div key={p.id} className="text-xs flex justify-between items-center">
                  <span>{p.studentName} ({p.studentId})</span>
                  <span className="font-bold text-red-500">{p.exitCount} lần</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExitWarning;
