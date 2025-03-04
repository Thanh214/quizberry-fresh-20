
import React from "react";
import { ExamParticipant } from "@/types/models";
import { Clock, BookOpen, GraduationCap, Users, ChevronUp, ChevronDown } from "lucide-react";
import ParticipantItem from "./ParticipantItem";

interface ParticipantsListProps {
  examId: string;
  participants: ExamParticipant[];
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  totalParticipants: number;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  examId,
  participants,
  showParticipants,
  setShowParticipants,
  totalParticipants
}) => {
  const examParticipants = participants.filter(p => p.examId === examId);
  const waitingParticipants = examParticipants.filter(p => p.status === "waiting");
  const inProgressParticipants = examParticipants.filter(p => p.status === "in_progress");
  const completedParticipants = examParticipants.filter(p => p.status === "completed");

  if (totalParticipants === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div 
        className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/30 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
        onClick={() => setShowParticipants(!showParticipants)}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Danh sách thí sinh ({totalParticipants})</span>
        </div>
        {showParticipants ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>

      {showParticipants && (
        <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
          {/* Danh sách học sinh đang chờ */}
          {waitingParticipants.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/10">
              <div className="px-3 py-2 font-medium text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Đang chờ ({waitingParticipants.length})
              </div>
              
              <div className="divide-y divide-amber-100 dark:divide-amber-800/30">
                {waitingParticipants.map((participant) => (
                  <ParticipantItem 
                    key={participant.id} 
                    participant={participant} 
                    status="waiting" 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Danh sách học sinh đang làm bài */}
          {inProgressParticipants.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/10">
              <div className="px-3 py-2 font-medium text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Đang làm bài ({inProgressParticipants.length})
              </div>
              
              <div className="divide-y divide-blue-100 dark:divide-blue-800/30">
                {inProgressParticipants.map((participant) => (
                  <ParticipantItem 
                    key={participant.id} 
                    participant={participant} 
                    status="in_progress" 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Danh sách học sinh đã hoàn thành */}
          {completedParticipants.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/10">
              <div className="px-3 py-2 font-medium text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Đã hoàn thành ({completedParticipants.length})
              </div>
              
              <div className="divide-y divide-green-100 dark:divide-green-800/30">
                {completedParticipants.map((participant) => (
                  <ParticipantItem 
                    key={participant.id} 
                    participant={participant} 
                    status="completed" 
                    score={participant.score}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
