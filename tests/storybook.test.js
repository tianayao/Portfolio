import { test, assert, equal } from './harness.js';
import { createStoryState } from '../assets/js/state.js';
import { createStorybook } from '../assets/js/storybook.js?v=10';

const pixel = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const prototypeUrl = 'https://bl-universal-media-library-portfolio.dessertthebest.chatgpt.site/';
const figmaUrl = 'https://www.figma.com/design/hgR9uTrAHUs9RrchdEiw8D/exhibtion?node-id=0-1&t=eJpDqFuzQuz0Gr5B-1';

const chapters = [
  {
    number: 1,
    label: 'Overview',
    title: 'Overview: Test story',
    narrative: 'Overview narrative stays still while the gallery moves.',
    insight: 'Overview insight.',
    images: [
      { src: null, alt: 'Overview paper placeholder', caption: 'Overview image one' },
      { src: pixel, alt: 'Overview rendered image', caption: 'Overview image two', fit: 'contain' },
      { src: pixel, alt: 'Overview portrait poster', caption: 'Overview image three', layout: 'portrait' },
    ],
  },
  { number: 2, label: 'Problem', title: 'Problem: Test story', narrative: 'Problem narrative.', insight: 'Problem insight.', images: [{ src: null, alt: 'Problem placeholder', caption: 'Problem image one' }, { src: null, alt: 'Problem second placeholder', caption: 'Problem image two' }] },
  {
    number: 3,
    label: 'Research',
    title: 'Research: Test story',
    narrative: 'Research narrative.',
    insight: 'Research insight.',
    images: [{ src: null, alt: 'Research placeholder', caption: 'Research image one' }],
    sources: [
      { label: 'Peer-reviewed research', href: 'https://example.com/study' },
      { label: 'Unsafe source', href: 'javascript:alert(1)' },
    ],
  },
  { number: 4, label: 'Ideation', title: 'Ideation: Test story', narrative: 'Ideation narrative.', insight: 'Ideation insight.', images: [{ src: null, alt: 'Ideation placeholder', caption: 'Ideation image one' }] },
  { number: 5, label: 'Solution', title: 'Solution: Test story', narrative: 'Solution narrative.', insight: 'Solution insight.', images: [{ src: null, alt: 'Solution placeholder', caption: 'Solution image one' }] },
  { number: 6, label: 'Reflection', title: 'Reflection: Test story', narrative: 'Reflection narrative.', insight: 'Reflection insight.', images: [{ src: null, alt: 'Reflection placeholder', caption: 'Reflection image one' }] },
];

const edgeChapters = chapters.map((chapter, index) => ({
  ...chapter,
  title: `${chapter.label}: Edge story`,
  images: index === 0 ? [] : index === 1 ? [{ src: null, alt: 'Only image placeholder', caption: 'Only image' }] : chapter.images.slice(0, 1),
}));

