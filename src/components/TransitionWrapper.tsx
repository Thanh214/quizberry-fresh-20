
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: "fade" | "slide" | "scale" | "fade-slide";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  className = "",
  delay = 0,
  type = "fade",
  direction = "up",
  duration = 0.7,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [key] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Variants for different animation types
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration,
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0,
        transition: {
          duration: duration * 0.7,
          ease: "easeIn"
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration,
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        transition: {
          duration: duration * 0.7,
          ease: "easeIn"
        }
      }
    },
    slide: {
      hidden: { 
        opacity: 0, 
        x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
        y: direction === "up" ? 30 : direction === "down" ? -30 : 0
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease: "easeOut"
        }
      },
      exit: {
        opacity: 0,
        x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
        y: direction === "up" ? -30 : direction === "down" ? 30 : 0,
        transition: {
          duration: duration * 0.7,
          ease: "easeIn"
        }
      }
    },
    "fade-slide": {
      hidden: { 
        opacity: 0, 
        x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
        y: direction === "up" ? 30 : direction === "down" ? -30 : 0
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease: "easeOut",
          opacity: { duration: duration * 1.1 }
        }
      },
      exit: {
        opacity: 0,
        x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
        y: direction === "up" ? -30 : direction === "down" ? 30 : 0,
        transition: {
          duration: duration * 0.7,
          ease: "easeIn"
        }
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exit"
        variants={variants[type]}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionWrapper;
