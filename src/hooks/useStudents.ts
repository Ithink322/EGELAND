import { useCallback, useEffect, useState } from "react";
import { studentsApi } from "../api/studentsApi";
import type { CreateStudentInput, Student, StudentSummary } from "../types/students";

interface UseStudentsResult {
  error: string | null;
  isLoading: boolean;
  students: StudentSummary[];
  refresh: () => Promise<void>;
  createStudent: (input: CreateStudentInput) => Promise<Student>;
  syncStudent: (student: Student) => void;
}

export const useStudents = (): UseStudentsResult => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await studentsApi.getStudents();
      setStudents(response);
    } catch {
      setError("Не удалось загрузить список учеников.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const createStudent = useCallback(async (input: CreateStudentInput) => {
    const createdStudent = await studentsApi.createStudent(input);

    setStudents((currentStudents) => [
      {
        id: createdStudent.id,
        name: createdStudent.name,
        email: createdStudent.email,
        course: createdStudent.course,
        status: createdStudent.status,
        registeredAt: createdStudent.registeredAt,
      },
      ...currentStudents,
    ]);

    return createdStudent;
  }, []);

  const syncStudent = useCallback((student: Student) => {
    setStudents((currentStudents) =>
      currentStudents.map((entry) =>
        entry.id === student.id
          ? {
              id: student.id,
              name: student.name,
              email: student.email,
              course: student.course,
              status: student.status,
              registeredAt: student.registeredAt,
            }
          : entry,
      ),
    );
  }, []);

  return {
    error,
    isLoading,
    students,
    refresh: loadStudents,
    createStudent,
    syncStudent,
  };
};
