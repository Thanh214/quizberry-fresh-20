
import React, { useState } from "react";
import { Exam, ExamParticipant } from "@/types/models";
import NoExams from "./NoExams";
import ExamCard from "./ExamCard";
import ExamConfirmationDialogs from "./ExamConfirmationDialogs";

interface ExamListProps {
  exams: Exam[];
  participants: ExamParticipant[];
  onEdit: (examId: string) => void;
  onDelete: (examId: string) => void;
  onActivate: (examId: string) => void;
  onStart: (examId: string) => void;
  onEnd?: (examId: string) => void;
  isTeacher?: boolean;
  setConfirmEnd?: (examId: string | null) => void;
}

const ExamList: React.FC<ExamListProps> = ({
  exams,
  participants,
  onEdit,
  onDelete,
  onActivate,
  onStart,
  onEnd,
  isTeacher = true,
  setConfirmEnd
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmStart, setConfirmStart] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<string | null>(null);
  const [confirmEndExam, setConfirmEndExam] = useState<string | null>(null);
  
  if (exams.length === 0) {
    return <NoExams />;
  }

  const getWaitingCount = (examId: string) => {
    return participants.filter(p => p.examId === examId && p.status === "waiting").length;
  };

  const getInProgressCount = (examId: string) => {
    return participants.filter(p => p.examId === examId && p.status === "in_progress").length;
  };

  const getCompletedCount = (examId: string) => {
    return participants.filter(p => p.examId === examId && p.status === "completed").length;
  };

  // Handle setting confirmation for ending an exam
  const handleSetConfirmEnd = (examId: string | null) => {
    setConfirmEndExam(examId);
    if (setConfirmEnd) {
      setConfirmEnd(examId);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            waitingCount={getWaitingCount(exam.id)}
            inProgressCount={getInProgressCount(exam.id)}
            completedCount={getCompletedCount(exam.id)}
            isTeacher={isTeacher}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onStart={onStart}
            onEnd={onEnd}
            setConfirmDelete={setConfirmDelete}
            setConfirmStart={setConfirmStart}
            setConfirmToggle={setConfirmToggle}
            setConfirmEnd={handleSetConfirmEnd}
            participants={participants}
          />
        ))}
      </div>
      
      <ExamConfirmationDialogs
        confirmDelete={confirmDelete}
        confirmStart={confirmStart}
        confirmToggle={confirmToggle}
        confirmEnd={confirmEndExam}
        exams={exams}
        onClose={{
          delete: () => setConfirmDelete(null),
          start: () => setConfirmStart(null),
          toggle: () => setConfirmToggle(null),
          end: () => {
            setConfirmEndExam(null);
            if (setConfirmEnd) {
              setConfirmEnd(null);
            }
          }
        }}
        onConfirm={{
          delete: () => {
            if (confirmDelete) {
              onDelete(confirmDelete);
              setConfirmDelete(null);
            }
          },
          start: () => {
            if (confirmStart) {
              onStart(confirmStart);
              setConfirmStart(null);
            }
          },
          toggle: () => {
            if (confirmToggle) {
              onActivate(confirmToggle);
              setConfirmToggle(null);
            }
          },
          end: () => {
            if (confirmEndExam && onEnd) {
              onEnd(confirmEndExam);
              setConfirmEndExam(null);
              if (setConfirmEnd) {
                setConfirmEnd(null);
              }
            }
          }
        }}
      />
    </>
  );
};

export default ExamList;
