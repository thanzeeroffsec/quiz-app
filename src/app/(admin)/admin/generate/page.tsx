"use client";

import BreadCrump from "@/components/admin/breadCrump";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchStudents } from "@/lib/fetchStudents";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { toast } from "sonner";

// Define a TypeScript interface for the student object
interface Student {
  _id: string;
  name: string;
  category: string;
  inQuiz?: boolean; // Optional property
  quizId?: string; // Optional property
}

const Page: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [questionLength, setQuestionLength] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data: Student[] = await fetchStudents();
      setLoading(false);
      setStudents(data);
      setFilteredStudents(data);
    };
    loadStudents();
  }, []);

  const refreshStudents = async () => {
    setLoading(true);
    const data: Student[] = await fetchStudents();
    setLoading(false);
    setStudents(data);
    setFilteredStudents(data);
  };

  const handleSubmit = async (userId: string, category: string) => {
    try {
      await fetch("/api/admin/quizz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionLength, userId, category }),
      });
      toast("Success", {
        description: "Quiz successfully created",
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });
      refreshStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (userId: string, quizId: string) => {
    try {
      await fetch("/api/admin/quizz", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, quizId }),
      });
      toast("Success", {
        description: "Quiz successfully deleted",
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });
      refreshStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <>
      <BreadCrump title={"generate quiz"} />
      <section className="max-w-[90%] m-auto w-full h-full mt-5">
        <div className="sm:w-[750px] w-[100%] m-auto mb-5">
          <form
            className="flex gap-2 mb-5 items-center"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              placeholder="Enter the name or category to search"
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
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>No. of questions</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <Loader2 className="size-10 text-blue-400 animate-spin m-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <TableRow
                    key={student._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#0000000d] hover:bg-[#0000000d]/[0.2]"
                        : ""
                    }`}
                  >
                    <TableCell className="font-medium py-[2px]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-[2px]">{student.name}</TableCell>
                    <TableCell className="uppercase py-[2px]">
                      {student.category}
                    </TableCell>
                    <TableCell className="py-[5px]  w-[150px]">
                      <Input
                        type="number"
                        value={questionLength}
                        onChange={(e) =>
                          setQuestionLength(Number(e.target.value))
                        }
                        placeholder="number of questions"
                        className="rounded-none  focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none "
                      />
                    </TableCell>
                    <TableCell className="uppercase py-[2px]">
                      {student.inQuiz ? (
                        <Button
                          size={"sm"}
                          variant={"destructive"}
                          className="border-black w-full rounded-none "
                          onClick={() =>
                            handleDelete(student._id, student.quizId || "")
                          }
                        >
                          <GiCancel className="cursor-pointer" size={20} />
                        </Button>
                      ) : (
                        <Button
                          size={"sm"}
                          variant={"default"}
                          className="border-black w-full rounded-none bg-[#4361EE] hover:bg-[#4361EE]/[0.8]"
                          onClick={() =>
                            handleSubmit(student._id, student.category)
                          }
                        >
                          <IoSend className="cursor-pointer" size={20} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default Page;
