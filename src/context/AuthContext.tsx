
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Teacher } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase";
import { toast } from "sonner";

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
  const { signIn, signOut, signUp, session, loading } = useSupabaseAuth();

  useEffect(() => {
    // Kiểm tra phiên đăng nhập từ Supabase
    if (session) {
      // Lấy thông tin hồ sơ người dùng từ profiles
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Lỗi khi lấy hồ sơ người dùng:", error);
          return;
        }

        if (data) {
          // Tạo đối tượng người dùng từ dữ liệu profile
          const userData: User = {
            id: session.user.id,
            username: data.username || session.user.email || '',
            role: data.role,
            name: data.name,
            faculty: data.faculty,
            className: data.class_name,
            studentId: data.student_id
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      };

      fetchUserProfile();
    } else {
      // Kiểm tra có user lưu trong localStorage không (cho học sinh tạm thời)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    }

    // Lấy danh sách giáo viên từ Supabase
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      if (error) {
        console.error("Lỗi khi lấy danh sách giáo viên:", error);
        return;
      }

      if (data) {
        const teachersList: Teacher[] = data.map(teacher => ({
          id: teacher.id,
          name: teacher.name || '',
          faculty: teacher.faculty || '',
          username: teacher.username || '',
          password: '', // Không lưu mật khẩu
          createdAt: teacher.created_at
        }));
        setTeachers(teachersList);
      }
    };

    fetchTeachers();
    setIsLoading(loading);
  }, [session, loading]);

  // Đăng ký tài khoản giáo viên mới
  const registerTeacher = async (name: string, faculty: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Đăng ký tài khoản mới với Supabase Auth
      const { data, error } = await signUp(username, password, {
        name,
        faculty,
        role: 'teacher'
      });
      
      if (error) throw error;
      
      // Lưu thông tin bổ sung vào bảng profiles
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          faculty,
          username,
          role: 'teacher',
          created_at: new Date().toISOString()
        });
      }
      
      toast.success('Đăng ký tài khoản giáo viên thành công!');
      return;
    } catch (error: any) {
      toast.error(`Đăng ký thất bại: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra nếu là tài khoản admin đặc biệt
      if (username === "admin" && password === "password") {
        const adminUser: User = {
          id: "admin",
          username,
          role: "admin",
        };
        
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        return;
      }
      
      // Sử dụng Supabase Auth để đăng nhập
      await signIn(username, password);
      
    } catch (error: any) {
      toast.error(`Đăng nhập thất bại: ${error.message}`);
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
    } catch (error: any) {
      toast.error(`Đăng nhập thất bại: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Đăng xuất khỏi Supabase nếu đang đăng nhập
    if (session) {
      signOut();
    }
    
    // Xóa dữ liệu local
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
