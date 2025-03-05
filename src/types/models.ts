
// Update User type to include email
export interface User {
  id: string;
  username: string;
  email?: string;
  role: "admin" | "student" | "teacher";
  name?: string;
  faculty?: string;
  className?: string;
  studentId?: string;
  examCode?: string; // Added to fix StudentQuiz and StudentWaiting errors
}

// Update Teacher type to include email
export interface Teacher {
  id: string;
  name: string;
  faculty: string;
  username: string;
  email?: string;
  password?: string;
  createdAt?: string;
}

// Exam interface for the quiz system
export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: number;
  teacherId: string;
  isActive: boolean;
  hasStarted: boolean;
  createdAt: string;
  updatedAt: string;
  questionIds: string[];
  shareLink: string;
}

// Question interface for the quiz system
export interface Question {
  id: string;
  content: string;
  options: Option[];
  examId?: string;
  createdAt: string;
  updatedAt: string;
}

// Option interface for question answers
export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
}

// Class interface for classroom management
export interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  isQuizActive: boolean;
  createdAt: string;
  updatedAt?: string; // Added to fix classContext errors
}

// ExamParticipant interface for tracking exam takers
export interface ExamParticipant {
  id: string;
  examId: string;
  studentName: string;
  studentId: string;
  className: string;
  status: "waiting" | "in_progress" | "completed";
  startTime: string;
  endTime?: string;
  joinLink?: string;
  exitCount: number;
  lastExitTime?: string;
  score?: number;
}

// QuizRequest interface for quiz participation requests
export interface QuizRequest {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  examId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  requestedAt: string; // Added to fix ManageRequests errors
}

// QuizSession interface for active quiz sessions
export interface QuizSession {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  examId: string;
  startedAt: string;
  currentQuestionIndex: number;
  questions: ShuffledQuestion[];
  answers: QuestionAnswer[];
}

// ShuffledQuestion interface for questions with shuffled options
export interface ShuffledQuestion extends Question {
  shuffledOptions: Option[];
}

// QuestionAnswer interface for storing user's answers
export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

// QuizResult interface for storing quiz results
export interface QuizResult {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  examId: string;
  score: number;
  totalQuestions: number;
  averageTimePerQuestion: number;
  totalTime: number;
  submittedAt: string;
  answers: QuestionAnswer[];
}
