
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

/**
 * StudentWaiting component
 * Thành phần này hiển thị phòng chờ cho học sinh sau khi đăng ký
 * Học sinh chờ ở đây để được giáo viên phê duyệt trước khi có thể truy cập bài kiểm tra
 */
const StudentWaiting: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { checkStudentApproval, startQuiz } = useQuiz();
  
  // State để theo dõi trạng thái phê duyệt
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Kiểm tra cập nhật trạng thái
  useEffect(() => {
    if (!user) {
      navigate("/role-selection");
      return;
    }
    
    // Hàm kiểm tra trạng thái
    const checkStatus = async () => {
      try {
        if (user.name && user.className) {
          // Sửa lỗi: bổ sung 2 tham số thiếu cho hàm checkStudentApproval
          // Giả sử 2 tham số còn thiếu là studentId và examId
          const studentId = user.id || '';
          const examId = user.examId || '';
          
          const status = await checkStudentApproval(user.name, user.className, studentId, examId);
          setApprovalStatus(status);
          
          // Nếu được phê duyệt, bắt đầu bài kiểm tra và chuyển hướng
          if (status === "approved") {
            toast.success("Yêu cầu của bạn đã được phê duyệt!");
            // Cũng cần bổ sung các tham số thiếu cho hàm startQuiz
            startQuiz(user.name, user.className, studentId, examId);
            navigate("/student/quiz");
          } 
          // Nếu bị từ chối, hiển thị thông báo và chuyển về trang khác
          else if (status === "rejected") {
            toast.error("Yêu cầu của bạn đã bị từ chối!");
            setTimeout(() => {
              logout();
              navigate("/role-selection");
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    // Kiểm tra ngay lập tức và sau đó thiết lập polling
    checkStatus();
    
    // Kiểm tra mỗi 5 giây
    const intervalId = setInterval(checkStatus, 5000);
    
    // Dọn dẹp interval khi unmount
    return () => clearInterval(intervalId);
  }, [user, navigate, checkStudentApproval, startQuiz, logout]);
  
  // Xử lý nút hủy
  const handleCancel = () => {
    if (window.confirm("Bạn có chắc muốn hủy yêu cầu tham gia bài kiểm tra?")) {
      logout();
      navigate("/role-selection");
    }
  };
  
  // Tính toán thời gian chờ
  const [waitingTime, setWaitingTime] = useState(0);
  
  useEffect(() => {
    // Cập nhật thời gian chờ mỗi giây
    const timer = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Định dạng thời gian chờ
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-12 animate-pulse-light" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md border bg-card/95 backdrop-blur shadow-lg">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold">Đang chờ phê duyệt</h1>
              <p className="text-muted-foreground">
                Vui lòng đợi giáo viên xác nhận yêu cầu tham gia bài kiểm tra của bạn
              </p>
            </div>
            
            {/* Hiển thị trạng thái */}
            <div className="my-8 p-6 rounded-lg bg-secondary/50">
              <div className="space-y-4">
                {/* Thông tin học sinh */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Học sinh:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Lớp:</span>
                  <span className="font-medium">{user?.className}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Thời gian chờ:</span>
                  <span className="font-medium text-primary">{formatTime(waitingTime)}</span>
                </div>
                
                {/* Chỉ báo trạng thái */}
                <div className="pt-4 flex items-center justify-center">
                  {isCheckingStatus ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang kiểm tra trạng thái...</span>
                    </div>
                  ) : approvalStatus === "pending" ? (
                    <div className="flex items-center gap-2 text-amber-500">
                      <Clock className="w-5 h-5" />
                      <span>Đang chờ phê duyệt</span>
                    </div>
                  ) : approvalStatus === "approved" ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-5 h-5" />
                      <span>Đã được phê duyệt</span>
                    </div>
                  ) : approvalStatus === "rejected" ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="w-5 h-5" />
                      <span>Đã bị từ chối</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Không tìm thấy trạng thái</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Nút hủy */}
            <div className="flex justify-center">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Hủy yêu cầu</span>
              </button>
            </div>
            
            {/* Mẹo */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Trang sẽ tự động cập nhật khi có phản hồi từ giáo viên</p>
              <p className="mt-1">Thông tin sẽ được làm mới mỗi 5 giây</p>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default StudentWaiting;
