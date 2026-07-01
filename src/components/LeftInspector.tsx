import type { CSSProperties, ReactNode } from "react";
import type { CourseRect } from "../types/CourseRect";
import type { CourseValidation } from "../course/validateConnectedCourse";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Decoration } from "../types/Decoration";
import type { FigureBoundsWarning } from "../course/checkFigureBounds";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import { type TranslationKey, useAppLanguage } from "../i18n/i18n";
import {
  isConfigurableSlalomTemplate,
  isConfigurableWechseltorTemplate,
  isConfigurableKreiselTemplate,
  isConfigurableSSpurgasseTemplate,
  normalizeFigureConfig,
} from "../figures/figureConfig";

type LeftInspectorProps = {
  selectedRect: CourseRect | null;
  selectedFigure: FigureInstance | null;
  selectedFigureTemplate: FigureTemplate | null;
  selectedDecoration: Decoration | null;
  selectedFigureWarning: FigureBoundsWarning | null;
  figureWarningCount: number;
  backgroundImage: CourseBackgroundImage | null;
  onUpdateSelectedRect: (patch: Partial<CourseRect>) => void;
  onUpdateSelectedFigure: (patch: Partial<FigureInstance>) => void;
  onUpdateSelectedDecoration: (patch: Partial<Decoration>) => void;
  onUpdateBackgroundImage: (patch: Partial<CourseBackgroundImage>) => void;
  onDuplicateSelectedFigure: () => void;
  onMirrorSelectedFigure: () => void;
  courseValidation: CourseValidation;
};

