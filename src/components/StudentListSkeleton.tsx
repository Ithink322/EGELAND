export const StudentListSkeleton = () => (
  <section className="skeleton-grid" aria-label="Загрузка списка учеников">
    {Array.from({ length: 5 }).map((_, index) => (
      <article className="skeleton-card skeleton-card--student" key={index}>
        <div className="skeleton-card__column skeleton-card__column--id">
          <span className="skeleton-line skeleton-line--short" />
          <span className="skeleton-line skeleton-line--tiny" />
        </div>

        <div className="skeleton-card__column skeleton-card__column--profile">
          <div className="skeleton-profile">
            <span className="skeleton-avatar" />
            <div className="skeleton-profile__lines">
              <span className="skeleton-line skeleton-line--name" />
              <span className="skeleton-line skeleton-line--email" />
            </div>
          </div>
        </div>

        <div className="skeleton-card__column">
          <span className="skeleton-line skeleton-line--medium" />
          <span className="skeleton-line skeleton-line--tiny" />
        </div>

        <div className="skeleton-card__column">
          <span className="skeleton-pill" />
        </div>

        <div className="skeleton-card__column">
          <span className="skeleton-line skeleton-line--date" />
        </div>

        <div className="skeleton-card__column skeleton-card__column--action">
          <span className="skeleton-button" />
        </div>
      </article>
    ))}
  </section>
);
