import { useState, type ChangeEvent, type ReactNode } from "react";
import type { ExportFormat } from "../export/getProjectBounds";
import type { ArrowKind } from "../types/Decoration";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  useAppLanguage,
} from "../i18n/i18n";
import { type AppTheme, useAppTheme } from "../theme/theme";

export type EditorTool = "select" | "measure" | "calibrate";

type ToolbarPreset = "plan" | "background" | "export" | "project";

const WIKI_URL = "https://example.com/wiki-placeholder";
const PAYPAL_URL = "https://example.com/paypal-placeholder";

type TopToolbarProps = {
  onAddRectangle: () => void;
  onAddText: () => void;
  onAddArrow: (arrowKind: ArrowKind) => void;
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
  onAddArrow,
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
    <header style={toolbarStyle}>
      <div title={t("appName")} style={toolbarLogoAreaStyle}>
        <img
          src="/streckentool-logo.png"
          alt={t("appName")}
          style={toolbarLogoImageStyle}
        />
      </div>

      <div style={topRowStyle}>
        <div style={leftControlsStyle}>
          <ToolbarSection>
            <ToolButton
              active={activeTool === "select"}
              onClick={() => onChangeActiveTool("select")}
            >
              {t("select")}
            </ToolButton>

            <ToolButton
              active={activeTool === "measure"}
              onClick={() => onChangeActiveTool("measure")}
            >
              {t("measure")}
            </ToolButton>

            <button onClick={onClearMeasurements} disabled={!hasMeasurements}>
              {t("clearMeasurements")}
            </button>
          </ToolbarSection>

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

          <ToolbarLink href={WIKI_URL}>{t("wiki")}</ToolbarLink>
          <ToolbarLink href={PAYPAL_URL}>{t("support")}</ToolbarLink>
        </div>
      </div>

      <div style={subRowStyle}>
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
              <button onClick={() => onAddArrow("straight")}>
                {t("arrowStraight")}
              </button>

              <button onClick={() => onAddArrow("straight-long")}>
                {t("arrowLong")}
              </button>

              <button onClick={() => onAddArrow("curve-right")}>
                {t("arrowCurveRight")}
              </button>

              <button onClick={() => onAddArrow("curve-left")}>
                {t("arrowCurveLeft")}
              </button>
            </ToolbarSection>

            <ToolbarSection>
              <button onClick={onDeleteSelected} disabled={!hasSelection}>
                {t("deleteSelected")}
              </button>
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

function ToolButton({
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
        fontWeight: active ? 700 : 500,
        borderColor: active ? "var(--st-primary)" : "var(--st-button-border)",
      }}
    >
      {children}
    </button>
  );
}

function ToolbarSection({ children }: { children: ReactNode }) {
  return (
    <section style={toolbarSectionStyle}>
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

function ToolbarLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={toolbarLinkStyle}>
      {children}
    </a>
  );
}

const toolbarStyle = {
  height: 94,
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  borderBottom: "1px solid var(--st-border)",
  boxSizing: "border-box" as const,
  fontFamily: "sans-serif",
  background: "var(--st-surface)",
  color: "var(--st-text)",
  overflow: "hidden",
};

const toolbarLogoAreaStyle = {
  position: "absolute" as const,
  left: 0,
  top: 0,
  width: 270,
  height: 94,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  boxSizing: "border-box" as const,
  padding: "6px 24px 6px 10px",
  border: "none",
  background:
    "linear-gradient(90deg, #1b1c20 0%, #1b1c20 48%, rgba(27, 28, 32, 0.96) 58%, rgba(27, 28, 32, 0.65) 76%, rgba(27, 28, 32, 0.22) 90%, var(--st-surface) 100%)",
  overflow: "hidden",
  flexShrink: 0,
  textDecoration: "none",
  zIndex: 2,
};

const toolbarLogoImageStyle = {
  display: "block",
  width: 150,
  height: 82,
  objectFit: "contain" as const,
};

const topRowStyle = {
  height: 47,
  marginLeft: 270,
  width: "calc(100% - 270px)",
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 8px",
  boxSizing: "border-box" as const,
  borderBottom: "1px solid var(--st-border-soft)",
  minWidth: 0,
};

const subRowStyle = {
  height: 47,
  marginLeft: 270,
  width: "calc(100% - 270px)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "5px 8px",
  boxSizing: "border-box" as const,
  overflow: "hidden",
  whiteSpace: "nowrap" as const,
};

const leftControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
};

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

const toolbarSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  paddingRight: 10,
  marginRight: 2,
  borderRight: "1px solid var(--st-border-soft)",
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

const toolbarLinkStyle = {
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
};
