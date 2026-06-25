import type { CSSProperties } from "react";
import { useAppLanguage } from "../i18n/i18n";
import {
  legalContent,
  type LegalLanguage,
  type LegalModalType,
} from "../legal/legalContent";

export type { LegalModalType } from "../legal/legalContent";

type LegalModalProps = {
  type: LegalModalType;
  onClose: () => void;
};

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { language } = useAppLanguage();
  const legalLanguage: LegalLanguage = language === "de" ? "de" : "en";
  const content = legalContent[legalLanguage][type];

  return (
    <div style={backdropStyle}>
      <section style={dialogStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>{content.title}</h2>
            <p style={updatedStyle}>
              {legalLanguage === "de" ? "Stand" : "Last updated"}:{" "}
              {content.updatedAt}
            </p>
          </div>

          <button type="button" onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          {content.sections.map((section, sectionIndex) => (
            <section key={sectionIndex} style={sectionStyle}>
              {section.heading && (
                <h3 style={sectionHeadingStyle}>{section.heading}</h3>
              )}

              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} style={paragraphStyle}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={onClose}>
            {legalLanguage === "de" ? "Schließen" : "Close"}
          </button>
        </div>
      </section>
    </div>
  );
}

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "rgba(0,0,0,0.58)",
};

const dialogStyle: CSSProperties = {
  width: "min(760px, 100%)",
  maxHeight: "min(780px, 90vh)",
  display: "flex",
  flexDirection: "column",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
  borderRadius: 12,
  boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
  fontFamily: "sans-serif",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "18px 20px",
  borderBottom: "1px solid var(--st-border)",
};

const titleStyle: CSSProperties = {
  margin: 0,
};

const updatedStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--st-text-muted)",
  fontSize: 13,
};

const closeButtonStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "1px solid var(--st-border)",
  background: "var(--st-card-soft)",
  color: "var(--st-text)",
  cursor: "pointer",
  fontSize: 22,
  lineHeight: 1,
};

const bodyStyle: CSSProperties = {
  padding: "0 20px 20px",
  overflowY: "auto",
};

const sectionStyle: CSSProperties = {
  marginTop: 20,
};

const sectionHeadingStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 16,
};

const paragraphStyle: CSSProperties = {
  margin: "0 0 9px",
  fontSize: 14,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "12px 20px",
  borderTop: "1px solid var(--st-border)",
  background: "var(--st-card-soft)",
};
