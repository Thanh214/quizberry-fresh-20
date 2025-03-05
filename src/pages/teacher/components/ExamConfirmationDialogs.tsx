
import React from "react";
import { Exam } from "@/types/models";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { StopCircle } from "lucide-react";

interface ExamConfirmationDialogsProps {
  confirmDelete: string | null;
  confirmStart: string | null;
  confirmToggle: string | null;
  confirmEnd?: string | null;
  exams: Exam[];
  onClose: {
    delete: () => void;
    start: () => void;
    toggle: () => void;
    end?: () => void;
  };
  onConfirm: {
    delete: () => void;
    start: () => void;
    toggle: () => void;
    end?: () => void;
  };
}

const ExamConfirmationDialogs: React.FC<ExamConfirmationDialogsProps> = ({
  confirmDelete,
  confirmStart,
  confirmToggle,
  confirmEnd,
  exams,
  onClose,
  onConfirm,
}) => {
  // Helper to get exam title
  const getExamTitle = (examId: string | null) => {
    if (!examId) return "";
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : "";
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmDelete}
        onClose={onClose.delete}
        onConfirm={onConfirm.delete}
        title="Xác nhận xóa bài thi"
        description={`Bạn có chắc chắn muốn xóa bài thi "${getExamTitle(confirmDelete)}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa bài thi"
        cancelText="Hủy"
        variant="destructive"
      />
      
      {/* Confirm Start Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmStart}
        onClose={onClose.start}
        onConfirm={onConfirm.start}
        title="Xác nhận bắt đầu bài thi"
        description={`Bạn có chắc chắn muốn bắt đầu bài thi "${getExamTitle(confirmStart)}"? Tất cả học sinh đang chờ sẽ bắt đầu làm bài.`}
        confirmText="Bắt đầu bài thi"
        cancelText="Hủy"
      />
      
      {/* Confirm Toggle Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmToggle}
        onClose={onClose.toggle}
        onConfirm={onConfirm.toggle}
        title={`Xác nhận ${
          exams.find(e => e.id === confirmToggle)?.isActive ? "đóng" : "mở"
        } bài thi`}
        description={`Bạn có chắc chắn muốn ${
          exams.find(e => e.id === confirmToggle)?.isActive ? "đóng" : "mở"
        } bài thi "${getExamTitle(confirmToggle)}"?`}
        confirmText={`${
          exams.find(e => e.id === confirmToggle)?.isActive ? "Đóng" : "Mở"
        } bài thi`}
        cancelText="Hủy"
      />
      
      {/* Confirm End Exam Dialog */}
      {confirmEnd && onClose.end && onConfirm.end && (
        <ConfirmationDialog
          isOpen={!!confirmEnd}
          onClose={onClose.end}
          onConfirm={onConfirm.end}
          title="Xác nhận kết thúc bài thi"
          description={`Bạn có chắc chắn muốn kết thúc bài thi "${getExamTitle(confirmEnd)}" ngay bây giờ? Tất cả học sinh sẽ bị buộc phải nộp bài.`}
          confirmText="Kết thúc bài thi"
          cancelText="Hủy"
          variant="destructive"
          icon={<StopCircle className="h-6 w-6 text-destructive" />}
        />
      )}
    </>
  );
};

export default ExamConfirmationDialogs;
