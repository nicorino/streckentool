export type CourseRect = {
  id: string;

  // Stored in meters
  x: number;
  y: number;
  width: number;
  height: number;

  // Rotation in degrees, around the workspace center
  rotation: number;

  locked: boolean;
};