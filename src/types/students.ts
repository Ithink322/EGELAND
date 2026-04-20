export type StudentStatus = "active" | "excluded";

export type SortDirection = "asc" | "desc";

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  course: string;
  status: StudentStatus;
  registeredAt: string;
}

export interface Student extends StudentSummary {
  phone: string;
  completedHomeworkCount: number;
  managerComment: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  phone: string;
  course: string;
  status: StudentStatus;
}

export interface UpdateStudentInput {
  status: StudentStatus;
  managerComment: string;
}
