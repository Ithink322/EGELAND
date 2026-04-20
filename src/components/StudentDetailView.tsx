import { useEffect, useMemo, useState } from "react";
import { studentsApi } from "../api/studentsApi";
import type { Student, StudentStatus } from "../types/students";
import { formatDate } from "../utils/date";
import { StatusBadge } from "./StatusBadge";
import { InfoGrid } from "./uiKit/InfoGrid";
import { PanelHero } from "./uiKit/PanelHero";

interface StudentDetailViewProps {
  studentId: string;
  onSaved: () => void;
  onStudentUpdated: (student: Student) => void;
}

export const StudentDetailView = ({
  studentId,
  onSaved,
  onStudentUpdated,
}: StudentDetailViewProps) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [status, setStatus] = useState<StudentStatus>("active");
  const [managerComment, setManagerComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadStudent = async () => {
      setIsLoading(true);
      setError(null);
      setSaveState(null);

      try {
        const response = await studentsApi.getStudentById(studentId);

        if (isCancelled) {
          return;
        }

        setStudent(response);
        setStatus(response.status);
        setManagerComment(response.managerComment);
      } catch {
        if (!isCancelled) {
          setError("Не удалось загрузить карточку ученика.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadStudent();

    return () => {
      isCancelled = true;
    };
  }, [studentId]);

  const infoItems = useMemo(
    () =>
      student
        ? [
            { label: "Телефон", value: student.phone },
            { label: "Курс", value: student.course },
            { label: "Дата регистрации", value: formatDate(student.registeredAt) },
            { label: "Домашних выполнено", value: student.completedHomeworkCount },
          ]
        : [],
    [student],
  );

  const handleSave = async () => {
    if (!student) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveState(null);

    try {
      const updatedStudent = await studentsApi.updateStudent(student.id, {
        status,
        managerComment,
      });

      setStudent(updatedStudent);
      onStudentUpdated(updatedStudent);
      setSaveState("Изменения сохранены.");
      onSaved();
    } catch {
      setError("Не удалось сохранить изменения.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="state-card">Загружаем карточку ученика...</div>;
  }

  if (error && !student) {
    return <div className="state-card state-card--error">{error}</div>;
  }

  if (!student) {
    return <div className="state-card">Ученик не найден.</div>;
  }

  return (
    <div className="detail-stack">
      <PanelHero
        aside={<StatusBadge status={student.status} />}
        description={student.email}
        eyebrow="Карточка ученика"
        title={student.name}
      />

      <InfoGrid items={infoItems} />

      <section className="detail-section detail-section--editable">
        <label className="field">
          <span>Статус</span>
          <select
            disabled={isSaving}
            value={status}
            onChange={(event) => setStatus(event.target.value as StudentStatus)}
          >
            <option value="active">Активный</option>
            <option value="excluded">Исключен</option>
          </select>
        </label>

        <label className="field">
          <span>Комментарий менеджера</span>
          <textarea
            disabled={isSaving}
            rows={6}
            value={managerComment}
            onChange={(event) => setManagerComment(event.target.value)}
          />
        </label>

        {error ? <div className="inline-message inline-message--error">{error}</div> : null}
        {saveState ? <div className="inline-message inline-message--success">{saveState}</div> : null}

        <div className="detail-section__actions">
          <button className="primary-button" disabled={isSaving} onClick={handleSave} type="button">
            {isSaving ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </div>
      </section>
    </div>
  );
};
