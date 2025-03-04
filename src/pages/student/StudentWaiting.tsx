
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const StudentWaiting: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getExamByCode, exams, participants, toggleExamActive } = useExam();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examCode, setExamCode] = useState<string>("");
  const [isCheckingApproval, setIsCheckingApproval] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng có phải là học sinh đã đăng ký không
    if (!user || user.role !== "student") {
      navigate("/student/register");
      return;
    }

    // Lấy mã bài thi từ localStorage (lưu khi đăng nhập)
    const code = localStorage.getItem("studentExamCode");
    if (!code) {
      navigate("/student/register");
      return;
    }

    setExamCode(code);

    // Kiểm tra trạng thái chấp nhận
    const checkStudentApproval = async () => {
      try {
        const exam = getExamByCode(code);
        if (!exam) {
          toast.error("Không tìm thấy bài thi");
          navigate("/student/register");
          return;
        }

        // Kiểm tra xem bài thi có đang mở không
        if (!exam.isActive) {
          toast.error("Bài thi đã bị đóng");
          navigate("/student/register");
          return;
        }

        // Kiểm tra xem học sinh đã được phê duyệt và bài thi đã bắt đầu chưa
        const studentId = user.studentId || "";
        const participant = participants.find(
          p => p.examId === exam.id && p.studentId === studentId
        );

        if (!participant) {
          toast.error("Bạn chưa đăng ký tham gia bài thi này");
          navigate("/student/register");
          return;
        }

        if (participant.status === "completed") {
          toast.info("Bạn đã hoàn thành bài thi này");
          navigate("/student/results");
          return;
        }

        // Nếu đã có thời gian bắt đầu làm bài, chuyển đến trang làm bài
        if (participant.startTime) {
          startQuiz();
          return;
        }

        // Hiển thị thời gian còn lại
        setTimeLeft(exam.duration * 60);

        // Xác nhận phê duyệt, có thể chuyển đến trang làm bài
        setIsCheckingApproval(false);
      } catch (error) {
        console.error("Lỗi khi kiểm tra phê duyệt:", error);
        toast.error("Đã xảy ra lỗi khi kiểm tra trạng thái");
      }
    };

    checkStudentApproval();
  }, [user, navigate, participants, getExamByCode]);

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

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <TransitionWrapper>
          <Logo className="mb-8" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md text-center p-8">
            {isCheckingApproval ? (
              <div className="py-6 space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <h2 className="text-xl font-semibold">Đang tải thông tin...</h2>
                <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                <h2 className="text-2xl font-bold">Sẵn sàng làm bài?</h2>
                <p className="text-muted-foreground">
                  Bài thi của bạn sẽ bắt đầu ngay khi bạn nhấn nút Bắt đầu làm bài
                </p>

                {timeLeft !== null && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <Clock className="h-5 w-5" />
                      <span className="text-lg font-medium">
                        Thời gian làm bài: {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  className="w-full inline-flex items-center justify-center h-10 rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={startQuiz}
                >
                  Bắt đầu làm bài
                </button>
              </div>
            )}
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default StudentWaiting;
