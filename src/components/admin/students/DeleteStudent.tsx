import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteStudent = ({ icon, studentId, refreshStudents }: any) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/students/`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: studentId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      refreshStudents();
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>{icon}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete students
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudent;
