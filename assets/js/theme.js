const themeColors = { coast: '#e7f2eb', moon: '#222d4a', coral: '#fff0e7' };
const isTheme = value => Object.hasOwn(themeColors, value);

export function safeReadTheme(storage) {
  try {
    const value = storage?.getItem('ocean-theme');
    return isTheme(value) ? value : 'coast';
  } catch { return 'coast'; }
}

export function createThemeController(storage, root, controls) {
  const buttons = Array.from(controls);
  function apply(theme) {
    root.dataset.theme = theme;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    const meta = root.ownerDocument.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = themeColors[theme];
  }
  function setTheme(theme) {
    if (!isTheme(theme)) return false;
    apply(theme);
    try { storage?.setItem('ocean-theme', theme); } catch { /* Private browsing may prohibit writes. */ }
    return true;
  }
  apply(safeReadTheme(storage));
  for (const button of buttons) button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
  return { setTheme };
}
