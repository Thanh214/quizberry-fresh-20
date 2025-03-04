
import React from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Exam } from "@/types/models";

interface ExamConfirmationDialogsProps {
  confirmDelete: string | null;
  confirmStart: string | null;
  confirmToggle: string | null;
  exams: Exam[];
  onClose: {
    delete: () => void;
    start: () => void;
    toggle: () => void;
  };
  onConfirm: {
    delete: () => void;
    start: () => void;
    toggle: () => void;
  };
}

const ExamConfirmationDialogs: React.FC<ExamConfirmationDialogsProps> = ({
  confirmDelete,
  confirmStart,
  confirmToggle,
  exams,
  onClose,
  onConfirm
}) => {
  return (
    <>
      <ConfirmationDialog
        isOpen={!!confirmDelete}
        onClose={onClose.delete}
        onConfirm={onConfirm.delete}
        title="Xác nhận xóa bài thi"
        description="Bạn có chắc chắn muốn xóa bài thi này? Hành động này không thể hoàn tác."
        confirmText="Xóa bài thi"
        cancelText="Hủy"
        variant="destructive"
      />
      
      <ConfirmationDialog
        isOpen={!!confirmStart}
        onClose={onClose.start}
        onConfirm={onConfirm.start}
        title="Xác nhận bắt đầu bài thi"
        description="Khi bài thi bắt đầu, tất cả học sinh đang trong hàng chờ sẽ bắt đầu làm bài ngay lập tức. Bạn có chắc chắn muốn bắt đầu?"
        confirmText="Bắt đầu bài thi"
        cancelText="Hủy"
      />
      
      <ConfirmationDialog
        isOpen={!!confirmToggle}
        onClose={onClose.toggle}
        onConfirm={onConfirm.toggle}
        title={exams.find(e => e.id === confirmToggle)?.isActive ? "Xác nhận đóng bài thi" : "Xác nhận mở bài thi"}
        description={exams.find(e => e.id === confirmToggle)?.isActive 
          ? "Khi đóng bài thi, học sinh sẽ không thể tham gia hoặc làm bài thi nữa. Bạn có chắc chắn muốn đóng?" 
          : "Khi mở bài thi, học sinh sẽ có thể đăng ký tham gia. Bạn có chắc chắn muốn mở?"}
        confirmText={exams.find(e => e.id === confirmToggle)?.isActive ? "Đóng bài thi" : "Mở bài thi"}
        cancelText="Hủy"
      />
    </>
  );
};

export default ExamConfirmationDialogs;
