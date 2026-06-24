import type { FigureTemplate } from "../types/Figure";

export const FIGURE_TEMPLATES: FigureTemplate[] = [
  {
    id: "single-cone",
    name: "Single cone",
    description: "One cone marker.",
    elements: [
      {
        type: "cone",
        x: 0,
        y: 0,
        radius: 0.25,
      },
    ],
  },
  {
    id: "gate-2m",
    name: "Gate 2 m",
    description: "Two cones with 2 m distance.",
    elements: [
      {
        type: "cone",
        x: -1,
        y: 0,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 1,
        y: 0,
        radius: 0.25,
      },
      {
        type: "line",
        x1: -1,
        y1: 0,
        x2: 1,
        y2: 0,
      },
    ],
  },
  {
    id: "slalom-5-cones",
    name: "Slalom 5 cones",
    description: "Five cones in a straight line, 3 m apart.",
    elements: [
      {
        type: "cone",
        x: 0,
        y: -6,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 0,
        y: -3,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 0,
        y: 0,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 0,
        y: 3,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 0,
        y: 6,
        radius: 0.25,
      },
    ],
  },
  {
    id: "box-4x4",
    name: "Box 4 x 4 m",
    description: "Four cones forming a 4 m square.",
    elements: [
      {
        type: "cone",
        x: -2,
        y: -2,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 2,
        y: -2,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 2,
        y: 2,
        radius: 0.25,
      },
      {
        type: "cone",
        x: -2,
        y: 2,
        radius: 0.25,
      },
      {
        type: "line",
        x1: -2,
        y1: -2,
        x2: 2,
        y2: -2,
      },
      {
        type: "line",
        x1: 2,
        y1: -2,
        x2: 2,
        y2: 2,
      },
      {
        type: "line",
        x1: 2,
        y1: 2,
        x2: -2,
        y2: 2,
      },
      {
        type: "line",
        x1: -2,
        y1: 2,
        x2: -2,
        y2: -2,
      },
    ],
  },
];
