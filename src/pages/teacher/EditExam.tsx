
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import TransitionWrapper from "@/components/TransitionWrapper";
import ExamStatistics from "./components/ExamStatistics";
import ExamNotFound from "./components/ExamNotFound";
import EditExamHeader from "./components/edit-exam/EditExamHeader";
import EditExamTabs from "./components/edit-exam/EditExamTabs";
import { useEditExam } from "./hooks/useEditExam";

const EditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    exam,
    title,
    setTitle,
    description,
    setDescription,
    duration,
    setDuration,
    isLoading,
    activeTab,
    setActiveTab,
    selectedQuestions,
    setSelectedQuestions,
    examQuestions,
    handleSubmit,
    handleCancel,
    handleAddQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
    handleCreateExam,
    questions
  } = useEditExam(id);

  if (!exam) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <ExamNotFound />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <EditExamHeader exam={exam} onCancel={handleCancel} />

        {/* Exam statistics */}
        <TransitionWrapper delay={50}>
          <ExamStatistics 
            exam={exam}
            waitingCount={0}
            inProgressCount={0}
            completedCount={0}
            totalParticipants={0}
          />
        </TransitionWrapper>

        <EditExamTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          duration={duration}
          setDuration={setDuration}
          examCode={exam?.code || ""}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isLoading={isLoading}
          examQuestions={examQuestions}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          handleAddQuestion={handleAddQuestion}
          handleDeleteQuestion={handleDeleteQuestion}
          handleEditQuestion={handleEditQuestion}
          handleCreateExam={handleCreateExam}
          allQuestions={questions}
        />
      </div>
    </Layout>
  );
};

export default EditExam;
