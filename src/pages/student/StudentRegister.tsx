import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, isLoading } = useAuth();
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim() || !className.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    try {
      await loginAsStudent(studentName, className);
      toast.success("Đăng ký thành công");
      navigate("/student/quiz");
    } catch (error) {
      toast.error("Đăng ký thất bại");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-12" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Thông tin học sinh</h1>
                <p className="text-sm text-muted-foreground">
                  Nhập thông tin của bạn để bắt đầu bài kiểm tra
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="studentName">
                    Họ và tên
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="studentName"
                    placeholder="Nguyễn Văn A"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="className">
                    Lớp
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="className"
                    placeholder="10A1"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                <button
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : (
                    "Bắt đầu bài kiểm tra"
                  )}
                </button>
              </form>

              <div className="text-center text-sm">
                <button 
                  className="text-primary hover:underline hover:text-primary/80"
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
