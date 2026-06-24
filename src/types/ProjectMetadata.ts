export type ProjectMetadata = {
  title: string;
  clubName: string;
  eventDate: string;
  authorName: string;
  notes: string;
  showTitleBlock: boolean;
};

export function createDefaultProjectMetadata(): ProjectMetadata {
  return {
    title: "Kart slalom course",
    clubName: "",
    eventDate: "",
    authorName: "",
    notes: "",
    showTitleBlock: false,
  };
}