// fetchStudents.ts
export interface Student {
  _id: string;
  name: string;
  category: string;
  point: number;
}

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch("/api/admin/students", {
      headers: {
        accept: "application/json",
      },
      credentials: "include",
    });
    const students = await response.json();
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};
