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
export const CONFIGURABLE_WECHSELTOR_TEMPLATE_ID = "configurable-wechseltor";
export const CONFIGURABLE_KREISEL_TEMPLATE_ID = "configurable-kreisel";
export const CONFIGURABLE_S_SPURGASSE_TEMPLATE_ID = "configurable-s-spurgasse";
export const CONFIGURABLE_Z_GASSE_TEMPLATE_ID = "configurable-z-gasse";
export const CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE_ID = "configurable-spurgasse-gerade";
export const CONFIGURABLE_GASSE_TEMPLATE_ID = "configurable-gasse";

const CONE_RADIUS = 0.25;

const DEFAULT_SLALOM_CONES = 4;
const DEFAULT_SLALOM_DISTANCE = 4;
const MIN_SLALOM_CONES = 2;
const MAX_SLALOM_CONES = 10;
const MIN_SLALOM_DISTANCE = 0.5;
const MAX_SLALOM_DISTANCE = 10;

const WECHSELTOR_GATE_WIDTH = 1.65;
const DEFAULT_WECHSELTOR_MIDDLE_GAP = 2.5;
const MIN_WECHSELTOR_MIDDLE_GAP = 1.5;
const MAX_WECHSELTOR_MIDDLE_GAP = 4;

const KREISEL_INNER_OUTSIDE_DIAMETER = 10;
const KREISEL_RING_CLEAR_SPACE = 1.65;
const KREISEL_CONE_CENTER_SPACING = 1;
const KREISEL_ENTRY_WIDTH = 3;
const DEFAULT_KREISEL_ENTRY_EXIT_CONES = 5;
const MIN_KREISEL_ENTRY_EXIT_CONES = 3;
const MAX_KREISEL_ENTRY_EXIT_CONES = 12;

const S_SPURGASSE_LANE_DISTANCE = 1.65;
const S_SPURGASSE_CONE_CLEAR_SPACE = 0.5;
const S_SPURGASSE_CONE_CENTER_SPACING =
  S_SPURGASSE_CONE_CLEAR_SPACE + CONE_RADIUS * 2;
const DEFAULT_S_SPURGASSE_CURVE_AMOUNT = 3;
const DEFAULT_S_SPURGASSE_LENGTH_METERS = 12;
const MIN_S_SPURGASSE_LENGTH_METERS = 3;
const MAX_S_SPURGASSE_LENGTH_METERS = 30;
const MIN_S_SPURGASSE_CURVE_AMOUNT = 0;
const MAX_S_SPURGASSE_CURVE_AMOUNT = 6;

const Z_GASSE_LANE_WIDTH = 1.65;
const Z_GASSE_CONE_CLEAR_SPACE = 0.5;
const Z_GASSE_CONE_CENTER_SPACING = Z_GASSE_CONE_CLEAR_SPACE + CONE_RADIUS * 2;
const Z_GASSE_CONES_PER_ROW = 5;
const DEFAULT_Z_GASSE_GATE_GAP_METERS = 2.5;
const MIN_Z_GASSE_GATE_GAP_METERS = 2;
const MAX_Z_GASSE_GATE_GAP_METERS = 4;
const DEFAULT_Z_GASSE_MIDDLE_GATE_OFFSET_CONES = 0;
const MIN_Z_GASSE_MIDDLE_GATE_OFFSET_CONES = -1;
const MAX_Z_GASSE_MIDDLE_GATE_OFFSET_CONES = 1;

const SPURGASSE_GERADE_LANE_WIDTH = 1.65;
const SPURGASSE_GERADE_CONE_CLEAR_SPACE = 0.5;
const SPURGASSE_GERADE_CONE_CENTER_SPACING =
  SPURGASSE_GERADE_CONE_CLEAR_SPACE + CONE_RADIUS * 2;
const DEFAULT_SPURGASSE_GERADE_LENGTH_METERS = 8;
const MIN_SPURGASSE_GERADE_LENGTH_METERS = 1;
const MAX_SPURGASSE_GERADE_LENGTH_METERS = 30;

