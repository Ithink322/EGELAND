interface StudentsPageHeaderProps {
  totalCount: number;
  activeCount: number;
  excludedCount: number;
}

const summaryLabel = (count: number) => `${count} ${count === 1 ? "ученик" : "учеников"}`;

export const StudentsPageHeader = ({
  totalCount,
  activeCount,
  excludedCount,
}: StudentsPageHeaderProps) => (
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
        <strong>{summaryLabel(totalCount)}</strong>
      </article>
      <article className="stat-card">
        <span>Активные</span>
        <strong>{activeCount}</strong>
      </article>
      <article className="stat-card">
        <span>Исключенные</span>
        <strong>{excludedCount}</strong>
      </article>
    </div>
  </header>
);
