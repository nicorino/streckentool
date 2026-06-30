import { CONFIGURABLE_SLALOM_TEMPLATE_ID } from "../figures/figureConfig";
import type { Decoration } from "../types/Decoration";
import { DEFAULT_CONE_COLOR } from "../types/Figure";
import { createId } from "../utils/createId";
import {
  createEmptyEditorState,
  type EditorState,
} from "./StreckentoolProject";

export function createExampleEditorState(): EditorState {
  const baseState = createEmptyEditorState();

  const titleText: Decoration = {
    id: createId(),
    type: "text",
    x: -3,
    y: -4,
    width: 18,
    height: 2.5,
    rotation: 0,
    text: "Example course",
    fontSize: 20,
    color: "#000000",
  };

  const directionArrow: Decoration = {
    id: createId(),
    type: "arrow",
    x: 28,
    y: 8,
    width: 8,
    height: 1.2,
    rotation: 0,
    arrowKind: "straight",
    color: "#000000",
  };

  return {
    ...baseState,
    rects: [
      {
        id: createId(),
        x: -5,
        y: -5,
        width: 52,
        height: 26,
        rotation: 0,
        locked: false,
      },
    ],
    figures: [
      {
        id: createId(),
        templateId: CONFIGURABLE_SLALOM_TEMPLATE_ID,
        x: 8,
        y: 5,
        rotation: 0,
        mirrored: false,
        coneColor: DEFAULT_CONE_COLOR,
        config: {
          coneCount: 6,
          coneDistanceMeters: 4,
        },
      },
    ],
    decorations: [titleText, directionArrow],
    measurements: [
      {
        id: createId(),
        x1: -5,
        y1: 22,
        x2: 47,
        y2: 22,
      },
    ],
    metadata: {
      ...baseState.metadata,
      title: "Example course",
      clubName: "Demo club",
      notes:
        "This example shows a basic course area, a configurable slalom, a direction arrow, and a measurement.",
      showTitleBlock: true,
    },
  };
}
