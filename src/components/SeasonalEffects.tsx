
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Snowflake, Cloud, Sun, Leaf } from "lucide-react";

type Season = "spring" | "summer" | "autumn" | "winter";
type Intensity = "low" | "medium" | "high";

interface SeasonalEffectsProps {
  season: Season;
  intensity?: Intensity;
  onSeasonChange?: (newSeason: Season) => void;
  className?: string;
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({
  season,
  intensity = "medium",
  onSeasonChange,
  className,
}) => {
  // Determine particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low": return 10;
      case "medium": return 20;
      case "high": return 40;
      default: return 20;
    }
  };
  
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; delay: number }>>([]);
  
  useEffect(() => {
    // Generate random particles based on season
    const particleCount = getParticleCount();
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // random position (0-100%)
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 0.2, // random size (0.2-1)
      speed: Math.random() * 1.5 + 0.5, // random speed
      delay: Math.random() * 5, // random animation delay
    }));
    
    setParticles(newParticles);
  }, [season, intensity]);
  
  // Season-specific elements
  const renderSeasonalEffects = () => {
    switch (season) {
      case "winter":
        return (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {particles.map((particle) => (
              <motion.div
                key={`snow-${particle.id}`}
                className="absolute text-white/20 dark:text-white/20"
                style={{
                  left: `${particle.x}%`,
                  top: `-5%`,
                  fontSize: `calc(${particle.size} * 1rem)`,
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [
                    `${particle.x}%`,
                    `${particle.x + (Math.random() * 10 - 5)}%`,
                    `${particle.x + (Math.random() * 10 - 5)}%`,
                    `${particle.x}%`
                  ],
                  opacity: [1, 0.8, 0.6, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8 / particle.speed,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "linear"
                }}
              >
                <Snowflake />
              </motion.div>
            ))}
          </div>
        );
      
      case "spring":
        return (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Cherry blossoms falling effect */}
            {particles.map((particle) => (
              <motion.div
                key={`petal-${particle.id}`}
                className="absolute text-pink-200/30 dark:text-pink-200/30"
                style={{
                  left: `${particle.x}%`,
                  top: `-5%`,
                  fontSize: `calc(${particle.size} * 1rem)`,
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [
                    `${particle.x}%`,
                    `${particle.x + (Math.random() * 15 - 7.5)}%`,
                    `${particle.x + (Math.random() * 15 - 7.5)}%`,
                    `${particle.x}%`
                  ],
                  opacity: [1, 0.9, 0.7, 0],
                  rotate: [0, 30, 60, 90]
                }}
                transition={{
                  duration: 8 / particle.speed,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              >
                ❀
              </motion.div>
            ))}
            
            {/* Clouds in the background */}
            <motion.div
              className="absolute text-blue-100/10 dark:text-blue-200/10 top-10 left-10 text-4xl"
              animate={{ x: ["0vw", "100vw"], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <Cloud />
            </motion.div>
          </div>
        );
      
      case "summer":
        return (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Sun rays */}
            <motion.div
              className="absolute top-10 right-10 text-4xl text-yellow-300/20 dark:text-yellow-300/20"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sun />
            </motion.div>
            
            {/* Shimmering heat effect */}
            {particles.map((particle) => (
              <motion.div
                key={`shimmer-${particle.id}`}
                className="absolute bg-white/5 dark:bg-white/5 w-2 h-2 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  scale: particle.size,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [particle.size, particle.size * 3, particle.size],
                }}
                transition={{
                  duration: 2 / particle.speed,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      
      case "autumn":
        return (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Falling leaves */}
            {particles.map((particle) => (
              <motion.div
                key={`leaf-${particle.id}`}
                className="absolute text-orange-500/20 dark:text-orange-400/30"
                style={{
                  left: `${particle.x}%`,
                  top: `-5%`,
                  fontSize: `calc(${particle.size} * 1.2rem)`,
                  filter: `hue-rotate(${particle.id * 10}deg)`,
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [
                    `${particle.x}%`,
                    `${particle.x + (Math.random() * 20 - 10)}%`,
                    `${particle.x + (Math.random() * 20 - 10)}%`,
                    `${particle.x}%`
                  ],
                  opacity: [1, 0.8, 0.6, 0],
                  rotate: [0, 90, 180, 270]
                }}
                transition={{
                  duration: 10 / particle.speed,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              >
                <Leaf />
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Season selector
  const renderSeasonSelector = () => {
    if (!onSeasonChange) return null;
    
    const seasons: { name: Season; icon: React.ReactNode; color: string }[] = [
      { name: "spring", icon: "🌸", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
      { name: "summer", icon: "☀️", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
      { name: "autumn", icon: "🍂", color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
      { name: "winter", icon: "❄️", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    ];
    
    return (
      <motion.div
        className="absolute bottom-4 right-4 flex gap-2 p-1 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {seasons.map((s) => (
          <button
            key={s.name}
            onClick={() => onSeasonChange(s.name)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              "hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              season === s.name 
                ? `${s.color} scale-110 shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-${s.color.split(" ")[0].replace("bg-", "")}`
                : "bg-white/50 dark:bg-gray-800/50"
            )}
            aria-label={`Change to ${s.name} theme`}
            title={`Change to ${s.name} theme`}
          >
            {s.icon}
          </button>
        ))}
      </motion.div>
    );
  };
  
  return (
    <div className={cn("relative w-full h-full", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {renderSeasonalEffects()}
        </motion.div>
      </AnimatePresence>
      {renderSeasonSelector()}
    </div>
  );
};

export default SeasonalEffects;
