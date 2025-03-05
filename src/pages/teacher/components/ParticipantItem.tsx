
import React from "react";
import { ExamParticipant } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Format thời gian thoát gần nhất
  const formatLastExitTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const hasExitRecord = participant.exitCount && participant.exitCount > 0;

  return (
    <div className="px-3 py-2 text-sm flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors group">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-festival-pink to-festival-orange text-white flex items-center justify-center text-xs font-medium overflow-hidden">
          {participant.studentName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium group-hover:text-festival-red transition-colors">
            {participant.studentName}
            {hasExitRecord && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block ml-2">
                      <AlertCircle className="h-4 w-4 text-red-500 inline" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Thoát khỏi màn hình: {participant.exitCount} lần</p>
                    {participant.lastExitTime && (
                      <p>Lần cuối: {formatLastExitTime(participant.lastExitTime)}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex gap-3">
            <span>MSSV: {participant.studentId}</span>
            <span>Lớp: {participant.className}</span>
            {hasExitRecord && (
              <span className="text-red-500 font-medium">
                Thoát: {participant.exitCount} lần
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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