const GASSE_LANE_WIDTH = 1.65;
const GASSE_CONE_CENTER_SPACING = CONE_RADIUS * 2;
const DEFAULT_GASSE_CONE_COUNT = 3;
const MIN_GASSE_CONE_COUNT = 3;
const MAX_GASSE_CONE_COUNT = 5;

const CONFIGURABLE_SLALOM_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_SLALOM_TEMPLATE_ID,
  name: "Slalom",
  shortName: "Slalom",
  category: "Slalom",
  description:
    "Konfigurierbarer Slalom mit 2–10 Pylonen und bis zu 10 m Abstand.",
  elements: createBaseSlalomElements(
    DEFAULT_SLALOM_CONES,
    DEFAULT_SLALOM_DISTANCE,
    "left"
  ),
};

const CONFIGURABLE_WECHSELTOR_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_WECHSELTOR_TEMPLATE_ID,
  name: "Wechseltor",
  shortName: "Wechseltor",
  category: "Gates",
  description:
    "Zwei Pylonentore in einer Linie. Torbreite je 1,65 m, Mittelabstand 1,5–4 m. Spiegeln wechselt die Richtung.",
  elements: createBaseWechseltorElements(DEFAULT_WECHSELTOR_MIDDLE_GAP),
};

const CONFIGURABLE_KREISEL_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_KREISEL_TEMPLATE_ID,
  name: "Kreisel",
  shortName: "Kreisel",
  category: "Other",
  description:
    "Innenkreis außen 10 m, 1,65 m Abstand zwischen den Kreisen. Ein- und Ausfahrt über Anzahl der Pylonen dazwischen einstellbar.",
  elements: createBaseKreiselElements(DEFAULT_KREISEL_ENTRY_EXIT_CONES),
};

const CONFIGURABLE_S_SPURGASSE_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_S_SPURGASSE_TEMPLATE_ID,
  name: "S-Spurgasse",
  shortName: "S-Spurgasse",
  category: "Gates",
  description:
    "S-förmige Spurgasse mit 1,65 m Abstand zwischen den Reihen und 50 cm Abstand zwischen Pylonen.",
  elements: createBaseSSpurgasseElements(DEFAULT_S_SPURGASSE_CURVE_AMOUNT, DEFAULT_S_SPURGASSE_LENGTH_METERS),
};

const CONFIGURABLE_Z_GASSE_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_Z_GASSE_TEMPLATE_ID,
  name: "Z-Gasse",
  shortName: "Z-Gasse",
  category: "Gates",
  description:
    "Drei lange Gassen mit 1,65 m Breite, 50 cm Pylonenabstand und 2-4 m Abstand zwischen den Gassen.",
  elements: createBaseZGasseElements(
    DEFAULT_Z_GASSE_GATE_GAP_METERS,
    DEFAULT_Z_GASSE_MIDDLE_GATE_OFFSET_CONES
  ),
};

const CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE_ID,
  name: "Spurgasse gerade",
  shortName: "Spurgasse gerade",
  category: "Gates",
  description:
    "Gerade Spurgasse mit 1,65 m Breite und einstellbarer Länge.",
  elements: createBaseSpurgasseGeradeElements(
    DEFAULT_SPURGASSE_GERADE_LENGTH_METERS
  ),
};

const CONFIGURABLE_GASSE_TEMPLATE: FigureTemplate = {
  id: CONFIGURABLE_GASSE_TEMPLATE_ID,
  name: "Gasse",
  shortName: "Gasse",
  category: "Gates",
  description:
    "Kurze Gasse mit 1,65 m Breite und 3-5 Pylonen pro Seite.",
  elements: createBaseGasseElements(DEFAULT_GASSE_CONE_COUNT),
};

