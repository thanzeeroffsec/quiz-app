"use client";
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
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { toast } from "sonner";

const page = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [category, setCategory] = useState("");
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
    // Handle form submission here
    setLoading(true); // Start loading

    try {
      const req = await fetch("/api/admin/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ question, options, correctOption, category }),
      });
      if (!req.ok) {
        throw new Error("Failed to submit quiz question");
      }
      toast("", {
        description: (
          <span className="ml-2 text-[14px] font-semibold">
            success updated
          </span>
        ),
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });
      setOptions([""]);
      setQuestion("");
      setCorrectOption(null);

      setCategory("");
    } catch (error) {
      console.error("Error submitting quiz question:", error);
    } finally {
      setLoading(false); // Stop loading
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
              <SelectValue placeholder="category" />
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
