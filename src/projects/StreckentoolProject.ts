import type { CourseRect } from "../types/CourseRect";
import type { FigureInstance } from "../types/Figure";
import { DEFAULT_CONE_COLOR } from "../types/Figure";
import type { Decoration } from "../types/Decoration";
import type { Measurement } from "../types/Measurement";
import type { CourseBackgroundImage } from "../types/CourseBackgroundImage";
import type { ProjectMetadata } from "../types/ProjectMetadata";
import { createDefaultProjectMetadata } from "../types/ProjectMetadata";
import type { LayerSettings } from "../types/LayerSettings";
import { createDefaultLayerSettings } from "../types/LayerSettings";

type PersistedCourseRect = Omit<CourseRect, "locked" | "rotation"> & {
  locked?: boolean;
  rotation?: number;
};

type PersistedFigureInstance = Omit<FigureInstance, "coneColor"> & {
  coneColor?: string;
};

type PersistedCourseBackgroundImage = Omit<CourseBackgroundImage, "rotation"> & {
  rotation?: number;
};

type PersistedProjectMetadata = Partial<ProjectMetadata>;
type PersistedLayerSettings = Partial<LayerSettings>;

export type StreckentoolProject = {
  app: "streckentool";
  version: 1;
  savedAt: string;
  course: {
    rects: PersistedCourseRect[];
  };
  figures?: {
    instances: PersistedFigureInstance[];
  };
  decorations?: {
    items: Decoration[];
  };
  measurements?: {
    items: Measurement[];
  };
  backgroundImage?: PersistedCourseBackgroundImage | null;
  metadata?: PersistedProjectMetadata;
  layerSettings?: PersistedLayerSettings;
};

export type EditorState = {
  rects: CourseRect[];
  figures: FigureInstance[];
  decorations: Decoration[];
  measurements: Measurement[];
  backgroundImage: CourseBackgroundImage | null;
  metadata: ProjectMetadata;
  layerSettings: LayerSettings;
};

export function createEmptyEditorState(): EditorState {
  return {
    rects: [],
    figures: [],
    decorations: [],
    measurements: [],
    backgroundImage: null,
    metadata: createDefaultProjectMetadata(),
    layerSettings: createDefaultLayerSettings(),
  };
}

export function createStreckentoolProject(
  state: EditorState
): StreckentoolProject {
  return {
    app: "streckentool",
    version: 1,
    savedAt: new Date().toISOString(),
    course: {
      rects: state.rects,
    },
    figures: {
      instances: state.figures,
    },
    decorations: {
      items: state.decorations,
    },
    measurements: {
      items: state.measurements,
    },
    backgroundImage: state.backgroundImage,
    metadata: state.metadata,
    layerSettings: state.layerSettings,
  };
}

export function parseStreckentoolProject(text: string): EditorState {
  const parsed = JSON.parse(text) as unknown;

  if (!isProject(parsed)) {
    throw new Error("This file is not a valid Streckentool project.");
  }

  return {
    rects: parsed.course.rects.map(normalizeCourseRect),
    figures: (parsed.figures?.instances ?? []).map(normalizeFigureInstance),
    decorations: parsed.decorations?.items ?? [],
    measurements: parsed.measurements?.items ?? [],
    backgroundImage: normalizeCourseBackgroundImage(parsed.backgroundImage),
    metadata: normalizeProjectMetadata(parsed.metadata),
    layerSettings: normalizeLayerSettings(parsed.layerSettings),
  };
}

function normalizeCourseRect(rect: PersistedCourseRect): CourseRect {
  return {
    ...rect,
    locked: rect.locked === true,
    rotation:
      typeof rect.rotation === "number" && Number.isFinite(rect.rotation)
        ? rect.rotation
        : 0,
  };
}

function normalizeFigureInstance(
  figure: PersistedFigureInstance
): FigureInstance {
  return {
    ...figure,
    coneColor:
      typeof figure.coneColor === "string"
        ? figure.coneColor
        : DEFAULT_CONE_COLOR,
  };
}

function normalizeCourseBackgroundImage(
  backgroundImage: PersistedCourseBackgroundImage | null | undefined
): CourseBackgroundImage | null {
  if (!backgroundImage) {
    return null;
  }

  return {
    ...backgroundImage,
    rotation:
      typeof backgroundImage.rotation === "number" &&
      Number.isFinite(backgroundImage.rotation)
        ? backgroundImage.rotation
        : 0,
  };
}

