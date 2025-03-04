
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-75 animate-pulse-light"></div>
        <div className="relative rounded-full bg-white dark:bg-gray-800 p-2">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <path d="M7.5 12h9" />
            <path d="M11 9v6" />
          </svg>
        </div>
      </div>
      <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        EPUTest
      </span>
    </div>
  );
};

export default Logo;
