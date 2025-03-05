import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonalEffectsProps {
  season?: Season;
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
  onSeasonChange?: (season: Season) => void;
  className?: string;
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({
  season: initialSeason,
  intensity = "medium",
  interactive = true,
  onSeasonChange,
  className = "",
}) => {
  const [season, setSeason] = useState<Season>(initialSeason || getCurrentSeason());
  const [isHovering, setIsHovering] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSeasonRef = useRef(season);

  useEffect(() => {
    if (initialSeason !== prevSeasonRef.current) {
      setSeason(initialSeason || getCurrentSeason());
      prevSeasonRef.current = initialSeason || getCurrentSeason();
      setAnimKey(prev => prev + 1);
    }
  }, [initialSeason]);

  function getCurrentSeason(): Season {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  }

  const getParticleCount = () => {
    switch (intensity) {
      case "low": return 10;
      case "medium": return 20;
      case "high": return 30;
      default: return 20;
    }
  };

  const particleCount = getParticleCount();

  const particles = React.useMemo(() => Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 10,
    size: 5 + Math.random() * 15,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 10
  })), [particleCount, animKey]);

  const getSeasonalStyles = () => {
    switch (season) {
      case "spring":
        return {
          className: "from-pink-50 to-blue-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f9a8d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'%3E%3C/circle%3E%3Cpath d='M12 4a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M20 12a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M12 20a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M4 12a1 1 0 0 0 1-1H3a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='m18.364 5.636-.707.707A1 1 0 0 0 18.364 5.636Z'%3E%3C/path%3E%3Cpath d='m5.636 18.364-.707.707A1 1 0 0 0 5.636 18.364Z'%3E%3C/path%3E%3Cpath d='m18.364 18.364.707.707A1 1 0 0 1 18.364 18.364Z'%3E%3C/path%3E%3Cpath d='m5.636 5.636.707.707A1 1 0 0 1 5.636 5.636Z'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9'%3E%3C/path%3E%3Cpath d='M12 3v6'%3E%3C/path%3E%3Cpath d='M5 10c8 0 10-7 10-7'%3E%3C/path%3E%3Cpath d='M5 10h6'%3E%3C/path%3E%3Cpath d='M19 10c-8 0-10-7-10-7'%3E%3C/path%3E%3Cpath d='M19 10h-6'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall-slow-rotate",
          gradientColors: "from-pink-200/70 to-blue-100/60",
          overlayColor: "bg-pink-500/5",
          buttonBg: "bg-pink-50/90 hover:bg-pink-100/90 border-pink-200",
          buttonText: "text-pink-600"
        };
      case "summer":
        return {
          className: "from-amber-50 to-yellow-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'%3E%3C/circle%3E%3Cpath d='M12 1v2'%3E%3C/path%3E%3Cpath d='M12 21v2'%3E%3C/path%3E%3Cpath d='M4.22 4.22l1.42 1.42'%3E%3C/path%3E%3Cpath d='M18.36 18.36l1.42 1.42'%3E%3C/path%3E%3Cpath d='M1 12h2'%3E%3C/path%3E%3Cpath d='M21 12h2'%3E%3C/path%3E%3Cpath d='M4.22 19.78l1.42-1.42'%3E%3C/path%3E%3Cpath d='M18.36 5.64l1.42-1.42'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fcd34d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22.608 12.195l-1.4-1.4c-.625-.625-1.608-.924-2.514-.737a5.258 5.258 0 0 1-5.666-5.666c.188-.906-.111-1.89-.737-2.514l-1.4-1.4c-.5-.5-1.301-.5-1.8 0L4.883 4.687c-.5.5-.5 1.3 0 1.8l1.4 1.4c.625.624.925 1.608.737 2.514a5.258 5.258 0 0 1 5.666 5.666c-.188.906.112 1.89.737 2.514l1.4 1.4c.5.5 1.301.5 1.8 0l5.308-5.308c.5-.5.5-1.3 0-1.8Z'%3E%3C/path%3E%3Cpath d='M15 9l-3 2'%3E%3C/path%3E%3Cpath d='M1 1l5 5'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-float-pulse",
          gradientColors: "from-amber-200/70 to-yellow-100/60",
          overlayColor: "bg-amber-500/5",
          buttonBg: "bg-amber-50/90 hover:bg-amber-100/90 border-amber-200",
          buttonText: "text-amber-600"
        };
      case "autumn":
        return {
          className: "from-orange-50 to-amber-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ea580c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 16c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 12c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 8c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'%3E%3C/path%3E%3Cpath d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall-rotate",
          gradientColors: "from-orange-200/70 to-amber-100/60",
          overlayColor: "bg-orange-500/5",
          buttonBg: "bg-orange-50/90 hover:bg-orange-100/90 border-orange-200",
          buttonText: "text-orange-600"
        };
      case "winter":
        return {
          className: "from-blue-50 to-indigo-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e0f2fe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E"
          ],
          animation: "animate-fall",
          gradientColors: "from-blue-200/70 to-indigo-100/60",
          overlayColor: "bg-blue-500/5",
          buttonBg: "bg-blue-50/90 hover:bg-blue-100/90 border-blue-200",
          buttonText: "text-blue-600"
        };
    }
  };

  const seasonalStyles = getSeasonalStyles();

  const getSeasonName = (season: Season): string => {
    switch (season) {
      case "spring": return "Mùa Xuân";
      case "summer": return "Mùa Hè";
      case "autumn": return "Mùa Thu";
      case "winter": return "Mùa Đông";
    }
  };

  const getSeasonIcon = (season: Season): string => {
    switch (season) {
      case "spring": return "🌸";
      case "summer": return "☀️";
      case "autumn": return "🍂";
      case "winter": return "❄️";
    }
  };

  const cycleSeason = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
    const currentIndex = seasons.indexOf(season);
    const nextIndex = (currentIndex + 1) % seasons.length;
    const nextSeason = seasons[nextIndex];
    
    setAnimKey(prev => prev + 1);
    
    setTimeout(() => {
      setSeason(nextSeason);
      prevSeasonRef.current = nextSeason;
      
      if (onSeasonChange) {
        onSeasonChange(nextSeason);
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 400);
  };

  const renderSeasonalBackground = () => {
    switch (season) {
      case "spring":
        return (
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            key="spring-bg"
          >
            <motion.div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
          </motion.div>
        );
      case "summer":
        return (
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            key="summer-bg"
          >
            <motion.div className="absolute -top-[5%] -right-[10%] w-[40%] h-[40%] rounded-full bg-yellow-100/40 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div className="absolute -bottom-[15%] -left-[5%] w-[30%] h-[30%] rounded-full bg-amber-100/40 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            />
          </motion.div>
        );
      case "autumn":
        return (
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            key="autumn-bg"
          >
            <motion.div className="absolute -top-[15%] -left-[5%] w-[45%] h-[45%] rounded-full bg-orange-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.45, 0.3],
              }}
              transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div className="absolute -bottom-[10%] -right-[10%] w-[35%] h-[35%] rounded-full bg-amber-100/40 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
            />
          </motion.div>
        );
      case "winter":
        return (
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            key="winter-bg"
          >
            <motion.div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div className="absolute -bottom-[5%] -right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={`gradient-${season}`}
          className={`absolute inset-0 bg-gradient-to-b ${seasonalStyles.gradientColors}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {renderSeasonalBackground()}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`overlay-${season}`}
          className={`absolute inset-0 ${seasonalStyles.overlayColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {season === 'spring' && (
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pink-100/40 to-transparent"
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            />
          )}
          {season === 'summer' && (
            <div className="absolute top-0 left-0 w-full">
              <motion.div 
                className="absolute top-10 right-10 w-20 h-20 rounded-full bg-yellow-300/40 blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          )}
          {season === 'autumn' && (
            <motion.div 
              className="absolute top-0 right-0 w-full h-24 bg-gradient-to-b from-orange-100/40 to-transparent"
              initial={{ y: -24 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            />
          )}
          {season === 'winter' && (
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-blue-100/15 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {particles.map((particle) => (
            <motion.img
              key={`${season}-${particle.id}-${animKey}`}
              src={seasonalStyles.particleImages[particle.id % seasonalStyles.particleImages.length]}
              alt=""
              className={`absolute opacity-${20 + Math.floor(particle.size) * 2} ${seasonalStyles.animation}`}
              style={{ 
                left: `${particle.x}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`
              }}
              initial={{ 
                y: "-10vh", 
                x: particle.x + "%",
                opacity: 0
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: season === "winter" ? 
                  [particle.x + "%", (particle.x + (Math.random() * 20 - 10)) + "%"] : 
                  [particle.x + "%", (particle.x + (Math.random() * 40 - 20)) + "%"],
                opacity: [0, 0.8, 0.6, 0]
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                y: "110vh"
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear",
                delay: particle.delay
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {interactive && (
        <motion.div 
          className="fixed bottom-6 right-4 z-50 pointer-events-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <motion.button
            onClick={cycleSeason}
            className={`
              px-6 py-2.5 rounded-full text-sm font-medium shadow-lg
              backdrop-blur-md border 
              transition-all duration-500
              ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              ${seasonalStyles.buttonBg}
            `}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isTransitioning}
          >
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-lg"
                animate={{ 
                  rotate: isHovering ? [0, 10, -10, 10, 0] : [0, 10, -10, 0],
                  scale: isHovering ? [1, 1.3, 1] : [1, 1.2, 1]
                }}
                transition={{ 
                  duration: isHovering ? 1 : 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: isHovering ? 0 : 3
                }}
              >
                {getSeasonIcon(season)}
              </motion.span>
              <span className={`
                font-medium transition-colors duration-500
                ${seasonalStyles.buttonText}
              `}>
                {getSeasonName(season)}
              </span>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SeasonalEffects;
