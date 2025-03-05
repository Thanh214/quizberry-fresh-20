
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, XCircle, Clock, Hash } from "lucide-react";
import Card from "@/components/Card";
import { Exam } from "@/types/models";

const EditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exams, updateExam, getExamById } = useQuiz();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    // Redirect if not teacher
    if (!user || user.role !== "teacher") {
      navigate("/role-selection");
      return;
    }

    // Load exam data
    if (id) {
      const examData = getExamById(id);
      if (examData) {
        setExam(examData);
        setTitle(examData.title);
        setDescription(examData.description || "");
        setDuration(examData.duration);
      } else {
        toast.error("Không tìm thấy bài thi");
        navigate("/teacher/exams");
      }
    }
  }, [id, user, navigate, getExamById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) return;
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi");
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update exam data
      await updateExam(exam.id, {
        title,
        description,
        duration,
      });
      
      toast.success("Cập nhật bài thi thành công");
      navigate("/teacher/exams");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài thi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/teacher/exams");
  };

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (!exam) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="p-6">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài thi</h2>
              <p className="text-muted-foreground mb-6">Bài thi không tồn tại hoặc đã bị xóa</p>
              <Button onClick={() => navigate("/teacher/exams")}>
                Quay lại danh sách bài thi
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <TransitionWrapper>
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Chỉnh sửa bài thi</h1>
              <Badge 
                variant={exam.isActive ? "success" : "secondary"} 
                className={exam.isActive ? "animate-pulse" : ""}
              >
                {exam.isActive ? "Đang mở" : "Đã đóng"}
              </Badge>
              {exam.hasStarted && (
                <Badge variant="destructive" className="animate-pulse">
                  Đã bắt đầu
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span className="font-mono">{exam.code}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{exam.duration} phút</span>
              </div>
            </div>
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={100}>
          <Card className="p-6">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium" htmlFor="exam-title">
                  Tiêu đề bài thi
                </label>
                <Input
                  id="exam-title"
                  placeholder="Nhập tiêu đề bài thi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium" htmlFor="exam-code">
                  Mã bài thi
                </label>
                <Input
                  id="exam-code"
                  value={exam.code}
                  readOnly
                  disabled
                  className="bg-gray-100 transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mã bài thi không thể thay đổi sau khi đã tạo
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium" htmlFor="exam-description">
                  Mô tả bài thi
                </label>
                <Textarea
                  id="exam-description"
                  placeholder="Nhập mô tả bài thi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  neon
                  neonColor="blue"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium" htmlFor="exam-duration">
                  Thời gian làm bài (phút)
                </label>
                <Input
                  id="exam-duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex justify-between space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-slate-300 transition-all duration-300 hover:bg-slate-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Hủy thay đổi
                </Button>
                
                <NeonEffect 
                  color="blue" 
                  padding="p-0" 
                  className="rounded-md overflow-hidden"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="border-none w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
                    
                    {isLoading ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Xác nhận thay đổi
                      </>
                    )}
                  </Button>
                </NeonEffect>
              </motion.div>
            </motion.form>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default EditExam;