function normalizeProjectMetadata(
  metadata: PersistedProjectMetadata | undefined
): ProjectMetadata {
  const defaults = createDefaultProjectMetadata();

  if (!metadata || !isRecord(metadata)) {
    return defaults;
  }

  return {
    title:
      typeof metadata.title === "string" ? metadata.title : defaults.title,
    clubName:
      typeof metadata.clubName === "string"
        ? metadata.clubName
        : defaults.clubName,
    eventDate:
      typeof metadata.eventDate === "string"
        ? metadata.eventDate
        : defaults.eventDate,
    authorName:
      typeof metadata.authorName === "string"
        ? metadata.authorName
        : defaults.authorName,
    insuranceNumber:
      typeof metadata.insuranceNumber === "string"
        ? metadata.insuranceNumber
        : defaults.insuranceNumber,
    observerName:
      typeof metadata.observerName === "string"
        ? metadata.observerName
        : defaults.observerName,
    notes:
      typeof metadata.notes === "string" ? metadata.notes : defaults.notes,
    showTitleBlock:
      typeof metadata.showTitleBlock === "boolean"
        ? metadata.showTitleBlock
        : defaults.showTitleBlock,
    projectLogoSrc:
      typeof metadata.projectLogoSrc === "string"
        ? metadata.projectLogoSrc
        : defaults.projectLogoSrc,
    projectLogoName:
      typeof metadata.projectLogoName === "string"
        ? metadata.projectLogoName
        : defaults.projectLogoName,
    projectLogoWidth:
      typeof metadata.projectLogoWidth === "number" &&
      Number.isFinite(metadata.projectLogoWidth)
        ? metadata.projectLogoWidth
        : defaults.projectLogoWidth,
    titleBlockWidth:
      typeof metadata.titleBlockWidth === "number" &&
      Number.isFinite(metadata.titleBlockWidth)
        ? metadata.titleBlockWidth
        : defaults.titleBlockWidth,
    titleBlockTitleFontSize:
      typeof metadata.titleBlockTitleFontSize === "number" &&
      Number.isFinite(metadata.titleBlockTitleFontSize)
        ? metadata.titleBlockTitleFontSize
        : defaults.titleBlockTitleFontSize,
    titleBlockBodyFontSize:
      typeof metadata.titleBlockBodyFontSize === "number" &&
      Number.isFinite(metadata.titleBlockBodyFontSize)
        ? metadata.titleBlockBodyFontSize
        : defaults.titleBlockBodyFontSize,
  };
}

function normalizeLayerSettings(
  layerSettings: PersistedLayerSettings | undefined
): LayerSettings {
  const defaults = createDefaultLayerSettings();

  if (!layerSettings || !isRecord(layerSettings)) {
    return defaults;
  }

  return {
    showBackground:
      typeof layerSettings.showBackground === "boolean"
        ? layerSettings.showBackground
        : defaults.showBackground,
    showWorkspaces:
      typeof layerSettings.showWorkspaces === "boolean"
        ? layerSettings.showWorkspaces
        : defaults.showWorkspaces,
    showFigures:
      typeof layerSettings.showFigures === "boolean"
        ? layerSettings.showFigures
        : defaults.showFigures,
    showDecorations:
      typeof layerSettings.showDecorations === "boolean"
        ? layerSettings.showDecorations
        : defaults.showDecorations,
    showMeasurements:
      typeof layerSettings.showMeasurements === "boolean"
        ? layerSettings.showMeasurements
        : defaults.showMeasurements,
    lockWorkspaces:
      typeof layerSettings.lockWorkspaces === "boolean"
        ? layerSettings.lockWorkspaces
        : defaults.lockWorkspaces,
  };
}

function isProject(value: unknown): value is StreckentoolProject {
  if (!isRecord(value)) return false;

  if (value.app !== "streckentool") return false;
  if (value.version !== 1) return false;
  if (!isRecord(value.course)) return false;
  if (!Array.isArray(value.course.rects)) return false;

  if (!value.course.rects.every(isCourseRect)) {
    return false;
  }

  if (value.figures !== undefined) {
    if (!isRecord(value.figures)) return false;
    if (!Array.isArray(value.figures.instances)) return false;
    if (!value.figures.instances.every(isFigureInstance)) return false;
  }

  if (value.decorations !== undefined) {
    if (!isRecord(value.decorations)) return false;
    if (!Array.isArray(value.decorations.items)) return false;
    if (!value.decorations.items.every(isDecoration)) return false;
  }

  if (value.measurements !== undefined) {
    if (!isRecord(value.measurements)) return false;
    if (!Array.isArray(value.measurements.items)) return false;
    if (!value.measurements.items.every(isMeasurement)) return false;
  }

  if (
    value.backgroundImage !== undefined &&
    value.backgroundImage !== null &&
    !isCourseBackgroundImage(value.backgroundImage)
  ) {
    return false;
  }

  if (value.metadata !== undefined && !isProjectMetadata(value.metadata)) {
    return false;
  }

  if (
    value.layerSettings !== undefined &&
    !isLayerSettings(value.layerSettings)
  ) {
    return false;
  }

  return true;
}

