
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
import { ExamProvider } from "@/context/ExamContext";

import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import RoleSelection from "./pages/RoleSelection";

// Admin routes
import AdminLogin from "./pages/admin/AdminLogin";
import TeacherRegister from "./pages/admin/TeacherRegister";
import AdminQuestions from "./pages/admin/AdminQuestions";
import EditQuestion from "./pages/admin/EditQuestion";
import AdminResults from "./pages/admin/AdminResults";
import AdminClasses from "./pages/admin/AdminClasses";
import ManageRequests from "./pages/admin/ManageRequests";

// Teacher routes
import TeacherExams from "./pages/teacher/TeacherExams";
import CreateExam from "./pages/teacher/CreateExam";

// Student routes
import StudentRegister from "./pages/student/StudentRegister";
import StudentQuiz from "./pages/student/StudentQuiz";
import StudentResults from "./pages/student/StudentResults";
import StudentWaiting from "./pages/student/StudentWaiting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
        <ExamProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<SplashScreen />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<TeacherRegister />} />
                <Route path="/admin/questions" element={<AdminQuestions />} />
                <Route path="/admin/questions/new" element={<EditQuestion />} />
                <Route path="/admin/questions/edit/:id" element={<EditQuestion />} />
                <Route path="/admin/results" element={<AdminResults />} />
                <Route path="/admin/classes" element={<AdminClasses />} />
                <Route path="/admin/requests" element={<ManageRequests />} />
                
                {/* Teacher routes */}
                <Route path="/teacher/exams" element={<TeacherExams />} />
                <Route path="/teacher/create-exam" element={<CreateExam />} />
                <Route path="/teacher/edit-exam/:id" element={<CreateExam />} />
                
                {/* Student routes */}
                <Route path="/student/register" element={<StudentRegister />} />
                <Route path="/student/waiting" element={<StudentWaiting />} />
                <Route path="/student/quiz" element={<StudentQuiz />} />
                <Route path="/student/results" element={<StudentResults />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ExamProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
