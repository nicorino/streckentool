import type { FigureElement, FigureTemplate } from "../types/Figure";

const CONE_RADIUS = 0.25;

const SLALOM_CONE_COUNTS = [3, 4, 5, 6];
const SLALOM_DISTANCES_METERS = [4, 5, 6, 7, 8];

function cone(x: number, y: number): FigureElement {
  return {
    type: "cone",
    x,
    y,
    radius: CONE_RADIUS,
  };
}

function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): FigureElement {
  return {
    type: "line",
    x1,
    y1,
    x2,
    y2,
  };
}

function straightGateRow(
  xValues: number[],
  halfWidth: number
): FigureElement[] {
  return xValues.flatMap((x) => [cone(x, -halfWidth), cone(x, halfWidth)]);
}

function row(y: number, xValues: number[]): FigureElement[] {
  return xValues.map((x) => cone(x, y));
}

function column(x: number, yValues: number[]): FigureElement[] {
  return yValues.map((y) => cone(x, y));
}


function coneRowByCount(
  y: number,
  count: number,
  spacing: number,
  startX = -((count - 1) * spacing) / 2
): FigureElement[] {
  return Array.from({ length: count }, (_value, index) =>
    cone(Number((startX + index * spacing).toFixed(2)), y)
  );
}



function arcCones(
  centerX: number,
  centerY: number,
  radius: number,
  startDeg: number,
  endDeg: number,
  count: number
): FigureElement[] {
  const elements: FigureElement[] = [];

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0 : index / (count - 1);
    const angleDeg = startDeg + (endDeg - startDeg) * t;
    const angleRad = (angleDeg * Math.PI) / 180;

    elements.push(
      cone(
        Number((centerX + Math.cos(angleRad) * radius).toFixed(2)),
        Number((centerY + Math.sin(angleRad) * radius).toFixed(2))
      )
    );
  }

  return elements;
}

function createSlalomTemplate(
  coneCount: number,
  distanceMeters: number
): FigureTemplate {
  const firstY = -((coneCount - 1) * distanceMeters) / 2;
  const lastY = ((coneCount - 1) * distanceMeters) / 2;

  return {
    id: `slalom-${coneCount}-cones-${distanceMeters}m`,
    name: `Slalom ${coneCount} Pylonen / ${distanceMeters} m`,
    category: "Slalom",
    description: `${coneCount} Pylonen in gerader Linie mit ${distanceMeters} m Abstand.`,
    elements: [
      ...Array.from({ length: coneCount }, (_value, index) =>
        cone(0, Number((firstY + index * distanceMeters).toFixed(2)))
      ),
      line(0, firstY, 0, lastY),
    ],
  };
}

const SLALOM_TEMPLATES: FigureTemplate[] = SLALOM_CONE_COUNTS.flatMap(
  (coneCount) =>
    SLALOM_DISTANCES_METERS.map((distanceMeters) =>
      createSlalomTemplate(coneCount, distanceMeters)
    )
);

