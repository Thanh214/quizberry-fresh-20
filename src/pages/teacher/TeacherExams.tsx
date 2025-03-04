
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { useExam } from "@/context/ExamContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Trash2, 
  Plus, 
  Edit,
  Clock,
  Users,
  Link as LinkIcon,
  Play,
  Copy
} from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import NeonEffect from "@/components/NeonEffect";
import { Exam, ExamParticipant } from "@/types/models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { exams, deleteExam, activateExam } = useQuiz();
  const { 
    exams: contextExams, 
    deleteExam: contextDeleteExam, 
    toggleExamActive: contextToggleExamActive,
    startExam,
    getParticipantsByExam,
    getWaitingParticipants,
    generateShareLink
  } = useExam();
  
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [examParticipants, setExamParticipants] = useState<Record<string, ExamParticipant[]>>({});
  const [waitingCounts, setWaitingCounts] = useState<Record<string, number>>({});
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({});
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{
    type: 'delete' | 'activate' | 'deactivate' | 'start';
    examId: string;
  } | null>(null);
  
  // Tooltip state for copy link confirmation
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "teacher") {
      navigate("/role-selection");
    }
  }, [isAuthenticated, user, navigate]);

  // Merge exams from QuizContext and ExamContext
  useEffect(() => {
    const mergedExams = [...exams, ...contextExams];
    
    // Remove duplicates based on ID
    const uniqueExams = mergedExams.filter((exam, index, self) =>
      index === self.findIndex((t) => t.id === exam.id)
    );
    
    setAllExams(uniqueExams);
    
    // Load participant counts for each exam
    const participantData: Record<string, ExamParticipant[]> = {};
    const waitingData: Record<string, number> = {};
    
    uniqueExams.forEach(exam => {
      const participants = getParticipantsByExam(exam.id);
      participantData[exam.id] = participants;
      
      const waitingParticipants = getWaitingParticipants(exam.id);
      waitingData[exam.id] = waitingParticipants.length;
    });
    
    setExamParticipants(participantData);
    setWaitingCounts(waitingData);
  }, [exams, contextExams, getParticipantsByExam, getWaitingParticipants]);

  // Handle confirmation dialog actions
  const handleConfirmAction = async () => {
    if (!dialogAction) return;
    
    try {
      const { type, examId } = dialogAction;
      
      switch(type) {
        case 'delete':
          if (contextDeleteExam) {
            await contextDeleteExam(examId);
          } else {
            await deleteExam(examId);
          }
          break;
        case 'activate':
          if (contextToggleExamActive) {
            await contextToggleExamActive(examId, true);
          } else {
            await activateExam(examId);
          }
          break;
        case 'deactivate':
          if (contextToggleExamActive) {
            await contextToggleExamActive(examId, false);
          } else {
            await activateExam(examId);
          }
          break;
        case 'start':
          await startExam(examId);
          toast.success("Bài thi đã bắt đầu. Học sinh có thể làm bài ngay bây giờ!");
          break;
      }
    } catch (error) {
      toast.error((error as Error).message || "Có lỗi xảy ra");
    } finally {
      setDialogOpen(false);
      setDialogAction(null);
    }
  };

  const handleDeleteExam = (id: string) => {
    setDialogAction({ type: 'delete', examId: id });
    setDialogOpen(true);
  };

  const handleActivateExam = (id: string, currentActive: boolean) => {
    setDialogAction({ 
      type: currentActive ? 'deactivate' : 'activate', 
      examId: id 
    });
    setDialogOpen(true);
  };

  const handleStartExam = (id: string) => {
    setDialogAction({ type: 'start', examId: id });
    setDialogOpen(true);
  };

  const handleCreateExam = () => {
    navigate("/teacher/create-exam");
  };
  
  const handleEditExam = (id: string) => {
    navigate(`/teacher/edit-exam/${id}`);
  };
  
  const handleShareLink = async (examId: string) => {
    try {
      if (shareLinks[examId]) {
        // Copy to clipboard if we already have the link
        await navigator.clipboard.writeText(shareLinks[examId]);
        setCopiedExamId(examId);
        setTimeout(() => setCopiedExamId(null), 2000);
        return;
      }
      
      const link = await generateShareLink(examId);
      setShareLinks(prev => ({ ...prev, [examId]: link }));
      
      // Copy to clipboard
      await navigator.clipboard.writeText(link);
      setCopiedExamId(examId);
      setTimeout(() => setCopiedExamId(null), 2000);
    } catch (error) {
      toast.error("Không thể tạo đường link chia sẻ");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Quản lý bài thi</h1>
          </div>
          <NeonEffect color="purple" padding="p-0" className="overflow-hidden rounded-md">
            <Button 
              onClick={handleCreateExam} 
              className="w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              Tạo bài thi mới
            </Button>
          </NeonEffect>
        </div>

        <TransitionWrapper>
          <Card className="mb-8 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách bài thi</h2>
            </div>

            {!allExams || allExams.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">Chưa có bài thi nào</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bấm vào nút "Tạo bài thi mới" để tạo bài thi đầu tiên
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {allExams.map((exam) => (
                  <Card key={exam.id} className="border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-3">
                        <div>
                          <h3 className="text-lg font-medium">{exam.title}</h3>
                          <p className="text-sm text-muted-foreground">{exam.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center text-sm gap-1">
                              <span className="font-medium">Mã bài thi:</span> 
                              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{exam.code}</span>
                            </div>
                            
                            <div className="flex items-center text-sm gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{exam.duration} phút</span>
                            </div>
                            
                            <div className="flex items-center text-sm gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{examParticipants[exam.id]?.length || 0} thí sinh</span>
                            </div>
                            
                            <div className="flex items-center text-sm gap-1">
                              <span className={exam.isActive ? "text-green-500" : "text-red-500"}>
                                {exam.isActive ? "Đang mở" : "Đã đóng"}
                              </span>
                              {exam.hasStarted && (
                                <span className="text-blue-500 ml-2">Đã bắt đầu</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center space-x-2 mt-2 md:mt-0">
                          {exam.isActive && !exam.hasStarted && waitingCounts[exam.id] > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <NeonEffect color="green" padding="p-0" className="overflow-hidden rounded-md">
                                    <Button
                                      variant="default"
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                      onClick={() => handleStartExam(exam.id)}
                                    >
                                      <Play className="w-4 h-4 mr-1" />
                                      Bắt đầu ({waitingCounts[exam.id]})
                                    </Button>
                                  </NeonEffect>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Có {waitingCounts[exam.id]} học sinh trong hàng chờ</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <NeonEffect color="blue" padding="p-0" className="overflow-hidden rounded-md">
                                  <Button
                                    variant="default"
                                    className="text-primary-foreground bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    onClick={() => handleShareLink(exam.id)}
                                  >
                                    {copiedExamId === exam.id ? (
                                      <Copy className="w-4 h-4 mr-1" />
                                    ) : (
                                      <LinkIcon className="w-4 h-4 mr-1" />
                                    )}
                                    {copiedExamId === exam.id ? "Đã sao chép" : "Chia sẻ"}
                                  </Button>
                                </NeonEffect>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sao chép đường dẫn tham gia bài thi</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {!exam.hasStarted && (
                            <NeonEffect color="pink" padding="p-0" className="overflow-hidden rounded-md">
                              <Button
                                variant="default"
                                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                                onClick={() => handleEditExam(exam.id)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Chỉnh sửa
                              </Button>
                            </NeonEffect>
                          )}
                          
                          <NeonEffect color={exam.isActive ? "red" : "green"} padding="p-0" className="overflow-hidden rounded-md">
                            <Button
                              variant="default"
                              className={`text-primary-foreground ${
                                exam.isActive 
                                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" 
                                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                              }`}
                              onClick={() => handleActivateExam(exam.id, exam.isActive)}
                              disabled={exam.hasStarted && !exam.isActive}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {exam.isActive ? "Đóng bài thi" : "Mở bài thi"}
                            </Button>
                          </NeonEffect>
                          
                          {!exam.isActive && !exam.hasStarted && (
                            <NeonEffect color="red" padding="p-0" className="overflow-hidden rounded-md">
                              <Button
                                variant="destructive"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                onClick={() => handleDeleteExam(exam.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </NeonEffect>
                          )}
                        </div>
                      </div>
                      
                      {waitingCounts[exam.id] > 0 && (
                        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4" />
                            Học sinh trong hàng chờ ({waitingCounts[exam.id]})
                          </h4>
                          <div className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {examParticipants[exam.id]
                              ?.filter(p => p.status === "waiting")
                              .map((p, idx) => (
                                <div key={p.id} className="flex items-center gap-2 bg-white dark:bg-slate-700 p-2 rounded">
                                  <span className="font-medium">{idx + 1}.</span>
                                  <span>{p.studentName}</span>
                                  <span className="text-xs text-muted-foreground">({p.studentId})</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TransitionWrapper>
      </div>
      
      {/* Confirmation Dialog */}
      {dialogAction && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            dialogAction.type === 'delete' 
              ? "Xác nhận xóa bài thi" 
              : dialogAction.type === 'activate'
              ? "Xác nhận mở bài thi"
              : dialogAction.type === 'deactivate'
              ? "Xác nhận đóng bài thi"
              : "Xác nhận bắt đầu bài thi"
          }
          description={
            dialogAction.type === 'delete' 
              ? "Bạn có chắc chắn muốn xóa bài thi này? Hành động này không thể hoàn tác." 
              : dialogAction.type === 'activate'
              ? "Khi mở bài thi, học sinh có thể đăng ký tham gia vào hàng chờ."
              : dialogAction.type === 'deactivate'
              ? "Khi đóng bài thi, học sinh sẽ không thể đăng ký tham gia nữa."
              : "Khi bắt đầu bài thi, tất cả học sinh trong hàng chờ sẽ bắt đầu làm bài đồng thời. Bạn có chắc chắn muốn bắt đầu?"
          }
          confirmText={
            dialogAction.type === 'delete' 
              ? "Xóa bài thi" 
              : dialogAction.type === 'activate'
              ? "Mở bài thi"
              : dialogAction.type === 'deactivate'
              ? "Đóng bài thi"
              : "Bắt đầu"
          }
          variant={dialogAction.type === 'delete' ? "destructive" : "default"}
        />
      )}
    </Layout>
  );
};

export default TeacherExams;
