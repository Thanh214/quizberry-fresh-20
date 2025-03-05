
import React, { useState } from "react";
import { Question } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import NeonEffect from "@/components/NeonEffect";
import { motion, AnimatePresence } from "framer-motion";

interface ExamQuestionManagerProps {
  questions: Question[];
  selectedQuestions: string[];
  setSelectedQuestions: (questionIds: string[]) => void;
  addQuestion: (data: { 
    content: string; 
    options: Array<{ id: string; content: string; isCorrect: boolean }>
  }) => Promise<any>;
  deleteQuestion: (id: string) => Promise<void>;
  isLoading: boolean;
  onEditQuestion: (id: string) => void;
}

const ExamQuestionManager: React.FC<ExamQuestionManagerProps> = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  addQuestion,
  deleteQuestion,
  isLoading,
  onEditQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Filter questions based on search term
  const filteredQuestions = questions.filter(
    (question) => question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      await deleteQuestion(id);
    }
  };

  const handleAddQuestion = async (data: { 
    content: string; 
    options: Array<{ id: string; content: string; isCorrect: boolean }> 
  }) => {
    try {
      const question = await addQuestion(data);
      setShowForm(false);
      return question;
    } catch (error) {
      console.error("Failed to add question:", error);
      throw error;
    }
  };

  const handleSelectAll = () => {
    if (filteredQuestions.length === 0) return;
    setSelectedQuestions(filteredQuestions.map((q) => q.id));
  };

  const handleDeselectAll = () => {
    setSelectedQuestions([]);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <NeonEffect color="blue" padding="p-0" className="rounded-md overflow-hidden">
              <Button
                onClick={() => setShowForm(true)}
                className="gap-1 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-none"
              >
                <Plus className="h-4 w-4" />
                Tạo câu hỏi mới
              </Button>
            </NeonEffect>
          </div>

          {filteredQuestions.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">{selectedQuestions.length}</span> / {filteredQuestions.length} câu hỏi được chọn
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs flex items-center gap-1"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Chọn tất cả
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="text-xs flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Bỏ chọn tất cả
                </Button>
              </div>
            </div>
          )}

          <QuestionList
            questions={filteredQuestions}
            selectedQuestions={selectedQuestions}
            onToggleQuestion={handleToggleQuestion}
            onEditQuestion={onEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuestionForm
              onSubmit={handleAddQuestion}
              onCancel={() => setShowForm(false)}
              isLoading={isLoading}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ExamQuestionManager;
