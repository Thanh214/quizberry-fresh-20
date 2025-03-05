
import React from "react";
import { Question } from "@/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from "@/components/Card";
import EditExamDetails from "../EditExamDetails";
import ExamQuestionManager from "../ExamQuestionManager";
import ExamPreview from "../ExamPreview";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransitionWrapper from "@/components/TransitionWrapper";

interface EditExamTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  examCode: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
  examQuestions: Question[];
  selectedQuestions: string[];
  setSelectedQuestions: (questions: string[]) => void;
  handleAddQuestion: (data: { 
    content: string; 
    options: Array<{ id: string; content: string; isCorrect: boolean }>
  }) => Promise<any>;
  handleDeleteQuestion: (id: string) => Promise<void>;
  handleEditQuestion: (id: string) => void;
  handleCreateExam: () => void;
  allQuestions: Question[];
}

const EditExamTabs: React.FC<EditExamTabsProps> = ({
  activeTab,
  setActiveTab,
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  examCode,
  handleSubmit,
  handleCancel,
  isLoading,
  examQuestions,
  selectedQuestions,
  setSelectedQuestions,
  handleAddQuestion,
  handleDeleteQuestion,
  handleEditQuestion,
  handleCreateExam,
  allQuestions
}) => {
  return (
    <TransitionWrapper delay={100}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="details">Thông tin bài thi</TabsTrigger>
          <TabsTrigger value="questions">Quản lý câu hỏi</TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
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
              examCode={examCode}
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
        
        <TabsContent value="preview">
          <Card className="p-6">
            <ExamPreview 
              selectedQuestions={selectedQuestions}
              questions={allQuestions}
              onCreateExam={handleCreateExam}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </TransitionWrapper>
  );
};

export default EditExamTabs;
