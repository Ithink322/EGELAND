import type { ReactNode } from "react";

interface InfoGridItem {
  label: string;
  value: ReactNode;
}

interface InfoGridProps {
  items: InfoGridItem[];
}

export const InfoGrid = ({ items }: InfoGridProps) => (
  <section className="detail-section info-grid">
    {items.map((item) => (
      <div key={item.label}>
        <span className="detail-label">{item.label}</span>
        <strong>{item.value}</strong>
      </div>
    ))}
  </section>
);
