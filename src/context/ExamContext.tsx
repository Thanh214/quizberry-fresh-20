
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Exam, ExamParticipant } from "@/types/models";
import { useQuiz } from "./QuizContext";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery, useSupabaseMutation } from "@/hooks/use-supabase";
import { useAuth } from "./AuthContext";

type ExamContextType = {
  participants: ExamParticipant[];
  addParticipant: (examId: string, studentName: string, studentId: string, className: string) => Promise<ExamParticipant>;
  updateParticipantStatus: (participantId: string, status: ExamParticipant['status']) => Promise<void>;
  getWaitingParticipants: (examId: string) => ExamParticipant[];
  getExamByCode: (code: string) => Exam | undefined;
  getExamById: (id: string) => Exam | undefined;
  exams: Exam[];
  startExam: (examId: string) => Promise<void>;
  endExam: (examId: string) => Promise<void>;
  recordExamExit: (participantId: string) => Promise<void>;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { exams, getExamByCode, getExamById, startExam, endExam } = useQuiz();
  const { user } = useAuth();
  const { data: participantsData, loading: participantsLoading } = useSupabaseQuery<ExamParticipant>('exam_participants');
  
  const [participants, setParticipants] = useState<ExamParticipant[]>([]);
  const { add: addParticipantMutation, update: updateParticipantMutation } = useSupabaseMutation('exam_participants');

  // Cập nhật participants từ Supabase khi dữ liệu thay đổi
  useEffect(() => {
    if (!participantsLoading && participantsData) {
      setParticipants(participantsData);
    }
  }, [participantsData, participantsLoading]);

  // Thiết lập realtime subscription cho bảng exam_participants
  useEffect(() => {
    const subscription = supabase
      .channel('public:exam_participants')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'exam_participants' 
      }, (payload) => {
        // Cập nhật danh sách participants khi có thay đổi
        if (payload.eventType === 'INSERT') {
          setParticipants(prev => [...prev, payload.new as ExamParticipant]);
        } else if (payload.eventType === 'UPDATE') {
          setParticipants(prev => 
            prev.map(p => p.id === payload.new.id ? (payload.new as ExamParticipant) : p)
          );
        } else if (payload.eventType === 'DELETE') {
          setParticipants(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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
      
      // Kiểm tra xem học sinh đã đăng ký chưa
      const existingParticipant = participants.find(
        p => p.examId === examId && p.studentId === studentId
      );
      
      if (existingParticipant) {
        return existingParticipant;
      }
      
      // Tạo link tham gia
      const joinLink = `${window.location.origin}/student/waiting?examId=${examId}&studentId=${studentId}`;
      
      // Tạo participant mới trong Supabase
      const newParticipant: Omit<ExamParticipant, "id"> = {
        examId,
        studentName,
        studentId,
        className,
        status: "waiting",
        startTime: new Date().toISOString(),
        joinLink,
        exitCount: 0,
        user_id: user?.id
      };
      
      const result = await addParticipantMutation(newParticipant);
      
      return result as ExamParticipant;
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm học sinh");
      throw error;
    }
  };

  const updateParticipantStatus = async (
    participantId: string,
    status: ExamParticipant['status']
  ): Promise<void> => {
    try {
      const updateData: Partial<ExamParticipant> = { 
        status,
        ...(status === "completed" ? { endTime: new Date().toISOString() } : {})
      };
      
      await updateParticipantMutation(participantId, updateData);
      
      // Cập nhật trạng thái local
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, ...updateData } 
            : p
        )
      );
    } catch (error: any) {
      toast.error("Không thể cập nhật trạng thái");
      throw error;
    }
  };

  // Ghi nhận khi học sinh thoát khỏi bài thi
  const recordExamExit = async (participantId: string): Promise<void> => {
    try {
      // Tìm participant hiện tại
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;
      
      const exitCount = (participant.exitCount || 0) + 1;
      const lastExitTime = new Date().toISOString();
      
      // Cập nhật trong Supabase
      await updateParticipantMutation(participantId, {
        exitCount,
        lastExitTime
      });
      
      // Thông báo cho giáo viên
      toast.warning(
        `Thí sinh ${participant.studentName} (${participant.studentId}) đã thoát khỏi màn hình bài thi lần thứ ${exitCount}`,
        { duration: 5000 }
      );
      
      // Cập nhật local state
      setParticipants(prev => 
        prev.map(p => {
          if (p.id === participantId) {
            return {
              ...p,
              exitCount,
              lastExitTime
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Không thể cập nhật số lần thoát", error);
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
        startExam,
        endExam,
        recordExamExit
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
