import { useEffect, useState } from "react";
import "./App.css";
import { EditorPage } from "./pages/EditorPage";
import {
  WelcomeModal,
  type AppLanguage,
} from "./components/WelcomeModal";
import {
  CookieBanner,
  type CookieConsentChoice,
} from "./components/CookieBanner";
import {
  LegalModal,
  type LegalModalType,
} from "./components/LegalModal";

const STORAGE_KEYS = {
  language: "streckentool.language",
  welcomeSeen: "streckentool.welcomeSeen",
  cookieConsent: "streckentool.cookieConsent",
};

function App() {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    return stored === "de" || stored === "en" ? stored : "en";
  });

  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.welcomeSeen) !== "true";
  });

  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.cookieConsent) === null;
  });

  const [legalModalType, setLegalModalType] =
    useState<LegalModalType | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  function closeWelcome() {
    localStorage.setItem(STORAGE_KEYS.welcomeSeen, "true");
    setShowWelcome(false);
  }

  function chooseCookieConsent(choice: CookieConsentChoice) {
    localStorage.setItem(STORAGE_KEYS.cookieConsent, choice);
    setShowCookieBanner(false);
  }

  function resetCookieSettings() {
    localStorage.removeItem(STORAGE_KEYS.cookieConsent);
    setShowCookieBanner(true);
  }

  return (
    <>
      <EditorPage />

      <footer style={legalFooterStyle}>
        <button
          onClick={() => setLegalModalType("impressum")}
          style={legalLinkStyle}
        >
          {language === "de" ? "Impressum" : "Impressum"}
        </button>

        <button
          onClick={() => setLegalModalType("privacy")}
          style={legalLinkStyle}
        >
          {language === "de" ? "Datenschutz" : "Privacy"}
        </button>

        <button onClick={resetCookieSettings} style={legalLinkStyle}>
          {language === "de" ? "Cookies" : "Cookies"}
        </button>
      </footer>

      {showWelcome && (
        <WelcomeModal
          language={language}
          onChangeLanguage={setLanguage}
          onClose={closeWelcome}
        />
      )}

      {showCookieBanner && (
        <CookieBanner language={language} onChoose={chooseCookieConsent} />
      )}

      {legalModalType && (
        <LegalModal
          type={legalModalType}
          language={language}
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
} satisfies React.CSSProperties;

const legalLinkStyle = {
  border: "none",
  padding: 0,
  background: "transparent",
  color: "#555",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 12,
} satisfies React.CSSProperties;

export default App;