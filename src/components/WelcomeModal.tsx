import type { CSSProperties } from "react";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  useAppLanguage,
} from "../i18n/i18n";
import { type AppTheme, useAppTheme } from "../theme/theme";

export type { AppLanguage } from "../i18n/i18n";

const WIKI_URL = "https://example.com/wiki-placeholder";
const PAYPAL_URL = "https://example.com/paypal-placeholder";

type WelcomeModalProps = {
  onClose?: () => void;
  [key: string]: unknown;
};

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const { language, setLanguage, t } = useAppLanguage();
  const { theme, setTheme } = useAppTheme();

  return (
    <div style={backdropStyle}>
      <section style={dialogStyle}>
        <h1 style={{ marginTop: 0, marginBottom: 10 }}>
          {t("welcomeTitle")}
        </h1>

        <p style={paragraphStyle}>{t("welcomeIntro")}</p>

        <p style={privacyNoteStyle}>{t("welcomePrivacyNote")}</p>

        <div style={settingsGridStyle}>
          <label style={labelStyle}>
            {t("welcomeLanguageLabel")}
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as AppLanguage)
              }
              style={selectStyle}
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

          <label style={labelStyle}>
            {t("theme")}
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as AppTheme)}
              style={selectStyle}
            >
              <option value="light">{t("lightMode")}</option>
              <option value="dark">{t("darkMode")}</option>
            </select>
          </label>
        </div>

        <div style={linkRowStyle}>
          <a
            href={WIKI_URL}
            target="_blank"
            rel="noreferrer"
            style={secondaryLinkStyle}
          >
            {t("welcomeWikiText")}
          </a>

          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noreferrer"
            style={secondaryLinkStyle}
          >
            {t("welcomeSupportText")}
          </a>
        </div>

        <div style={buttonRowStyle}>
          <button type="button" onClick={onClose} style={primaryButtonStyle}>
            {t("welcomeStart")}
          </button>
        </div>
      </section>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1400,
  background: "rgba(0,0,0,0.58)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
} satisfies CSSProperties;

const dialogStyle = {
  width: "min(560px, 100%)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 12,
  padding: 26,
  boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const paragraphStyle = {
  fontSize: 15,
  lineHeight: 1.55,
  margin: "0 0 14px",
} satisfies CSSProperties;

const privacyNoteStyle = {
  fontSize: 13,
  lineHeight: 1.45,
  margin: "0 0 18px",
  color: "var(--st-text-muted)",
  background: "var(--st-card-soft)",
  border: "1px solid var(--st-border)",
  borderRadius: 6,
  padding: 10,
} satisfies CSSProperties;

const settingsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 16,
} satisfies CSSProperties;

const labelStyle = {
  display: "block",
  fontSize: 14,
} satisfies CSSProperties;

const selectStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 6,
  padding: "7px 8px",
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
} satisfies CSSProperties;

const linkRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 20,
} satisfies CSSProperties;

const secondaryLinkStyle = {
  display: "inline-block",
  padding: "6px 10px",
  border: "1px solid var(--st-border)",
  borderRadius: 6,
  color: "var(--st-text)",
  background: "var(--st-card-soft)",
  textDecoration: "none",
  fontSize: 14,
} satisfies CSSProperties;

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
} satisfies CSSProperties;

const primaryButtonStyle = {
  padding: "8px 14px",
  border: "1px solid var(--st-primary)",
  borderRadius: 6,
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
  fontWeight: 700,
  cursor: "pointer",
} satisfies CSSProperties;