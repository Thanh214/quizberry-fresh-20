
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Exam, ExamParticipant } from "@/types/models";
import { useQuiz } from "./QuizContext";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery, useSupabaseMutation, SupabaseExamParticipant } from "@/hooks/supabase";
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
  const { data: participantsData, loading: participantsLoading } = useSupabaseQuery<SupabaseExamParticipant>('exam_participants');
  
  const [participants, setParticipants] = useState<ExamParticipant[]>([]);
  const { add: addParticipantMutation, update: updateParticipantMutation } = useSupabaseMutation('exam_participants');

  // Cập nhật participants từ Supabase khi dữ liệu thay đổi
  useEffect(() => {
    if (!participantsLoading && participantsData) {
      // Transform data from snake_case to camelCase for our data model
      const transformedParticipants: ExamParticipant[] = participantsData.map((p: SupabaseExamParticipant) => ({
        id: p.id,
        examId: p.exam_id,
        studentName: p.student_name,
        studentId: p.student_id,
        className: p.class_name,
        status: p.status as "waiting" | "in_progress" | "completed",
        startTime: p.start_time,
        endTime: p.end_time || undefined,
        joinLink: p.join_link || undefined,
        exitCount: p.exit_count || 0,
        lastExitTime: p.last_exit_time || undefined,
        score: p.score || undefined
      }));
      
      setParticipants(transformedParticipants);
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
          const newParticipant = payload.new as SupabaseExamParticipant;
          // Transform to our model format
          const transformedParticipant: ExamParticipant = {
            id: newParticipant.id,
            examId: newParticipant.exam_id,
            studentName: newParticipant.student_name,
            studentId: newParticipant.student_id,
            className: newParticipant.class_name,
            status: newParticipant.status as "waiting" | "in_progress" | "completed",
            startTime: newParticipant.start_time,
            endTime: newParticipant.end_time || undefined,
            joinLink: newParticipant.join_link || undefined,
            exitCount: newParticipant.exit_count || 0,
            lastExitTime: newParticipant.last_exit_time || undefined,
            score: newParticipant.score || undefined
          };
          setParticipants(prev => [...prev, transformedParticipant]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedParticipant = payload.new as SupabaseExamParticipant;
          // Transform to our model format
          const transformedParticipant: ExamParticipant = {
            id: updatedParticipant.id,
            examId: updatedParticipant.exam_id,
            studentName: updatedParticipant.student_name,
            studentId: updatedParticipant.student_id,
            className: updatedParticipant.class_name,
            status: updatedParticipant.status as "waiting" | "in_progress" | "completed",
            startTime: updatedParticipant.start_time,
            endTime: updatedParticipant.end_time || undefined,
            joinLink: updatedParticipant.join_link || undefined,
            exitCount: updatedParticipant.exit_count || 0,
            lastExitTime: updatedParticipant.last_exit_time || undefined,
            score: updatedParticipant.score || undefined
          };
          setParticipants(prev => 
            prev.map(p => p.id === transformedParticipant.id ? transformedParticipant : p)
          );
        } else if (payload.eventType === 'DELETE') {
          const oldParticipant = payload.old as SupabaseExamParticipant;
          setParticipants(prev => prev.filter(p => p.id !== oldParticipant.id));
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
      const newParticipantData = {
        exam_id: examId,
        student_name: studentName,
        student_id: studentId,
        class_name: className,
        status: "waiting" as const,
        start_time: new Date().toISOString(),
        join_link: joinLink,
        exit_count: 0,
        user_id: user?.id || null
      };
      
      const result = await addParticipantMutation(newParticipantData);
      
      // Ensure result is of the correct type
      const participantResult = result as SupabaseExamParticipant;
      
      // Transform to our model format
      const transformedParticipant: ExamParticipant = {
        id: participantResult.id,
        examId: participantResult.exam_id,
        studentName: participantResult.student_name,
        studentId: participantResult.student_id,
        className: participantResult.class_name,
        status: participantResult.status as "waiting" | "in_progress" | "completed",
        startTime: participantResult.start_time,
        joinLink: participantResult.join_link || undefined,
        exitCount: participantResult.exit_count || 0,
        score: participantResult.score || undefined
      };
      
      return transformedParticipant;
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
      const updateData: any = { 
        status,
        ...(status === "completed" ? { end_time: new Date().toISOString() } : {})
      };
      
      await updateParticipantMutation(participantId, updateData);
      
      // Cập nhật trạng thái local
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, status, ...(status === "completed" ? { endTime: new Date().toISOString() } : {}) } 
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
        exit_count: exitCount,
        last_exit_time: lastExitTime
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
