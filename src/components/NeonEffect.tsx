
import React from 'react';
import { cn } from "@/lib/utils";

interface NeonEffectProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'red' | 'pink';
  className?: string;
  padding?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const NeonEffect: React.FC<NeonEffectProps> = ({
  children,
  color = 'blue',
  className,
  padding = 'p-4',
  onClick,
  disabled = false,
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50 hover:shadow-blue-500/75',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/50 hover:shadow-purple-500/75',
    green: 'from-green-500 to-green-600 shadow-green-500/50 hover:shadow-green-500/75',
    red: 'from-red-500 to-red-600 shadow-red-500/50 hover:shadow-red-500/75',
    pink: 'from-pink-500 to-pink-600 shadow-pink-500/50 hover:shadow-pink-500/75',
  };

  return (
    <div 
      className={cn(
        `relative rounded-lg bg-gradient-to-br ${colorMap[color]} 
        shadow-lg transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}
        ${padding}`,
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="relative z-10">
        {children}
      </div>
      <div 
        className={cn(
          `absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
          ${disabled ? '' : 'group-hover:opacity-30'}`,
          {
            'bg-blue-400 animate-pulse': color === 'blue',
            'bg-purple-400 animate-pulse': color === 'purple',
            'bg-green-400 animate-pulse': color === 'green',
            'bg-red-400 animate-pulse': color === 'red',
            'bg-pink-400 animate-pulse': color === 'pink',
          }
        )}
      />
    </div>
  );
};

export default NeonEffect;
