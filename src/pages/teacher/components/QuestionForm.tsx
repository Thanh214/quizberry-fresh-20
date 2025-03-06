
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Option } from "@/types/models";
import { toast } from "sonner";

interface QuestionFormProps {
  onSubmit: (content: string, options: Option[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "1", content: "", isCorrect: true },
    { id: "2", content: "", isCorrect: false },
    { id: "3", content: "", isCorrect: false },
    { id: "4", content: "", isCorrect: false },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!questionContent.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }
    
    if (options.some(opt => !opt.content.trim())) {
      toast.error("Vui lòng nhập nội dung cho tất cả các đáp án");
      return;
    }
    
    await onSubmit(questionContent, options);
  };

  const handleOptionCorrectChange = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleOptionContentChange = (index: number, content: string) => {
    const newOptions = [...options];
    newOptions[index].content = content;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="question-content">
          Nội dung câu hỏi
        </label>
        <Input
          id="question-content"
          placeholder="Nhập nội dung câu hỏi"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
          required
        />
      </div>
      
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center space-x-3">
          <input
            type="radio"
            id={`correct-${option.id}`}
            name="correct-option"
            checked={option.isCorrect}
            onChange={() => handleOptionCorrectChange(index)}
            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
          />
          <Input
            type="text"
            placeholder={`Đáp án ${index + 1}`}
            value={option.content}
            onChange={(e) => handleOptionContentChange(index, e.target.value)}
            className="flex-1"
            required
          />
        </div>
      ))}
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Đang lưu..." : "Lưu câu hỏi"}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
