
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Save } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import { Question } from "@/types/models";

interface ExamPreviewProps {
  selectedQuestions: string[];
  questions: Question[];
  onCreateExam: () => void;
}

const ExamPreview: React.FC<ExamPreviewProps> = ({
  selectedQuestions,
  questions,
  onCreateExam
}) => {
  if (selectedQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">Chưa có câu hỏi nào được chọn</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Hãy quay lại tab "Quản lý câu hỏi" để chọn câu hỏi cho bài thi
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Xem trước bài thi</h2>
        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
          {selectedQuestions.length} câu hỏi đã chọn
        </span>
      </div>
      
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
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${option.isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'}`}>
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <span className={option.isCorrect ? 'text-green-700 font-medium' : ''}>
                    {option.content}
                  </span>
                  {option.isCorrect && (
                    <CheckSquare className="h-4 w-4 text-green-600 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="flex justify-end mt-6">
        <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
          <Button 
            onClick={onCreateExam}
            className="gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
          >
            <Save className="h-4 w-4" />
            Tạo bài thi ({selectedQuestions.length} câu hỏi)
          </Button>
        </NeonEffect>
      </div>
    </div>
  );
};

export default ExamPreview;
