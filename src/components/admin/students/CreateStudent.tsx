"use client";
import React, { useState } from "react";
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

import { TiPlus } from "react-icons/ti";
import Modal from "@/components/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateStudent = ({ refreshStudents }: any) => {
  const [studentName, setStudentName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const req = await fetch("/api/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: studentName,
          category,
        }),
      });
      const data = await req.json();
      if (!req.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      refreshStudents();
      toast("", {
        description: (
          <span className="ml-2 text-[14px] font-semibold">
            success updated
          </span>
        ),
        position: "top-right",
        icon: <FaCheck fill="#AACC00" size={20} />,
      });
      setStudentName("");
      setCategory("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Create Students" icon={<TiPlus size={40} />}>
      <form onSubmit={handleSubmit}>
        <div className="mt-7 flex flex-col gap-4">
          <div>
            <Label htmlFor="student" className="">
              Student Name :
            </Label>
            <Input
              type="text"
              id="student"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="student name"
              className="rounded-none mt-2 focus:!border-0 focus:!ring-2 focus:!ring-gray-500/[0.5] focus:!outline-none "
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
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
          </div>
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "submit"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStudent;
