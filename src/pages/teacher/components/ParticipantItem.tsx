
import React from "react";
import { ExamParticipant } from "@/types/models";
import { Badge } from "@/components/ui/badge";

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
    <div className="px-2 py-2 xs:px-3 text-sm flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors group overflow-hidden">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-festival-pink to-festival-orange text-white flex items-center justify-center text-xs font-medium overflow-hidden flex-shrink-0">
          {participant.studentName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium group-hover:text-festival-red transition-colors truncate">
            {participant.studentName}
          </div>
          <div className="text-xs text-muted-foreground flex flex-col xs:flex-row xs:gap-3 truncate">
            <span className="truncate">MSSV: {participant.studentId}</span>
            <span className="truncate">Lớp: {participant.className}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0 ml-2">
        <Badge variant={getBadgeVariant()} className="text-xs whitespace-nowrap" neon neonColor={status === "completed" ? (score && score >= 5 ? "green" : "red") : "blue"}>
          {getStatusText()}
        </Badge>
        
        {status === "completed" && typeof score !== 'undefined' && (
          <Badge 
            variant={score >= 5 ? "success" : "destructive"} 
            className="ml-1 bg-opacity-90 whitespace-nowrap"
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
