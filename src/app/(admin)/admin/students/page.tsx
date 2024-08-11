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

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data = await fetchStudents();
      setLoading(false);
      setStudents(data);
    };
    loadStudents();
  }, []);

  const refreshStudents = async () => {
    setLoading(true);
    const data = await fetchStudents();
    setLoading(false);
    setStudents(data);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);

  return (
    <>
      <BreadCrump title={"students"}>
        <CreateStudent refreshStudents={refreshStudents} />
      </BreadCrump>
      <section className="max-w-[90%] m-auto w-full h-full mt-5">
        <div className="sm:w-[750px] w-[100%] m-auto mb-5">
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
                students={students}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                loading={loading}
                refreshStudents={refreshStudents}
              />
            </TableBody>
          </Table>
          {students.length > 10 && (
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
