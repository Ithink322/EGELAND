import type { CreateStudentInput, Student } from "../types/students";
import { StudentCreateForm } from "./StudentCreateForm";
import { StudentDetailView } from "./StudentDetailView";
import { StudentDrawer } from "./StudentDrawer";

interface StudentsPanelProps {
  panel: "detail" | "create" | null;
  studentId: string | null;
  onClose: () => void;
  onCreate: (input: CreateStudentInput) => Promise<Student>;
  onCreated: (student: Student) => void;
  onStudentUpdated: (student: Student) => void;
}

export const StudentsPanel = ({
  panel,
  studentId,
  onClose,
  onCreate,
  onCreated,
  onStudentUpdated,
}: StudentsPanelProps) => {
  const drawerConfig =
    panel === "detail" && studentId
      ? {
          title: "Карточка ученика",
          description: "Просмотр и редактирование статуса ученика.",
          content: (
            <StudentDetailView
              onSaved={onClose}
              onStudentUpdated={onStudentUpdated}
              studentId={studentId}
            />
          ),
        }
      : panel === "create"
        ? {
            title: "Создать ученика",
            description: "Создайте нового ученика и сразу добавьте его в список.",
            content: <StudentCreateForm onCreate={onCreate} onCreated={onCreated} />,
          }
        : null;

  if (!drawerConfig) {
    return null;
  }

  return (
    <StudentDrawer
      description={drawerConfig.description}
      onClose={onClose}
      title={drawerConfig.title}
    >
      {drawerConfig.content}
    </StudentDrawer>
  );
};
