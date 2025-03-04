import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addQuestion } = useQuiz();

  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState<
    Array<{ id: string; content: string; isCorrect: boolean }>
  >([
    { id: "1", content: "", isCorrect: true },
    { id: "2", content: "", isCorrect: false },
    { id: "3", content: "", isCorrect: false },
    { id: "4", content: "", isCorrect: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleAddQuestion = async () => {
    try {
      const newQuestion = await addQuestion({
        content: questionContent,
        options: options,
        updatedAt: new Date().toISOString(),
      });
      
      if (newQuestion && newQuestion.id) {
        setQuestionContent("");
        setOptions([
          { id: "1", content: "", isCorrect: true },
          { id: "2", content: "", isCorrect: false },
          { id: "3", content: "", isCorrect: false },
          { id: "4", content: "", isCorrect: false },
        ]);
        setShowQuestionForm(false);
        toast.success("Thêm câu hỏi thành công");
      }
    } catch (error) {
      toast.error("Không thể thêm câu hỏi");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <h1 className="text-2xl font-bold">Tạo bài thi</h1>
        </header>

        <TransitionWrapper>
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Thêm câu hỏi</h2>
            {showQuestionForm ? (
              <form onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }} className="space-y-4">
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
                      onChange={() => {
                        const newOptions = options.map((opt, i) => ({
                          ...opt,
                          isCorrect: i === index,
                        }));
                        setOptions(newOptions);
                      }}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <Input
                      type="text"
                      placeholder={`Đáp án ${index + 1}`}
                      value={option.content}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].content = e.target.value;
                        setOptions(newOptions);
                      }}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuestionForm(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang lưu..." : "Lưu câu hỏi"}
                </Button>
              </form>
            ) : (
              <Button
                onClick={() => setShowQuestionForm(true)}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Thêm câu hỏi mới
              </Button>
            )}
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default CreateExam;