const bookProjects = [
  { slug: 'test-story', title: 'Test Story', type: 'Illustrative test', summary: 'Test summary.', accent: '#765068', chapters },
  { slug: 'edge-story', title: 'Edge Story', type: 'Illustrative test', summary: 'Edge summary.', accent: '#486b72', chapters: edgeChapters },
  {
    slug: 'prototype-story',
    title: 'Prototype Story',
    type: 'Product design case study',
    summary: 'Prototype summary.',
    accent: '#6f7d68',
    chapters: chapters.map((chapter, index) => ({
      ...chapter,
      images: index === 0 ? [{
        src: null,
        href: prototypeUrl,
        eyebrow: 'Interactive mobile prototype',
        title: 'BL Universal Media Library',
        subtitle: 'A calmer discovery and tracking layer',
        cta: 'Open prototype',
        alt: 'Open the BL Universal Media Library interactive prototype',
        caption: 'Interactive prototype · opens in a new tab',
      }] : chapter.images,
    })),
  },
  {
    slug: 'unsafe-prototype-story',
    title: 'Unsafe Prototype Story',
    type: 'Safety fixture',
    summary: 'Unsafe fixture.',
    accent: '#6f7d68',
    chapters: chapters.map((chapter, index) => ({
      ...chapter,
      images: index === 0 ? [{ src: null, href: 'javascript:alert(1)', alt: 'Unsafe prototype', caption: 'Unsafe prototype' }] : chapter.images,
    })),
  },
  {
    slug: 'panorama-story',
    title: 'Panorama Story',
    type: 'AR installation case study',
    summary: 'Panorama fixture.',
    accent: '#98594d',
    chapters: chapters.map((chapter, index) => ({
      ...chapter,
      images: index === 0 ? [{
        src: pixel,
        panorama: true,
        href: figmaUrl,
        cta: 'Open interactive prototype in Figma ↗',
        alt: 'Wide Exo-Fits interface panorama',
        caption: 'Drag sideways to compare the final interface states.',
      }] : chapter.images,
    })),
  },
  {
    slug: 'unsafe-panorama-story',
    title: 'Unsafe Panorama Story',
    type: 'Safety fixture',
    summary: 'Unsafe panorama fixture.',
    accent: '#98594d',
    chapters: chapters.map((chapter, index) => ({
      ...chapter,
      images: index === 0 ? [{ src: pixel, panorama: true, href: 'javascript:alert(1)', alt: 'Safe panorama image', caption: 'Safe image' }] : chapter.images,
    })),
  },
];

const wait = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds));

function restoredTop(call) {
  if (!call) return null;
  return typeof call[0] === 'object' ? call[0].top : call[1];
}

function setup({ reduced = false, theme: initialTheme = 'coast', transitionMs = 40, fallback = null } = {}) {
  const previousTheme = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = initialTheme;

  const workHeading = document.createElement('h2');
  workHeading.id = 'work-title';
  workHeading.tabIndex = -1;
  workHeading.textContent = 'Work';
  const origin = document.createElement('button');
  origin.type = 'button';
  origin.textContent = 'Open test story';
  const dialog = document.createElement('dialog');
  dialog.id = `story-test-${Math.random().toString(36).slice(2)}`;
  document.body.append(workHeading, origin, dialog);
  if (fallback === 'missing') Object.defineProperty(dialog, 'showModal', { configurable: true, value: undefined });
  if (fallback === 'throwing') Object.defineProperty(dialog, 'showModal', { configurable: true, value: () => { throw new Error('showModal unavailable'); } });

  const scrollCalls = [];
  const view = {
    scrollY: 246,
    scrollTo: (...args) => scrollCalls.push(args),
    matchMedia: () => ({ matches: reduced }),
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
  };
  const state = createStoryState(bookProjects);
  let theme = initialTheme;
  let closedCount = 0;
  const reader = createStorybook({
    dialog,
    state,
    projects: bookProjects,
    getTheme: () => theme,
    onThemeChange: next => {
      theme = next;
      document.documentElement.dataset.theme = next;
    },
    onClosed: () => { closedCount += 1; },
    transitionMs,
    win: view,
  });

  return {
    reader,
    state,
    dialog,
    origin,
    workHeading,
    scrollCalls,
    get closedCount() { return closedCount; },
    cleanup() {
      if (dialog.open) reader.close();
      dialog.remove();
      origin.remove();
      workHeading.remove();
      if (previousTheme) document.documentElement.dataset.theme = previousTheme;
      else delete document.documentElement.dataset.theme;
    },
  };
}

async function usingReader(options, run) {
  const fixture = setup(options);
  try { await run(fixture); }
  finally { fixture.cleanup(); }
}

function parsedColor(value) {
  const channels = value.match(/[\d.]+/g)?.map(Number) || [];
  return { channels: channels.slice(0, 3), alpha: channels.length > 3 ? channels[3] : 1 };
}

