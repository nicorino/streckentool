import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  X,
} from "lucide-react";
import { type TranslationKey, useAppLanguage } from "../i18n/i18n";

type TutorialPreset = "plan" | "background" | "export" | "project";

type TutorialStep = {
  target: string;
  preset?: TutorialPreset;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
};

type TargetBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "tutorial-course-tab",
    preset: "plan",
    titleKey: "tutorialCourseTitle",
    bodyKey: "tutorialCourseBody",
  },
  {
    target: "tutorial-course-area-button",
    preset: "plan",
    titleKey: "tutorialCourseAreaTitle",
    bodyKey: "tutorialCourseAreaBody",
  },
  {
    target: "tutorial-slalom-card",
    preset: "plan",
    titleKey: "tutorialFigureTitle",
    bodyKey: "tutorialFigureBody",
  },
  {
    target: "tutorial-canvas",
    preset: "plan",
    titleKey: "tutorialCanvasTitle",
    bodyKey: "tutorialCanvasBody",
  },
  {
    target: "tutorial-export-tab",
    preset: "export",
    titleKey: "tutorialExportTitle",
    bodyKey: "tutorialExportBody",
  },
  {
    target: "tutorial-export-settings-button",
    preset: "export",
    titleKey: "tutorialExportSettingsTitle",
    bodyKey: "tutorialExportSettingsBody",
  },
];

type TutorialOverlayProps = {
  onClose: () => void;
};

export function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const { t } = useAppLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<TargetBox | null>(null);

  const currentStep = TUTORIAL_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;

  useEffect(() => {
    if (!currentStep.preset) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent<TutorialPreset>("streckentool-tutorial-preset", {
        detail: currentStep.preset,
      })
    );
  }, [currentStep.preset]);

  useEffect(() => {
    function updateTargetBox() {
      const target = document.querySelector<HTMLElement>(
        `[data-tutorial-target="${currentStep.target}"]`
      );

      if (!target) {
        setTargetBox(null);
        return;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      const rect = target.getBoundingClientRect();

      setTargetBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }

    const timeout = window.setTimeout(updateTargetBox, 160);

    window.addEventListener("resize", updateTargetBox);
    window.addEventListener("scroll", updateTargetBox, true);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", updateTargetBox);
      window.removeEventListener("scroll", updateTargetBox, true);
    };
  }, [currentStep.target, currentStep.preset, stepIndex]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      if (target.closest("[data-tutorial-control='true']")) {
        return;
      }

      const clickedTutorialTarget = target.closest<HTMLElement>(
        `[data-tutorial-target="${currentStep.target}"]`
      );

      if (!clickedTutorialTarget) {
        return;
      }

      window.setTimeout(() => {
        setStepIndex((current) =>
          Math.min(TUTORIAL_STEPS.length - 1, current + 1)
        );
      }, 220);
    }

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [currentStep.target]);

  const highlightStyle = useMemo<CSSProperties>(() => {
    if (!targetBox) {
      return {
        display: "none",
      };
    }

    return {
      position: "fixed",
      top: targetBox.top - 8,
      left: targetBox.left - 8,
      width: targetBox.width + 16,
      height: targetBox.height + 16,
      borderRadius: 12,
      border: "2px solid var(--st-primary)",
      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.48)",
      pointerEvents: "none",
      zIndex: 151,
    };
  }, [targetBox]);

  const calloutPosition = useMemo<CSSProperties>(() => {
    if (!targetBox) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const preferredTop =
      targetBox.top + targetBox.height + 22 < window.innerHeight - 250
        ? targetBox.top + targetBox.height + 22
        : Math.max(20, targetBox.top - 250);

    return {
      top: preferredTop,
      left: clamp(targetBox.left, 20, window.innerWidth - 390),
    };
  }, [targetBox]);

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    if (isLastStep) {
      onClose();
      return;
    }

    setStepIndex((current) => Math.min(TUTORIAL_STEPS.length - 1, current + 1));
  }

  return (
    <div style={overlayRootStyle}>
      <div style={highlightStyle} />

      <section
        style={{ ...calloutStyle, ...calloutPosition }}
        data-tutorial-control="true"
      >
        <div style={pointerStyle} />

        <header style={calloutHeaderStyle}>
          <div style={titleGroupStyle}>
            <MousePointer2 size={18} strokeWidth={2.4} />
            <div>
              <p style={stepCounterStyle}>
                {t("tutorialStep")} {stepIndex + 1} / {TUTORIAL_STEPS.length}
              </p>
              <h2 style={titleStyle}>{t(currentStep.titleKey)}</h2>
            </div>
          </div>

          <button type="button" onClick={onClose} style={closeButtonStyle}>
            <X size={17} strokeWidth={2.5} />
          </button>
        </header>

        <p style={bodyStyle}>{t(currentStep.bodyKey)}</p>
        <p style={actionHintStyle}>{t("tutorialClickTarget")}</p>

        <footer style={footerStyle}>
          <button
            type="button"
            onClick={onClose}
            style={secondaryButtonStyle}
          >
            {t("tutorialSkip")}
          </button>

          <div style={footerRightStyle}>
            <button
              type="button"
              onClick={goBack}
              disabled={isFirstStep}
              style={{
                ...secondaryButtonStyle,
                opacity: isFirstStep ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={15} strokeWidth={2.5} />
              {t("tutorialBack")}
            </button>

            <button type="button" onClick={goNext} style={primaryButtonStyle}>
              {isLastStep ? t("tutorialFinish") : t("tutorialNext")}
              {!isLastStep && <ChevronRight size={15} strokeWidth={2.5} />}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const overlayRootStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 150,
  pointerEvents: "none",
  fontFamily: "sans-serif",
};

const calloutStyle: CSSProperties = {
  position: "fixed",
  width: 360,
  boxSizing: "border-box",
  padding: 16,
  borderRadius: 14,
  border: "1px solid var(--st-border)",
  background: "var(--st-panel)",
  color: "var(--st-text)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.4)",
  zIndex: 152,
  pointerEvents: "auto",
};

const pointerStyle: CSSProperties = {
  position: "absolute",
  top: -7,
  left: 28,
  width: 14,
  height: 14,
  transform: "rotate(45deg)",
  background: "var(--st-panel)",
  borderLeft: "1px solid var(--st-border)",
  borderTop: "1px solid var(--st-border)",
};

const calloutHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const titleGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};

const stepCounterStyle: CSSProperties = {
  margin: 0,
  color: "var(--st-text-muted)",
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const titleStyle: CSSProperties = {
  margin: "3px 0 0",
  fontSize: 18,
  lineHeight: 1.2,
};

const bodyStyle: CSSProperties = {
  margin: "12px 0 8px",
  color: "var(--st-text)",
  fontSize: 14,
  lineHeight: 1.45,
};

const actionHintStyle: CSSProperties = {
  margin: "0 0 16px",
  color: "var(--st-text-muted)",
  fontSize: 12,
  lineHeight: 1.35,
};

const closeButtonStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
};

const footerRightStyle: CSSProperties = {
  display: "flex",
  gap: 8,
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 34,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "0 11px",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontWeight: 700,
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 34,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid var(--st-primary)",
  background: "var(--st-primary)",
  color: "var(--st-primary-text)",
  fontWeight: 800,
};
