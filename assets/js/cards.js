const SHAPE_TEMPLATES = {
  clam: `<svg data-shape="clam" viewBox="0 0 360 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path class="shape-shadow" d="M43 229c20-102 61-168 137-184 76 16 117 82 137 184-32 32-82 47-137 47S75 261 43 229Z"/>
    <path class="shape-main" d="M48 218C39 139 91 61 180 43c89 18 141 96 132 175-31 28-78 43-132 43S79 246 48 218Z"/>
    <path class="shape-detail clam-rib" d="M180 49v193M180 49c-43 54-62 111-58 184M180 49c43 54 62 111 58 184M180 49c-70 48-99 102-97 166M180 49c70 48 99 102 97 166"/>
    <path class="shape-lip" d="M48 218c40-18 82-23 132-6 50-17 92-12 132 6-31 28-78 43-132 43S79 246 48 218Z"/>
    <circle class="shape-pearl" cx="180" cy="216" r="16"/>
  </svg>`,
  starfish: `<svg data-shape="starfish" viewBox="0 0 360 320" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path class="shape-shadow" d="m181 31 37 84 92-26-57 75 67 64-94-5-42 85-28-88-96 14 75-68-51-79 91 33Z"/>
    <path class="shape-main star-body" d="m180 25 38 91 96-31-60 81 72 66-101-8-43 91-29-95-101 16 78-73-55-84 98 37Z"/>
    <path class="shape-detail star-speckles" d="M181 86v33m-52 27 31 13m62 2 31-14m-77 53-2 36M112 109l30 22m76-1 29-24"/>
    <circle class="shape-dot" cx="180" cy="163" r="7"/><circle class="shape-dot" cx="147" cy="183" r="4"/><circle class="shape-dot" cx="215" cy="186" r="4"/>
  </svg>`,
  conch: `<svg data-shape="conch" viewBox="0 0 360 320" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path class="shape-shadow" d="M65 232c-14-75 22-154 88-188 52-27 126-7 147 46 19 48-9 98-51 125-48 30-100 70-142 55-20-7-36-20-42-38Z"/>
    <path class="shape-main conch-body" d="M61 222C48 151 82 76 148 42c51-26 121-7 142 43 18 44-7 91-48 116-37 23-64 53-92 69-37 21-80 5-89-48Z"/>
    <path class="shape-lip" d="M239 102c34 32 29 78-7 105-37 27-71 70-101 67-23-2-35-20-24-36 13-19 42-29 58-47 25-27 22-65 44-87 9-9 20-10 30-2Z"/>
    <path class="shape-detail conch-spiral" d="M230 119c-35-42-103-24-115 27-10 43 35 74 71 53 27-16 25-55 1-66-17-8-34 6-30 22 3 11 16 15 25 9"/>
    <path class="shape-detail" d="m121 65 21 37m20-53 11 42m29-43-3 42m37-28-16 37m49-7-31 29"/>
  </svg>`,
  whale: `<svg data-shape="whale" viewBox="0 0 380 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path class="shape-shadow" d="M53 177c14-69 77-111 166-98 40 6 72 24 92 48 19-30 39-40 61-36-6 25-20 43-41 55 21 10 34 26 40 48-23 5-46-5-68-30-31 45-91 68-154 58-44-7-77-23-96-45Z"/>
    <path class="shape-main whale-body" d="M43 169c16-70 80-108 169-94 43 7 73 24 94 49 19-31 40-42 64-37-5 26-20 45-43 58 22 10 37 27 43 50-25 5-50-6-72-33-32 45-90 66-153 56-48-8-84-25-102-49Z"/>
    <path class="shape-fin" d="M202 198c11 31 34 45 63 43-7-26-24-44-49-57Z"/>
    <path class="shape-detail whale-tail" d="M304 126c26-15 45-24 66-39m-65 74c28 17 46 29 65 34"/>
    <circle class="shape-eye" cx="103" cy="145" r="5"/>
    <path class="shape-smile" d="M78 163c12 8 26 9 39 2"/>
    <path class="shape-spout" d="M145 84c-5-22 5-36 23-42m-22 42c16-20 34-24 52-12"/>
  </svg>`,
  turtle: `<svg data-shape="turtle" viewBox="0 0 380 310" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <ellipse class="shape-shadow" cx="190" cy="170" rx="117" ry="87"/>
    <path class="shape-flipper turtle-flipper turtle-flipper-one" d="M102 122C62 78 31 83 28 104c-3 23 27 49 68 58Z"/>
    <path class="shape-flipper turtle-flipper turtle-flipper-two" d="M113 218c-41 38-45 69-24 77 22 9 55-15 72-55Z"/>
    <path class="shape-flipper turtle-flipper turtle-flipper-three" d="M269 124c42-39 73-31 73-9 0 24-32 47-74 50Z"/>
    <path class="shape-flipper turtle-flipper turtle-flipper-four" d="M263 215c38 41 39 72 17 78-23 6-53-21-65-63Z"/>
    <ellipse class="shape-main turtle-shell" cx="188" cy="166" rx="104" ry="78"/>
    <path class="shape-detail shell-grid" d="M115 126c35 21 111 21 146-2M99 168c43-11 136-10 177 3M118 211c35-22 105-23 142-3M188 90c-20 27-27 51-25 76 1 24 10 50 29 76m-4-152c23 26 33 52 31 77-1 25-12 50-31 75"/>
    <path class="shape-head" d="M289 139c43-7 65 7 63 29-3 23-29 34-69 20Z"/>
    <circle class="shape-eye" cx="326" cy="163" r="4"/>
  </svg>`,
  jellyfish: `<svg data-shape="jellyfish" viewBox="0 0 360 330" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path class="shape-shadow" d="M61 159C61 87 113 36 181 36s120 51 120 123c-25 13-51 16-77 4-29 19-58 19-87 0-27 12-52 9-76-4Z"/>
    <path class="shape-main jelly-bell" d="M56 151C56 79 109 29 180 29s124 50 124 122c-25 14-52 17-80 4-29 20-58 20-88 0-28 13-55 10-80-4Z"/>
    <path class="shape-detail" d="M88 138c8-45 43-78 92-78 50 0 85 33 93 78"/>
    <circle class="shape-eye" cx="150" cy="120" r="5"/><circle class="shape-eye" cx="211" cy="120" r="5"/>
    <path class="shape-smile" d="M166 135c9 8 19 8 28 0"/>
    <path class="shape-tentacle jelly-tentacle tentacle-one" d="M92 164c-11 43 30 52 14 94-10 27-1 48 22 60"/>
    <path class="shape-tentacle jelly-tentacle tentacle-two" d="M137 169c-8 31 23 48 7 79-12 24-3 46 17 62"/>
    <path class="shape-tentacle jelly-tentacle tentacle-three" d="M181 170c13 31-15 49-2 79 10 23 1 45-15 62"/>
    <path class="shape-tentacle jelly-tentacle tentacle-four" d="M225 168c16 38-22 54-5 92 10 23 3 43-15 58"/>
    <path class="shape-tentacle jelly-tentacle tentacle-five" d="M267 162c16 42-22 56-6 91 12 26 4 47-17 62"/>
  </svg>`,
};

