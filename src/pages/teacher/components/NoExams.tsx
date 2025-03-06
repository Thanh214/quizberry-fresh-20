
import React from "react";

const NoExams: React.FC = () => {
  return (
    <div className="text-center py-12 border border-dashed rounded-md border-muted">
      <h3 className="text-lg font-medium text-muted-foreground">Chưa có bài thi nào</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Hãy tạo bài thi mới để bắt đầu
      </p>
    </div>
  );
};

export default NoExams;
