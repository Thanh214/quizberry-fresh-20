
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success("Đăng nhập thành công");
      
      // Chuyển hướng dựa trên vai trò người dùng
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        navigate("/admin/questions");
      } else if (user.role === "teacher") {
        navigate("/teacher/exams");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại: Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <Layout showSeasonalEffects={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        <TransitionWrapper>
          <Logo className="mb-8 md:mb-12" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md">
            <div className="space-y-6 p-4 md:p-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl md:text-3xl font-bold">Đăng nhập Giáo viên</h1>
                <p className="text-sm text-muted-foreground">
                  Nhập thông tin đăng nhập của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="username">
                    Tên đăng nhập
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    id="username"
                    placeholder="admin hoặc tên đăng nhập của bạn"
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
                  />
                </div>
                <button
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Đang đăng nhập...</span>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              <div className="text-center text-sm space-y-2">
                <p className="text-gray-500">Chưa có tài khoản?</p>
                <button 
                  className="text-primary hover:underline hover:text-primary/80"
                  onClick={() => navigate("/admin/register")}
                >
                  Đăng ký tài khoản giáo viên
                </button>
                
                <div className="pt-2 pb-4">
                  <button 
                    className="text-muted-foreground hover:underline hover:text-foreground"
                    onClick={() => navigate("/role-selection")}
                  >
                    Quay lại trang chọn vai trò
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default AdminLogin;