function linearChannel(value) {
  const channel = value / 255;
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
}

function luminance(channels) {
  return .2126 * linearChannel(channels[0]) + .7152 * linearChannel(channels[1]) + .0722 * linearChannel(channels[2]);
}

function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + .05) / (dark + .05);
}

// Catches opening the wrong project, an unnamed dialog, or focus landing behind the modal.
test('opening a valid project renders an accessible first chapter and focuses close', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  origin.focus();
  equal(reader.open('test-story', origin), true);
  assert(dialog.open);
  equal(state.state.activeProject.slug, 'test-story');
  equal(state.state.chapterIndex, 0);
  equal(dialog.getAttribute('aria-modal'), 'true');
  equal(dialog.getAttribute('aria-label'), 'Test Story storybook');
  equal(dialog.hasAttribute('aria-labelledby'), false);
  equal(dialog.querySelector('[data-story-chapter-title]').textContent, 'Overview: Test story');
  equal(document.activeElement, dialog.querySelector('[data-story-close]'));
  equal(dialog.querySelectorAll('[data-story-diamond]').length, 6);
  equal(dialog.querySelectorAll('[data-story-pill]').length, 0);
  equal(dialog.querySelector('[data-story-diamond][data-chapter-index="0"]').getAttribute('aria-current'), 'step');
}));

// Catches wide diagrams being cropped by the default photographic cover treatment.
test('gallery media can request a contained fit that keeps the complete image visible', () => usingReader({}, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  reader.moveImage(1);
  assert(dialog.querySelector('[data-gallery-media] img').classList.contains('storybook-media-image--contain'));
}));

test('gallery media can request a portrait poster treatment', () => usingReader({}, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  reader.moveImage(2);
  assert(dialog.querySelector('[data-gallery-media] img').classList.contains('storybook-media-image--portrait'));
}));

// Catches unsupported links being exposed or empty citation chrome appearing on every chapter.
test('research chapters render only safe cited sources and empty chapters render no source region', () => usingReader({ reduced: true }, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  const sources = dialog.querySelector('[data-story-sources]');
  equal(sources.hidden, true);
  reader.setChapter(2);
  equal(sources.hidden, false);
  const links = sources.querySelectorAll('a');
  equal(links.length, 1);
  equal(links[0].textContent, 'Peer-reviewed research');
  equal(links[0].href, 'https://example.com/study');
  equal(links[0].target, '_blank');
  assert(links[0].relList.contains('noopener'));
  assert(links[0].relList.contains('noreferrer'));
}));

// Catches the prototype cover becoming a passive placeholder, replacing the portfolio tab, or exposing window.opener.
test('HTTPS prototype media renders as a safe accessible cover link', () => usingReader({}, ({ reader, dialog, origin }) => {
  equal(reader.open('prototype-story', origin), true);
  const cover = dialog.querySelector('a[data-prototype-cover]');
  assert(cover, 'Prototype media did not render as a link');
  equal(cover.href, prototypeUrl);
  equal(cover.target, '_blank');
  assert(cover.relList.contains('noopener'));
  assert(cover.relList.contains('noreferrer'));
  equal(cover.getAttribute('aria-label'), 'Open the BL Universal Media Library interactive prototype');
  assert(cover.textContent.includes('BL Universal Media Library'));
  assert(cover.textContent.includes('Open prototype'));
  equal(dialog.querySelector('[data-gallery-count]').textContent, '01 / 01');
  const frameRect = cover.closest('.storybook-media-frame').getBoundingClientRect();
  const ctaRect = cover.querySelector('.storybook-prototype-cta').getBoundingClientRect();
  assert(ctaRect.top >= frameRect.top - 1, 'Prototype action escapes above the cover frame');
  assert(ctaRect.bottom <= frameRect.bottom + 1, 'Prototype action is clipped below the cover frame');
}));

