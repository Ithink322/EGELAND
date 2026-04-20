import type { StudentSummary } from "../types/students";
import { formatDate } from "../utils/date";
import { StatusBadge } from "./StatusBadge";

interface StudentsGridProps {
  students: StudentSummary[];
  onOpen: (studentId: string) => void;
}

export const StudentsGrid = ({ students, onOpen }: StudentsGridProps) => (
  <section className="students-grid" aria-label="Список учеников">
    <div className="students-grid__header">
      <span>Id</span>
      <span>Имя и контакт</span>
      <span>Курс</span>
      <span>Статус</span>
      <span>Дата регистрации</span>
      <span>Действия</span>
    </div>

    {students.map((student) => (
      <article className="student-card" key={student.id}>
        <div className="student-card__cell">
          <span className="student-card__label">Id</span>
          <strong>{student.id}</strong>
        </div>

        <div className="student-card__cell">
          <span className="student-card__label">Имя и контакт</span>
          <strong>{student.name}</strong>
          <span className="muted">{student.email}</span>
        </div>

        <div className="student-card__cell">
          <span className="student-card__label">Курс</span>
          <strong>{student.course}</strong>
        </div>

        <div className="student-card__cell">
          <span className="student-card__label">Статус</span>
          <StatusBadge status={student.status} />
        </div>

        <div className="student-card__cell">
          <span className="student-card__label">Дата регистрации</span>
          <strong>{formatDate(student.registeredAt)}</strong>
        </div>

        <div className="student-card__cell student-card__cell--action">
          <button
            className="secondary-button"
            onClick={() => onOpen(student.id)}
            type="button"
          >
            Открыть
          </button>
        </div>
      </article>
    ))}
  </section>
);
