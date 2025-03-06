
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SeasonalEffects from "./SeasonalEffects";

type Season = "spring" | "summer" | "autumn" | "winter";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showSeasonalEffects?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  showSeasonalEffects = true 
}) => {
  const [season, setSeason] = useState<Season>(() => {
    // Get season from localStorage or calculate based on current month
    const savedSeason = localStorage.getItem('preferred-season') as Season | null;
    if (savedSeason) return savedSeason;
    
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  });
  
  const [transitioning, setTransitioning] = useState(false);
  
  // When season changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-season', season);
    
    // Force a CSS variable update to refresh the UI
    document.documentElement.style.setProperty('--season-current', season);
    
    // Add a custom data attribute for season to the body element
    document.body.dataset.season = season;
    
    // Dispatch a custom event that components can listen for
    const seasonChangeEvent = new CustomEvent('seasonchange', { 
      detail: { season } 
    });
    document.dispatchEvent(seasonChangeEvent);
  }, [season]);
  
  // Handle season change from SeasonalEffects component
  const handleSeasonChange = useCallback((newSeason: Season) => {
    if (season !== newSeason) {
      setTransitioning(true);
      setTimeout(() => {
        setSeason(newSeason);
        setTimeout(() => {
          setTransitioning(false);
        }, 600);
      }, 400);
    }
  }, [season]);
  
  // Get season-specific container classes with more distinct colors and more transparency
  const getSeasonClasses = (): string => {
    switch (season) {
      case "spring": 
        return "bg-gradient-to-b from-pink-50/60 to-blue-50/60 dark:from-pink-950/30 dark:to-blue-950/30";
      case "summer": 
        return "bg-gradient-to-b from-amber-50/60 to-yellow-50/60 dark:from-amber-950/30 dark:to-yellow-950/30";
      case "autumn": 
        return "bg-gradient-to-b from-orange-50/60 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/30";
      case "winter": 
        return "bg-gradient-to-b from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30";
    }
  };
  
  // Get season-specific text accent color with more vivid colors
  const getSeasonAccentTextColor = (): string => {
    switch (season) {
      case "spring": return "text-pink-600";
      case "summer": return "text-amber-600";
      case "autumn": return "text-orange-600";
      case "winter": return "text-blue-600";
    }
  };
  
  // Get season-specific border accent color with more distinct colors
  const getSeasonAccentBorderColor = (): string => {
    switch (season) {
      case "spring": return "border-pink-300";
      case "summer": return "border-amber-300";
      case "autumn": return "border-orange-300";
      case "winter": return "border-blue-300";
    }
  };

  // Define season-specific button and accent colors
  const getSeasonAccentBgColor = (): string => {
    switch (season) {
      case "spring": return "bg-pink-500/10";
      case "summer": return "bg-amber-500/10";
      case "autumn": return "bg-orange-500/10";
      case "winter": return "bg-blue-500/10";
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen px-4 py-6 md:px-6 md:py-10 transition-colors duration-1000", 
        getSeasonClasses(),
        transitioning ? "animate-pulse" : "",
        className
      )}
      style={{
        "--season-text-accent": getSeasonAccentTextColor(),
        "--season-border-accent": getSeasonAccentBorderColor(),
        "--season-bg-accent": getSeasonAccentBgColor(),
      } as React.CSSProperties}
      data-season={season}
    >
      {showSeasonalEffects && (
        <SeasonalEffects 
          season={season} 
          intensity="medium" 
          onSeasonChange={handleSeasonChange}
          className="pb-safe fixed inset-0 pointer-events-none z-0" 
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${season}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl relative z-10 pb-safe"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
