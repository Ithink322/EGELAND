import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StudentCreateForm } from "./components/StudentCreateForm";
import { StudentDetailView } from "./components/StudentDetailView";
import { StudentDrawer } from "./components/StudentDrawer";
import { StudentListSkeleton } from "./components/StudentListSkeleton";
import { StudentsGrid } from "./components/StudentsGrid";
import { StudentsToolbar } from "./components/StudentsToolbar";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useStudents } from "./hooks/useStudents";
import type { SortDirection, StudentStatus, StudentSummary } from "./types/students";

const getStatusFilter = (value: string | null): StudentStatus | "all" =>
  value === "active" || value === "excluded" ? value : "all";

const getSortDirection = (value: string | null): SortDirection =>
  value === "asc" ? "asc" : "desc";

const sortStudents = (students: StudentSummary[], direction: SortDirection) =>
  [...students].sort((left, right) => {
    const leftValue = new Date(left.registeredAt).getTime();
    const rightValue = new Date(right.registeredAt).getTime();

    return direction === "desc" ? rightValue - leftValue : leftValue - rightValue;
  });

const filterStudents = (
  students: StudentSummary[],
  search: string,
  status: StudentStatus | "all",
) =>
  students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" ? true : student.status === status;

    return matchesSearch && matchesStatus;
  });

const summaryLabel = (count: number) => `${count} ${count === 1 ? "ученик" : "учеников"}`;

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { students, isLoading, error, refresh, createStudent, syncStudent } = useStudents();

  const querySearch = searchParams.get("search") ?? "";
  const statusFilter = getStatusFilter(searchParams.get("status"));
  const sortDirection = getSortDirection(searchParams.get("sort"));
  const panel = searchParams.get("panel");
  const studentId = searchParams.get("studentId");

  const [searchInput, setSearchInput] = useState(querySearch);
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  useEffect(() => {
    setSearchInput(querySearch);
  }, [querySearch]);

  useEffect(() => {
    if (debouncedSearch === querySearch) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      nextParams.set("search", debouncedSearch);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, querySearch, searchParams, setSearchParams]);

  const filteredStudents = useMemo(
    () => sortStudents(filterStudents(students, querySearch, statusFilter), sortDirection),
    [querySearch, sortDirection, statusFilter, students],
  );

  const stats = useMemo(() => {
    const activeCount = students.filter((student) => student.status === "active").length;
    const excludedCount = students.filter((student) => student.status === "excluded").length;

    return {
      total: students.length,
      active: activeCount,
      excluded: excludedCount,
    };
  }, [students]);

  const updateParams = (entries: Record<string, string | null>, replace = false) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(entries).forEach(([key, value]) => {
      if (value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams, { replace });
  };

  const openDetails = (id: string) => {
    updateParams({
      panel: "detail",
      studentId: id,
    });
  };

  const openCreate = () => {
    updateParams({
      panel: "create",
      studentId: null,
    });
  };

  const closeDrawer = () => {
    updateParams({
      panel: null,
      studentId: null,
    });
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Онлайн-школа · внутренний кабинет</p>
          <h1>Панель управления учениками</h1>
          <p>
            Интерфейс для менеджера: быстро найти ученика, понять его статус и внести
            изменения без лишних переходов.
          </p>
        </div>

        <div className="hero__stats">
          <article className="stat-card">
            <span>Всего</span>
            <strong>{summaryLabel(stats.total)}</strong>
          </article>
          <article className="stat-card">
            <span>Активные</span>
            <strong>{stats.active}</strong>
          </article>
          <article className="stat-card">
            <span>Исключенные</span>
            <strong>{stats.excluded}</strong>
          </article>
        </div>
      </header>

      <main className="dashboard">
        <StudentsToolbar
          onCreateClick={openCreate}
          onSearchChange={setSearchInput}
          onSortChange={(value) => updateParams({ sort: value || null })}
          onStatusChange={(value) => updateParams({ status: value === "all" ? null : value })}
          resultsCount={filteredStudents.length}
          search={searchInput}
          sort={sortDirection}
          status={statusFilter}
          totalCount={students.length}
        />

        {error ? (
          <section className="state-card state-card--error">
            <div>
              <h3>Не удалось загрузить список</h3>
              <p className="muted">Проверьте mock API и попробуйте запросить данные еще раз.</p>
            </div>
            <button className="secondary-button" onClick={() => void refresh()} type="button">
              Повторить
            </button>
          </section>
        ) : null}

        {isLoading ? (
          <StudentListSkeleton />
        ) : null}

        {!isLoading && !error && students.length === 0 ? (
          <section className="state-card">
            <div>
              <h3>Список пока пуст</h3>
              <p className="muted">Добавьте первого ученика, чтобы начать работу менеджера.</p>
            </div>
            <button className="primary-button" onClick={openCreate} type="button">
              Создать ученика
            </button>
          </section>
        ) : null}

        {!isLoading && !error && students.length > 0 && filteredStudents.length === 0 ? (
          <section className="state-card">
            <div>
              <h3>Ничего не найдено</h3>
              <p className="muted">
                Попробуйте сбросить фильтр по статусу или изменить поисковый запрос.
              </p>
            </div>
            <button
              className="secondary-button"
              onClick={() => {
                setSearchInput("");
                updateParams({ search: null, status: null });
              }}
              type="button"
            >
              Сбросить фильтры
            </button>
          </section>
        ) : null}

        {!isLoading && !error && filteredStudents.length > 0 ? (
          <StudentsGrid students={filteredStudents} onOpen={openDetails} />
        ) : null}
      </main>

      {panel === "detail" && studentId ? (
        <StudentDrawer
          description="Просмотр и редактирование статуса ученика."
          onClose={closeDrawer}
          title="Карточка ученика"
        >
          <StudentDetailView
            onSaved={closeDrawer}
            onStudentUpdated={syncStudent}
            studentId={studentId}
          />
        </StudentDrawer>
      ) : null}

      {panel === "create" ? (
        <StudentDrawer
          description="Создайте нового ученика и сразу добавьте его в список."
          onClose={closeDrawer}
          title="Создать ученика"
        >
          <StudentCreateForm
            onCreate={createStudent}
            onCreated={(student) => {
              closeDrawer();
              openDetails(student.id);
            }}
          />
        </StudentDrawer>
      ) : null}
    </div>
  );
}

export default App;