export function LeftInspector({
  selectedRect,
  selectedFigure,
  selectedFigureTemplate,
  selectedDecoration,
  selectedFigureWarning,
  figureWarningCount,
  backgroundImage,
  onUpdateSelectedRect,
  onUpdateSelectedFigure,
  onUpdateSelectedDecoration,
  onUpdateBackgroundImage,
  onDuplicateSelectedFigure,
  onMirrorSelectedFigure,
  courseValidation,
}: LeftInspectorProps) {
  const { t } = useAppLanguage();

  const selectedTitle = getSelectedTitle({
    selectedRect,
    selectedFigure,
    selectedFigureTemplate,
    selectedDecoration,
    t,
  });

  const selectedFigureConfig =
    selectedFigure && selectedFigureTemplate
      ? normalizeFigureConfig(selectedFigureTemplate, selectedFigure.config)
      : null;

  const selectedFigureIsConfigurableSlalom =
    selectedFigureTemplate !== null &&
    isConfigurableSlalomTemplate(selectedFigureTemplate);
  const selectedFigureIsConfigurableWechseltor =
    selectedFigureTemplate !== null &&
    isConfigurableWechseltorTemplate(selectedFigureTemplate);
  const selectedFigureIsConfigurableKreisel =
    selectedFigureTemplate !== null &&
    isConfigurableKreiselTemplate(selectedFigureTemplate);
  const selectedFigureIsConfigurableSSpurgasse =
    selectedFigureTemplate !== null &&
    isConfigurableSSpurgasseTemplate(selectedFigureTemplate);

  return (
    <aside style={inspectorStyle}>
      <header style={inspectorHeaderStyle}>
        <p style={eyebrowStyle}>{t("selectedObject")}</p>
        <h2 style={inspectorTitleStyle}>{selectedTitle ?? t("inspector")}</h2>
      </header>

      <StatusCard
        tone={courseValidation.isValid ? "success" : "error"}
        title={courseValidation.isValid ? t("validCourse") : t("invalidCourse")}
      >
        {courseValidation.messages.map((message) => (
          <p key={message} style={statusTextStyle}>
            {translateCourseMessage(message, t)}
          </p>
        ))}
      </StatusCard>

      {figureWarningCount > 0 && (
        <StatusCard tone="warning" title={t("figureWarning")}>
          <p style={statusTextStyle}>
            {figureWarningCount}{" "}
            {figureWarningCount === 1
              ? t("figureSingular")
              : t("figurePlural")}{" "}
            {figureWarningCount === 1
              ? t("isPartlyOutsideCourse")
              : t("arePartlyOutsideCourse")}
          </p>
        </StatusCard>
      )}

      {backgroundImage && (
        <DetailsSection
          title={t("backgroundImage")}
          subtitle={backgroundImage.name}
          defaultOpen={false}
        >
          <MetricGrid
            items={[
              { label: t("position"), value: formatPosition(backgroundImage.x, backgroundImage.y) },
              { label: t("size"), value: formatSize(backgroundImage.width, backgroundImage.height) },
              { label: t("rotationDeg"), value: formatDegrees(backgroundImage.rotation) },
              { label: t("opacity"), value: `${Math.round(backgroundImage.opacity * 100)}%` },
            ]}
          />

          <DetailsSection title={t("backgroundSettings")} nested defaultOpen>
            <CheckboxInput
              label={t("locked")}
              checked={backgroundImage.locked}
              onChange={(checked) => onUpdateBackgroundImage({ locked: checked })}
            />

            <NumberInput
              label={t("opacity")}
              value={backgroundImage.opacity}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) =>
                onUpdateBackgroundImage({
                  opacity: Math.max(0, Math.min(1, value)),
                })
              }
            />
          </DetailsSection>

          {!backgroundImage.locked && (
            <DetailsSection title={t("advanced")} nested>
              <NumberInput
                label={t("xPositionM")}
                value={backgroundImage.x}
                step={0.5}
                onChange={(value) => onUpdateBackgroundImage({ x: value })}
              />

              <NumberInput
                label={t("yPositionM")}
                value={backgroundImage.y}
                step={0.5}
                onChange={(value) => onUpdateBackgroundImage({ y: value })}
              />

              <NumberInput
                label={t("widthM")}
                value={backgroundImage.width}
                min={0}
                step={0.5}
                onChange={(value) => onUpdateBackgroundImage({ width: value })}
              />

              <NumberInput
                label={t("heightM")}
                value={backgroundImage.height}
                min={0}
                step={0.5}
                onChange={(value) => onUpdateBackgroundImage({ height: value })}
              />

              <NumberInput
                label={t("rotationDeg")}
                value={backgroundImage.rotation}
                min={-360}
                max={360}
                step={1}
                onChange={(value) => onUpdateBackgroundImage({ rotation: value })}
              />
            </DetailsSection>
          )}
        </DetailsSection>
      )}

      {!selectedRect && !selectedFigure && !selectedDecoration && (
        <section style={emptyStateStyle}>
          <strong>{t("statusReady")}</strong>
          <p>{t("selectObjectHint")}</p>
        </section>
      )}

      {selectedRect && (
        <ObjectPanel title={t("workspace")}>
          <MetricGrid
            items={[
              { label: t("position"), value: formatPosition(selectedRect.x, selectedRect.y) },
              { label: t("size"), value: formatSize(selectedRect.width, selectedRect.height) },
              { label: t("rotationDeg"), value: formatDegrees(selectedRect.rotation) },
            ]}
          />

          <DetailsSection title={t("layout")} nested defaultOpen>
            <CheckboxInput
              label={t("locked")}
              checked={selectedRect.locked === true}
              onChange={(checked) => onUpdateSelectedRect({ locked: checked })}
            />

            <NumberInput
              label={t("xPositionM")}
              value={selectedRect.x}
              step={0.5}
              disabled={selectedRect.locked}
              onChange={(value) => onUpdateSelectedRect({ x: value })}
            />

            <NumberInput
              label={t("yPositionM")}
              value={selectedRect.y}
              step={0.5}
              disabled={selectedRect.locked}
              onChange={(value) => onUpdateSelectedRect({ y: value })}
            />

            <NumberInput
              label={t("widthM")}
              value={selectedRect.width}
              min={1}
              step={0.5}
              disabled={selectedRect.locked}
              onChange={(value) => onUpdateSelectedRect({ width: value })}
            />

            <NumberInput
              label={t("heightM")}
              value={selectedRect.height}
              min={1}
              step={0.5}
              disabled={selectedRect.locked}
              onChange={(value) => onUpdateSelectedRect({ height: value })}
            />

            <NumberInput
              label={t("rotationDeg")}
              value={selectedRect.rotation}
              min={-360}
              max={360}
              step={1}
              disabled={selectedRect.locked}
              onChange={(value) => onUpdateSelectedRect({ rotation: value })}
            />
          </DetailsSection>

          {!selectedRect.locked && (
            <DetailsSection title={t("actions")} nested>
              <ButtonGrid>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() =>
                    onUpdateSelectedRect({
                      rotation: selectedRect.rotation - 15,
                    })
                  }
                >
                  {t("rotateMinus15")}
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() =>
                    onUpdateSelectedRect({
                      rotation: selectedRect.rotation + 15,
                    })
                  }
                >
                  {t("rotatePlus15")}
                </button>
              </ButtonGrid>
            </DetailsSection>
          )}
        </ObjectPanel>
      )}

      {selectedFigure && selectedFigureTemplate && (
        <ObjectPanel title={t("figure")} subtitle={selectedFigureTemplate.name}>
          {selectedFigureWarning && (
            <StatusCard tone="error" title={t("outsideCourse")}>
              <p style={statusTextStyle}>
                {selectedFigureWarning.outsideConeCount}{" "}
                {selectedFigureWarning.outsideConeCount === 1
                  ? t("coneSingular")
                  : t("conePlural")}{" "}
                {selectedFigureWarning.outsideConeCount === 1
                  ? t("isOutsideCourse")
                  : t("areOutsideCourse")}
              </p>
            </StatusCard>
          )}

          <MetricGrid
            items={[
              { label: t("position"), value: formatPosition(selectedFigure.x, selectedFigure.y) },
              { label: t("rotationDeg"), value: formatDegrees(selectedFigure.rotation) },
              { label: t("coneColor"), value: selectedFigure.coneColor.toUpperCase() },
            ]}
          />

          {selectedFigureConfig && (
            <DetailsSection title={t("figureSettings")} nested defaultOpen>


              {selectedFigureIsConfigurableSlalom && (
                <>
                  <NumberInput
                    label={t("slalomConeCount")}
                    value={selectedFigureConfig.coneCount ?? 5}
                    min={2}
                    max={10}
                    step={1}
                    onChange={(value) =>
                      onUpdateSelectedFigure({
                        config: {
                          ...selectedFigureConfig,
                          coneCount: Math.round(value),
                        },
                      })
                    }
                  />

                  <NumberInput
                    label={t("slalomConeDistance")}
                    value={selectedFigureConfig.coneDistanceMeters ?? 4}
                    min={0}
                    max={10}
                    step={0.5}
                    onChange={(value) =>
                      onUpdateSelectedFigure({
                        config: {
                          ...selectedFigureConfig,
                          coneDistanceMeters: value,
                        },
                      })
                    }
                  />
              <label
                style={{
                  display: "grid",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {t("slalomFirstConeDirection")}
                <select
                  value={selectedFigureConfig.slalomFirstConeOrientation ?? "left"}
                  onChange={(event) =>
                    onUpdateSelectedFigure({
                      config: {
                        ...selectedFigureConfig,
                        slalomFirstConeOrientation:
                          event.target.value === "right" ? "right" : "left",
                      },
                    })
                  }
                  style={{
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid var(--st-border-soft)",
                    background: "var(--st-card)",
                    color: "var(--st-text)",
                    padding: "0 8px",
                  }}
                >
                  <option value="left">{t("slalomFirstConeLeft")}</option>
                  <option value="right">{t("slalomFirstConeRight")}</option>
                </select>
              </label>
                </>
              )}
            {selectedFigureIsConfigurableWechseltor && (
              <NumberInput
                label={t("wechseltorMiddleGap")}
                value={selectedFigureConfig.wechseltorMiddleGapMeters ?? 2.5}
                min={1.5}
                max={4}
                step={0.1}
                onChange={(value) =>
                  onUpdateSelectedFigure({
                    config: {
                      ...selectedFigureConfig,
                      wechseltorMiddleGapMeters: value,
                    },
                  })
                }
              />
            )}
            {selectedFigureIsConfigurableKreisel && (
              <NumberInput
                label={t("kreiselEntryExitConeCount")}
                value={selectedFigureConfig.kreiselEntryExitConeCount ?? 5}
                min={3}
                max={12}
                step={1}
                onChange={(value) =>
                  onUpdateSelectedFigure({
                    config: {
                      ...selectedFigureConfig,
                      kreiselEntryExitConeCount: value,
                    },
                  })
                }
              />
            )}
            {selectedFigureIsConfigurableSSpurgasse && (
              <NumberInput
                label={t("sSpurgasseCurveAmount")}
                value={selectedFigureConfig.sSpurgasseCurveAmount ?? 3}
                min={0}
                max={6}
                step={0.25}
                onChange={(value) =>
                  onUpdateSelectedFigure({
                    config: {
                      ...selectedFigureConfig,
                      sSpurgasseCurveAmount: value,
                    },
                  })
                }
              />
            )}
            {selectedFigureIsConfigurableSSpurgasse && (
              <NumberInput
                label={t("sSpurgasseLengthMeters")}
                value={selectedFigureConfig.sSpurgasseLengthMeters ?? 12}
                min={3}
                max={30}
                step={0.5}
                onChange={(value) =>
                  onUpdateSelectedFigure({
                    config: {
                      ...selectedFigureConfig,
                      sSpurgasseLengthMeters: value,
                    },
                  })
                }
              />
            )}
            </DetailsSection>
          )}

          <DetailsSection title={t("layout")} nested defaultOpen>
            <NumberInput
              label={t("xPositionM")}
              value={selectedFigure.x}
              step={0.5}
              onChange={(value) => onUpdateSelectedFigure({ x: value })}
            />

            <NumberInput
              label={t("yPositionM")}
              value={selectedFigure.y}
              step={0.5}
              onChange={(value) => onUpdateSelectedFigure({ y: value })}
            />

            <NumberInput
              label={t("rotationDeg")}
              value={selectedFigure.rotation}
              min={-360}
              max={360}
              step={1}
              onChange={(value) => onUpdateSelectedFigure({ rotation: value })}
            />
          </DetailsSection>

          <DetailsSection title={t("appearance")} nested>
            <ColorInput
              label={t("coneColor")}
              value={selectedFigure.coneColor}
              onChange={(value) => onUpdateSelectedFigure({ coneColor: value })}
            />
          </DetailsSection>

          <DetailsSection title={t("actions")} nested defaultOpen>
            <ButtonGrid>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() =>
                  onUpdateSelectedFigure({
                    rotation: selectedFigure.rotation - 15,
                  })
                }
              >
                {t("rotateMinus15")}
              </button>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() =>
                  onUpdateSelectedFigure({
                    rotation: selectedFigure.rotation + 15,
                  })
                }
              >
                {t("rotatePlus15")}
              </button>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={onMirrorSelectedFigure}
              >
                {t("mirrorFigure")}
              </button>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={onDuplicateSelectedFigure}
              >
                {t("duplicateFigure")}
              </button>
            </ButtonGrid>
          </DetailsSection>
        </ObjectPanel>
      )}

      {selectedDecoration && (
        <ObjectPanel title={getDecorationTitle(selectedDecoration, t)}>
          <MetricGrid
            items={[
              { label: t("position"), value: formatPosition(selectedDecoration.x, selectedDecoration.y) },
              { label: t("size"), value: formatSize(selectedDecoration.width, selectedDecoration.height) },
              { label: t("rotationDeg"), value: formatDegrees(selectedDecoration.rotation) },
            ]}
          />

          <DetailsSection title={t("layout")} nested defaultOpen>
            <NumberInput
              label={t("xPositionM")}
              value={selectedDecoration.x}
              step={0.5}
              onChange={(value) => onUpdateSelectedDecoration({ x: value })}
            />

            <NumberInput
              label={t("yPositionM")}
              value={selectedDecoration.y}
              step={0.5}
              onChange={(value) => onUpdateSelectedDecoration({ y: value })}
            />

            <NumberInput
              label={t("widthM")}
              value={selectedDecoration.width}
              min={0.2}
              step={0.5}
              onChange={(value) => onUpdateSelectedDecoration({ width: value })}
            />

            <NumberInput
              label={t("heightM")}
              value={selectedDecoration.height}
              min={0.2}
              step={0.5}
              onChange={(value) => onUpdateSelectedDecoration({ height: value })}
            />

            <NumberInput
              label={t("rotationDeg")}
              value={selectedDecoration.rotation}
              min={-360}
              max={360}
              step={1}
              onChange={(value) =>
                onUpdateSelectedDecoration({ rotation: value })
              }
            />
          </DetailsSection>

          {selectedDecoration.type === "text" && (
            <DetailsSection title={t("content")} nested defaultOpen>
              <label style={fieldLabelStyle}>
                <span>{t("text")}</span>
                <textarea
                  value={selectedDecoration.text}
                  onChange={(event) =>
                    onUpdateSelectedDecoration({
                      text: event.target.value,
                    } as Partial<Decoration>)
                  }
                  rows={4}
                  style={textareaStyle}
                />
              </label>

              <NumberInput
                label={t("fontSizePx")}
                value={selectedDecoration.fontSize}
                min={6}
                step={1}
                onChange={(value) =>
                  onUpdateSelectedDecoration({
                    fontSize: value,
                  } as Partial<Decoration>)
                }
              />
            </DetailsSection>
          )}

          {(selectedDecoration.type === "text" ||
            selectedDecoration.type === "arrow") && (
            <DetailsSection title={t("appearance")} nested>
              <ColorInput
                label={
                  selectedDecoration.type === "text"
                    ? t("textColor")
                    : t("coneColor")
                }
                value={selectedDecoration.color}
                onChange={(value) =>
                  onUpdateSelectedDecoration({
                    color: value,
                  } as Partial<Decoration>)
                }
              />
            </DetailsSection>
          )}

          {selectedDecoration.type === "image" && (
            <DetailsSection title={t("advanced")} nested>
              <p style={mutedTextStyle}>
                {t("file")}: {selectedDecoration.name}
              </p>
            </DetailsSection>
          )}
        </ObjectPanel>
      )}
    </aside>
  );
}

