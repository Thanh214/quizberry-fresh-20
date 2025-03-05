
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Sparkles } from "lucide-react";
import NeonEffect from "@/components/NeonEffect";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface StartExamButtonProps {
  examId: string;
  isActive: boolean;
  hasStarted: boolean;
  waitingCount: number;
  onStart: (examId: string) => void;
}

const StartExamButton: React.FC<StartExamButtonProps> = ({
  examId,
  isActive,
  hasStarted,
  waitingCount,
  onStart,
}) => {
  // This function handles the direct start of the exam without confirmation
  const handleStartExam = () => {
    // Create a spark effect on click
    const sparkContainer = document.createElement('div');
    sparkContainer.style.position = 'fixed';
    sparkContainer.style.zIndex = '9999';
    sparkContainer.style.pointerEvents = 'none';
    document.body.appendChild(sparkContainer);
    
    // Add the spark animation class
    const cleanup = () => {
      setTimeout(() => {
        if (document.body.contains(sparkContainer)) {
          document.body.removeChild(sparkContainer);
        }
      }, 1000);
    };
    
    onStart(examId);
    
    toast.success("Bài thi đã bắt đầu", {
      description: `${waitingCount} học sinh bắt đầu làm bài`,
      icon: <Sparkles className="h-4 w-4 text-yellow-400" />,
    });
    
    cleanup();
  };

  if (!isActive || hasStarted || waitingCount <= 0) {
    return null;
  }

  // Enhanced button animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.95, 
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }
  };
  
  const studentCountVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.2 
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" 
      }
    }
  };

  return (
    <motion.div 
      className="mt-4 flex justify-end"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <NeonEffect color="green" padding="p-0" className="rounded-full overflow-hidden group">
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none rounded-full relative overflow-hidden group transition-all duration-300"
            onClick={handleStartExam}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0 opacity-0 group-hover:opacity-100 animate-shine" />
            
            {/* Icon with animation */}
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="mr-2"
            >
              <PlayCircle className="h-4 w-4" />
            </motion.div>
            
            <span>Bắt đầu bài thi</span>
            
            {/* Student count with animation */}
            <motion.span 
              className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs flex items-center"
              variants={studentCountVariants}
              animate={[
                "animate", 
                waitingCount > 5 ? "pulse" : ""
              ]}
            >
              {waitingCount} học sinh đang chờ
            </motion.span>
          </Button>
        </motion.div>
      </NeonEffect>
    </motion.div>
  );
};

export default StartExamButton;
