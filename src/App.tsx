import { useState, type CSSProperties } from "react";
import "./App.css";
import { EditorPage } from "./pages/EditorPage";
import { FigureCreatorPage } from "./pages/FigureCreatorPage";
import { WelcomeModal } from "./components/WelcomeModal";
import { CookieBanner } from "./components/CookieBanner";
import { LegalModal, type LegalModalType } from "./components/LegalModal";
import { useAppLanguage } from "./i18n/i18n";

const STORAGE_KEYS = {
  welcomeSeen: "streckentool.welcomeSeen",

  // Current cookie banner key
  cookieConsent: "streckentool-cookie-consent",

  // Old key from the previous App.tsx version, kept so reset still cleans it up
  cookieConsentLegacy: "streckentool.cookieConsent",
};

function App() {
  const { language } = useAppLanguage();

  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.welcomeSeen) !== "true";
  });

  const [cookieBannerResetKey, setCookieBannerResetKey] = useState(0);

  const [legalModalType, setLegalModalType] =
    useState<LegalModalType | null>(null);

  const isCreatorRoute =
    window.location.pathname.startsWith("/creator") ||
    window.location.hostname.startsWith("creator.");

  function closeWelcome() {
    localStorage.setItem(STORAGE_KEYS.welcomeSeen, "true");
    setShowWelcome(false);
  }

  function resetCookieSettings() {
    localStorage.removeItem(STORAGE_KEYS.cookieConsent);
    localStorage.removeItem(STORAGE_KEYS.cookieConsentLegacy);

    // Remount CookieBanner so it re-checks localStorage and appears again.
    setCookieBannerResetKey((current) => current + 1);
  }

  return (
    <>
      {isCreatorRoute ? <FigureCreatorPage /> : <EditorPage />}

      <footer style={legalFooterStyle}>
        <button
          type="button"
          onClick={() => setLegalModalType("impressum")}
          style={legalLinkStyle}
        >
          Impressum
        </button>

        <button
          type="button"
          onClick={() => setLegalModalType("privacy")}
          style={legalLinkStyle}
        >
          {language === "de" ? "Datenschutz" : "Privacy"}
        </button>

        <button
          type="button"
          onClick={resetCookieSettings}
          style={legalLinkStyle}
        >
          Cookies
        </button>
      </footer>

      {showWelcome && <WelcomeModal onClose={closeWelcome} />}

      <CookieBanner key={cookieBannerResetKey} />

      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </>
  );
}

const legalFooterStyle = {
  position: "fixed",
  right: 12,
  bottom: 8,
  zIndex: 700,
  display: "flex",
  gap: 8,
  padding: "5px 8px",
  borderRadius: 6,
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(0,0,0,0.12)",
  fontFamily: "sans-serif",
  fontSize: 12,
} satisfies CSSProperties;

const legalLinkStyle = {
  border: "none",
  padding: 0,
  background: "transparent",
  color: "#555",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 12,
} satisfies CSSProperties;

export default App;