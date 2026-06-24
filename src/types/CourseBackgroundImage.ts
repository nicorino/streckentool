export type CourseBackgroundImage = {
  id: string;
  src: string;
  name: string;

  // Stored in meters
  x: number;
  y: number;
  width: number;
  height: number;

  opacity: number;
  locked: boolean;
};
