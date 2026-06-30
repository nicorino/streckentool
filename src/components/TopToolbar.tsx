import { useState, type ChangeEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Crosshair,
  Download,
  Eye,
  FileJson,
  FilePlus2,
  FolderOpen,
  Grid2X2,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  ImagePlus,
  Languages,
  Map,
  Minus,
  MousePointer2,
  Palette,
  Plus,
  Redo2,
  RotateCcw,
  Ruler,
  Save,
  Square,
  Trash2,
  Type,
  Undo2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import type { ExportFormat } from "../export/getProjectBounds";
import type { ArrowKind } from "../types/Decoration";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  useAppLanguage,
} from "../i18n/i18n";
import { type AppTheme, useAppTheme } from "../theme/theme";
import { ExportDialog, type ExportPngOptions } from "./ExportDialog";

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
  onExportPng: (options: ExportPngOptions) => void;
  onCreateExportPreview: (format: ExportFormat) => Promise<string | null>;

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

  hasUnsavedChanges: boolean;
  onStartTutorial: () => void;
  onImportCreatorJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TopToolbar({
  onImportCreatorJson,
  onStartTutorial,
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
  onCreateExportPreview,
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
  hasUnsavedChanges,
}: TopToolbarProps) {
  const { language, setLanguage, t } = useAppLanguage();
  const { theme, setTheme } = useAppTheme();
  const [activePreset, setActivePreset] = useState<ToolbarPreset>("plan");
  const [showExportDialog, setShowExportDialog] = useState(false);

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

  function handleArrowSelect(event: ChangeEvent<HTMLSelectElement>) {
    const arrowKind = event.target.value as ArrowKind | "";

    if (!arrowKind) {
      return;
    }

    onAddArrow(arrowKind);
    event.target.value = "";
  }

  return (
    <>
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
          <PresetButton
            icon={Map}
            tutorialTarget="tutorial-course-tab"
            active={activePreset === "plan"}
            onClick={() => setActivePreset("plan")}
          >
            {t("presetPlan")}
          </PresetButton>

          <PresetButton
            icon={ImageIcon}
            active={activePreset === "background"}
            onClick={() => setActivePreset("background")}
          >
            {t("presetBackground")}
          </PresetButton>

          <PresetButton
            icon={Download}
            tutorialTarget="tutorial-export-tab"
            active={activePreset === "export"}
            onClick={() => setActivePreset("export")}
          >
            {t("presetExport")}
          </PresetButton>

          <PresetButton
            icon={FolderOpen}
            active={activePreset === "project"}
            onClick={() => setActivePreset("project")}
          >
            {t("presetProject")}
          </PresetButton>
        </div>

        <div style={centerControlsStyle}>
          <ToolbarSection compact>
            <IconOnlyButton
              icon={Minus}
              title="Zoom out"
              onClick={onZoomOut}
            />

            <button
              type="button"
              onClick={onResetZoom}
              style={zoomButtonStyle}
              title="Reset zoom"
            >
              {zoomPercent}%
            </button>

            <IconOnlyButton icon={Plus} title="Zoom in" onClick={onZoomIn} />
          </ToolbarSection>

          <ToolbarSection compact>
            <IconToolbarButton
              icon={Undo2}
              onClick={onUndo}
              disabled={!canUndo}
              title={t("undo")}
            >
              {t("undo")}
            </IconToolbarButton>

            <IconToolbarButton
              icon={Redo2}
              onClick={onRedo}
              disabled={!canRedo}
              title={t("redo")}
            >
              {t("redo")}
            </IconToolbarButton>
          </ToolbarSection>
        </div>

        <div style={{ flex: 1, minWidth: 12 }} />

        <div style={rightControlsStyle}>
          <label style={compactLabelStyle} title={t("theme")}>
            <Palette size={14} strokeWidth={2} />
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as AppTheme)}
              style={compactSelectStyle}
            >
              <option value="light">{t("lightMode")}</option>
              <option value="dark">{t("darkMode")}</option>
            </select>
          </label>

          <label style={compactLabelStyle} title={t("language")}>
            <Languages size={14} strokeWidth={2} />
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as AppLanguage)
              }
              style={compactSelectStyle}
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

          <button
            type="button"
            onClick={onStartTutorial}
            style={toolbarLinkStyle}
            data-tutorial-target="tutorial-start-button"
          >
            <HelpCircle size={14} strokeWidth={2.2} />
            <span>{t("tutorial")}</span>
          </button>

          <ToolbarLink href={WIKI_URL} icon={BookOpen}>
            {t("wiki")}
          </ToolbarLink>

          <ToolbarLink href={PAYPAL_URL} icon={Heart}>
            {t("support")}
          </ToolbarLink>
        </div>
      </div>

      <div style={subRowStyle}>
        {activePreset === "plan" && (
          <>
            <ToolbarSection>
              <IconToolbarButton
                icon={MousePointer2}
                active={activeTool === "select"}
                onClick={() => onChangeActiveTool("select")}
                title={t("select")}
              >
                {t("select")}
              </IconToolbarButton>

              <IconToolbarButton
                icon={Ruler}
                active={activeTool === "measure"}
                onClick={() => onChangeActiveTool("measure")}
                title={t("measure")}
              >
                {t("measure")}
              </IconToolbarButton>

              <IconToolbarButton
                icon={Trash2}
                onClick={onClearMeasurements}
                disabled={!hasMeasurements}
                title={t("clearMeasurements")}
              >
                {t("clearMeasurements")}
              </IconToolbarButton>
            </ToolbarSection>

            <ToolbarSection>
              <IconToolbarButton
                icon={Square}
                tutorialTarget="tutorial-course-area-button"
                onClick={onAddRectangle}
                title={t("workspace")}
              >
                {t("workspace")}
              </IconToolbarButton>

              <IconToolbarButton icon={Type} onClick={onAddText} title={t("text")}>
                {t("text")}
              </IconToolbarButton>

              <IconFileButton
                icon={ImagePlus}
                label={t("imageLogo")}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleImageFile}
              />
            </ToolbarSection>

            <ToolbarSection>
              <label style={toolbarSelectLabelStyle} title={t("arrowStraight")}>
                <ArrowRight size={15} strokeWidth={2.2} />
                <select
                  defaultValue=""
                  onChange={handleArrowSelect}
                  style={toolbarSelectStyle}
                >
                  <option value="" disabled>
                    {t("arrowStraight")}…
                  </option>
                  <option value="straight">{t("arrowStraight")}</option>
                  <option value="straight-long">{t("arrowLong")}</option>
                  <option value="curve-right">{t("arrowCurveRight")}</option>
                  <option value="curve-left">{t("arrowCurveLeft")}</option>
                </select>
                <ChevronDown size={13} strokeWidth={2.2} />
              </label>
            </ToolbarSection>

            <ToolbarSection>
              <IconToolbarButton
                icon={Trash2}
                onClick={onDeleteSelected}
                disabled={!hasSelection}
                danger
                title={t("deleteSelected")}
              >
                {t("deleteSelected")}
              </IconToolbarButton>
            </ToolbarSection>
          </>
        )}

        {activePreset === "background" && (
          <>
            <ToolbarSection>
              <IconFileButton
                icon={Upload}
                label={t("background")}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleBackgroundImageFile}
              />

              <IconToolbarButton
                icon={Crosshair}
                onClick={() => onChangeActiveTool("calibrate")}
                disabled={!hasBackgroundImage}
                active={activeTool === "calibrate"}
                title={t("calibrate")}
              >
                {t("calibrate")}
              </IconToolbarButton>

              <IconToolbarButton
                icon={Trash2}
                onClick={onClearBackgroundImage}
                disabled={!hasBackgroundImage}
                danger
                title={t("clearBackground")}
              >
                {t("clearBackground")}
              </IconToolbarButton>
            </ToolbarSection>

            <ToolbarHint>{t("hotkeyHelp")}</ToolbarHint>
          </>
        )}

        {activePreset === "export" && (
          <>
            <ToolbarSection>
              <IconToolbarButton
                icon={Download}
                tutorialTarget="tutorial-export-settings-button"
                onClick={() => setShowExportDialog(true)}
                title={t("exportSettings")}
              >
                {t("exportSettings")}
              </IconToolbarButton>
            </ToolbarSection>

            <ToolbarSection>
              <IconToggle
                icon={Eye}
                checked={printPreview}
                onChange={onTogglePrintPreview}
              >
                {t("printPreview")}
              </IconToggle>

              <IconToggle
                icon={Grid2X2}
                checked={showHelperLines}
                onChange={onToggleShowHelperLines}
                disabled={printPreview}
              >
                {t("helperLines")}
              </IconToggle>
            </ToolbarSection>

            <ToolbarHint>{t("exportToolbarHint")}</ToolbarHint>
          </>
        )}

        {activePreset === "project" && (
          <>
            <ToolbarSection>
              <IconToolbarButton
                icon={FilePlus2}
                onClick={onNewProject}
                title={t("newProjectShort")}
              >
                {t("newProjectShort")}
              </IconToolbarButton>

              <IconToolbarButton icon={Save} onClick={onSaveProject} title={t("saveProjectFile")}>
                {t("save")}
              </IconToolbarButton>

              <IconFileButton
                icon={FolderOpen}
                label={t("loadProjectFile")}
                accept="application/json,.json"
                onChange={handleLoadFile}
              />

              <IconFileButton
                icon={FileJson}
                label={t("importCreatorJson")}
                accept="application/json,.json"
                onChange={onImportCreatorJson}
              />

              <a
                href="/creator"
                style={toolbarButtonStyle}
                onClick={(event) => {
                  if (
                    hasUnsavedChanges &&
                    !window.confirm(t("unsavedLeaveWarning"))
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <RotateCcw size={15} strokeWidth={2.2} />
                <span>{t("figureCreator")}</span>
              </a>
            </ToolbarSection>

            <ToolbarHint>{t("hotkeyHelp")}</ToolbarHint>
          </>
        )}
      </div>
    </header>

    {showExportDialog && (
      <ExportDialog
        exportFormat={exportFormat}
        onChangeExportFormat={onChangeExportFormat}
        printPreview={printPreview}
        onTogglePrintPreview={onTogglePrintPreview}
        showHelperLines={showHelperLines}
        onToggleShowHelperLines={onToggleShowHelperLines}
        onExport={onExportPng}
        onCreatePreview={onCreateExportPreview}
        onClose={() => setShowExportDialog(false)}
      />
    )}
    </>
  );
}

function PresetButton({
  active,
  icon: Icon,
  tutorialTarget,
  onClick,
  children,
}: {
  active: boolean;
  icon: LucideIcon;
  tutorialTarget?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-tutorial-target={tutorialTarget}
      style={getPresetButtonStyle(active)}
    >
      <Icon size={15} strokeWidth={2.2} />
      <span>{children}</span>
    </button>
  );
}

function IconToolbarButton({
  active = false,
  danger = false,
  disabled = false,
  icon: Icon,
  tutorialTarget,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  tutorialTarget?: string;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      data-tutorial-target={tutorialTarget}
      style={getToolbarButtonStyle({ active, danger, disabled })}
    >
      <Icon size={15} strokeWidth={2.2} />
      <span>{children}</span>
    </button>
  );
}

function IconOnlyButton({
  disabled = false,
  icon: Icon,
  onClick,
  title,
}: {
  disabled?: boolean;
  icon: LucideIcon;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={iconOnlyButtonStyle}
    >
      <Icon size={14} strokeWidth={2.4} />
    </button>
  );
}

function IconFileButton({
  icon: Icon,
  label,
  accept,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  accept: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label style={toolbarButtonStyle} title={label}>
      <Icon size={15} strokeWidth={2.2} />
      <span>{label}</span>

      <input
        type="file"
        accept={accept}
        onChange={onChange}
        style={{ display: "none" }}
      />
    </label>
  );
}

function IconToggle({
  checked,
  disabled = false,
  icon: Icon,
  onChange,
  children,
}: {
  checked: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      style={getToolbarButtonStyle({
        active: checked,
        disabled,
      })}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ display: "none" }}
      />
      <Icon size={15} strokeWidth={2.2} />
      <span>{children}</span>
    </label>
  );
}