export function withConfigurableFigureTemplates(
  templates: FigureTemplate[]
): FigureTemplate[] {
  const withoutDuplicateConfigurable = templates.filter(
    (template) =>
      template.id !== CONFIGURABLE_SLALOM_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_WECHSELTOR_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_KREISEL_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_S_SPURGASSE_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_Z_GASSE_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE_ID &&
      template.id !== CONFIGURABLE_GASSE_TEMPLATE_ID
  );

  return [
    CONFIGURABLE_SLALOM_TEMPLATE,
    CONFIGURABLE_WECHSELTOR_TEMPLATE,
    CONFIGURABLE_KREISEL_TEMPLATE,
    CONFIGURABLE_S_SPURGASSE_TEMPLATE,
    CONFIGURABLE_Z_GASSE_TEMPLATE,
    CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE,
    CONFIGURABLE_GASSE_TEMPLATE,
    ...withoutDuplicateConfigurable,
  ];
}

export function getLibraryFigureTemplates(
  templates: FigureTemplate[]
): FigureTemplate[] {
  const withConfigurable = withConfigurableFigureTemplates(templates);

  return withConfigurable.filter(
    (template) =>
      template.id === CONFIGURABLE_SLALOM_TEMPLATE_ID ||
      template.id === CONFIGURABLE_WECHSELTOR_TEMPLATE_ID ||
      template.id === CONFIGURABLE_KREISEL_TEMPLATE_ID ||
      template.id === CONFIGURABLE_S_SPURGASSE_TEMPLATE_ID ||
      template.id === CONFIGURABLE_Z_GASSE_TEMPLATE_ID ||
      template.id === CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE_ID ||
      template.id === CONFIGURABLE_GASSE_TEMPLATE_ID ||
      (!isGenericSlalomVariant(template) &&
        !isGenericWechseltorVariant(template) &&
        !isGenericKreiselVariant(template) &&
        !isGenericSSpurgasseVariant(template) &&
        !isGenericZGasseVariant(template) &&
        !isGenericSpurgasseGeradeVariant(template))
  );
}

export function isGenericSlalomVariant(template: FigureTemplate) {
  return /^slalom\s+\d+\s+pylonen?\s*\/\s*\d+/i.test(template.name.trim());
}

export function isGenericWechseltorVariant(template: FigureTemplate) {
  const text = `${template.id} ${template.name} ${template.shortName ?? ""}`;

  return /wechseltor/i.test(text);
}

export function isGenericKreiselVariant(template: FigureTemplate) {
  const text = `${template.id} ${template.name} ${template.shortName ?? ""}`;

  return /kreisel/i.test(text);
}

export function isGenericSSpurgasseVariant(template: FigureTemplate) {
  const text = `${template.id} ${template.name} ${template.shortName ?? ""}`;

  return /s[-\s]?spurgasse/i.test(text);
}

export function isGenericZGasseVariant(template: FigureTemplate) {
  const text = `${template.id} ${template.name} ${template.shortName ?? ""}`;

  return /z[-\s]?gasse/i.test(text);
}

export function isGenericSpurgasseGeradeVariant(template: FigureTemplate) {
  const text = `${template.id} ${template.name} ${template.shortName ?? ""}`;

  return /spurgasse\s+gerade/i.test(text);
}

export function isConfigurableSlalomTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_SLALOM_TEMPLATE_ID ||
    isGenericSlalomVariant(template)
  );
}

export function isConfigurableWechseltorTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_WECHSELTOR_TEMPLATE_ID ||
    isGenericWechseltorVariant(template)
  );
}

export function isConfigurableKreiselTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_KREISEL_TEMPLATE_ID ||
    isGenericKreiselVariant(template)
  );
}

export function isConfigurableSSpurgasseTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_S_SPURGASSE_TEMPLATE_ID ||
    isGenericSSpurgasseVariant(template)
  );
}

export function isConfigurableZGasseTemplate(template: FigureTemplate) {
  return (
    template.id === CONFIGURABLE_Z_GASSE_TEMPLATE_ID ||
    isGenericZGasseVariant(template)
  );
}

