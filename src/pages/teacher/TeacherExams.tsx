
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, Plus } from "lucide-react";

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { exams, deleteExam, activateExam } = useQuiz();
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/role-selection");
    }
  }, [isAuthenticated, user, navigate]);

  const handleDeleteExam = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa bài thi này?")) {
      try {
        await deleteExam(id);
        toast.success("Xóa bài thi thành công");
      } catch (error) {
        toast.error("Không thể xóa bài thi");
        console.error(error);
      }
    }
  };

  const handleActivateExam = async (id: string) => {
    try {
      await activateExam(id);
      toast.success("Kích hoạt bài thi thành công");
    } catch (error) {
      toast.error("Không thể kích hoạt bài thi");
      console.error(error);
    }
  };

  const handleCreateExam = () => {
    navigate("/teacher/create-exam");
  };

  return (
    <Layout>
      <div className="min-h-screen pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Quản lý bài thi</h1>
          </div>
          <Button onClick={handleCreateExam} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo bài thi mới
          </Button>
        </div>

        <TransitionWrapper>
          <Card className="mb-8 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách bài thi</h2>
            </div>

            {!exams || exams.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">Chưa có bài thi nào</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bấm vào nút "Tạo bài thi mới" để tạo bài thi đầu tiên
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {exams.map((exam) => (
                  <Card key={exam.id} className="border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium">{exam.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="default"
                          className={`text-primary-foreground ${
                            exam.isActive 
                              ? "bg-red-500 hover:bg-red-600" 
                              : "bg-green-500 hover:bg-green-600"
                          } transition-colors`}
                          onClick={() => handleActivateExam(exam.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {exam.isActive ? "Đóng bài thi" : "Mở bài thi"}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteExam(exam.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{exam.description}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Mã bài thi:</span> {exam.code}
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Trạng thái:</span>{" "}
                      <span className={exam.isActive ? "text-green-500" : "text-red-500"}>
                        {exam.isActive ? "Đang mở" : "Đã đóng"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default TeacherExams;
