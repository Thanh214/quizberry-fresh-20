
import React, { memo } from "react";
import { Question } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Card from "@/components/Card";
import { Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionListProps {
  questions: Question[];
  selectedQuestions: string[];
  onToggleQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

// Tạo component QuestionItem để cải thiện performance
const QuestionItem = memo(({ 
  question, 
  isSelected,
  onToggle,
  onEdit,
  onDelete,
  index
}: { 
  question: Question; 
  isSelected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card 
        className={`p-4 border transition-all duration-300 ${
          isSelected 
            ? 'border-primary/50 bg-primary/5 shadow-sm'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id={`question-${question.id}`}
            checked={isSelected}
            onCheckedChange={onToggle}
            className="mt-1 transition-all duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <div className="flex-1">
            <div className="font-medium">{question.content}</div>
            <div className="mt-2 space-y-1">
              {question.options.map((option, index) => (
                <div key={option.id} className="text-sm flex items-center gap-2">
                  <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-xs ${
                    option.isCorrect 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={option.isCorrect ? "text-green-600 font-medium" : ""}>
                    {option.content}
                  </span>
                  {option.isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

QuestionItem.displayName = 'QuestionItem';

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestions,
  onToggleQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSelectAll = () => {},
  onDeselectAll = () => {},
}) => {
  const allSelected = questions.length > 0 && selectedQuestions.length === questions.length;
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chưa có câu hỏi nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Select All Section - Di chuyển vào trong ExamQuestionManager*/}
      
      {questions.map((question, idx) => (
        <QuestionItem
          key={question.id}
          question={question}
          isSelected={selectedQuestions.includes(question.id)}
          onToggle={() => onToggleQuestion(question.id)}
          onEdit={() => onEditQuestion(question.id)}
          onDelete={() => onDeleteQuestion(question.id)}
          index={idx}
        />
      ))}
    </div>
  );
};

export default memo(QuestionList);