export function isConfigurableSpurgasseGeradeTemplate(
  template: FigureTemplate
) {
  return (
    template.id === CONFIGURABLE_SPURGASSE_GERADE_TEMPLATE_ID ||
    isGenericSpurgasseGeradeVariant(template)
  );
}

export function isConfigurableGasseTemplate(template: FigureTemplate) {
  return template.id === CONFIGURABLE_GASSE_TEMPLATE_ID;
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
  if (isConfigurableSlalomTemplate(template)) {
    return {
      coneCount: DEFAULT_SLALOM_CONES,
      coneDistanceMeters: DEFAULT_SLALOM_DISTANCE,
      slalomFirstConeOrientation: "left",
    };
  }

  if (isConfigurableWechseltorTemplate(template)) {
    return {
      wechseltorMiddleGapMeters: DEFAULT_WECHSELTOR_MIDDLE_GAP,
    };
  }

  if (isConfigurableKreiselTemplate(template)) {
    return {
      kreiselEntryExitConeCount: DEFAULT_KREISEL_ENTRY_EXIT_CONES,
    };
  }

  if (isConfigurableSSpurgasseTemplate(template)) {
    return {
      sSpurgasseCurveAmount: DEFAULT_S_SPURGASSE_CURVE_AMOUNT,
      sSpurgasseLengthMeters: DEFAULT_S_SPURGASSE_LENGTH_METERS,
    };
  }

  if (isConfigurableZGasseTemplate(template)) {
    return {
      zGasseGateGapMeters: DEFAULT_Z_GASSE_GATE_GAP_METERS,
      zGasseMiddleGateOffsetCones: DEFAULT_Z_GASSE_MIDDLE_GATE_OFFSET_CONES,
    };
  }

  if (isConfigurableSpurgasseGeradeTemplate(template)) {
    return {
      spurgasseGeradeLengthMeters: DEFAULT_SPURGASSE_GERADE_LENGTH_METERS,
    };
  }

  if (isConfigurableGasseTemplate(template)) {
    return {
      gasseConeCount: DEFAULT_GASSE_CONE_COUNT,
    };
  }

  return {};
}

export function normalizeFigureConfig(
  template: FigureTemplate,
  config: FigureConfig | undefined
): FigureConfig {
  if (isConfigurableSlalomTemplate(template)) {
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
      slalomFirstConeOrientation:
        config?.slalomFirstConeOrientation === "right" ? "right" : "left",
    };
  }

  if (isConfigurableWechseltorTemplate(template)) {
    return {
      wechseltorMiddleGapMeters: clampNumber(
        config?.wechseltorMiddleGapMeters ?? DEFAULT_WECHSELTOR_MIDDLE_GAP,
        MIN_WECHSELTOR_MIDDLE_GAP,
        MAX_WECHSELTOR_MIDDLE_GAP
      ),
    };
  }

  if (isConfigurableKreiselTemplate(template)) {
    return {
      kreiselEntryExitConeCount: clampInt(
        config?.kreiselEntryExitConeCount ?? DEFAULT_KREISEL_ENTRY_EXIT_CONES,
        MIN_KREISEL_ENTRY_EXIT_CONES,
        MAX_KREISEL_ENTRY_EXIT_CONES
      ),
    };
  }

  if (isConfigurableSSpurgasseTemplate(template)) {
    return {
      sSpurgasseCurveAmount: clampNumber(
        config?.sSpurgasseCurveAmount ?? DEFAULT_S_SPURGASSE_CURVE_AMOUNT,
        MIN_S_SPURGASSE_CURVE_AMOUNT,
        MAX_S_SPURGASSE_CURVE_AMOUNT
      ),
      sSpurgasseLengthMeters: clampNumber(
        config?.sSpurgasseLengthMeters ?? DEFAULT_S_SPURGASSE_LENGTH_METERS,
        MIN_S_SPURGASSE_LENGTH_METERS,
        MAX_S_SPURGASSE_LENGTH_METERS
      ),
    };
  }

  if (isConfigurableZGasseTemplate(template)) {
    return {
      zGasseGateGapMeters: clampNumber(
        config?.zGasseGateGapMeters ?? DEFAULT_Z_GASSE_GATE_GAP_METERS,
        MIN_Z_GASSE_GATE_GAP_METERS,
        MAX_Z_GASSE_GATE_GAP_METERS
      ),
      zGasseMiddleGateOffsetCones: clampInt(
        config?.zGasseMiddleGateOffsetCones ??
          DEFAULT_Z_GASSE_MIDDLE_GATE_OFFSET_CONES,
        MIN_Z_GASSE_MIDDLE_GATE_OFFSET_CONES,
        MAX_Z_GASSE_MIDDLE_GATE_OFFSET_CONES
      ),
    };
  }

  if (isConfigurableSpurgasseGeradeTemplate(template)) {
    return {
      spurgasseGeradeLengthMeters: clampNumber(
        config?.spurgasseGeradeLengthMeters ??
          DEFAULT_SPURGASSE_GERADE_LENGTH_METERS,
        MIN_SPURGASSE_GERADE_LENGTH_METERS,
        MAX_SPURGASSE_GERADE_LENGTH_METERS
      ),
    };
  }

  if (isConfigurableGasseTemplate(template)) {
    return {
      gasseConeCount: clampInt(
        config?.gasseConeCount ?? DEFAULT_GASSE_CONE_COUNT,
        MIN_GASSE_CONE_COUNT,
        MAX_GASSE_CONE_COUNT
      ),
    };
  }

  return {};
}