function getSelectedTitle({
  selectedRect,
  selectedFigure,
  selectedFigureTemplate,
  selectedDecoration,
  t,
}: {
  selectedRect: CourseRect | null;
  selectedFigure: FigureInstance | null;
  selectedFigureTemplate: FigureTemplate | null;
  selectedDecoration: Decoration | null;
  t: (key: TranslationKey) => string;
}) {
  if (selectedRect) return t("workspace");
  if (selectedFigure) return selectedFigureTemplate?.name ?? t("figure");
  if (selectedDecoration) return getDecorationTitle(selectedDecoration, t);
  return null;
}

function getDecorationTitle(
  decoration: Decoration,
  t: (key: TranslationKey) => string
) {
  if (decoration.type === "text") return t("text");
  if (decoration.type === "arrow") return t("arrowStraight");
  return t("imageLogo");
}

function translateCourseMessage(
  message: string,
  t: (key: TranslationKey) => string
) {
  if (message === "Add at least one workspace.") {
    return t("addAtLeastOneWorkspace");
  }

  if (message === "Course area is valid.") {
    return t("courseAreaValid");
  }

  if (
    message === "All workspaces must touch or overlap with the main course area."
  ) {
    return t("workspacesMustTouch");
  }

  return message;
}

function ObjectPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section style={objectPanelStyle}>
      <header style={objectPanelHeaderStyle}>
        <h3 style={objectTitleStyle}>{title}</h3>
        {subtitle && <p style={objectSubtitleStyle}>{subtitle}</p>}
      </header>

      <div style={objectPanelBodyStyle}>{children}</div>
    </section>
  );
}

