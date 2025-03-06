
import React, { useState } from "react";
import { Exam, ExamParticipant } from "@/types/models";
import ExamCardContainer from "./exam-card/ExamCardContainer";
import ExamCardBackground from "./exam-card/ExamCardBackground";
import ExamCardHeader from "./exam-card/ExamCardHeader";
import ExamCardActions from "./exam-card/ExamCardActions";
import ExamStatistics from "./ExamStatistics";
import ParticipantsList from "./ParticipantsList";
import ExamShareLink from "./ExamShareLink";
import StartExamButton from "./StartExamButton";
import ExamTimer from "./ExamTimer";

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
  onEnd?: (examId: string) => void;
  setConfirmDelete: (examId: string | null) => void;
  setConfirmStart: (examId: string | null) => void;
  setConfirmEnd?: (examId: string | null) => void;
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
  onStart,
  onEnd,
  setConfirmDelete,
  setConfirmStart,
  setConfirmEnd,
  setConfirmToggle,
  participants
}) => {
  const totalParticipants = waitingCount + inProgressCount + completedCount;
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Get border color based on exam status
  const getBorderColor = () => {
    if (exam.hasStarted) return '#ef4444'; // red for started exams
    if (exam.isActive) return '#22c55e'; // green for active exams
    return '#cbd5e1'; // gray for inactive exams
  };
  
  return (
    <ExamCardContainer borderColor={getBorderColor()}>
      {/* Background glow for active/started exams */}
      <ExamCardBackground isActive={exam.isActive} hasStarted={exam.hasStarted} />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <ExamCardHeader exam={exam} />
            <div className="text-sm text-muted-foreground mt-1 truncate">
              Mã bài thi: <span className="font-mono font-medium">{exam.code}</span>
            </div>
          </div>
          
          {isTeacher && (
            <div className="flex-shrink-0">
              <ExamCardActions 
                examId={exam.id}
                isActive={exam.isActive}
                hasStarted={exam.hasStarted}
                onEdit={onEdit}
                setConfirmDelete={setConfirmDelete}
                setConfirmToggle={setConfirmToggle}
              />
            </div>
          )}
        </div>
        
        {/* Description */}
        {exam.description && (
          <div className="mt-3 text-sm text-muted-foreground">
            {exam.description}
          </div>
        )}
        
        {/* Exam timer for active exams */}
        {exam.hasStarted && (
          <div className="mt-3">
            <ExamTimer exam={exam} />
          </div>
        )}
        
        {/* Statistics */}
        <div className="mt-4">
          <ExamStatistics 
            exam={exam}
            waitingCount={waitingCount}
            inProgressCount={inProgressCount}
            completedCount={completedCount}
            totalParticipants={totalParticipants}
          />
        </div>
        
        {/* Share link for active exams */}
        <div className="mt-4">
          <ExamShareLink 
            exam={exam} 
            isActive={exam.isActive} 
            isTeacher={isTeacher} 
          />
        </div>
        
        {/* Action buttons for controlling the exam */}
        <div className="mt-4">
          <StartExamButton 
            examId={exam.id}
            isActive={exam.isActive}
            hasStarted={exam.hasStarted}
            waitingCount={waitingCount}
            onStart={onStart}
            onEnd={onEnd}
            setConfirmStart={setConfirmStart}
            setConfirmEnd={setConfirmEnd}
          />
        </div>

        {/* Student participants section - only shown for teachers */}
        {isTeacher && (
          <div className="mt-4">
            <ParticipantsList
              examId={exam.id}
              participants={participants}
              showParticipants={showParticipants}
              setShowParticipants={setShowParticipants}
              totalParticipants={totalParticipants}
            />
          </div>
        )}
      </div>
    </ExamCardContainer>
  );
};

export default ExamCard;
