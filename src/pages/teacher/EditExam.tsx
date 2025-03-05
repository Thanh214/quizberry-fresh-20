
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, XCircle, Clock, Hash, FilePlus } from "lucide-react";
import Card from "@/components/Card";
import { Exam, Question } from "@/types/models";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";
import ExamStatistics from "./components/ExamStatistics";

const EditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    exams, 
    updateExam, 
    getExamById, 
    questions, 
    addQuestion, 
    deleteQuestion,
    updateQuestion 
  } = useQuiz();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
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
        toast.error("Không tìm thấy bài thi");
        navigate("/teacher/exams");
      }
    }
  }, [id, user, navigate, getExamById, questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) return;
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi");
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0");
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
      
      toast.success("Cập nhật bài thi thành công");
      navigate("/teacher/exams");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài thi");
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
      
      setShowQuestionForm(false);
      toast.success("Thêm câu hỏi thành công");
    } catch (error) {
      toast.error("Không thể thêm câu hỏi");
      console.error(error);
    }
  };

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleEditQuestion = (questionId: string) => {
    navigate(`/admin/questions/edit/${questionId}`);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
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
        
        toast.success("Xóa câu hỏi thành công");
      } catch (error) {
        toast.error("Không thể xóa câu hỏi");
        console.error(error);
      }
    }
  };

  const handleSelectAll = () => {
    setSelectedQuestions(questions.map(q => q.id));
  };

  const handleDeselectAll = () => {
    setSelectedQuestions([]);
  };

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
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
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium" htmlFor="exam-title">
                      Tiêu đề bài thi
                    </label>
                    <Input
                      id="exam-title"
                      placeholder="Nhập tiêu đề bài thi"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium" htmlFor="exam-code">
                      Mã bài thi
                    </label>
                    <Input
                      id="exam-code"
                      value={exam.code}
                      readOnly
                      disabled
                      className="bg-gray-100 transition-all duration-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mã bài thi không thể thay đổi sau khi đã tạo
                    </p>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium" htmlFor="exam-description">
                      Mô tả bài thi
                    </label>
                    <Textarea
                      id="exam-description"
                      placeholder="Nhập mô tả bài thi"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      neon
                      neonColor="blue"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium" htmlFor="exam-duration">
                      Thời gian làm bài (phút)
                    </label>
                    <Input
                      id="exam-duration"
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex justify-between space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-slate-300 transition-all duration-300 hover:bg-slate-100"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Hủy thay đổi
                    </Button>
                    
                    <NeonEffect 
                      color="blue" 
                      padding="p-0" 
                      className="rounded-md overflow-hidden"
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="border-none w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
                        
                        {isLoading ? (
                          "Đang xử lý..."
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Xác nhận thay đổi
                          </>
                        )}
                      </Button>
                    </NeonEffect>
                  </motion.div>
                </motion.form>
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
                    onClick={() => setShowQuestionForm(true)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Thêm câu hỏi mới
                  </Button>
                </div>
                
                {showQuestionForm ? (
                  <QuestionForm 
                    onSubmit={handleAddQuestion}
                    onCancel={() => setShowQuestionForm(false)}
                    isLoading={isLoading}
                  />
                ) : (
                  <QuestionList 
                    questions={examQuestions}
                    selectedQuestions={selectedQuestions}
                    onToggleQuestion={handleToggleQuestion}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                  />
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default EditExam;
