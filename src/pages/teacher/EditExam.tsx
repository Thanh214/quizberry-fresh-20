
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, XCircle, FilePlus } from "lucide-react";
import Card from "@/components/Card";
import { Question } from "@/types/models";
import ExamQuestionManager from "./components/ExamQuestionManager";
import ExamStatistics from "./components/ExamStatistics";
import EditExamDetails from "./components/EditExamDetails";

const EditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    if (id) {
      const examData = getExamById(id);
      if (examData) {
        setExam(examData);
        setTitle(examData.title);
        setDescription(examData.description || "");
        setDuration(examData.duration);
        
        // Set selected questions based on the exam
        setSelectedQuestions(examData.questionIds || []);
        
        // Filter questions that are in this exam
        const filteredQuestions = questions.filter(q => 
          examData.questionIds?.includes(q.id)
        );
        setExamQuestions(filteredQuestions);
      } else {
        toast.error("Không tìm thấy bài thi", {
          id: "exam-not-found" // Add ID to prevent duplicate toasts
        });
        navigate("/teacher/exams");
      }
    }
  }, [id, user, navigate, getExamById, questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) return;
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi", {
        id: "missing-title" // Add ID to prevent duplicate toasts
      });
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0", {
        id: "invalid-duration" // Add ID to prevent duplicate toasts
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update exam data
      await updateExam(exam.id, {
        title,
        description,
        duration,
        questionIds: selectedQuestions,
      });
      
      toast.success("Cập nhật bài thi thành công", {
        id: "update-exam-success" // Add ID to prevent duplicate toasts
      });
      navigate("/teacher/exams");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài thi", {
        id: "update-exam-error" // Add ID to prevent duplicate toasts
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/teacher/exams");
  };

  const handleAddQuestion = async (content: string, options: Array<{ id: string; content: string; isCorrect: boolean }>) => {
    try {
      const newQuestion = await addQuestion({
        content,
        options,
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
        id: "add-question-success" // Add ID to prevent duplicate toasts
      });
      return newQuestion;
    } catch (error) {
      toast.error("Không thể thêm câu hỏi", {
        id: "add-question-error" // Add ID to prevent duplicate toasts
      });
      console.error(error);
      throw error;
    }
  };

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
        id: "delete-question-success" // Add ID to prevent duplicate toasts
      });
      return true;
    } catch (error) {
      toast.error("Không thể xóa câu hỏi", {
        id: "delete-question-error" // Add ID to prevent duplicate toasts
      });
      console.error(error);
      throw error;
    }
  };

  const handleEditQuestion = (questionId: string) => {
    navigate(`/admin/questions/edit/${questionId}`);
  };

  // Calculate statistics for display
  const waitingCount = 0; // This would come from participants in a real app
  const inProgressCount = 0; // This would come from participants in a real app
  const completedCount = 0; // This would come from participants in a real app
  const totalParticipants = waitingCount + inProgressCount + completedCount;

  if (!exam) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="p-6">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài thi</h2>
              <p className="text-muted-foreground mb-6">Bài thi không tồn tại hoặc đã bị xóa</p>
              <Button onClick={() => navigate("/teacher/exams")}>
                Quay lại danh sách bài thi
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <TransitionWrapper>
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Chỉnh sửa bài thi</h1>
              <Badge 
                variant={exam.isActive ? "success" : "secondary"} 
                className={exam.isActive ? "animate-pulse" : ""}
              >
                {exam.isActive ? "Đang mở" : "Đã đóng"}
              </Badge>
              {exam.hasStarted && (
                <Badge variant="destructive" className="animate-pulse">
                  Đã bắt đầu
                </Badge>
              )}
            </div>
          </div>
        </TransitionWrapper>

        {/* Exam statistics */}
        <TransitionWrapper delay={50}>
          {exam && (
            <ExamStatistics 
              exam={exam}
              waitingCount={waitingCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
              totalParticipants={totalParticipants}
            />
          )}
        </TransitionWrapper>

        <TransitionWrapper delay={100}>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="details">Thông tin bài thi</TabsTrigger>
              <TabsTrigger value="questions">Quản lý câu hỏi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card className="p-6">
                <EditExamDetails
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  duration={duration}
                  setDuration={setDuration}
                  examCode={exam.code}
                  handleSubmit={handleSubmit}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="questions">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-medium">Danh sách câu hỏi</h2>
                    <div className="text-sm text-muted-foreground">
                      ({selectedQuestions.length} câu hỏi)
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveTab("add-question")}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Thêm câu hỏi mới
                  </Button>
                </div>
                
                <ExamQuestionManager
                  questions={examQuestions}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                  addQuestion={handleAddQuestion}
                  deleteQuestion={handleDeleteQuestion}
                  isLoading={isLoading}
                  onEditQuestion={handleEditQuestion}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default EditExam;
