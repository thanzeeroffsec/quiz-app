"use client";
import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { fetchStudents } from "@/lib/fetchStudents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type Student = {
  _id: string;
  name: string;
  category: string;
  point: number;
};

type QuizData = {
  userId: string;
  completed: boolean;
};

const Page = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    studentCount: 0,
    quizCount: 0,
    questionCount: 0,
    quizzData: [] as QuizData[],
  });
  const [sortOrderPoints, setSortOrderPoints] = useState<"asc" | "desc">("asc");
  const [sortOrderCompleted, setSortOrderCompleted] = useState<"asc" | "desc">(
    "asc"
  );
  const itemsPerPage = 20;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const getCounts = async () => {
    try {
      const res = await fetch("/api/admin/statistics", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data = await res.json();
      setCounts(data);
    } catch (error) {
      console.error("Failed to fetch counts", error);
    }
  };

  useEffect(() => {
    loadStudents();
    getCounts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
    setCurrentPage(1);
  };

  const handleSortByPoints = () => {
    const sortedStudents = [...filteredStudents].sort((a, b) =>
      sortOrderPoints === "asc" ? a.point - b.point : b.point - a.point
    );
    setFilteredStudents(sortedStudents);
    setSortOrderPoints(sortOrderPoints === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handleSortByCompleted = () => {
    const sortedStudents = [...filteredStudents].sort((a, b) => {
      const completedA = counts.quizzData.filter(
        (quiz) => quiz.userId === a._id && quiz.completed
      ).length;
      const completedB = counts.quizzData.filter(
        (quiz) => quiz.userId === b._id && quiz.completed
      ).length;
      return sortOrderCompleted === "asc"
        ? completedA - completedB
        : completedB - completedA;
    });
    setFilteredStudents(sortedStudents);
    setSortOrderCompleted(sortOrderCompleted === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <section className="max-w-[90%] m-auto w-full h-full mt-5">
      <div className="w-full m-auto mb-5 mt-10 flex gap-2 flex-wrap md:flex-nowrap">
        {/* Cards Section */}
        <div className="min-w-[250px] w-full h-[60px] border-2 flex gap-3 items-center">
          <div className="px-5 bg-violet-500 h-full w-[60px] flex items-center">
            <FaRegUser color="white" size={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-blue-500">
              {counts.studentCount}
            </span>
            <span className="uppercase font-bold text-black/[0.5]">
              total students
            </span>
          </div>
        </div>
        <div className="min-w-[250px] w-full h-[60px] border-2 flex gap-3 items-center">
          <div className="px-5 bg-red-500 h-full w-[60px] flex items-center">
            <FaRegUser color="white" size={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-red-500">
              {counts.quizCount}
            </span>
            <span className="uppercase font-bold text-black/[0.5]">
              total quizzes
            </span>
          </div>
        </div>
        <div className="min-w-[250px] w-full h-[60px] border-2 flex gap-3 items-center">
          <div className="px-5 bg-yellow-500 h-full w-[60px] flex items-center">
            <FaRegQuestionCircle color="white" size={35} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-yellow-500">
              {counts.questionCount}
            </span>
            <span className="uppercase font-bold text-black/[0.5]">
              total questions
            </span>
          </div>
        </div>
      </div>

      <div className="sm:w-[80%] w-full m-auto mb-5 mt-20">
        <form className="flex gap-2 mb-5 items-center" onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Enter the name of the student"
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
              <TableHead
                className="cursor-pointer"
                onClick={handleSortByCompleted}
              >
                Completed {sortOrderCompleted === "asc" ? "↑" : "↓"}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={handleSortByPoints}
              >
                Points {sortOrderPoints === "asc" ? "↑" : "↓"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <Loader2 className="size-10 text-blue-400 animate-spin m-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedStudents.length > 0 ? (
              paginatedStudents.map((student, index) => {
                const completedQuizzesCount = counts.quizzData.filter(
                  (quiz) => quiz.userId === student._id && quiz.completed
                ).length;

                return (
                  <TableRow
                    key={student._id}
                    className={`table-row ${
                      index % 2 === 0
                        ? "bg-[#0000000d] hover:bg-[#0000000d]/[0.2]"
                        : ""
                    }`}
                  >
                    <TableCell className="table-cell font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="table-cell hover:underline text-blue-400">
                      <Link href={`/admin/graph/${student._id}`}>
                        {student.name}
                      </Link>
                    </TableCell>
                    <TableCell className="table-cell uppercase">
                      {student.category}
                    </TableCell>
                    <TableCell className="table-cell">
                      {completedQuizzesCount}
                    </TableCell>
                    <TableCell className="table-cell">
                      {student.point}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Page;
