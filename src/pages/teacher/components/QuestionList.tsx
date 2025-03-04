
import React from "react";
import { Question } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Card from "@/components/Card";
import { Edit2, Trash2 } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  selectedQuestions: string[];
  onToggleQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestions,
  onToggleQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chưa có câu hỏi nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <Card key={question.id} className="p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`question-${question.id}`}
              checked={selectedQuestions.includes(question.id)}
              onCheckedChange={() => onToggleQuestion(question.id)}
            />
            <div className="flex-1">
              <div className="font-medium">{question.content}</div>
              <div className="mt-2 space-y-1">
                {question.options.map((option, index) => (
                  <div key={option.id} className="text-sm flex items-center gap-2">
                    <span className={option.isCorrect ? "text-green-600 font-medium" : "text-gray-500"}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className={option.isCorrect ? "text-green-600 font-medium" : ""}>
                      {option.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditQuestion(question.id)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteQuestion(question.id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;
