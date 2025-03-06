
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Option } from "@/types/models";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";

interface QuestionFormProps {
  onSubmit: (data: { 
    content: string; 
    options: Array<{ id: string; content: string; isCorrect: boolean }>
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "temp-1", content: "", isCorrect: true },
    { id: "temp-2", content: "", isCorrect: false },
    { id: "temp-3", content: "", isCorrect: false },
    { id: "temp-4", content: "", isCorrect: false },
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
    
    if (!options.some(opt => opt.isCorrect)) {
      toast.error("Vui lòng chọn ít nhất một đáp án đúng");
      return;
    }
    
    await onSubmit({
      content: questionContent,
      options: options
    });
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

  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error("Tối đa 6 đáp án cho mỗi câu hỏi");
      return;
    }
    
    setOptions([...options, { id: `temp-${Date.now()}`, content: "", isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("Cần ít nhất 2 đáp án cho mỗi câu hỏi");
      return;
    }
    
    const newOptions = [...options];
    
    // If removing the correct option, make the first remaining option correct
    if (newOptions[index].isCorrect) {
      const firstRemainingIndex = index === 0 ? 1 : 0;
      newOptions[firstRemainingIndex].isCorrect = true;
    }
    
    newOptions.splice(index, 1);
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
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Đáp án</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="text-xs flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm đáp án
          </Button>
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
              className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveOption(index)}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        
        <NeonEffect color="blue" padding="p-0" className="rounded-md overflow-hidden">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-none"
          >
            {isLoading ? "Đang lưu..." : "Lưu câu hỏi"}
          </Button>
        </NeonEffect>
      </div>
    </form>
  );
};

export default QuestionForm;
