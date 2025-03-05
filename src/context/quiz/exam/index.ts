
import { useExamState } from './useExamState';
import { useExamActions } from './useExamActions';
import { useState } from 'react';

export const useExamContext = () => {
  // Get exam state
  const {
    exams,
    isLoading,
    error,
    setExams,
    addExamToState,
    updateExamInState,
    removeExamFromState
  } = useExamState();

  // Create a setter for isLoading and error
  const [, setIsLoading] = useState(isLoading);
  const [, setError] = useState<string | null>(error);

  // Get exam actions
  const actions = useExamActions(
    isLoading,
    setIsLoading,
    setError,
    addExamToState,
    updateExamInState,
    removeExamFromState,
    exams
  );

  return {
    // State
    exams,
    isLoading,
    error,
    setExams,
    
    // Helper state actions
    addExamToState,
    updateExamInState,
    removeExamFromState,
    
    // CRUD operations
    ...actions
  };
};

export * from './types';
