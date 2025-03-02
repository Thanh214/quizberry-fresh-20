
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
};

export default Layout;
