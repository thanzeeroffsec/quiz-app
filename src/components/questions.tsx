"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";
import SuccessModal from "./SuccessModal";

// Define the types for quiz data and questions
interface IQuestion {
  _id: string;
  question: string;
  options: string[];
}

interface IQuiz {
  _id: string;
  userId: {
    name: string;
  };
  questions: IQuestion[];
  completed: boolean; // Added completed property
}

interface ISelectedOption {
  questionId: string | number;
  option: string;
}

interface QuestionsProps {
  quizData: IQuiz | null; // Updated to handle null
}

const Questions: React.FC<QuestionsProps> = ({ quizData }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<ISelectedOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);

  useEffect(() => {
    if (quizData) {
      setQuiz(quizData);
      setLoading(false);
    }
  }, [quizData]);

  const handleOptionSelect = (option: string, questionId: string | number) => {
    if (selectedOption) return;
    console.log(option);

    setSelectedOptions((prevOptions) => [
      ...prevOptions,
      { questionId, option },
    ]);

    setSelectedOption(option);
  };

  const handleFinish = async () => {
    if (!quiz) return;

    try {
      const req = await fetch(`/api/user/quizz/${quiz._id}`, {
        method: "PUT",
        body: JSON.stringify({
          quizId: quiz._id,
          answers: selectedOptions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await req.json();
      setCorrectAnswers(data.correct);
      setWrongAnswers(data.wrong);

      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      console.log("Quiz completed!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-[200px] flex justify-center items-center">
        <p>No quiz questions available.</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      <Progress
        value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
      />
      <div className="flex justify-between items-center h-20 text-sm md:text-base">
        <div className="space-y-1">
          <p>Student: {quizData?.userId.name}</p>
        </div>
      </div>
      <Separator />
      <div className="min-h-[50vh] py-4 xl:py-8 px-3 md:px-5 w-full">
        <h2 className="text-2xl text-center font-medium">
          {currentQuestion.question}
        </h2>
        <div className="py-4 md:py-5 xl:py-7 flex flex-col gap-y-3 md:gap-y-5">
          {currentQuestion.options.map((option, index) => {
            return (
              <button
                key={index}
                className={`option text-white p-2 rounded`}
                style={{
                  backgroundColor: `${
                    option === selectedOption ? "hsl(262.1,83.3%,57.8%)" : ""
                  }`,
                }}
                onClick={() =>
                  handleOptionSelect(
                    (index + 1).toString(),
                    currentQuestion._id
                  )
                }
              >
                <div className="w-full">
                  <span className="float-left pl-5">
                    {String.fromCharCode(65 + index)} :
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        <Separator />
        <div className="flex mt-5 md:justify-between md:flex-row flex-col gap-4 md:gap-0 mx-auto max-w-xs w-full">
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              className="bg-[hsl(262.1_83.3%_57.8%)] hover:bg-[hsl(262.1_83.3%_57.8%)/.6]"
              disabled={!selectedOption}
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-[hsl(262.1_83.3%_57.8%)] hover:bg-[hsl(262.1_83.3%_57.8%)/.6]"
              disabled={!selectedOption}
            >
              Finish Quiz
            </Button>
          )}

          <Button variant={"destructive"}>Quit Quiz</Button>
        </div>
      </div>
      <SuccessModal
        show={showModal}
        onClose={() => setShowModal(false)}
        correctAnswers={correctAnswers ?? 0}
        wrongAnswers={wrongAnswers ?? 0}
      />
    </>
  );
};

export default Questions;
