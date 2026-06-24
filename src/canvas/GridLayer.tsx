import type { ReactElement } from "react";
import { Layer, Line } from "react-konva";
import {
  GRID_SIZE_METERS,
  WORLD_SIZE_METERS,
  metersToPixels,
} from "../utils/snap";

export function GridLayer() {
  const lines: ReactElement[] = [];

  for (let meter = 0; meter <= WORLD_SIZE_METERS; meter += GRID_SIZE_METERS) {
    const position = metersToPixels(meter);
    const isMajorLine = meter % 5 === 0;

    lines.push(
      <Line
        key={`v-${meter}`}
        points={[position, 0, position, metersToPixels(WORLD_SIZE_METERS)]}
        stroke={isMajorLine ? "#cfcfcf" : "#e8e8e8"}
        strokeWidth={isMajorLine ? 1.5 : 1}
      />
    );

    lines.push(
      <Line
        key={`h-${meter}`}
        points={[0, position, metersToPixels(WORLD_SIZE_METERS), position]}
        stroke={isMajorLine ? "#cfcfcf" : "#e8e8e8"}
        strokeWidth={isMajorLine ? 1.5 : 1}
      />
    );
  }

  return <Layer listening={false}>{lines}</Layer>;
}