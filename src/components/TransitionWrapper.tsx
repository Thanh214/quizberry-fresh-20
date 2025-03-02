
import React, { useEffect, useState } from "react";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
