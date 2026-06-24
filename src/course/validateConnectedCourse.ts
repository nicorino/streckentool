import type { CourseRect } from "../types/CourseRect";
import { doWorkspacesConnect } from "./workspaceGeometry";

export type CourseValidation = {
  isValid: boolean;
  messages: string[];
  disconnectedRectIds: string[];
};

export function validateConnectedCourse(rects: CourseRect[]): CourseValidation {
  if (rects.length === 0) {
    return {
      isValid: false,
      messages: ["Add at least one workspace."],
      disconnectedRectIds: [],
    };
  }

  if (rects.length === 1) {
    return {
      isValid: true,
      messages: ["Course area is valid."],
      disconnectedRectIds: [],
    };
  }

  const connectedIds = new Set<string>([rects[0].id]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const candidate of rects) {
      if (connectedIds.has(candidate.id)) {
        continue;
      }

      const connectsToExistingWorkspace = rects.some(
        (existing) =>
          connectedIds.has(existing.id) &&
          doWorkspacesConnect(existing, candidate)
      );

      if (connectsToExistingWorkspace) {
        connectedIds.add(candidate.id);
        changed = true;
      }
    }
  }

  const disconnectedRectIds = rects
    .filter((rect) => !connectedIds.has(rect.id))
    .map((rect) => rect.id);

  if (disconnectedRectIds.length > 0) {
    return {
      isValid: false,
      messages: [
        "All workspaces must touch or overlap with the main course area.",
      ],
      disconnectedRectIds,
    };
  }

  return {
    isValid: true,
    messages: ["Course area is valid."],
    disconnectedRectIds: [],
  };
}