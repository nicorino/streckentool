import type { FigureTemplate } from "../types/Figure";
import { STANDARD_COURSE_TEMPLATES } from "./adacStandardTemplates";

const BASIC_FIGURE_TEMPLATES: FigureTemplate[] = [
  {
    id: "single-cone",
    name: "Single cone",
    category: "Basic",
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
];

export const FIGURE_TEMPLATES: FigureTemplate[] = [
  ...BASIC_FIGURE_TEMPLATES,
  ...STANDARD_COURSE_TEMPLATES,
];
