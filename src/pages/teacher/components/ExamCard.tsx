
import React, { useState } from "react";
import { Exam, ExamParticipant } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/Card";
import { 
  PlayCircle, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
} from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import ExamStatistics from "./ExamStatistics";
import ParticipantsList from "./ParticipantsList";
import ExamShareLink from "./ExamShareLink";
import StartExamButton from "./StartExamButton";

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
  participants: ExamParticipant[];
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  waitingCount,
  inProgressCount,
  completedCount,
  isTeacher,
  onEdit,
  onActivate,
  setConfirmDelete,
  setConfirmStart,
  setConfirmToggle,
  participants
}) => {
  const totalParticipants = waitingCount + inProgressCount + completedCount;
  const [showParticipants, setShowParticipants] = useState(false);
  
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
        <ExamShareLink 
          exam={exam} 
          isActive={exam.isActive} 
          isTeacher={isTeacher} 
        />
        
        {/* Action buttons for waiting students */}
        <StartExamButton 
          examId={exam.id}
          isActive={exam.isActive}
          hasStarted={exam.hasStarted}
          waitingCount={waitingCount}
          onStart={() => setConfirmStart(exam.id)}
        />

        {/* Student participants section - only shown for teachers */}
        {isTeacher && (
          <ParticipantsList
            examId={exam.id}
            participants={participants}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
            totalParticipants={totalParticipants}
          />
        )}
      </div>
    </Card>
  );
};

export default ExamCard;