function ToolbarSection({
  compact = false,
  children,
}: {
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <section style={compact ? compactToolbarSectionStyle : toolbarSectionStyle}>
      {children}
    </section>
  );
}

function ToolbarHint({ children }: { children: ReactNode }) {
  return <span style={toolbarHintStyle}>{children}</span>;
}

function ToolbarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={toolbarLinkStyle}>
      <Icon size={14} strokeWidth={2.2} />
      <span>{children}</span>
    </a>
  );
}

function getPresetButtonStyle(active: boolean) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 29,
    padding: "0 12px",
    borderRadius: 999,
    border: active
      ? "1px solid var(--st-primary)"
      : "1px solid var(--st-border-soft)",
    background: active ? "var(--st-primary)" : "var(--st-card)",
    color: active ? "var(--st-primary-text)" : "var(--st-text)",
    fontWeight: active ? 700 : 600,
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: active ? "0 2px 8px rgba(25,118,210,0.24)" : "none",
  };
}

function getToolbarButtonStyle({
  active = false,
  danger = false,
  disabled = false,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
} = {}) {
  return {
    ...toolbarButtonStyle,
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    borderColor: active
      ? "var(--st-primary)"
      : danger
        ? "var(--st-danger)"
        : "var(--st-border-soft)",
    background: active
      ? "rgba(25, 118, 210, 0.12)"
      : danger
        ? "rgba(198, 40, 40, 0.07)"
        : "var(--st-card)",
    color: danger ? "var(--st-danger)" : "var(--st-text)",
    fontWeight: active ? 700 : 600,
  };
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
  gap: 12,
};

const rightControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
};

const compactLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  height: 28,
  padding: "0 8px",
  borderRadius: 7,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  fontSize: 12,
  flexShrink: 0,
};

const compactSelectStyle = {
  height: 22,
  border: "none",
  background: "transparent",
  fontSize: 12,
};

const toolbarSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  paddingRight: 10,
  marginRight: 2,
  borderRight: "1px solid var(--st-border-soft)",
  flexShrink: 0,
};

const compactToolbarSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  paddingRight: 10,
  marginRight: 2,
  borderRight: "1px solid var(--st-border-soft)",
  flexShrink: 0,
};

const toolbarButtonStyle = {
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  boxSizing: "border-box" as const,
  padding: "0 10px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 7,
  background: "var(--st-card)",
  color: "var(--st-text)",
  textDecoration: "none",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1,
  flexShrink: 0,
};

const iconOnlyButtonStyle = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 7,
  background: "var(--st-card)",
  color: "var(--st-text)",
  cursor: "pointer",
  flexShrink: 0,
};

const zoomButtonStyle = {
  height: 28,
  minWidth: 58,
  padding: "0 8px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 7,
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontSize: 12,
  fontWeight: 700,
};

const toolbarSelectLabelStyle = {
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  boxSizing: "border-box" as const,
  padding: "0 8px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 7,
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontSize: 13,
  fontWeight: 600,
  flexShrink: 0,
};

const toolbarSelectStyle = {
  height: 24,
  minWidth: 92,
  border: "none",
  background: "transparent",
  color: "var(--st-text)",
  fontSize: 13,
  fontWeight: 600,
  outline: "none",
  cursor: "pointer",
};

const toolbarHintStyle = {
  fontSize: 12,
  color: "var(--st-text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const toolbarLinkStyle = {
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "0 10px",
  border: "1px solid var(--st-primary)",
  borderRadius: 7,
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
};
