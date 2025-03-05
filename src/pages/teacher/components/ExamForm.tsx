
import React from "react";
import { Exam } from "@/types/models";
import { motion } from "framer-motion";
import { useExamForm } from "./exam-form/useExamForm";
import ExamFormHeader from "./exam-form/ExamFormHeader";
import ExamTitle from "./exam-form/ExamTitle";
import ExamCode from "./exam-form/ExamCode";
import ExamDescription from "./exam-form/ExamDescription";
import ExamDuration from "./exam-form/ExamDuration";
import FormActions from "./exam-form/FormActions";

interface ExamFormProps {
  onSubmit: (examData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  teacherId: string;
  isLoading?: boolean;
  initialData?: Partial<Exam>;
}

const ExamForm: React.FC<ExamFormProps> = ({ 
  onSubmit, 
  onCancel, 
  teacherId,
  isLoading = false,
  initialData
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    code,
    duration,
    setDuration,
    isEditMode,
    handleSubmit
  } = useExamForm({ initialData, onSubmit, teacherId });

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-5"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <ExamFormHeader isEditMode={isEditMode} />
      <ExamTitle title={title} setTitle={setTitle} />
      <ExamCode code={code} isEditMode={isEditMode} />
      <ExamDescription description={description} setDescription={setDescription} />
      <ExamDuration duration={duration} setDuration={setDuration} />
      <FormActions 
        isEditMode={isEditMode} 
        isLoading={isLoading} 
        onCancel={onCancel} 
      />
    </motion.form>
  );
};

export default ExamForm;
