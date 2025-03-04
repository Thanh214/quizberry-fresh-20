
import React, { createContext, useContext, useState, useEffect } from "react";
import { Exam, ExamParticipant, Question } from "@/types/models";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu cho context
type ExamContextType = {
  // Quản lý bài thi
  exams: Exam[];
  createExam: (title: string, description: string, duration: number, questionIds: string[]) => Promise<Exam>;
  updateExam: (id: string, data: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  toggleExamActive: (examId: string, isActive: boolean) => Promise<void>;
  startExam: (examId: string) => Promise<void>;
  
  // Thông tin tham gia
  participants: ExamParticipant[];
  addParticipant: (examId: string, studentName: string, studentId: string, className: string) => Promise<void>;
  updateParticipantScore: (participantId: string, score: number) => Promise<void>;
  updateParticipantStatus: (participantId: string, status: ExamParticipant['status']) => Promise<void>;
  getWaitingParticipants: (examId: string) => ExamParticipant[];
  
  // Tìm kiếm bài thi
  getExamByCode: (code: string) => Exam | null;
  getExamById: (id: string) => Exam | null;
  getExamsByTeacher: (teacherId: string) => Exam[];
  getParticipantsByExam: (examId: string) => ExamParticipant[];
  
  // URL sharing
  generateShareLink: (examId: string) => Promise<string>;
  generateJoinLink: (participantId: string) => Promise<string>;
  
  // Trạng thái
  isLoading: boolean;
  error: string | null;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

// Generator mã code ngẫu nhiên
const generateExamCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Tạo URL để chia sẻ
const generateShareUrl = (examCode: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/student/register?code=${examCode}`;
};

// Tạo URL để tham gia
const generateJoinUrl = (participantId: string, examCode: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/student/waiting?pid=${participantId}&code=${examCode}`;
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>(() => {
    const storedExams = localStorage.getItem("exams");
    return storedExams ? JSON.parse(storedExams) : [];
  });
  
  const [participants, setParticipants] = useState<ExamParticipant[]>(() => {
    const storedParticipants = localStorage.getItem("examParticipants");
    return storedParticipants ? JSON.parse(storedParticipants) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tự động lưu dữ liệu khi thay đổi
  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);
  
  useEffect(() => {
    localStorage.setItem("examParticipants", JSON.stringify(participants));
  }, [participants]);

  // Lưu dữ liệu vào localStorage
  const saveExams = (data: Exam[]) => {
    setExams(data);
    localStorage.setItem("exams", JSON.stringify(data));
  };
  
  const saveParticipants = (data: ExamParticipant[]) => {
    setParticipants(data);
    localStorage.setItem("examParticipants", JSON.stringify(data));
  };

  // Tạo bài thi mới
  const createExam = async (
    title: string, 
    description: string, 
    duration: number, 
    questionIds: string[]
  ): Promise<Exam> => {
    try {
      setIsLoading(true);
      
      if (!user || (user.role !== "teacher" && user.role !== "admin")) {
        throw new Error("Bạn không có quyền tạo bài thi");
      }
      
      // Tạo mã code duy nhất
      let code = generateExamCode();
      while (exams.some(e => e.code === code)) {
        code = generateExamCode();
      }
      
      const newExam: Exam = {
        id: Date.now().toString(),
        code,
        title,
        description,
        duration,
        teacherId: user.id,
        isActive: false, // Mặc định chưa kích hoạt
        hasStarted: false, // Mặc định chưa bắt đầu
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionIds,
      };
      
      const updatedExams = [...exams, newExam];
      saveExams(updatedExams);
      toast.success("Đã tạo bài thi mới thành công!");
      
      return newExam;
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật bài thi
  const updateExam = async (id: string, data: Partial<Exam>) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      // Kiểm tra xem bài thi đã bắt đầu chưa, nếu đã bắt đầu thì không cho chỉnh sửa nội dung
      const currentExam = exams[examIndex];
      if (currentExam.hasStarted && 
         (data.title !== undefined || data.description !== undefined || 
          data.duration !== undefined || data.questionIds !== undefined)) {
        throw new Error("Không thể chỉnh sửa nội dung bài thi đã bắt đầu");
      }
      
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      saveExams(updatedExams);
      
      // Thông báo cho từng trường hợp
      if (data.isActive !== undefined) {
        // Không hiển thị thông báo vì đã hiển thị ở hàm toggleExamActive 
      } else {
        toast.success("Đã cập nhật bài thi thành công!");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa bài thi
  const deleteExam = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra xem bài thi có đang mở hoặc đã bắt đầu không
      const exam = exams.find(e => e.id === id);
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      if (exam.isActive) {
        throw new Error("Không thể xóa bài thi đang mở");
      }
      
      if (exam.hasStarted) {
        throw new Error("Không thể xóa bài thi đã bắt đầu");
      }
      
      // Xóa bài thi
      const updatedExams = exams.filter(e => e.id !== id);
      saveExams(updatedExams);
      
      // Xóa tất cả thông tin tham gia liên quan
      const updatedParticipants = participants.filter(p => p.examId !== id);
      saveParticipants(updatedParticipants);
      
      toast.success("Đã xóa bài thi thành công!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Bật/tắt bài thi
  const toggleExamActive = async (examId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === examId);
      if (examIndex === -1) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      // Cập nhật trạng thái active
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        isActive,
        updatedAt: new Date().toISOString(),
      };
      
      saveExams(updatedExams);
      toast.success(isActive ? "Đã kích hoạt bài thi!" : "Đã vô hiệu hóa bài thi!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Bắt đầu bài thi (chuyển tất cả trạng thái chờ thành đang làm bài)
  const startExam = async (examId: string) => {
    try {
      setIsLoading(true);
      
      const examIndex = exams.findIndex(e => e.id === examId);
      if (examIndex === -1) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      const exam = exams[examIndex];
      if (!exam.isActive) {
        throw new Error("Bài thi chưa được kích hoạt");
      }
      
      // Cập nhật trạng thái đã bắt đầu
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        hasStarted: true,
        updatedAt: new Date().toISOString(),
      };
      
      // Cập nhật trạng thái của tất cả người tham gia đang chờ
      const updatedParticipants = [...participants];
      for (let i = 0; i < updatedParticipants.length; i++) {
        const participant = updatedParticipants[i];
        if (participant.examId === examId && participant.status === "waiting") {
          updatedParticipants[i] = {
            ...participant,
            status: "in_progress",
            startTime: new Date().toISOString(),
          };
        }
      }
      
      saveExams(updatedExams);
      saveParticipants(updatedParticipants);
      
      toast.success("Đã bắt đầu bài thi!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm người tham gia
  const addParticipant = async (
    examId: string, 
    studentName: string, 
    studentId: string, 
    className: string
  ) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra bài thi có tồn tại và đang mở không
      const exam = exams.find(e => e.id === examId);
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      if (!exam.isActive) {
        throw new Error("Bài thi chưa được kích hoạt");
      }
      
      // Kiểm tra học sinh đã tham gia bài thi này chưa
      const existingParticipant = participants.find(
        p => p.examId === examId && p.studentId === studentId && 
        (p.status === "waiting" || p.status === "in_progress")
      );
      
      if (existingParticipant) {
        // Nếu đã tham gia và đang chờ hoặc đang làm bài, thông báo
        throw new Error("Bạn đã đăng ký tham gia bài thi này");
      }
      
      // Tạo bản ghi tham gia mới
      const participantId = Date.now().toString();
      const newParticipant: ExamParticipant = {
        id: participantId,
        examId,
        studentName,
        studentId,
        className,
        status: exam.hasStarted ? "in_progress" : "waiting", // Nếu bài thi đã bắt đầu thì trạng thái là đang làm, ngược lại là đang chờ
        startTime: exam.hasStarted ? new Date().toISOString() : "",
        joinLink: generateJoinUrl(participantId, exam.code),
      };
      
      const updatedParticipants = [...participants, newParticipant];
      saveParticipants(updatedParticipants);
      toast.success("Đã đăng ký tham gia bài thi thành công!");
      
      return;
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật điểm số
  const updateParticipantScore = async (participantId: string, score: number) => {
    try {
      setIsLoading(true);
      
      const participantIndex = participants.findIndex(p => p.id === participantId);
      if (participantIndex === -1) {
        throw new Error("Không tìm thấy thông tin tham gia");
      }
      
      const updatedParticipants = [...participants];
      updatedParticipants[participantIndex] = {
        ...updatedParticipants[participantIndex],
        status: "completed",
        score,
        endTime: new Date().toISOString(),
      };
      
      saveParticipants(updatedParticipants);
      toast.success("Đã cập nhật điểm số thành công!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật trạng thái người tham gia
  const updateParticipantStatus = async (participantId: string, status: ExamParticipant['status']) => {
    try {
      setIsLoading(true);
      
      const participantIndex = participants.findIndex(p => p.id === participantId);
      if (participantIndex === -1) {
        throw new Error("Không tìm thấy thông tin tham gia");
      }
      
      const updatedParticipants = [...participants];
      const now = new Date().toISOString();
      
      // Cập nhật trạng thái và thời gian tương ứng
      if (status === "in_progress") {
        updatedParticipants[participantIndex] = {
          ...updatedParticipants[participantIndex],
          status,
          startTime: now,
        };
      } else if (status === "completed") {
        updatedParticipants[participantIndex] = {
          ...updatedParticipants[participantIndex],
          status,
          endTime: now,
        };
      } else {
        updatedParticipants[participantIndex] = {
          ...updatedParticipants[participantIndex],
          status,
        };
      }
      
      saveParticipants(updatedParticipants);
      toast.success(`Đã cập nhật trạng thái thành ${status === "waiting" ? "đang chờ" : status === "in_progress" ? "đang làm bài" : "đã hoàn thành"}!`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm bài thi theo mã code
  const getExamByCode = (code: string): Exam | null => {
    return exams.find(e => e.code.toUpperCase() === code.toUpperCase().trim()) || null;
  };

  // Tìm bài thi theo ID
  const getExamById = (id: string): Exam | null => {
    return exams.find(e => e.id === id) || null;
  };

  // Lấy danh sách bài thi theo giáo viên
  const getExamsByTeacher = (teacherId: string): Exam[] => {
    return exams.filter(e => e.teacherId === teacherId);
  };
  
  // Lấy danh sách người tham gia theo bài thi
  const getParticipantsByExam = (examId: string): ExamParticipant[] => {
    return participants.filter(p => p.examId === examId);
  };
  
  // Lấy danh sách người tham gia đang chờ theo bài thi
  const getWaitingParticipants = (examId: string): ExamParticipant[] => {
    return participants.filter(p => p.examId === examId && p.status === "waiting");
  };

  // Tạo link chia sẻ
  const generateShareLink = async (examId: string): Promise<string> => {
    try {
      const exam = exams.find(e => e.id === examId);
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      const shareLink = generateShareUrl(exam.code);
      
      // Cập nhật bài thi với link chia sẻ
      const examIndex = exams.findIndex(e => e.id === examId);
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        shareLink,
        updatedAt: new Date().toISOString(),
      };
      
      saveExams(updatedExams);
      
      return shareLink;
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    }
  };

  // Tạo link tham gia
  const generateJoinLink = async (participantId: string): Promise<string> => {
    try {
      const participant = participants.find(p => p.id === participantId);
      if (!participant) {
        throw new Error("Không tìm thấy thông tin tham gia");
      }
      
      const exam = exams.find(e => e.id === participant.examId);
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
      
      const joinLink = generateJoinUrl(participantId, exam.code);
      
      // Cập nhật người tham gia với link tham gia
      const participantIndex = participants.findIndex(p => p.id === participantId);
      const updatedParticipants = [...participants];
      updatedParticipants[participantIndex] = {
        ...updatedParticipants[participantIndex],
        joinLink,
      };
      
      saveParticipants(updatedParticipants);
      
      return joinLink;
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      throw error;
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        createExam,
        updateExam,
        deleteExam,
        toggleExamActive,
        startExam,
        participants,
        addParticipant,
        updateParticipantScore,
        updateParticipantStatus,
        getWaitingParticipants,
        getExamByCode,
        getExamById,
        getExamsByTeacher,
        getParticipantsByExam,
        generateShareLink,
        generateJoinLink,
        isLoading,
        error,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExam phải được sử dụng trong ExamProvider");
  }
  return context;
};
