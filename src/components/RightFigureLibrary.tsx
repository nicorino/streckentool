import { useMemo, useState, type CSSProperties } from "react";
import type { FigureCategory, FigureElement, FigureTemplate } from "../types/Figure";
import { getElementBounds, getResolvedFigureElements } from "../figures/figureConfig";
import { type TranslationKey, useAppLanguage } from "../i18n/i18n";

type RightFigureLibraryProps = {
  figureTemplates: FigureTemplate[];
  onAddFigure: (templateId: string) => void;
};

const CATEGORY_ORDER: FigureCategory[] = [
  "Basic",
  "Slalom",
  "Gates",
  "Boxes",
  "Custom",
  "Other",
];

const ALL_CATEGORIES = "All";

type CategoryFilter = typeof ALL_CATEGORIES | FigureCategory;

export function RightFigureLibrary({
  figureTemplates,
  onAddFigure,
}: RightFigureLibraryProps) {
  const { t } = useAppLanguage();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>(ALL_CATEGORIES);

  const availableCategories = useMemo(() => {
    const categories = new Set<FigureCategory>();

    for (const template of figureTemplates) {
      categories.add(template.category ?? "Other");
    }

    return CATEGORY_ORDER.filter((category) => categories.has(category));
  }, [figureTemplates]);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchText);

    return figureTemplates.filter((template) => {
      const category = template.category ?? "Other";
      const categoryMatches =
        selectedCategory === ALL_CATEGORIES || selectedCategory === category;

      if (!categoryMatches) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = normalizeSearch(
        `${template.name} ${template.shortName ?? ""} ${
          template.description ?? ""
        } ${category}`
      );

      return haystack.includes(normalizedSearch);
    });
  }, [figureTemplates, searchText, selectedCategory]);

  return (
    <aside data-tutorial-target="tutorial-figure-library" style={libraryStyle}>
      <h3 style={titleStyle}>{t("figureLibrary")}</h3>

      <label style={fieldLabelStyle}>
        {t("search")}
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={t("searchFiguresPlaceholder")}
          style={inputStyle}
        />
      </label>

      <label style={fieldLabelStyle}>
        {t("category")}
        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value as CategoryFilter)
          }
          style={inputStyle}
        >
          <option value={ALL_CATEGORIES}>{t("allCategories")}</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {translateCategory(category, t)}
            </option>
          ))}
        </select>
      </label>

      <div style={resultSummaryStyle}>
        {filteredTemplates.length}{" "}
        {filteredTemplates.length === 1
          ? t("figureSingular")
          : t("figurePlural")}
      </div>

      <div style={listStyle}>
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            data-tutorial-target={
              template.id === "configurable-slalom"
                ? "tutorial-slalom-card"
                : undefined
            }
            onClick={() => onAddFigure(template.id)}
            style={cardStyle}
          >
            <FigurePreview template={template} />

            <span style={cardTextStyle}>
              <strong style={cardTitleStyle}>
                {template.shortName ?? template.name}
              </strong>

              {template.shortName && template.shortName !== template.name && (
                <span style={mutedTextStyle}>{template.name}</span>
              )}

              {template.description && (
                <span style={descriptionStyle}>{template.description}</span>
              )}
            </span>
          </button>
        ))}

        {filteredTemplates.length === 0 && (
          <div style={emptyStyle}>{t("noFiguresMatch")}</div>
        )}
      </div>
    </aside>
  );
}

function FigurePreview({ template }: { template: FigureTemplate }) {
  const elements = getResolvedFigureElements(template);
  const bounds = getElementBounds(elements);
  const width = Math.max(1, bounds.right - bounds.left);
  const height = Math.max(1, bounds.bottom - bounds.top);

  const viewBoxPadding = 0.8;
  const viewBox = [
    bounds.left - viewBoxPadding,
    bounds.top - viewBoxPadding,
    width + viewBoxPadding * 2,
    height + viewBoxPadding * 2,
  ].join(" ");

  return (
    <svg viewBox={viewBox} style={previewStyle} aria-hidden="true">
      <rect
        x={bounds.left - viewBoxPadding}
        y={bounds.top - viewBoxPadding}
        width={width + viewBoxPadding * 2}
        height={height + viewBoxPadding * 2}
        rx="0.35"
        fill="var(--st-card-soft)"
      />

      {elements.map((element, index) => renderPreviewElement(element, index))}
    </svg>
  );
}

function renderPreviewElement(element: FigureElement, index: number) {
  if (element.type === "cone") {
    return (
      <circle
        key={index}
        cx={element.x}
        cy={element.y}
        r={Math.max(0.18, element.radius)}
        fill="#ff7a00"
        stroke="#222"
        strokeWidth="0.08"
      />
    );
  }

  return (
    <line
      key={index}
      x1={element.x1}
      y1={element.y1}
      x2={element.x2}
      y2={element.y2}
      stroke="var(--st-text-muted)"
      strokeWidth="0.08"
      strokeDasharray="0.25 0.2"
    />
  );
}

function translateCategory(
  category: FigureCategory,
  t: (key: TranslationKey) => string
) {
  if (category === "Basic") return t("categoryBasic");
  if (category === "Slalom") return t("categorySlalom");
  if (category === "Gates") return t("categoryGates");
  if (category === "Boxes") return t("categoryBoxes");
  if (category === "Custom") return t("categoryCustom");
  return t("categoryOther");
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

const libraryStyle: CSSProperties = {
  width: 300,
  padding: 14,
  borderLeft: "1px solid var(--st-border)",
  boxSizing: "border-box",
  fontFamily: "sans-serif",
  overflowY: "auto",
  background: "var(--st-panel)",
  color: "var(--st-text)",
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
};

const fieldLabelStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  marginBottom: 10,
  fontSize: 13,
  fontWeight: 700,
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: 32,
  boxSizing: "border-box",
  padding: "0 8px",
  borderRadius: 8,
  border: "1px solid var(--st-border)",
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const resultSummaryStyle: CSSProperties = {
  margin: "8px 0 10px",
  color: "var(--st-text-muted)",
  fontSize: 12,
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 9,
};

const cardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "70px 1fr",
  gap: 10,
  alignItems: "center",
  width: "100%",
  padding: 8,
  borderRadius: 10,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  textAlign: "left",
  cursor: "pointer",
};

const previewStyle: CSSProperties = {
  width: 70,
  height: 52,
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card-soft)",
};

const cardTextStyle: CSSProperties = {
  display: "grid",
  gap: 3,
  minWidth: 0,
};

const cardTitleStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.2,
};

const mutedTextStyle: CSSProperties = {
  color: "var(--st-text-muted)",
  fontSize: 11,
  lineHeight: 1.2,
};

const descriptionStyle: CSSProperties = {
  color: "var(--st-text-muted)",
  fontSize: 12,
  lineHeight: 1.25,
};

const emptyStyle: CSSProperties = {
  padding: 12,
  color: "var(--st-text-muted)",
  border: "1px dashed var(--st-border)",
  borderRadius: 10,
  fontSize: 13,
};
