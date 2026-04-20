import type { SortDirection, StudentStatus, StudentSummary } from "../types/students";
import { StudentListSkeleton } from "./StudentListSkeleton";
import { StudentsGrid } from "./StudentsGrid";
import { StudentsToolbar } from "./StudentsToolbar";

interface StudentsDashboardProps {
  search: string;
  status: StudentStatus | "all";
  sort: SortDirection;
  totalCount: number;
  filteredStudents: StudentSummary[];
  isLoading: boolean;
  error: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StudentStatus | "all") => void;
  onSortChange: (value: SortDirection) => void;
  onCreateClick: () => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onOpenStudent: (studentId: string) => void;
}

export const StudentsDashboard = ({
  search,
  status,
  sort,
  totalCount,
  filteredStudents,
  isLoading,
  error,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onCreateClick,
  onRetry,
  onResetFilters,
  onOpenStudent,
}: StudentsDashboardProps) => (
  <main className="dashboard">
    <StudentsToolbar
      onCreateClick={onCreateClick}
      onSearchChange={onSearchChange}
      onSortChange={onSortChange}
      onStatusChange={onStatusChange}
      resultsCount={filteredStudents.length}
      search={search}
      sort={sort}
      status={status}
      totalCount={totalCount}
    />

    {error ? (
      <section className="state-card state-card--error">
        <div>
          <h3>Не удалось загрузить список</h3>
          <p className="muted">Проверьте mock API и попробуйте запросить данные еще раз.</p>
        </div>
        <button className="secondary-button" onClick={onRetry} type="button">
          Повторить
        </button>
      </section>
    ) : null}

    {isLoading ? <StudentListSkeleton /> : null}

    {!isLoading && !error && totalCount === 0 ? (
      <section className="state-card">
        <div>
          <h3>Список пока пуст</h3>
          <p className="muted">Добавьте первого ученика, чтобы начать работу менеджера.</p>
        </div>
        <button className="primary-button" onClick={onCreateClick} type="button">
          Создать ученика
        </button>
      </section>
    ) : null}

    {!isLoading && !error && totalCount > 0 && filteredStudents.length === 0 ? (
      <section className="state-card">
        <div>
          <h3>Ничего не найдено</h3>
          <p className="muted">
            Попробуйте сбросить фильтр по статусу или изменить поисковый запрос.
          </p>
        </div>
        <button className="secondary-button" onClick={onResetFilters} type="button">
          Сбросить фильтры
        </button>
      </section>
    ) : null}

    {!isLoading && !error && filteredStudents.length > 0 ? (
      <StudentsGrid students={filteredStudents} onOpen={onOpenStudent} />
    ) : null}
  </main>
);
