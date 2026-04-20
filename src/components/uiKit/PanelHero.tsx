import type { ReactNode } from "react";

interface PanelHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  aside?: ReactNode;
}

export const PanelHero = ({
  eyebrow,
  title,
  description,
  aside,
}: PanelHeroProps) => (
  <section className="detail-section detail-section--hero">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h4>{title}</h4>
      <p className="muted">{description}</p>
    </div>

    {aside}
  </section>
);
