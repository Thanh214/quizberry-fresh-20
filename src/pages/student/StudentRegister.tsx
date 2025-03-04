
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NeonEffect from "@/components/NeonEffect";
import { Loader2, AlertCircle } from "lucide-react";
import NeonDecoration from "@/components/NeonDecoration";
import { Badge } from "@/components/ui/badge";

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codeFromURL = searchParams.get("code");
  
  const { loginAsStudent } = useAuth();
  const { getExamByCode, addParticipant } = useExam();
  
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examCode, setExamCode] = useState(codeFromURL || "");
  const [isLoading, setIsLoading] = useState(false);
  const [examInfo, setExamInfo] = useState<{title: string; description?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for exam code in URL params
  useEffect(() => {
    if (codeFromURL) {
      setExamCode(codeFromURL);
      validateExamCode(codeFromURL);
    }
  }, [codeFromURL]);

  // Validate exam code and show exam info
  const validateExamCode = (code: string) => {
    if (!code) {
      setExamInfo(null);
      setError(null);
      return;
    }
    
    const exam = getExamByCode(code.trim().toUpperCase());
    if (exam && exam.isActive) {
      setExamInfo({
        title: exam.title,
        description: exam.description
      });
      setError(null);
    } else {
      setExamInfo(null);
      if (code.trim()) {
        setError("Không tìm thấy bài thi hoặc bài thi chưa được kích hoạt");
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Kiểm tra mã bài thi
      const code = examCode.trim().toUpperCase();
      const exam = getExamByCode(code);
      
      if (!exam) {
        console.log("Looking for exam with code:", code);
        toast.error("Mã bài thi không hợp lệ hoặc không tồn tại");
        setError("Mã bài thi không hợp lệ hoặc không tồn tại");
        setIsLoading(false);
        return;
      }
      
      if (!exam.isActive) {
        toast.error("Bài thi này chưa được mở");
        setError("Bài thi này chưa được mở");
        setIsLoading(false);
        return;
      }
      
      // Thêm thông tin tham gia
      await addParticipant(exam.id, name, studentId, className);
      
      // Đăng nhập học sinh
      await loginAsStudent(name, className, studentId, code);
      
      // Lưu thông tin vào localStorage để dùng sau này
      localStorage.setItem("studentExamCode", code);
      
      // Chuyển hướng đến trang chờ
      toast.success("Đăng ký tham gia thành công!");
      
      if (exam.hasStarted) {
        navigate("/student/quiz");
      } else {
        navigate("/student/waiting");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error((error as Error).message || "Không thể đăng ký tham gia");
      setError((error as Error).message || "Không thể đăng ký tham gia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chuyển đổi thành chữ in hoa và loại bỏ khoảng trắng
    const code = e.target.value.toUpperCase().trim();
    setExamCode(code);
    validateExamCode(code);
  };

  return (
    <Layout>
      <NeonDecoration color="purple" position="top-left" size="lg" opacity={0.1} animate />
      <NeonDecoration color="blue" position="bottom-right" size="md" opacity={0.1} animate />
      
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <div className="flex items-center justify-center mb-8">
            <Logo className="drop-shadow-[0_0_15px_rgba(107,70,193,0.5)]" />
          </div>
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

              {examInfo && (
                <div className="p-4 border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Bài thi: {examInfo.title}</h3>
                    <Badge variant="success" neon neonColor="green">Đã tìm thấy</Badge>
                  </div>
                  {examInfo.description && (
                    <p className="text-sm text-muted-foreground mt-1">{examInfo.description}</p>
                  )}
                </div>
              )}

              {error && (
                <div className="p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

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
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
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
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
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
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="examCode">
                    Mã bài thi
                  </label>
                  <div className="relative">
                    <Input
                      id="examCode"
                      placeholder="ABC123"
                      required
                      value={examCode}
                      onChange={handleExamCodeChange}
                      className="uppercase transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                    />
                    {examInfo && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mã demo để test: DEMO123
                  </p>
                </div>
                
                <NeonEffect color="purple" padding="p-0" className="overflow-hidden rounded-md w-full mt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Tham gia ngay"
                    )}
                  </Button>
                </NeonEffect>
              </form>

              <div className="text-center text-sm">
                <button 
                  className="text-muted-foreground hover:text-primary transition-colors"
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
