
/**
 * Các model cho ứng dụng EPUTest
 */

export interface User {
  id: string;
  username: string;
  role: "admin" | "student" | "teacher"; // Thêm vai trò "teacher"
  name?: string;
  className?: string;
  faculty?: string; // Thêm trường Khoa cho giáo viên
  studentId?: string; // Thêm mã sinh viên
  examCode?: string; // Thêm mã bài thi
}

export interface Teacher {
  id: string;
  name: string;
  faculty: string; // Khoa
  username: string;
  password: string; // Lưu ý: Trong thực tế, mật khẩu nên được băm
  createdAt: string;
}

export interface Question {
  id: string;
  content: string;
  options: Option[];
  createdAt: string;
  updatedAt: string;
  examId?: string; // Thêm liên kết đến bài thi
}

export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  studentName: string;
  studentId: string; // Thêm mã sinh viên
  className: string;
  examId: string; // Thêm mã bài thi
  score: number;
  totalQuestions: number;
  averageTimePerQuestion: number; // Tính bằng mili giây
  totalTime: number; // Tính bằng mili giây
  submittedAt: string;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpent: number; // Tính bằng mili giây
}

export interface QuizSession {
  id: string;
  studentName: string;
  studentId: string; // Thêm mã sinh viên
  className: string;
  examId: string; // Thêm mã bài thi
  startedAt: string;
  currentQuestionIndex: number;
  questions: ShuffledQuestion[];
  answers: QuestionAnswer[];
  status?: "pending" | "approved" | "rejected"; // Trạng thái xác nhận của giáo viên
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: Option[];
}

// Model cho quản lý lớp học
export interface Class {
  id: string;
  name: string;
  description?: string;
  isQuizActive: boolean; // Kiểm soát xem học sinh có thể tham gia thi hay không
  createdAt: string;
  updatedAt: string;
}

// Model cho yêu cầu thi
export interface QuizRequest {
  id: string;
  studentName: string;
  studentId: string; // Thêm mã sinh viên
  className: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

// Model mới cho bài thi
export interface Exam {
  id: string;
  code: string; // Mã code duy nhất cho bài thi
  title: string; // Tiêu đề bài thi
  description?: string;
  duration: number; // Thời gian làm bài tính bằng phút
  teacherId: string; // ID của giáo viên tạo bài thi
  isActive: boolean; // Trạng thái bài thi (đang mở hoặc đóng)
  createdAt: string;
  updatedAt: string;
  questionIds: string[]; // Danh sách ID các câu hỏi
  hasStarted: boolean; // Trạng thái bài thi đã bắt đầu chưa
  shareLink?: string; // Link để chia sẻ bài thi
}

// Thống kê sinh viên tham gia thi
export interface ExamParticipant {
  id: string;
  examId: string;
  studentName: string;
  studentId: string;
  className: string;
  status: "waiting" | "in_progress" | "completed"; // Thêm trạng thái waiting
  score?: number;
  startTime: string;
  endTime?: string;
  joinLink?: string; // Đường link để tham gia
}