const BUBBLE_COUNT = 5;

export function getShapeTemplate(shape) {
  return SHAPE_TEMPLATES[shape] || '';
}

function element(doc, tag, className, text) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (typeof text === 'string') node.textContent = text;
  return node;
}

function safeAccent(value) {
  return typeof value === 'string' && /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value) ? value : '#6f718b';
}

function buildMedia(doc, project) {
  const media = element(doc, 'figure', 'project-cover-media');
  media.dataset.coverMedia = '';
  media.setAttribute('role', 'img');
  media.setAttribute('aria-label', project.coverMedia?.alt || `Illustrative ${project.title} cover awaiting replacement`);

  if (project.coverMedia?.src) {
    const image = element(doc, 'img', 'project-cover-image');
    image.src = project.coverMedia.src;
    image.alt = project.coverMedia.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    media.append(image);
  } else {
    const placeholder = element(doc, 'span', 'project-cover-placeholder');
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.append(
      element(doc, 'span', 'project-cover-mark', '✦'),
      element(doc, 'span', 'project-cover-label', 'replace cover'),
    );
    media.append(placeholder);
  }
  return media;
}

function resetOpening(container) {
  container.classList.remove('is-project-opening');
  for (const card of container.querySelectorAll('[data-project-card]')) card.classList.remove('is-focal');
}

