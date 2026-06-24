import { Layer, Rect, Text } from "react-konva";
import type { ProjectBoundsMeters } from "../export/getProjectBounds";
import type { ProjectMetadata } from "../types/ProjectMetadata";
import { metersToPixels } from "../utils/snap";

type TitleBlockLayerProps = {
  metadata: ProjectMetadata;
  boundsMeters: ProjectBoundsMeters;
};

export function TitleBlockLayer({
  metadata,
  boundsMeters,
}: TitleBlockLayerProps) {
  if (!metadata.showTitleBlock) {
    return null;
  }

  const title = metadata.title.trim() || "Kart slalom course";

  const detailLines = [
    metadata.clubName.trim() ? `Club: ${metadata.clubName.trim()}` : null,
    metadata.eventDate.trim() ? `Date: ${metadata.eventDate.trim()}` : null,
    metadata.authorName.trim() ? `Author: ${metadata.authorName.trim()}` : null,
  ].filter((line): line is string => line !== null);

  const notes = metadata.notes.trim();

  const bodyText = [
    ...detailLines,
    notes.length > 0 ? notes : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const x = metersToPixels(boundsMeters.left) + 12;
  const y = metersToPixels(boundsMeters.top) + 12;

  const width = 320;
  const titleHeight = 24;
  const lineHeight = 18;
  const padding = 10;

  const lineCount = Math.max(1, bodyText.split("\n").filter(Boolean).length);

  const height = padding * 2 + titleHeight + lineCount * lineHeight;

  return (
    <Layer listening={false}>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(255,255,255,0.88)"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth={1}
        cornerRadius={4}
      />

      <Text
        x={x + padding}
        y={y + padding}
        width={width - padding * 2}
        text={title}
        fontSize={18}
        fontStyle="bold"
        fill="#111"
      />

      <Text
        x={x + padding}
        y={y + padding + titleHeight}
        width={width - padding * 2}
        text={
          bodyText.length > 0
            ? bodyText
            : "Project information can be edited in the inspector."
        }
        fontSize={12}
        lineHeight={1.35}
        fill="#333"
      />
    </Layer>
  );
}