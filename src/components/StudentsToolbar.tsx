import type { SortDirection, StudentStatus } from "../types/students";

interface StudentsToolbarProps {
  search: string;
  status: StudentStatus | "all";
  sort: SortDirection;
  resultsCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StudentStatus | "all") => void;
  onSortChange: (value: SortDirection) => void;
  onCreateClick: () => void;
}

export const StudentsToolbar = ({
  search,
  status,
  sort,
  resultsCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onCreateClick,
}: StudentsToolbarProps) => (
  <section className="toolbar">
    <div className="toolbar__summary">
      <p className="eyebrow">Рабочая очередь менеджера</p>
      <h2>Список учеников</h2>
      <p className="muted">
        Показано {resultsCount} из {totalCount}. Поиск и фильтры сохраняются в URL.
      </p>
    </div>

    <div className="toolbar__actions">
      <label className="field">
        <span>Поиск по имени</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Например, Анна"
          type="search"
        />
      </label>

      <label className="field">
        <span>Статус</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as StudentStatus | "all")}
        >
          <option value="all">Все статусы</option>
          <option value="active">Активный</option>
          <option value="excluded">Исключен</option>
        </select>
      </label>

      <label className="field">
        <span>Сортировка по дате</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortDirection)}
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </label>

      <button className="primary-button" onClick={onCreateClick} type="button">
        Создать ученика
      </button>
    </div>
  </section>
);
