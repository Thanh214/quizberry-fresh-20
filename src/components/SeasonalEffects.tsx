
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonalEffectsProps {
  season?: Season;
  intensity?: "low" | "medium" | "high";
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({
  season: initialSeason,
  intensity = "medium",
}) => {
  // Determine season based on current month if not provided
  const [season, setSeason] = useState<Season>(initialSeason || getCurrentSeason());
  
  function getCurrentSeason(): Season {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  }

  // Number of particles based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low": return 10;
      case "medium": return 20;
      case "high": return 30;
      default: return 20;
    }
  };

  const particleCount = getParticleCount();
  
  // Create particles array for animation
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // random position
    y: -10 - Math.random() * 10, // start above the viewport
    size: 5 + Math.random() * 15,
    duration: 10 + Math.random() * 20
  }));

  // Provide seasonal styles and animations
  const getSeasonalStyles = () => {
    switch (season) {
      case "spring":
        return {
          className: "from-pink-50 to-blue-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f9a8d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9'%3E%3C/path%3E%3Cpath d='M12 3v6'%3E%3C/path%3E%3Cpath d='M5 10c8 0 10-7 10-7'%3E%3C/path%3E%3Cpath d='M5 10h6'%3E%3C/path%3E%3Cpath d='M19 10c-8 0-10-7-10-7'%3E%3C/path%3E%3Cpath d='M19 10h-6'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9'%3E%3C/path%3E%3Cpath d='M12 3v6'%3E%3C/path%3E%3Cpath d='M5 10c8 0 10-7 10-7'%3E%3C/path%3E%3Cpath d='M5 10h6'%3E%3C/path%3E%3Cpath d='M19 10c-8 0-10-7-10-7'%3E%3C/path%3E%3Cpath d='M19 10h-6'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall-slow-rotate"
        };
      case "summer":
        return {
          className: "from-amber-50 to-yellow-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'%3E%3C/circle%3E%3Cpath d='M12 1v2'%3E%3C/path%3E%3Cpath d='M12 21v2'%3E%3C/path%3E%3Cpath d='M4.22 4.22l1.42 1.42'%3E%3C/path%3E%3Cpath d='M18.36 18.36l1.42 1.42'%3E%3C/path%3E%3Cpath d='M1 12h2'%3E%3C/path%3E%3Cpath d='M21 12h2'%3E%3C/path%3E%3Cpath d='M4.22 19.78l1.42-1.42'%3E%3C/path%3E%3Cpath d='M18.36 5.64l1.42-1.42'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fcd34d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22.608 12.195l-1.4-1.4c-.625-.625-1.608-.924-2.514-.737a5.258 5.258 0 0 1-5.666-5.666c.188-.906-.111-1.89-.737-2.514l-1.4-1.4c-.5-.5-1.301-.5-1.8 0L4.883 4.687c-.5.5-.5 1.3 0 1.8l1.4 1.4c.625.624.925 1.608.737 2.514a5.258 5.258 0 0 1 5.666 5.666c-.188.906.112 1.89.737 2.514l1.4 1.4c.5.5 1.301.5 1.8 0l5.308-5.308c.5-.5.5-1.3 0-1.8Z'%3E%3C/path%3E%3Cpath d='M15 9l-3 2'%3E%3C/path%3E%3Cpath d='M1 1l5 5'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-float-pulse"
        };
      case "autumn":
        return {
          className: "from-orange-50 to-amber-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ea580c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 16c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 12c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 8c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'%3E%3C/path%3E%3Cpath d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall-rotate"
        };
      case "winter":
        return {
          className: "from-blue-50 to-indigo-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e0f2fe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall"
        };
    }
  };

  const seasonalStyles = getSeasonalStyles();

  // Allow season to be changed via UI (optional)
  const cycleSeason = () => {
    const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
    const currentIndex = seasons.indexOf(season);
    const nextIndex = (currentIndex + 1) % seasons.length;
    setSeason(seasons[nextIndex]);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Seasonal background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${seasonalStyles.className} opacity-50`} />

      {/* Falling particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.img
            key={particle.id}
            src={seasonalStyles.particleImages[particle.id % seasonalStyles.particleImages.length]}
            alt=""
            className={`absolute w-${Math.ceil(particle.size)}  h-${Math.ceil(particle.size)} opacity-${20 + Math.floor(particle.size) * 2} ${seasonalStyles.animation}`}
            style={{ 
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              y: ["0vh", "100vh"],
              x: season === "winter" ? 
                [particle.x + "%", (particle.x + (Math.random() * 20 - 10)) + "%"] : 
                [particle.x + "%", (particle.x + (Math.random() * 40 - 20)) + "%"]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* Season indicator (can be removed if not needed) */}
      <div className="absolute bottom-4 right-4 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm text-gray-700 cursor-pointer" onClick={cycleSeason}>
        {season.charAt(0).toUpperCase() + season.slice(1)}
      </div>
    </div>
  );
};

export default SeasonalEffects;
