
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { Class } from "@/types/models";
import { toast } from "sonner";
import { 
  Users, School, Plus, Trash2, Edit, CheckCircle, XCircle, 
  FileEdit, AlertTriangle, Info
} from "lucide-react";

/**
 * AdminClasses component
 * This page allows teachers to manage classes and control quiz access
 */
const AdminClasses: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { classes, addClass, updateClass, deleteClass, toggleQuizActive } = useQuiz();
  
  // State for adding/editing classes
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);
  
  // Handle adding a new class
  const handleAddClass = async () => {
    if (!className.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }
    
    try {
      await addClass(className, classDescription);
      toast.success("Thêm lớp học thành công");
      setIsAddingClass(false);
      setClassName("");
      setClassDescription("");
    } catch (error) {
      toast.error("Không thể thêm lớp học");
      console.error(error);
    }
  };
  
  // Handle updating a class
  const handleUpdateClass = async () => {
    if (!editingClassId || !className.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }
    
    try {
      await updateClass(editingClassId, {
        name: className,
        description: classDescription,
      });
      toast.success("Cập nhật lớp học thành công");
      setEditingClassId(null);
      setClassName("");
      setClassDescription("");
    } catch (error) {
      toast.error("Không thể cập nhật lớp học");
      console.error(error);
    }
  };
  
  // Start editing a class
  const startEditing = (classItem: Class) => {
    setEditingClassId(classItem.id);
    setClassName(classItem.name);
    setClassDescription(classItem.description || "");
  };
  
  // Handle deleting a class
  const handleDeleteClass = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa lớp học này?")) {
      try {
        await deleteClass(id);
        toast.success("Xóa lớp học thành công");
      } catch (error) {
        toast.error("Không thể xóa lớp học");
        console.error(error);
      }
    }
  };
  
  // Handle toggling quiz status
  const handleToggleQuizStatus = async (classId: string, isActive: boolean) => {
    try {
      await toggleQuizActive(classId, isActive);
      toast.success(
        isActive 
          ? "Đã mở bài kiểm tra cho lớp này" 
          : "Đã đóng bài kiểm tra cho lớp này"
      );
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái bài kiểm tra");
      console.error(error);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen pb-10">
        {/* Header with navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Logo className="mr-4" />
            <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/questions")}
              className="text-sm px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors"
            >
              Câu hỏi
            </button>
            <button
              onClick={() => navigate("/admin/results")}
              className="text-sm px-3 py-1.5 rounded-md border border-input hover:bg-secondary transition-colors"
            >
              Kết quả
            </button>
            <button
              onClick={() => navigate("/admin/requests")}
              className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Phê duyệt
            </button>
          </div>
        </div>
        
        <TransitionWrapper>
          <Card className="mb-8 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Danh sách lớp học</h2>
              </div>
              
              <button
                onClick={() => {
                  setIsAddingClass(true);
                  setEditingClassId(null);
                  setClassName("");
                  setClassDescription("");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                disabled={isAddingClass || editingClassId !== null}
              >
                <Plus className="w-4 h-4" />
                <span>Thêm lớp mới</span>
              </button>
            </div>
            
            {/* Form for adding/editing class */}
            {(isAddingClass || editingClassId !== null) && (
              <Card className="mb-6 border border-primary/10 bg-secondary/20">
                <h3 className="text-lg font-medium mb-4">
                  {editingClassId !== null ? "Sửa lớp học" : "Thêm lớp học mới"}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="className">
                        Tên lớp
                      </label>
                      <input
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ví dụ: 10A1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="classDescription">
                        Mô tả (tùy chọn)
                      </label>
                      <input
                        id="classDescription"
                        value={classDescription}
                        onChange={(e) => setClassDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ví dụ: Lớp chuyên Toán"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setIsAddingClass(false);
                        setEditingClassId(null);
                        setClassName("");
                        setClassDescription("");
                      }}
                      className="px-4 py-2 rounded-md border border-input hover:bg-secondary transition-colors text-sm"
                    >
                      Hủy
                    </button>
                    
                    <button
                      onClick={editingClassId !== null ? handleUpdateClass : handleAddClass}
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                    >
                      {editingClassId !== null ? "Cập nhật" : "Thêm lớp"}
                    </button>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Class list */}
            {classes.length === 0 ? (
              <div className="text-center py-12">
                <School className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="text-lg font-medium text-muted-foreground">Chưa có lớp học nào</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bấm vào nút "Thêm lớp mới" để tạo lớp học đầu tiên
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((classItem) => (
                  <Card 
                    key={classItem.id}
                    className={`border ${
                      classItem.isQuizActive 
                        ? "border-green-200 bg-green-50/30" 
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium">{classItem.name}</h3>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEditing(classItem)}
                          className="p-1 rounded-md hover:bg-secondary transition-colors"
                          title="Sửa lớp học"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="p-1 rounded-md hover:bg-secondary transition-colors"
                          title="Xóa lớp học"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                    
                    {classItem.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {classItem.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className={`flex items-center gap-1.5 text-sm ${
                        classItem.isQuizActive ? "text-green-600" : "text-muted-foreground"
                      }`}>
                        {classItem.isQuizActive ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Đang mở</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Đã đóng</span>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={() => 
                          handleToggleQuizStatus(classItem.id, !classItem.isQuizActive)
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          classItem.isQuizActive
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        } transition-colors`}
                      >
                        {classItem.isQuizActive ? "Đóng bài thi" : "Mở bài thi"}
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Tạo lúc:</span>
                        <span>{new Date(classItem.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TransitionWrapper>
        
        {/* Information card */}
        <TransitionWrapper delay={300}>
          <Card className="border border-blue-200 bg-blue-50/30">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Info className="w-6 h-6 text-blue-500" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Hướng dẫn quản lý lớp học</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Plus className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Thêm các lớp học mà bạn giảng dạy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Mở bài kiểm tra khi bạn muốn học sinh có thể làm bài</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Đóng bài kiểm tra sau khi thời gian làm bài kết thúc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Học sinh sẽ chỉ có thể đăng ký khi bài kiểm tra đang mở</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileEdit className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Bạn cần duyệt yêu cầu tham gia của học sinh trong trang "Phê duyệt"</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default AdminClasses;
