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

test('the homepage jellyfish faces the mirrored direction without flipping its stage', () => {
  const stage = document.createElement('figure');
  stage.className = 'hero-jelly-stage';
  const image = document.createElement('img');
  stage.append(image);
  document.body.append(stage);
  try {
    const imageTransform = getComputedStyle(image).transform;
    const stageTransform = getComputedStyle(stage).transform;
    assert(imageTransform.startsWith('matrix(-1,'), `Expected a horizontal image flip, received ${imageTransform}`);
    assert(!stageTransform.startsWith('matrix(-1,'), 'The parallax stage was flipped with the image');
  } finally {
    stage.remove();
  }
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
  section.innerHTML = '<div class="intro-heading"><h2><em>Designer name</em></h2><p class="intro-role">Thoughtful experience</p></div>';
  document.body.append(section);
  const surface = getComputedStyle(section).backgroundColor;
  for (const selector of ['.intro-heading h2 em', '.intro-role']) {
    const ink = getComputedStyle(section.querySelector(selector)).color;
    assert(contrast(surface, ink) >= 4.5, `${selector}: expected 4.5:1 contrast, received ${contrast(surface, ink).toFixed(2)}:1`);
  }
  section.remove();
  if (previous) document.documentElement.dataset.theme = previous;
  else delete document.documentElement.dataset.theme;
});

test('wide introduction keeps its editorial heading bounded before the exploration row', () => {
  if (!matchMedia('(min-width: 961px)').matches) return;
  const section = document.createElement('section');
  section.className = 'intro-section';
  section.innerHTML = `
    <div class="intro-grid">
      <div class="intro-heading"><h2>Hi, I’m<br><em>Tina!</em></h2><p class="intro-role">Curious about people.</p></div>
      <div class="intro-story"><div class="intro-copy-group intro-copy-group--background"><p>One</p><p>Two</p><p>Three</p></div></div>
    </div>`;
  document.body.append(section);
  try {
    const grid = getComputedStyle(section.querySelector('.intro-grid'));
    const heading = getComputedStyle(section.querySelector('.intro-heading'));
    const story = getComputedStyle(section.querySelector('.intro-story'));
    assert(grid.gridTemplateColumns.split(' ').length >= 2, `Expected a two-column spread, received ${grid.gridTemplateColumns}`);
    equal(heading.position, 'relative');
    assert(parseFloat(story.maxWidth) >= 560 && parseFloat(story.maxWidth) <= 760, `Expected a bounded reading column, received ${story.maxWidth}`);
  } finally {
    section.remove();
  }
});

test('intro role is bold and the first two biography paragraphs share typography', () => {
  const section = document.createElement('section');
  section.className = 'intro-section';
  section.innerHTML = `
    <p class="intro-role"><em>Curious about people. Playful with technology.</em></p>
    <div class="intro-copy-group intro-copy-group--background">
      <p>Originally from China and now based in London.</p>
      <p>With a background in Interactive Media and Design Informatics.</p>
    </div>`;
  document.body.append(section);
  try {
    const role = getComputedStyle(section.querySelector('.intro-role'));
    assert(Number(role.fontWeight) >= 700, `Expected bold role copy, received ${role.fontWeight}`);
    const [first, second] = [...section.querySelectorAll('.intro-copy-group--background p')]
      .map(paragraph => getComputedStyle(paragraph));
    equal(second.fontFamily, first.fontFamily);
    equal(second.fontSize, first.fontSize);
    equal(second.lineHeight, first.lineHeight);
  } finally {
    section.remove();
  }
});

test('each intro concept state gives the irregular shape a distinct colour', () => {
  const root = document.createElement('section');
  root.className = 'intro-concepts';
  root.innerHTML = '<span class="concept-blob"></span>';
  document.body.append(root);
  try {
    root.querySelector('.concept-blob').style.transition = 'none';
    const colours = ['observe', 'listen', 'make'].map(concept => {
      root.dataset.activeConcept = concept;
      return getComputedStyle(root.querySelector('.concept-blob')).backgroundColor;
    });
    equal(new Set(colours).size, 3, `Expected three colours, received ${colours.join(', ')}`);
  } finally {
    root.remove();
  }
});
