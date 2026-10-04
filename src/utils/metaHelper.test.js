import { setMetaTheme } from './metaHelper';

describe('metaHelper', () => {
  afterEach(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.remove();
    }
    jest.restoreAllMocks();
  });

  it('creates meta tag if not present and sets content color', () => {
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();

    setMetaTheme('#0057a4');

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe('#0057a4');
  });

  it('updates existing meta tag content if color changes', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#0057a4';
    document.head.appendChild(meta);

    setMetaTheme('#0d8638');
    expect(meta.getAttribute('content')).toBe('#0d8638');
  });

  it('does not re-set attribute if color is already identical', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#0d8638';
    document.head.appendChild(meta);

    const setAttributeSpy = jest.spyOn(meta, 'setAttribute');
    setMetaTheme('#0d8638');

    expect(setAttributeSpy).not.toHaveBeenCalled();
  });

  it('catches and logs errors when querySelector throws', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      throw new Error('DOM exception');
    });

    setMetaTheme('#123456');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error setting meta theme color:',
      expect.any(Error)
    );
  });
});
