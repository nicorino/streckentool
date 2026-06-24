import type { CSSProperties } from "react";
import type { CourseRect } from "../types/CourseRect";
import type { CourseValidation } from "../course/validateConnectedCourse";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Decoration } from "../types/Decoration";
import type { FigureBoundsWarning } from "../course/checkFigureBounds";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import { type TranslationKey, useAppLanguage } from "../i18n/i18n";

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

  return (
    <aside style={inspectorStyle}>
      <h3 style={{ marginTop: 0 }}>{t("inspector")}</h3>

      <section
        style={{
          ...statusCardStyle,
          background: courseValidation.isValid
            ? "var(--st-success-bg)"
            : "var(--st-error-bg)",
          border: courseValidation.isValid
            ? "1px solid var(--st-success-border)"
            : "1px solid var(--st-error-border)",
        }}
      >
        <strong>
          {courseValidation.isValid ? t("validCourse") : t("invalidCourse")}
        </strong>

        {courseValidation.messages.map((message) => (
          <p key={message} style={{ margin: "6px 0 0" }}>
            {translateCourseMessage(message, t)}
          </p>
        ))}
      </section>

      {figureWarningCount > 0 && (
        <section
          style={{
            ...statusCardStyle,
            marginTop: 12,
            background: "var(--st-warning-bg)",
            border: "1px solid var(--st-warning-border)",
          }}
        >
          <strong>{t("figureWarning")}</strong>

          <p style={{ margin: "6px 0 0" }}>
            {figureWarningCount}{" "}
            {figureWarningCount === 1
              ? t("figureSingular")
              : t("figurePlural")}{" "}
            {figureWarningCount === 1
              ? t("isPartlyOutsideCourse")
              : t("arePartlyOutsideCourse")}
          </p>
        </section>
      )}

      {backgroundImage && (
        <section
          style={{
            ...statusCardStyle,
            marginTop: 12,
            background: "var(--st-info-bg)",
            border: "1px solid var(--st-info-border)",
          }}
        >
          <strong>{t("backgroundImage")}</strong>

          <p style={{ margin: "6px 0 12px", color: "var(--st-text-muted)" }}>
            {backgroundImage.name}
          </p>

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

          {!backgroundImage.locked && (
            <>
              <NumberInput
                label={t("xPositionM")}
                value={backgroundImage.x}
                onChange={(value) => onUpdateBackgroundImage({ x: value })}
              />

              <NumberInput
                label={t("yPositionM")}
                value={backgroundImage.y}
                onChange={(value) => onUpdateBackgroundImage({ y: value })}
              />

              <NumberInput
                label={t("widthM")}
                value={backgroundImage.width}
                min={0.5}
                onChange={(value) =>
                  onUpdateBackgroundImage({ width: value })
                }
              />

              <NumberInput
                label={t("heightM")}
                value={backgroundImage.height}
                min={0.5}
                onChange={(value) =>
                  onUpdateBackgroundImage({ height: value })
                }
              />
            </>
          )}
        </section>
      )}

      {!selectedRect && !selectedFigure && !selectedDecoration && (
        <p style={{ marginTop: 24, fontSize: 14, color: "var(--st-text-muted)" }}>
          {t("selectObjectHint")}
        </p>
      )}

      {selectedRect && (
        <section style={sectionStyle}>
          <h3>{t("workspace")}</h3>

          <CheckboxInput
            label={t("locked")}
            checked={selectedRect.locked === true}
            onChange={(checked) => onUpdateSelectedRect({ locked: checked })}
          />

          <NumberInput
            label={t("xPositionM")}
            value={selectedRect.x}
            onChange={(value) => onUpdateSelectedRect({ x: value })}
          />

          <NumberInput
            label={t("yPositionM")}
            value={selectedRect.y}
            onChange={(value) => onUpdateSelectedRect({ y: value })}
          />

          <NumberInput
            label={t("widthM")}
            value={selectedRect.width}
            min={1}
            onChange={(value) => onUpdateSelectedRect({ width: value })}
          />

          <NumberInput
            label={t("heightM")}
            value={selectedRect.height}
            min={1}
            onChange={(value) => onUpdateSelectedRect({ height: value })}
          />

          <NumberInput
            label={t("rotationDeg")}
            value={selectedRect.rotation}
            min={-360}
            step={1}
            onChange={(value) => onUpdateSelectedRect({ rotation: value })}
          />

          {!selectedRect.locked && (
            <div style={{ display: "grid", gap: 8 }}>
              <button
                onClick={() =>
                  onUpdateSelectedRect({
                    rotation: selectedRect.rotation - 15,
                  })
                }
              >
                {t("rotateMinus15")}
              </button>

              <button
                onClick={() =>
                  onUpdateSelectedRect({
                    rotation: selectedRect.rotation + 15,
                  })
                }
              >
                {t("rotatePlus15")}
              </button>
            </div>
          )}
        </section>
      )}

      {selectedFigure && selectedFigureTemplate && (
        <section style={sectionStyle}>
          <h3>{t("figure")}</h3>

          <p style={{ fontSize: 14 }}>
            <strong>{selectedFigureTemplate.name}</strong>
          </p>

          {selectedFigureWarning && (
            <section
              style={{
                ...statusCardStyle,
                marginBottom: 12,
                background: "var(--st-error-bg)",
                border: "1px solid var(--st-error-border)",
              }}
            >
              <strong>{t("outsideCourse")}</strong>

              <p style={{ margin: "6px 0 0" }}>
                {selectedFigureWarning.outsideConeCount}{" "}
                {selectedFigureWarning.outsideConeCount === 1
                  ? t("coneSingular")
                  : t("conePlural")}{" "}
                {selectedFigureWarning.outsideConeCount === 1
                  ? t("isOutsideCourse")
                  : t("areOutsideCourse")}
              </p>
            </section>
          )}

          <NumberInput
            label={t("xPositionM")}
            value={selectedFigure.x}
            onChange={(value) => onUpdateSelectedFigure({ x: value })}
          />

          <NumberInput
            label={t("yPositionM")}
            value={selectedFigure.y}
            onChange={(value) => onUpdateSelectedFigure({ y: value })}
          />

          <NumberInput
            label={t("rotationDeg")}
            value={selectedFigure.rotation}
            min={-360}
            onChange={(value) => onUpdateSelectedFigure({ rotation: value })}
          />

          <ColorInput
            label={t("coneColor")}
            value={selectedFigure.coneColor}
            onChange={(value) => onUpdateSelectedFigure({ coneColor: value })}
          />

          <div style={{ display: "grid", gap: 8 }}>
            <button
              onClick={() =>
                onUpdateSelectedFigure({
                  rotation: selectedFigure.rotation - 15,
                })
              }
            >
              {t("rotateMinus15")}
            </button>

            <button
              onClick={() =>
                onUpdateSelectedFigure({
                  rotation: selectedFigure.rotation + 15,
                })
              }
            >
              {t("rotatePlus15")}
            </button>

            <button onClick={onMirrorSelectedFigure}>
              {t("mirrorFigure")}
            </button>

            <button onClick={onDuplicateSelectedFigure}>
              {t("duplicateFigure")}
            </button>
          </div>
        </section>
      )}

      {selectedDecoration && (
        <section style={sectionStyle}>
          <h3>
            {selectedDecoration.type === "text" ? t("text") : t("imageLogo")}
          </h3>

          <NumberInput
            label={t("xPositionM")}
            value={selectedDecoration.x}
            onChange={(value) => onUpdateSelectedDecoration({ x: value })}
          />

          <NumberInput
            label={t("yPositionM")}
            value={selectedDecoration.y}
            onChange={(value) => onUpdateSelectedDecoration({ y: value })}
          />

          <NumberInput
            label={t("widthM")}
            value={selectedDecoration.width}
            min={0.2}
            onChange={(value) => onUpdateSelectedDecoration({ width: value })}
          />

          <NumberInput
            label={t("heightM")}
            value={selectedDecoration.height}
            min={0.2}
            onChange={(value) => onUpdateSelectedDecoration({ height: value })}
          />

          <NumberInput
            label={t("rotationDeg")}
            value={selectedDecoration.rotation}
            min={-360}
            onChange={(value) =>
              onUpdateSelectedDecoration({ rotation: value })
            }
          />

          {selectedDecoration.type === "text" && (
            <>
              <label style={fieldLabelStyle}>
                {t("text")}
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
                onChange={(value) =>
                  onUpdateSelectedDecoration({
                    fontSize: value,
                  } as Partial<Decoration>)
                }
              />

              <ColorInput
                label={t("textColor")}
                value={selectedDecoration.color}
                onChange={(value) =>
                  onUpdateSelectedDecoration({
                    color: value,
                  } as Partial<Decoration>)
                }
              />
            </>
          )}

          {selectedDecoration.type === "image" && (
            <p style={{ fontSize: 14, color: "var(--st-text-muted)" }}>
              {t("file")}: {selectedDecoration.name}
            </p>
          )}
        </section>
      )}
    </aside>
  );
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

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  min = 0,
  max,
  step = 0.5,
  onChange,
}: NumberInputProps) {
  return (
    <label style={fieldLabelStyle}>
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isFinite(nextValue)) {
            onChange(Math.max(min, nextValue));
          }
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
      {label}
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...inputStyle,
          height: 36,
          padding: 2,
        }}
      />
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
        style={{ marginRight: 6 }}
      />
      {label}
    </label>
  );
}

const inspectorStyle: CSSProperties = {
  width: 280,
  padding: 16,
  borderRight: "1px solid var(--st-border)",
  boxSizing: "border-box",
  fontFamily: "sans-serif",
  overflowY: "auto",
  background: "var(--st-panel)",
  color: "var(--st-text)",
};

const statusCardStyle: CSSProperties = {
  padding: 10,
  borderRadius: 6,
  fontSize: 14,
  color: "var(--st-text)",
};

const sectionStyle: CSSProperties = {
  marginTop: 24,
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 12,
  fontSize: 14,
  color: "var(--st-text)",
};

const checkboxLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 12,
  fontSize: 14,
  color: "var(--st-text)",
};

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  boxSizing: "border-box",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};

const textareaStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  boxSizing: "border-box",
  resize: "vertical",
  background: "var(--st-card)",
  color: "var(--st-text)",
  border: "1px solid var(--st-border)",
};