
import React, { useState } from "react";
import TransitionWrapper from "@/components/TransitionWrapper";
import Card from "@/components/Card";
import { ShuffledQuestion } from "@/types/models";

interface QuizQuestionProps {
  question: ShuffledQuestion;
  questionNumber: number;
  selectedOption: string | null;
  onOptionSelect: (optionId: string) => void;
  isSubmitting: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  selectedOption,
  onOptionSelect,
  isSubmitting,
}) => {
  return (
    <TransitionWrapper
      delay={300}
      className={`transition-opacity duration-500 ${
        isSubmitting ? "opacity-0" : "opacity-100"
      }`}
    >
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-medium mb-8">
          {questionNumber}. {question.content}
        </h2>
        <div className="space-y-4">
          {question.shuffledOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-md border cursor-pointer transition-all duration-300 ${
                selectedOption === option.id
                  ? "bg-primary/10 border-primary"
                  : "bg-background hover:bg-muted/50 border-input"
              }`}
              onClick={() => onOptionSelect(option.id)}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border ${
                    selectedOption === option.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  } mr-3 flex items-center justify-center`}
                >
                  {selectedOption === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>{option.content}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </TransitionWrapper>
  );
};

export default QuizQuestion;
