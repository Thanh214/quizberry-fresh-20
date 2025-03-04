
import React from "react";
import { Exam, ExamParticipant } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/Card";
import { 
  Clock, 
  Users, 
  PlayCircle, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Link as LinkIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import NeonEffect from "@/components/NeonEffect";
import { toast } from "sonner";

interface ExamCardProps {
  exam: Exam;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  isTeacher: boolean;
  onEdit: (examId: string) => void;
  onDelete: (examId: string) => void;
  onActivate: (examId: string) => void;
  onStart: (examId: string) => void;
  setConfirmDelete: (examId: string | null) => void;
  setConfirmStart: (examId: string | null) => void;
  setConfirmToggle: (examId: string | null) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  waitingCount,
  inProgressCount,
  completedCount,
  isTeacher,
  onEdit,
  onDelete,
  onActivate,
  onStart,
  setConfirmDelete,
  setConfirmStart,
  setConfirmToggle
}) => {
  const totalParticipants = waitingCount + inProgressCount + completedCount;
  
  const copyShareLink = (exam: Exam) => {
    if (exam.shareLink) {
      navigator.clipboard.writeText(exam.shareLink);
      toast.success("Đã sao chép liên kết");
    }
  };

  // This function handles the direct start of the exam without confirmation
  const handleStartExam = (examId: string) => {
    onStart(examId);
    toast.success("Bài thi đã bắt đầu");
  };
  
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow duration-300 border-l-4 relative overflow-hidden group" style={{ borderLeftColor: exam.isActive ? '#22c55e' : '#cbd5e1' }}>
      {/* Background glow for active exams */}
      {exam.isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{exam.title}</h3>
              <Badge variant={exam.isActive ? "success" : "secondary"} className="text-xs">
                {exam.isActive ? "Đang mở" : "Đã đóng"}
              </Badge>
              {exam.hasStarted && (
                <Badge variant="destructive" className="text-xs">
                  Đã bắt đầu
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Mã bài thi: <span className="font-mono font-medium">{exam.code}</span>
            </div>
          </div>
          
          {isTeacher && (
            <div className="flex items-center gap-2">
              {!exam.hasStarted && exam.isActive && (
                <NeonEffect color="green" padding="p-0" className="rounded-full overflow-hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-500 border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-800"
                    onClick={() => setConfirmStart(exam.id)}
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                </NeonEffect>
              )}
              
              <Button 
                variant="outline" 
                size="icon"
                className="text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800"
                onClick={() => onEdit(exam.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="text-amber-500 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-800"
                onClick={() => setConfirmToggle(exam.id)}
              >
                {exam.isActive ? (
                  <ToggleRight className="h-4 w-4" />
                ) : (
                  <ToggleLeft className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="text-red-500 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-800"
                onClick={() => setConfirmDelete(exam.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Description */}
        {exam.description && (
          <div className="mt-3 text-sm text-muted-foreground">
            {exam.description}
          </div>
        )}
        
        {/* Statistics */}
        <ExamStatistics 
          exam={exam}
          waitingCount={waitingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          totalParticipants={totalParticipants}
        />
        
        {/* Share link for active exams */}
        {exam.isActive && exam.shareLink && isTeacher && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-blue-700 dark:text-blue-400">Link tham gia:</span>
              <span className="ml-2 font-mono text-xs truncate max-w-[200px] inline-block align-bottom">
                {exam.shareLink}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-blue-600"
              onClick={() => copyShareLink(exam)}
            >
              <Copy className="h-4 w-4 mr-1" />
              <span className="text-xs">Sao chép</span>
            </Button>
          </div>
        )}
        
        {/* Action buttons for waiting students */}
        {isTeacher && exam.isActive && !exam.hasStarted && waitingCount > 0 && (
          <div className="mt-4 flex justify-end">
            <NeonEffect color="green" padding="p-0" className="rounded-md overflow-hidden">
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none"
                onClick={() => handleStartExam(exam.id)}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Bắt đầu bài thi ({waitingCount} học sinh đang chờ)
              </Button>
            </NeonEffect>
          </div>
        )}
      </div>
    </Card>
  );
};

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

export default ExamCard;
