import { useCallback, useEffect, useState } from "react";

export type AppLanguage = "en" | "de";

export const LANGUAGE_STORAGE_KEY = "streckentool-language";

export const SUPPORTED_LANGUAGES: {
  code: AppLanguage;
  label: string;
}[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
];

const translations = {
  en: {
    appName: "Streckentool",

    groupAdd: "Add",
    groupEdit: "Edit",
    groupTools: "Tools",
    groupHistory: "History",
    groupView: "View",
    groupProject: "Project",
    groupExport: "Export",
    groupDisplay: "Display",

    workspace: "Workspace",
    text: "Text",
    imageLogo: "Image/logo",
    background: "Background",
    deleteSelected: "Delete selected",
    clearBackground: "Clear background",

    select: "Select",
    measure: "Measure",
    calibrate: "Calibrate",
    clearMeasurements: "Clear measurements",

    undo: "Undo",
    redo: "Redo",

    newProjectShort: "New",
    save: "Save",
    load: "Load",

    png: "PNG",
    format: "Format",
    formatContent: "Content bounds",
    formatA4Landscape: "DIN A4 landscape",
    formatA4Portrait: "DIN A4 portrait",

    printPreview: "Print preview",
    snapToGrid: "Snap to grid",
    helperLines: "Helper lines",

    hotkeyHelp: "Mouse wheel zoom / drag empty canvas to pan",    wiki: "Wiki",
    language: "Language",

    newProjectTitle: "New project",
    newProjectBody:
      "This will clear the current course, figures, measurements, background image, decorations, and project metadata.",
    unsavedWorkLost: "Unsaved work will be lost.",
    cancel: "Cancel",
    createNewProject: "Create new project",

    calibrateTitle: "Calibrate background image",
    calibrateDescription:
      "You clicked two points on the background image. Enter the real-world distance between those two points.",
    measuredDistance: "Current measured distance:",
    realDistanceMeters: "Real distance in meters",
    invalidDistance: "Please enter a valid distance greater than 0.",
    applyCalibration: "Apply calibration",

    welcomeTitle: "Welcome to Streckentool",
    welcomeIntro:
      "Plan kart slalom courses directly in your browser. Create workspaces, place figures to scale, add measurements, import background images, and export your plan.",
    welcomePrivacyNote:
      "Your course data stays in your browser unless you export or save a project file yourself.",
    welcomeLanguageLabel: "Choose language",
    welcomeStart: "Start planning",
    welcomeWikiText: "Open wiki",
    welcomeSupportText: "Support the project",

    figureLibrary: "Figure library",
    search: "Search",
    searchFiguresPlaceholder: "Search figures...",
    category: "Category",
    allCategories: "All categories",
    figureSingular: "figure",
    figurePlural: "figures",
    clearFilters: "Clear",
    noFiguresMatch: "No figures match your search.",

    categoryBasic: "Basic",
    categorySlalom: "Slalom",
    categoryGates: "Gates",
    categoryBoxes: "Boxes",
    categoryCustom: "Custom",
    categoryOther: "Other",

    projectInfo: "Project info",
    untitledCourse: "Untitled course",
    courseTitle: "Course title",
    clubOrganisation: "Club / organisation",
    eventDate: "Event date",
    author: "Author",
    notes: "Notes",
    showMetadataTitleBlock: "Show metadata/title block in export",
        inspector: "Inspector",
    validCourse: "Valid course",
    invalidCourse: "Invalid course",
    addAtLeastOneWorkspace: "Add at least one workspace.",
    courseAreaValid: "Course area is valid.",
    workspacesMustTouch:
      "All workspaces must touch or overlap with the main course area.",

    figureWarning: "Figure warning",
    isPartlyOutsideCourse: "is partly outside the course.",
    arePartlyOutsideCourse: "are partly outside the course.",
    outsideCourse: "Outside course",

    backgroundImage: "Background image",
    locked: "Locked",
    opacity: "Opacity",
    xPositionM: "X position (m)",
    yPositionM: "Y position (m)",
    widthM: "Width (m)",
    heightM: "Height (m)",
    rotationDeg: "Rotation (°)",

    selectObjectHint:
      "Select a workspace, figure, text, or image to edit its properties.",

    figure: "Figure",
    coneSingular: "cone",
    conePlural: "cones",
    isOutsideCourse: "is outside the course area.",
    areOutsideCourse: "are outside the course area.",
    coneColor: "Cone color",
    rotateMinus15: "Rotate -15°",
    rotatePlus15: "Rotate +15°",
    mirrorFigure: "Mirror figure",
    duplicateFigure: "Duplicate figure",

    file: "File",
    fontSizePx: "Font size (px)",
    textColor: "Text color",
    presetPlan: "Plan",
    presetBackground: "Background",
    presetExport: "Export",
    presetProject: "Project",
    theme: "Theme",
    lightMode: "Light",
    darkMode: "Dark",
    close: "Close",

    cookiesTitle: "Cookies",
    cookieBannerText:
      "Streckentool only uses necessary local browser storage for preferences such as language, theme, and dismissed notices.",
    acceptCookies: "OK",

    legalImpressumTitle: "Impressum",
    legalPrivacyTitle: "Privacy policy",
    legalCookiesTitle: "Cookie information",
    legalPlaceholderNotice:
      "This is placeholder text and must be replaced before publishing.",
    legalImpressumBody:
      "Add the legally required publisher information here.",
    legalPrivacyBody:
      "Explain what data is processed, what stays locally in the browser, and which services are used.",
    legalCookiesBody:
      "Explain which cookies or local storage entries are used and why.",
    creator: "Creator",
    importCreatorJson: "Import creator JSON",
    
  },

  de: {
    appName: "Streckentool",

    groupAdd: "Hinzufügen",
    groupEdit: "Bearbeiten",
    groupTools: "Werkzeuge",
    groupHistory: "Verlauf",
    groupView: "Ansicht",
    groupProject: "Projekt",
    groupExport: "Export",
    groupDisplay: "Anzeige",

    workspace: "Arbeitsfläche",
    text: "Text",
    imageLogo: "Bild/Logo",
    background: "Hintergrund",
    deleteSelected: "Auswahl löschen",
    clearBackground: "Hintergrund entfernen",

    select: "Auswählen",
    measure: "Messen",
    calibrate: "Kalibrieren",
    clearMeasurements: "Messungen löschen",

    undo: "Rückgängig",
    redo: "Wiederholen",

    newProjectShort: "Neu",
    save: "Speichern",
    load: "Laden",

    png: "PNG",
    format: "Format",
    formatContent: "Inhalt",
    formatA4Landscape: "DIN A4 quer",
    formatA4Portrait: "DIN A4 hoch",

    printPreview: "Druckvorschau",
    snapToGrid: "Am Raster ausrichten",
    helperLines: "Hilfslinien",

    hotkeyHelp: "Mit Mausrad zoomen / leere Fläche ziehen zum Verschieben",
    wiki: "Wiki",
    language: "Sprache",

    newProjectTitle: "Neues Projekt",
    newProjectBody:
      "Dadurch werden die aktuelle Strecke, Figuren, Messungen, das Hintergrundbild, Texte/Bilder und die Projektdaten gelöscht.",
    unsavedWorkLost: "Nicht gespeicherte Änderungen gehen verloren.",
    cancel: "Abbrechen",
    createNewProject: "Neues Projekt erstellen",

    calibrateTitle: "Hintergrundbild kalibrieren",
    calibrateDescription:
      "Du hast zwei Punkte auf dem Hintergrundbild angeklickt. Gib die echte Entfernung zwischen diesen beiden Punkten ein.",
    measuredDistance: "Gemessene Entfernung:",
    realDistanceMeters: "Echte Entfernung in Metern",
    invalidDistance: "Bitte gib eine gültige Entfernung größer als 0 ein.",
    applyCalibration: "Kalibrierung anwenden",

    welcomeTitle: "Willkommen im Streckentool",
    welcomeIntro:
      "Plane Kart-Slalom-Strecken direkt im Browser. Erstelle Arbeitsflächen, platziere Figuren maßstabsgetreu, füge Messungen hinzu, importiere Hintergrundbilder und exportiere deinen Plan.",
    welcomePrivacyNote:
      "Deine Streckendaten bleiben im Browser, solange du sie nicht selbst exportierst oder als Projektdatei speicherst.",
    welcomeLanguageLabel: "Sprache auswählen",
    welcomeStart: "Planung starten",
    welcomeWikiText: "Wiki öffnen",
    welcomeSupportText: "Projekt unterstützen",

    figureLibrary: "Figurenbibliothek",
    search: "Suche",
    searchFiguresPlaceholder: "Figuren suchen...",
    category: "Kategorie",
    allCategories: "Alle Kategorien",
    figureSingular: "Figur",
    figurePlural: "Figuren",
    clearFilters: "Zurücksetzen",
    noFiguresMatch: "Keine Figuren gefunden.",

    categoryBasic: "Grundlagen",
    categorySlalom: "Slalom",
    categoryGates: "Tore",
    categoryBoxes: "Boxen",
    categoryCustom: "Eigene",
    categoryOther: "Sonstige",

    projectInfo: "Projektdaten",
    untitledCourse: "Unbenannte Strecke",
    courseTitle: "Streckentitel",
    clubOrganisation: "Verein / Organisation",
    eventDate: "Veranstaltungsdatum",
    author: "Autor",
    notes: "Notizen",
    showMetadataTitleBlock: "Projektdaten im Export anzeigen",
        inspector: "Inspektor",
    validCourse: "Gültige Strecke",
    invalidCourse: "Ungültige Strecke",
    addAtLeastOneWorkspace: "Füge mindestens eine Arbeitsfläche hinzu.",
    courseAreaValid: "Die Streckenfläche ist gültig.",
    workspacesMustTouch:
      "Alle Arbeitsflächen müssen die Hauptfläche berühren oder überlappen.",

    figureWarning: "Figurenwarnung",
    isPartlyOutsideCourse: "liegt teilweise außerhalb der Strecke.",
    arePartlyOutsideCourse: "liegen teilweise außerhalb der Strecke.",
    outsideCourse: "Außerhalb der Strecke",

    backgroundImage: "Hintergrundbild",
    locked: "Gesperrt",
    opacity: "Deckkraft",
    xPositionM: "X-Position (m)",
    yPositionM: "Y-Position (m)",
    widthM: "Breite (m)",
    heightM: "Höhe (m)",
    rotationDeg: "Drehung (°)",

    selectObjectHint:
      "Wähle eine Arbeitsfläche, Figur, einen Text oder ein Bild aus, um die Eigenschaften zu bearbeiten.",

    figure: "Figur",
    coneSingular: "Pylon",
    conePlural: "Pylonen",
    isOutsideCourse: "steht außerhalb der Streckenfläche.",
    areOutsideCourse: "stehen außerhalb der Streckenfläche.",
    coneColor: "Pylonenfarbe",
    rotateMinus15: "-15° drehen",
    rotatePlus15: "+15° drehen",
    mirrorFigure: "Figur spiegeln",
    duplicateFigure: "Figur duplizieren",

    file: "Datei",
    fontSizePx: "Schriftgröße (px)",
    textColor: "Textfarbe",
    presetPlan: "Planen",
    presetBackground: "Hintergrund",
    presetExport: "Export",
    presetProject: "Projekt",
    theme: "Design",
    lightMode: "Hell",
    darkMode: "Dunkel",
    close: "Schließen",

    cookiesTitle: "Cookies",
    cookieBannerText:
      "Das Streckentool verwendet nur notwendige lokale Browser-Speicherung für Einstellungen wie Sprache, Design und ausgeblendete Hinweise.",
    acceptCookies: "OK",

    legalImpressumTitle: "Impressum",
    legalPrivacyTitle: "Datenschutzerklärung",
    legalCookiesTitle: "Cookie-Hinweise",
    legalPlaceholderNotice:
      "Dies ist Platzhaltertext und muss vor der Veröffentlichung ersetzt werden.",
    legalImpressumBody:
      "Trage hier die gesetzlich erforderlichen Angaben zum Anbieter ein.",
    legalPrivacyBody:
      "Erkläre hier, welche Daten verarbeitet werden, was lokal im Browser bleibt und welche Dienste verwendet werden.",
    legalCookiesBody:
      "Erkläre hier, welche Cookies oder lokalen Speicher-Einträge verwendet werden und warum.",
    creator: "Creator",
    importCreatorJson: "Creator-JSON importieren",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getStoredLanguage(): AppLanguage {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (storedLanguage === "de" || storedLanguage === "en") {
    return storedLanguage;
  }

  if (navigator.language.toLowerCase().startsWith("de")) {
    return "de";
  }

  return "en";
}

export function setStoredLanguage(language: AppLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  window.dispatchEvent(
    new CustomEvent<AppLanguage>("streckentool-language-change", {
      detail: language,
    })
  );
}

export function translate(language: AppLanguage, key: TranslationKey) {
  return translations[language][key] ?? translations.en[key] ?? key;
}

export function useAppLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>(() =>
    getStoredLanguage()
  );

  useEffect(() => {
    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<AppLanguage>;

      if (customEvent.detail === "en" || customEvent.detail === "de") {
        setLanguageState(customEvent.detail);
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === LANGUAGE_STORAGE_KEY) {
        setLanguageState(getStoredLanguage());
      }
    }

    window.addEventListener(
      "streckentool-language-change",
      handleLanguageChange
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "streckentool-language-change",
        handleLanguageChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setStoredLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  return {
    language,
    setLanguage,
    t: (key: TranslationKey) => translate(language, key),
  };
}