
import { Exam } from "@/types/models";

// State types
export interface ExamState {
  exams: Exam[];
  isLoading: boolean;
  error: string | null;
}

// Action types
export interface ExamActions {
  addExam: (exam: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<Exam>;
  updateExam: (id: string, examData: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  activateExam: (id: string) => Promise<void>;
  startExam: (id: string) => Promise<void>;
  endExam: (id: string) => Promise<void>;
  getExamByCode: (code: string) => Exam | undefined;
  getExamById: (id: string) => Exam | undefined;
}

// Helper action types
export interface ExamStateActions {
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  addExamToState: (newExam: Exam) => void;
  updateExamInState: (id: string, updatedExam: Exam) => void;
  removeExamFromState: (id: string) => void;
}
