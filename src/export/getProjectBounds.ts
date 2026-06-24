import type { CourseRect } from "../types/CourseRect";
import type { FigureInstance, FigureTemplate } from "../types/Figure";
import type { Decoration } from "../types/Decoration";
import type { Measurement } from "../types/Measurement";
import { getWorkspaceCorners } from "../course/workspaceGeometry";

export type ExportFormat = "content" | "a4-landscape" | "a4-portrait";

export type ProjectBoundsMeters = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type MutableBounds = ProjectBoundsMeters & {
  hasContent: boolean;
};

type LocalBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function getProjectBounds(
  rects: CourseRect[],
  figures: FigureInstance[],
  templates: FigureTemplate[],
  decorations: Decoration[] = [],
  measurements: Measurement[] = [],
  marginMeters = 2
): ProjectBoundsMeters {
  const bounds: MutableBounds = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    hasContent: false,
  };

  for (const rect of rects) {
    for (const corner of getWorkspaceCorners(rect)) {
      addPoint(bounds, corner.x, corner.y);
    }
  }

  for (const figure of figures) {
    const template = templates.find(
      (candidate) => candidate.id === figure.templateId
    );

    if (!template) continue;

    addRotatedLocalBounds(bounds, getTemplateBounds(template), {
      x: figure.x,
      y: figure.y,
      rotation: figure.rotation,
      mirrored: figure.mirrored,
    });
  }

  for (const decoration of decorations) {
    addRotatedLocalBounds(
      bounds,
      {
        left: 0,
        top: 0,
        right: decoration.width,
        bottom: decoration.height,
      },
      {
        x: decoration.x,
        y: decoration.y,
        rotation: decoration.rotation,
        mirrored: false,
      }
    );
  }

  for (const measurement of measurements) {
    addPoint(bounds, measurement.x1, measurement.y1);
    addPoint(bounds, measurement.x2, measurement.y2);
  }

  if (!bounds.hasContent) {
    return {
      left: 0,
      top: 0,
      right: 40,
      bottom: 30,
    };
  }

  return {
    left: Math.max(0, bounds.left - marginMeters),
    top: Math.max(0, bounds.top - marginMeters),
    right: bounds.right + marginMeters,
    bottom: bounds.bottom + marginMeters,
  };
}

export function getExportBounds(
  rects: CourseRect[],
  figures: FigureInstance[],
  templates: FigureTemplate[],
  decorations: Decoration[],
  measurements: Measurement[],
  format: ExportFormat
): ProjectBoundsMeters {
  const contentBounds = getProjectBounds(
    rects,
    figures,
    templates,
    decorations,
    measurements,
    2
  );

  if (format === "content") {
    return contentBounds;
  }

  const a4LandscapeAspect = 297 / 210;
  const a4PortraitAspect = 210 / 297;

  const targetAspect =
    format === "a4-landscape" ? a4LandscapeAspect : a4PortraitAspect;

  return expandBoundsToAspectRatio(contentBounds, targetAspect);
}

export function getExportFormatLabel(format: ExportFormat) {
  if (format === "content") return "Content bounds";
  if (format === "a4-landscape") return "DIN A4 landscape";
  return "DIN A4 portrait";
}

function addRotatedLocalBounds(
  bounds: MutableBounds,
  localBounds: LocalBounds,
  transform: {
    x: number;
    y: number;
    rotation: number;
    mirrored: boolean;
  }
) {
  const corners = [
    { x: localBounds.left, y: localBounds.top },
    { x: localBounds.right, y: localBounds.top },
    { x: localBounds.right, y: localBounds.bottom },
    { x: localBounds.left, y: localBounds.bottom },
  ];

  const angle = (transform.rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (const corner of corners) {
    const localX = transform.mirrored ? -corner.x : corner.x;

    const worldX = transform.x + localX * cos - corner.y * sin;
    const worldY = transform.y + localX * sin + corner.y * cos;

    addPoint(bounds, worldX, worldY);
  }
}

function expandBoundsToAspectRatio(
  bounds: ProjectBoundsMeters,
  targetAspect: number
): ProjectBoundsMeters {
  const currentWidth = bounds.right - bounds.left;
  const currentHeight = bounds.bottom - bounds.top;
  const currentAspect = currentWidth / currentHeight;

  let nextWidth = currentWidth;
  let nextHeight = currentHeight;

  if (currentAspect > targetAspect) {
    nextHeight = currentWidth / targetAspect;
  } else {
    nextWidth = currentHeight * targetAspect;
  }

  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;

  let left = centerX - nextWidth / 2;
  let top = centerY - nextHeight / 2;
  let right = centerX + nextWidth / 2;
  let bottom = centerY + nextHeight / 2;

  if (left < 0) {
    right += -left;
    left = 0;
  }

  if (top < 0) {
    bottom += -top;
    top = 0;
  }

  return {
    left,
    top,
    right,
    bottom,
  };
}

function addPoint(bounds: MutableBounds, x: number, y: number) {
  if (!bounds.hasContent) {
    bounds.left = x;
    bounds.right = x;
    bounds.top = y;
    bounds.bottom = y;
    bounds.hasContent = true;
    return;
  }

  bounds.left = Math.min(bounds.left, x);
  bounds.right = Math.max(bounds.right, x);
  bounds.top = Math.min(bounds.top, y);
  bounds.bottom = Math.max(bounds.bottom, y);
}

function getTemplateBounds(template: FigureTemplate) {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const element of template.elements) {
    if (element.type === "cone") {
      xs.push(element.x - element.radius, element.x + element.radius);
      ys.push(element.y - element.radius, element.y + element.radius);
    } else {
      xs.push(element.x1, element.x2);
      ys.push(element.y1, element.y2);
    }
  }

  if (xs.length === 0 || ys.length === 0) {
    return {
      left: -0.5,
      right: 0.5,
      top: -0.5,
      bottom: 0.5,
    };
  }

  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}