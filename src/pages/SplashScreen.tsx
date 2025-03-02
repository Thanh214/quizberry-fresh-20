
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show logo with animation
    setVisible(true);

    // Navigate to role selection after timeout
    const timer = setTimeout(() => {
      navigate("/role-selection");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/10">
      <div className="relative">
        <div className={`transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-50"></div>
          <div className="relative">
            <Logo className="scale-150" />
          </div>
        </div>
      </div>

      <TransitionWrapper delay={600} className="mt-8">
        <p className="text-xl text-center text-foreground/80 max-w-xs">
          Nền tảng thi trắc nghiệm hiện đại và đáng tin cậy
        </p>
      </TransitionWrapper>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center">
        <TransitionWrapper delay={1200}>
          <div className="h-2 w-32 bg-gradient-to-r from-primary/20 via-primary to-accent/20 rounded-full">
            <div className="h-full w-1/3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </TransitionWrapper>
      </div>
    </div>
  );
};

export default SplashScreen;
