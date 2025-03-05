
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-background to-secondary/50 px-4 py-6 md:px-6 md:py-10", className)}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
};

export default Layout;
