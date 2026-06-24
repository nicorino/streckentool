import type { CSSProperties } from "react";
import { useAppLanguage } from "../i18n/i18n";

type NewProjectDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function NewProjectDialog({
  onConfirm,
  onCancel,
}: NewProjectDialogProps) {
  const { t } = useAppLanguage();

  return (
    <div style={backdropStyle}>
      <section style={dialogStyle}>
        <h2 style={{ marginTop: 0 }}>{t("newProjectTitle")}</h2>

        <p style={{ fontSize: 14, lineHeight: 1.45 }}>
          {t("newProjectBody")}
        </p>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.45,
            color: "var(--st-danger)",
          }}
        >
          {t("unsavedWorkLost")}
        </p>

        <div style={buttonRowStyle}>
          <button type="button" onClick={onCancel}>
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: "var(--st-danger)",
              color: "#fff",
              border: "1px solid var(--st-danger-dark)",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {t("createNewProject")}
          </button>
        </div>
      </section>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  background: "rgba(0,0,0,0.58)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
} satisfies CSSProperties;

const dialogStyle = {
  width: "min(420px, 100%)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 10,
  padding: 22,
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  marginTop: 18,
} satisfies CSSProperties;