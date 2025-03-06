
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
      case "low": return 15;
      case "medium": return 30;
      case "high": return 50;
      default: return 30;
    }
  };

  const getBackgroundParticleCount = () => {
    switch (intensity) {
      case "low": return 5;
      case "medium": return 10;
      case "high": return 15;
      default: return 10;
    }
  };

  const particleCount = getParticleCount();
  const backgroundParticleCount = getBackgroundParticleCount();

  const particles = React.useMemo(() => Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 10,
    size: 5 + Math.random() * 20,
    duration: 10 + Math.random() * 25,
    delay: Math.random() * 15,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    wind: Math.random() * 50 - 25
  })), [particleCount, animKey]);

  const backgroundParticles = React.useMemo(() => Array.from({ length: backgroundParticleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 80,
    duration: 15 + Math.random() * 30,
    delay: Math.random() * 5,
    opacity: 0.3 + Math.random() * 0.4
  })), [backgroundParticleCount, animKey]);

  const getSeasonalStyles = () => {
    switch (season) {
      case "spring":
        return {
          className: "from-pink-50 to-blue-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f9a8d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'%3E%3C/circle%3E%3Cpath d='M12 4a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M20 12a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M12 20a1 1 0 0 0 1-1h-2a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='M4 12a1 1 0 0 0 1-1H3a1 1 0 0 0 1 1Z'%3E%3C/path%3E%3Cpath d='m18.364 5.636-.707.707A1 1 0 0 0 18.364 5.636Z'%3E%3C/path%3E%3Cpath d='m5.636 18.364-.707.707A1 1 0 0 0 5.636 18.364Z'%3E%3C/path%3E%3Cpath d='m18.364 18.364.707.707A1 1 0 0 1 18.364 18.364Z'%3E%3C/path%3E%3Cpath d='m5.636 5.636.707.707A1 1 0 0 1 5.636 5.636Z'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9'%3E%3C/path%3E%3Cpath d='M12 3v6'%3E%3C/path%3E%3Cpath d='M5 10c8 0 10-7 10-7'%3E%3C/path%3E%3Cpath d='M5 10h6'%3E%3C/path%3E%3Cpath d='M19 10c-8 0-10-7-10-7'%3E%3C/path%3E%3Cpath d='M19 10h-6'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fbcfe8' stroke='%23ec4899' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fbcfe8' stroke='%23ec4899' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L9.5 7 3 8.5 7.5 13 6 19.5 12 17l6 2.5-1.5-6.5 4.5-4.5-6.5-1.5L12 2z'/%3E%3C/svg%3E",
          ],
          backgroundImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fce7f3' stroke='%23ec4899' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='6'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3C/svg%3E",
          ],
          animation: "animate-fall-slow-rotate",
          gradientColors: "from-pink-200/70 to-blue-100/60",
          overlayColor: "bg-pink-500/5",
          buttonBg: "bg-gradient-to-r from-pink-300 to-pink-200",
          buttonShadow: "shadow-pink-200",
          buttonRingColor: "ring-pink-400"
        };
      case "summer":
        return {
          className: "from-amber-50 to-yellow-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'%3E%3C/circle%3E%3Cpath d='M12 1v2'%3E%3C/path%3E%3Cpath d='M12 21v2'%3E%3C/path%3E%3Cpath d='M4.22 4.22l1.42 1.42'%3E%3C/path%3E%3Cpath d='M18.36 18.36l1.42 1.42'%3E%3C/path%3E%3Cpath d='M1 12h2'%3E%3C/path%3E%3Cpath d='M21 12h2'%3E%3C/path%3E%3Cpath d='M4.22 19.78l1.42-1.42'%3E%3C/path%3E%3Cpath d='M18.36 5.64l1.42-1.42'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fcd34d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22.608 12.195l-1.4-1.4c-.625-.625-1.608-.924-2.514-.737a5.258 5.258 0 0 1-5.666-5.666c.188-.906-.111-1.89-.737-2.514l-1.4-1.4c-.5-.5-1.301-.5-1.8 0L4.883 4.687c-.5.5-.5 1.3 0 1.8l1.4 1.4c.625.624.925 1.608.737 2.514a5.258 5.258 0 0 1 5.666 5.666c-.188.906.112 1.89.737 2.514l1.4 1.4c.5.5 1.301.5 1.8 0l5.308-5.308c.5-.5.5-1.3 0-1.8Z'%3E%3C/path%3E%3Cpath d='M15 9l-3 2'%3E%3C/path%3E%3Cpath d='M1 1l5 5'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fef3c7' stroke='%23fbbf24' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cline x1='12' y1='1' x2='12' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='23'/%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'/%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'/%3E%3Cline x1='1' y1='12' x2='3' y2='12'/%3E%3Cline x1='21' y1='12' x2='23' y2='12'/%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'/%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fef3c7' stroke='%23fbbf24' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='6'/%3E%3C/svg%3E"
          ],
          backgroundImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fef3c7' stroke='%23f59e0b' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3C/svg%3E"
          ],
          animation: "animate-float-pulse",
          gradientColors: "from-amber-200/70 to-yellow-100/60",
          overlayColor: "bg-amber-500/5",
          buttonBg: "bg-gradient-to-r from-amber-300 to-yellow-200",
          buttonShadow: "shadow-amber-200",
          buttonRingColor: "ring-amber-400"
        };
      case "autumn":
        return {
          className: "from-orange-50 to-amber-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ea580c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 16c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 12c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3Cpath d='M5 8c.6.5 1.2 1 2.5 1 3 0 4.5-2 8.5-2 1.3 0 1.9.5 2.5 1'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'%3E%3C/path%3E%3Cpath d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fdba74' stroke='%23c2410c' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffedd5' stroke='%23ea580c' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a9.96 9.96 0 0 0-6.29 2.23 9.96 9.96 0 0 0-3.43 5.88A9.96 9.96 0 0 0 2.2 16.4a10 10 0 0 0 4.38 4.38 9.96 9.96 0 0 0 6.29 1.08 9.96 9.96 0 0 0 5.88-3.43A9.96 9.96 0 0 0 21 16.14 10 10 0 0 0 16.62 7.6 9.96 9.96 0 0 0 12 2Z'/%3E%3C/svg%3E"
          ],
          backgroundImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffedd5' stroke='%23ea580c' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12s-2.39-4.1-5.95-4.1-6.09 4.1-6.09 4.1-2.34 4.1-5.95 4.1S1 16.1 1 16.1'/%3E%3Cpath d='M21 16.1s-2.39-4.1-5.95-4.1-6.09 4.1-6.09 4.1-2.34 4.1-5.95 4.1S1 20.2 1 20.2'/%3E%3Cpath d='M21 7.9s-2.39-4.1-5.95-4.1-6.09 4.1-6.09 4.1-2.34 4.1-5.95 4.1S1 11.9 1 11.9'/%3E%3C/svg%3E",
          ],
          animation: "animate-fall-rotate",
          gradientColors: "from-orange-200/70 to-amber-100/60",
          overlayColor: "bg-orange-500/5",
          buttonBg: "bg-gradient-to-r from-orange-300 to-amber-200",
          buttonShadow: "shadow-orange-200",
          buttonRingColor: "ring-orange-400"
        };
      case "winter":
        return {
          className: "from-blue-50 to-indigo-50",
          particleImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e0f2fe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'%3E%3C/path%3E%3Cpath d='M12 2v20'%3E%3C/path%3E%3Cpath d='m4.93 4.93 14.14 14.14'%3E%3C/path%3E%3Cpath d='m19.07 4.93-14.14 14.14'%3E%3C/path%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23e5e7eb' stroke='%23bfdbfe' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2v20'/%3E%3Cpath d='m4.93 4.93 14.14 14.14'/%3E%3Cpath d='m19.07 4.93-14.14 14.14'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23f9fafb' stroke='%23bfdbfe' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 14 .5-1'/%3E%3Cpath d='m9.5 8.5.5-1'/%3E%3Cpath d='m16 16 .5-1'/%3E%3Cpath d='M20 11h1'/%3E%3Cpath d='M14 6h1'/%3E%3Cpath d='M6 10h1'/%3E%3Cpath d='m3 14 1 .5'/%3E%3Cpath d='m9.5 8.5 1 .5'/%3E%3Cpath d='m16 16 1 .5'/%3E%3Cpath d='M13 20a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z'/%3E%3Cpath d='M13 20h-2'/%3E%3Cpath d='M5 8a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z'/%3E%3Cpath d='M5 8H3'/%3E%3Cpath d='M17 4a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z'/%3E%3Cpath d='M17 4h-2'/%3E%3C/svg%3E"
          ],
          backgroundImages: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23eff6ff' stroke='%2393c5fd' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2v20'/%3E%3Cpath d='m4.93 4.93 14.14 14.14'/%3E%3Cpath d='m19.07 4.93-14.14 14.14'/%3E%3C/svg%3E"
          ],
          animation: "animate-fall",
          gradientColors: "from-blue-200/70 to-indigo-100/60",
          overlayColor: "bg-blue-500/5",
          buttonBg: "bg-gradient-to-r from-blue-300 to-indigo-200",
          buttonShadow: "shadow-blue-200",
          buttonRingColor: "ring-blue-400"
        };
    }
  };

  const seasonalStyles = getSeasonalStyles();

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
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            
            {/* Cherry blossom tree */}
            <motion.div 
              className="absolute bottom-0 left-[10%] w-[30%] opacity-60 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 300V150" stroke="#be185d" strokeWidth="8" />
                <path d="M100 150C80 120 85 80 100 50C120 80 125 120 100 150Z" fill="#fce7f3" stroke="#be185d" strokeWidth="2" />
                <path d="M80 90C60 75 55 35 80 10C85 40 95 60 80 90Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
                <path d="M120 90C140 75 145 35 120 10C115 40 105 60 120 90Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
                <circle cx="75" cy="60" r="8" fill="#ec4899" />
                <circle cx="125" cy="60" r="8" fill="#ec4899" />
                <circle cx="100" cy="80" r="10" fill="#ec4899" />
              </svg>
            </motion.div>
            
            {/* Additional cherry blossom tree */}
            <motion.div 
              className="absolute bottom-0 right-[15%] w-[25%] opacity-40 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 300V170" stroke="#be185d" strokeWidth="6" />
                <path d="M100 170C85 140 80 110 100 80C115 110 120 140 100 170Z" fill="#fce7f3" stroke="#be185d" strokeWidth="2" />
                <path d="M85 120C65 100 60 70 80 50C90 75 95 95 85 120Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
                <path d="M115 120C135 100 140 70 120 50C110 75 105 95 115 120Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
                <circle cx="85" cy="90" r="6" fill="#ec4899" />
                <circle cx="115" cy="90" r="6" fill="#ec4899" />
                <circle cx="100" cy="105" r="8" fill="#ec4899" />
              </svg>
            </motion.div>
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
            <motion.div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-yellow-300/30 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
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
            
            {/* Bright sun with rays */}
            <motion.div 
              className="absolute top-[10%] right-[15%] w-[20%] h-[20%]"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.9, 0.7],
                rotate: [0, 180]
              }}
              transition={{ 
                scale: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                opacity: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" }
              }}
            >
              <div className="absolute inset-0 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"></div>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                  key={`ray-${i}`}
                  className="absolute w-1 h-[130%] bg-yellow-200 left-1/2 top-1/2 origin-bottom rounded-full"
                  style={{ 
                    transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg)`, 
                  }}
                  animate={{
                    scaleY: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Heat waves */}
            <div className="absolute bottom-0 inset-x-0 h-[15%] overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`heatwave-${i}`}
                  className="absolute w-full h-[15%] bg-amber-200/20"
                  style={{
                    bottom: `${i * 20}%`,
                    borderRadius: '50% 50% 0 0',
                    height: '10px'
                  }}
                  animate={{
                    scaleX: [0.9, 1.1, 0.9],
                    opacity: [0.2, 0.3, 0.2],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
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
            
            {/* Autumn tree */}
            <motion.div 
              className="absolute bottom-0 left-[15%] w-[30%] opacity-70 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1.5 }}
            >
              <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 300V150" stroke="#92400e" strokeWidth="10" />
                <path d="M100 150C70 120 65 80 80 50C70 30 80 10 100 20C120 10 130 30 120 50C135 80 130 120 100 150Z" fill="#ea580c" stroke="#92400e" strokeWidth="2" />
                <path d="M70 100C50 90 45 70 60 50C50 35 55 20 70 25C85 20 90 35 80 50C95 70 90 90 70 100Z" fill="#f97316" stroke="#92400e" strokeWidth="2" />
                <path d="M130 100C150 90 155 70 140 50C150 35 145 20 130 25C115 20 110 35 120 50C105 70 110 90 130 100Z" fill="#f97316" stroke="#92400e" strokeWidth="2" />
              </svg>
            </motion.div>
            
            {/* Wind effect */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`wind-${i}`}
                  className="absolute h-[2px] bg-gradient-to-r from-transparent via-amber-200/40 to-transparent"
                  style={{
                    top: `${20 + i * 25}%`,
                    width: '100%',
                    left: '-100%'
                  }}
                  animate={{
                    left: ['100%']
                  }}
                  transition={{
                    duration: 8 + i * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 2
                  }}
                />
              ))}
            </div>
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
            
            {/* Snowy ground */}
            <div className="absolute bottom-0 inset-x-0 h-[5%] bg-gradient-to-t from-blue-50 to-transparent"></div>
            
            {/* Distant mountain/ice */}
            <motion.div 
              className="absolute bottom-0 left-0 w-[70%] h-[25%] opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2 }}
            >
              <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100L120 30L200 70L320 20L400 80L400 100L0 100Z" fill="#e0f2fe" />
                <path d="M0 100L120 30L200 70L320 20L400 80" stroke="#bfdbfe" strokeWidth="2" />
              </svg>
            </motion.div>
            
            {/* Winter fog */}
            <motion.div 
              className="absolute bottom-0 inset-x-0 h-[20%] bg-gradient-to-t from-blue-50/40 to-transparent"
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
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

      {/* Background particles */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {backgroundParticles.map((particle) => (
            <motion.img
              key={`bg-${season}-${particle.id}-${animKey}`}
              src={seasonalStyles.backgroundImages?.[particle.id % seasonalStyles.backgroundImages.length] || seasonalStyles.particleImages[0]}
              alt=""
              className="absolute"
              style={{ 
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
              }}
              animate={{
                scale: [1, 1.1, 0.9, 1],
                opacity: [particle.opacity, particle.opacity * 1.2, particle.opacity * 0.8, particle.opacity],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: particle.duration / 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay
              }}
            />
          ))}
        </AnimatePresence>
      </div>

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
                  scale: [1, 1.3, 1],
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

      {/* Foreground particles (falling elements) */}
      <div className="absolute inset-0 z-10">
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
                height: `${particle.size}px`,
                rotate: `${particle.rotation}deg`
              }}
              initial={{ 
                y: "-10vh", 
                x: particle.x + "%",
                opacity: 0,
                rotate: particle.rotation
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: 
                  season === "autumn" 
                    ? [
                        particle.x + "%", 
                        (particle.x + particle.wind * 0.3) + "%", 
                        (particle.x + particle.wind) + "%", 
                        (particle.x + particle.wind * 1.5) + "%"
                      ] 
                    : season === "winter" 
                      ? [
                          particle.x + "%", 
                          (particle.x + (Math.sin(particle.id) * 15)) + "%",
                          (particle.x + (Math.cos(particle.id) * 15)) + "%"
                        ] 
                      : [
                          particle.x + "%", 
                          (particle.x + (Math.random() * 40 - 20)) + "%"
                        ],
                rotate: 
                  season === "autumn" 
                    ? [
                        particle.rotation, 
                        particle.rotation + 180 * particle.rotationSpeed, 
                        particle.rotation + 360 * particle.rotationSpeed
                      ] 
                    : season === "spring" 
                      ? [
                          particle.rotation, 
                          particle.rotation + 120 * particle.rotationSpeed, 
                          particle.rotation + 240 * particle.rotationSpeed
                        ] 
                      : undefined,
                opacity: [0, 0.9, 0.7, 0]
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                y: "110vh"
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: season === "autumn" ? [0.2, 0.4, 0.8, 0.6] : "linear",
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
          style={{ 
            bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0))",
            right: "1.5rem"
          }}
        >
          {/* Nút tròn nhỏ có hiệu ứng thay đổi thời tiết */}
          <motion.button
            onClick={cycleSeason}
            className={`
              w-12 h-12 rounded-full shadow-lg
              backdrop-blur-md border flex items-center justify-center
              transition-all duration-500 relative overflow-hidden
              ring-2 ring-offset-2 ring-offset-background
              ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              ${seasonalStyles.buttonBg}
              ${seasonalStyles.buttonShadow}
              ${seasonalStyles.buttonRingColor}
            `}
            whileHover={{ scale: 1.1, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isTransitioning}
          >
            <motion.div 
              className="absolute inset-0 opacity-25"
              animate={{
                background: [
                  "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)",
                  "radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                  "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)",
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.span 
              className="text-xl relative z-10"
              animate={{ 
                rotate: isHovering ? [0, 20, -20, 20, 0] : [0, 15, -15, 0],
                scale: isHovering ? [1, 1.3, 1] : [1, 1.2, 1]
              }}
              transition={{ 
                duration: isHovering ? 1.5 : 3,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: isHovering ? 0 : 2
              }}
            >
              {getSeasonIcon(season)}
            </motion.span>
            
            {/* Hiệu ứng tỏa sáng */}
            <motion.div 
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
              }}
            />

            {/* Hiệu ứng theo mùa */}
            {season === "winter" && (
              <motion.div 
                className="absolute inset-0 opacity-50"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 30%, rgba(191,219,254,0.8) 0%, rgba(191,219,254,0) 50%)",
                    "radial-gradient(circle at 70% 70%, rgba(191,219,254,0.8) 0%, rgba(191,219,254,0) 50%)",
                    "radial-gradient(circle at 30% 30%, rgba(191,219,254,0.8) 0%, rgba(191,219,254,0) 50%)",
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
            
            {season === "summer" && (
              <motion.div 
                className="absolute h-5 w-5 bg-yellow-300 rounded-full blur-sm"
                style={{ top: "20%", left: "20%" }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}
            
            {season === "spring" && (
              <motion.div 
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 70%, rgba(249,168,212,0.5) 0%, rgba(249,168,212,0) 50%)",
                    "radial-gradient(circle at 70% 30%, rgba(249,168,212,0.5) 0%, rgba(249,168,212,0) 50%)",
                    "radial-gradient(circle at 30% 70%, rgba(249,168,212,0.5) 0%, rgba(249,168,212,0) 50%)",
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
            
            {season === "autumn" && (
              <motion.div 
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 70% 30%, rgba(251,146,60,0.5) 0%, rgba(251,146,60,0) 50%)",
                    "radial-gradient(circle at 30% 70%, rgba(251,146,60,0.5) 0%, rgba(251,146,60,0) 50%)",
                    "radial-gradient(circle at 70% 30%, rgba(251,146,60,0.5) 0%, rgba(251,146,60,0) 50%)",
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SeasonalEffects;