// Catches unsafe protocols being promoted into clickable project-cover navigation.
test('non-HTTPS prototype media stays a non-interactive placeholder', () => usingReader({}, ({ reader, dialog, origin }) => {
  equal(reader.open('unsafe-prototype-story', origin), true);
  equal(dialog.querySelector('a[data-prototype-cover]'), null);
  assert(dialog.querySelector('.storybook-media-placeholder'));
}));

// Catches the panorama image becoming the Figma link or losing the independently focusable action.
test('panorama media is draggable content with a separate safe Figma button', () => usingReader({}, ({ reader, dialog, origin }) => {
  equal(reader.open('panorama-story', origin), true);
  const track = dialog.querySelector('[data-panorama-track]');
  const image = track?.querySelector('img');
  const link = dialog.querySelector('[data-panorama-link]');
  assert(track, 'Panorama track is missing');
  equal(track.tabIndex, 0);
  assert(image, 'Panorama image is missing');
  equal(image.closest('a'), null);
  assert(link, 'Separate Figma button is missing');
  equal(track.contains(link), false);
  equal(link.href, figmaUrl);
  equal(link.target, '_blank');
  assert(link.relList.contains('noopener'));
  assert(link.relList.contains('noreferrer'));
  equal(link.textContent, 'Open interactive prototype in Figma ↗');
}));

// Catches panorama arrow keys turning a gallery image instead of panning the wide artwork.
test('focused panorama arrow keys pan without changing the gallery image', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  reader.open('panorama-story', origin);
  const track = dialog.querySelector('[data-panorama-track]');
  track.scrollLeft = 160;
  track.focus();
  track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  assert(track.scrollLeft > 160);
  equal(state.state.imageIndex, 0);
  const afterRight = track.scrollLeft;
  track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
  assert(track.scrollLeft < afterRight);
  equal(state.state.imageIndex, 0);
}));

// Catches pointer dragging changing chapters, doing nothing, or leaving the surface in a stuck drag state.
test('pointer dragging pans the panorama and releases cleanly', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  reader.open('panorama-story', origin);
  const track = dialog.querySelector('[data-panorama-track]');
  track.scrollLeft = 240;
  track.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 300, button: 0 }));
  track.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 180, buttons: 1 }));
  assert(track.scrollLeft > 240);
  assert(track.classList.contains('is-dragging'));
  track.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, clientX: 180 }));
  equal(track.classList.contains('is-dragging'), false);
  equal(state.state.chapterIndex, 0);
  equal(state.state.imageIndex, 0);
}));

// Catches URL sanitisation removing the panorama itself or accidentally exposing an unsafe action.
test('unsafe panorama URLs hide the button but preserve the draggable image', () => usingReader({}, ({ reader, dialog, origin }) => {
  reader.open('unsafe-panorama-story', origin);
  assert(dialog.querySelector('[data-panorama-track]'));
  assert(dialog.querySelector('[data-panorama-track] img'));
  equal(dialog.querySelector('[data-panorama-link]'), null);
}));

// Catches a missing slug mutating state, opening an empty modal, or stealing focus.
test('invalid project slugs leave dialog state and focus unchanged', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  origin.focus();
  equal(reader.open('missing-story', origin), false);
  equal(state.state.activeProject, null);
  equal(dialog.open, false);
  equal(document.activeElement, origin);
}));

