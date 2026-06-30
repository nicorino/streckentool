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

    tutorial: "Tutorial",
    tutorialStep: "Step",
    tutorialBack: "Back",
    tutorialNext: "Next",
    tutorialFinish: "Finish",
    tutorialSkip: "Skip",
    tutorialClickTarget: "Click the highlighted item or use Next.",
    tutorialCourseTitle: "Open the course tools",
    tutorialCourseBody:
      "Start in the Course tab. This is where you add the course area, text, images, arrows, and measurements.",
    tutorialCourseAreaTitle: "Add a course area",
    tutorialCourseAreaBody:
      "Click Course area to add the first driveable area. You can resize and rotate it on the canvas afterward.",
    tutorialFigureTitle: "Choose a figure",
    tutorialFigureBody:
      "Use the figure library on the right. Pick the configurable Slalom to create a simple starter figure without importing files.",
    tutorialCanvasTitle: "Place the figure",
    tutorialCanvasBody:
      "Click on the canvas to place the selected figure. After placing it, the inspector on the left lets you adjust position, rotation, color, and slalom settings.",
    tutorialExportTitle: "Open export tools",
    tutorialExportBody:
      "When the plan is ready, switch to Export. This is where you choose PNG or PDF and the page format.",
    tutorialExportSettingsTitle: "Export the plan",
    tutorialExportSettingsBody:
      "Open Export settings to preview the output, choose quality, set the filename, and export the course plan.",
    saveProjectFile: "Save project file",
    loadProjectFile: "Load project file",
    figureCreator: "Figure creator",

    groupAdd: "Add",
    groupEdit: "Edit",
    groupTools: "Tools",
    groupHistory: "History",
    groupView: "View",
    groupProject: "Project",
    groupExport: "Export",
    groupDisplay: "Display",

    workspace: "Course area",
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
    loadExampleCourse: "Load example",
    loadExampleConfirm:
      "This will replace the current project with an example course. Continue?",
    save: "Save",
    load: "Load",

    png: "PNG",
    pdf: "PDF",
    exportFileType: "File type",
    exportPngOption: "PNG image",
    exportPdfOption: "PDF document",
    exportPngHint: "Best for sharing as an image or inserting into other documents.",
    exportPdfHint: "Best for printing, sending, and archiving the course plan.",
    exportSettings: "Export…",
    exportDialogTitle: "Export course",
    exportDialogSubtitle: "Choose format, quality, and filename before exporting.",
    exportFormat: "Export format",
    exportOptions: "Options",
    exportFilename: "Filename",
    exportQuality: "Quality",
    exportNow: "Export file",
    exportWindowHint:
      "The final export hides editor-only decorations. Print preview changes the live canvas view.",
    exportToolbarHint: "Open export settings for format, quality, and filename.",
    exportPreview: "Preview",
    exportPreviewLoading: "Generating preview…",
    exportPreviewUnavailable: "Preview unavailable",
    refreshPreview: "Refresh preview",
    exportPreviewHint:
      "Preview uses a lower resolution for speed. The final export uses the selected quality.",
    exportA4LandscapeHint: "Best for printed course plans.",
    exportA4PortraitHint: "Tall page layout.",
    exportContentHint: "Tight bounds around course content.",
    format: "Format",
    formatContent: "Content bounds",
    formatA4Landscape: "DIN A4 landscape",
    formatA4Portrait: "DIN A4 portrait",

    printPreview: "Print preview",
    snapToGrid: "Snap to grid",
    helperLines: "Helper lines",

    hotkeyHelp: "Mouse wheel zoom / drag empty canvas to pan",    wiki: "Wiki",
    language: "Language",
    support: "Support",
    arrowStraight: "Arrow",
    arrowLong: "Long arrow",
    arrowCurveRight: "Turn right",
    arrowCurveLeft: "Turn left",
    projectBasics: "Event",
    projectPeople: "People / administration",
    projectLogo: "Project logo",
    projectLogoHint: "Optional logo shown at the top right of the export.",
    projectLogoWidth: "Logo width",
    titleBlockWidth: "Info box width",
    titleBlockTitleFontSize: "Title font size",
    titleBlockBodyFontSize: "Text font size",
    importProjectLogo: "Import logo",
    removeProjectLogo: "Remove",
    exportInformation: "Export information",
    insuranceNumber: "Insurance number",
    observer: "Observer",

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
    welcomeStartEmptyTitle: "Start empty project",
    welcomeStartEmptyBody: "Open a blank planning canvas.",
    welcomeExampleTitle: "Load example course",
    welcomeExampleBody: "See a complete starter course immediately.",
    welcomeTutorialTitle: "Start guided tutorial",
    welcomeTutorialBody: "Walk through the most important controls step by step.",
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
    addAtLeastOneWorkspace: "Add at least one course area.",
    courseAreaValid: "Course area is valid.",
    workspacesMustTouch:
      "All course areas must touch or overlap with the main course area.",

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
      "Select a course area, figure, text, or image to edit its properties.",
    selectedObject: "Selected object",
    basics: "Basics",
    layout: "Layout",
    appearance: "Appearance",
    actions: "Actions",
    advanced: "Advanced",
    content: "Content",
    metrics: "Metrics",
    position: "Position",
    size: "Size",
    backgroundSettings: "Background settings",

    statusReady: "Ready.",
    statusEditSelection: "Edit the selected object in the inspector.",
    statusPlaceFigure: "Click canvas to place the selected figure.",
    statusPlaceArrow: "Click canvas to place the arrow.",
    statusMeasureFirst: "Click the first point to start measuring.",
    statusMeasureSecond: "Click the second point to finish the measurement.",
    statusCalibrateFirst: "Click the first calibration point on the background.",
    statusCalibrateSecond: "Click the second calibration point.",
    unsavedLeaveWarning:
      "You have unsaved changes. Leave this page anyway?",

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
    figureSettings: "Figure settings",
    slalomConeCount: "Slalom cones",
    slalomConeDistance: "Cone distance (m)",

    file: "File",
    fontSizePx: "Font size (px)",
    textColor: "Text color",
    presetPlan: "Course",
    presetBackground: "Background",
    presetExport: "Export",
    presetProject: "File",
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

    tutorial: "Tutorial",
    tutorialStep: "Schritt",
    tutorialBack: "Zurück",
    tutorialNext: "Weiter",
    tutorialFinish: "Fertig",
    tutorialSkip: "Überspringen",
    tutorialClickTarget: "Klicke auf das hervorgehobene Element oder nutze Weiter.",
    tutorialCourseTitle: "Strecken-Werkzeuge öffnen",
    tutorialCourseBody:
      "Beginne im Reiter Strecke. Dort fügst du Streckenbereiche, Text, Bilder, Pfeile und Messungen hinzu.",
    tutorialCourseAreaTitle: "Streckenbereich hinzufügen",
    tutorialCourseAreaBody:
      "Klicke auf Streckenbereich, um die erste befahrbare Fläche anzulegen. Danach kannst du sie auf der Arbeitsfläche vergrößern, verschieben und drehen.",
    tutorialFigureTitle: "Figur auswählen",
    tutorialFigureBody:
      "Nutze die Figurenbibliothek rechts. Wähle den konfigurierbaren Slalom, um ohne Datei-Import eine einfache Startfigur zu platzieren.",
    tutorialCanvasTitle: "Figur platzieren",
    tutorialCanvasBody:
      "Klicke auf die Arbeitsfläche, um die ausgewählte Figur zu platzieren. Danach kannst du sie links im Inspektor anpassen.",
    tutorialExportTitle: "Export-Werkzeuge öffnen",
    tutorialExportBody:
      "Wenn der Plan fertig ist, wechsle zu Export. Dort wählst du PNG oder PDF und das Seitenformat.",
    tutorialExportSettingsTitle: "Plan exportieren",
    tutorialExportSettingsBody:
      "Öffne die Exportoptionen, um die Vorschau zu sehen, Qualität und Dateiname zu wählen und den Streckenplan zu exportieren.",
    saveProjectFile: "Projektdatei speichern",
    loadProjectFile: "Projektdatei laden",
    figureCreator: "Figuren-Creator",

    groupAdd: "Hinzufügen",
    groupEdit: "Bearbeiten",
    groupTools: "Werkzeuge",
    groupHistory: "Verlauf",
    groupView: "Ansicht",
    groupProject: "Projekt",
    groupExport: "Export",
    groupDisplay: "Anzeige",

    workspace: "Streckenbereich",
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
    loadExampleCourse: "Beispiel laden",
    loadExampleConfirm:
      "Das aktuelle Projekt wird durch eine Beispielstrecke ersetzt. Fortfahren?",
    save: "Speichern",
    load: "Laden",

    png: "PNG",
    pdf: "PDF",
    exportFileType: "Dateityp",
    exportPngOption: "PNG-Bild",
    exportPdfOption: "PDF-Dokument",
    exportPngHint: "Gut zum Teilen als Bild oder zum Einfügen in andere Dokumente.",
    exportPdfHint: "Gut zum Drucken, Versenden und Archivieren des Streckenplans.",
    exportSettings: "Export…",
    exportDialogTitle: "Strecke exportieren",
    exportDialogSubtitle: "Format, Qualität und Dateiname vor dem Export auswählen.",
    exportFormat: "Exportformat",
    exportOptions: "Optionen",
    exportFilename: "Dateiname",
    exportQuality: "Qualität",
    exportNow: "Datei exportieren",
    exportWindowHint:
      "Der finale Export blendet reine Editor-Hilfen aus. Die Druckvorschau ändert die aktuelle Canvas-Ansicht.",
    exportToolbarHint: "Öffne die Exportoptionen für Format, Qualität und Dateiname.",
    exportPreview: "Vorschau",
    exportPreviewLoading: "Vorschau wird erstellt…",
    exportPreviewUnavailable: "Vorschau nicht verfügbar",
    refreshPreview: "Vorschau aktualisieren",
    exportPreviewHint:
      "Die Vorschau nutzt eine niedrigere Auflösung. Der finale Export nutzt die gewählte Qualität.",
    exportA4LandscapeHint: "Optimal für gedruckte Streckenpläne.",
    exportA4PortraitHint: "Hochformatiges Seitenlayout.",
    exportContentHint: "Enger Rahmen um den Streckeninhalt.",
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
    support: "Unterstützen",
    arrowStraight: "Pfeil",
    arrowLong: "Langer Pfeil",
    arrowCurveRight: "Rechts abbiegen",
    arrowCurveLeft: "Links abbiegen",
    projectBasics: "Veranstaltung",
    projectPeople: "Personen / Verwaltung",
    projectLogo: "Projektlogo",
    projectLogoHint: "Optionales Logo oben rechts im Export.",
    projectLogoWidth: "Logobreite",
    titleBlockWidth: "Infobox-Breite",
    titleBlockTitleFontSize: "Titel-Schriftgröße",
    titleBlockBodyFontSize: "Text-Schriftgröße",
    importProjectLogo: "Logo importieren",
    removeProjectLogo: "Entfernen",
    exportInformation: "Exportinformationen",
    insuranceNumber: "Versicherungsnummer",
    observer: "Observer",

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
      "Plane Kart-Slalom-Strecken direkt im Browser. Erstelle Streckenbereiche, platziere Figuren maßstabsgetreu, füge Messungen hinzu, importiere Hintergrundbilder und exportiere deinen Plan.",
    welcomePrivacyNote:
      "Deine Streckendaten bleiben im Browser, solange du sie nicht selbst exportierst oder als Projektdatei speicherst.",
    welcomeLanguageLabel: "Sprache auswählen",
    welcomeStart: "Planung starten",
    welcomeStartEmptyTitle: "Leeres Projekt starten",
    welcomeStartEmptyBody: "Öffnet eine leere Planungsfläche.",
    welcomeExampleTitle: "Beispielstrecke laden",
    welcomeExampleBody: "Zeigt sofort eine fertige kleine Beispielstrecke.",
    welcomeTutorialTitle: "Geführtes Tutorial starten",
    welcomeTutorialBody: "Führt Schritt für Schritt durch die wichtigsten Funktionen.",
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
    addAtLeastOneWorkspace: "Füge mindestens einen Streckenbereich hinzu.",
    courseAreaValid: "Die Streckenfläche ist gültig.",
    workspacesMustTouch:
      "Alle Streckenbereiche müssen die Hauptfläche berühren oder überlappen.",

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
      "Wähle einen Streckenbereich, eine Figur, einen Text oder ein Bild aus, um die Eigenschaften zu bearbeiten.",
    selectedObject: "Ausgewähltes Objekt",
    basics: "Grunddaten",
    layout: "Layout",
    appearance: "Darstellung",
    actions: "Aktionen",
    advanced: "Erweitert",
    content: "Inhalt",
    metrics: "Maße",
    position: "Position",
    size: "Größe",
    backgroundSettings: "Hintergrund-Einstellungen",

    statusReady: "Bereit.",
    statusEditSelection: "Bearbeite das ausgewählte Objekt im Inspektor.",
    statusPlaceFigure: "Klicke auf die Arbeitsfläche, um die ausgewählte Figur zu platzieren.",
    statusPlaceArrow: "Klicke auf die Arbeitsfläche, um den Pfeil zu platzieren.",
    statusMeasureFirst: "Klicke den ersten Punkt an, um eine Messung zu starten.",
    statusMeasureSecond: "Klicke den zweiten Punkt an, um die Messung abzuschließen.",
    statusCalibrateFirst: "Klicke den ersten Kalibrierpunkt auf dem Hintergrund an.",
    statusCalibrateSecond: "Klicke den zweiten Kalibrierpunkt an.",
    unsavedLeaveWarning:
      "Du hast ungespeicherte Änderungen. Seite trotzdem verlassen?",

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
    figureSettings: "Figur-Einstellungen",
    slalomConeCount: "Slalom-Pylonen",
    slalomConeDistance: "Pylonenabstand (m)",

    file: "Datei",
    fontSizePx: "Schriftgröße (px)",
    textColor: "Textfarbe",
    presetPlan: "Strecke",
    presetBackground: "Hintergrund",
    presetExport: "Export",
    presetProject: "Datei",
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
