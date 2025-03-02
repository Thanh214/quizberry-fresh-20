
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { QuizRequest } from "@/types/models";
import { toast } from "sonner";
import { 
  UserCheck, CheckCircle, XCircle, Clock, RefreshCw,
  ArrowLeft, Search, X, Filter
} from "lucide-react";

/**
 * ManageRequests component
 * This page allows teachers to approve or reject student requests to take quizzes
 */
const ManageRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { quizRequests, approveQuizRequest, rejectQuizRequest, classes } = useQuiz();
  
  // Filter state
  const [filterClass, setFilterClass] = useState<string | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);
  
  // Handle approve request
  const handleApprove = async (requestId: string) => {
    try {
      await approveQuizRequest(requestId);
      toast.success("Đã phê duyệt yêu cầu tham gia");
    } catch (error) {
      toast.error("Không thể phê duyệt yêu cầu");
      console.error(error);
    }
  };
  
  // Handle reject request
  const handleReject = async (requestId: string) => {
    try {
      await rejectQuizRequest(requestId);
      toast.success("Đã từ chối yêu cầu tham gia");
    } catch (error) {
      toast.error("Không thể từ chối yêu cầu");
      console.error(error);
    }
  };
  
  // Filter requests
  const filteredRequests = quizRequests.filter((request) => {
    const matchesClass = filterClass === "all" || request.className === filterClass;
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = 
      searchTerm === "" || 
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesStatus && matchesSearch;
  });
  
  // Get pending request count
  const pendingCount = quizRequests.filter(req => req.status === "pending").length;
  
  // Sort requests - pending first, then most recent
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First sort by status (pending first)
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    
    // Then sort by date (most recent first)
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });
  
  return (
    <Layout>
      <div className="min-h-screen pb-10">
        {/* Header with navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Phê duyệt yêu cầu</h1>
            {pendingCount > 0 && (
              <span className="ml-3 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                {pendingCount} chờ duyệt
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/questions")}
              className="text-sm px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors"
            >
              Câu hỏi
            </button>
            <button
              onClick={() => navigate("/admin/classes")}
              className="text-sm px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors"
            >
              Lớp học
            </button>
            <button
              onClick={() => navigate("/admin/results")}
              className="text-sm px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors"
            >
              Kết quả
            </button>
          </div>
        </div>
        
        <TransitionWrapper>
          <Card className="mb-8 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Yêu cầu tham gia kiểm tra</h2>
              </div>
              
              <button
                onClick={() => {
                  // Reset filters
                  setFilterClass("all");
                  setFilterStatus("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Làm mới</span>
              </button>
            </div>
            
            {/* Filter controls */}
            <div className="mb-6 p-4 border rounded-lg bg-secondary/10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-72 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm học sinh..."
                    className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Lớp:</label>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Tất cả lớp</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Trạng thái:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Tất cả</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Đã từ chối</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Requests list */}
            {sortedRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  Không có yêu cầu nào
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm || filterClass !== "all" || filterStatus !== "all" 
                    ? "Thử thay đổi bộ lọc để xem thêm kết quả" 
                    : "Học sinh chưa gửi yêu cầu tham gia kiểm tra"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedRequests.map((request) => (
                  <Card 
                    key={request.id}
                    className={`border ${
                      request.status === "pending" 
                        ? "border-amber-200 bg-amber-50/30" 
                        : request.status === "approved"
                        ? "border-green-200 bg-green-50/30"
                        : "border-red-200 bg-red-50/30"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">{request.studentName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary">
                            {request.className}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Yêu cầu lúc: {new Date(request.requestedAt).toLocaleString("vi-VN")}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Status indicator */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                          request.status === "pending" 
                            ? "bg-amber-100 text-amber-800" 
                            : request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {request.status === "pending" ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Chờ duyệt</span>
                            </>
                          ) : request.status === "approved" ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Đã duyệt</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Đã từ chối</span>
                            </>
                          )}
                        </div>
                        
                        {/* Action buttons - only show for pending requests */}
                        {request.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Duyệt</span>
                            </button>
                            
                            <button
                              onClick={() => handleReject(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Từ chối</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination placeholder (for future implementation) */}
            {filteredRequests.length > 10 && (
              <div className="flex justify-center mt-6">
                <div className="inline-flex items-center gap-2">
                  <button className="w-9 h-9 rounded-md border flex items-center justify-center">
                    1
                  </button>
                  <button className="w-9 h-9 rounded-md border flex items-center justify-center bg-primary text-primary-foreground">
                    2
                  </button>
                  <button className="w-9 h-9 rounded-md border flex items-center justify-center">
                    3
                  </button>
                </div>
              </div>
            )}
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default ManageRequests;
