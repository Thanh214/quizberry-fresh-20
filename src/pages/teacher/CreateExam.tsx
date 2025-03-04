
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exam, Question } from "@/types/models";
import QuestionForm from "./components/QuestionForm";
import ExamForm from "./components/ExamForm";
import QuestionList from "./components/QuestionList";

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    questions, 
    addQuestion, 
    deleteQuestion, 
    addExam,
    isLoading 
  } = useQuiz();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("questions");

  // Reset the selection when questions change
  useEffect(() => {
    setSelectedQuestions([]);
  }, [questions]);

  const handleAddQuestion = async (content: string, options: Array<{ id: string; content: string; isCorrect: boolean }>) => {
    try {
      await addQuestion({
        content,
        options,
      });
      
      setShowQuestionForm(false);
      toast.success("Thêm câu hỏi thành công");
    } catch (error) {
      toast.error("Không thể thêm câu hỏi");
      console.error(error);
    }
  };

  const handleCreateExam = async (examData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (selectedQuestions.length === 0) {
        toast.error("Vui lòng chọn ít nhất một câu hỏi cho bài thi");
        return;
      }
      
      const newExamData = {
        ...examData,
        questionIds: selectedQuestions,
      };
      
      await addExam(newExamData);
      
      toast.success("Tạo bài thi thành công");
      navigate("/teacher/exams");
    } catch (error) {
      toast.error("Không thể tạo bài thi");
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
        
        // Remove from selection if it was selected
        setSelectedQuestions(prev => prev.filter(id => id !== questionId));
        
        toast.success("Xóa câu hỏi thành công");
      } catch (error) {
        toast.error("Không thể xóa câu hỏi");
        console.error(error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Tạo bài thi</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/teacher/exams")}
              variant="outline"
            >
              Quay lại
            </Button>
            {selectedQuestions.length > 0 && (
              <Button 
                onClick={() => setShowExamForm(true)}
              >
                Tạo bài thi ({selectedQuestions.length} câu hỏi)
              </Button>
            )}
          </div>
        </header>

        <TransitionWrapper>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="questions">Quản lý câu hỏi</TabsTrigger>
              <TabsTrigger value="preview">Xem trước bài thi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Danh sách câu hỏi</h2>
                  <Button 
                    onClick={() => setShowQuestionForm(true)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
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
                    questions={questions}
                    selectedQuestions={selectedQuestions}
                    onToggleQuestion={handleToggleQuestion}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-6">Xem trước bài thi</h2>
                
                {selectedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-muted-foreground">Chưa có câu hỏi nào được chọn</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hãy quay lại tab "Quản lý câu hỏi" để chọn câu hỏi cho bài thi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedQuestions.map((questionId, index) => {
                      const question = questions.find(q => q.id === questionId);
                      if (!question) return null;
                      
                      return (
                        <div key={question.id} className="border border-gray-200 rounded-md p-4">
                          <div className="font-medium mb-3">
                            Câu {index + 1}: {question.content}
                          </div>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span>{option.content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={() => setShowExamForm(true)}
                      >
                        Tạo bài thi ({selectedQuestions.length} câu hỏi)
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
          
          {showExamForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Tạo bài thi mới</h3>
                
                <ExamForm 
                  onSubmit={handleCreateExam}
                  onCancel={() => setShowExamForm(false)}
                  teacherId={user?.id || ""}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default CreateExam;
