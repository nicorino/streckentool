export type ProjectMetadata = {
  title: string;
  clubName: string;
  eventDate: string;
  authorName: string;
  insuranceNumber: string;
  observerName: string;
  notes: string;
  showTitleBlock: boolean;
  projectLogoSrc: string;
  projectLogoName: string;
  projectLogoWidth: number;
  titleBlockWidth: number;
  titleBlockTitleFontSize: number;
  titleBlockBodyFontSize: number;
};

export function createDefaultProjectMetadata(): ProjectMetadata {
  return {
    title: "Kart slalom course",
    clubName: "",
    eventDate: "",
    authorName: "",
    insuranceNumber: "",
    observerName: "",
    notes: "",
    showTitleBlock: false,
    projectLogoSrc: "",
    projectLogoName: "",
    projectLogoWidth: 150,
    titleBlockWidth: 340,
    titleBlockTitleFontSize: 18,
    titleBlockBodyFontSize: 12,
  };
}