export function getResolvedFigureElements(
  template: FigureTemplate,
  figureOrConfig?: FigureInstance | FigureConfig
): FigureElement[] {
  const config = normalizeFigureConfig(
    template,
    getConfigFromFigureOrConfig(figureOrConfig)
  );

  if (isConfigurableSlalomTemplate(template)) {
    return createBaseSlalomElements(
      config.coneCount ?? DEFAULT_SLALOM_CONES,
      config.coneDistanceMeters ?? DEFAULT_SLALOM_DISTANCE,
      config.slalomFirstConeOrientation === "right" ? "right" : "left"
    );
  }

  if (isConfigurableWechseltorTemplate(template)) {
    return createBaseWechseltorElements(
      config.wechseltorMiddleGapMeters ?? DEFAULT_WECHSELTOR_MIDDLE_GAP
    );
  }

  if (isConfigurableKreiselTemplate(template)) {
    return createBaseKreiselElements(
      config.kreiselEntryExitConeCount ?? DEFAULT_KREISEL_ENTRY_EXIT_CONES
    );
  }

  if (isConfigurableSSpurgasseTemplate(template)) {
    return createBaseSSpurgasseElements(
      config.sSpurgasseCurveAmount ?? DEFAULT_S_SPURGASSE_CURVE_AMOUNT,
      config.sSpurgasseLengthMeters ?? DEFAULT_S_SPURGASSE_LENGTH_METERS
    );
  }

  if (isConfigurableZGasseTemplate(template)) {
    return createBaseZGasseElements(
      config.zGasseGateGapMeters ?? DEFAULT_Z_GASSE_GATE_GAP_METERS,
      config.zGasseMiddleGateOffsetCones ??
        DEFAULT_Z_GASSE_MIDDLE_GATE_OFFSET_CONES
    );
  }

  if (isConfigurableSpurgasseGeradeTemplate(template)) {
    return createBaseSpurgasseGeradeElements(
      config.spurgasseGeradeLengthMeters ??
        DEFAULT_SPURGASSE_GERADE_LENGTH_METERS
    );
  }

  if (isConfigurableGasseTemplate(template)) {
    return createBaseGasseElements(config.gasseConeCount ?? DEFAULT_GASSE_CONE_COUNT);
  }

  return template.elements;
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
  coneDistanceMeters: number,
  firstConeOrientation: "left" | "right"
): FigureElement[] {
  const count = clampInt(coneCount, MIN_SLALOM_CONES, MAX_SLALOM_CONES);

  const distance = clampNumber(
    coneDistanceMeters,
    MIN_SLALOM_DISTANCE,
    MAX_SLALOM_DISTANCE
  );

  const totalLength = (count - 1) * distance;
  const startX = -totalLength / 2;

  const mainCones: FigureElement[] = [];
  const indicatorCones: FigureElement[] = [];

  const indicatorOffset = 0.85;
  const indicatorRadius = CONE_RADIUS * 0.85;

  for (let index = 0; index < count; index += 1) {
    const x = startX + index * distance;

    const side =
      index % 2 === 0
        ? firstConeOrientation
        : oppositeOrientation(firstConeOrientation);

    // side === "left" keeps the marker below the cone.
    // side === "right" keeps the marker above the cone.
    // The marker itself points back toward the main cone.
    const indicatorY = side === "left" ? indicatorOffset : -indicatorOffset;
    const indicatorOrientation = side === "left" ? "up" : "down";

    mainCones.push({
      type: "cone",
      x,
      y: 0,
      radius: CONE_RADIUS,
    });

    indicatorCones.push({
      type: "cone",
      x,
      y: indicatorY,
      radius: indicatorRadius,
      orientation: indicatorOrientation,
    });
  }

  return [...mainCones, ...indicatorCones];
}

