import { useEffect, useState, type CSSProperties } from "react";
import { useAppLanguage } from "../i18n/i18n";

type CalibrationDialogProps = {
  measuredDistanceMeters: number;
  onApply: (realDistanceMeters: number) => void;
  onCancel: () => void;
};

export function CalibrationDialog({
  measuredDistanceMeters,
  onApply,
  onCancel,
}: CalibrationDialogProps) {
  const { t } = useAppLanguage();
  const [inputValue, setInputValue] = useState(
    formatInitialValue(measuredDistanceMeters)
  );

  useEffect(() => {
    setInputValue(formatInitialValue(measuredDistanceMeters));
  }, [measuredDistanceMeters]);

  const parsedDistance = Number(inputValue.replace(",", "."));
  const isValidDistance =
    Number.isFinite(parsedDistance) && parsedDistance > 0;

  return (
    <div style={backdropStyle}>
      <form
        style={dialogStyle}
        onSubmit={(event) => {
          event.preventDefault();

          if (!isValidDistance) {
            return;
          }

          onApply(parsedDistance);
        }}
      >
        <h2 style={{ marginTop: 0 }}>{t("calibrateTitle")}</h2>

        <p style={{ fontSize: 14, lineHeight: 1.45 }}>
          {t("calibrateDescription")}
        </p>

        <div style={infoBoxStyle}>
          {t("measuredDistance")}{" "}
          <strong>{formatDistance(measuredDistanceMeters)} m</strong>
        </div>

        <label style={labelStyle}>
          {t("realDistanceMeters")}
          <input
            autoFocus
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            style={inputStyle}
          />
        </label>

        {!isValidDistance && inputValue.trim().length > 0 && (
          <p style={errorStyle}>{t("invalidDistance")}</p>
        )}

        <div style={buttonRowStyle}>
          <button type="button" onClick={onCancel}>
            {t("cancel")}
          </button>

          <button type="submit" disabled={!isValidDistance}>
            {t("applyCalibration")}
          </button>
        </div>
      </form>
    </div>
  );
}

function formatInitialValue(value: number) {
  return value.toFixed(2);
}

function formatDistance(value: number) {
  if (value < 10) return value.toFixed(2);
  if (value < 100) return value.toFixed(1);
  return Math.round(value).toString();
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
} satisfies CSSProperties;

const dialogStyle = {
  width: "min(420px, 100%)",
  background: "#fff",
  borderRadius: 10,
  padding: 22,
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  fontFamily: "sans-serif",
} satisfies CSSProperties;

const infoBoxStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #90caf9",
  background: "#e3f2fd",
  fontSize: 14,
  marginBottom: 16,
} satisfies CSSProperties;

const labelStyle = {
  display: "block",
  fontSize: 14,
  marginBottom: 8,
} satisfies CSSProperties;

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 6,
  padding: 7,
  fontSize: 14,
} satisfies CSSProperties;

const errorStyle = {
  margin: "8px 0 0",
  color: "#c62828",
  fontSize: 13,
} satisfies CSSProperties;

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  marginTop: 18,
} satisfies CSSProperties;