import { Layer, Rect, Text } from "react-konva";
import type { ProjectBoundsMeters } from "../export/getProjectBounds";
import { metersToPixels } from "../utils/snap";

type ExportFrameLayerProps = {
  boundsMeters: ProjectBoundsMeters;
  label: string;
};

export function ExportFrameLayer({
  boundsMeters,
  label,
}: ExportFrameLayerProps) {
  const x = metersToPixels(boundsMeters.left);
  const y = metersToPixels(boundsMeters.top);
  const width = metersToPixels(boundsMeters.right - boundsMeters.left);
  const height = metersToPixels(boundsMeters.bottom - boundsMeters.top);

  return (
    <Layer listening={false}>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="#8e24aa"
        strokeWidth={2}
        dash={[10, 6]}
      />

      <Text
        x={x + 8}
        y={Math.max(4, y - 22)}
        text={`Export: ${label}`}
        fontSize={14}
        fill="#8e24aa"
      />
    </Layer>
  );
}
