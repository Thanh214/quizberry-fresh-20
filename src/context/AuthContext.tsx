
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Teacher } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/supabase/use-supabase-auth";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsStudent: (name: string, className: string, studentId: string, examCode: string) => Promise<void>;
  registerTeacher: (name: string, faculty: string, email: string, password: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  logout: () => void;
  teachers: Teacher[]; // Danh sách giáo viên để quản lý
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const { signIn, signOut, signUp, session, loading, resendVerificationEmail } = useSupabaseAuth();

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
          // Ensure role is one of the valid values
          const role = data.role as "admin" | "student" | "teacher";
          
          // Tạo đối tượng người dùng từ dữ liệu profile
          const userData: User = {
            id: session.user.id,
            username: data.username || session.user.email || '',
            email: session.user.email,
            role: role,
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
          email: teacher.username ? `${teacher.username}@example.com` : '',
          password: '', // Không lưu mật khẩu
          createdAt: teacher.created_at
        }));
        setTeachers(teachersList);
      }
    };

    fetchTeachers();
    setIsLoading(loading);
  }, [session, loading]);

  const registerTeacher = async (name: string, faculty: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Đăng ký tài khoản mới với Supabase Auth
      const result = await signUp(email, password, {
        data: {
          name,
          faculty,
          role: 'teacher'
        }
      });
      
      if (result.error) throw result.error;
      
      // Lưu thông tin bổ sung vào bảng profiles
      if (result.data?.user) {
        const username = email.split('@')[0];
        
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: result.data.user.id,
          name,
          faculty,
          username,
          email: email,
          role: 'teacher',
          created_at: new Date().toISOString()
        });

        if (profileError) {
          console.error("Lỗi khi tạo hồ sơ giáo viên:", profileError);
          // Không throw lỗi ở đây vì đăng ký đã thành công, hồ sơ có thể được cập nhật sau
        }
      }
      
      return;
    } catch (error: any) {
      toast.error(`Đăng ký thất bại: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra nếu là tài khoản admin đặc biệt
      if (email === "admin@eputest.com" && password === "admin123") {
        const adminUser: User = {
          id: "admin",
          username: "admin",
          email: "admin@eputest.com",
          role: "admin",
        };
        
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        return;
      }
      
      // Sử dụng Supabase Auth để đăng nhập
      const result = await signIn(email, password);
      
      if (result.error) {
        throw result.error;
      }
      
    } catch (error: any) {
      // Trả về lỗi nguyên gốc để UI xử lý
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
        email: `${studentId.toLowerCase()}@eputest.com`,
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
        resendVerificationEmail,
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
