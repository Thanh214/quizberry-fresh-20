
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-festival-gradient relative px-4 py-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden z-0 opacity-20">
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-festival-red opacity-20"></div>
        <div className="absolute right-20 top-20 w-32 h-32 rounded-full bg-festival-gold opacity-30"></div>
        <div className="absolute left-10 top-16 w-24 h-24 rounded-full bg-festival-orange opacity-20"></div>
        <div className="absolute right-1/3 top-32 w-16 h-16 rounded-full bg-festival-pink opacity-20 animate-floating"></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center">
        <div className="mb-6 inline-flex items-center px-4 py-1 rounded-full bg-festival-red/10 text-festival-red border border-festival-red/20">
          <Star className="w-4 h-4 mr-2" /> 
          <span className="text-sm font-medium">Phiên bản Tết 2024</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-festival-red">
          EPUTest
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
          Nền tảng kiểm tra trực tuyến hiện đại dành cho giáo viên và học sinh, 
          giúp tạo và tham gia bài kiểm tra một cách dễ dàng
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="festival-card p-6 text-left">
            <div className="flex items-start mb-4">
              <div className="festival-circle w-10 h-10 mr-3 bg-white flex-shrink-0 border border-festival-red/20">
                <CheckCircle className="w-5 h-5 text-festival-red" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Dành cho Giáo viên</h3>
                <p className="text-muted-foreground text-sm">
                  Tạo và quản lý bài kiểm tra, theo dõi kết quả học sinh
                </p>
              </div>
            </div>
          </div>
          
          <div className="festival-card p-6 text-left">
            <div className="flex items-start mb-4">
              <div className="festival-circle w-10 h-10 mr-3 bg-white flex-shrink-0 border border-festival-gold/20">
                <CheckCircle className="w-5 h-5 text-festival-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Dành cho Học sinh</h3>
                <p className="text-muted-foreground text-sm">
                  Tham gia bài kiểm tra và xem kết quả ngay tức thì
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/role-selection")} 
          className="bg-festival-red hover:bg-festival-red/90 text-white shadow-md rounded-full px-6 py-6 h-auto group"
        >
          <span className="mr-2">Bắt đầu sử dụng ngay</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
