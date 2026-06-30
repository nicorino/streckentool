import type { CourseRect } from "../types/CourseRect";
import type {
  FigureElement,
  FigureInstance,
  FigureTemplate,
} from "../types/Figure";
import { isPointInsideWorkspace } from "./workspaceGeometry";
import { getResolvedFigureElements } from "../figures/figureConfig";

export type FigureBoundsWarning = {
  figureId: string;
  outsideConeCount: number;
};

export function getFigureBoundsWarnings(
  rects: CourseRect[],
  figures: FigureInstance[],
  templates: FigureTemplate[]
): FigureBoundsWarning[] {
  return figures
    .map((figure) => {
      const template = templates.find(
        (candidate) => candidate.id === figure.templateId
      );

      if (!template) {
        return null;
      }

      const worldConePoints = getResolvedFigureElements(template, figure)
        .filter(isConeElement)
        .map((cone) =>
          transformLocalPointToWorld(
            cone.x,
            cone.y,
            figure.x,
            figure.y,
            figure.rotation,
            figure.mirrored
          )
        );

      const outsideConeCount = worldConePoints.filter(
        (point) => !isPointInsideCourse(point.x, point.y, rects)
      ).length;

      if (outsideConeCount === 0) {
        return null;
      }

      return {
        figureId: figure.id,
        outsideConeCount,
      };
    })
    .filter((warning): warning is FigureBoundsWarning => warning !== null);
}

function isConeElement(
  element: FigureElement
): element is Extract<FigureElement, { type: "cone" }> {
  return element.type === "cone";
}

function transformLocalPointToWorld(
  localX: number,
  localY: number,
  worldX: number,
  worldY: number,
  rotationDegrees: number,
  mirrored: boolean
) {
  const x = mirrored ? -localX : localX;
  const y = localY;

  const angle = (rotationDegrees * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: worldX + x * cos - y * sin,
    y: worldY + x * sin + y * cos,
  };
}

function isPointInsideCourse(x: number, y: number, rects: CourseRect[]) {
  return rects.some((rect) => isPointInsideWorkspace({ x, y }, rect));
}
