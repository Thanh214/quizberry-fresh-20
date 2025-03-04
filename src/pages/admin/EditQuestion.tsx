
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQuiz } from "@/context/QuizContext";
import { Question, Option } from "@/types/models";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const EditQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, updateQuestion, deleteQuestion } = useQuiz();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load question data
  useEffect(() => {
    if (id) {
      const foundQuestion = questions.find(q => q.id === id);
      if (foundQuestion) {
        setQuestion(foundQuestion);
        setContent(foundQuestion.content);
        setOptions([...foundQuestion.options]);
      } else {
        toast.error("Câu hỏi không tồn tại");
        navigate("/admin/questions");
      }
    }
  }, [id, questions, navigate]);
  
  const handleOptionContentChange = (index: number, newContent: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], content: newContent };
    setOptions(newOptions);
  };
  
  const handleOptionCorrectChange = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };
  
  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error("Số lượng đáp án tối đa là 6");
      return;
    }
    
    const newOption: Option = {
      id: `new-option-${Date.now()}`,
      content: "",
      isCorrect: false,
    };
    
    setOptions([...options, newOption]);
  };
  
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("Cần ít nhất 2 đáp án");
      return;
    }
    
    // If removing the correct option, make the first remaining option correct
    const removingCorrectOption = options[index].isCorrect;
    
    const newOptions = options.filter((_, i) => i !== index);
    
    if (removingCorrectOption && newOptions.length > 0) {
      newOptions[0] = { ...newOptions[0], isCorrect: true };
    }
    
    setOptions(newOptions);
  };
  
  const handleSave = async () => {
    if (!id) return;
    
    // Validations
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }
    
    if (options.length < 2) {
      toast.error("Cần ít nhất 2 đáp án");
      return;
    }
    
    if (!options.some(opt => opt.isCorrect)) {
      toast.error("Cần chọn ít nhất 1 đáp án đúng");
      return;
    }
    
    if (options.some(opt => !opt.content.trim())) {
      toast.error("Vui lòng nhập nội dung cho tất cả các đáp án");
      return;
    }
    
    // Update question
    try {
      setIsLoading(true);
      
      await updateQuestion(id, {
        content,
        options,
      });
      
      toast.success("Cập nhật câu hỏi thành công");
      navigate("/admin/questions");
    } catch (error) {
      toast.error("Không thể cập nhật câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      try {
        setIsLoading(true);
        await deleteQuestion(id);
        toast.success("Xóa câu hỏi thành công");
        navigate("/admin/questions");
      } catch (error) {
        toast.error("Không thể xóa câu hỏi");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!question) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Chỉnh sửa câu hỏi</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung câu hỏi
            </label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full"
              placeholder="Nhập nội dung câu hỏi"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Đáp án</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddOption}
              >
                Thêm đáp án
              </Button>
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`correct-${option.id}`}
                    checked={option.isCorrect}
                    onChange={() => handleOptionCorrectChange(index)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <Input
                    value={option.content}
                    onChange={(e) => handleOptionContentChange(index, e.target.value)}
                    className="flex-1"
                    placeholder={`Đáp án ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Xóa câu hỏi
            </Button>
            
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/questions")}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditQuestion;