// Catches the non-native modal falling into document flow under the sticky page header.
test('fallback modal is fixed above the page and fully cleans its marker and inert state', async () => {
  for (const fallback of ['missing', 'throwing']) {
    await usingReader({ fallback }, ({ reader, dialog, origin, workHeading }) => {
      equal(reader.open('test-story', origin), true);
      assert(dialog.open, `${fallback}: fallback dialog did not open`);
      assert(dialog.hasAttribute('data-storybook-fallback'), `${fallback}: missing fallback marker`);
      const style = getComputedStyle(dialog);
      equal(style.position, 'fixed', `${fallback}: fallback should be viewport-fixed`);
      assert(Number(style.zIndex) >= 1000, `${fallback}: fallback z-index ${style.zIndex} is below page chrome`);
      equal(origin.inert, true, `${fallback}: page origin was not inert`);
      equal(workHeading.inert, true, `${fallback}: page heading was not inert`);
      equal(reader.close(), true);
      equal(dialog.open, false);
      equal(dialog.hasAttribute('data-storybook-fallback'), false, `${fallback}: fallback marker leaked after close`);
      equal(origin.inert, false, `${fallback}: origin inert state leaked after close`);
      equal(workHeading.inert, false, `${fallback}: heading inert state leaked after close`);
    });
  }
});

// Catches a reopened book returning to the previous modal scroll position instead of its top controls.
test('every successful reopen resets reader scroll before focusing close', () => usingReader({}, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  reader.close();
  let retainedScrollTop = 333;
  const scrollWrites = [];
  Object.defineProperty(dialog, 'scrollTop', {
    configurable: true,
    get: () => retainedScrollTop,
    set: value => {
      retainedScrollTop = value;
      scrollWrites.push(value);
    },
  });
  equal(reader.open('test-story', origin), true);
  equal(dialog.scrollTop, 0);
  equal(scrollWrites.at(-1), 0);
  equal(document.activeElement, dialog.querySelector('[data-story-close]'));
}));

// Catches gallery arrows accidentally changing chapters or failing to wrap in both directions.
test('gallery navigation wraps without changing chapter narrative', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  reader.open('test-story', origin);
  const narrative = dialog.querySelector('[data-story-narrative]').textContent;
  equal(reader.moveImage(-1), true);
  equal(state.state.imageIndex, 2);
  equal(state.state.chapterIndex, 0);
  equal(dialog.querySelector('[data-gallery-caption]').textContent, 'Overview image three');
  equal(dialog.querySelector('[data-gallery-count]').textContent, '03 / 03');
  equal(reader.moveImage(1), true);
  equal(state.state.imageIndex, 0);
  equal(dialog.querySelector('[data-story-narrative]').textContent, narrative);
}));

// Catches a chapter jump retaining a stale gallery index.
test('changing chapter resets the gallery and synchronizes diamonds and pills', () => usingReader({ reduced: true }, ({ reader, state, dialog, origin }) => {
  reader.open('test-story', origin);
  reader.moveImage(2);
  equal(state.state.imageIndex, 2);
  equal(reader.setChapter(3), true);
  equal(state.state.chapterIndex, 3);
  equal(state.state.imageIndex, 0);
  equal(dialog.querySelector('[data-gallery-count]').textContent, '01 / 01');
  equal(dialog.querySelector('[data-story-diamond][aria-current="step"]').dataset.chapterIndex, '3');
  equal(dialog.querySelector('[data-story-chapter-title]').textContent, 'Ideation: Test story');
}));

// Catches asymmetric controls or first/last buttons remaining actionable at their boundaries.
test('chapter boundaries disable equal-size Previous and Next controls', () => usingReader({ reduced: true }, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  const previous = dialog.querySelector('[data-chapter-prev]');
  const next = dialog.querySelector('[data-chapter-next]');
  equal(previous.disabled, true);
  equal(next.disabled, false);
  const previousWidth = previous.getBoundingClientRect().width;
  const nextWidth = next.getBoundingClientRect().width;
  assert(previousWidth >= 136, `Expected a touch-size chapter control, received ${previousWidth}px`);
  assert(Math.abs(previousWidth - nextWidth) < 1, `Expected equal controls, received ${previousWidth}px and ${nextWidth}px`);
  reader.setChapter(5);
  equal(previous.disabled, false);
  equal(next.disabled, true);
  assert(Math.abs(previous.getBoundingClientRect().width - next.getBoundingClientRect().width) < 1);
}));

