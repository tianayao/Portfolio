import { test, equal, assert } from './harness.js';
import { computeOceanProgress, initOcean, initNavigation } from '../assets/js/ocean.js';

test('ocean progress clamps before and after the descent', () => {
  for (const [scroll, expected] of [[0, 0], [100, 0], [300, .5], [500, 1], [900, 1]]) equal(computeOceanProgress(scroll, 100, 500), expected);
  equal(computeOceanProgress(100, 100, 100), 0);
  equal(computeOceanProgress(200, 100, 100), 1);
  equal(computeOceanProgress(NaN, 0, 100), 0);
});
test('reduced motion reveals immediately and removes parallax', () => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = '<header id="site-header"></header><section data-reveal></section>';
  doc.documentElement.style.setProperty('--pointer-x', '8px');
  initOcean(doc, { matchMedia: () => ({ matches: true }), scrollY: 0 });
  assert(doc.querySelector('[data-reveal]').classList.contains('is-visible'));
  equal(doc.documentElement.style.getPropertyValue('--pointer-x'), '0px');
  equal(doc.documentElement.dataset.motion, 'reduced');
});
test('missing observer and animation APIs retain visible content', () => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = '<section data-reveal></section>';
  initOcean(doc, { scrollY: 0 });
  assert(doc.querySelector('[data-reveal]').classList.contains('is-visible'));
});
test('mobile menu closes on destination, outside press, and Escape', () => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = '<header id="site-header"><button id="menu-toggle" hidden aria-expanded="false"></button><nav id="main-nav"><a href="#work">Work</a></nav></header><main></main>';
  initNavigation(doc);
  const button = doc.querySelector('button');
  equal(button.hidden, false);
  button.click(); equal(button.getAttribute('aria-expanded'), 'true');
  doc.querySelector('a').click(); equal(button.getAttribute('aria-expanded'), 'false');
  button.click(); doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); equal(button.getAttribute('aria-expanded'), 'false');
  button.click(); doc.querySelector('main').dispatchEvent(new Event('pointerdown', { bubbles: true })); equal(button.getAttribute('aria-expanded'), 'false');
});

test('root motion variables reach page descendants', () => {
  const root = document.documentElement;
  const before = root.style.getPropertyValue('--pointer-x');
  root.style.setProperty('--pointer-x', '13px');
  equal(getComputedStyle(document.body).getPropertyValue('--pointer-x').trim(), '13px');
  if (before) root.style.setProperty('--pointer-x', before);
  else root.style.removeProperty('--pointer-x');
});

function channel(value) {
  value /= 255;
  return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
}
function luminance(rgb) {
  const values = rgb.match(/[\d.]+/g).slice(0, 3).map(Number);
  return .2126 * channel(values[0]) + .7152 * channel(values[1]) + .0722 * channel(values[2]);
}
function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + .05) / (dark + .05);
}

test('Moon introduction body copy keeps readable contrast', () => {
  const previous = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = 'moon';
  const section = document.createElement('section');
  section.className = 'intro-section';
  section.innerHTML = '<div class="intro-story"><p>Readable introduction copy</p></div>';
  document.body.append(section);
  const surface = getComputedStyle(section).backgroundColor;
  const ink = getComputedStyle(section.querySelector('.intro-story p')).color;
  assert(contrast(surface, ink) >= 4.5, `Expected 4.5:1 contrast, received ${contrast(surface, ink).toFixed(2)}:1`);
  section.remove();
  if (previous) document.documentElement.dataset.theme = previous;
  else delete document.documentElement.dataset.theme;
});

test('Moon introduction accent text keeps readable contrast', () => {
  const previous = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = 'moon';
  const section = document.createElement('section');
  section.className = 'intro-section';
  section.innerHTML = '<div class="intro-heading"><h2><em>Designer name</em></h2></div><div class="principle-row">Thoughtful experience</div>';
  document.body.append(section);
  const surface = getComputedStyle(section).backgroundColor;
  for (const selector of ['.intro-heading h2 em', '.principle-row']) {
    const ink = getComputedStyle(section.querySelector(selector)).color;
    assert(contrast(surface, ink) >= 4.5, `${selector}: expected 4.5:1 contrast, received ${contrast(surface, ink).toFixed(2)}:1`);
  }
  section.remove();
  if (previous) document.documentElement.dataset.theme = previous;
  else delete document.documentElement.dataset.theme;
});
