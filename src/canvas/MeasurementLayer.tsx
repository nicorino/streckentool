import { Circle, Group, Layer, Line, Rect, Text } from "react-konva";
import type { Measurement } from "../types/Measurement";
import { metersToPixels } from "../utils/snap";

type MeasurementLayerProps = {
  measurements: Measurement[];
  pendingMeasurementStart: { x: number; y: number } | null;
};

export function MeasurementLayer({
  measurements,
  pendingMeasurementStart,
}: MeasurementLayerProps) {
  return (
    <Layer listening={false}>
      {measurements.map((measurement) => (
        <MeasurementNode key={measurement.id} measurement={measurement} />
      ))}

      {pendingMeasurementStart && (
        <Group>
          <Circle
            x={metersToPixels(pendingMeasurementStart.x)}
            y={metersToPixels(pendingMeasurementStart.y)}
            radius={5}
            fill="#6a1b9a"
          />

          <Text
            x={metersToPixels(pendingMeasurementStart.x) + 8}
            y={metersToPixels(pendingMeasurementStart.y) - 22}
            text="Click second point"
            fontSize={13}
            fill="#6a1b9a"
          />
        </Group>
      )}
    </Layer>
  );
}

function MeasurementNode({ measurement }: { measurement: Measurement }) {
  const x1 = metersToPixels(measurement.x1);
  const y1 = metersToPixels(measurement.y1);
  const x2 = metersToPixels(measurement.x2);
  const y2 = metersToPixels(measurement.y2);

  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  const distanceMeters = Math.hypot(
    measurement.x2 - measurement.x1,
    measurement.y2 - measurement.y1
  );

  const label = `${formatDistance(distanceMeters)} m`;

  return (
    <Group>
      <Line
        points={[x1, y1, x2, y2]}
        stroke="#6a1b9a"
        strokeWidth={2}
        dash={[8, 4]}
      />

      <Circle x={x1} y={y1} radius={4} fill="#6a1b9a" />

      <Circle x={x2} y={y2} radius={4} fill="#6a1b9a" />

      <Rect
        x={centerX - 34}
        y={centerY - 13}
        width={68}
        height={22}
        fill="rgba(255,255,255,0.85)"
        stroke="#6a1b9a"
        cornerRadius={4}
      />

      <Text
        x={centerX - 34}
        y={centerY - 7}
        width={68}
        text={label}
        fontSize={12}
        fill="#6a1b9a"
        align="center"
      />
    </Group>
  );
}

function formatDistance(value: number) {
  if (value < 10) {
    return value.toFixed(2);
  }

  if (value < 100) {
    return value.toFixed(1);
  }

  return Math.round(value).toString();
}
