import type {
  FigureConfig,
  FigureElement,
  FigureInstance,
  FigureTemplate,
} from "../types/Figure";

export type FigureLocalBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const CONFIGURABLE_SLALOM_TEMPLATE_ID = "configurable-slalom";

const DEFAULT_SLALOM_CONES = 5;
const DEFAULT_SLALOM_DISTANCE = 4;
const MIN_SLALOM_CONES = 2;
const MAX_SLALOM_CONES = 10;
const MIN_SLALOM_DISTANCE = 0.5;
const MAX_SLALOM_DISTANCE = 10;

const CONFIGURABLE_SLALOM_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_SLALOM_TEMPLATE_ID,
  name: "Slalom",
  shortName: "Slalom",
  category: "Slalom",
  description:
    "Konfigurierbarer Slalom mit 2–10 Pylonen und bis zu 10 m Abstand.",
  elements: createBaseSlalomElements(
    DEFAULT_SLALOM_CONES,
    DEFAULT_SLALOM_DISTANCE
  ),
};

export function withConfigurableFigureTemplates(
  templates: FigureTemplate[]
): FigureTemplate[] {
  const withoutDuplicateConfigurable = templates.filter(
    (template) => template.id !== CONFIGURABLE_SLALOM_TEMPLATE_ID
  );

  return [CONFIGURABLE_SLALOM_TEMPLATE, ...withoutDuplicateConfigurable];
}

export function getLibraryFigureTemplates(
  templates: FigureTemplate[]
): FigureTemplate[] {
  const withConfigurable = withConfigurableFigureTemplates(templates);

  return withConfigurable.filter(
    (template) =>
      template.id === CONFIGURABLE_SLALOM_TEMPLATE_ID ||
      !isGenericSlalomVariant(template)
  );
}

export function isGenericSlalomVariant(template: FigureTemplate) {
  return /^slalom\s+\d+\s+pylonen?\s*\/\s*\d+/i.test(template.name.trim());
}

export function isConfigurableSlalomTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_SLALOM_TEMPLATE_ID ||
    isGenericSlalomVariant(template)
  );
}

/**
 * Kept for compatibility with earlier patches.
 */
export function isSlalomTemplate(template: FigureTemplate) {
  return isConfigurableSlalomTemplate(template);
}

export function createDefaultFigureConfig(
  template: FigureTemplate
): FigureConfig {
  if (!isConfigurableSlalomTemplate(template)) {
    return {};
  }

  const cones = getTemplateCones(template);

  return {
    coneCount: clampInt(
      cones.length || DEFAULT_SLALOM_CONES,
      MIN_SLALOM_CONES,
      MAX_SLALOM_CONES
    ),
    coneDistanceMeters: clampNumber(
      estimateConeDistance(cones),
      MIN_SLALOM_DISTANCE,
      MAX_SLALOM_DISTANCE
    ),
  };
}

export function normalizeFigureConfig(
  template: FigureTemplate,
  config: FigureConfig | undefined
): FigureConfig {
  if (!isConfigurableSlalomTemplate(template)) {
    return {};
  }

  const defaults = createDefaultFigureConfig(template);

  return {
    coneCount: clampInt(
      config?.coneCount ?? defaults.coneCount ?? DEFAULT_SLALOM_CONES,
      MIN_SLALOM_CONES,
      MAX_SLALOM_CONES
    ),
    coneDistanceMeters: clampNumber(
      config?.coneDistanceMeters ??
        defaults.coneDistanceMeters ??
        DEFAULT_SLALOM_DISTANCE,
      MIN_SLALOM_DISTANCE,
      MAX_SLALOM_DISTANCE
    ),
  };
}

export function getResolvedFigureElements(
  template: FigureTemplate,
  figureOrConfig?: FigureInstance | FigureConfig
): FigureElement[] {
  const config = normalizeFigureConfig(
    template,
    getConfigFromFigureOrConfig(figureOrConfig)
  );

  if (!isConfigurableSlalomTemplate(template)) {
    return template.elements;
  }

  return createBaseSlalomElements(
    config.coneCount ?? DEFAULT_SLALOM_CONES,
    config.coneDistanceMeters ?? DEFAULT_SLALOM_DISTANCE
  );
}

export function getFigureLocalBounds(
  template: FigureTemplate,
  figureOrConfig?: FigureInstance | FigureConfig
): FigureLocalBounds {
  return getElementBounds(getResolvedFigureElements(template, figureOrConfig));
}

export function getElementBounds(elements: FigureElement[]): FigureLocalBounds {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const element of elements) {
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

function getConfigFromFigureOrConfig(
  figureOrConfig: FigureInstance | FigureConfig | undefined
): FigureConfig | undefined {
  if (!figureOrConfig) {
    return undefined;
  }

  if ("templateId" in figureOrConfig) {
    return figureOrConfig.config;
  }

  return figureOrConfig;
}

function createBaseSlalomElements(
  coneCount: number,
  coneDistanceMeters: number
): FigureElement[] {
  const count = clampInt(coneCount, MIN_SLALOM_CONES, MAX_SLALOM_CONES);

  const distance = clampNumber(
    coneDistanceMeters,
    MIN_SLALOM_DISTANCE,
    MAX_SLALOM_DISTANCE
  );

  const totalLength = (count - 1) * distance;
  const startX = -totalLength / 2;
  const cones: FigureElement[] = [];

  for (let index = 0; index < count; index += 1) {
    cones.push({
      type: "cone",
      x: startX + index * distance,
      y: 0,
      radius: 0.25,
    });
  }

  return [
    {
      type: "line",
      x1: startX,
      y1: 0,
      x2: -startX,
      y2: 0,
    },
    ...cones,
  ];
}

function getTemplateCones(template: FigureTemplate) {
  return template.elements.filter(
    (element): element is Extract<FigureElement, { type: "cone" }> =>
      element.type === "cone"
  );
}

function estimateConeDistance(
  cones: Extract<FigureElement, { type: "cone" }>[]
) {
  if (cones.length < 2) {
    return DEFAULT_SLALOM_DISTANCE;
  }

  const sortedByX = [...cones].sort((a, b) => a.x - b.x);
  const sortedByY = [...cones].sort((a, b) => a.y - b.y);

  const spanX = Math.abs(sortedByX[sortedByX.length - 1].x - sortedByX[0].x);
  const spanY = Math.abs(sortedByY[sortedByY.length - 1].y - sortedByY[0].y);

  const sorted = spanX >= spanY ? sortedByX : sortedByY;
  const distances: number[] = [];

  for (let index = 1; index < sorted.length; index += 1) {
    const distance = Math.hypot(
      sorted[index].x - sorted[index - 1].x,
      sorted[index].y - sorted[index - 1].y
    );

    if (distance > 0) {
      distances.push(distance);
    }
  }

  if (distances.length === 0) {
    return DEFAULT_SLALOM_DISTANCE;
  }

  return (
    distances.reduce((sum, distance) => sum + distance, 0) / distances.length
  );
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, value));
}

function clampInt(value: number, min: number, max: number) {
  return Math.round(clampNumber(value, min, max));
}
