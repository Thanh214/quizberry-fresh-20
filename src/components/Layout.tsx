
import React, { useState, useEffect } from "react";
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
  
  // When season changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-season', season);
  }, [season]);
  
  // Handle season change from SeasonalEffects component
  const handleSeasonChange = (newSeason: Season) => {
    setSeason(newSeason);
  };
  
  // Get season-specific container classes
  const getSeasonClasses = (): string => {
    switch (season) {
      case "spring": return "bg-gradient-to-b from-pink-50/30 to-blue-50/30";
      case "summer": return "bg-gradient-to-b from-amber-50/30 to-yellow-50/30";
      case "autumn": return "bg-gradient-to-b from-orange-50/30 to-amber-50/30";
      case "winter": return "bg-gradient-to-b from-blue-50/30 to-indigo-50/30";
    }
  };

  return (
    <div className={cn(
      "min-h-screen px-4 py-6 md:px-6 md:py-10 transition-colors duration-700", 
      getSeasonClasses(),
      className
    )}>
      {showSeasonalEffects && (
        <SeasonalEffects 
          season={season} 
          intensity="medium" 
          onSeasonChange={handleSeasonChange}
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-5xl relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
