import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Download,
  FileImage,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  RefreshCw,
  Settings2,
  X,
} from "lucide-react";
import type { ExportFormat } from "../export/getProjectBounds";
import { useAppLanguage } from "../i18n/i18n";

export type ExportFileType = "png" | "pdf";

export type ExportPngOptions = {
  fileName: string;
  pixelRatio: number;
  exportFormat: ExportFormat;
  fileType: ExportFileType;
};

type ExportDialogProps = {
  exportFormat: ExportFormat;
  onChangeExportFormat: (format: ExportFormat) => void;
  printPreview: boolean;
  onTogglePrintPreview: () => void;
  showHelperLines: boolean;
  onToggleShowHelperLines: () => void;
  onCreatePreview: (format: ExportFormat) => Promise<string | null>;
  onExport: (options: ExportPngOptions) => void;
  onClose: () => void;
};

export function ExportDialog({
  exportFormat,
  onChangeExportFormat,
  printPreview,
  onTogglePrintPreview,
  showHelperLines,
  onToggleShowHelperLines,
  onCreatePreview,
  onExport,
  onClose,
}: ExportDialogProps) {
  const { t } = useAppLanguage();

  const defaultFileName = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    return `streckentool-${date}.png`;
  }, []);

  const [fileName, setFileName] = useState(defaultFileName);
  const [pixelRatio, setPixelRatio] = useState(3);
  const [fileType, setFileType] = useState<ExportFileType>("png");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function refreshPreview() {
      setIsPreviewLoading(true);
      setPreviewError(false);

      try {
        const nextPreviewSrc = await onCreatePreview(exportFormat);

        if (!cancelled) {
          setPreviewSrc(nextPreviewSrc);
          setPreviewError(nextPreviewSrc === null);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setPreviewSrc(null);
          setPreviewError(true);
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    }

    void refreshPreview();

    return () => {
      cancelled = true;
    };
  }, [exportFormat, onCreatePreview, previewVersion, printPreview, showHelperLines]);

  function changeFileType(nextFileType: ExportFileType) {
    setFileType(nextFileType);
    setFileName((currentFileName) =>
      normalizeExportFileName(currentFileName || defaultFileName, nextFileType)
    );
  }

  function handleExport() {
    onExport({
      fileName: normalizeExportFileName(fileName || defaultFileName, fileType),
      pixelRatio,
      exportFormat,
      fileType,
    });

    onClose();
  }

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <section style={dialogStyle}>
        <header style={headerStyle}>
          <div style={titleGroupStyle}>
            <FileImage size={20} strokeWidth={2.3} />
            <div>
              <h2 style={titleStyle}>{t("exportDialogTitle")}</h2>
              <p style={subtitleStyle}>{t("exportDialogSubtitle")}</p>
            </div>
          </div>

          <button type="button" onClick={onClose} style={closeButtonStyle}>
            <X size={18} strokeWidth={2.4} />
          </button>
        </header>

        <div style={contentStyle}>
          <section style={previewSectionStyle}>
            <SectionTitle icon={ImageIcon}>{t("exportPreview")}</SectionTitle>

            <div style={previewFrameStyle}>
              {previewSrc && !previewError && (
                <img
                  src={previewSrc}
                  alt={t("exportPreview")}
                  style={previewImageStyle}
                />
              )}

              {isPreviewLoading && (
                <div style={previewOverlayStyle}>
                  <RefreshCw size={18} strokeWidth={2.3} />
                  <span>{t("exportPreviewLoading")}</span>
                </div>
              )}

              {!isPreviewLoading && previewError && (
                <div style={previewOverlayStyle}>
                  <span>{t("exportPreviewUnavailable")}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPreviewVersion((current) => current + 1)}
              style={refreshPreviewButtonStyle}
            >
              <RefreshCw size={14} strokeWidth={2.3} />
              {t("refreshPreview")}
            </button>

            <p style={hintStyle}>{t("exportPreviewHint")}</p>
          </section>

          <section style={sectionStyle}>
            <SectionTitle icon={FileText}>{t("exportFileType")}</SectionTitle>

            <div style={formatGridStyle}>
              <FormatCard
                active={fileType === "png"}
                title={t("exportPngOption")}
                description={t("exportPngHint")}
                onClick={() => changeFileType("png")}
              />

              <FormatCard
                active={fileType === "pdf"}
                title={t("exportPdfOption")}
                description={t("exportPdfHint")}
                onClick={() => changeFileType("pdf")}
              />
            </div>

            <SectionTitle icon={Grid2X2}>{t("exportFormat")}</SectionTitle>

            <div style={formatGridStyle}>
              <FormatCard
                active={exportFormat === "a4-landscape"}
                title={t("formatA4Landscape")}
                description={t("exportA4LandscapeHint")}
                onClick={() => onChangeExportFormat("a4-landscape")}
              />

              <FormatCard
                active={exportFormat === "a4-portrait"}
                title={t("formatA4Portrait")}
                description={t("exportA4PortraitHint")}
                onClick={() => onChangeExportFormat("a4-portrait")}
              />

              <FormatCard
                active={exportFormat === "content"}
                title={t("formatContent")}
                description={t("exportContentHint")}
                onClick={() => onChangeExportFormat("content")}
              />
            </div>
          </section>

          <section style={sectionStyle}>
            <SectionTitle icon={Settings2}>{t("exportOptions")}</SectionTitle>

            <label style={fieldStyle}>
              <span>{t("exportFilename")}</span>
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span>{t("exportQuality")}</span>
              <select
                value={pixelRatio}
                onChange={(event) => setPixelRatio(Number(event.target.value))}
                style={inputStyle}
              >
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
                <option value={4}>4×</option>
              </select>
            </label>

            <div style={toggleGridStyle}>
              <label style={toggleStyle}>
                <input
                  type="checkbox"
                  checked={printPreview}
                  onChange={() => {
                    onTogglePrintPreview();
                    setPreviewVersion((current) => current + 1);
                  }}
                />
                <span>{t("printPreview")}</span>
              </label>

              <label style={toggleStyle}>
                <input
                  type="checkbox"
                  checked={showHelperLines}
                  onChange={() => {
                    onToggleShowHelperLines();
                    setPreviewVersion((current) => current + 1);
                  }}
                  disabled={printPreview}
                />
                <span>{t("helperLines")}</span>
              </label>
            </div>

            <p style={hintStyle}>{t("exportWindowHint")}</p>
          </section>
        </div>

        <footer style={footerStyle}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            {t("cancel")}
          </button>

          <button type="button" onClick={handleExport} style={primaryButtonStyle}>
            <Download size={16} strokeWidth={2.4} />
            {t("exportNow")}
          </button>
        </footer>
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Settings2;
  children: string;
}) {
  return (
    <h3 style={sectionTitleStyle}>
      <Icon size={16} strokeWidth={2.3} />
      {children}
    </h3>
  );
}

function FormatCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...formatCardStyle,
        borderColor: active ? "var(--st-primary)" : "var(--st-border-soft)",
        background: active ? "rgba(25, 118, 210, 0.1)" : "var(--st-card)",
      }}
    >
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}

function normalizeExportFileName(value: string, fileType: ExportFileType) {
  const trimmed = value.trim() || `streckentool.${fileType}`;
  const withoutKnownExtension = trimmed.replace(/\.(png|pdf)$/i, "");

  return `${withoutKnownExtension}.${fileType}`;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.38)",
  padding: 24,
  boxSizing: "border-box",
};

const dialogStyle: CSSProperties = {
  width: "min(980px, calc(100vw - 48px))",
  maxHeight: "calc(100vh - 48px)",
  display: "flex",
  flexDirection: "column",
  borderRadius: 14,
  border: "1px solid var(--st-border)",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.42)",
  fontFamily: "sans-serif",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "18px 20px",
  borderBottom: "1px solid var(--st-border-soft)",
};

const titleGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
};

const subtitleStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--st-text-muted)",
  fontSize: 13,
};

const closeButtonStyle: CSSProperties = {
  width: 34,
  height: 34,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const contentStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr 0.9fr",
  gap: 18,
  padding: 20,
  overflowY: "auto",
};

const previewSectionStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  alignContent: "start",
};

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  alignContent: "start",
};

const sectionTitleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: "4px 0 0",
  fontSize: 14,
  color: "var(--st-text)",
};

const previewFrameStyle: CSSProperties = {
  position: "relative",
  height: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 10,
  borderRadius: 12,
  border: "1px solid var(--st-border-soft)",
  background:
    "linear-gradient(45deg, var(--st-card-soft) 25%, transparent 25%), linear-gradient(-45deg, var(--st-card-soft) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--st-card-soft) 75%), linear-gradient(-45deg, transparent 75%, var(--st-card-soft) 75%)",
  backgroundSize: "18px 18px",
  backgroundPosition: "0 0, 0 9px, 9px -9px, -9px 0px",
  overflow: "hidden",
};

const previewImageStyle: CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  borderRadius: 6,
  boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
  background: "#fff",
};

const previewOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "rgba(0,0,0,0.08)",
  color: "var(--st-text-muted)",
  fontSize: 13,
  fontWeight: 700,
};

const refreshPreviewButtonStyle: CSSProperties = {
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontWeight: 700,
};

const formatGridStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const formatCardStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  textAlign: "left",
  padding: "12px 13px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 10,
  color: "var(--st-text)",
  cursor: "pointer",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  fontSize: 13,
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: 34,
  boxSizing: "border-box",
  padding: "0 9px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 8,
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const toggleGridStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const toggleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 9px",
  border: "1px solid var(--st-border-soft)",
  borderRadius: 8,
  background: "var(--st-card)",
  fontSize: 13,
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: "var(--st-text-muted)",
  fontSize: 12,
  lineHeight: 1.4,
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  padding: "14px 20px",
  borderTop: "1px solid var(--st-border-soft)",
};

const secondaryButtonStyle: CSSProperties = {
  height: 36,
  padding: "0 14px",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontWeight: 700,
};

const primaryButtonStyle: CSSProperties = {
  height: 36,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "0 15px",
  borderRadius: 8,
  border: "1px solid var(--st-primary)",
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
  fontWeight: 800,
};
