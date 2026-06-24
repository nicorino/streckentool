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
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

export type FigureTemplate = {
  id: string;
  name: string;
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
};