function isCourseRect(value: unknown): value is PersistedCourseRect {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.width === "number" &&
    typeof value.height === "number" &&
    (value.locked === undefined || typeof value.locked === "boolean") &&
    (value.rotation === undefined || typeof value.rotation === "number") &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.width) &&
    Number.isFinite(value.height) &&
    (value.rotation === undefined || Number.isFinite(value.rotation)) &&
    value.width > 0 &&
    value.height > 0
  );
}

function isFigureInstance(value: unknown): value is PersistedFigureInstance {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.templateId === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.rotation === "number" &&
    typeof value.mirrored === "boolean" &&
    (value.coneColor === undefined || typeof value.coneColor === "string") &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.rotation)
  );
}

function isDecoration(value: unknown): value is Decoration {
  if (!isRecord(value)) return false;

  const baseIsValid =
    typeof value.id === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.width === "number" &&
    typeof value.height === "number" &&
    typeof value.rotation === "number" &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.width) &&
    Number.isFinite(value.height) &&
    Number.isFinite(value.rotation) &&
    value.width > 0 &&
    value.height > 0;

  if (!baseIsValid) return false;

  if (value.type === "text") {
    return (
      typeof value.text === "string" &&
      typeof value.fontSize === "number" &&
      typeof value.color === "string" &&
      Number.isFinite(value.fontSize) &&
      value.fontSize > 0
    );
  }

  if (value.type === "image") {
    return typeof value.src === "string" && typeof value.name === "string";
  }

  if (value.type === "arrow") {
    return (
      typeof value.color === "string" &&
      (value.arrowKind === "straight" ||
        value.arrowKind === "straight-long" ||
        value.arrowKind === "curve-right" ||
        value.arrowKind === "curve-left")
    );
  }

  return false;
}

function isMeasurement(value: unknown): value is Measurement {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.x1 === "number" &&
    typeof value.y1 === "number" &&
    typeof value.x2 === "number" &&
    typeof value.y2 === "number" &&
    Number.isFinite(value.x1) &&
    Number.isFinite(value.y1) &&
    Number.isFinite(value.x2) &&
    Number.isFinite(value.y2)
  );
}

function isCourseBackgroundImage(
  value: unknown
): value is PersistedCourseBackgroundImage {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.src === "string" &&
    typeof value.name === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.width === "number" &&
    typeof value.height === "number" &&
    (value.rotation === undefined || typeof value.rotation === "number") &&
    typeof value.opacity === "number" &&
    typeof value.locked === "boolean" &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.width) &&
    Number.isFinite(value.height) &&
    (value.rotation === undefined || Number.isFinite(value.rotation)) &&
    Number.isFinite(value.opacity) &&
    value.width > 0 &&
    value.height > 0 &&
    value.opacity >= 0 &&
    value.opacity <= 1
  );
}

function isProjectMetadata(value: unknown): value is PersistedProjectMetadata {
  if (!isRecord(value)) return false;

  return (
    (value.title === undefined || typeof value.title === "string") &&
    (value.clubName === undefined || typeof value.clubName === "string") &&
    (value.eventDate === undefined || typeof value.eventDate === "string") &&
    (value.authorName === undefined || typeof value.authorName === "string") &&
    (value.insuranceNumber === undefined ||
      typeof value.insuranceNumber === "string") &&
    (value.observerName === undefined ||
      typeof value.observerName === "string") &&
    (value.notes === undefined || typeof value.notes === "string") &&
    (value.showTitleBlock === undefined ||
      typeof value.showTitleBlock === "boolean") &&
    (value.projectLogoSrc === undefined ||
      typeof value.projectLogoSrc === "string") &&
    (value.projectLogoName === undefined ||
      typeof value.projectLogoName === "string") &&
    (value.projectLogoWidth === undefined ||
      typeof value.projectLogoWidth === "number") &&
    (value.titleBlockWidth === undefined ||
      typeof value.titleBlockWidth === "number") &&
    (value.titleBlockTitleFontSize === undefined ||
      typeof value.titleBlockTitleFontSize === "number") &&
    (value.titleBlockBodyFontSize === undefined ||
      typeof value.titleBlockBodyFontSize === "number")
  );
}

function isLayerSettings(value: unknown): value is PersistedLayerSettings {
  if (!isRecord(value)) return false;

  return (
    (value.showBackground === undefined ||
      typeof value.showBackground === "boolean") &&
    (value.showWorkspaces === undefined ||
      typeof value.showWorkspaces === "boolean") &&
    (value.showFigures === undefined ||
      typeof value.showFigures === "boolean") &&
    (value.showDecorations === undefined ||
      typeof value.showDecorations === "boolean") &&
    (value.showMeasurements === undefined ||
      typeof value.showMeasurements === "boolean") &&
    (value.lockWorkspaces === undefined ||
      typeof value.lockWorkspaces === "boolean")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}