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
    assert(card.querySelector('[data-card-silhouette] svg'));
    const media = card.querySelector('[data-cover-media]');
    assert(media, `${project.title} is missing its media slot`);
    assert(media.getAttribute('aria-label').includes(project.title));
    const action = card.querySelector('button[data-project-open]');
    assert(action, `${project.title} is missing a native open action`);
    equal(action.type, 'button');
    assert(action.getAttribute('aria-label').includes(project.title));
    assert(card.querySelectorAll('[data-card-bubble]').length <= 6);
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
