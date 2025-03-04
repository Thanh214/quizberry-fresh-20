
import React from "react";

interface NeonDecorationProps {
  color?: "purple" | "blue" | "green" | "red" | "pink";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
  opacity?: number;
  className?: string;
}

const NeonDecoration: React.FC<NeonDecorationProps> = ({
  color = "purple",
  position = "top-right",
  size = "md",
  opacity = 0.15,
  className = "",
}) => {
  // Color gradient maps
  const colorMap = {
    purple: "from-purple-500 to-indigo-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-rose-500",
    pink: "from-pink-500 to-purple-500",
  };

  // Size maps
  const sizeMap = {
    sm: {
      width: "w-32 md:w-48",
      height: "h-32 md:h-48",
      blur: "blur-2xl",
    },
    md: {
      width: "w-48 md:w-72",
      height: "h-48 md:h-72",
      blur: "blur-3xl",
    },
    lg: {
      width: "w-64 md:w-96",
      height: "h-64 md:h-96",
      blur: "blur-4xl",
    },
  };

  // Position maps
  const positionMap = {
    "top-left": "-top-20 -left-20",
    "top-right": "-top-20 -right-20",
    "bottom-left": "-bottom-20 -left-20",
    "bottom-right": "-bottom-20 -right-20",
  };

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${colorMap[color]} ${sizeMap[size].width} ${sizeMap[size].height} ${sizeMap[size].blur} ${positionMap[position]} ${className}`}
      style={{ opacity }}
    />
  );
};

export default NeonDecoration;
