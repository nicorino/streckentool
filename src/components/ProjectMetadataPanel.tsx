import { useState, type ChangeEvent, type CSSProperties } from "react";
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

  async function handleLogoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const src = await readFileAsDataUrl(file);

      onUpdateMetadata({
        projectLogoSrc: src,
        projectLogoName: file.name,
      });
    } finally {
      event.target.value = "";
    }
  }

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
          <SectionTitle>{t("projectBasics")}</SectionTitle>

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

          <SectionTitle>{t("projectPeople")}</SectionTitle>

          <TextInput
            label={t("author")}
            value={metadata.authorName}
            onChange={(value) => onUpdateMetadata({ authorName: value })}
          />

          <TextInput
            label={t("observer")}
            value={metadata.observerName}
            onChange={(value) => onUpdateMetadata({ observerName: value })}
          />

          <TextInput
            label={t("insuranceNumber")}
            value={metadata.insuranceNumber}
            onChange={(value) =>
              onUpdateMetadata({ insuranceNumber: value })
            }
          />

          <SectionTitle>{t("projectLogo")}</SectionTitle>

          {metadata.projectLogoName ? (
            <>
              <div style={logoInfoStyle}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {metadata.projectLogoName}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateMetadata({
                      projectLogoSrc: "",
                      projectLogoName: "",
                    })
                  }
                >
                  {t("removeProjectLogo")}
                </button>
              </div>

              <NumberInput
                label={`${t("projectLogoWidth")} (px)`}
                value={metadata.projectLogoWidth}
                min={40}
                max={300}
                step={5}
                onChange={(value) =>
                  onUpdateMetadata({
                    projectLogoWidth: Math.max(40, Math.min(300, value)),
                  })
                }
              />
            </>
          ) : (
            <p style={hintStyle}>{t("projectLogoHint")}</p>
          )}

          <label>
            <span style={fileButtonStyle}>{t("importProjectLogo")}</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoFile}
              style={{ display: "none" }}
            />
          </label>

          <SectionTitle>{t("exportInformation")}</SectionTitle>

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

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  min = 0,
  max,
  step = 1,
  onChange,
}: NumberInputProps) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isFinite(nextValue)) {
            onChange(Math.max(min, max === undefined ? nextValue : Math.min(max, nextValue)));
          }
        }}
        style={inputStyle}
      />
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 style={sectionTitleStyle}>{children}</h4>;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read logo file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Could not read logo file."));
    };

    reader.readAsDataURL(file);
  });
}

const panelStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 20,
  width: 320,
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
  maxHeight: "calc(100vh - 170px)",
  overflowY: "auto",
};

const sectionTitleStyle: CSSProperties = {
  margin: "14px 0 6px",
  fontSize: 13,
  color: "var(--st-text-muted)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
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

const fileButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  border: "1px solid var(--st-button-border)",
  borderRadius: 4,
  background: "var(--st-button-bg)",
  color: "var(--st-button-text)",
  cursor: "pointer",
  fontSize: 13,
};

const logoInfoStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
  padding: 8,
  border: "1px solid var(--st-border)",
  borderRadius: 6,
  background: "var(--st-card-soft)",
  fontSize: 12,
};

const hintStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 12,
  color: "var(--st-text-muted)",
};
