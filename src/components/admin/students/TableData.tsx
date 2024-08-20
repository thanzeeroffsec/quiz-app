"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaRegTrashCan } from "react-icons/fa6";

import DeleteStudent from "@/components/admin/students/DeleteStudent";
import { Student } from "@/lib/fetchStudents";
import EditStudent from "./EditStudent";
import { BsPencil } from "react-icons/bs";

interface TableDataProps {
  students: Student[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean; // Added loading prop

  refreshStudents: () => void;
}

const TableData: React.FC<TableDataProps> = ({
  students,
  currentPage,
  itemsPerPage,
  loading,
  refreshStudents,
}) => {
  const [studentId, setStudentId] = React.useState<string | null>(null);
  const [singleStudent, setSingleStudent] = React.useState<Student | null>(
    null
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {loading ? (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            <Loader2 className="size-10 text-blue-400 animate-spin m-auto" />
          </TableCell>
        </TableRow>
      ) : paginatedStudents.length > 0 ? (
        paginatedStudents.map((student, index) => (
          <TableRow
            key={student._id}
            className={`${
              index % 2 === 0 ? "bg-[#0000000d] hover:bg-[#0000000d]/[0.2]" : ""
            }`}
          >
            <TableCell className="font-medium py-[2px]">
              {startIndex + index + 1}
            </TableCell>
            <TableCell className="py-[2px]">{student.name}</TableCell>
            <TableCell className="uppercase py-[2px]">
              {student.category}
            </TableCell>
            <TableCell className="py-[5px]">{student.point}</TableCell>
            <TableCell className="text-right flex gap-1 justify-end py-[2px]">
              <span onClick={() => setSingleStudent(student)}>
                <EditStudent
                  student={singleStudent!}
                  onClose={() => setSingleStudent(null)}
                  refreshStudents={refreshStudents}
                />
              </span>

              <span onClick={() => setStudentId(student._id)}>
                <DeleteStudent
                  refreshStudents={refreshStudents}
                  studentId={studentId || ""}
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
              </span>
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
    </>
  );
};

export default TableData;
