import { test, equal, assert } from './harness.js';
import { renderAbout, renderContact, initDiscoveries, initBackToSurface } from '../assets/js/sections.js?v=3';

function parsedColor(value) {
  const channels = value.match(/[\d.]+/g)?.map(Number) || [];
  const normalized = channels.slice(0, 3);
  if (value.startsWith('color(')) normalized.forEach((channel, index) => { normalized[index] = channel * 255; });
  return { channels: normalized, alpha: channels.length > 3 ? channels[3] : 1 };
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

function composite(foreground, background, opacity = 1) {
  const alpha = foreground.alpha * opacity;
  return foreground.channels.map((channel, index) => channel * alpha + background.channels[index] * (1 - alpha));
}

async function usingFrame(width, body, run) {
  const frame = document.createElement('iframe');
  frame.title = 'Responsive CSS test frame';
  frame.style.width = `${width}px`;
  frame.style.height = '800px';
  const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
  frame.srcdoc = `<!doctype html><html><head><base href="${document.baseURI}">
    <link rel="stylesheet" href="../assets/css/tokens.css">
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/storybook.css?v=3">
    <link rel="stylesheet" href="../assets/css/responsive.css?v=4">
    </head><body>${body}</body></html>`;
  document.body.append(frame);
  await loaded;
  try { await run(frame.contentDocument); }
  finally { frame.remove(); }
}

function sectionFixture() {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = `
    <main>
      <section id="home" tabindex="-1"></section>
      <section id="about">
        <div id="about-content"><p>Fallback biography note.</p></div>
        <ul id="skill-list"><li>Fallback skill</li></ul>
        <ul id="interest-list"><li>Fallback interest</li></ul>
        <button class="discovery-button" type="button" aria-expanded="false" aria-controls="shell-note">Shell</button>
        <p id="shell-note" hidden>A small discovery.</p>
      </section>
      <section id="contact">
        <p id="contact-replacement-note">Replace contact details.</p>
        <div id="contact-links"></div>
        <a class="back-to-surface" href="#home">Back to the surface</a>
      </section>
    </main>`;
  return doc;
}

test('about content uses only supplied profile copy, skills, and interests', () => {
  const doc = sectionFixture();
  renderAbout(doc, {
    about: ['First supplied paragraph.', '', 'Second supplied paragraph.'],
    skills: ['Research', 'Prototyping'],
    interests: ['Illustration'],
  });
  equal(doc.querySelectorAll('#about-content p').length, 2);
  equal(doc.querySelector('#about-content').textContent.trim(), 'First supplied paragraph.Second supplied paragraph.');
  equal(doc.querySelectorAll('#skill-list li').length, 2);
  equal(doc.querySelectorAll('#interest-list li').length, 1);
  assert(!doc.body.textContent.includes('undefined'));
});

test('null contact data keeps the honest replacement note and creates no destinations', () => {
  const doc = sectionFixture();
  renderContact(doc, { email: null, linkedin: null, resume: null, portfolioLinks: [], replacementNote: 'Still awaiting real contact details.' });
  equal(doc.querySelectorAll('#contact-links a').length, 0);
  equal(doc.querySelector('#contact-replacement-note').hidden, false);
  equal(doc.querySelector('#contact-replacement-note').textContent, 'Still awaiting real contact details.');
});

test('contact rendering accepts safe configured destinations and rejects unsafe ones', () => {
  const doc = sectionFixture();
  renderContact(doc, {
    email: 'designer@example.com',
    linkedin: 'https://www.linkedin.com/in/designer',
    resume: 'javascript:alert(1)',
    portfolioLinks: [
      { label: 'Sketchbook', href: 'https://example.com/sketchbook' },
      { label: 'Unsafe', href: 'data:text/html,bad' },
    ],
    replacementNote: 'Awaiting details.',
  });
  const links = [...doc.querySelectorAll('#contact-links a')];
  equal(links.length, 3);
  assert(links.some(link => link.href.startsWith('mailto:designer@example.com')));
  assert(links.some(link => link.textContent.includes('LinkedIn')));
  assert(links.some(link => link.textContent.includes('Sketchbook')));
  equal(doc.querySelector('#contact-replacement-note').hidden, true);
});

test('resume and portfolio links allow HTTPS or local paths, never plain HTTP', () => {
  const doc = sectionFixture();
  renderContact(doc, {
    resume: './resume.pdf',
    portfolioLinks: [
      { label: 'Secure', href: 'https://example.com/work' },
      { label: 'Insecure', href: 'http://example.com/work' },
    ],
    replacementNote: 'Awaiting details.',
  });
  const links = [...doc.querySelectorAll('#contact-links a')];
  equal(links.length, 2);
  assert(links.some(link => link.textContent.includes('Résumé')));
  assert(links.some(link => link.textContent.includes('Secure')));
  assert(!links.some(link => link.textContent.includes('Insecure')));
});

test('discoveries are native buttons with synchronized disclosure state', () => {
  const doc = sectionFixture();
  initDiscoveries(doc);
  const button = doc.querySelector('.discovery-button');
  const note = doc.querySelector('#shell-note');
  equal(button.type, 'button');
  equal(button.getAttribute('aria-expanded'), 'false');
  equal(note.hidden, true);
  button.click();
  equal(button.getAttribute('aria-expanded'), 'true');
  equal(note.hidden, false);
  button.click();
  equal(button.getAttribute('aria-expanded'), 'false');
  equal(note.hidden, true);
});

test('back to surface scrolls smoothly unless reduced motion is requested', () => {
  for (const [reduced, behavior] of [[false, 'smooth'], [true, 'auto']]) {
    const doc = sectionFixture();
    const calls = [];
    const view = {
      matchMedia: () => ({ matches: reduced }),
      scrollTo: options => calls.push(options),
    };
    initBackToSurface(doc, view);
    doc.querySelector('.back-to-surface').click();
    equal(calls.length, 1);
    equal(calls[0].top, 0);
    equal(calls[0].behavior, behavior);
  }
});

test('600px Storybook uses complete single-page geometry', async () => usingFrame(600, `
  <div class="storybook-dialog">
    <div class="storybook-topbar"></div>
    <div class="storybook-book">
      <span class="storybook-spine"></span>
      <span class="storybook-page-turn"></span>
      <div class="storybook-gallery"></div><div class="storybook-story"></div>
    </div>
  </div>`, doc => {
  const book = getComputedStyle(doc.querySelector('.storybook-book'));
  const topbar = getComputedStyle(doc.querySelector('.storybook-topbar'));
  const spine = getComputedStyle(doc.querySelector('.storybook-spine'));
  const turn = getComputedStyle(doc.querySelector('.storybook-page-turn'));
  equal(book.gridTemplateColumns.split(' ').length, 1, '600px book should have one column.');
  equal(spine.display, 'none', '600px spine should not slice stacked content.');
  equal(turn.left, '0px', '600px turn overlay should cover the complete book.');
  equal(topbar.position, 'sticky', '600px close and theme bar should remain reachable.');
}));

test('Coast and Coral About small chrome stays AA over the upper gradient', () => {
  const previousTheme = document.documentElement.dataset.theme;
  for (const theme of ['coast', 'coral']) {
    document.documentElement.dataset.theme = theme;
    const section = document.createElement('section');
    section.className = 'about-section';
    section.innerHTML = '<div class="section-index section-index-light">03</div><div class="about-heading"><p class="eyebrow">A few fathoms deeper</p></div><i data-about-top></i>';
    section.querySelector('[data-about-top]').style.background = 'var(--about-top)';
    document.body.append(section);
    const background = parsedColor(getComputedStyle(section.querySelector('[data-about-top]')).backgroundColor);
    assert(background.alpha >= .99 && background.channels.some(channel => channel > 0), `${theme}: upper About surface token did not resolve to an opaque color`);
    for (const selector of ['.section-index-light', '.about-heading .eyebrow']) {
      const element = section.querySelector(selector);
      const style = getComputedStyle(element);
      const foreground = composite(parsedColor(style.color), background, Number(style.opacity));
      const ratio = contrast(foreground, background.channels);
      assert(ratio >= 4.5, `${theme} ${selector}: expected 4.5:1, received ${ratio.toFixed(2)}:1`);
    }
    section.remove();
  }
  document.documentElement.dataset.theme = previousTheme || 'coast';
});

test('deep-water focus token contrasts with both mid and deep surfaces', () => {
  const previousTheme = document.documentElement.dataset.theme;
  for (const theme of ['coast', 'coral']) {
    document.documentElement.dataset.theme = theme;
    const section = document.createElement('section');
    section.className = 'about-section';
    section.innerHTML = '<i data-focus></i><i data-mid></i><i data-deep></i>';
    section.querySelector('[data-focus]').style.color = 'var(--focus)';
    section.querySelector('[data-mid]').style.background = 'var(--mid-water)';
    section.querySelector('[data-deep]').style.background = 'var(--deep-water)';
    document.body.append(section);
    const focus = parsedColor(getComputedStyle(section.querySelector('[data-focus]')).color).channels;
    for (const selector of ['[data-mid]', '[data-deep]']) {
      const surface = parsedColor(getComputedStyle(section.querySelector(selector)).backgroundColor).channels;
      const ratio = contrast(focus, surface);
      assert(ratio >= 3, `${theme} focus on ${selector}: expected 3:1, received ${ratio.toFixed(2)}:1`);
    }
    section.remove();
  }
  document.documentElement.dataset.theme = previousTheme || 'coast';
});

test('coarse-pointer enhancement exposes card notes in computed styles', () => {
  const previous = document.documentElement.dataset.pointer;
  document.documentElement.dataset.pointer = 'coarse';
  const note = document.createElement('div');
  note.className = 'project-card-note';
  document.body.append(note);
  equal(getComputedStyle(note).transform, 'none');
  note.remove();
  if (previous) document.documentElement.dataset.pointer = previous;
  else delete document.documentElement.dataset.pointer;
});
