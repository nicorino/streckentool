import type { CSSProperties } from "react";
import {
  BookOpen,
  MousePointer2,
  Play,
  Sparkles,
} from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  useAppLanguage,
} from "../i18n/i18n";

const WIKI_URL = "https://example.com/wiki-placeholder";
const PAYPAL_URL = "https://example.com/paypal-placeholder";

type WelcomeModalProps = {
  onClose?: () => void;
  onDismiss?: () => void;
  onStart?: () => void;
  onContinue?: () => void;
};

export function WelcomeModal({
  onClose,
  onDismiss,
  onStart,
  onContinue,
}: WelcomeModalProps) {
  const { language, setLanguage, t } = useAppLanguage();

  function closeWelcome() {
    onClose?.();
    onDismiss?.();
    onStart?.();
    onContinue?.();
  }

  function startEmptyProject() {
    closeWelcome();
  }

  function loadExampleProject() {
    window.dispatchEvent(new CustomEvent("streckentool-welcome-load-example"));
    closeWelcome();
  }

  function startTutorial() {
    window.dispatchEvent(new CustomEvent("streckentool-welcome-start-tutorial"));
    closeWelcome();
  }

  return (
    <div style={overlayStyle}>
      <section style={dialogStyle}>
        <div style={heroStyle}>
          <img
            src="/streckentool-logo.png"
            alt={t("appName")}
            style={logoStyle}
          />
        </div>

        <div style={contentStyle}>
          <header>
            <h1 style={titleStyle}>{t("welcomeTitle")}</h1>
            <p style={introStyle}>{t("welcomeIntro")}</p>
          </header>

          <div style={choiceGridStyle}>
            <button
              type="button"
              onClick={startEmptyProject}
              style={primaryChoiceStyle}
            >
              <Play size={20} strokeWidth={2.4} />
              <span>
                <strong>{t("welcomeStartEmptyTitle")}</strong>
                <small>{t("welcomeStartEmptyBody")}</small>
              </span>
            </button>

            <button
              type="button"
              onClick={loadExampleProject}
              style={choiceStyle}
            >
              <Sparkles size={20} strokeWidth={2.4} />
              <span>
                <strong>{t("welcomeExampleTitle")}</strong>
                <small>{t("welcomeExampleBody")}</small>
              </span>
            </button>

            <button
              type="button"
              onClick={startTutorial}
              style={choiceStyle}
            >
              <MousePointer2 size={20} strokeWidth={2.4} />
              <span>
                <strong>{t("welcomeTutorialTitle")}</strong>
                <small>{t("welcomeTutorialBody")}</small>
              </span>
            </button>
          </div>

          <p style={privacyStyle}>{t("welcomePrivacyNote")}</p>

          <div style={footerStyle}>
            <label style={languageLabelStyle}>
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

            <div style={linkGroupStyle}>
              <a href={WIKI_URL} target="_blank" rel="noreferrer" style={linkStyle}>
                <BookOpen size={15} strokeWidth={2.3} />
                {t("welcomeWikiText")}
              </a>

              <a
                href={PAYPAL_URL}
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
              >
                {t("welcomeSupportText")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.48)",
  fontFamily: "sans-serif",
};

const dialogStyle: CSSProperties = {
  width: "min(760px, calc(100vw - 48px))",
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  borderRadius: 18,
  border: "1px solid var(--st-border)",
  overflow: "hidden",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
};

const heroStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 430,
  padding: 24,
  background:
    "linear-gradient(135deg, #1b1c20 0%, #1b1c20 55%, rgba(27,28,32,0.86) 100%)",
};

const logoStyle: CSSProperties = {
  width: 180,
  maxWidth: "100%",
  objectFit: "contain",
};

const contentStyle: CSSProperties = {
  padding: 26,
  display: "grid",
  gap: 18,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 26,
  lineHeight: 1.1,
};

const introStyle: CSSProperties = {
  margin: "9px 0 0",
  color: "var(--st-text-muted)",
  fontSize: 14,
  lineHeight: 1.45,
};

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const choiceBaseStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "24px 1fr",
  alignItems: "center",
  gap: 12,
  padding: "13px 14px",
  borderRadius: 12,
  textAlign: "left",
  cursor: "pointer",
};

const primaryChoiceStyle: CSSProperties = {
  ...choiceBaseStyle,
  border: "1px solid var(--st-primary)",
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
};

const choiceStyle: CSSProperties = {
  ...choiceBaseStyle,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const privacyStyle: CSSProperties = {
  margin: 0,
  padding: "10px 12px",
  borderRadius: 10,
  background: "var(--st-card-soft)",
  color: "var(--st-text-muted)",
  fontSize: 12,
  lineHeight: 1.4,
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-end",
};

const languageLabelStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  fontSize: 12,
  fontWeight: 700,
};

const selectStyle: CSSProperties = {
  height: 32,
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const linkGroupStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const linkStyle: CSSProperties = {
  minHeight: 32,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 700,
};
