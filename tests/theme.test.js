import { test, equal, assert } from './harness.js';
import { safeReadTheme, createThemeController } from '../assets/js/theme.js';

test('valid saved themes survive initialization', () => {
  for (const theme of ['coast', 'moon', 'coral']) equal(safeReadTheme({ getItem: () => theme }), theme);
});
test('missing, corrupt, and inaccessible storage use Coast', () => {
  for (const value of [null, '', 'invalid', 'Moon', '{}']) equal(safeReadTheme({ getItem: () => value }), 'coast');
  equal(safeReadTheme({ getItem() { throw new Error('blocked'); } }), 'coast');
  equal(safeReadTheme(null), 'coast');
});
test('theme selection updates all controls, metadata, and persisted preference', () => {
  const doc = document.implementation.createHTMLDocument();
  doc.head.innerHTML = '<meta name="theme-color" content="">';
  doc.body.innerHTML = '<button data-theme-choice="coast"></button><button data-theme-choice="moon"></button><button data-theme-choice="coral"></button><button data-theme-choice="moon"></button>';
  const storage = new Map([['ocean-theme', 'coral']]);
  const controller = createThemeController({ getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }, doc.documentElement, doc.querySelectorAll('button'));
  equal(doc.documentElement.dataset.theme, 'coral');
  doc.querySelector('[data-theme-choice="moon"]').click();
  equal(storage.get('ocean-theme'), 'moon');
  equal(doc.documentElement.dataset.theme, 'moon');
  equal(doc.querySelector('meta').content, '#222d4a');
  for (const control of doc.querySelectorAll('button')) equal(control.getAttribute('aria-pressed'), String(control.dataset.themeChoice === 'moon'));
  equal(controller.setTheme('invalid'), false);
  equal(doc.documentElement.dataset.theme, 'moon');
});
test('blocked writes do not prevent visible theme changes', () => {
  const doc = document.implementation.createHTMLDocument();
  const controller = createThemeController({ getItem() { throw Error(); }, setItem() { throw Error(); } }, doc.documentElement, []);
  assert(controller.setTheme('coral'));
  equal(doc.documentElement.dataset.theme, 'coral');
});
