
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Plus } from "lucide-react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import { Question } from "@/types/models";

interface ExamQuestionManagerProps {
  questions: Question[];
  selectedQuestions: string[];
  setSelectedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  addQuestion: (data: { content: string; options: Array<{ id: string; content: string; isCorrect: boolean }> }) => Promise<any>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  onEditQuestion?: (id: string) => void;
}

const ExamQuestionManager: React.FC<ExamQuestionManagerProps> = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  addQuestion,
  deleteQuestion,
  isLoading,
  onEditQuestion
}) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Toggle select all questions
  useEffect(() => {
    if (selectAll) {
      setSelectedQuestions(questions.map(q => q.id));
    } else if (selectedQuestions.length === questions.length && questions.length > 0) {
      // If all questions are selected but the selectAll is toggled off
      setSelectedQuestions([]);
    }
  }, [selectAll, questions, setSelectedQuestions]);

  // Check if all questions are selected to update the selectAll state
  useEffect(() => {
    if (questions.length > 0 && selectedQuestions.length === questions.length) {
      setSelectAll(true);
    } else if (selectAll && selectedQuestions.length !== questions.length) {
      setSelectAll(false);
    }
  }, [selectedQuestions, questions.length, selectAll]);

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

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAllQuestions = () => {
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("Chưa có câu hỏi nào được chọn để xóa");
      return;
    }

    try {
      // Delete all selected questions
      const deletionPromises = selectedQuestions.map(questionId => deleteQuestion(questionId));
      await Promise.all(deletionPromises);
      
      setSelectedQuestions([]);
      toast.success(`Đã xóa ${selectedQuestions.length} câu hỏi`, {
        id: "bulk-delete-success" // Use an ID to prevent duplicate toasts
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa câu hỏi", {
        id: "bulk-delete-error" // Use an ID to prevent duplicate toasts
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium">Danh sách câu hỏi</h2>
          {questions.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={selectAll}
                onCheckedChange={handleSelectAllQuestions} 
              />
              <label 
                htmlFor="select-all" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Chọn tất cả
              </label>
              <span className="text-sm text-muted-foreground">
                ({selectedQuestions.length}/{questions.length})
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {selectedQuestions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa đã chọn ({selectedQuestions.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa {selectedQuestions.length} câu hỏi đã chọn? 
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Xác nhận xóa</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button 
            onClick={() => setShowQuestionForm(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi mới
          </Button>
        </div>
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
          onEditQuestion={onEditQuestion}
          onDeleteQuestion={deleteQuestion}
          onSelectAll={() => setSelectAll(true)}
          onDeselectAll={() => setSelectAll(false)}
        />
      )}
    </>
  );
};

export default ExamQuestionManager;
