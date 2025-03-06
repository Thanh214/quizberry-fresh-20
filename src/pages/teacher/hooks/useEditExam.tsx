
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { Question } from "@/types/models";
import { toast } from "sonner";

// Validate if a string is a valid UUID
const isValidUUID = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export const useEditExam = (examId: string | undefined) => {
  const navigate = useNavigate();
  const { 
    updateExam, 
    getExamById, 
    questions, 
    addQuestion, 
    deleteQuestion
  } = useQuiz();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Redirect if not teacher
    if (!user || user.role !== "teacher") {
      navigate("/role-selection");
      return;
    }

    // Load exam data
    if (examId && isValidUUID(examId)) {
      const examData = getExamById(examId);
      if (examData) {
        setExam(examData);
        setTitle(examData.title);
        setDescription(examData.description || "");
        setDuration(examData.duration);
        
        // Filter valid question IDs
        const validQuestionIds = Array.isArray(examData.questionIds) 
          ? examData.questionIds.filter(id => isValidUUID(id))
          : [];
        
        // Set selected questions based on the exam
        setSelectedQuestions(validQuestionIds);
        
        // Filter questions that are in this exam
        const filteredQuestions = questions.filter(q => 
          validQuestionIds.includes(q.id)
        );
        setExamQuestions(filteredQuestions);
      } else {
        toast.error("Không tìm thấy bài thi", {
          id: "exam-not-found"
        });
        navigate("/teacher/exams");
      }
    } else if (examId) {
      toast.error("ID bài thi không hợp lệ", {
        id: "invalid-exam-id"
      });
      navigate("/teacher/exams");
    }
  }, [examId, user, navigate, getExamById, questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) return;
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi", {
        id: "missing-title"
      });
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0", {
        id: "invalid-duration"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Filter valid question IDs
      const validQuestionIds = selectedQuestions.filter(id => isValidUUID(id));
      
      // Update exam data
      await updateExam(exam.id, {
        title,
        description,
        duration,
        questionIds: validQuestionIds,
      });
      
      toast.success("Cập nhật bài thi thành công", {
        id: "update-exam-success"
      });
      navigate("/teacher/exams");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài thi", {
        id: "update-exam-error"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/teacher/exams");
  };

  // Fix the addQuestion function signature to match what ExamQuestionManager expects
  const handleAddQuestion = async (data: { 
    content: string; 
    options: Array<{ id: string; content: string; isCorrect: boolean }>
  }) => {
    try {
      const newQuestion = await addQuestion({
        content: data.content,
        options: data.options,
        examId: exam?.id,
      });
      
      // Add the new question to selected questions
      setSelectedQuestions(prev => [...prev, newQuestion.id]);
      
      // Add the new question to examQuestions
      setExamQuestions(prev => [...prev, newQuestion]);
      
      // Update the exam with the new question
      if (exam) {
        await updateExam(exam.id, {
          questionIds: [...selectedQuestions, newQuestion.id],
        });
      }
      
      toast.success("Thêm câu hỏi thành công", {
        id: "add-question-success"
      });
      return newQuestion;
    } catch (error) {
      toast.error("Không thể thêm câu hỏi", {
        id: "add-question-error"
      });
      console.error(error);
      throw error;
    }
  };

  // Fix the deleteQuestion function signature to return void instead of boolean
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      
      // Remove from selected questions
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      
      // Remove from exam questions
      setExamQuestions(prev => prev.filter(q => q.id !== questionId));
      
      // Update the exam's question list
      if (exam) {
        const updatedQuestionIds = selectedQuestions.filter(id => id !== questionId);
        await updateExam(exam.id, {
          questionIds: updatedQuestionIds,
        });
      }
      
      toast.success("Xóa câu hỏi thành công", {
        id: "delete-question-success"
      });
    } catch (error) {
      toast.error("Không thể xóa câu hỏi", {
        id: "delete-question-error"
      });
      console.error(error);
      throw error;
    }
  };

  const handleEditQuestion = (questionId: string) => {
    navigate(`/admin/questions/edit/${questionId}`);
  };

  const handleCreateExam = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return {
    exam,
    title,
    setTitle,
    description,
    setDescription,
    duration,
    setDuration,
    isLoading,
    activeTab,
    setActiveTab,
    selectedQuestions,
    setSelectedQuestions,
    examQuestions,
    setExamQuestions,
    handleSubmit,
    handleCancel,
    handleAddQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
    handleCreateExam,
    questions
  };
};
