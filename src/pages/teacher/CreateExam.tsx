
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
import { ArrowLeft, Save } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import ExamForm from "./components/ExamForm";
import ExamQuestionManager from "./components/ExamQuestionManager";
import ExamPreview from "./components/ExamPreview";

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

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [activeTab, setActiveTab] = useState("questions");

  // Reset the selection when questions change
  useEffect(() => {
    setSelectedQuestions([]);
  }, [questions]);

  const handleCreateExam = async (examData: any) => {
    try {
      if (selectedQuestions.length === 0) {
        toast.error("Vui lòng chọn ít nhất một câu hỏi cho bài thi", {
          id: "no-questions-selected"
        });
        return;
      }
      
      const newExamData = {
        ...examData,
        questionIds: selectedQuestions,
      };
      
      // Create the exam with the selected questions
      await addExam(newExamData);
      
      toast.success("Tạo bài thi thành công", {
        id: "create-exam-success"
      });
      navigate("/teacher/exams");
    } catch (error: any) {
      toast.error(`Không thể tạo bài thi: ${error.message}`, {
        id: "create-exam-error"
      });
      console.error(error);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    navigate(`/admin/questions/edit/${questionId}`);
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Tạo bài thi mới</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/teacher/exams")}
              variant="outline"
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            {selectedQuestions.length > 0 && (
              <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
                <Button 
                  onClick={() => setShowExamForm(true)}
                  className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
                >
                  <Save className="h-4 w-4" />
                  Tạo bài thi ({selectedQuestions.length} câu hỏi)
                </Button>
              </NeonEffect>
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
                <ExamQuestionManager
                  questions={questions}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                  addQuestion={addQuestion}
                  deleteQuestion={deleteQuestion}
                  isLoading={isLoading}
                  onEditQuestion={handleEditQuestion}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card className="p-6">
                <ExamPreview 
                  selectedQuestions={selectedQuestions}
                  questions={questions}
                  onCreateExam={() => setShowExamForm(true)}
                />
              </Card>
            </TabsContent>
          </Tabs>
          
          {showExamForm && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
              onClick={() => setShowExamForm(false)}
            >
              <div 
                className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
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
