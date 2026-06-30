import { jsPDF } from "jspdf";
import type { ExportFormat } from "./getProjectBounds";

type ExportCoursePdfOptions = {
  fileName: string;
  imageDataUrl: string;
  imagePixelWidth: number;
  imagePixelHeight: number;
  exportFormat: ExportFormat;
};

type PdfOrientation = "portrait" | "landscape";
type PdfFormat = "a4" | [number, number];

export function exportCoursePdf({
  fileName,
  imageDataUrl,
  imagePixelWidth,
  imagePixelHeight,
  exportFormat,
}: ExportCoursePdfOptions) {
  const aspect =
    imagePixelWidth > 0 && imagePixelHeight > 0
      ? imagePixelWidth / imagePixelHeight
      : 297 / 210;

  const page = getPdfPage(exportFormat, aspect);

  const pdf = new jsPDF({
    orientation: page.orientation,
    unit: "mm",
    format: page.format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = exportFormat === "content" ? 0 : 8;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  let drawWidth = maxWidth;
  let drawHeight = drawWidth / aspect;

  if (drawHeight > maxHeight) {
    drawHeight = maxHeight;
    drawWidth = drawHeight * aspect;
  }

  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  pdf.addImage(
    imageDataUrl,
    "PNG",
    x,
    y,
    drawWidth,
    drawHeight,
    undefined,
    "FAST"
  );

  pdf.save(normalizePdfFileName(fileName));
}

function getPdfPage(
  exportFormat: ExportFormat,
  aspect: number
): {
  orientation: PdfOrientation;
  format: PdfFormat;
} {
  if (exportFormat === "a4-landscape") {
    return {
      orientation: "landscape",
      format: "a4",
    };
  }

  if (exportFormat === "a4-portrait") {
    return {
      orientation: "portrait",
      format: "a4",
    };
  }

  const longSideMm = 297;
  const shortSideMm = Math.max(80, longSideMm / Math.max(aspect, 0.01));

  if (aspect >= 1) {
    return {
      orientation: "landscape",
      format: [longSideMm, shortSideMm],
    };
  }

  return {
    orientation: "portrait",
    format: [shortSideMm, longSideMm],
  };
}

function normalizePdfFileName(fileName: string) {
  const trimmed = fileName.trim() || "streckentool.pdf";
  const withoutKnownExtension = trimmed.replace(/\.(png|pdf)$/i, "");

  return `${withoutKnownExtension}.pdf`;
}
