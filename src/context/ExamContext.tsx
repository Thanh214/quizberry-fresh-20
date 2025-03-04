
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
  
  // Thông tin tham gia
  participants: ExamParticipant[];
  addParticipant: (examId: string, studentName: string, studentId: string, className: string) => Promise<void>;
  updateParticipantScore: (participantId: string, score: number) => Promise<void>;
  
  // Tìm kiếm bài thi
  getExamByCode: (code: string) => Exam | null;
  getExamsByTeacher: (teacherId: string) => Exam[];
  getParticipantsByExam: (examId: string) => ExamParticipant[];
  
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
      
      // Kiểm tra xem bài thi đang mở không, nếu mở thì không cho chỉnh sửa nội dung
      const currentExam = exams[examIndex];
      if (currentExam.isActive && 
         (data.title !== undefined || data.description !== undefined || 
          data.duration !== undefined || data.questionIds !== undefined)) {
        throw new Error("Không thể chỉnh sửa nội dung bài thi đang mở");
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
      
      // Kiểm tra xem bài thi có đang mở không
      const exam = exams.find(e => e.id === id);
      if (exam && exam.isActive) {
        throw new Error("Không thể xóa bài thi đang mở");
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
        p => p.examId === examId && p.studentId === studentId && p.status === "pending"
      );
      
      if (existingParticipant) {
        // Nếu đã tham gia nhưng chưa hoàn thành, trả về thông tin hiện tại
        return;
      }
      
      // Tạo bản ghi tham gia mới
      const newParticipant: ExamParticipant = {
        id: Date.now().toString(),
        examId,
        studentName,
        studentId,
        className,
        status: "pending",
        startTime: new Date().toISOString(),
      };
      
      const updatedParticipants = [...participants, newParticipant];
      saveParticipants(updatedParticipants);
      toast.success("Đã đăng ký tham gia bài thi thành công!");
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

  // Tìm bài thi theo mã code
  const getExamByCode = (code: string): Exam | null => {
    return exams.find(e => e.code.toUpperCase() === code.toUpperCase().trim()) || null;
  };

  // Lấy danh sách bài thi theo giáo viên
  const getExamsByTeacher = (teacherId: string): Exam[] => {
    return exams.filter(e => e.teacherId === teacherId);
  };
  
  // Lấy danh sách người tham gia theo bài thi
  const getParticipantsByExam = (examId: string): ExamParticipant[] => {
    return participants.filter(p => p.examId === examId);
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        createExam,
        updateExam,
        deleteExam,
        toggleExamActive,
        participants,
        addParticipant,
        updateParticipantScore,
        getExamByCode,
        getExamsByTeacher,
        getParticipantsByExam,
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
