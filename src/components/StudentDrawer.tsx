import { useEffect, type ReactNode } from "react";

interface StudentDrawerProps {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export const StudentDrawer = ({
  title,
  description,
  onClose,
  children,
}: StudentDrawerProps) => {
  useEffect(() => {
    const { body } = document;
    const scrollY = window.scrollY;
    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, []);

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        aria-label={title}
        className="drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer__header">
          <div>
            <p className="eyebrow">Панель ученика</p>
            <h3>{title}</h3>
            <p className="muted">{description}</p>
          </div>

          <button
            aria-label="Закрыть панель"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="drawer__content">{children}</div>
      </aside>
    </div>
  );
};
