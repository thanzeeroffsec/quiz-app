"use client";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";

const Page = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/admin/question", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);

        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);
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
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
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
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="size-10 text-blue-400 animate-spin m-auto" />
                  </TableCell>
                </TableRow>
              ) : quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz, index) => (
                  <TableRow
                    key={quiz._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#0000000d] hover:bg-[#0000000d]/[0.2]"
                        : ""
                    }`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{truncateText(quiz?.question, 10)}</TableCell>
                    <TableCell>{quiz?.answer}</TableCell>

                    <TableCell className="text-right flex gap-1 justify-end py-[2px]">
                      <Link href={`/admin/quiz/edit/${quiz?._id}`}>
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
          {quizzes.length >= 11 && (
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
