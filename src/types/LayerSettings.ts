export type LayerSettings = {
  showBackground: boolean;
  showWorkspaces: boolean;
  showFigures: boolean;
  showDecorations: boolean;
  showMeasurements: boolean;

  // Global workspace lock. Individual workspaces can still have their own lock.
  lockWorkspaces: boolean;
};

export function createDefaultLayerSettings(): LayerSettings {
  return {
    showBackground: true,
    showWorkspaces: true,
    showFigures: true,
    showDecorations: true,
    showMeasurements: true,
    lockWorkspaces: false,
  };
}
