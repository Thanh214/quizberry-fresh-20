
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NeonEffectProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'red' | 'pink' | 'gold';
  className?: string;
  padding?: string;
  onClick?: () => void;
  disabled?: boolean;
  animate?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const NeonEffect: React.FC<NeonEffectProps> = ({
  children,
  color = 'blue',
  className,
  padding = 'p-4',
  onClick,
  disabled = false,
  animate = true,
  intensity = 'medium',
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50 hover:shadow-blue-500/75',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/50 hover:shadow-purple-500/75',
    green: 'from-green-500 to-green-600 shadow-green-500/50 hover:shadow-green-500/75',
    red: 'from-red-500 to-red-600 shadow-red-500/50 hover:shadow-red-500/75',
    pink: 'from-pink-500 to-pink-600 shadow-pink-500/50 hover:shadow-pink-500/75',
    gold: 'from-amber-500 to-yellow-500 shadow-amber-500/50 hover:shadow-amber-500/75',
  };
  
  const intensityMap = {
    low: {
      glow: 'shadow-md hover:shadow-lg',
      pulse: { scale: [1, 1.01, 1], opacity: [1, 0.97, 1] },
    },
    medium: {
      glow: 'shadow-lg hover:shadow-xl',
      pulse: { scale: [1, 1.02, 1], opacity: [1, 0.95, 1] },
    },
    high: {
      glow: 'shadow-xl hover:shadow-2xl',
      pulse: { scale: [1, 1.03, 1], opacity: [1, 0.9, 1] },
    },
  };

  // Animation variants
  const containerVariants = {
    initial: { 
      opacity: 0.9,
      scale: 0.98,
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      }
    },
    pulse: intensityMap[intensity].pulse,
    disabled: {
      opacity: 0.5,
      scale: 0.98,
    }
  };

  return (
    <motion.div 
      className={cn(
        `relative rounded-lg bg-gradient-to-br ${colorMap[color]} 
        ${intensityMap[intensity].glow} transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${padding}`,
        className
      )}
      onClick={!disabled ? onClick : undefined}
      variants={containerVariants}
      initial="initial"
      animate={disabled ? "disabled" : "animate"}
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      {...(animate && !disabled ? { 
        animate: ["animate", "pulse"],
        transition: {
          pulse: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }
      } : {})}
    >
      <div className="relative z-10">
        {children}
      </div>
      <motion.div 
        className={cn(
          `absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300`,
          {
            'bg-blue-400': color === 'blue',
            'bg-purple-400': color === 'purple',
            'bg-green-400': color === 'green',
            'bg-red-400': color === 'red',
            'bg-pink-400': color === 'pink',
            'bg-amber-400': color === 'gold',
          }
        )}
        animate={{
          opacity: [0, 0.15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  );
};

export default NeonEffect;
