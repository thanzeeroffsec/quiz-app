"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsPencil } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { Loader2 } from "lucide-react";
import BreadCrump from "@/components/admin/breadCrump";
import DeleteQuestion from "@/components/admin/question/DeleteQuestion";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Define a type for the quiz data
interface Quiz {
  _id: string;
  question: string;
  answer: string;
}

const Page = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/admin/question", {
          credentials: "include",
        });
        const data: Quiz[] = await response.json();
        console.log(data);
        setQuizzes(data);
        setFilteredQuizzes(data); // Initialize filteredQuizzes with all quizzes
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setFilteredQuizzes(quizzes); // Reset to all quizzes if search is empty
    } else {
      const filtered = quizzes.filter((quiz) =>
        quiz.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const response = await fetch("/api/admin/question", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setFilteredQuizzes(filteredQuizzes.filter((quiz) => quiz._id !== id));
      } else {
        console.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <>
      <BreadCrump title={"quiz"}>
        <Link href={"/admin/quiz/create"}>
          <TiPlus size={40} />
        </Link>
      </BreadCrump>
      <section className="max-w-[90%] m-auto w-full h-full mt-5">
        <div className="sm:w-[750px] w-[100%] m-auto mb-5">
          <form
            className="flex gap-2 mb-5 items-center"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              placeholder="Enter the quizz to search"
              className="rounded-none focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-none bg-blue-600 hover:bg-blue-400"
            >
              Search
            </Button>
          </form>
          <Table className="w-full border-[1px] border-[#dee2e6] select-none">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    <Loader2 className="size-10 text-blue-400 animate-spin m-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuizzes.map((quiz, index) => (
                  <TableRow
                    key={quiz._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#0000000d] hover:bg-[#0000000d]/[0.2]"
                        : ""
                    }`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{truncateText(quiz.question, 10)}</TableCell>
                    <TableCell>{quiz.answer}</TableCell>
                    <TableCell className="text-right flex gap-1 justify-end py-[2px]">
                      <Link href={`/admin/quiz/edit/${quiz._id}`}>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          className="border-black rounded-none"
                        >
                          <BsPencil color="gray" />
                        </Button>
                      </Link>
                      <DeleteQuestion
                        handleDelete={() => deleteQuiz(quiz._id)}
                        icon={
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            className="border-black rounded-none"
                          >
                            <FaRegTrashCan
                              color="#f87171"
                              className="cursor-pointer"
                              size={20}
                            />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredQuizzes.length >= 11 && (
            <div className="flex justify-center mt-4">
              <Button variant={"outline"} className="mx-1">
                Previous
              </Button>
              <Button variant={"outline"} className="mx-1">
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
