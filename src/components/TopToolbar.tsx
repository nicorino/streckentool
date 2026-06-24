import { useState, type ChangeEvent, type ReactNode } from "react";
import type { ExportFormat } from "../export/getProjectBounds";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  useAppLanguage,
} from "../i18n/i18n";
import { type AppTheme, useAppTheme } from "../theme/theme";

export type EditorTool = "select" | "measure" | "calibrate";

type ToolbarPreset = "plan" | "background" | "export" | "project";

const WIKI_URL = "https://example.com/wiki-placeholder";

type TopToolbarProps = {
  onAddRectangle: () => void;
  onAddText: () => void;
  onImportImageFile: (file: File) => void;
  onImportBackgroundImageFile: (file: File) => void;
  onClearBackgroundImage: () => void;
  hasBackgroundImage: boolean;
  onDeleteSelected: () => void;
  hasSelection: boolean;

  activeTool: EditorTool;
  onChangeActiveTool: (tool: EditorTool) => void;
  onClearMeasurements: () => void;
  hasMeasurements: boolean;

  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;

  onNewProject: () => void;
  onSaveProject: () => void;
  onLoadProjectFile: (file: File) => void;
  onExportPng: () => void;

  exportFormat: ExportFormat;
  onChangeExportFormat: (format: ExportFormat) => void;

  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;

  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  printPreview: boolean;
  onTogglePrintPreview: () => void;

  showHelperLines: boolean;
  onToggleShowHelperLines: () => void;

  onImportCreatorJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TopToolbar({
  onImportCreatorJson,
  onAddRectangle,
  onAddText,
  onImportImageFile,
  onImportBackgroundImageFile,
  onClearBackgroundImage,
  hasBackgroundImage,
  onDeleteSelected,
  hasSelection,
  activeTool,
  onChangeActiveTool,
  onClearMeasurements,
  hasMeasurements,
  snapToGrid,
  onToggleSnapToGrid,
  onNewProject,
  onSaveProject,
  onLoadProjectFile,
  onExportPng,
  exportFormat,
  onChangeExportFormat,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  printPreview,
  onTogglePrintPreview,
  showHelperLines,
  onToggleShowHelperLines,
}: TopToolbarProps) {
  const { language, setLanguage, t } = useAppLanguage();
  const { theme, setTheme } = useAppTheme();
  const [activePreset, setActivePreset] = useState<ToolbarPreset>("plan");

  function handleLoadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onLoadProjectFile(file);
    }

    event.target.value = "";
  }

  function handleImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onImportImageFile(file);
    }

    event.target.value = "";
  }

  function handleBackgroundImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onImportBackgroundImageFile(file);
    }

    event.target.value = "";
  }

  return (
    <header
      style={{
        height: 86,
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid var(--st-border)",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        background: "var(--st-surface)",
        color: "var(--st-text)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 42,
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 8px",
          boxSizing: "border-box",
          borderBottom: "1px solid var(--st-border-soft)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <strong style={{ marginRight: 8 }}>{t("appName")}</strong>

          <PresetButton
            active={activePreset === "plan"}
            onClick={() => setActivePreset("plan")}
          >
            {t("presetPlan")}
          </PresetButton>

          <PresetButton
            active={activePreset === "background"}
            onClick={() => setActivePreset("background")}
          >
            {t("presetBackground")}
          </PresetButton>

          <PresetButton
            active={activePreset === "export"}
            onClick={() => setActivePreset("export")}
          >
            {t("presetExport")}
          </PresetButton>

          <PresetButton
            active={activePreset === "project"}
            onClick={() => setActivePreset("project")}
          >
            {t("presetProject")}
          </PresetButton>
        </div>

        <div style={centerControlsStyle}>
          <div style={zoomClusterStyle}>
            <button onClick={onZoomOut}>−</button>
            <button onClick={onResetZoom}>{zoomPercent}%</button>
            <button onClick={onZoomIn}>+</button>
          </div>

          <div style={historyClusterStyle}>
            <button onClick={onUndo} disabled={!canUndo}>
              {t("undo")}
            </button>

            <button onClick={onRedo} disabled={!canRedo}>
              {t("redo")}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 12 }} />

        <div style={rightControlsStyle}>
          <label style={compactLabelStyle}>
            {t("theme")}
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as AppTheme)}
            >
              <option value="light">{t("lightMode")}</option>
              <option value="dark">{t("darkMode")}</option>
            </select>
          </label>

          <label style={compactLabelStyle}>
            {t("language")}
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as AppLanguage)
              }
            >
              {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
                <option
                  key={supportedLanguage.code}
                  value={supportedLanguage.code}
                >
                  {supportedLanguage.label}
                </option>
              ))}
            </select>
          </label>

          <a
            href={WIKI_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "5px 10px",
              border: "1px solid var(--st-primary)",
              borderRadius: 6,
              background: "var(--st-primary)",
              color: "var(--st-primary-text)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {t("wiki")}
          </a>
        </div>
      </div>

      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 8px",
          boxSizing: "border-box",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {activePreset === "plan" && (
          <>
            <ToolbarSection>
              <button onClick={onAddRectangle}>{t("workspace")}</button>

              <button onClick={onAddText}>{t("text")}</button>

              <label>
                <span style={fileButtonStyle}>{t("imageLogo")}</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageFile}
                  style={{ display: "none" }}
                />
              </label>
            </ToolbarSection>

            <ToolbarSection>
              <button
                onClick={() => onChangeActiveTool("select")}
                style={{
                  fontWeight: activeTool === "select" ? "bold" : "normal",
                }}
              >
                {t("select")}
              </button>

              <button
                onClick={() => onChangeActiveTool("measure")}
                style={{
                  fontWeight: activeTool === "measure" ? "bold" : "normal",
                }}
              >
                {t("measure")}
              </button>
            </ToolbarSection>

            <ToolbarSection>
              <button onClick={onDeleteSelected} disabled={!hasSelection}>
                {t("deleteSelected")}
              </button>

              <button onClick={onClearMeasurements} disabled={!hasMeasurements}>
                {t("clearMeasurements")}
              </button>
            </ToolbarSection>

            <ToolbarSection>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={onToggleSnapToGrid}
                  style={{ marginRight: 6 }}
                />
                {t("snapToGrid")}
              </label>
            </ToolbarSection>
          </>
        )}

        {activePreset === "background" && (
          <>
            <ToolbarSection>
              <label>
                <span style={fileButtonStyle}>{t("background")}</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleBackgroundImageFile}
                  style={{ display: "none" }}
                />
              </label>

              <button
                onClick={() => onChangeActiveTool("calibrate")}
                disabled={!hasBackgroundImage}
                style={{
                  fontWeight: activeTool === "calibrate" ? "bold" : "normal",
                }}
              >
                {t("calibrate")}
              </button>

              <button
                onClick={onClearBackgroundImage}
                disabled={!hasBackgroundImage}
              >
                {t("clearBackground")}
              </button>
            </ToolbarSection>

            <ToolbarHint>{t("hotkeyHelp")}</ToolbarHint>
          </>
        )}

        {activePreset === "export" && (
          <>
            <ToolbarSection>
              <label style={{ fontSize: 13 }}>
                {t("format")}{" "}
                <select
                  value={exportFormat}
                  onChange={(event) =>
                    onChangeExportFormat(event.target.value as ExportFormat)
                  }
                >
                  <option value="content">{t("formatContent")}</option>
                  <option value="a4-landscape">{t("formatA4Landscape")}</option>
                  <option value="a4-portrait">{t("formatA4Portrait")}</option>
                </select>
              </label>

              <button onClick={onExportPng}>{t("png")}</button>
            </ToolbarSection>

            <ToolbarSection>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={printPreview}
                  onChange={onTogglePrintPreview}
                  style={{ marginRight: 6 }}
                />
                {t("printPreview")}
              </label>

              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={showHelperLines}
                  onChange={onToggleShowHelperLines}
                  disabled={printPreview}
                  style={{ marginRight: 6 }}
                />
                {t("helperLines")}
              </label>
            </ToolbarSection>
          </>
        )}

        {activePreset === "project" && (
          <>
           <ToolbarSection>
             <button onClick={onNewProject}>{t("newProjectShort")}</button>

             <button onClick={onSaveProject}>{t("save")}</button>

              <label>
               <span style={fileButtonStyle}>{t("load")}</span>

                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleLoadFile}
                  style={{ display: "none" }}
               />
             </label>

             <label>
                <span style={fileButtonStyle}>{t("importCreatorJson")}</span>

                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={onImportCreatorJson}
                  style={{ display: "none" }}
                  />
             </label>

             <a
               href="/creator"
                style={{
                 ...fileButtonStyle,
                 textDecoration: "none",
               }}
             >
               {t("creator")}
              </a>
            </ToolbarSection>

           <ToolbarHint>{t("hotkeyHelp")}</ToolbarHint>
          </>
        )}

      </div>
    </header>
  );
}

function PresetButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: active
          ? "1px solid var(--st-primary)"
          : "1px solid var(--st-button-border)",
        background: active ? "var(--st-primary)" : "var(--st-card)",
        color: active ? "var(--st-primary-text)" : "var(--st-text)",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function ToolbarSection({ children }: { children: ReactNode }) {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingRight: 10,
        marginRight: 2,
        borderRight: "1px solid var(--st-border-soft)",
        flexShrink: 0,
      }}
    >
      {children}
    </section>
  );
}

function ToolbarHint({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "var(--st-text-muted)",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </span>
  );
}

const centerControlsStyle = {
  position: "absolute" as const,
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const zoomClusterStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const historyClusterStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  paddingLeft: 16,
  borderLeft: "1px solid var(--st-border-soft)",
};

const rightControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const compactLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  flexShrink: 0,
};

const fileButtonStyle = {
  display: "inline-block",
  padding: "3px 8px",
  border: "1px solid var(--st-button-border)",
  borderRadius: 2,
  background: "var(--st-button-bg)",
  color: "var(--st-button-text)",
  cursor: "pointer",
  fontSize: 13,
};