function DetailsSection({
  title,
  subtitle,
  nested = false,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  nested?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} style={nested ? nestedDetailsStyle : detailsStyle}>
      <summary style={summaryStyle}>
        <span>{title}</span>
        {subtitle && <small>{subtitle}</small>}
      </summary>

      <div style={detailsBodyStyle}>{children}</div>
    </details>
  );
}

function StatusCard({
  tone,
  title,
  children,
}: {
  tone: "success" | "error" | "warning";
  title: string;
  children: ReactNode;
}) {
  const toneStyle =
    tone === "success"
      ? successCardStyle
      : tone === "warning"
        ? warningCardStyle
        : errorCardStyle;

  return (
    <section style={{ ...statusCardStyle, ...toneStyle }}>
      <strong>{title}</strong>
      {children}
    </section>
  );
}

function MetricGrid({
  items,
}: {
  items: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div style={metricGridStyle}>
      {items.map((item) => (
        <div key={item.label} style={metricCardStyle}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function ButtonGrid({ children }: { children: ReactNode }) {
  return <div style={buttonGridStyle}>{children}</div>;
}

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  min,
  max,
  step = 0.5,
  disabled = false,
  onChange,
}: NumberInputProps) {
  return (
    <label style={fieldLabelStyle}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (!Number.isFinite(nextValue)) {
            return;
          }

          const minChecked =
            typeof min === "number" ? Math.max(min, nextValue) : nextValue;
          const maxChecked =
            typeof max === "number" ? Math.min(max, minChecked) : minChecked;

          onChange(maxChecked);
        }}
        style={inputStyle}
      />
    </label>
  );
}

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <label style={fieldLabelStyle}>
      <span>{label}</span>

      <div style={colorRowStyle}>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={colorInputStyle}
        />

        <code style={colorCodeStyle}>{value.toUpperCase()}</code>
      </div>
    </label>
  );
}

type CheckboxInputProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <label style={checkboxLabelStyle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function formatPosition(x: number, y: number) {
  return `${formatNumber(x)} / ${formatNumber(y)} m`;
}

function formatSize(width: number, height: number) {
  return `${formatNumber(width)} × ${formatNumber(height)} m`;
}

function formatDegrees(value: number) {
  return `${formatNumber(value)}°`;
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2).replace(/\.?0+$/, "");
}

const inspectorStyle: CSSProperties = {
  width: 300,
  padding: 14,
  borderRight: "1px solid var(--st-border)",
  boxSizing: "border-box",
  fontFamily: "sans-serif",
  overflowY: "auto",
  background: "var(--st-panel)",
  color: "var(--st-text)",
};

const inspectorHeaderStyle: CSSProperties = {
  marginBottom: 12,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--st-text-muted)",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const inspectorTitleStyle: CSSProperties = {
  margin: "3px 0 0",
  fontSize: 18,
  lineHeight: 1.2,
};

const statusCardStyle: CSSProperties = {
  padding: 10,
  borderRadius: 10,
  fontSize: 13,
  color: "var(--st-text)",
  marginBottom: 10,
};

const successCardStyle: CSSProperties = {
  background: "var(--st-success-bg)",
  border: "1px solid var(--st-success-border)",
};

