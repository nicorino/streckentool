import { useMemo, useState, type CSSProperties } from "react";
import { Search, SlidersHorizontal, Tag } from "lucide-react";
import type { FigureElement, FigureTemplate } from "../types/Figure";
import { useAppLanguage } from "../i18n/i18n";

type RightFigureLibraryProps = {
  templates?: FigureTemplate[];
  figureTemplates?: FigureTemplate[];
  selectedTemplateId?: string | null;
  onSelectTemplate?: (templateId: string) => void;
  onAddFigure?: (templateId: string) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  Slalom: "Slalom",
  Gates: "Tore",
  Gate: "Tore",
  Lanes: "Gassen",
  Lane: "Gassen",
  Boxes: "Boxen",
  Box: "Boxen",
  Turns: "Wenden",
  Turn: "Wenden",
  Other: "Sonstige",
};

export function RightFigureLibrary({
  templates,
  figureTemplates,
  selectedTemplateId = null,
  onSelectTemplate,
  onAddFigure,
}: RightFigureLibraryProps) {
  const { t } = useAppLanguage();
  const [query, setQuery] = useState("");

  const allTemplates = templates ?? figureTemplates ?? [];
  const handleSelectTemplate = onSelectTemplate ?? onAddFigure;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTemplates = useMemo(() => {
    if (!normalizedQuery) {
      return allTemplates;
    }

    return allTemplates.filter((template) => {
      const haystack = [
        template.name,
        template.shortName,
        template.category,
        template.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [allTemplates, normalizedQuery]);

  const groupedTemplates = useMemo(() => {
    const groups = new Map<string, FigureTemplate[]>();

    for (const template of filteredTemplates) {
      const category = getCategory(template);
      groups.set(category, [...(groups.get(category) ?? []), template]);
    }

    return Array.from(groups.entries()).map(([category, grouped]) => ({
      category,
      templates: grouped,
    }));
  }, [filteredTemplates]);

  return (
    <aside data-tutorial-target="tutorial-figure-library" style={libraryStyle}>
      <header style={headerStyle}>
        <div>
          <h2 style={titleStyle}>{t("figureLibrary")}</h2>
          <p style={subtitleStyle}>
            {filteredTemplates.length} {t("figureLibraryResults")}
          </p>
        </div>
      </header>

      <label style={searchStyle}>
        <Search size={15} strokeWidth={2.3} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchFigures")}
          style={searchInputStyle}
        />
      </label>

      <div style={contentStyle}>
        {groupedTemplates.length === 0 && (
          <div style={emptyStyle}>
            <Search size={22} strokeWidth={2.2} />
            <strong>{t("figureLibraryEmptyTitle")}</strong>
            <span>{t("figureLibraryEmptyBody")}</span>
          </div>
        )}

        {groupedTemplates.map((group) => (
          <section key={group.category} style={categorySectionStyle}>
            <h3 style={categoryTitleStyle}>
              <Tag size={13} strokeWidth={2.4} />
              {CATEGORY_LABELS[group.category] ?? group.category}
            </h3>

            <div style={cardGridStyle}>
              {group.templates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                const isConfigurable = template.id === "configurable-slalom";

                return (
                  <button
                    key={template.id}
                    type="button"
                    data-tutorial-target={
                      isConfigurable ? "tutorial-slalom-card" : undefined
                    }
                    onClick={() => handleSelectTemplate?.(template.id)}
                    style={getCardStyle(isSelected)}
                  >
                    <FigurePreview template={template} />

                    <span style={cardBodyStyle}>
                      <span style={cardTitleRowStyle}>
                        <strong style={cardTitleStyle}>
                          {template.shortName ?? template.name}
                        </strong>

                        {isConfigurable && (
                          <span style={badgeStyle}>
                            <SlidersHorizontal size={11} strokeWidth={2.5} />
                            {t("configurable")}
                          </span>
                        )}
                      </span>

                      {template.description && (
                        <span style={descriptionStyle}>
                          {template.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

function FigurePreview({ template }: { template: FigureTemplate }) {
  const viewBox = getSvgViewBox(template.elements);

  return (
    <svg viewBox={viewBox} style={previewStyle} aria-hidden="true">
      {template.elements.map((element, index) => {
        if (element.type === "line") {
          return (
            <line
              key={index}
              x1={element.x1}
              y1={element.y1}
              x2={element.x2}
              y2={element.y2}
              stroke="currentColor"
              strokeWidth={0.12}
              strokeLinecap="round"
              opacity={0.65}
            />
          );
        }

        if (
          element.orientation === "left" ||
          element.orientation === "right" ||
          element.orientation === "up" ||
          element.orientation === "down"
        ) {
          const direction = element.orientation === "right" ? 1 : -1;
          const radius = Math.max(0.22, element.radius);
          const tipX = element.x + direction * radius;
          const baseX = element.x - direction * radius;
          const topY = element.y - radius * 0.75;
          const bottomY = element.y + radius * 0.75;

          return (
            <polygon
              key={index}
              points={`${tipX},${element.y} ${baseX},${topY} ${baseX},${bottomY}`}
              fill="currentColor"
            stroke="#111827"
                strokeWidth={0.12}
              />
          );
        }

        if (
          element.orientation === "left" ||
          element.orientation === "right" ||
          element.orientation === "up" ||
          element.orientation === "down"
        ) {
          const radius = Math.max(0.24, element.radius);

          if (element.orientation === "up" || element.orientation === "down") {
            const direction = element.orientation === "down" ? 1 : -1;
            const tipX = element.x;
            const tipY = element.y + direction * radius * 1.15;
            const leftX = element.x - radius * 0.78;
            const rightX = element.x + radius * 0.78;
            const baseY = element.y - direction * radius * 0.95;

            return (
              <polygon
                key={index}
                points={`${tipX},${tipY} ${leftX},${baseY} ${rightX},${baseY}`}
                fill="currentColor"
              stroke="#111827"
                strokeWidth={0.12}
              />
            );
          }

          const direction = element.orientation === "right" ? 1 : -1;
          const tipX = element.x + direction * radius * 1.15;
          const baseX = element.x - direction * radius * 0.95;
          const topY = element.y - radius * 0.78;
          const bottomY = element.y + radius * 0.78;

          return (
            <polygon
              key={index}
              points={`${tipX},${element.y} ${baseX},${topY} ${baseX},${bottomY}`}
              fill="currentColor"
            stroke="#111827"
                strokeWidth={0.12}
              />
          );
        }

        return (
          <circle
            key={index}
            cx={element.x}
            cy={element.y}
            r={Math.max(0.18, element.radius)}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

function getSvgViewBox(elements: FigureElement[]) {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const element of elements) {
    if (element.type === "line") {
      xs.push(element.x1, element.x2);
      ys.push(element.y1, element.y2);
    } else {
      xs.push(element.x - element.radius, element.x + element.radius);
      ys.push(element.y - element.radius, element.y + element.radius);
    }
  }

  if (xs.length === 0 || ys.length === 0) {
    return "-1 -1 2 2";
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const padding = Math.max(width, height) * 0.25;

  return `${minX - padding} ${minY - padding} ${width + padding * 2} ${
    height + padding * 2
  }`;
}

function getCategory(template: FigureTemplate): string {
  return template.category ?? "Other";
}

function getCardStyle(active: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "72px 1fr",
    gap: 11,
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: active
      ? "1px solid var(--st-primary)"
      : "1px solid var(--st-border-soft)",
    background: active ? "rgba(25, 118, 210, 0.1)" : "var(--st-card)",
    color: "var(--st-text)",
    textAlign: "left",
    cursor: "pointer",
  };
}

const libraryStyle: CSSProperties = {
  width: 320,
  minWidth: 320,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderLeft: "1px solid var(--st-border)",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  fontFamily: "sans-serif",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 14px 10px",
  borderBottom: "1px solid var(--st-border-soft)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
};

const subtitleStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--st-text-muted)",
  fontSize: 12,
};

const searchStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: 12,
  padding: "0 10px",
  height: 36,
  borderRadius: 10,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text-muted)",
};

const searchInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 0,
  background: "transparent",
  color: "var(--st-text)",
  fontSize: 13,
};

const contentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0 12px 14px",
};

const categorySectionStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  marginBottom: 16,
};

const categoryTitleStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: 6,
  margin: 0,
  padding: "8px 2px 6px",
  background: "var(--st-panel)",
  color: "var(--st-text-muted)",
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const cardGridStyle: CSSProperties = {
  display: "grid",
  gap: 9,
};

const previewStyle: CSSProperties = {
  width: 72,
  height: 52,
  padding: 5,
  boxSizing: "border-box",
  borderRadius: 9,
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
};

const cardBodyStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  minWidth: 0,
};

const cardTitleRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  minWidth: 0,
};

const cardTitleStyle: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 13,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
  padding: "2px 6px",
  borderRadius: 999,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card-soft)",
  color: "var(--st-text-muted)",
  fontSize: 10,
  fontWeight: 800,
};

const descriptionStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  color: "var(--st-text-muted)",
  fontSize: 11,
  lineHeight: 1.3,
};

const emptyStyle: CSSProperties = {
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: 18,
  textAlign: "center",
  color: "var(--st-text-muted)",
  fontSize: 13,
};
