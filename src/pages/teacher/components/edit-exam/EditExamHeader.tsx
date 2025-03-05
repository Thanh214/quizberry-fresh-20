
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Exam } from "@/types/models";
import TransitionWrapper from "@/components/TransitionWrapper";

interface EditExamHeaderProps {
  exam: Exam;
  onCancel: () => void;
}

const EditExamHeader: React.FC<EditExamHeaderProps> = ({ exam, onCancel }) => {
  return (
    <TransitionWrapper>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Chỉnh sửa bài thi</h1>
          <Badge 
            variant={exam?.isActive ? "success" : "secondary"} 
            className={exam?.isActive ? "animate-pulse" : ""}
          >
            {exam?.isActive ? "Đang mở" : "Đã đóng"}
          </Badge>
          {exam?.hasStarted && (
            <Badge variant="destructive" className="animate-pulse">
              Đã bắt đầu
            </Badge>
          )}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default EditExamHeader;
