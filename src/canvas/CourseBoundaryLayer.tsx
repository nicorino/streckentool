import { Layer, Line } from "react-konva";
import type { CourseRect } from "../types/CourseRect";
import { metersToPixels } from "../utils/snap";
import { getCourseBoundarySegments } from "../course/getCourseBoundarySegments";
import { getWorkspaceCorners } from "../course/workspaceGeometry";

type CourseBoundaryLayerProps = {
  rects: CourseRect[];
  isValid: boolean;
};

export function CourseBoundaryLayer({
  rects,
  isValid,
}: CourseBoundaryLayerProps) {
  const hasRotatedWorkspace = rects.some(
    (rect) => Math.abs(normalizeRotation(rect.rotation)) > 0.001
  );

  if (!hasRotatedWorkspace) {
    const segments = getCourseBoundarySegments(rects);

    return (
      <Layer listening={false}>
        {segments.map((segment) => (
          <Line
            key={segment.id}
            points={[
              metersToPixels(segment.x1),
              metersToPixels(segment.y1),
              metersToPixels(segment.x2),
              metersToPixels(segment.y2),
            ]}
            stroke={isValid ? "#222" : "#d32f2f"}
            strokeWidth={2}
          />
        ))}
      </Layer>
    );
  }

  return (
    <Layer listening={false}>
      {rects.map((rect) => {
        const corners = getWorkspaceCorners(rect);
        const points = corners.flatMap((point) => [
          metersToPixels(point.x),
          metersToPixels(point.y),
        ]);

        return (
          <Line
            key={rect.id}
            points={points}
            closed
            stroke={isValid ? "#222" : "#d32f2f"}
            strokeWidth={2}
          />
        );
      })}
    </Layer>
  );
}

function normalizeRotation(rotation: number) {
  const normalized = rotation % 360;

  if (normalized < 0) {
    return normalized + 360;
  }

  return normalized;
}