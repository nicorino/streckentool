import type { CourseRect } from "../types/CourseRect";

export type Point = {
  x: number;
  y: number;
};

const EPSILON = 0.000001;

export function getWorkspaceCenter(rect: CourseRect): Point {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

export function getWorkspaceCorners(rect: CourseRect): Point[] {
  const center = getWorkspaceCenter(rect);
  const angle = degreesToRadians(rect.rotation);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  const localCorners = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight },
  ];

  return localCorners.map((point) => ({
    x: center.x + point.x * cos - point.y * sin,
    y: center.y + point.x * sin + point.y * cos,
  }));
}

export function isPointInsideWorkspace(point: Point, rect: CourseRect) {
  const center = getWorkspaceCenter(rect);
  const angle = degreesToRadians(-rect.rotation);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  return (
    localX >= -rect.width / 2 - EPSILON &&
    localX <= rect.width / 2 + EPSILON &&
    localY >= -rect.height / 2 - EPSILON &&
    localY <= rect.height / 2 + EPSILON
  );
}

export function doWorkspacesConnect(a: CourseRect, b: CourseRect) {
  const polygonA = getWorkspaceCorners(a);
  const polygonB = getWorkspaceCorners(b);

  if (polygonsHaveInteriorOverlap(polygonA, polygonB)) {
    return true;
  }

  return polygonsShareEdgeOverlap(polygonA, polygonB);
}

function polygonsHaveInteriorOverlap(a: Point[], b: Point[]) {
  const axes = [...getPolygonAxes(a), ...getPolygonAxes(b)];

  return axes.every((axis) => {
    const projectionA = projectPolygon(a, axis);
    const projectionB = projectPolygon(b, axis);

    const overlap =
      Math.min(projectionA.max, projectionB.max) -
      Math.max(projectionA.min, projectionB.min);

    return overlap > EPSILON;
  });
}

function polygonsShareEdgeOverlap(a: Point[], b: Point[]) {
  for (let indexA = 0; indexA < a.length; indexA += 1) {
    const a1 = a[indexA];
    const a2 = a[(indexA + 1) % a.length];

    for (let indexB = 0; indexB < b.length; indexB += 1) {
      const b1 = b[indexB];
      const b2 = b[(indexB + 1) % b.length];

      if (segmentsHaveCollinearOverlap(a1, a2, b1, b2)) {
        return true;
      }
    }
  }

  return false;
}

function segmentsHaveCollinearOverlap(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point
) {
  const ax = a2.x - a1.x;
  const ay = a2.y - a1.y;
  const bx = b2.x - b1.x;
  const by = b2.y - b1.y;

  const lengthA = Math.hypot(ax, ay);
  const lengthB = Math.hypot(bx, by);

  if (lengthA <= EPSILON || lengthB <= EPSILON) {
    return false;
  }

  const crossDirection = Math.abs(ax * by - ay * bx) / (lengthA * lengthB);

  if (crossDirection > EPSILON) {
    return false;
  }

  const distanceB1ToLineA = Math.abs(
    ((b1.x - a1.x) * ay - (b1.y - a1.y) * ax) / lengthA
  );

  const distanceB2ToLineA = Math.abs(
    ((b2.x - a1.x) * ay - (b2.y - a1.y) * ax) / lengthA
  );

  if (distanceB1ToLineA > EPSILON || distanceB2ToLineA > EPSILON) {
    return false;
  }

  const unitX = ax / lengthA;
  const unitY = ay / lengthA;

  const aMin = 0;
  const aMax = lengthA;

  const bProjection1 = (b1.x - a1.x) * unitX + (b1.y - a1.y) * unitY;
  const bProjection2 = (b2.x - a1.x) * unitX + (b2.y - a1.y) * unitY;

  const bMin = Math.min(bProjection1, bProjection2);
  const bMax = Math.max(bProjection1, bProjection2);

  const overlap = Math.min(aMax, bMax) - Math.max(aMin, bMin);

  return overlap > EPSILON;
}

function getPolygonAxes(points: Point[]) {
  const axes: Point[] = [];

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];

    const edgeX = next.x - current.x;
    const edgeY = next.y - current.y;

    const normalX = -edgeY;
    const normalY = edgeX;
    const length = Math.hypot(normalX, normalY);

    if (length > EPSILON) {
      axes.push({
        x: normalX / length,
        y: normalY / length,
      });
    }
  }

  return axes;
}

function projectPolygon(points: Point[], axis: Point) {
  const values = points.map((point) => point.x * axis.x + point.y * axis.y);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}