export const STANDARD_COURSE_TEMPLATES: FigureTemplate[] = [
  {
    id: "single-cone",
    name: "Einzelne Pylone",
    category: "Basic",
    description: "Eine einzelne Pylone.",
    elements: [
      {
        type: "cone",
        x: 0,
        y: 0,
        radius: 0.25,
      },
    ],
  },

  ...SLALOM_TEMPLATES,

  {
    id: "spurgasse-gerade-2026",
    name: "Spurgasse gerade",
    category: "Gates",
    description:
      "Gerade Spurgasse mit 1,65 m Breite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...straightGateRow([-4, -3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2, 4], 0.825),
    ],
  },
  {
    id: "pylonentor-2026",
    name: "Pylonentor",
    category: "Gates",
    description: "Ein Pylonentor mit 1,65 m Breite.",
    elements: [
      {
        type: "cone",
        x: 0,
        y: -0.825,
        radius: 0.25,
      },
      {
        type: "cone",
        x: 0,
        y: 0.825,
        radius: 0.25,
      },
    ],
  },
  {
    id: "wechseltor-2026",
    name: "Wechseltor",
    category: "Gates",
    description:
      "Zwei Pylonentore unmittelbar nacheinander. Abstand hier 2,6 m.",
    elements: [
      cone(-1.3, -0.8),
      cone(-1.3, 0.8),
      cone(1.3, -0.8),
      cone(1.3, 0.8),
      line(-2, 0, 2, 0),
    ],
  },
  {
    id: "wende-90-180-2026",
    name: "Wende 90-180 Grad",
    category: "Other",
    description:
      "Drei Pylonen in einem Dreieck. Die Pylonen werden gesamtheitlich markiert.",
    elements: [cone(0, 0), cone(0.5, 0), cone(0, 0.5)],
  },
  {
    id: "ypsilon-2026",
    name: "Ypsilon",
    category: "Other",
    description:
      "Y-förmige Aufgabe mit 1,65 m Fahrspurbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...row(-0.825, [-5, -4.2, -3.4]),
      ...row(0.825, [-5, -4.2, -3.4]),

      cone(-2.6, -0.825),
      cone(-1.86, -1.15),
      cone(-1.12, -1.48),
      cone(-0.38, -1.81),
      cone(0.36, -2.14),
      ...row(-2.14, [1.1, 1.9, 2.7]),

      cone(-2.6, 0.825),
      cone(-1.86, 1.15),
      cone(-1.12, 1.48),
      cone(-0.38, 1.81),
      cone(0.36, 2.14),
      ...row(2.14, [1.1, 1.9, 2.7]),

      ...row(-0.49, [1.1, 1.9, 2.7]),
      ...row(0.49, [1.1, 1.9, 2.7]),
      cone(0.36, 0),
    ],
  },
  {
    id: "s-spurgasse-2026",
    name: "S-Spurgasse",
    category: "Gates",
    description:
      "S-förmige Spurgasse. Fahrspurbreite praktisch 1,6 m, Pylonenabstand ca. 0,5 m.",
    elements: [
      cone(-4, 0.7),
      cone(-3.5, 0.7),
      cone(-3, 0.7),
      cone(-2.4, 0.45),
      cone(-1.8, 0.2),
      cone(-1.2, -0.05),
      cone(-0.6, -0.3),
      cone(0, -0.55),
      cone(0.6, -0.8),
      cone(1.2, -1.05),
      cone(1.8, -1.3),
      cone(2.4, -1.45),
      cone(3, -1.45),

      cone(-4, -0.9),
      cone(-3.5, -0.9),
      cone(-3, -0.9),
      cone(-2.4, -0.65),
      cone(-1.8, -0.4),
      cone(-1.2, -0.15),
      cone(-0.6, 0.1),
      cone(0, 0.35),
      cone(0.6, 0.6),
      cone(1.2, 0.85),
      cone(1.8, 1.1),
      cone(2.4, 1.25),
      cone(3, 1.25),
    ],
  },
  {
    id: "z-gasse-2026",
    name: "Z-Gasse",
    category: "Gates",
    description:
      "Z-förmige Gassenaufgabe. Abstand zwischen Gassen im echten Aufbau variabel.",
    elements: [
      ...column(-4, [-2, -1.5, -1, -0.5, 0]),
      ...column(-3, [-2, -1.5, -1, -0.5, 0]),

      ...column(-1, [0, 0.5, 1, 1.5, 2]),
      ...column(0, [0, 0.5, 1, 1.5, 2]),

      ...column(2, [-2, -1.5, -1, -0.5, 0]),
      ...column(3, [-2, -1.5, -1, -0.5, 0]),

      line(-4.8, -1, -2.4, -1),
      line(-1.2, 1, 0.8, 1),
      line(1.4, -1, 3.8, -1),
    ],
  },
  {
    id: "kasten-2026",
    name: "Kasten",
    category: "Boxes",
    description:
      "Kasten mit versetztem Ein- und Ausgang, 1,65 m Durchfahrtsbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...column(-2.65, [-1.6, -0.8, 0, 0.8, 1.6]),
      ...row(-1.6, [-2.65, -1.85, -1.05]),

      ...column(0.6, [-1.6, -0.8, 0, 0.8, 1.6]),
      ...row(1.6, [-1.0, -0.2, 0.6]),
    ],
  },
  {
    id: "kasten-90-grad-2026",
    name: "Kasten 90 Grad",
    category: "Boxes",
    description:
      "Kasten mit 90-Grad-Ausfahrt, spiegelbar für links oder rechts.",
    elements: [
      ...row(-1.6, [-2.2, -1.4, -0.6, 0.2, 1]),
      ...column(-2.2, [-1.6, -0.8, 0, 0.8, 1.6]),

      ...column(1, [0, 0.8, 1.6]),
      ...row(1.6, [-0.6, 0.2, 1]),
    ],
  },
  {
    id: "kreisel-2026",
    name: "Kreisel",
    category: "Other",
    description:
      "Kreisel mit 10 m Innendurchmesser und 80 cm Pylonen-Mittelabstand als praktische Vorlage.",
    elements: [
      ...arcCones(0, 0, 5, 0, 360, 39),
      ...arcCones(0, 0, 6.6, 0, 360, 52),
    ],
  },
  {
    id: "schneckenhaus-2026",
    name: "Schnecke",
    category: "Boxes",
    description:
      "Schnecke mit ca. 3 m Kastenbreite, 1,65 m Fahrspurbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      // Left double gate, 5 cones tall.
      ...column(-4, [-1.6, -0.8, 0, 0.8, 1.6]),
      ...column(-2.35, [-1.6, -0.8, 0, 0.8, 1.6]),

      // Inner box with exact 0.8 m horizontal spacing.
      ...column(-0.7, [-1.6, -0.8, 0, 0.8, 1.6]),
      ...row(-1.6, [-0.7, 0.1, 0.9, 1.7, 2.5, 3.3]),
      ...column(3.3, [-1.6, -0.8, 0, 0.8, 1.6]),
      ...row(1.6, [-0.7, 0.1, 0.9, 1.7, 2.5, 3.3]),

      // Right gate, kept 1.65 m from the shifted box wall.
      ...column(4.95, [-1.6, -0.8, 0, 0.8, 1.6]),
    ],
  },
  {
    id: "kreuz-2026",
    name: "Kreuz",
    category: "Boxes",
    description:
      "Kreuz aus vier L-Formen mit 1,65 m Fahrspurbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      // Top-left L.
      ...row(-0.825, [-2.425, -1.625, -0.825]),
      ...column(-0.825, [-2.425, -1.625, -0.825]),

      // Top-right L.
      ...row(-0.825, [0.825, 1.625, 2.425]),
      ...column(0.825, [-2.425, -1.625, -0.825]),

      // Bottom-left L.
      ...row(0.825, [-2.425, -1.625, -0.825]),
      ...column(-0.825, [0.825, 1.625, 2.425]),

      // Bottom-right L.
      ...row(0.825, [0.825, 1.625, 2.425]),
      ...column(0.825, [0.825, 1.625, 2.425]),
    ],
  },
  {
    id: "kreuz-kurz-2026",
    name: "Kreuz kurz",
    category: "Boxes",
    description:
      "Kurzes Kreuz aus vier 3-Pylonen-L-Formen mit 1,65 m Fahrspurbreite.",
    elements: [
      // Top-left L.
      cone(-1.625, -0.825),
      cone(-0.825, -0.825),
      cone(-0.825, -1.625),

      // Top-right L.
      cone(1.625, -0.825),
      cone(0.825, -0.825),
      cone(0.825, -1.625),

      // Bottom-left L.
      cone(-1.625, 0.825),
      cone(-0.825, 0.825),
      cone(-0.825, 1.625),

      // Bottom-right L.
      cone(1.625, 0.825),
      cone(0.825, 0.825),
      cone(0.825, 1.625),
    ],
  },
  {
    id: "brezel-knoten-schwammerl-2026",
    name: "Brezel",
    category: "Other",
    description:
      "Brezel mit 1,65 m Fahrspurbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...coneRowByCount(-3, 10, 0.8, -3.6),

      ...row(-1.35, [-3.6, -2.8, -2]),
      ...row(-1.35, [2, 2.8, 3.6]),

      cone(-1.25, -0.75),
      cone(1.25, -0.75),

      cone(-0.825, 0.05),
      cone(-0.825, 0.85),
      cone(-0.825, 1.65),

      cone(0.825, 0.05),
      cone(0.825, 0.85),
      cone(0.825, 1.65),
    ],
  },
  {
    id: "deutsches-eck-gross-2026",
    name: "Deutsches Eck - groß",
    category: "Boxes",
    description:
      "Großes Deutsches Eck mit 1,65 m Fahrspurbreite und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...row(-2, [-3.2, -2.4, -1.6, -0.8, 0, 0.8]),
      ...column(-3.2, [-2, -1.2, -0.4, 0.4, 1.2, 2]),

      cone(-1.55, 2),
      cone(-1.55, 1.2),
      cone(-1.15, 0.06),
      cone(0.05, -0.4),
      cone(0.85, -0.4),
    ],
  },
  {
    id: "deutsches-eck-eckig-2026",
    name: "Deutsches Eck - eckig",
    category: "Boxes",
    description:
      "Eckige Deutsches-Eck-Variante mit 1,65 m Fahrspurbreite und 50 cm Pylonenabstand.",
    elements: [
      ...row(-2, [-1, 0, 1]),
      ...column(-1, [-2, -1, 0]),
      cone(1, 0),
    ],
  },
  {
    id: "deutsches-eck-2026",
    name: "Deutsches Eck",
    category: "Boxes",
    description:
      "Kompaktes Deutsches Eck mit 1,65 m Eckabstand und drei Pylonen im Bogen.",
    elements: [
      cone(0, 0),
      cone(-1.65, 0),
      cone(0, -1.65),

      cone(-1.56, -0.61),
      cone(-1.21, -1.21),
      cone(-0.61, -1.56),
    ],
  },
  {
    id: "zielgasse-2026",
    name: "Zielgasse",
    category: "Gates",
    description:
      "Zielgasse: 2,5 m breit und 8-10 m lang. Vorlage mit ca. 9 m Länge.",
    elements: [
      ...coneRowByCount(-1.25, 12, 0.8),
      ...coneRowByCount(1.25, 12, 0.8),
    ],
  },
  {
    id: "schikane-2026",
    name: "Schikane",
    category: "Boxes",
    description:
      "Schikane mit 1,65 m breiten Durchfahrten und 80 cm Pylonen-Mittelabstand.",
    elements: [
      ...coneRowByCount(-2, 9, 0.8, -3.7),
      ...coneRowByCount(1.25, 9, 0.8, -3.7),

      cone(-3.7, -0.35),
      cone(-3.7, 0.45),

      cone(-0.5, -1.2),
      cone(-0.5, -0.4),

      cone(2.7, -0.35),
      cone(2.7, 0.45),
    ],
  },
];
