"use client";
import Questions from "@/components/questions";
import React, { useEffect, useState } from "react";
import "./questions.css";
import { useParams } from "next/navigation";
// Adjust the import based on your project structure
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
const Page = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizzData, setQuizzData] = useState<IQuiz | null>(null);

  const fetchQuizzData = async () => {
    const req = await fetch(`/api/user/quizz/${quizId}`, {
      credentials: "include",
    });
    const data: IQuiz = await req.json();
    if (!data.completed) {
      setQuizzData(data);
    }
  };

  useEffect(() => {
    fetchQuizzData();
  }, [quizId]);

  return (
    <div className="bg-white p-3 shadow-md w-full md:w-[90%] lg:w-[70%] max-w-4xl sm:rounded-lg mx-5 ">
      <Questions quizData={quizzData} />
    </div>
  );
};

export default Page;
