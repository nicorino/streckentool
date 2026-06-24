import { createId } from "../utils/createId";
import { useCallback, useEffect, useState } from "react";
import type { FigureElement, FigureTemplate } from "../types/Figure";

export const CUSTOM_FIGURE_TEMPLATES_STORAGE_KEY =
  "streckentool-custom-figure-templates-v1";

export const CUSTOM_FIGURE_TEMPLATES_CHANGE_EVENT =
  "streckentool-custom-figure-templates-change";

export function loadCustomFigureTemplates(): FigureTemplate[] {
  try {
    const rawValue = localStorage.getItem(CUSTOM_FIGURE_TEMPLATES_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(normalizeCustomFigureTemplate)
      .filter((template): template is FigureTemplate => template !== null);
  } catch (error) {
    console.warn("Could not load custom figure templates.", error);
    return [];
  }
}

export function saveCustomFigureTemplate(template: FigureTemplate) {
  const normalizedTemplate = normalizeCustomFigureTemplate(template);

  if (!normalizedTemplate) {
    throw new Error("Invalid custom figure template.");
  }

  const existingTemplates = loadCustomFigureTemplates();

  const nextTemplates = [
    ...existingTemplates.filter(
      (existingTemplate) => existingTemplate.id !== normalizedTemplate.id
    ),
    normalizedTemplate,
  ];

  saveCustomFigureTemplates(nextTemplates);
}

export function deleteCustomFigureTemplate(templateId: string) {
  const nextTemplates = loadCustomFigureTemplates().filter(
    (template) => template.id !== templateId
  );

  saveCustomFigureTemplates(nextTemplates);
}

export function saveCustomFigureTemplates(templates: FigureTemplate[]) {
  const normalizedTemplates = templates
    .map(normalizeCustomFigureTemplate)
    .filter((template): template is FigureTemplate => template !== null);

  localStorage.setItem(
    CUSTOM_FIGURE_TEMPLATES_STORAGE_KEY,
    JSON.stringify(normalizedTemplates, null, 2)
  );

  window.dispatchEvent(new CustomEvent(CUSTOM_FIGURE_TEMPLATES_CHANGE_EVENT));
}

export function importCustomFigureTemplatesFromJsonText(
  jsonText: string
): FigureTemplate[] {
  const parsedValue = JSON.parse(jsonText);
  const candidates = Array.isArray(parsedValue) ? parsedValue : [parsedValue];

  const importedTemplates = candidates
    .map(normalizeCustomFigureTemplate)
    .filter((template): template is FigureTemplate => template !== null);

  if (importedTemplates.length === 0) {
    throw new Error("No valid creator figure templates found in this JSON file.");
  }

  const existingTemplates = loadCustomFigureTemplates();

  const nextTemplates = [
    ...existingTemplates.filter(
      (existingTemplate) =>
        !importedTemplates.some(
          (importedTemplate) => importedTemplate.id === existingTemplate.id
        )
    ),
    ...importedTemplates,
  ];

  saveCustomFigureTemplates(nextTemplates);

  return importedTemplates;
}

export function useCustomFigureTemplates() {
  const [templates, setTemplates] = useState<FigureTemplate[]>(() =>
    loadCustomFigureTemplates()
  );

  const reload = useCallback(() => {
    setTemplates(loadCustomFigureTemplates());
  }, []);

  useEffect(() => {
    window.addEventListener(CUSTOM_FIGURE_TEMPLATES_CHANGE_EVENT, reload);
    window.addEventListener("storage", reload);

    return () => {
      window.removeEventListener(CUSTOM_FIGURE_TEMPLATES_CHANGE_EVENT, reload);
      window.removeEventListener("storage", reload);
    };
  }, [reload]);

  return {
    templates,
    reload,
  };
}

export function normalizeCustomFigureTemplate(
  value: unknown
): FigureTemplate | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<FigureTemplate>;

  const name =
    typeof candidate.name === "string" && candidate.name.trim()
      ? candidate.name.trim()
      : "";

  if (!name) {
    return null;
  }

  if (!Array.isArray(candidate.elements)) {
    return null;
  }

  const elements = candidate.elements
    .map(normalizeFigureElement)
    .filter((element): element is FigureElement => element !== null);

  if (elements.length === 0) {
    return null;
  }

  const id =
    typeof candidate.id === "string" && candidate.id.trim()
      ? candidate.id.trim()
      : createCustomTemplateId();

  return {
    id: id.startsWith("custom:") ? id : `custom:${id}`,
    name,
    category: "Custom",
    description:
      typeof candidate.description === "string" &&
      candidate.description.trim()
        ? candidate.description.trim()
        : undefined,
    elements,
  };
}

function normalizeFigureElement(value: unknown): FigureElement | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.type === "cone") {
    if (
      isFiniteNumber(candidate.x) &&
      isFiniteNumber(candidate.y) &&
      isFiniteNumber(candidate.radius)
    ) {
      return {
        type: "cone",
        x: candidate.x,
        y: candidate.y,
        radius: Math.max(0.01, candidate.radius),
      };
    }

    return null;
  }

  if (candidate.type === "line") {
    if (
      isFiniteNumber(candidate.x1) &&
      isFiniteNumber(candidate.y1) &&
      isFiniteNumber(candidate.x2) &&
      isFiniteNumber(candidate.y2)
    ) {
      return {
        type: "line",
        x1: candidate.x1,
        y1: candidate.y1,
        x2: candidate.x2,
        y2: candidate.y2,
      };
    }

    return null;
  }

  return null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function createCustomTemplateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `custom:${createId()}`;
  }

  return `custom:${Date.now()}-${Math.random().toString(16).slice(2)}`;
}