
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { useQuiz } from "@/context/QuizContext";
import { Question } from "@/types/models";
import { toast } from "sonner";
import { ChevronLeft, Plus, Trash2, Save, Clock, AlertTriangle } from "lucide-react";

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { questions, fetchQuestions } = useQuiz();
  const { exams, createExam, updateExam } = useExam();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60); // Mặc định 60 phút
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionToRemove, setQuestionToRemove] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const isEditing = !!id;

  useEffect(() => {
    // Kiểm tra quyền giáo viên
    if (!user || user.role !== "teacher") {
      navigate("/role-selection");
      return;
    }

    // Tải danh sách câu hỏi
    const loadQuestions = async () => {
      try {
        await fetchQuestions();
      } catch (error) {
        toast.error("Không thể tải danh sách câu hỏi");
      }
    };

    loadQuestions();
    
    // Nếu đang chỉnh sửa, tải thông tin bài thi
    if (isEditing) {
      const exam = exams.find(e => e.id === id);
      if (exam) {
        setTitle(exam.title);
        setDescription(exam.description || "");
        setDuration(exam.duration);
        setSelectedQuestions(exam.questionIds);
      } else {
        toast.error("Không tìm thấy bài thi");
        navigate("/teacher/exams");
      }
    }
  }, [user, navigate, fetchQuestions, isEditing, id, exams]);

  // Cập nhật danh sách câu hỏi có sẵn
  useEffect(() => {
    setAvailableQuestions(questions);
  }, [questions]);

  const handleAddQuestion = (questionId: string) => {
    if (!selectedQuestions.includes(questionId)) {
      setSelectedQuestions([...selectedQuestions, questionId]);
      toast.success("Đã thêm câu hỏi vào đề thi");
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    // Hiển thị xác nhận trước khi xóa
    setQuestionToRemove(questionId);
  };

  const confirmRemoveQuestion = () => {
    if (questionToRemove) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionToRemove));
      setQuestionToRemove(null);
      toast.success("Đã xóa câu hỏi khỏi đề thi");
    }
  };

  const cancelRemoveQuestion = () => {
    setQuestionToRemove(null);
  };

  const handleExit = () => {
    if (title || description || selectedQuestions.length > 0) {
      setShowExitConfirm(true);
    } else {
      navigate("/teacher/exams");
    }
  };

  const confirmExit = () => {
    navigate("/teacher/exams");
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu hợp lệ
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi");
      return;
    }
    
    if (selectedQuestions.length === 0) {
      toast.error("Vui lòng chọn ít nhất một câu hỏi");
      return;
    }
    
    if (duration < 1) {
      toast.error("Thời gian thi phải lớn hơn 0 phút");
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isEditing) {
        // Cập nhật bài thi
        await updateExam(id, {
          title,
          description,
          duration,
          questionIds: selectedQuestions,
          updatedAt: new Date().toISOString()
        });
        toast.success("Cập nhật bài thi thành công");
      } else {
        // Tạo bài thi mới
        await createExam(title, description, duration, selectedQuestions);
        toast.success("Tạo bài thi thành công");
      }
      
      navigate("/teacher/exams");
    } catch (error) {
      toast.error(isEditing ? "Không thể cập nhật bài thi" : "Không thể tạo bài thi");
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
            Quay lại danh sách đề thi
          </button>
        </header>

        {/* Xác nhận khi thoát có thay đổi chưa lưu */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-3">Xác nhận thoát</h3>
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Bạn có thay đổi chưa được lưu. Nếu thoát, các thay đổi sẽ bị mất.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-input rounded-md text-sm"
                  onClick={cancelExit}
                >
                  Ở lại
                </button>
                <button 
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm"
                  onClick={confirmExit}
                >
                  Thoát và hủy thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Xác nhận xóa câu hỏi */}
        {questionToRemove && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-3">Xác nhận xóa câu hỏi</h3>
              <p className="mb-5 text-muted-foreground">Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề thi?</p>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 border border-input rounded-md text-sm"
                  onClick={cancelRemoveQuestion}
                >
                  Hủy
                </button>
                <button 
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm"
                  onClick={confirmRemoveQuestion}
                >
                  Xóa câu hỏi
                </button>
              </div>
            </div>
          </div>
        )}

        <TransitionWrapper delay={300}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isEditing ? "Chỉnh sửa đề thi" : "Tạo đề thi mới"}
            </h1>
          </div>
        </TransitionWrapper>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form thông tin đề thi */}
          <div className="md:col-span-1">
            <TransitionWrapper delay={400}>
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="title">
                      Tiêu đề bài thi
                    </label>
                    <input
                      id="title"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Nhập tiêu đề bài thi"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="description">
                      Mô tả bài thi (tùy chọn)
                    </label>
                    <textarea
                      id="description"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Nhập mô tả bài thi"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center" htmlFor="duration">
                      <Clock className="h-4 w-4 mr-1" />
                      Thời gian làm bài (phút)
                    </label>
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Đã chọn {selectedQuestions.length} câu hỏi
                    </p>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Đang lưu..." : isEditing ? "Cập nhật đề thi" : "Tạo đề thi"}
                    </button>
                  </div>
                </form>
              </Card>
            </TransitionWrapper>
          </div>

          {/* Danh sách câu hỏi */}
          <div className="md:col-span-2">
            <TransitionWrapper delay={500}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h2>

                <div className="grid gap-4 mb-6">
                  {availableQuestions.map(question => (
                    <div 
                      key={question.id} 
                      className={`p-4 border rounded-lg transition-all ${
                        selectedQuestions.includes(question.id) 
                          ? "border-primary bg-primary/5" 
                          : "border-border"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{question.content}</p>
                          <ul className="mt-2 space-y-1">
                            {question.options.map(option => (
                              <li 
                                key={option.id} 
                                className={`text-sm ${option.isCorrect ? "text-green-600" : "text-muted-foreground"}`}
                              >
                                {option.content} {option.isCorrect && "✓"}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          {selectedQuestions.includes(question.id) ? (
                            <button
                              type="button"
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              onClick={() => handleRemoveQuestion(question.id)}
                              title="Xóa câu hỏi khỏi đề thi"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="p-1 text-primary hover:text-primary/80 transition-colors"
                              onClick={() => handleAddQuestion(question.id)}
                              title="Thêm câu hỏi vào đề thi"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {availableQuestions.length === 0 && (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <p className="text-muted-foreground">Chưa có câu hỏi nào trong hệ thống</p>
                      <button
                        type="button"
                        className="mt-2 text-primary hover:underline"
                        onClick={() => navigate("/admin/questions/new")}
                      >
                        Tạo câu hỏi mới
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </TransitionWrapper>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateExam;
