
import React from "react";
import { ExamParticipant } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface ParticipantItemProps {
  participant: ExamParticipant;
  status: "waiting" | "in_progress" | "completed";
  score?: number;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({ participant, status, score }) => {
  // Badge color mapping based on status
  const getBadgeVariant = () => {
    if (status === "waiting") return "info";
    if (status === "in_progress") return "warning";
    if (status === "completed") {
      if (typeof score !== 'undefined') {
        return score >= 5 ? "success" : "destructive";
      }
      return "secondary";
    }
    return "secondary";
  };

  const getStatusText = () => {
    if (status === "waiting") return "Đang chờ";
    if (status === "in_progress") return "Đang làm bài";
    if (status === "completed") return "Đã hoàn thành";
    return "";
  };

  return (
    <div className="px-2 sm:px-3 py-2 text-xs sm:text-sm flex flex-wrap sm:flex-nowrap items-center justify-between hover:bg-muted/50 rounded-md transition-colors group">
      <div className="flex items-center gap-2 w-full sm:w-auto mb-1 sm:mb-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-festival-pink to-festival-orange text-white flex items-center justify-center text-xs font-medium overflow-hidden">
          {participant.studentName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium group-hover:text-festival-red transition-colors truncate max-w-[150px] sm:max-w-none">
            {participant.studentName}
          </div>
          <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-3">
            <span>MSSV: {participant.studentId}</span>
            <span>Lớp: {participant.className}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-9 sm:ml-0">
        <Badge variant={getBadgeVariant()} className="text-xs" neon neonColor={status === "completed" ? (score && score >= 5 ? "green" : "red") : "blue"}>
          {getStatusText()}
        </Badge>
        
        {status === "completed" && typeof score !== 'undefined' && (
          <Badge 
            variant={score >= 5 ? "success" : "destructive"} 
            className="ml-1 bg-opacity-90"
            neon 
            neonColor={score >= 5 ? "green" : "red"}
          >
            {score}/10
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ParticipantItem;