// Catches iOS replacing the intended line arrows with coloured emoji buttons.
test('storybook navigation forces text-style arrow glyphs', () => usingReader({ reduced: true }, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  const previousIcon = dialog.querySelector('[data-chapter-prev] > span:first-child');
  const nextIcon = dialog.querySelector('[data-chapter-next] > span:nth-child(2)');
  assert(previousIcon.textContent.endsWith('\uFE0E'), 'Previous arrow can fall back to an iOS emoji');
  assert(nextIcon.textContent.endsWith('\uFE0E'), 'Next arrow can fall back to an iOS emoji');
}));

// Catches the mobile chapter controls starting below the visible phone screen.
test('mobile storybook navigation stays inside the visible viewport', () => usingReader({ reduced: true }, async ({ reader, dialog, origin }) => {
  if (!matchMedia('(max-width: 520px)').matches) return;
  reader.open('test-story', origin);
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const navigation = dialog.querySelector('.storybook-navigation');
  const rect = navigation.getBoundingClientRect();
  equal(getComputedStyle(navigation).position, 'fixed');
  assert(rect.top >= 0, `Mobile navigation begins above the viewport at ${rect.top}px`);
  assert(rect.bottom <= innerHeight, `Mobile navigation ends below the viewport at ${rect.bottom}px`);
}));

// Catches the state lock being released at the midpoint while the visual page turn is still running.
test('the controller keeps all chapter and gallery navigation locked for the full page turn', () => usingReader({ transitionMs: 80 }, async ({ reader, state, dialog, origin }) => {
  reader.open('test-story', origin);
  equal(reader.setChapter(1, 'forward'), true);
  assert(dialog.classList.contains('is-turning-forward'));
  equal(reader.setChapter(2, 'forward'), false);
  equal(reader.moveImage(1), false);
  assert([...dialog.querySelectorAll('[data-story-diamond]')].every(control => control.disabled));
  await wait(50);
  equal(state.state.chapterIndex, 1);
  equal(state.state.isTransitioning, false);
  equal(reader.setChapter(2, 'forward'), false);
  await wait(45);
  assert(!dialog.classList.contains('is-turning-forward'));
  equal(reader.setChapter(2, 'forward'), true);
}));

// Catches reduced-motion users still waiting on a timer or receiving a 3D turn class.
test('reduced motion changes chapter synchronously without page-turn classes', () => usingReader({ reduced: true, transitionMs: 80 }, ({ reader, state, dialog, origin }) => {
  reader.open('test-story', origin);
  equal(reader.setChapter(2, 'forward'), true);
  equal(state.state.chapterIndex, 2);
  equal(state.state.isTransitioning, false);
  assert(!dialog.classList.contains('is-turning-forward'));
  assert(!dialog.classList.contains('is-turning-reverse'));
  equal(dialog.querySelector('[data-story-chapter-title]').textContent, 'Research: Test story');
}));

// Catches a stale transition timer rendering after close or restoration firing more than once.
test('closing during a page turn cancels timers and restores scroll and origin exactly once', () => usingReader({ transitionMs: 60 }, async fixture => {
  const { reader, state, dialog, origin, scrollCalls } = fixture;
  reader.open('test-story', origin);
  const originalTitle = dialog.querySelector('[data-story-chapter-title]').textContent;
  reader.setChapter(1, 'forward');
  equal(reader.close(), true);
  equal(reader.close(), false);
  await wait(80);
  equal(dialog.open, false);
  equal(state.state.activeProject, null);
  equal(dialog.querySelector('[data-story-chapter-title]').textContent, originalTitle);
  assert(!dialog.classList.contains('is-turning-forward'));
  equal(document.activeElement, origin);
  equal(fixture.closedCount, 1);
  equal(scrollCalls.length, 1);
  equal(restoredTop(scrollCalls[0]), 246);
}));

