import type { FigureElement, FigureTemplate } from "../types/Figure";

const CONE_RADIUS = 0.18;

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
    description: "Ein Pylonentor besteht aus zwei Pylonen.",
    elements: [cone(0, -0.8), cone(0, 0.8), line(-1.2, 0, 1.2, 0)],
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
    id: "schweizer-slalom-2026",
    name: "Schweizer Slalom",
    category: "Other",
    description:
      "Mehrere einzelne Pylonen in einer Linie, wechselseitig zu durchfahren.",
    elements: [
      cone(-3.2, 0),
      cone(-1.6, 0),
      cone(0, 0),
      cone(1.6, 0),
      cone(3.2, 0),
      line(-4, -0.8, 4, 0.8),
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
      "Y-förmige Aufgabe. Praktischer Entwurf mit 0,5 m Pylonenabstand.",
    elements: [
      ...row(-0.8, [-5, -4.5, -4, -3.5]),
      ...row(0.8, [-5, -4.5, -4, -3.5]),
      cone(-3, -0.6),
      cone(-2.5, -0.4),
      cone(-2, -0.2),
      cone(-1.5, 0),
      cone(-2.5, 0.4),
      cone(-2, 0.6),
      cone(-1.5, 0.8),
      ...row(-1.6, [-0.8, -0.3, 0.2, 0.7]),
      ...row(0, [-0.8, -0.3, 0.2, 0.7]),
      ...row(1.6, [-0.8, -0.3, 0.2, 0.7]),
      line(-5.5, 0, -3.2, 0),
      line(-1.2, 0.8, 1.2, 0.8),
      line(-1.2, -0.8, 1.2, -0.8),
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
    name: "Brezel / Knoten / Schwammerl",
    category: "Other",
    description: "Komplexe Schleifenaufgabe als praktische Grundvorlage.",
    elements: [
      ...row(-3, [-4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5]),
      ...row(-1.2, [-4, -3.5, -3]),
      cone(-2.4, -0.7),
      ...column(-2, [0, 0.5, 1, 1.5]),
      ...row(-1.2, [0.5, 1, 1.5]),
      cone(0.2, -0.7),
      ...column(0.6, [0, 0.5, 1, 1.5]),
      line(-4.5, -2.4, 1, -2.4),
      line(-3.5, -0.8, -2, 1.8),
      line(1.4, -0.8, 0.4, 1.8),
    ],
  },
  {
    id: "deutsches-eck-2026",
    name: "Deutsches Eck",
    category: "Boxes",
    description: "Deutsches Eck mit längerem Außenwinkel.",
    elements: [
      ...row(-2, [-3, -2.5, -2, -1.5, -1, -0.5]),
      ...column(-3, [-1.5, -1, -0.5, 0, 0.5]),
      ...column(-1.2, [0, 0.5]),
      ...row(0, [-0.7, -0.2, 0.3]),
    ],
  },
  {
    id: "normales-eck-2026",
    name: "Normales Eck",
    category: "Boxes",
    description: "Normale Eck-Variante aus dem Deutschen-Eck-Beispiel.",
    elements: [
      ...row(-1.5, [-1, -0.5, 0]),
      ...column(-1, [-1, -0.5, 0]),
      cone(1, 0),
      cone(1, -0.7),
      cone(1.8, -0.7),
    ],
  },
  {
    id: "zielgasse-2026",
    name: "Zielgasse",
    category: "Gates",
    description: "Zielgasse: Breite 2,5 m, Länge 8-10 m. Vorlage mit 8 m Länge.",
    elements: [
      ...straightGateRow([-4, -2, 0, 2, 4], 1.25),
      line(-4.5, 0, 4.5, 0),
    ],
  },
  {
    id: "schikane-2026",
    name: "Schikane",
    category: "Boxes",
    description:
      "Schikane mit versetzter Durchfahrt und 0,5 m Pylonenabstand.",
    elements: [
      ...row(-2, [-4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0]),
      ...column(-4, [-1.5, -1, -0.5]),
      ...row(2, [-4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0]),

      ...column(-0.5, [-0.8, -0.3, 0.2]),
      ...column(2.4, [-1.5, -1, -0.5]),
      ...column(2.4, [0.5, 1, 1.5]),

      line(-5, 0, -2.4, 0),
      line(-2.4, 0, -1.2, 1.2),
      line(-1.2, 1.2, 0.2, 1.2),
      line(0.2, 1.2, 1.6, 0),
      line(1.6, 0, 4.2, 0),
    ],
  },
];
