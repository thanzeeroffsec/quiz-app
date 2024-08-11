import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { FaCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";

import { BsPencil } from "react-icons/bs";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditStudentProps {
  student: {
    _id: string;
    name: string;
    category: string;
  };
  onClose: () => void;
  refreshStudents: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({
  student,
  onClose,
  refreshStudents,
}) => {
  const [studentName, setStudentName] = useState(student?.name);
  const [category, setCategory] = useState(student?.category);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStudentName(student?.name);
    setCategory(student?.category);
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const req = await fetch(`/api/admin/students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: student._id,
          name: studentName,
          category,
        }),
      });
      const data = await req.json();
      if (!req.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast("", {
        description: (
          <span className="ml-2 text-[14px] font-semibold">
            Success updated
          </span>
        ),
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });
      refreshStudents(); // Refresh the list of students
      onClose(); // Close the modal
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Student"
      icon={
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-black rounded-none"
        >
          <BsPencil color="gray" />{" "}
        </Button>
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="mt-7 flex flex-col gap-4">
          <div>
            <Label htmlFor="student">Student Name:</Label>
            <Input
              type="text"
              id="student"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Student name"
              className="rounded-none mt-2 focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
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
          </div>
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default EditStudent;