const warningCardStyle: CSSProperties = {
  background: "var(--st-warning-bg)",
  border: "1px solid var(--st-warning-border)",
};

const errorCardStyle: CSSProperties = {
  background: "var(--st-error-bg)",
  border: "1px solid var(--st-error-border)",
};

const statusTextStyle: CSSProperties = {
  margin: "6px 0 0",
  lineHeight: 1.35,
};

const emptyStateStyle: CSSProperties = {
  marginTop: 14,
  padding: 12,
  borderRadius: 10,
  border: "1px dashed var(--st-border)",
  background: "var(--st-card)",
  color: "var(--st-text-muted)",
  fontSize: 13,
  lineHeight: 1.4,
};

const objectPanelStyle: CSSProperties = {
  marginTop: 12,
  border: "1px solid var(--st-border-soft)",
  borderRadius: 12,
  background: "var(--st-card-soft)",
  overflow: "hidden",
};

const objectPanelHeaderStyle: CSSProperties = {
  padding: "12px 12px 8px",
  borderBottom: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
};

const objectTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
};

const objectSubtitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--st-text-muted)",
  fontSize: 13,
};

const objectPanelBodyStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 10,
};

const detailsStyle: CSSProperties = {
  marginTop: 10,
  border: "1px solid var(--st-border-soft)",
  borderRadius: 10,
  background: "var(--st-card)",
  overflow: "hidden",
};

const nestedDetailsStyle: CSSProperties = {
  border: "1px solid var(--st-border-soft)",
  borderRadius: 9,
  background: "var(--st-card)",
  overflow: "hidden",
};

const summaryStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "9px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 800,
};

const detailsBodyStyle: CSSProperties = {
  display: "grid",
  gap: 9,
  padding: "0 10px 10px",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
};

const metricCardStyle: CSSProperties = {
  display: "grid",
  gap: 3,
  padding: "8px 9px",
  borderRadius: 9,
  background: "var(--st-card)",
  border: "1px solid var(--st-border-soft)",
  fontSize: 12,
};

const fieldLabelStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  fontSize: 13,
  color: "var(--st-text)",
};

const checkboxLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "var(--st-text)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: 32,
  boxSizing: "border-box",
  padding: "0 8px",
  borderRadius: 7,
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 8,
  borderRadius: 7,
  resize: "vertical",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};

const colorRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const colorInputStyle: CSSProperties = {
  width: 42,
  height: 28,
  padding: 2,
  borderRadius: 7,
  border: "1px solid var(--st-border)",
  background: "var(--st-card)",
};

const colorCodeStyle: CSSProperties = {
  fontSize: 12,
  color: "var(--st-text-muted)",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 32,
  padding: "0 9px",
  borderRadius: 8,
  border: "1px solid var(--st-border-soft)",
  background: "var(--st-card)",
  color: "var(--st-text)",
  fontWeight: 700,
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "var(--st-text-muted)",
};
