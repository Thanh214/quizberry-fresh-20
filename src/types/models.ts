
/**
 * Models for the EPUTest application
 */

export interface User {
  id: string;
  username: string;
  role: "admin" | "student";
  name?: string;
  className?: string;
}

export interface Question {
  id: string;
  content: string;
  options: Option[];
  createdAt: string;
  updatedAt: string;
}

export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  studentName: string;
  className: string;
  score: number;
  totalQuestions: number;
  averageTimePerQuestion: number; // in milliseconds
  totalTime: number; // in milliseconds
  submittedAt: string;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpent: number; // in milliseconds
}

export interface QuizSession {
  id: string;
  studentName: string;
  className: string;
  startedAt: string;
  currentQuestionIndex: number;
  questions: ShuffledQuestion[];
  answers: QuestionAnswer[];
  status?: "pending" | "approved" | "rejected"; // Status for teacher verification
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: Option[];
}

// New models for class management
export interface Class {
  id: string;
  name: string;
  description?: string;
  isQuizActive: boolean; // Controls if students can take the quiz
  createdAt: string;
  updatedAt: string;
}

// New model for pending quiz requests
export interface QuizRequest {
  id: string;
  studentName: string;
  className: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}
