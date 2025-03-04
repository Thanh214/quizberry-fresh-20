
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { Exam, ExamParticipant } from "@/types/models";
import { toast } from "sonner";
import { 
  Calendar, Clock, FileText, Users, 
  ChevronLeft, Edit, Trash2, CheckCircle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    exams, 
    getExamsByTeacher, 
    toggleExamActive, 
    deleteExam, 
    participants,
    isLoading 
  } = useExam();
  
  const [teacherExams, setTeacherExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examParticipants, setExamParticipants] = useState<ExamParticipant[]>([]);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng có phải là giáo viên không
    if (!user || user.role !== "teacher") {
      navigate("/role-selection");
      return;
    }

    // Lấy danh sách bài thi của giáo viên
    if (user) {
      const teacherExams = getExamsByTeacher(user.id);
      setTeacherExams(teacherExams);
      
      // Nếu có bài thi, chọn bài thi đầu tiên
      if (teacherExams.length > 0 && !selectedExam) {
        setSelectedExam(teacherExams[0]);
      }
    }
  }, [user, exams, navigate, getExamsByTeacher, selectedExam]);

  // Cập nhật danh sách người tham gia khi chọn bài thi
  useEffect(() => {
    if (selectedExam) {
      const filteredParticipants = participants.filter(p => p.examId === selectedExam.id);
      setExamParticipants(filteredParticipants);
    } else {
      setExamParticipants([]);
    }
  }, [selectedExam, participants]);

  const handleToggleActive = async (exam: Exam) => {
    try {
      setIsActivating(true);
      await toggleExamActive(exam.id, !exam.isActive);
      toast.success(
        exam.isActive 
          ? "Đã đóng bài thi thành công" 
          : "Đã mở bài thi thành công"
      );
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái bài thi");
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này không?")) {
      try {
        await deleteExam(examId);
        toast.success("Xóa bài thi thành công");
        if (selectedExam?.id === examId) {
          setSelectedExam(null);
        }
      } catch (error) {
        toast.error("Không thể xóa bài thi");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/role-selection");
  };

  const handleCreateExam = () => {
    navigate("/teacher/create-exam");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center space-x-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <TransitionWrapper delay={300}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý đề thi</h1>
            <Button
              onClick={handleCreateExam}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <FileText className="mr-2 h-4 w-4" />
              Tạo đề thi mới
            </Button>
          </div>
        </TransitionWrapper>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-3">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Danh sách bài thi */}
            <div className="md:col-span-1">
              <Card className="p-4 h-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Danh sách bài thi</h2>
                  <Badge className="bg-primary/20 text-primary border-none">
                    {teacherExams.length}
                  </Badge>
                </div>
                
                {teacherExams.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Chưa có bài thi nào</p>
                    <Button
                      onClick={handleCreateExam}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      Tạo bài thi đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {teacherExams.map((exam) => (
                      <div
                        key={exam.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedExam?.id === exam.id
                            ? "bg-primary/10 border-l-4 border-primary"
                            : "hover:bg-muted border border-transparent hover:border-muted-foreground/20"
                        }`}
                        onClick={() => setSelectedExam(exam)}
                      >
                        <h3 className="font-medium truncate">{exam.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{exam.duration} phút</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(exam.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              exam.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.isActive ? "Đang mở" : "Đã đóng"}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            Mã: {exam.code}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Chi tiết bài thi */}
            <div className="md:col-span-2">
              {selectedExam ? (
                <Card className="p-6 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedExam.title}</h2>
                      <p className="text-muted-foreground mt-1">
                        {selectedExam.description || "Không có mô tả"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedExam.isActive ? "destructive" : "success"}
                        className={selectedExam.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        onClick={() => handleToggleActive(selectedExam)}
                        disabled={isActivating}
                      >
                        {isActivating ? (
                          "Đang xử lý..."
                        ) : (
                          <>
                            {selectedExam.isActive ? (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Đóng bài thi
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mở bài thi
                              </>
                            )}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/teacher/edit-exam/${selectedExam.id}`)}
                        disabled={selectedExam.isActive}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteExam(selectedExam.id)}
                        disabled={selectedExam.isActive}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-3 mb-6">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Mã bài thi</p>
                      <p className="text-xl font-semibold">{selectedExam.code}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Thời gian làm bài</p>
                      <p className="text-xl font-semibold">{selectedExam.duration} phút</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Số câu hỏi</p>
                      <p className="text-xl font-semibold">{selectedExam.questionIds.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Danh sách thí sinh ({examParticipants.length})
                    </h3>
                  </div>

                  {examParticipants.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <p className="text-muted-foreground">Chưa có thí sinh tham gia</p>
                      {selectedExam.isActive ? (
                        <div className="mt-2 bg-green-50 text-green-700 p-2 rounded-md inline-block">
                          <p className="text-sm">Học sinh có thể tham gia bài thi với mã: <strong>{selectedExam.code}</strong></p>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-600 mt-2">Bài thi chưa được mở</p>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 text-sm font-medium">STT</th>
                            <th className="text-left p-2 text-sm font-medium">Họ và tên</th>
                            <th className="text-left p-2 text-sm font-medium">Mã SV</th>
                            <th className="text-left p-2 text-sm font-medium">Lớp</th>
                            <th className="text-left p-2 text-sm font-medium">Trạng thái</th>
                            <th className="text-left p-2 text-sm font-medium">Điểm</th>
                            <th className="text-left p-2 text-sm font-medium">Thời gian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examParticipants.map((participant, index) => (
                            <tr key={participant.id} className="border-b border-muted hover:bg-muted/30">
                              <td className="p-2 text-sm">{index + 1}</td>
                              <td className="p-2 text-sm font-medium">{participant.studentName}</td>
                              <td className="p-2 text-sm">{participant.studentId}</td>
                              <td className="p-2 text-sm">{participant.className}</td>
                              <td className="p-2 text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  participant.status === "completed" 
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {participant.status === "completed" ? "Đã hoàn thành" : "Đang làm bài"}
                                </span>
                              </td>
                              <td className="p-2 text-sm">
                                {participant.score !== undefined 
                                  ? participant.score.toFixed(1)
                                  : "-"}
                              </td>
                              <td className="p-2 text-sm">
                                {participant.endTime 
                                  ? formatDate(participant.endTime)
                                  : formatDate(participant.startTime)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="p-6 h-full flex flex-col items-center justify-center">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-muted-foreground">
                      {teacherExams.length > 0 
                        ? "Chọn một bài thi để xem chi tiết" 
                        : "Chưa có bài thi nào"}
                    </h3>
                    <Button
                      className="mt-4 bg-primary text-white hover:bg-primary/90"
                      onClick={handleCreateExam}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Tạo đề thi mới
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherExams;
