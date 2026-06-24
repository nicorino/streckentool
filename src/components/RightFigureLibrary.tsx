import { useMemo, useState } from "react";
import type { FigureCategory, FigureTemplate } from "../types/Figure";
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

      if (
        selectedCategory !== ALL_CATEGORIES &&
        category !== selectedCategory
      ) {
        return false;
      }

      if (normalizedSearch.length === 0) {
        return true;
      }

      const searchableText = normalizeSearch(
        [template.name, template.description ?? "", category].join(" ")
      );

      return searchableText.includes(normalizedSearch);
    });
  }, [figureTemplates, searchText, selectedCategory]);

  const groupedTemplates = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      templates: filteredTemplates.filter(
        (template) => (template.category ?? "Other") === category
      ),
    })).filter((group) => group.templates.length > 0);
  }, [filteredTemplates]);

  return (
    <aside
      style={{
        width: 280,
        padding: 16,
        borderLeft: "1px solid var(--st-border)",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        overflowY: "auto",
        background: "var(--st-panel)",
        color: "var(--st-text)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{t("figureLibrary")}</h3>

      <label
        style={{
          display: "block",
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {t("search")}
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={t("searchFiguresPlaceholder")}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginTop: 4,
            padding: "6px 8px",
            background: "var(--st-card)",
            color: "var(--st-text)",
            border: "1px solid var(--st-border)",
          }}
        />
      </label>

      <label
        style={{
          display: "block",
          fontSize: 13,
          marginBottom: 14,
        }}
      >
        {t("category")}
        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value as CategoryFilter)
          }
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginTop: 4,
            padding: "6px 8px",
            background: "var(--st-card)",
            color: "var(--st-text)",
            border: "1px solid var(--st-border)",
          }}
        >
          <option value={ALL_CATEGORIES}>{t("allCategories")}</option>

          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {getCategoryLabel(category, t)}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "var(--st-text-muted)",
          marginBottom: 10,
        }}
      >
        <span>
          {filteredTemplates.length}{" "}
          {filteredTemplates.length === 1
            ? t("figureSingular")
            : t("figurePlural")}
        </span>

        {(searchText.trim() || selectedCategory !== ALL_CATEGORIES) && (
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setSelectedCategory(ALL_CATEGORIES);
            }}
            style={{
              fontSize: 12,
              padding: "2px 6px",
            }}
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {groupedTemplates.length === 0 && (
        <p
          style={{
            fontSize: 14,
            color: "var(--st-text-muted)",
            marginTop: 18,
          }}
        >
          {t("noFiguresMatch")}
        </p>
      )}

      {groupedTemplates.map((group) => (
        <section key={group.category} style={{ marginBottom: 18 }}>
          <h4
            style={{
              margin: "10px 0 8px",
              fontSize: 12,
              color: "var(--st-text-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              borderBottom: "1px solid var(--st-border-soft)",
              paddingBottom: 4,
            }}
          >
            {getCategoryLabel(group.category, t)}
          </h4>

          <div style={{ display: "grid", gap: 8 }}>
            {group.templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onAddFigure(template.id)}
                style={{
                  textAlign: "left",
                  padding: 10,
                  border: "1px solid var(--st-border)",
                  borderRadius: 6,
                  background: "var(--st-card)",
                  color: "var(--st-text)",
                  cursor: "pointer",
                }}
              >
                <strong>{template.name}</strong>

                {template.description && (
                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 12,
                      color: "var(--st-text-muted)",
                      lineHeight: 1.3,
                    }}
                  >
                    {template.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}

function getCategoryLabel(
  category: FigureCategory,
  t: (key: TranslationKey) => string
) {
  switch (category) {
    case "Basic":
      return t("categoryBasic");
    case "Slalom":
      return t("categorySlalom");
    case "Gates":
      return t("categoryGates");
    case "Boxes":
      return t("categoryBoxes");
    case "Custom":
      return t("categoryCustom");
    case "Other":
      return t("categoryOther");
  }
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}