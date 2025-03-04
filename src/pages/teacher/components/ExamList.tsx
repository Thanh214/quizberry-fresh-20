
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
  isTeacher?: boolean;
}

const ExamList: React.FC<ExamListProps> = ({
  exams,
  participants,
  onEdit,
  onDelete,
  onActivate,
  onStart,
  isTeacher = true
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmStart, setConfirmStart] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<string | null>(null);
  
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
            setConfirmDelete={setConfirmDelete}
            setConfirmStart={setConfirmStart}
            setConfirmToggle={setConfirmToggle}
          />
        ))}
      </div>
      
      <ExamConfirmationDialogs
        confirmDelete={confirmDelete}
        confirmStart={confirmStart}
        confirmToggle={confirmToggle}
        exams={exams}
        onClose={{
          delete: () => setConfirmDelete(null),
          start: () => setConfirmStart(null),
          toggle: () => setConfirmToggle(null)
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
          }
        }}
      />
    </>
  );
};

export default ExamList;
