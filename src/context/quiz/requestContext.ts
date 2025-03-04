
import { QuizRequest } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";

export const useRequestState = () => {
  const [quizRequests, setQuizRequests] = useState<QuizRequest[]>(() => {
    const storedRequests = localStorage.getItem("quizRequests");
    return storedRequests ? JSON.parse(storedRequests) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz request functions
  const approveQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      
      const requestIndex = quizRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new Error("Request not found");
      }
      
      const updatedRequests = [...quizRequests];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        status: "approved",
      };
      
      setQuizRequests(updatedRequests);
      localStorage.setItem("quizRequests", JSON.stringify(updatedRequests));
      
      setIsLoading(false);
      toast.success("Đã phê duyệt yêu cầu tham gia");
    } catch (error) {
      setError("Failed to approve request");
      setIsLoading(false);
      throw error;
    }
  };
  
  const rejectQuizRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      
      const requestIndex = quizRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new Error("Request not found");
      }
      
      const updatedRequests = [...quizRequests];
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        status: "rejected",
      };
      
      setQuizRequests(updatedRequests);
      localStorage.setItem("quizRequests", JSON.stringify(updatedRequests));
      
      setIsLoading(false);
      toast.success("Đã từ chối yêu cầu tham gia");
    } catch (error) {
      setError("Failed to reject request");
      setIsLoading(false);
      throw error;
    }
  };

  return {
    quizRequests,
    approveQuizRequest,
    rejectQuizRequest,
  };
};
