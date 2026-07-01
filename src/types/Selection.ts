export type Selection =
  | {
      type: "rect";
      id: string;
    }
  | {
      type: "figure";
      id: string;
    }
  | {
      type: "decoration";
      id: string;
    }
  | {
      type: "background";
      id: string;
    };