import { useState, type CSSProperties } from "react";
import { useAppLanguage } from "../i18n/i18n";

export type CookieConsentChoice = "accepted" | "declined" | "necessary";

const COOKIE_CONSENT_STORAGE_KEY = "streckentool-cookie-consent";

type CookieBannerProps = {
  [key: string]: unknown;
};

export function CookieBanner(_props: CookieBannerProps) {
  const { t } = useAppLanguage();

  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) !== "accepted";
  });

  if (!isVisible) {
    return null;
  }

  function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    setIsVisible(false);
  }

  return (
    <section style={bannerStyle}>
      <div>
        <strong>{t("cookiesTitle")}</strong>
        <p style={textStyle}>{t("cookieBannerText")}</p>
      </div>

      <button type="button" onClick={acceptCookies} style={buttonStyle}>
        {t("acceptCookies")}
      </button>
    </section>
  );
}

const bannerStyle = {
  position: "fixed",
  left: 16,
  right: 16,
  bottom: 16,
  zIndex: 1300,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: 14,
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 10,
  boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const textStyle = {
  margin: "4px 0 0",
  fontSize: 13,
  lineHeight: 1.4,
  color: "var(--st-text-muted)",
} satisfies CSSProperties;

const buttonStyle = {
  flexShrink: 0,
  padding: "7px 12px",
  border: "1px solid var(--st-primary)",
  borderRadius: 6,
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
  fontWeight: 700,
  cursor: "pointer",
} satisfies CSSProperties;