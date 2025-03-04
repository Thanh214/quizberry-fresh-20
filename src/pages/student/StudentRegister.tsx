
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
import { Loader2 } from "lucide-react";

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
      return;
    }
    
    const exam = getExamByCode(code.trim().toUpperCase());
    if (exam && exam.isActive) {
      setExamInfo({
        title: exam.title,
        description: exam.description
      });
    } else {
      setExamInfo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Kiểm tra mã bài thi
      const code = examCode.trim().toUpperCase();
      const exam = getExamByCode(code);
      
      if (!exam) {
        console.log("Looking for exam with code:", code);
        console.log("Available exams:", getExamByCode);
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
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <div className="flex items-center justify-center mb-8">
            <Logo className="h-12 w-12 mr-2 drop-shadow-[0_0_15px_rgba(107,70,193,0.5)]" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">EPUTest</h1>
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
                  <h3 className="font-medium">Bài thi: {examInfo.title}</h3>
                  {examInfo.description && (
                    <p className="text-sm text-muted-foreground mt-1">{examInfo.description}</p>
                  )}
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
                  <Input
                    id="examCode"
                    placeholder="ABC123"
                    required
                    value={examCode}
                    onChange={handleExamCodeChange}
                    className="uppercase transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  />
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
