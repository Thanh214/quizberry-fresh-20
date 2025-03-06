
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const TeacherRegister: React.FC = () => {
  const navigate = useNavigate();
  const { registerTeacher, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    try {
      await registerTeacher(name, faculty, username, password);
      toast.success("Đăng ký tài khoản thành công");
      navigate("/admin/login");
    } catch (error) {
      toast.error((error as Error).message || "Đăng ký thất bại");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-8" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md">
            <div className="space-y-6 p-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Đăng ký tài khoản Giáo viên</h1>
                <p className="text-sm text-muted-foreground">
                  Nhập thông tin đăng ký của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="name">
                    Họ và tên
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="name"
                    placeholder="Nguyễn Văn A"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="faculty">
                    Khoa
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="faculty"
                    placeholder="Công nghệ thông tin"
                    required
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="username">
                    Tên đăng nhập
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="username"
                    placeholder="teacher123"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Mật khẩu
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="confirm-password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <button
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>

              <div className="text-center text-sm">
                <p className="text-gray-500">Đã có tài khoản?</p>
                <button 
                  className="text-primary hover:underline hover:text-primary/80"
                  onClick={() => navigate("/admin/login")}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default TeacherRegister;
