import { useEffect, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Text } from "react-konva";
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
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  const hasLogo = metadata.projectLogoSrc.trim().length > 0;

  useEffect(() => {
    if (!hasLogo) {
      setLogoImage(null);
      return;
    }

    const image = new window.Image();

    image.onload = () => {
      setLogoImage(image);
    };

    image.src = metadata.projectLogoSrc;

    return () => {
      image.onload = null;
    };
  }, [hasLogo, metadata.projectLogoSrc]);

  if (!metadata.showTitleBlock && !hasLogo) {
    return null;
  }

  const title = metadata.title.trim() || "Kart slalom course";

  const detailLines = [
    metadata.clubName.trim() ? `Club: ${metadata.clubName.trim()}` : null,
    metadata.eventDate.trim() ? `Date: ${metadata.eventDate.trim()}` : null,
    metadata.authorName.trim() ? `Author: ${metadata.authorName.trim()}` : null,
    metadata.observerName.trim()
      ? `Observer: ${metadata.observerName.trim()}`
      : null,
    metadata.insuranceNumber.trim()
      ? `Versicherungsnummer: ${metadata.insuranceNumber.trim()}`
      : null,
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

  const right = metersToPixels(boundsMeters.right) - 12;
  const top = metersToPixels(boundsMeters.top) + 12;

  const width = 340;
  const titleHeight = 24;
  const lineHeight = 18;
  const padding = 10;

  const lineCount = Math.max(1, bodyText.split("\n").filter(Boolean).length);
  const height = padding * 2 + titleHeight + lineCount * lineHeight;

  const logoMaxWidth = 150;
  const logoMaxHeight = 70;

  const logoRatio =
    logoImage && logoImage.naturalWidth > 0
      ? logoImage.naturalHeight / logoImage.naturalWidth
      : 0.45;

  let logoWidth = logoMaxWidth;
  let logoHeight = logoWidth * logoRatio;

  if (logoHeight > logoMaxHeight) {
    logoHeight = logoMaxHeight;
    logoWidth = logoHeight / logoRatio;
  }

  return (
    <Layer listening={false}>
      {metadata.showTitleBlock && (
        <>
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
                : "Project information can be edited in the project info menu."
            }
            fontSize={12}
            lineHeight={1.35}
            fill="#333"
          />
        </>
      )}

      {hasLogo && logoImage && (
        <KonvaImage
          image={logoImage}
          x={right - logoWidth}
          y={top}
          width={logoWidth}
          height={logoHeight}
          opacity={0.96}
        />
      )}
    </Layer>
  );
}
