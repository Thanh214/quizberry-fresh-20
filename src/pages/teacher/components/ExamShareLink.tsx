
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Exam } from "@/types/models";

interface ExamShareLinkProps {
  exam: Exam;
  isActive: boolean;
  isTeacher: boolean;
}

const ExamShareLink: React.FC<ExamShareLinkProps> = ({ exam, isActive, isTeacher }) => {
  const copyShareLink = (exam: Exam) => {
    if (exam.shareLink) {
      navigator.clipboard.writeText(exam.shareLink);
      toast.success("Đã sao chép liên kết");
    }
  };

  if (!isActive || !exam.shareLink || !isTeacher) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800 flex items-center justify-between">
      <div className="text-sm">
        <span className="font-medium text-blue-700 dark:text-blue-400">Link tham gia:</span>
        <span className="ml-2 font-mono text-xs truncate max-w-[200px] inline-block align-bottom">
          {exam.shareLink}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        className="h-8 text-blue-600"
        onClick={() => copyShareLink(exam)}
      >
        <Copy className="h-4 w-4 mr-1" />
        <span className="text-xs">Sao chép</span>
      </Button>
    </div>
  );
};

export default ExamShareLink;
