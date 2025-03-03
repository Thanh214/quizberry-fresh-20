
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { useQuiz } from "@/context/QuizContext";
import { Question, Option } from "@/types/models";
import { toast } from "sonner";
import { 
  ChevronLeft, Plus, Trash2, Save, Clock, AlertTriangle, 
  Search, Filter, CheckCircle, XCircle, PlusCircle, Edit, Bookmark
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { questions, fetchQuestions, addQuestion } = useQuiz();
  const { exams, createExam, updateExam } = useExam();
  
  // Form data states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60); // Mặc định 60 phút
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // UI states
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionToRemove, setQuestionToRemove] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("existing");
  
  // New question form states
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState<
    Array<{ id: string; content: string; isCorrect: boolean }>
  >([
    { id: "1", content: "", isCorrect: false },
    { id: "2", content: "", isCorrect: false },
    { id: "3", content: "", isCorrect: false },
    { id: "4", content: "", isCorrect: false },
  ]);
  
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
        setSelectedQuestions(exam.questionIds || []);
      } else {
        toast.error("Không tìm thấy bài thi");
        navigate("/teacher/exams");
      }
    }
  }, [user, navigate, fetchQuestions, isEditing, id, exams]);

  // Cập nhật danh sách câu hỏi có sẵn
  useEffect(() => {
    // Lọc câu hỏi theo từ khóa tìm kiếm
    const filteredQuestions = searchTerm 
      ? questions.filter(q => 
          q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.options.some(o => o.content.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : questions;
    
    setAvailableQuestions(filteredQuestions);
  }, [questions, searchTerm]);

  // Xử lý thêm câu hỏi vào đề thi
  const handleAddQuestion = (questionId: string) => {
    if (!selectedQuestions.includes(questionId)) {
      setSelectedQuestions([...selectedQuestions, questionId]);
      toast.success("Đã thêm câu hỏi vào đề thi");
    }
  };

  // Xử lý xóa câu hỏi khỏi đề thi
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

  // Xử lý xác nhận thoát
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

  // Xử lý tạo câu hỏi mới
  const handleNewQuestionOptionChange = (
    index: number,
    field: "content" | "isCorrect",
    value: string | boolean
  ) => {
    const newOptions = [...newQuestionOptions];
    if (field === "isCorrect") {
      // Bỏ chọn tất cả các tùy chọn khác
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      newOptions[index] = {
        ...newOptions[index],
        [field]: value as string,
      };
    }
    setNewQuestionOptions(newOptions);
  };

  const resetNewQuestionForm = () => {
    setNewQuestionContent("");
    setNewQuestionOptions([
      { id: "1", content: "", isCorrect: false },
      { id: "2", content: "", isCorrect: false },
      { id: "3", content: "", isCorrect: false },
      { id: "4", content: "", isCorrect: false },
    ]);
  };

  const handleCreateNewQuestion = async () => {
    // Kiểm tra dữ liệu hợp lệ
    if (!newQuestionContent.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    if (newQuestionOptions.some(option => !option.content.trim())) {
      toast.error("Vui lòng nhập đầy đủ nội dung các đáp án");
      return;
    }

    if (!newQuestionOptions.some(option => option.isCorrect)) {
      toast.error("Vui lòng chọn đáp án đúng");
      return;
    }

    try {
      setIsLoading(true);
      
      // Tạo câu hỏi mới
      const newQuestion = await addQuestion({
        content: newQuestionContent,
        options: newQuestionOptions,
      });
      
      // Thêm câu hỏi mới vào đề thi
      setSelectedQuestions(prev => [...prev, newQuestion.id]);
      
      // Reset form và đóng dialog
      resetNewQuestionForm();
      setShowAddQuestionDialog(false);
      setActiveTab("existing");
      
      toast.success("Đã tạo câu hỏi mới và thêm vào đề thi");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo câu hỏi mới");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý submit form tạo đề thi
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

        {/* Dialog thêm câu hỏi mới */}
        <Dialog open={showAddQuestionDialog} onOpenChange={setShowAddQuestionDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Quản lý câu hỏi</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="existing">Câu hỏi có sẵn</TabsTrigger>
                <TabsTrigger value="new">Tạo câu hỏi mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm câu hỏi..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
                  {availableQuestions.length === 0 ? (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">Không tìm thấy câu hỏi phù hợp</p>
                    </div>
                  ) : (
                    availableQuestions.map(question => (
                      <div 
                        key={question.id}
                        className={`p-3 border rounded-md text-sm ${
                          selectedQuestions.includes(question.id) 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-border"
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{question.content}</div>
                          <div>
                            {selectedQuestions.includes(question.id) ? (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Đã chọn
                              </Badge>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleAddQuestion(question.id)}
                                className="h-7 px-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm
                              </Button>
                            )}
                          </div>
                        </div>
                        <ul className="space-y-1 mt-2">
                          {question.options.map((option) => (
                            <li 
                              key={option.id}
                              className={`text-xs px-2 py-1 rounded ${
                                option.isCorrect 
                                  ? "bg-green-50 text-green-600 border border-green-200" 
                                  : "text-muted-foreground"
                              }`}
                            >
                              {option.content} {option.isCorrect && "✓"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="new">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="question-content">
                      Nội dung câu hỏi
                    </label>
                    <textarea
                      id="question-content"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Nhập nội dung câu hỏi"
                      rows={2}
                      value={newQuestionContent}
                      onChange={(e) => setNewQuestionContent(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Các đáp án:</label>
                    <div className="space-y-2 mt-1.5">
                      {newQuestionOptions.map((option, index) => (
                        <div key={option.id} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id={`correct-${option.id}`}
                            name="correct-option"
                            checked={option.isCorrect}
                            onChange={() => handleNewQuestionOptionChange(index, "isCorrect", true)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <input
                            type="text"
                            placeholder={`Đáp án ${index + 1}`}
                            value={option.content}
                            onChange={(e) =>
                              handleNewQuestionOptionChange(index, "content", e.target.value)
                            }
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Chọn đáp án đúng bằng cách click vào nút radio bên trái
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddQuestionDialog(false)}>
                Hủy
              </Button>
              {activeTab === "new" && (
                <Button 
                  onClick={handleCreateNewQuestion} 
                  disabled={isLoading}
                  className="ml-2"
                >
                  {isLoading ? "Đang tạo..." : "Tạo câu hỏi mới"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">
                        Đã chọn {selectedQuestions.length} câu hỏi
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddQuestionDialog(true)}
                        className="h-8"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Thêm câu hỏi
                      </Button>
                    </div>
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

          {/* Danh sách câu hỏi đã chọn */}
          <div className="md:col-span-2">
            <TransitionWrapper delay={500}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Câu hỏi đã chọn</h2>
                  {selectedQuestions.length > 0 && (
                    <Badge variant="outline" className="bg-primary/5">
                      {selectedQuestions.length} câu hỏi
                    </Badge>
                  )}
                </div>
                
                {selectedQuestions.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Bookmark className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Chưa có câu hỏi nào được chọn</p>
                    <Button
                      variant="link"
                      className="mt-2 text-primary hover:underline"
                      onClick={() => setShowAddQuestionDialog(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Thêm câu hỏi ngay
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedQuestions.map((questionId, index) => {
                      const question = questions.find(q => q.id === questionId);
                      return question ? (
                        <div key={question.id} className="p-4 border rounded-lg transition-all border-primary/10 bg-primary/5">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                  {index + 1}
                                </Badge>
                                <p className="font-medium">{question.content}</p>
                              </div>
                              <ul className="mt-2 space-y-1 pl-8">
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
                              <button
                                type="button"
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => handleRemoveQuestion(question.id)}
                                title="Xóa câu hỏi khỏi đề thi"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </Card>
            </TransitionWrapper>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateExam;
