import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StudentsDashboard } from "./components/StudentsDashboard";
import { StudentsPageHeader } from "./components/StudentsPageHeader";
import { StudentsPanel } from "./components/StudentsPanel";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useStudents } from "./hooks/useStudents";
import type {
  CreateStudentInput,
  SortDirection,
  Student,
  StudentStatus,
  StudentSummary,
} from "./types/students";

type PanelMode = "detail" | "create" | null;

const getStatusFilter = (value: string | null): StudentStatus | "all" =>
  value === "active" || value === "excluded" ? value : "all";

const getSortDirection = (value: string | null): SortDirection =>
  value === "asc" ? "asc" : "desc";

const getPanelMode = (value: string | null): PanelMode =>
  value === "detail" || value === "create" ? value : null;

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

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { students, isLoading, error, refresh, createStudent, syncStudent } = useStudents();

  const querySearch = searchParams.get("search") ?? "";
  const statusFilter = getStatusFilter(searchParams.get("status"));
  const sortDirection = getSortDirection(searchParams.get("sort"));
  const panel = getPanelMode(searchParams.get("panel"));
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
    const active = students.filter((student) => student.status === "active").length;
    const excluded = students.filter((student) => student.status === "excluded").length;

    return {
      total: students.length,
      active,
      excluded,
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

  const handleOpenDetails = (id: string) => {
    updateParams({
      panel: "detail",
      studentId: id,
    });
  };

  const handleOpenCreate = () => {
    updateParams({
      panel: "create",
      studentId: null,
    });
  };

  const handleClosePanel = () => {
    updateParams({
      panel: null,
      studentId: null,
    });
  };

  const handleCreateStudent = async (input: CreateStudentInput) => createStudent(input);

  const handleStudentCreated = (student: Student) => {
    handleClosePanel();
    handleOpenDetails(student.id);
  };

  return (
    <div className="app-shell">
      <StudentsPageHeader
        activeCount={stats.active}
        excludedCount={stats.excluded}
        totalCount={stats.total}
      />

      <StudentsDashboard
        error={error}
        filteredStudents={filteredStudents}
        isLoading={isLoading}
        onCreateClick={handleOpenCreate}
        onOpenStudent={handleOpenDetails}
        onResetFilters={() => {
          setSearchInput("");
          updateParams({ search: null, status: null });
        }}
        onRetry={() => void refresh()}
        onSearchChange={setSearchInput}
        onSortChange={(value) => updateParams({ sort: value || null })}
        onStatusChange={(value) => updateParams({ status: value === "all" ? null : value })}
        search={searchInput}
        sort={sortDirection}
        status={statusFilter}
        totalCount={students.length}
      />

      <StudentsPanel
        onClose={handleClosePanel}
        onCreate={handleCreateStudent}
        onCreated={handleStudentCreated}
        onStudentUpdated={syncStudent}
        panel={panel}
        studentId={studentId}
      />
    </div>
  );
}

export default App;
