
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
  return (
    <div className="px-3 py-2 text-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <div>
          <div className="font-medium">{participant.studentName}</div>
          <div className="text-xs text-muted-foreground flex gap-3">
            <span>MSSV: {participant.studentId}</span>
            <span>Lớp: {participant.className}</span>
          </div>
        </div>
      </div>
      
      {status === "completed" && typeof score !== 'undefined' && (
        <Badge variant={score >= 5 ? "success" : "destructive"} className="ml-2">
          {score}/10
        </Badge>
      )}
    </div>
  );
};

export default ParticipantItem;
