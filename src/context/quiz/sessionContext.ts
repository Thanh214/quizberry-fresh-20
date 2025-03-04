
import { QuizSession, QuizResult, ShuffledQuestion, Question, QuestionAnswer } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";

export const useSessionState = (getAllQuestions: () => Question[]) => {
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResult[]>(() => {
    const storedResults = localStorage.getItem("quizResults");
    return storedResults ? JSON.parse(storedResults) : [];
  });
  
  // Quiz session functions
  const startQuiz = (studentName: string, studentId: string, className: string, examId: string): QuizSession => {
    try {
      // Get questions for this exam
      const questions = getAllQuestions().filter(q => q.examId === examId || !q.examId);
      
      if (questions.length === 0) {
        throw new Error("Không có câu hỏi nào cho bài thi này");
      }
      
      // Create shuffled questions
      const shuffledQuestions = questions.map(q => {
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        return {
          ...q,
          shuffledOptions,
        };
      });
      
      // Create new session
      const newSession: QuizSession = {
        id: Date.now().toString(),
        studentName,
        studentId,
        className,
        examId,
        startedAt: new Date().toISOString(),
        currentQuestionIndex: 0,
        questions: shuffledQuestions,
        answers: [],
      };
      
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      toast.error((error as Error).message || "Không thể bắt đầu bài kiểm tra");
      throw error;
    }
  };
  
  const submitAnswer = (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => {
    if (!currentSession || currentSession.id !== sessionId) {
      toast.error("Phiên làm bài không hợp lệ");
      return;
    }
    
    try {
      // Find question
      const question = currentSession.questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error("Câu hỏi không tồn tại");
      }
      
      // Check if answer is correct
      const isCorrect = optionId 
        ? question.options.find(o => o.id === optionId)?.isCorrect || false
        : false;
      
      // Create answer
      const answer: QuestionAnswer = {
        questionId,
        selectedOptionId: optionId,
        isCorrect,
        timeSpent,
      };
      
      // Update session
      const updatedSession = {
        ...currentSession,
        answers: [...currentSession.answers, answer],
        currentQuestionIndex: currentSession.currentQuestionIndex + 1,
      };
      
      setCurrentSession(updatedSession);
    } catch (error) {
      toast.error((error as Error).message || "Không thể gửi câu trả lời");
    }
  };
  
  const finishQuiz = (sessionId: string): QuizResult => {
    if (!currentSession || currentSession.id !== sessionId) {
      toast.error("Phiên làm bài không hợp lệ");
      throw new Error("Invalid quiz session");
    }
    
    try {
      // Calculate score
      const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
      const totalQuestions = currentSession.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Calculate average time per question
      const totalTimeSpent = currentSession.answers.reduce((total, a) => total + a.timeSpent, 0);
      const averageTimePerQuestion = currentSession.answers.length > 0 
        ? totalTimeSpent / currentSession.answers.length 
        : 0;
      
      // Create result
      const result: QuizResult = {
        id: Date.now().toString(),
        studentName: currentSession.studentName,
        studentId: currentSession.studentId,
        className: currentSession.className,
        examId: currentSession.examId,
        score,
        totalQuestions,
        averageTimePerQuestion,
        totalTime: totalTimeSpent,
        submittedAt: new Date().toISOString(),
        answers: currentSession.answers,
      };
      
      // Save result
      const updatedResults = [...results, result];
      setResults(updatedResults);
      localStorage.setItem("quizResults", JSON.stringify(updatedResults));
      
      // Clear current session
      setCurrentSession(null);
      
      return result;
    } catch (error) {
      toast.error((error as Error).message || "Không thể hoàn thành bài kiểm tra");
      throw error;
    }
  };
  
  const getResults = () => {
    return results;
  };

  return {
    currentSession,
    startQuiz,
    submitAnswer,
    finishQuiz,
    getResults,
  };
};
