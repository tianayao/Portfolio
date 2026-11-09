import { test, assert, equal } from './harness.js';
import { projects } from '../assets/js/content.js';
import { getShapeTemplate, renderProjectCards } from '../assets/js/cards.js?v=2';

const shapes = ['clam', 'starfish', 'conch', 'whale', 'turtle', 'jellyfish'];
const wait = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds));

function fixture() {
  const doc = document.implementation.createHTMLDocument();
  const container = doc.createElement('div');
  doc.body.append(container);
  return { doc, container };
}

// Catches a missing, duplicated, or non-SVG silhouette mapping.
test('all six ocean species provide distinct SVG silhouettes', () => {
  const templates = shapes.map(getShapeTemplate);
  equal(new Set(templates).size, 6);
  templates.forEach((template, index) => {
    assert(template.includes('<svg'), `${shapes[index]} is missing an SVG`);
    assert(template.includes(`data-shape="${shapes[index]}"`), `${shapes[index]} returned the wrong silhouette`);
  });
  equal(getShapeTemplate('unknown'), '');
});

// Catches cards that lose their editable content, illustrative disclosure, or independent media layer.
test('project cards expose complete sample content and replaceable media slots', () => {
  const { container } = fixture();
  renderProjectCards(container, projects, () => {});
  const cards = [...container.querySelectorAll('[data-project-card]')];
  equal(cards.length, 6);
  cards.forEach((card, index) => {
    const project = projects[index];
    const text = card.textContent;
    assert(text.includes('Illustrative concept'));
    assert(text.includes(project.title));
    assert(text.includes(project.type));
    assert(text.includes(project.summary));
    const character = card.querySelector('[data-card-silhouette] img.project-card-character-art');
    assert(character, `${project.title} is missing its watercolor character art`);
    assert(character.src.includes(project.characterMedia.src));
    equal(card.querySelector('[data-cover-media]'), null, `${project.title} still renders the removed cover placeholder`);
    const action = card.querySelector('button[data-project-open]');
    assert(action, `${project.title} is missing a native open action`);
    equal(action.type, 'button');
    assert(action.getAttribute('aria-label').includes(project.title));
    assert(card.querySelectorAll('[data-card-bubble]').length <= 6);
  });
});

async function withRenderedMobileCards(run) {
  const container = document.createElement('div');
  container.className = 'project-grid';
  container.style.width = '350px';
  renderProjectCards(container, projects, () => {});
  document.body.append(container);
  try {
    const images = [...container.querySelectorAll('img')];
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await run(container);
  } finally {
    container.remove();
  }
}

// Catches mobile buttons drifting into the tapered bubble edge.
test('mobile card actions keep a safe inset from both bubble edges', async () => {
  await withRenderedMobileCards(container => {
    for (const card of container.querySelectorAll('[data-project-card]')) {
      const copy = card.querySelector('.project-card-copy').getBoundingClientRect();
      const action = card.querySelector('.project-open-button').getBoundingClientRect();
      assert(action.left - copy.left >= 32, `${card.dataset.projectCard} action is too close to the left bubble edge`);
      assert(copy.right - action.right >= 32, `${card.dataset.projectCard} action is too close to the right bubble edge`);
    }
  });
});

// Catches the tall Drift Space artwork escaping its visual frame and being obscured by the copy card.
test('the sixth portrait stays inside its visual frame and its copy clears the artwork', async () => {
  await withRenderedMobileCards(container => {
    const sixth = container.querySelector('[data-project-card="drift-space"]');
    const visual = sixth.querySelector('.project-card-visual').getBoundingClientRect();
    const art = sixth.querySelector('.project-card-character-art').getBoundingClientRect();
    const copy = sixth.querySelector('.project-card-copy').getBoundingClientRect();
    assert(art.top >= visual.top - 1, 'Drift Space artwork escapes above its visual frame');
    assert(art.bottom <= visual.bottom + 1, 'Drift Space artwork is hidden behind the copy card');
    assert(copy.top >= visual.bottom - 8, 'Drift Space copy card overlaps too much of the portrait');
  });
});

// Catches the wrong slug, a detached origin, or duplicate callbacks for one pointer activation.
test('pointer activation emits one valid slug and the originating button', () => {
  const { container } = fixture();
  const calls = [];
  renderProjectCards(container, projects, (slug, origin) => calls.push({ slug, origin }));
  const button = container.querySelector('button[data-project-open]');
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
  equal(calls.length, 1);
  equal(calls[0].slug, projects[0].slug);
  equal(calls[0].origin, button);
  assert(button.closest('[data-project-card]').classList.contains('is-focal'));
  assert(container.classList.contains('is-project-opening'));
  assert(Number.isFinite(Number(button.dataset.openScrollY)));
});

// Native keyboard activation reaches a button as a detail-zero click; this catches source filtering or double firing.
test('keyboard-generated activation follows the same single callback path', () => {
  const { container } = fixture();
  const calls = [];
  renderProjectCards(container, projects, (slug, origin) => calls.push({ slug, origin }));
  const button = container.querySelectorAll('button[data-project-open]')[1];
  equal(button.tagName, 'BUTTON');
  equal(button.tabIndex, 0);
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
  equal(calls.length, 1);
  equal(calls[0].slug, projects[1].slug);
  equal(calls[0].origin, button);
});

test('card accents accept only complete CSS hex lengths', () => {
  const { container } = fixture();
  const accents = ['#abc', '#abcd', '#aabbcc', '#aabbccdd', '#abcde', '#abcdef0'];
  const samples = accents.map((accent, index) => ({ ...projects[0], slug: `accent-${index}`, title: `Accent ${index}`, accent }));
  renderProjectCards(container, samples, () => {});
  const rendered = [...container.querySelectorAll('[data-project-card]')].map(card => card.style.getPropertyValue('--card-accent'));
  equal(rendered.slice(0, 4).join(','), accents.slice(0, 4).join(','));
  equal(rendered[4], '#6f718b');
  equal(rendered[5], '#6f718b');
});

test('a newer card activation owns the focal cleanup timer', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  const renderer = renderProjectCards(container, projects.slice(0, 2), () => {});
  try {
    const buttons = container.querySelectorAll('[data-project-open]');
    buttons[0].click();
    await wait(400);
    buttons[1].click();
    await wait(400);
    assert(buttons[1].closest('[data-project-card]').classList.contains('is-focal'), 'The first timer cleared the newer focal card.');
    assert(container.classList.contains('is-project-opening'));
  } finally {
    renderer.reset();
    container.remove();
  }
});
