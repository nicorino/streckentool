import { Layer, Line } from "react-konva";
import { metersToPixels, WORLD_SIZE_METERS } from "../utils/snap";

const MIN_WORLD_METERS = -WORLD_SIZE_METERS;
const MAX_WORLD_METERS = WORLD_SIZE_METERS;

export function GridLayer() {
  const lines = [];

  for (let meter = MIN_WORLD_METERS; meter <= MAX_WORLD_METERS; meter += 1) {
    const pixel = metersToPixels(meter);
    const isMajorLine = meter % 5 === 0;
    const isOrigin = meter === 0;

    lines.push(
      <Line
        key={`vertical-${meter}`}
        points={[
          pixel,
          metersToPixels(MIN_WORLD_METERS),
          pixel,
          metersToPixels(MAX_WORLD_METERS),
        ]}
        stroke={isOrigin ? "#9e9e9e" : isMajorLine ? "#d6d6d6" : "#eeeeee"}
        strokeWidth={isOrigin ? 2 : isMajorLine ? 1.2 : 1}
        listening={false}
      />
    );

    lines.push(
      <Line
        key={`horizontal-${meter}`}
        points={[
          metersToPixels(MIN_WORLD_METERS),
          pixel,
          metersToPixels(MAX_WORLD_METERS),
          pixel,
        ]}
        stroke={isOrigin ? "#9e9e9e" : isMajorLine ? "#d6d6d6" : "#eeeeee"}
        strokeWidth={isOrigin ? 2 : isMajorLine ? 1.2 : 1}
        listening={false}
      />
    );
  }

  return <Layer listening={false}>{lines}</Layer>;
}