// Catches native Escape/cancel bypassing the close path or a detached origin losing focus entirely.
test('native cancel closes through the restoration path and falls back to the Work heading', () => usingReader({}, fixture => {
  const { reader, dialog, origin, workHeading } = fixture;
  reader.open('test-story', origin);
  origin.remove();
  const cancel = new Event('cancel', { bubbles: false, cancelable: true });
  dialog.dispatchEvent(cancel);
  assert(cancel.defaultPrevented);
  equal(dialog.open, false);
  equal(document.activeElement, workHeading);
  equal(fixture.closedCount, 1);
}));

// Catches the reader keeping a private theme or losing the global selection when it closes.
test('reader theme controls use and preserve the shared page theme', () => usingReader({ theme: 'moon' }, ({ reader, dialog, origin }) => {
  reader.open('test-story', origin);
  equal(dialog.querySelector('[data-story-theme="moon"]').getAttribute('aria-pressed'), 'true');
  dialog.querySelector('[data-story-theme="coral"]').click();
  equal(document.documentElement.dataset.theme, 'coral');
  equal(dialog.querySelector('[data-story-theme="coral"]').getAttribute('aria-pressed'), 'true');
  reader.close();
  equal(document.documentElement.dataset.theme, 'coral');
}));

// Catches small Coast/Coral reader chrome falling directly on mid-water colors below AA contrast.
test('Coast and Coral small reader chrome has an opaque AA surface', async () => {
  for (const theme of ['coast', 'coral']) {
    await usingReader({ theme }, ({ reader, dialog, origin }) => {
      reader.open('test-story', origin);
      const selectors = ['.storybook-brand', `[data-story-theme="${theme}"]`, '.storybook-helper'];
      for (const selector of selectors) {
        const element = dialog.querySelector(selector);
        const style = getComputedStyle(element);
        const foreground = parsedColor(style.color);
        const background = parsedColor(style.backgroundColor);
        assert(background.alpha >= .99, `${theme} ${selector}: chrome surface alpha was ${background.alpha}`);
        const ratio = contrast(foreground.channels, background.channels);
        assert(ratio >= 4.5, `${theme} ${selector}: expected 4.5:1 contrast, received ${ratio.toFixed(2)}:1`);
      }
    });
  }
});

// Catches empty galleries throwing, displaying 01 / 00, or leaving unusable arrows active.
test('empty and single-image galleries render safe counts and disabled arrows', () => usingReader({ reduced: true }, ({ reader, dialog, origin }) => {
  reader.open('edge-story', origin);
  equal(dialog.querySelector('[data-gallery-count]').textContent, '00 / 00');
  assert(dialog.querySelector('[data-gallery-empty]'));
  equal(dialog.querySelector('[data-gallery-prev]').disabled, true);
  equal(dialog.querySelector('[data-gallery-next]').disabled, true);
  equal(reader.moveImage(1), false);
  reader.setChapter(1);
  equal(dialog.querySelector('[data-gallery-count]').textContent, '01 / 01');
  equal(dialog.querySelector('[data-gallery-prev]').disabled, true);
  equal(dialog.querySelector('[data-gallery-next]').disabled, true);
  equal(getComputedStyle(dialog.querySelector('[data-gallery-prev]')).visibility, 'hidden');
  equal(getComputedStyle(dialog.querySelector('[data-gallery-next]')).visibility, 'hidden');
}));

// Catches global arrow shortcuts changing a gallery when focus is outside it.
test('gallery arrow keys act only while focus is inside the gallery', () => usingReader({}, ({ reader, state, dialog, origin }) => {
  reader.open('test-story', origin);
  const gallery = dialog.querySelector('[data-story-gallery]');
  origin.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  equal(state.state.imageIndex, 0);
  gallery.querySelector('[data-gallery-next]').focus();
  gallery.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  equal(state.state.imageIndex, 1);
  equal(dialog.querySelector('[data-gallery-media] img').alt, 'Overview rendered image');
}));

