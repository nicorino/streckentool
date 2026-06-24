import { Circle, Group, Layer, Text } from "react-konva";
import { metersToPixels } from "../utils/snap";

type CanvasPoint = {
  x: number;
  y: number;
};

type CalibrationLayerProps = {
  pendingCalibrationStart: CanvasPoint | null;
};

export function CalibrationLayer({
  pendingCalibrationStart,
}: CalibrationLayerProps) {
  if (!pendingCalibrationStart) {
    return null;
  }

  return (
    <Layer listening={false}>
      <Group>
        <Circle
          x={metersToPixels(pendingCalibrationStart.x)}
          y={metersToPixels(pendingCalibrationStart.y)}
          radius={6}
          fill="#00838f"
        />

        <Text
          x={metersToPixels(pendingCalibrationStart.x) + 10}
          y={metersToPixels(pendingCalibrationStart.y) - 24}
          text="Click second calibration point"
          fontSize={13}
          fill="#00838f"
        />
      </Group>
    </Layer>
  );
}
