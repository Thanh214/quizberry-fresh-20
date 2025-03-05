
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQuiz } from "@/context/QuizContext";
import { Question, Option } from "@/types/models";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowLeft, Save, Plus, AlertTriangle } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import Card from "@/components/Card";

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
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chỉnh sửa câu hỏi</h1>
          <Button 
            onClick={() => navigate("/admin/questions")}
            variant="outline"
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </header>
        
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung câu hỏi
            </label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full transition-all focus:ring-2 focus:ring-primary/50"
              placeholder="Nhập nội dung câu hỏi"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Đáp án</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddOption}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm đáp án
              </Button>
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.div 
                  key={option.id} 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={option.isCorrect}
                      onChange={() => handleOptionCorrectChange(index)}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                  </label>
                  <Input
                    value={option.content}
                    onChange={(e) => handleOptionContentChange(index, e.target.value)}
                    className="flex-1 transition-all focus:ring-2 focus:ring-primary/50"
                    placeholder={`Đáp án ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="rounded-full hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {options.length < 3 && (
              <div className="mt-3 flex items-center text-amber-600 text-sm gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Nên có ít nhất 3 đáp án cho mỗi câu hỏi</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
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
              <NeonEffect color="blue" padding="p-0" className="rounded-md overflow-hidden inline-block">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="gap-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-none"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </NeonEffect>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default EditQuestion;
