
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { GraduationCap, User, School, ArrowRight } from "lucide-react"; // Import icons for better UI

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, isLoading } = useAuth();
  const { requestQuizAccess, classes } = useQuiz(); // Import quiz context hooks
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission with new request flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input fields
    if (!studentName.trim() || !className.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First check if the class exists and is active
      const classExists = classes.find(c => c.name === className);
      if (!classExists) {
        toast.error("Lớp học không tồn tại trong hệ thống");
        return;
      }
      
      if (!classExists.isQuizActive) {
        toast.error("Bài kiểm tra chưa được mở cho lớp này");
        return;
      }
      
      // Login as student first
      await loginAsStudent(studentName, className);
      
      // Then request access to the quiz
      await requestQuizAccess(studentName, className);
      
      // Navigate to waiting room
      toast.success("Đã gửi yêu cầu tham gia kiểm tra");
      navigate("/student/waiting");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đăng ký thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Logo with enhanced animation */}
        <TransitionWrapper>
          <Logo className="mb-12 animate-float" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md border border-primary/10 bg-card/50 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Enhanced header with icon and gradient */}
              <div className="space-y-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Thông tin học sinh
                </h1>
                <p className="text-sm text-muted-foreground">
                  Nhập thông tin của bạn để đăng ký tham gia bài kiểm tra
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Student name input with icon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none flex items-center gap-2" htmlFor="studentName">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Họ và tên</span>
                  </label>
                  <input
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="studentName"
                    placeholder="Nguyễn Văn A"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                
                {/* Class name input with icon and dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none flex items-center gap-2" htmlFor="className">
                    <School className="w-4 h-4 text-muted-foreground" />
                    <span>Lớp</span>
                  </label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="className"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  >
                    <option value="" disabled>Chọn lớp học</option>
                    {classes.map((c) => (
                      <option 
                        key={c.id} 
                        value={c.name}
                        disabled={!c.isQuizActive}
                      >
                        {c.name} {!c.isQuizActive ? "(Chưa mở)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Chỉ có thể đăng ký lớp học đang mở bài kiểm tra
                  </p>
                </div>
                
                {/* Enhanced submit button */}
                <button
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground transition-all hover:from-primary/90 hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={isLoading || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : (
                    <>
                      <span>Đăng ký tham gia</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Back button with subtle styling */}
              <div className="text-center text-sm">
                <button 
                  className="text-primary hover:underline hover:text-primary/80 inline-flex items-center gap-1"
                  onClick={() => navigate("/role-selection")}
                >
                  <span>Quay lại trang chọn vai trò</span>
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
