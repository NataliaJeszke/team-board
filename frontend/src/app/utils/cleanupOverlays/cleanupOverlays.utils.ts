export function cleanupOverlays(): void {
    document
      .querySelectorAll('.p-menu-overlay, .p-component-overlay')
      .forEach(overlay => overlay.remove());
  }