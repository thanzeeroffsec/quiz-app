import Questions from "@/components/questions";
import React from "react";
import "./questions.css";

const page = () => {
  return (
    <div className="bg-white p-3 shadow-md w-full md:w-[90%] lg:w-[70%] max-w-4xl sm:rounded-lg mx-5 ">
      <Questions />
    </div>
  );
};

export default page;
