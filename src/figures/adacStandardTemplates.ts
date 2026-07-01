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
      "Gerade Spurgasse mit fünf Pylonen pro Seite. Praktische Standardbreite 1,6 m.",
    elements: [
      ...straightGateRow([-4, -2, 0, 2, 4], 0.8),
      line(-4.5, 0, 4.5, 0),
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
      "Y-förmige Aufgabe mit 1,65 m Fahrspurbreite und 50 cm Pylonenabstand.",
    elements: [
      // Left entry: three cones per side.
      ...row(-0.825, [-5, -4, -3]),
      ...row(0.825, [-5, -4, -3]),

      // Upper branch: five cones diagonally, then three straight.
      cone(-2, -0.825),
      cone(-1, -1.25),
      cone(0, -1.7),
      cone(1, -2.15),
      cone(2, -2.6),
      ...row(-2.6, [3, 4, 5]),

      // Lower branch: five cones diagonally, then three straight.
      cone(-2, 0.825),
      cone(-1, 1.25),
      cone(0, 1.7),
      cone(1, 2.15),
      cone(2, 2.6),
      ...row(2.6, [3, 4, 5]),

      // Middle guide section: six cones like a short spurgasse plus one closing cone.
      ...row(-0.825, [3, 4, 5]),
      ...row(0.825, [3, 4, 5]),
      cone(2, 0),
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
      "Kastenaufgabe mit Ein- und Ausfahrt. Praktische Standardvariante.",
    elements: [
      ...row(-2, [-3, -2.5, -2, -1.5]),
      ...column(-3, [-1.5, -1, -0.5, 0]),
      ...row(0, [-1.5, -1, -0.5]),
      ...column(0, [-1.5, -1, -0.5, 0]),

      ...column(2, [-2, -1.5, -1, -0.5, 0]),
      ...row(0, [2.5, 3, 3.5]),
      ...column(3.5, [-1.5, -1, -0.5, 0]),

      line(-3.6, -1, -1.2, -1),
      line(1.6, -1, 4.1, -1),
    ],
  },
  {
    id: "kreisel-2026",
    name: "Kreisel",
    category: "Other",
    description:
      "Kreisel mit 10 m Innendurchmesser und 1 m Pylonenabstand als praktische Vorlage.",
    elements: [
      ...arcCones(0, 0, 5, 0, 360, 32),
      ...arcCones(0, 0, 6.6, 0, 360, 40),
      line(-5, 0, 5, 0),
    ],
  },
  {
    id: "schneckenhaus-2026",
    name: "Schneckenhaus",
    category: "Boxes",
    description:
      "Schneckenhaus als rechteckige Spiralform. Kastenbreite ca. 3 m.",
    elements: [
      ...column(-4, [-2, -1.5, -1, -0.5, 0]),
      ...column(-3, [-2, -1.5, -1, -0.5, 0]),
      ...column(-1.5, [-2, -1.5, -1, -0.5, 0]),
      ...row(-2, [-1, -0.5, 0, 0.5, 1, 1.5, 2]),
      ...column(2, [-1.5, -1, -0.5, 0]),
      ...row(0, [-1, -0.5, 0, 0.5, 1]),
      ...column(3.5, [-2, -1.5, -1, -0.5, 0]),
      line(-4.5, -1, 3.8, -1),
    ],
  },
  {
    id: "kreuz-2026",
    name: "Kreuz",
    category: "Boxes",
    description: "Kreuzförmige Aufgabe mit 0,5 m Pylonenabstand.",
    elements: [
      ...column(-0.8, [-3, -2.5, -2, 2, 2.5, 3]),
      ...column(0.8, [-3, -2.5, -2, 2, 2.5, 3]),
      ...row(-0.8, [-3, -2.5, -2, 2, 2.5, 3]),
      ...row(0.8, [-3, -2.5, -2, 2, 2.5, 3]),
      line(0, -3.5, 0, 3.5),
      line(-3.5, 0, 3.5, 0),
    ],
  },
  {
    id: "brezel-knoten-schwammerl-2026",
    name: "Brezel",
    category: "Other",
    description:
      "Brezel mit 1,65 m Fahrspurbreite und 50 cm Pylonenabstand.",
    elements: [
      // Top straight: 10 cones.
      ...coneRowByCount(-3, 10, 1, -4.5),

      // Left and right short rows: 3 cones each, 1.65 m below top row.
      ...row(-1.35, [-4.5, -3.5, -2.5]),
      ...row(-1.35, [2.5, 3.5, 4.5]),

      // Upper transition pair: 2.5 m wide.
      cone(-1.25, -0.75),
      cone(1.25, -0.75),

      // Lower vertical gate: 1.65 m wide, straight columns.
      cone(-0.825, 0.25),
      cone(-0.825, 1.25),
      cone(-0.825, 2.25),

      cone(0.825, 0.25),
      cone(0.825, 1.25),
      cone(0.825, 2.25),
    ],
  },
  {
    id: "deutsches-eck-gross-2026",
    name: "Deutsches Eck - groß",
    category: "Boxes",
    description:
      "Großes Deutsches Eck mit 1,65 m Fahrspurbreite und 50 cm Pylonenabstand.",
    elements: [
      ...row(-3, [-4, -3, -2, -1, 0, 1]),
      ...column(-4, [-3, -2, -1, 0, 1, 2]),

      ...row(-1.35, [-2.35, -1.35, -0.35]),
      ...column(-2.35, [0, 1, 2]),
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
      "Zielgasse: 2,5 m breit und 8-10 m lang. Vorlage mit 9 m Länge, ohne Haltelinie.",
    elements: [
      ...coneRowByCount(-1.25, 10, 1),
      ...coneRowByCount(1.25, 10, 1),
    ],
  },
  {
    id: "schikane-2026",
    name: "Schikane",
    category: "Boxes",
    description:
      "Schikane mit 1,65 m breiten Durchfahrten und 50 cm Pylonenabstand.",
    elements: [
      ...coneRowByCount(-2, 9, 1, -4),
      ...coneRowByCount(2, 9, 1, -4),

      cone(-4, 0),
      cone(-4, 1),
      cone(-4, 2),

      cone(0, -1),
      cone(0, 0),

      cone(4, 0),
      cone(4, 1),
      cone(4, 2),
    ],
  },
];
