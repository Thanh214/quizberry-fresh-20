
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Exam } from "@/types/models";
import NeonEffect from "@/components/NeonEffect";

interface ExamFormProps {
  onSubmit: (examData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  teacherId: string;
  isLoading?: boolean;
  initialData?: Partial<Exam>;
}

const ExamForm: React.FC<ExamFormProps> = ({ 
  onSubmit, 
  onCancel, 
  teacherId,
  isLoading = false,
  initialData
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [duration, setDuration] = useState(initialData?.duration || 30); // Default 30 minutes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài thi");
      return;
    }
    
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã bài thi");
      return;
    }
    
    if (duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0");
      return;
    }
    
    // Submit exam data
    await onSubmit({
      title,
      description,
      code: code.toUpperCase(),
      duration,
      teacherId,
      isActive: false,
      questionIds: initialData?.questionIds || [],
      hasStarted: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="exam-title">
          Tiêu đề bài thi
        </label>
        <Input
          id="exam-title"
          placeholder="Nhập tiêu đề bài thi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="exam-code">
          Mã bài thi
        </label>
        <Input
          id="exam-code"
          placeholder="Nhập mã bài thi (VD: EPU001)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mã bài thi là mã duy nhất để sinh viên nhập vào khi tham gia thi
        </p>
      </div>
      
      <div>
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
          neonColor="purple"
        />
      </div>
      
      <div>
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
          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <NeonEffect color="purple" padding="p-0" className="rounded-md overflow-hidden">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none w-full"
          >
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật bài thi" : "Tạo bài thi"}
          </Button>
        </NeonEffect>
      </div>
    </form>
  );
};

export default ExamForm;
