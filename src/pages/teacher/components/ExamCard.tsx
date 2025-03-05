
import React, { useState } from "react";
import { Exam, ExamParticipant } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/Card";
import { 
  PlayCircle, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
} from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import ExamStatistics from "./ExamStatistics";
import ParticipantsList from "./ParticipantsList";
import ExamShareLink from "./ExamShareLink";
import StartExamButton from "./StartExamButton";
import { motion } from "framer-motion";

interface ExamCardProps {
  exam: Exam;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  isTeacher: boolean;
  onEdit: (examId: string) => void;
  onDelete: (examId: string) => void;
  onActivate: (examId: string) => void;
  onStart: (examId: string) => void;
  setConfirmDelete: (examId: string | null) => void;
  setConfirmStart: (examId: string | null) => void;
  setConfirmToggle: (examId: string | null) => void;
  participants: ExamParticipant[];
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  waitingCount,
  inProgressCount,
  completedCount,
  isTeacher,
  onEdit,
  onActivate,
  setConfirmDelete,
  setConfirmStart,
  setConfirmToggle,
  participants
}) => {
  const totalParticipants = waitingCount + inProgressCount + completedCount;
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Get border color based on exam status
  const getBorderColor = () => {
    if (exam.hasStarted) return '#ef4444'; // red for started exams
    if (exam.isActive) return '#22c55e'; // green for active exams
    return '#cbd5e1'; // gray for inactive exams
  };
  
  // Get background gradient based on exam status
  const getBackgroundGradient = () => {
    if (exam.hasStarted) return 'from-red-600/10 to-transparent';
    if (exam.isActive) return 'from-green-600/10 to-transparent';
    return 'from-slate-400/5 to-transparent';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="p-5 hover:shadow-lg transition-shadow duration-300 border-l-4 relative overflow-hidden group" 
        style={{ borderLeftColor: getBorderColor() }}
      >
        {/* Background glow for active/started exams */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${getBackgroundGradient()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge 
                    variant={exam.isActive ? "success" : "secondary"} 
                    className={`text-xs ${exam.isActive ? 'animate-pulse' : ''}`}
                  >
                    {exam.isActive ? "Đang mở" : "Đã đóng"}
                  </Badge>
                </motion.div>
                {exam.hasStarted && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      Đã bắt đầu
                    </Badge>
                  </motion.div>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Mã bài thi: <span className="font-mono font-medium">{exam.code}</span>
              </div>
            </div>
            
            {isTeacher && (
              <div className="flex items-center gap-2 flex-wrap mt-2 sm:mt-0">
                {!exam.hasStarted && exam.isActive && waitingCount > 0 && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NeonEffect color="green" padding="p-0" className="rounded-full overflow-hidden">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-500 border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-800 transition-all duration-300"
                        onClick={() => setConfirmStart(exam.id)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </NeonEffect>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800 transition-all duration-300"
                    onClick={() => onEdit(exam.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`
                      transition-all duration-300
                      ${exam.isActive 
                        ? 'text-amber-500 border-amber-200 bg-amber-50 hover:bg-amber-100' 
                        : 'text-gray-500 border-gray-200 bg-gray-50 hover:bg-gray-100'}
                      ${exam.hasStarted ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => setConfirmToggle(exam.id)}
                    disabled={exam.hasStarted}
                    title={exam.hasStarted ? "Không thể đóng bài thi đang diễn ra" : ""}
                  >
                    {exam.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={`
                      text-red-500 border-red-200 bg-red-50 hover:bg-red-100 
                      transition-all duration-300
                      ${exam.hasStarted ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => setConfirmDelete(exam.id)}
                    disabled={exam.hasStarted}
                    title={exam.hasStarted ? "Không thể xóa bài thi đang diễn ra" : ""}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Description */}
          {exam.description && (
            <div className="mt-3 text-sm text-muted-foreground">
              {exam.description}
            </div>
          )}
          
          {/* Statistics */}
          <ExamStatistics 
            exam={exam}
            waitingCount={waitingCount}
            inProgressCount={inProgressCount}
            completedCount={completedCount}
            totalParticipants={totalParticipants}
          />
          
          {/* Share link for active exams */}
          <ExamShareLink 
            exam={exam} 
            isActive={exam.isActive} 
            isTeacher={isTeacher} 
          />
          
          {/* Action buttons for waiting students */}
          {!exam.hasStarted && exam.isActive && waitingCount > 0 && (
            <StartExamButton 
              examId={exam.id}
              isActive={exam.isActive}
              hasStarted={exam.hasStarted}
              waitingCount={waitingCount}
              onStart={() => setConfirmStart(exam.id)}
            />
          )}

          {/* Student participants section - only shown for teachers */}
          {isTeacher && (
            <ParticipantsList
              examId={exam.id}
              participants={participants}
              showParticipants={showParticipants}
              setShowParticipants={setShowParticipants}
              totalParticipants={totalParticipants}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ExamCard;
