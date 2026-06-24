import { useState, type CSSProperties } from "react";
import type { ProjectMetadata } from "../types/ProjectMetadata";
import { useAppLanguage } from "../i18n/i18n";

type ProjectMetadataPanelProps = {
  metadata: ProjectMetadata;
  onUpdateMetadata: (patch: Partial<ProjectMetadata>) => void;
};

export function ProjectMetadataPanel({
  metadata,
  onUpdateMetadata,
}: ProjectMetadataPanelProps) {
  const { t } = useAppLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const title = metadata.title.trim() || t("untitledCourse");

  return (
    <section style={panelStyle}>
      <button
        onClick={() => setIsOpen((current) => !current)}
        style={headerButtonStyle}
      >
        <span>
          <strong>{t("projectInfo")}</strong>
          <br />
          <span style={{ fontSize: 12, color: "var(--st-text-muted)" }}>
            {title}
          </span>
        </span>

        <span style={{ fontSize: 16 }}>{isOpen ? "×" : "▾"}</span>
      </button>

      {isOpen && (
        <div style={bodyStyle}>
          <TextInput
            label={t("courseTitle")}
            value={metadata.title}
            onChange={(value) => onUpdateMetadata({ title: value })}
          />

          <TextInput
            label={t("clubOrganisation")}
            value={metadata.clubName}
            onChange={(value) => onUpdateMetadata({ clubName: value })}
          />

          <TextInput
            label={t("eventDate")}
            type="date"
            value={metadata.eventDate}
            onChange={(value) => onUpdateMetadata({ eventDate: value })}
          />

          <TextInput
            label={t("author")}
            value={metadata.authorName}
            onChange={(value) => onUpdateMetadata({ authorName: value })}
          />

          <label style={labelStyle}>
            {t("notes")}
            <textarea
              value={metadata.notes}
              onChange={(event) =>
                onUpdateMetadata({ notes: event.target.value })
              }
              rows={3}
              style={textareaStyle}
            />
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={metadata.showTitleBlock}
              onChange={(event) =>
                onUpdateMetadata({ showTitleBlock: event.target.checked })
              }
              style={{ marginRight: 6 }}
            />
            {t("showMetadataTitleBlock")}
          </label>
        </div>
      )}
    </section>
  );
}

type TextInputProps = {
  label: string;
  value: string;
  type?: "text" | "date";
  onChange: (value: string) => void;
};

function TextInput({ label, value, type = "text", onChange }: TextInputProps) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const panelStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 20,
  width: 280,
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 8,
  boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
  fontFamily: "sans-serif",
  overflow: "hidden",
};

const headerButtonStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  color: "var(--st-text)",
  textAlign: "left",
  cursor: "pointer",
};

const bodyStyle: CSSProperties = {
  padding: "0 12px 12px",
  borderTop: "1px solid var(--st-border-soft)",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginTop: 10,
  fontSize: 13,
  color: "var(--st-text)",
};

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  boxSizing: "border-box",
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};

const textareaStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  boxSizing: "border-box",
  resize: "vertical",
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};

const checkboxLabelStyle: CSSProperties = {
  display: "block",
  marginTop: 12,
  fontSize: 13,
  color: "var(--st-text)",
};