import type { CourseRect } from "../types/CourseRect";

export type BoundarySegment = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type RectBounds = {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type Interval = {
  start: number;
  end: number;
};

const EPSILON = 0.000001;
const SIDE_OFFSET = 0.001;

function toBounds(rect: CourseRect): RectBounds {
  return {
    id: rect.id,
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y,
    bottom: rect.y + rect.height,
  };
}

function contains(value: number, start: number, end: number) {
  return value > start + EPSILON && value < end - EPSILON;
}

function overlapInterval(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): Interval | null {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);

  if (end - start <= EPSILON) {
    return null;
  }

  return { start, end };
}

function subtractIntervals(base: Interval, blockers: Interval[]) {
  const sorted = [...blockers].sort((a, b) => a.start - b.start);
  const result: Interval[] = [];

  let cursor = base.start;

  for (const blocker of sorted) {
    if (blocker.end <= cursor + EPSILON) {
      continue;
    }

    if (blocker.start > cursor + EPSILON) {
      result.push({
        start: cursor,
        end: Math.min(blocker.start, base.end),
      });
    }

    cursor = Math.max(cursor, blocker.end);

    if (cursor >= base.end - EPSILON) {
      break;
    }
  }

  if (cursor < base.end - EPSILON) {
    result.push({
      start: cursor,
      end: base.end,
    });
  }

  return result.filter((interval) => interval.end - interval.start > EPSILON);
}

export function getCourseBoundarySegments(
  rects: CourseRect[]
): BoundarySegment[] {
  const bounds = rects
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .map(toBounds);

  const segments: BoundarySegment[] = [];

  for (const rect of bounds) {
    // Left edge
    {
      const x = rect.left;
      const outsideX = x - SIDE_OFFSET;

      const blockers = bounds
        .filter(
          (other) =>
            other.id !== rect.id &&
            contains(outsideX, other.left, other.right)
        )
        .map((other) =>
          overlapInterval(rect.top, rect.bottom, other.top, other.bottom)
        )
        .filter((interval): interval is Interval => interval !== null);

      const visibleParts = subtractIntervals(
        { start: rect.top, end: rect.bottom },
        blockers
      );

      for (const part of visibleParts) {
        segments.push({
          id: `${rect.id}-left-${part.start}-${part.end}`,
          x1: x,
          y1: part.start,
          x2: x,
          y2: part.end,
        });
      }
    }

    // Right edge
    {
      const x = rect.right;
      const outsideX = x + SIDE_OFFSET;

      const blockers = bounds
        .filter(
          (other) =>
            other.id !== rect.id &&
            contains(outsideX, other.left, other.right)
        )
        .map((other) =>
          overlapInterval(rect.top, rect.bottom, other.top, other.bottom)
        )
        .filter((interval): interval is Interval => interval !== null);

      const visibleParts = subtractIntervals(
        { start: rect.top, end: rect.bottom },
        blockers
      );

      for (const part of visibleParts) {
        segments.push({
          id: `${rect.id}-right-${part.start}-${part.end}`,
          x1: x,
          y1: part.start,
          x2: x,
          y2: part.end,
        });
      }
    }

    // Top edge
    {
      const y = rect.top;
      const outsideY = y - SIDE_OFFSET;

      const blockers = bounds
        .filter(
          (other) =>
            other.id !== rect.id &&
            contains(outsideY, other.top, other.bottom)
        )
        .map((other) =>
          overlapInterval(rect.left, rect.right, other.left, other.right)
        )
        .filter((interval): interval is Interval => interval !== null);

      const visibleParts = subtractIntervals(
        { start: rect.left, end: rect.right },
        blockers
      );

      for (const part of visibleParts) {
        segments.push({
          id: `${rect.id}-top-${part.start}-${part.end}`,
          x1: part.start,
          y1: y,
          x2: part.end,
          y2: y,
        });
      }
    }

    // Bottom edge
    {
      const y = rect.bottom;
      const outsideY = y + SIDE_OFFSET;

      const blockers = bounds
        .filter(
          (other) =>
            other.id !== rect.id &&
            contains(outsideY, other.top, other.bottom)
        )
        .map((other) =>
          overlapInterval(rect.left, rect.right, other.left, other.right)
        )
        .filter((interval): interval is Interval => interval !== null);

      const visibleParts = subtractIntervals(
        { start: rect.left, end: rect.right },
        blockers
      );

      for (const part of visibleParts) {
        segments.push({
          id: `${rect.id}-bottom-${part.start}-${part.end}`,
          x1: part.start,
          y1: y,
          x2: part.end,
          y2: y,
        });
      }
    }
  }

  return segments;
}
