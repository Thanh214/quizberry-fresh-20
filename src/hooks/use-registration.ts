
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRegistration() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const registerStudent = async (
    name: string, 
    studentId: string, 
    className: string, 
    examCode: string
  ) => {
    if (!name.trim() || !studentId.trim() || !className.trim() || !examCode.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Tìm bài thi dựa theo mã
      const { data: exam, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("code", examCode)
        .single();
      
      if (examError || !exam) {
        toast.error("Mã bài thi không hợp lệ hoặc không tồn tại");
        return false;
      }
      
      if (!exam.is_active) {
        toast.error("Bài thi đã kết thúc hoặc chưa được kích hoạt");
        return false;
      }
      
      // Tạo một tài khoản cho học sinh với email tự động
      const email = `${studentId.toLowerCase()}@eputest.com`;
      const password = `${studentId}${name.substring(0, 3)}`;
      
      // Kiểm tra xem học sinh đã đăng ký trước đó chưa
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      let userId = existingUser?.user?.id;
      
      // Nếu chưa đăng ký, tạo tài khoản mới
      if (!userId) {
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              student_id: studentId,
              class_name: className,
              role: "student"
            }
          }
        });
        
        if (signUpError) {
          toast.error(`Lỗi đăng ký: ${signUpError.message}`);
          return false;
        }
        
        userId = newUser?.user?.id;
        
        // Thêm thông tin hồ sơ
        if (userId) {
          await supabase.from("profiles").insert({
            id: userId,
            name,
            student_id: studentId,
            class_name: className,
            username: email.split("@")[0],
            role: "student"
          });
        }
      }
      
      // Thêm thông tin người tham gia vào bài thi
      if (userId) {
        const joinLink = `${window.location.origin}/student/waiting?examId=${exam.id}&studentId=${studentId}`;
        
        // Kiểm tra xem học sinh đã đăng ký bài thi này chưa
        const { data: existingParticipant } = await supabase
          .from("exam_participants")
          .select("*")
          .eq("exam_id", exam.id)
          .eq("student_id", studentId)
          .maybeSingle();
        
        if (!existingParticipant) {
          await supabase.from("exam_participants").insert({
            exam_id: exam.id,
            student_name: name,
            student_id: studentId,
            class_name: className,
            user_id: userId,
            join_link: joinLink,
            status: "waiting"
          });
        }
        
        // Lưu thông tin cho phiên
        localStorage.setItem("examId", exam.id);
        localStorage.setItem("examCode", examCode);
        
        toast.success("Đăng ký thành công, đang chuyển đến phòng chờ");
        
        // Chuyển hướng đến trang chờ
        navigate("/student/waiting");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error(error);
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    registerStudent,
    isSubmitting
  };
}
