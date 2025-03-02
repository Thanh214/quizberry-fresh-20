
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";

import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import RoleSelection from "./pages/RoleSelection";

// Admin routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminQuestions from "./pages/admin/AdminQuestions";
import EditQuestion from "./pages/admin/EditQuestion";
import AdminResults from "./pages/admin/AdminResults";

// Student routes
import StudentRegister from "./pages/student/StudentRegister";
import StudentQuiz from "./pages/student/StudentQuiz";
import StudentResults from "./pages/student/StudentResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
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
              <Route path="/admin/questions" element={<AdminQuestions />} />
              <Route path="/admin/questions/new" element={<EditQuestion />} />
              <Route path="/admin/questions/edit/:id" element={<EditQuestion />} />
              <Route path="/admin/results" element={<AdminResults />} />
              
              {/* Student routes */}
              <Route path="/student/register" element={<StudentRegister />} />
              <Route path="/student/quiz" element={<StudentQuiz />} />
              <Route path="/student/results" element={<StudentResults />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
