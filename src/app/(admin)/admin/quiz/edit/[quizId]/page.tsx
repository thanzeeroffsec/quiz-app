"use client";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@radix-ui/react-select";

import { toast } from "sonner";
import { FaCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

const page = () => {
  const { quizId } = useParams<{ tag: string; item: string }>();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [category, setCategory] = useState("");
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await fetch(`/api/admin/question/${quizId}`);
        if (res.ok) {
          const quiz = await res.json();
          setQuestion(quiz.question);
          setOptions(quiz.options);
          setCategory(quiz.category);
          setCorrectOption(quiz.answer);
        } else {
          console.error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/question`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: quizId,
          question,
          options,
          correctOption,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update quiz question");
      }

      toast("", {
        description: (
          <span className="ml-2 text-[14px] font-semibold">
            Successfully updated
          </span>
        ),
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });

      // Redirect or reset form as needed
    } catch (error) {
      console.error("Error updating quiz question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[90%] m-auto w-full h-full mt-5">
      <div className="sm:w-[750px] w-[100%] m-auto mb-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your quiz question"
              className="rounded-none mt-2 focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none "
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center gap-2 w-full">
                <span>{index + 1} </span>
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="rounded-none mt-2 focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none "
                />
              </div>
              <Button variant="ghost" onClick={() => removeOption(index)}>
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addOption}>
            Add Option
          </Button>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="uppercase">
              <SelectItem value="Low Achiever">Low Achiever</SelectItem>
              <SelectItem value="Middle Achiever">Middle Achiever</SelectItem>
              <SelectItem value="High Achiever">High Achiever</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Label htmlFor="correctOption">Correct Option</Label>
            <Input
              type="number"
              id="correctOption"
              value={correctOption ?? ""}
              onChange={(e) => setCorrectOption(parseInt(e.target.value))}
              placeholder="Enter correct option number"
              min={1}
              max={options.length}
              className="rounded-none mt-2 focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none "
            />
          </div>

          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "submit"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default page;
