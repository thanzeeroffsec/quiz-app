"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";

const Questions = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Progress value={10} />
      <div className="flex justify-between items-center h-20 text-sm md:text-base">
        <div className="space-y-1">
          <p>Category: test</p>
          <p>Score: 10</p>
        </div>
      </div>
      <Separator />
      <div className="min-h-[50vh] py-4 xl:py-8 px-3 md:px-5 w-full">
        <h2 className="text-2xl text-center font-medium">
          Q1. Which author wrote 'canon of Sherlock Holmes'?
        </h2>
        <div className="py-4 md:py-5 xl:py-7 flex flex-col gap-y-3 md:gap-y-5">
          <button className={`option  `}>
            <div className="w-full ">
              <span className="float-left pl-5">A :</span>
              <span>this is annwer 1</span>
            </div>
          </button>
          <button className={`option  `}>
            <div className="w-full ">
              <span className="float-left pl-5">B :</span>
              <span>this is annwer 1</span>
            </div>
          </button>
          <button className={`option  `}>
            <div className="w-full ">
              <span className="float-left pl-5">C :</span>
              <span>this is annwer 1</span>
            </div>
          </button>
          <button className={`option  `}>
            <div className="w-full ">
              <span className="float-left pl-5">D :</span>
              <span>this is annwer 1</span>
            </div>
          </button>
        </div>
        <Separator />
        <div className="flex mt-5 md:justify-between md:flex-row flex-col gap-4 md:gap-0 mx-auto max-w-xs w-full">
          <Button className="bg-[hsl(262.1_83.3%_57.8%)] hover:bg-[hsl(262.1_83.3%_57.8%)/.6]">
            next question
          </Button>
          <Button variant={"destructive"}>Quit Quiz</Button>
        </div>
      </div>
    </>
  );
};

export default Questions;
