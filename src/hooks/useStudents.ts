// hooks/useStudents.ts
import { useState, useEffect } from "react";

const useStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const contentType = res.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response");
      }

      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, fetchStudents, loading };
};

export default useStudents;
