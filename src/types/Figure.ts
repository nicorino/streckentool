export const DEFAULT_CONE_COLOR = "#ff7a00";

export type FigureCategory =
  | "Basic"
  | "Slalom"
  | "Gates"
  | "Boxes"
  | "Custom"
  | "Other";

export type FigureElement =
  | {
      type: "cone";
      x: number;
      y: number;
      radius: number;
      orientation?: FigureConeOrientation;
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

export type FigureConeOrientation = "left" | "right" | "up" | "down";

export type FigureConfig = {
  scaleX?: number;
  scaleY?: number;
  coneCount?: number;
  coneDistanceMeters?: number;
  slalomFirstConeOrientation?: FigureConeOrientation;
  wechseltorMiddleGapMeters?: number;
  kreiselEntryExitConeCount?: number;
  sSpurgasseCurveAmount?: number;
  sSpurgasseLengthMeters?: number;
  zGasseGateGapMeters?: number;
  zGasseMiddleGateOffsetCones?: number;
  spurgasseGeradeLengthMeters?: number;
  gasseConeCount?: number;
};

export type FigureTemplate = {
  id: string;
  name: string;
  shortName?: string;
  category?: FigureCategory;
  description?: string;
  elements: FigureElement[];
};

export type FigureInstance = {
  id: string;
  templateId: string;
  x: number;
  y: number;
  rotation: number;
  mirrored: boolean;
  coneColor: string;
  config?: FigureConfig;
};
