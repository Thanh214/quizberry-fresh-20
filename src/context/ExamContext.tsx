
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Exam, ExamParticipant } from "@/types/models";
import { useQuiz } from "./QuizContext";

type ExamContextType = {
  participants: ExamParticipant[];
  addParticipant: (examId: string, studentName: string, studentId: string, className: string) => Promise<ExamParticipant>;
  updateParticipantStatus: (participantId: string, status: ExamParticipant['status']) => Promise<void>;
  getWaitingParticipants: (examId: string) => ExamParticipant[];
  getExamByCode: (code: string) => Exam | undefined;
  getExamById: (id: string) => Exam | undefined;
  exams: Exam[];
  startExam: (examId: string) => Promise<void>;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { exams, getExamByCode, getExamById, startExam } = useQuiz();
  const [participants, setParticipants] = useState<ExamParticipant[]>(() => {
    const stored = localStorage.getItem("examParticipants");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist participants to localStorage
  useEffect(() => {
    localStorage.setItem("examParticipants", JSON.stringify(participants));
  }, [participants]);

  const addParticipant = async (
    examId: string,
    studentName: string,
    studentId: string,
    className: string
  ): Promise<ExamParticipant> => {
    try {
      // Check if exam exists
      const exam = getExamById(examId);
      if (!exam) {
        throw new Error("Bài thi không tồn tại");
      }
      
      // Check if student is already registered
      const existingParticipant = participants.find(
        p => p.examId === examId && p.studentId === studentId
      );
      
      if (existingParticipant) {
        return existingParticipant;
      }
      
      // Create join link
      const joinLink = `${window.location.origin}/student/waiting?examId=${examId}&studentId=${studentId}`;
      
      // Create new participant
      const newParticipant: ExamParticipant = {
        id: Date.now().toString(),
        examId,
        studentName,
        studentId,
        className,
        status: "waiting",
        startTime: new Date().toISOString(),
        joinLink
      };
      
      setParticipants(prev => [...prev, newParticipant]);
      return newParticipant;
    } catch (error) {
      toast.error((error as Error).message || "Không thể thêm học sinh");
      throw error;
    }
  };

  const updateParticipantStatus = async (
    participantId: string,
    status: ExamParticipant['status']
  ): Promise<void> => {
    try {
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { 
                ...p, 
                status,
                ...(status === "completed" ? { endTime: new Date().toISOString() } : {})
              } 
            : p
        )
      );
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      throw error;
    }
  };

  const getWaitingParticipants = (examId: string): ExamParticipant[] => {
    return participants.filter(p => p.examId === examId && p.status === "waiting");
  };

  return (
    <ExamContext.Provider
      value={{
        participants,
        addParticipant,
        updateParticipantStatus,
        getWaitingParticipants,
        getExamByCode,
        getExamById,
        exams,
        startExam
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
