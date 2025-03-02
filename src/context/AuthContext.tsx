
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/models";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginAsStudent: (name: string, className: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      // In a real app, this would be an actual API call to validate credentials
      if (username === "admin" && password === "password") {
        const adminUser: User = {
          id: "1",
          username,
          role: "admin",
        };
        
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
      } else {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsStudent = async (name: string, className: string) => {
    try {
      setIsLoading(true);
      // Create temporary user for student
      const studentUser: User = {
        id: Date.now().toString(),
        username: name.toLowerCase().replace(/\s/g, '.'),
        role: "student",
        name,
        className,
      };
      
      localStorage.setItem("user", JSON.stringify(studentUser));
      setUser(studentUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
