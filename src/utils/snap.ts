export const PIXELS_PER_METER = 25;
export const GRID_SIZE_METERS = 1;
export const MIN_RECT_SIZE_METERS = 1;

// Increase this if you ever need even larger projects.
export const WORLD_SIZE_METERS = 1000;

export function metersToPixels(value: number) {
  return value * PIXELS_PER_METER;
}

export function pixelsToMeters(value: number) {
  return value / PIXELS_PER_METER;
}

export function snapMeters(value: number) {
  return Math.round(value / GRID_SIZE_METERS) * GRID_SIZE_METERS;
}

export function snapPixels(value: number) {
  return metersToPixels(snapMeters(pixelsToMeters(value)));
}