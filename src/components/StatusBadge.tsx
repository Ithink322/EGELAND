import type { StudentStatus } from "../types/students";

interface StatusBadgeProps {
  status: StudentStatus;
}

const statusMap: Record<StudentStatus, string> = {
  active: "Активный",
  excluded: "Исключен",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`status-badge status-badge--${status}`}>{statusMap[status]}</span>
);