export function renderProjectCards(container, projects, onOpen = () => {}) {
  if (!container || !Array.isArray(projects)) return { reset: () => {} };
  const doc = container.ownerDocument;
  const view = doc.defaultView || globalThis.window;
  let cleanupTimer = null;
  const cancelCleanup = () => {
    if (cleanupTimer === null) return;
    const cancel = view?.clearTimeout?.bind(view) || globalThis.clearTimeout;
    cancel(cleanupTimer);
    cleanupTimer = null;
  };
  const clearOpening = () => {
    cancelCleanup();
    resetOpening(container);
  };
  container.replaceChildren();
  container.classList.add('project-grid-enhanced');

  projects.forEach((project, index) => {
    const shape = getShapeTemplate(project.cardShape) ? project.cardShape : 'clam';
    const card = element(doc, 'article', `project-card project-card--${shape}`);
    card.dataset.projectCard = project.slug;
    card.style.setProperty('--card-accent', safeAccent(project.accent));

    const visual = element(doc, 'div', 'project-card-visual');
    const number = element(doc, 'span', 'project-card-number', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const silhouette = element(doc, 'div', 'project-card-silhouette');
    silhouette.dataset.cardSilhouette = '';
    silhouette.setAttribute('aria-hidden', 'true');
    silhouette.innerHTML = getShapeTemplate(shape);
    visual.append(number, silhouette, buildMedia(doc, project));

    const bubbles = element(doc, 'span', 'project-card-bubbles');
    bubbles.setAttribute('aria-hidden', 'true');
    for (let bubble = 0; bubble < BUBBLE_COUNT; bubble += 1) {
      const dot = element(doc, 'i', `project-card-bubble bubble-${bubble + 1}`);
      dot.dataset.cardBubble = '';
      bubbles.append(dot);
    }
    visual.append(bubbles);

    const copy = element(doc, 'div', 'project-card-copy');
    const label = element(doc, 'p', 'project-card-label', 'Illustrative concept');
    const title = element(doc, 'h3', 'project-card-title', project.title);
    title.id = `project-${project.slug}-title`;
    const type = element(doc, 'p', 'project-card-type', project.type);
    const note = element(doc, 'div', 'project-card-note');
    note.append(element(doc, 'p', '', project.summary));
    const action = element(doc, 'button', 'project-open-button');
    action.type = 'button';
    action.dataset.projectOpen = project.slug;
    action.setAttribute('aria-label', `Open ${project.title} illustrative case study`);
    action.append(element(doc, 'span', '', 'Open story'), element(doc, 'span', 'project-open-arrow', '↗'));

    action.addEventListener('click', () => {
      cancelCleanup();
      resetOpening(container);
      card.classList.add('is-focal');
      container.classList.add('is-project-opening');
      const scrollY = Number(view?.scrollY ?? 0);
      action.dataset.openScrollY = String(Number.isFinite(scrollY) ? scrollY : 0);
      try {
        onOpen(project.slug, action);
      } finally {
        const schedule = view?.setTimeout?.bind(view) || globalThis.setTimeout;
        cleanupTimer = schedule(() => {
          cleanupTimer = null;
          resetOpening(container);
        }, 720);
      }
    });

    copy.append(label, title, type, note, action);
    card.setAttribute('aria-labelledby', title.id);
    card.append(visual, copy);
    container.append(card);
  });

  return { reset: clearOpening };
}
