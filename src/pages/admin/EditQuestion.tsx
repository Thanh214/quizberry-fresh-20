
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { AlertTriangle, ChevronLeft, Save, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  const isNewQuestion = id === "new";

  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState<
    Array<{ id: string; content: string; isCorrect: boolean }>
  >([
    { id: "1", content: "", isCorrect: false },
    { id: "2", content: "", isCorrect: false },
    { id: "3", content: "", isCorrect: false },
    { id: "4", content: "", isCorrect: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Kiểm tra quyền admin
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      navigate("/role-selection");
      return;
    }

    // Nếu chỉnh sửa câu hỏi đã có, tải dữ liệu
    if (!isNewQuestion) {
      const question = questions.find((q) => q.id === id);
      if (question) {
        setQuestionContent(question.content);
        setOptions(question.options);
      } else {
        toast.error("Không tìm thấy câu hỏi");
        navigate("/admin/questions");
      }
    }
  }, [id, isNewQuestion, navigate, questions, user]);

  const handleOptionChange = (
    index: number,
    field: "content" | "isCorrect",
    value: string | boolean
  ) => {
    const newOptions = [...options];
    if (field === "isCorrect") {
      // Bỏ chọn tất cả các tùy chọn khác
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      newOptions[index] = {
        ...newOptions[index],
        [field]: value as string, // Ép kiểu value thành string khi field là "content"
      };
    }
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) { // Cho phép tối đa 6 tùy chọn
      setOptions([
        ...options,
        { id: `${options.length + 1}`, content: "", isCorrect: false }
      ]);
    } else {
      toast.warning("Không thể thêm quá 6 tùy chọn");
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) { // Duy trì ít nhất 2 tùy chọn
      const newOptions = [...options];
      newOptions.splice(index, 1);
      
      // Nếu xóa tùy chọn đúng, đặt tùy chọn đầu tiên làm tùy chọn đúng
      if (options[index].isCorrect && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }
      
      setOptions(newOptions);
    } else {
      toast.warning("Cần có ít nhất 2 tùy chọn");
    }
  };

  const handleExit = () => {
    if (questionContent || options.some(o => o.content)) {
      setShowExitConfirm(true);
    } else {
      navigate("/admin/questions");
    }
  };

  const confirmExit = () => {
    navigate("/admin/questions");
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleDelete = () => {
    if (!isNewQuestion) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    if (!isNewQuestion && id) {
      try {
        setIsLoading(true);
        await deleteQuestion(id);
        toast.success("Đã xóa câu hỏi thành công");
        navigate("/admin/questions");
      } catch (error) {
        toast.error("Không thể xóa câu hỏi");
      } finally {
        setIsLoading(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra hợp lệ
    if (!questionContent.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    if (options.some((option) => !option.content.trim())) {
      toast.error("Vui lòng nhập đầy đủ nội dung các đáp án");
      return;
    }

    if (!options.some((option) => option.isCorrect)) {
      toast.error("Vui lòng chọn đáp án đúng");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isNewQuestion) {
        await addQuestion({
          content: questionContent,
          options: options,
        });
        toast.success("Thêm câu hỏi thành công");
      } else {
        await updateQuestion(id!, {
          content: questionContent,
          options: options,
        });
        toast.success("Cập nhật câu hỏi thành công");
      }
      
      navigate("/admin/questions");
    } catch (error) {
      toast.error("Không thể lưu câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <button
            className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            onClick={handleExit}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách
          </button>
        </header>

        {/* Xác nhận thoát khi có thay đổi chưa lưu */}
        <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận thoát</DialogTitle>
            </DialogHeader>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Bạn có thay đổi chưa được lưu. Nếu thoát, các thay đổi sẽ bị mất.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelExit}>
                Ở lại
              </Button>
              <Button variant="destructive" onClick={confirmExit}>
                Thoát và hủy thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Xác nhận xóa câu hỏi */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa câu hỏi</DialogTitle>
            </DialogHeader>
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive-foreground">
                Bạn có chắc chắn muốn xóa câu hỏi này? Thao tác này không thể khôi phục.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelDelete}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
                {isLoading ? "Đang xóa..." : "Xóa câu hỏi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TransitionWrapper delay={300}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isNewQuestion ? "Thêm câu hỏi mới" : "Chỉnh sửa câu hỏi"}
            </h1>
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={400}>
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="question-content">
                  Nội dung câu hỏi
                </label>
                <textarea
                  id="question-content"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nhập nội dung câu hỏi"
                  rows={3}
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Các đáp án:</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddOption}
                    className="h-8"
                  >
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
                      onChange={() => handleOptionChange(index, "isCorrect", true)}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder={`Đáp án ${index + 1}`}
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(index, "content", e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        className="h-9 w-9 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Chọn đáp án đúng bằng cách click vào nút radio bên trái
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                {!isNewQuestion && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="mr-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa câu hỏi
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExit}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isLoading ? (
                    <span className="animate-pulse">Đang lưu...</span>
                  ) : (
                    "Lưu câu hỏi"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default EditQuestion;