function createBaseWechseltorElements(middleGapMeters: number): FigureElement[] {
  const middleGap = clampNumber(
    middleGapMeters,
    MIN_WECHSELTOR_MIDDLE_GAP,
    MAX_WECHSELTOR_MIDDLE_GAP
  );

  const halfGap = middleGap / 2;

  return [
    {
      type: "cone",
      x: -(halfGap + WECHSELTOR_GATE_WIDTH),
      y: 0,
      radius: CONE_RADIUS,
    },
    {
      type: "cone",
      x: -halfGap,
      y: 0,
      radius: CONE_RADIUS,
    },
    {
      type: "cone",
      x: 0,
      y: 0,
      radius: 0.42,
      orientation: "left",
    },
    {
      type: "cone",
      x: halfGap,
      y: 0,
      radius: CONE_RADIUS,
    },
    {
      type: "cone",
      x: halfGap + WECHSELTOR_GATE_WIDTH,
      y: 0,
      radius: CONE_RADIUS,
    },
  ];
}

function createBaseKreiselElements(entryExitConeCount: number): FigureElement[] {
  const conesBetweenEntryAndExit = clampInt(
    entryExitConeCount,
    MIN_KREISEL_ENTRY_EXIT_CONES,
    MAX_KREISEL_ENTRY_EXIT_CONES
  );

  const innerCenterRadius = KREISEL_INNER_OUTSIDE_DIAMETER / 2 - CONE_RADIUS;
  const outerCenterRadius =
    innerCenterRadius + CONE_RADIUS * 2 + KREISEL_RING_CLEAR_SPACE;

  // The configurable value describes the number of regular outer-ring cones
  // between entry and exit. Use the outer ring for this spacing because that is
  // the visible entry/exit side of the figure.
  const entryExitAngle =
    ((conesBetweenEntryAndExit + 1) * KREISEL_CONE_CENTER_SPACING) /
    outerCenterRadius;

  const entryAngle = Math.PI - entryExitAngle / 2;
  const exitAngle = Math.PI + entryExitAngle / 2;

  const innerStep = KREISEL_CONE_CENTER_SPACING / innerCenterRadius;
  const outerStep = KREISEL_CONE_CENTER_SPACING / outerCenterRadius;

  const openingHalfAngle = KREISEL_ENTRY_WIDTH / outerCenterRadius / 2;

  return [
    // Inner circle stays complete. Only the outer circle receives openings.
    ...createRingCones(innerCenterRadius, innerStep, []),
    ...createRingCones(outerCenterRadius, outerStep, [
      { angle: entryAngle, halfAngle: openingHalfAngle },
      { angle: exitAngle, halfAngle: openingHalfAngle },
    ]),
    // Indicator cones disabled for now.

  ];
}

