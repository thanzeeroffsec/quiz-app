"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import BreadCrump from "@/components/admin/breadCrump";
import CreateStudent from "@/components/admin/students/CreateStudent";
import TableData from "@/components/admin/students/TableData";
import { fetchStudents } from "@/lib/fetchStudents";
import { Input } from "@/components/ui/input";

// Define a type for Student
interface Student {
  _id: string;
  name: string;
  category: string;
  point: number;
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const data = await fetchStudents();
        setStudents(data);
        setFilteredStudents(data); // Initialize filteredStudents with all students
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const refreshStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
      performSearch(searchQuery, data); // Reapply the search filter after refreshing
    } catch (error) {
      console.error("Error refreshing students:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = (query: string, studentData: Student[] = students) => {
    const filtered = query.trim()
      ? studentData.filter((student) =>
          student.name.toLowerCase().includes(query.toLowerCase())
        )
      : studentData;

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Event handler that calls the search function
  const handleSearch = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    performSearch(searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <>
      <BreadCrump title={"students"}>
        <CreateStudent refreshStudents={refreshStudents} />
      </BreadCrump>
      <section className="max-w-[90%] m-auto w-full h-full mt-5">
        <div className="sm:w-[750px] w-[100%] m-auto mb-5">
          <form
            className="flex gap-2 mb-5 items-center"
            onSubmit={handleSearch}
          >
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
                <TableHead>Point</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableData
                students={filteredStudents}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                loading={loading}
                refreshStudents={refreshStudents}
              />
            </TableBody>
          </Table>
          {filteredStudents.length > itemsPerPage && (
            <div className="flex justify-center mt-4">
              <Button
                variant={"outline"}
                className="mx-1"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant={"outline"}
                className="mx-1"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
