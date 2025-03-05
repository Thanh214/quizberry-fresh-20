import React, { createContext, useContext, useEffect } from "react";
import { useQuestionState } from "./quiz/questionContext";
import { useClassState } from "./quiz/classContext";
import { useRequestState } from "./quiz/requestContext";
import { useExamState } from "./quiz/examContext";
import { useSessionState } from "./quiz/sessionContext";
import { Question, QuizSession, QuizResult, QuizRequest, Class, Exam } from "@/types/models";
import { useSupabaseQuery } from "@/hooks/supabase";
import { supabase } from "@/integrations/supabase/client";

// Type for the context
type QuizContextType = {
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Promise<Question>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  
  // Class management
  classes: Class[];
  addClass: (name: string, description?: string) => Promise<void>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  toggleQuizActive: (classId: string, isActive: boolean) => Promise<void>;
  
  // Quiz requests
  quizRequests: QuizRequest[];
  approveQuizRequest: (requestId: string) => Promise<void>;
  rejectQuizRequest: (requestId: string) => Promise<void>;
  
  // Quiz session
  startQuiz: (studentName: string, studentId: string, className: string, examId: string) => QuizSession;
  submitAnswer: (sessionId: string, questionId: string, optionId: string | null, timeSpent: number) => void;
  finishQuiz: (sessionId: string) => QuizResult;
  currentSession: QuizSession | null;
  
  // Results
  getResults: () => QuizResult[];

  // Exam management
  exams: Exam[];
  addExam: (exam: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<Exam>;
  updateExam: (id: string, examData: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  activateExam: (id: string) => Promise<void>;
  startExam: (id: string) => Promise<void>;
  endExam: (id: string) => Promise<void>;
  getExamByCode: (code: string) => Exam | undefined;
  getExamById: (id: string) => Exam | undefined;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use all the state hooks
  const questionState = useQuestionState();
  const classState = useClassState();
  const requestState = useRequestState();
  const examState = useExamState();
  const sessionState = useSessionState(() => questionState.questions);
  
  // Fetch exams from Supabase
  const { data: supabaseExams, loading: examsLoading } = useSupabaseQuery<any>('exams');
  
  // Fetch questions from Supabase
  const { data: supabaseQuestions, loading: questionsLoading } = useSupabaseQuery<any>('questions');
  
  // Synchronize Supabase data with local state
  useEffect(() => {
    if (!examsLoading && supabaseExams && supabaseExams.length > 0) {
      // Transform to our model format
      const transformedExams: Exam[] = supabaseExams.map((e: any) => ({
        id: e.id,
        code: e.code,
        title: e.title,
        description: e.description,
        duration: e.duration,
        teacherId: e.teacher_id,
        isActive: e.is_active,
        hasStarted: e.has_started,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
        questionIds: e.question_ids ? JSON.parse(e.question_ids) : [], // Parse the JSON string
        shareLink: e.share_link
      }));
      
      examState.setExams(transformedExams);
    }
    
    if (!questionsLoading && supabaseQuestions && supabaseQuestions.length > 0) {
      // We need to fetch options for each question
      const fetchOptionsForQuestions = async () => {
        const questionsWithOptions = await Promise.all(
          supabaseQuestions.map(async (q: any) => {
            const { data: options } = await supabase
              .from('options')
              .select('*')
              .eq('question_id', q.id);
              
            // Transform to our model format
            return {
              id: q.id,
              content: q.content,
              createdAt: q.created_at,
              updatedAt: q.updated_at,
              examId: q.exam_id,
              options: options ? options.map((o: any) => ({
                id: o.id,
                content: o.content,
                isCorrect: o.is_correct
              })) : []
            };
          })
        );
        
        questionState.setQuestions(questionsWithOptions);
      };
      
      fetchOptionsForQuestions();
    }
  }, [supabaseExams, examsLoading, supabaseQuestions, questionsLoading, examState, questionState]);
  
  // Set up realtime listeners for changes
  useEffect(() => {
    const examChannel = supabase
      .channel('public:exams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newExam = payload.new as any;
          // Transform to our model format
          const exam: Exam = {
            id: newExam.id,
            code: newExam.code,
            title: newExam.title,
            description: newExam.description,
            duration: newExam.duration,
            teacherId: newExam.teacher_id,
            isActive: newExam.is_active,
            hasStarted: newExam.has_started,
            createdAt: newExam.created_at,
            updatedAt: newExam.updated_at,
            questionIds: newExam.question_ids ? JSON.parse(newExam.question_ids) : [], // Parse the JSON string
            shareLink: newExam.share_link
          };
          examState.addExamToState(exam);
        } else if (payload.eventType === 'UPDATE') {
          
          const updatedExam = payload.new as any;
          // Transform to our model format
          const exam: Exam = {
            id: updatedExam.id,
            code: updatedExam.code,
            title: updatedExam.title,
            description: updatedExam.description,
            duration: updatedExam.duration,
            teacherId: updatedExam.teacher_id,
            isActive: updatedExam.is_active,
            hasStarted: updatedExam.has_started,
            createdAt: updatedExam.created_at,
            updatedAt: updatedExam.updated_at,
            questionIds: updatedExam.question_ids ? JSON.parse(updatedExam.question_ids) : [], // Parse the JSON string
            shareLink: updatedExam.share_link
          };
          examState.updateExamInState(updatedExam.id, exam);
        } else if (payload.eventType === 'DELETE') {
          examState.removeExamFromState(payload.old.id);
        }
      })
      .subscribe();
      
    const questionChannel = supabase
      .channel('public:questions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const newQuestion = payload.new as any;
          
          // Fetch options for this question
          const { data: options } = await supabase
            .from('options')
            .select('*')
            .eq('question_id', newQuestion.id);
            
          // Transform to our model format
          const question: Question = {
            id: newQuestion.id,
            content: newQuestion.content,
            createdAt: newQuestion.created_at,
            updatedAt: newQuestion.updated_at,
            examId: newQuestion.exam_id,
            options: options ? options.map((o: any) => ({
              id: o.id,
              content: o.content,
              isCorrect: o.is_correct
            })) : []
          };
          
          questionState.addQuestionToState(question);
        } else if (payload.eventType === 'UPDATE') {
          const updatedQuestion = payload.new as any;
          
          // Fetch options for this question
          const { data: options } = await supabase
            .from('options')
            .select('*')
            .eq('question_id', updatedQuestion.id);
            
          // Transform to our model format
          const question: Question = {
            id: updatedQuestion.id,
            content: updatedQuestion.content,
            createdAt: updatedQuestion.created_at,
            updatedAt: updatedQuestion.updated_at,
            examId: updatedQuestion.exam_id,
            options: options ? options.map((o: any) => ({
              id: o.id,
              content: o.content,
              isCorrect: o.is_correct
            })) : []
          };
          
          questionState.updateQuestionInState(updatedQuestion.id, question);
        } else if (payload.eventType === 'DELETE') {
          questionState.removeQuestionFromState(payload.old.id);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(examChannel);
      supabase.removeChannel(questionChannel);
    };
  }, [examState, questionState]);

  // Combine all state and functions into a single context value
  const contextValue: QuizContextType = {
    ...questionState,
    ...classState,
    ...requestState,
    ...examState,
    ...sessionState,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
