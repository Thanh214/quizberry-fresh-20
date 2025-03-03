
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Teacher } from "@/types/models";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginAsStudent: (name: string, className: string, studentId: string, examCode: string) => Promise<void>;
  registerTeacher: (name: string, faculty: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  teachers: Teacher[]; // Danh sách giáo viên để quản lý
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    // Kiểm tra phiên đăng nhập khi khởi động
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Lấy danh sách giáo viên từ localStorage
    const storedTeachers = localStorage.getItem("teachers");
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    }
    
    setIsLoading(false);
  }, []);

  // Đăng ký tài khoản giáo viên mới
  const registerTeacher = async (name: string, faculty: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra username đã tồn tại chưa
      const existingTeacher = teachers.find(teacher => teacher.username === username);
      if (existingTeacher) {
        throw new Error("Tên đăng nhập đã tồn tại");
      }
      
      // Tạo giáo viên mới
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name,
        faculty,
        username,
        password, // Lưu ý: Trong thực tế nên băm mật khẩu
        createdAt: new Date().toISOString(),
      };
      
      // Cập nhật danh sách giáo viên
      const updatedTeachers = [...teachers, newTeacher];
      setTeachers(updatedTeachers);
      
      // Lưu vào localStorage
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
      
      return;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra nếu là tài khoản admin
      if (username === "admin" && password === "password") {
        const adminUser: User = {
          id: "1",
          username,
          role: "admin",
        };
        
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        return;
      }
      
      // Kiểm tra tài khoản giáo viên
      const teacher = teachers.find(
        t => t.username === username && t.password === password
      );
      
      if (teacher) {
        const teacherUser: User = {
          id: teacher.id,
          username: teacher.username,
          role: "teacher",
          name: teacher.name,
          faculty: teacher.faculty
        };
        
        localStorage.setItem("user", JSON.stringify(teacherUser));
        setUser(teacherUser);
        return;
      }
      
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsStudent = async (name: string, className: string, studentId: string, examCode: string) => {
    try {
      setIsLoading(true);
      // Tạo tài khoản tạm thời cho học sinh
      const studentUser: User = {
        id: Date.now().toString(),
        username: name.toLowerCase().replace(/\s/g, '.'),
        role: "student",
        name,
        className,
        studentId,
      };
      
      localStorage.setItem("user", JSON.stringify(studentUser));
      localStorage.setItem("examCode", examCode); // Lưu mã bài thi
      setUser(studentUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("examCode");
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
        registerTeacher,
        logout,
        teachers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
