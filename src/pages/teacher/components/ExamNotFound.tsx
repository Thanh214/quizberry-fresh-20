
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Card from "@/components/Card";

const ExamNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default ExamNotFound;
