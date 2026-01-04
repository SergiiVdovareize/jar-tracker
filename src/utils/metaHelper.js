export const setMetaTheme = color => {
  try {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (metaThemeColor.getAttribute('content') !== color) {
        metaThemeColor.setAttribute('content', color);
      }
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  } catch (error) {
    console.error('Error setting meta theme color:', error);
  }
};