function createBaseSSpurgasseElements(curveAmountMeters: number, lengthMetersInput: number): FigureElement[] {
  const curveAmount = clampNumber(
    curveAmountMeters,
    MIN_S_SPURGASSE_CURVE_AMOUNT,
    MAX_S_SPURGASSE_CURVE_AMOUNT
  );

  const laneDistance = S_SPURGASSE_LANE_DISTANCE;
  const lengthMeters = clampNumber(
    lengthMetersInput,
    MIN_S_SPURGASSE_LENGTH_METERS,
    MAX_S_SPURGASSE_LENGTH_METERS
  );
  const sampleCount = Math.max(80, Math.round(lengthMeters * 18));

  const upperCurve: { x: number; y: number }[] = [];
  const lowerCurve: { x: number; y: number }[] = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const t = index / sampleCount;
    const x = (t - 0.5) * lengthMeters;

    // Smooth S-centerline. Curve amount controls the vertical shift.
    const smooth = t * t * (3 - 2 * t);
    const y = (smooth - 0.5) * curveAmount;

    // Derivative of the smoothstep centerline.
    const dyDx = (6 * t * (1 - t) * curveAmount) / lengthMeters;
    const normalLength = Math.hypot(-dyDx, 1);
    const normalX = -dyDx / normalLength;
    const normalY = 1 / normalLength;

    upperCurve.push({
      x: x + normalX * (laneDistance / 2),
      y: y + normalY * (laneDistance / 2),
    });

    lowerCurve.push({
      x: x - normalX * (laneDistance / 2),
      y: y - normalY * (laneDistance / 2),
    });
  }

  return [
    ...samplePolylineCones(upperCurve, S_SPURGASSE_CONE_CENTER_SPACING),
    ...samplePolylineCones(lowerCurve, S_SPURGASSE_CONE_CENTER_SPACING),
  ];
}

function createBaseZGasseElements(
  gateGapMeters: number,
  middleGateOffsetCones: number
): FigureElement[] {
  const gateGap = clampNumber(
    gateGapMeters,
    MIN_Z_GASSE_GATE_GAP_METERS,
    MAX_Z_GASSE_GATE_GAP_METERS
  );
  const middleOffset = clampInt(
    middleGateOffsetCones,
    MIN_Z_GASSE_MIDDLE_GATE_OFFSET_CONES,
    MAX_Z_GASSE_MIDDLE_GATE_OFFSET_CONES
  );

  const centerDistance = Z_GASSE_LANE_WIDTH + gateGap;
  const gateCenters = [-centerDistance, 0, centerDistance];
  const rowHalfWidth = Z_GASSE_LANE_WIDTH / 2;
  const firstConeY =
    -((Z_GASSE_CONES_PER_ROW - 1) * Z_GASSE_CONE_CENTER_SPACING) / 2;

  return gateCenters.flatMap((gateCenterX, gateIndex) => {
    const gateOffsetY =
      gateIndex === 1 ? middleOffset * Z_GASSE_CONE_CENTER_SPACING : 0;

    return Array.from({ length: Z_GASSE_CONES_PER_ROW }, (_value, coneIndex) => {
      const y =
        firstConeY + coneIndex * Z_GASSE_CONE_CENTER_SPACING + gateOffsetY;

      return [
        {
          type: "cone" as const,
          x: gateCenterX - rowHalfWidth,
          y,
          radius: CONE_RADIUS,
        },
        {
          type: "cone" as const,
          x: gateCenterX + rowHalfWidth,
          y,
          radius: CONE_RADIUS,
        },
      ];
    }).flat();
  });
}

