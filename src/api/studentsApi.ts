import { INITIAL_STUDENTS } from "../data/mockStudents";
import type {
  CreateStudentInput,
  Student,
  StudentSummary,
  UpdateStudentInput,
} from "../types/students";

const STORAGE_KEY = "egeland-students-v1";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const getStoredStudents = (): Student[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return clone(INITIAL_STUDENTS);
  }

  try {
    return JSON.parse(raw) as Student[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return clone(INITIAL_STUDENTS);
  }
};

const saveStudents = (students: Student[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const toSummary = (student: Student): StudentSummary => ({
  id: student.id,
  name: student.name,
  email: student.email,
  course: student.course,
  status: student.status,
  registeredAt: student.registeredAt,
});

const generateId = (students: Student[]) => {
  const lastId = students
    .map((student) => Number(student.id.replace("ST-", "")))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a)[0];

  const nextId = (lastId ?? 1000) + 1;
  return `ST-${String(nextId)}`;
};

export const studentsApi = {
  async getStudents(): Promise<StudentSummary[]> {
    await wait(650);
    return getStoredStudents().map(toSummary);
  },

  async getStudentById(id: string): Promise<Student> {
    await wait(450);

    const student = getStoredStudents().find((entry) => entry.id === id);

    if (!student) {
      throw new Error("Ученик не найден");
    }

    return clone(student);
  },

  async createStudent(input: CreateStudentInput): Promise<Student> {
    await wait(700);

    const students = getStoredStudents();
    const createdStudent: Student = {
      id: generateId(students),
      registeredAt: new Date().toISOString(),
      completedHomeworkCount: 0,
      managerComment: "Новый ученик. Комментарий пока не добавлен.",
      ...input,
    };

    const updatedStudents = [createdStudent, ...students];
    saveStudents(updatedStudents);

    return clone(createdStudent);
  },

  async updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
    await wait(550);

    const students = getStoredStudents();
    const targetIndex = students.findIndex((entry) => entry.id === id);

    if (targetIndex < 0) {
      throw new Error("Ученик не найден");
    }

    const updatedStudent: Student = {
      ...students[targetIndex],
      status: input.status,
      managerComment: input.managerComment.trim(),
    };

    const nextStudents = [...students];
    nextStudents[targetIndex] = updatedStudent;
    saveStudents(nextStudents);

    return clone(updatedStudent);
  },
};
