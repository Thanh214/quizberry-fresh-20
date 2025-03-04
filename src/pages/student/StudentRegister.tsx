
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();
  const { getExamByCode, addParticipant } = useExam();
  
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Kiểm tra mã bài thi
      const code = examCode.trim().toUpperCase();
      const exam = getExamByCode(code);
      
      if (!exam) {
        toast.error("Mã bài thi không hợp lệ hoặc không tồn tại");
        setIsLoading(false);
        return;
      }
      
      if (!exam.isActive) {
        toast.error("Bài thi này chưa được mở");
        setIsLoading(false);
        return;
      }
      
      // Thêm thông tin tham gia
      await addParticipant(exam.id, name, studentId, className);
      
      // Đăng nhập học sinh
      await loginAsStudent(name, className, studentId, code);
      
      // Chuyển hướng đến trang chờ
      toast.success("Đăng ký tham gia thành công!");
      navigate("/student/quiz");
    } catch (error) {
      toast.error((error as Error).message || "Không thể đăng ký tham gia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chuyển đổi thành chữ in hoa và loại bỏ khoảng trắng
    setExamCode(e.target.value.toUpperCase().trim());
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-8" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md">
            <div className="space-y-6 p-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Đăng ký tham gia thi</h1>
                <p className="text-sm text-muted-foreground">
                  Nhập thông tin của bạn để tham gia bài thi
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="name">
                    Họ và tên
                  </label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="studentId">
                    Mã sinh viên
                  </label>
                  <Input
                    id="studentId"
                    placeholder="SV12345"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="class">
                    Lớp
                  </label>
                  <Input
                    id="class"
                    placeholder="10A1"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="examCode">
                    Mã bài thi
                  </label>
                  <Input
                    id="examCode"
                    placeholder="ABC123"
                    required
                    value={examCode}
                    onChange={handleExamCodeChange}
                    className="uppercase"
                  />
                </div>
                
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : (
                    "Tham gia ngay"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <button 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/role-selection")}
                >
                  Quay lại trang chọn vai trò
                </button>
              </div>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default StudentRegister;
