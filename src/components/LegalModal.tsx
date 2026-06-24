import type { CSSProperties } from "react";
import { useAppLanguage } from "../i18n/i18n";

export type LegalModalType = "impressum" | "privacy" | "cookies";
export type LegalPage = LegalModalType;

type LegalModalProps = {
  type?: LegalModalType | string | null;
  legalType?: LegalModalType | string | null;
  kind?: LegalModalType | string | null;
  onClose?: () => void;
  [key: string]: unknown;
};

export function LegalModal({
  type,
  legalType,
  kind,
  onClose,
}: LegalModalProps) {
  const { t } = useAppLanguage();

  const modalType = normalizeLegalType(type ?? legalType ?? kind);
  const title = getLegalTitle(modalType, t);
  const body = getLegalBody(modalType, t);

  return (
    <div style={backdropStyle}>
      <section style={dialogStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>{title}</h2>

          <button type="button" onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>

        <p style={noticeStyle}>{t("legalPlaceholderNotice")}</p>

        <p style={bodyStyle}>{body}</p>

        <div style={buttonRowStyle}>
          <button type="button" onClick={onClose}>
            {t("close")}
          </button>
        </div>
      </section>
    </div>
  );
}

function normalizeLegalType(value: unknown): LegalModalType {
  if (value === "privacy") return "privacy";
  if (value === "cookies") return "cookies";
  return "impressum";
}

function getLegalTitle(
  type: LegalModalType,
  t: (key: "legalImpressumTitle" | "legalPrivacyTitle" | "legalCookiesTitle") => string
) {
  if (type === "privacy") return t("legalPrivacyTitle");
  if (type === "cookies") return t("legalCookiesTitle");
  return t("legalImpressumTitle");
}

function getLegalBody(
  type: LegalModalType,
  t: (key: "legalImpressumBody" | "legalPrivacyBody" | "legalCookiesBody") => string
) {
  if (type === "privacy") return t("legalPrivacyBody");
  if (type === "cookies") return t("legalCookiesBody");
  return t("legalImpressumBody");
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1350,
  background: "rgba(0,0,0,0.58)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
} satisfies CSSProperties;

const dialogStyle = {
  width: "min(620px, 100%)",
  maxHeight: "min(720px, calc(100vh - 40px))",
  overflowY: "auto",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 12,
  padding: 22,
  boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
} satisfies CSSProperties;

const closeButtonStyle = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: "1px solid var(--st-border)",
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
  cursor: "pointer",
  fontSize: 20,
  lineHeight: 1,
} satisfies CSSProperties;

const noticeStyle = {
  padding: 10,
  borderRadius: 6,
  background: "var(--st-warning-bg)",
  border: "1px solid var(--st-warning-border)",
  fontSize: 13,
  lineHeight: 1.45,
} satisfies CSSProperties;

const bodyStyle = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--st-text)",
} satisfies CSSProperties;

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 18,
} satisfies CSSProperties;