function createBaseSpurgasseGeradeElements(lengthMetersInput: number): FigureElement[] {
  const lengthMeters = clampNumber(
    lengthMetersInput,
    MIN_SPURGASSE_GERADE_LENGTH_METERS,
    MAX_SPURGASSE_GERADE_LENGTH_METERS
  );
  const coneCount = Math.max(
    2,
    Math.floor(lengthMeters / SPURGASSE_GERADE_CONE_CENTER_SPACING) + 1
  );
  const actualLength = (coneCount - 1) * SPURGASSE_GERADE_CONE_CENTER_SPACING;
  const startX = -actualLength / 2;
  const halfWidth = SPURGASSE_GERADE_LANE_WIDTH / 2;

  return Array.from({ length: coneCount }, (_value, index) => {
    const x = startX + index * SPURGASSE_GERADE_CONE_CENTER_SPACING;

    return [
      { type: "cone" as const, x, y: -halfWidth, radius: CONE_RADIUS },
      { type: "cone" as const, x, y: halfWidth, radius: CONE_RADIUS },
    ];
  }).flat();
}

function createBaseGasseElements(coneCountInput: number): FigureElement[] {
  const coneCount = clampInt(
    coneCountInput,
    MIN_GASSE_CONE_COUNT,
    MAX_GASSE_CONE_COUNT
  );
  const halfWidth = GASSE_LANE_WIDTH / 2;
  const startY = -((coneCount - 1) * GASSE_CONE_CENTER_SPACING) / 2;

  return Array.from({ length: coneCount }, (_value, index) => {
    const y = startY + index * GASSE_CONE_CENTER_SPACING;

    return [
      { type: "cone" as const, x: -halfWidth, y, radius: CONE_RADIUS },
      { type: "cone" as const, x: halfWidth, y, radius: CONE_RADIUS },
    ];
  }).flat();
}

function samplePolylineCones(
  points: { x: number; y: number }[],
  spacing: number
): FigureElement[] {
  const cones: FigureElement[] = [];

  if (points.length === 0) {
    return cones;
  }

  let previous = points[0];
  let distanceSinceLastCone = 0;

  cones.push({
    type: "cone",
    x: previous.x,
    y: previous.y,
    radius: CONE_RADIUS,
  });

  for (let index = 1; index < points.length; index += 1) {
    let current = points[index];
    let segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);

    while (distanceSinceLastCone + segmentLength >= spacing) {
      const remaining = spacing - distanceSinceLastCone;
      const ratio = segmentLength === 0 ? 0 : remaining / segmentLength;

      const conePoint = {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio,
      };

      cones.push({
        type: "cone",
        x: conePoint.x,
        y: conePoint.y,
        radius: CONE_RADIUS,
      });

      previous = conePoint;
      segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);
      distanceSinceLastCone = 0;
    }

    distanceSinceLastCone += segmentLength;
    previous = current;
  }

  return cones;
}

function createRingCones(
  radius: number,
  stepAngle: number,
  openings: { angle: number; halfAngle: number }[]
): FigureElement[] {
  const coneCount = Math.max(8, Math.round((Math.PI * 2) / stepAngle));
  const cones: FigureElement[] = [];

  for (let index = 0; index < coneCount; index += 1) {
    const angle = (index / coneCount) * Math.PI * 2;

    if (
      openings.some(
        (opening) =>
          angularDistance(angle, opening.angle) <= opening.halfAngle
      )
    ) {
      continue;
    }

    cones.push({
      type: "cone",
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      radius: CONE_RADIUS,
    });
  }

  return cones;
}

function oppositeOrientation(orientation: "left" | "right") {
  return orientation === "left" ? "right" : "left";
}

function angularDistance(a: number, b: number) {
  const difference = Math.abs(normalizeAngle(a - b));

  return Math.min(difference, Math.PI * 2 - difference);
}

function normalizeAngle(angle: number) {
  let result = angle % (Math.PI * 2);

  if (result < 0) {
    result += Math.PI * 2;
  }

  return result;
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
