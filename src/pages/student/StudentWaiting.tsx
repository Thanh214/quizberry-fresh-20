
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { toast } from "sonner";
import { Clock, Users, AlertCircle, Loader2 } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import NeonDecoration from "@/components/NeonDecoration";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const StudentWaiting: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { 
    getExamByCode, 
    exams, 
    participants, 
    getWaitingParticipants,
    getExamById 
  } = useExam();
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examCode, setExamCode] = useState<string>("");
  const [examId, setExamId] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [waitingCount, setWaitingCount] = useState(0);
  const [waitingPosition, setWaitingPosition] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [waitingTime, setWaitingTime] = useState<string>("0 phút");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng có phải là học sinh đã đăng ký không
    if (!user || user.role !== "student") {
      navigate("/student/register");
      return;
    }

    // Lấy mã bài thi từ localStorage (lưu khi đăng nhập)
    const code = user.examCode || localStorage.getItem("studentExamCode");
    if (!code) {
      navigate("/student/register");
      return;
    }

    setExamCode(code);

    // Kiểm tra trạng thái bài thi
    const checkExamStatus = async () => {
      try {
        const exam = getExamByCode(code);
        if (!exam) {
          toast.error("Không tìm thấy bài thi");
          navigate("/student/register");
          return;
        }

        setExamId(exam.id);

        // Kiểm tra xem bài thi có đang mở không
        if (!exam.isActive) {
          toast.error("Bài thi đã bị đóng");
          navigate("/student/register");
          return;
        }

        // Hiển thị thời gian làm bài
        setTimeLeft(exam.duration * 60);
        
        // Kiểm tra xem bài thi đã bắt đầu chưa
        setHasStarted(exam.hasStarted);

        // Nếu bài thi đã bắt đầu, chuyển đến trang làm bài
        if (exam.hasStarted) {
          startQuiz();
          return;
        }

        // Cập nhật số người đang chờ và vị trí trong hàng chờ
        const waitingParticipants = getWaitingParticipants(exam.id);
        setWaitingCount(waitingParticipants.length);
        
        // Tìm vị trí của người dùng hiện tại trong hàng chờ
        const studentId = user.studentId || "";
        const position = waitingParticipants.findIndex(p => p.studentId === studentId) + 1;
        setWaitingPosition(position);

        // Calculate waiting time
        const waitingParticipant = waitingParticipants.find(p => p.studentId === studentId);
        if (waitingParticipant) {
          const startTime = new Date(waitingParticipant.startTime);
          const timeWaited = formatDistance(new Date(), startTime, { 
            addSuffix: false,
            locale: vi 
          });
          setWaitingTime(timeWaited);
        }

        setIsCheckingStatus(false);

        // Kiểm tra trạng thái bài thi mỗi 5 giây
        const interval = setInterval(() => {
          const updatedExam = getExamById(exam.id);
          if (updatedExam && updatedExam.hasStarted) {
            setHasStarted(true);
            startQuiz();
            clearInterval(interval);
          }
          
          // Update waiting count
          const currentWaitingParticipants = getWaitingParticipants(exam.id);
          setWaitingCount(currentWaitingParticipants.length);
          
          // Update waiting time
          const participant = currentWaitingParticipants.find(p => p.studentId === studentId);
          if (participant) {
            const startTime = new Date(participant.startTime);
            const timeWaited = formatDistance(new Date(), startTime, { 
              addSuffix: false,
              locale: vi 
            });
            setWaitingTime(timeWaited);
          }
        }, 5000);

        return () => clearInterval(interval);

      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái bài thi:", error);
        toast.error("Đã xảy ra lỗi khi kiểm tra trạng thái");
      }
    };

    checkExamStatus();
  }, [user, navigate, participants, getExamByCode, getWaitingParticipants, getExamById]);

  // Cập nhật bộ đếm thời gian
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Chuyển đổi giây thành định dạng phút:giây
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    navigate("/student/quiz");
  };

  const handleExitWaiting = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    logout();
    navigate("/role-selection");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        {/* Neon decorations */}
        <NeonDecoration color="purple" position="top-right" size="md" />
        <NeonDecoration color="blue" position="bottom-left" size="sm" />
        
        <TransitionWrapper>
          <div className="flex items-center justify-center mb-6">
            <Logo className="h-12 w-12 mr-2 drop-shadow-[0_0_15px_rgba(107,70,193,0.5)]" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">EPUTest</h1>
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md text-center p-8 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-10"></div>
            
            <div className="relative z-10">
              {isCheckingStatus ? (
                <div className="py-6 space-y-4">
                  <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Đang tải thông tin...</h2>
                  <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
                </div>
              ) : hasStarted ? (
                <div className="py-6 space-y-6">
                  <h2 className="text-2xl font-bold">Bài thi đã bắt đầu!</h2>
                  <p className="text-muted-foreground">
                    Nhấn nút bên dưới để bắt đầu làm bài ngay
                  </p>
                  
                  <NeonEffect color="green" padding="p-0" className="w-full overflow-hidden rounded-md mt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none text-white"
                      onClick={startQuiz}
                    >
                      Bắt đầu làm bài
                    </Button>
                  </NeonEffect>
                </div>
              ) : (
                <div className="py-6 space-y-6">
                  <div className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Đang chờ bài thi bắt đầu</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold">Phòng chờ</h2>
                  <p className="text-muted-foreground">
                    Giáo viên sẽ bắt đầu bài thi cho tất cả học sinh. Vui lòng đợi...
                  </p>

                  {/* Live waiting progress animation */}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Đã chờ: {waitingTime}
                    </p>
                    <Progress
                      value={Math.random() * 100}
                      className="h-2 bg-muted overflow-hidden"
                    >
                      <div className="h-full animate-pulse bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    </Progress>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Số người chờ</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{waitingCount}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Thời gian làm bài</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                      </p>
                    </div>
                  </div>

                  {waitingPosition > 0 && (
                    <div className="mt-4 p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-center">
                        <span className="font-medium">Vị trí của bạn:</span>{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-bold">{waitingPosition}</span> trong hàng chờ
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    Bài thi sẽ tự động bắt đầu khi giáo viên khởi động. Vui lòng không tắt trình duyệt.
                  </div>
                  
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleExitWaiting}
                    >
                      Thoát khỏi hàng chờ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TransitionWrapper>
      </div>
      
      <ConfirmationDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={confirmExit}
        title="Xác nhận thoát"
        description="Bạn có chắc chắn muốn thoát khỏi hàng chờ? Bạn sẽ phải đăng ký lại để tham gia bài thi."
        confirmText="Xác nhận thoát"
        cancelText="Tiếp tục chờ"
        variant="destructive"
      />
    </Layout>
  );
};

export default StudentWaiting;
