export type TextDecoration = {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text: string;
  fontSize: number;
  color: string;
};

export type ImageDecoration = {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
  name: string;
};

export type Decoration = TextDecoration | ImageDecoration;

export type DecorationPatch =
  | Partial<TextDecoration>
  | Partial<ImageDecoration>;
