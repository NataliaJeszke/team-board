import { cleanupOverlays } from "./cleanupOverlays.utils";

describe('cleanupOverlays', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should remove all .p-menu-overlay elements', () => {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'p-menu-overlay';
    document.body.appendChild(menuOverlay);

    cleanupOverlays();

    expect(document.querySelectorAll('.p-menu-overlay').length).toBe(0);
  });

  it('should remove all .p-component-overlay elements', () => {
    const componentOverlay = document.createElement('div');
    componentOverlay.className = 'p-component-overlay';
    document.body.appendChild(componentOverlay);

    cleanupOverlays();

    expect(document.querySelectorAll('.p-component-overlay').length).toBe(0);
  });

  it('should remove both types of overlays at once', () => {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'p-menu-overlay';
    const componentOverlay = document.createElement('div');
    componentOverlay.className = 'p-component-overlay';
    document.body.appendChild(menuOverlay);
    document.body.appendChild(componentOverlay);

    cleanupOverlays();

    expect(document.querySelectorAll('.p-menu-overlay').length).toBe(0);
    expect(document.querySelectorAll('.p-component-overlay').length).toBe(0);
  });

  it('should do nothing if no overlays exist', () => {
    expect(() => cleanupOverlays()).not.toThrow();
  });
});