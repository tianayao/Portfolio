const THEMES = ['coast', 'moon', 'coral'];

function node(doc, tag, className, text) {
  const item = doc.createElement(tag);
  if (className) item.className = className;
  if (typeof text === 'string') item.textContent = text;
  return item;
}

function button(doc, className, label) {
  const item = node(doc, 'button', className);
  item.type = 'button';
  if (label) item.setAttribute('aria-label', label);
  return item;
}

function padded(value) {
  return String(value).padStart(2, '0');
}

function focusableItems(root) {
  return [...root.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter(item => !item.hidden && item.getAttribute('aria-hidden') !== 'true');
}

function buildReader(dialog) {
  const doc = dialog.ownerDocument;
  const shell = node(doc, 'div', 'storybook-shell');

  const top = node(doc, 'header', 'storybook-topbar');
  const brand = node(doc, 'p', 'storybook-brand');
  brand.append(node(doc, 'span', 'storybook-brand-mark', '✳'), node(doc, 'span', '', 'A little sea of stories'));

  const topControls = node(doc, 'div', 'storybook-top-controls');
  const themes = node(doc, 'div', 'storybook-themes');
  themes.setAttribute('role', 'group');
  themes.setAttribute('aria-label', 'Storybook color theme');
  for (const theme of THEMES) {
    const control = button(doc, 'storybook-theme', `${theme[0].toUpperCase()}${theme.slice(1)} theme`);
    control.dataset.storyTheme = theme;
    control.setAttribute('aria-pressed', 'false');
    const swatch = node(doc, 'span', `storybook-theme-swatch storybook-theme-swatch--${theme}`);
    swatch.setAttribute('aria-hidden', 'true');
    control.append(swatch, node(doc, 'span', 'storybook-theme-name', theme));
    themes.append(control);
  }
  const close = button(doc, 'storybook-close', 'Close storybook');
  close.dataset.storyClose = '';
  close.append(node(doc, 'span', '', '×'));
  topControls.append(themes, close);
  top.append(brand, topControls);

  const heading = node(doc, 'div', 'storybook-heading');
  const eyebrow = node(doc, 'p', 'storybook-project-type');
  eyebrow.dataset.storyProjectType = '';
  const title = node(doc, 'h2', 'storybook-project-title');
  title.dataset.storyTitle = '';
  title.id = `${dialog.id || 'storybook'}-title`;
  heading.append(eyebrow, title);

  const bookWrap = node(doc, 'div', 'storybook-book-wrap');
  const book = node(doc, 'div', 'storybook-book');
  book.dataset.storyBook = '';

  const gallery = node(doc, 'section', 'storybook-gallery');
  gallery.dataset.storyGallery = '';
  gallery.setAttribute('aria-label', 'Project image gallery');
  const mediaFrame = node(doc, 'div', 'storybook-media-frame');
  const media = node(doc, 'div', 'storybook-media');
  media.dataset.galleryMedia = '';
  const imagePrevious = button(doc, 'storybook-gallery-arrow storybook-gallery-arrow--previous', 'Previous project image');
  imagePrevious.dataset.galleryPrev = '';
  imagePrevious.textContent = '‹';
  const imageNext = button(doc, 'storybook-gallery-arrow storybook-gallery-arrow--next', 'Next project image');
  imageNext.dataset.galleryNext = '';
  imageNext.textContent = '›';
  mediaFrame.append(media, imagePrevious, imageNext);
  const galleryMeta = node(doc, 'div', 'storybook-gallery-meta');
  galleryMeta.setAttribute('aria-live', 'polite');
  const caption = node(doc, 'span', 'storybook-gallery-caption');
  caption.dataset.galleryCaption = '';
  const count = node(doc, 'span', 'storybook-gallery-count');
  count.dataset.galleryCount = '';
  galleryMeta.append(caption, count);
  gallery.append(mediaFrame, galleryMeta);

  const story = node(doc, 'section', 'storybook-story');
  story.setAttribute('aria-label', 'Project chapter');
  const chapterTag = node(doc, 'p', 'storybook-chapter-tag');
  chapterTag.dataset.storyChapterTag = '';
  const chapterTitle = node(doc, 'h3', 'storybook-chapter-title');
  chapterTitle.dataset.storyChapterTitle = '';
  const narrative = node(doc, 'p', 'storybook-narrative');
  narrative.dataset.storyNarrative = '';
  const insight = node(doc, 'aside', 'storybook-insight');
  insight.dataset.storyInsight = '';
  const pageCount = node(doc, 'p', 'storybook-page-count');
  pageCount.dataset.storyPageCount = '';
  story.append(chapterTag, chapterTitle, narrative, insight, pageCount);

  const spine = node(doc, 'span', 'storybook-spine');
  spine.setAttribute('aria-hidden', 'true');
  const turn = node(doc, 'span', 'storybook-page-turn');
  turn.setAttribute('aria-hidden', 'true');
  book.append(gallery, story, spine, turn);
  bookWrap.append(book);

  const navigation = node(doc, 'div', 'storybook-navigation');
  const chapterPrevious = button(doc, 'storybook-page-button', 'Previous chapter');
  chapterPrevious.dataset.chapterPrev = '';
  chapterPrevious.append(node(doc, 'span', '', '←'), node(doc, 'span', '', 'Previous'), bubbles(doc));
  const diamonds = node(doc, 'div', 'storybook-diamonds');
  diamonds.setAttribute('aria-label', 'Chapter progress');
  const chapterNext = button(doc, 'storybook-page-button', 'Next chapter');
  chapterNext.dataset.chapterNext = '';
  chapterNext.append(node(doc, 'span', '', 'Next'), node(doc, 'span', '', '→'), bubbles(doc));
  navigation.append(chapterPrevious, diamonds, chapterNext);

  const pills = node(doc, 'nav', 'storybook-pills');
  pills.setAttribute('aria-label', 'Story chapters');
  const helper = node(doc, 'p', 'storybook-helper', 'Use gallery arrows for images · use the controls below to turn chapters');

  shell.append(top, heading, bookWrap, navigation, pills, helper);
  dialog.replaceChildren(shell);
  return {
    shell,
    close,
    themes,
    title,
    eyebrow,
    book,
    gallery,
    media,
    imagePrevious,
    imageNext,
    caption,
    count,
    chapterTag,
    chapterTitle,
    narrative,
    insight,
    pageCount,
    chapterPrevious,
    chapterNext,
    diamonds,
    pills,
  };
}

function bubbles(doc) {
  const cluster = node(doc, 'span', 'storybook-nav-bubbles');
  cluster.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 4; index += 1) cluster.append(node(doc, 'i', `storybook-nav-bubble bubble-${index + 1}`));
  return cluster;
}

export function createStorybook({
  dialog,
  state,
  projects = [],
  getTheme = () => dialog?.ownerDocument?.documentElement?.dataset?.theme || 'coast',
  onThemeChange = () => false,
  onClosed = () => {},
  transitionMs = 800,
  win = dialog?.ownerDocument?.defaultView || globalThis.window,
} = {}) {
  if (!dialog || !state) throw new TypeError('createStorybook requires a dialog and story state');
  const doc = dialog.ownerDocument;
  const ui = buildReader(dialog);
  const timers = new Set();
  const inerted = new Map();
  let origin = null;
  let savedScrollY = 0;
  let locked = false;
  let isOpen = false;
  let fallbackModal = false;

  dialog.classList.add('storybook-dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', ui.title.id);
  dialog.removeAttribute('aria-label');

  function schedule(run, delay) {
    let timer;
    timer = win.setTimeout(() => {
      timers.delete(timer);
      run();
    }, delay);
    timers.add(timer);
    return timer;
  }

  function clearTimers() {
    for (const timer of timers) win.clearTimeout(timer);
    timers.clear();
  }

  function reducedMotion() {
    try { return Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches); }
    catch { return false; }
  }

  function activeProject() {
    return state.state.activeProject;
  }

  function activeChapter() {
    return activeProject()?.chapters?.[state.state.chapterIndex] || null;
  }

  function syncTheme() {
    const theme = THEMES.includes(getTheme()) ? getTheme() : 'coast';
    dialog.dataset.theme = theme;
    for (const control of ui.themes.querySelectorAll('[data-story-theme]')) {
      control.setAttribute('aria-pressed', String(control.dataset.storyTheme === theme));
    }
  }

  function renderChapterNavigation(project) {
    ui.diamonds.replaceChildren();
    ui.pills.replaceChildren();
    const chapters = Array.isArray(project?.chapters) ? project.chapters : [];
    chapters.forEach((chapter, index) => {
      const diamond = button(doc, 'storybook-diamond', `Go to ${chapter.label} chapter`);
      diamond.dataset.storyDiamond = '';
      diamond.dataset.chapterIndex = String(index);
      diamond.append(node(doc, 'span', '', '◆'));
      ui.diamonds.append(diamond);

      const pill = button(doc, 'storybook-pill', `Go to ${chapter.label} chapter`);
      pill.dataset.storyPill = '';
      pill.dataset.chapterIndex = String(index);
      pill.textContent = `${padded(index)} ${chapter.label}`;
      ui.pills.append(pill);
    });
  }

  function renderGallery() {
    const chapter = activeChapter();
    const images = Array.isArray(chapter?.images) ? chapter.images : [];
    const total = images.length;
    const index = total ? Math.min(state.state.imageIndex, total - 1) : 0;
    const current = total ? images[index] : null;
    ui.media.replaceChildren();

    if (!current) {
      const empty = node(doc, 'div', 'storybook-media-empty');
      empty.dataset.galleryEmpty = '';
      empty.setAttribute('role', 'img');
      empty.setAttribute('aria-label', 'No project image supplied yet');
      empty.append(node(doc, 'span', 'storybook-media-mark', '✦'), node(doc, 'span', '', 'Media awaiting replacement'));
      ui.media.append(empty);
      ui.caption.textContent = 'No project media supplied yet.';
      ui.count.textContent = '00 / 00';
    } else if (current.src) {
      const image = node(doc, 'img', 'storybook-media-image');
      image.src = current.src;
      image.alt = current.alt || '';
      image.decoding = 'async';
      ui.media.append(image);
      ui.caption.textContent = current.caption || current.alt || 'Project image';
      ui.count.textContent = `${padded(index + 1)} / ${padded(total)}`;
    } else {
      const placeholder = node(doc, 'div', 'storybook-media-placeholder');
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', current.alt || 'Project media awaiting replacement');
      placeholder.append(
        node(doc, 'span', 'storybook-media-mark', '✦'),
        node(doc, 'strong', '', 'A place for your image'),
        node(doc, 'span', '', 'Replace this paper placeholder independently'),
      );
      ui.media.append(placeholder);
      ui.caption.textContent = current.caption || current.alt || 'Project media placeholder';
      ui.count.textContent = `${padded(index + 1)} / ${padded(total)}`;
    }
    const galleryLocked = locked || total <= 1;
    ui.imagePrevious.disabled = galleryLocked;
    ui.imageNext.disabled = galleryLocked;
  }

  function renderControls() {
    const project = activeProject();
    const chapters = Array.isArray(project?.chapters) ? project.chapters : [];
    const current = state.state.chapterIndex;
    ui.chapterPrevious.disabled = locked || current <= 0;
    ui.chapterNext.disabled = locked || !chapters.length || current >= chapters.length - 1;
    for (const control of dialog.querySelectorAll('[data-story-diamond], [data-story-pill]')) {
      const selected = Number(control.dataset.chapterIndex) === current;
      if (selected) control.setAttribute('aria-current', 'step');
      else control.removeAttribute('aria-current');
      control.disabled = locked;
    }
    const images = Array.isArray(activeChapter()?.images) ? activeChapter().images : [];
    ui.imagePrevious.disabled = locked || images.length <= 1;
    ui.imageNext.disabled = locked || images.length <= 1;
  }

  function renderStory() {
    const project = activeProject();
    const chapter = activeChapter();
    if (!project || !chapter) return;
    ui.eyebrow.textContent = project.type || 'Illustrative case study';
    ui.title.textContent = project.title || 'Project story';
    ui.chapterTag.textContent = `${padded(state.state.chapterIndex)} / ${chapter.label || 'Chapter'}`;
    ui.chapterTitle.textContent = chapter.title || chapter.label || 'Untitled chapter';
    ui.narrative.textContent = chapter.narrative || 'Chapter copy awaiting replacement.';
    ui.insight.textContent = chapter.insight || 'Add a supported insight or reflection here.';
    const chapterTotal = project.chapters.length;
    ui.pageCount.textContent = `${padded(state.state.chapterIndex + 1)} / ${padded(chapterTotal)}`;
    renderGallery();
    renderControls();
  }

  function applyFallbackInert() {
    inerted.clear();
    for (const child of doc.body.children) {
      if (child === dialog) continue;
      inerted.set(child, Boolean(child.inert));
      child.inert = true;
    }
  }

  function clearFallbackInert() {
    for (const [element, wasInert] of inerted) element.inert = wasInert;
    inerted.clear();
  }

  function showDialog() {
    fallbackModal = false;
    dialog.removeAttribute('data-storybook-fallback');
    try {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else throw new Error('Native dialog unavailable');
    } catch {
      fallbackModal = true;
      dialog.setAttribute('data-storybook-fallback', '');
      dialog.setAttribute('open', '');
      applyFallbackInert();
    }
  }

  function restoreFocusAndScroll() {
    try { win.scrollTo({ top: savedScrollY, left: 0, behavior: 'auto' }); }
    catch { win.scrollTo(0, savedScrollY); }
    const target = origin?.isConnected ? origin : doc.querySelector('#work-title');
    target?.focus?.({ preventScroll: true });
  }

  function open(slug, nextOrigin = null) {
    if (isOpen || !projects.some(project => project.slug === slug)) return false;
    if (!state.openProject(slug)) return false;
    const project = activeProject();
    const recorded = Number(nextOrigin?.dataset?.openScrollY);
    savedScrollY = Number.isFinite(recorded) ? recorded : Number(win.scrollY) || 0;
    origin = nextOrigin;
    locked = false;
    renderChapterNavigation(project);
    renderStory();
    syncTheme();
    dialog.classList.remove('is-turning-forward', 'is-turning-reverse');
    doc.documentElement.classList.add('storybook-open');
    showDialog();
    dialog.scrollTop = 0;
    isOpen = true;
    ui.close.focus({ preventScroll: true });
    return true;
  }

  function setChapter(index, direction) {
    const project = activeProject();
    if (!isOpen || locked || !Number.isInteger(index) || index < 0 || index >= (project?.chapters?.length || 0) || index === state.state.chapterIndex) return false;
    if (reducedMotion()) {
      if (!state.setChapter(index)) return false;
      renderStory();
      return true;
    }
    const current = state.state.chapterIndex;
    if (!state.beginTransition(index)) return false;
    locked = true;
    const turnDirection = direction === 'reverse' || (direction !== 'forward' && index < current) ? 'reverse' : 'forward';
    dialog.classList.remove('is-turning-forward', 'is-turning-reverse');
    dialog.classList.add(`is-turning-${turnDirection}`);
    renderControls();
    const duration = Math.max(1, Number(transitionMs) || 800);
    schedule(() => {
      if (!isOpen || !locked) return;
      state.completeTransition();
      renderStory();
    }, Math.round(duration / 2));
    schedule(() => {
      if (!isOpen) return;
      locked = false;
      dialog.classList.remove('is-turning-forward', 'is-turning-reverse');
      renderControls();
    }, duration);
    return true;
  }

  function moveImage(delta) {
    if (!isOpen || locked || !state.moveImage(delta)) return false;
    renderGallery();
    return true;
  }

  function close() {
    if (!isOpen) return false;
    clearTimers();
    locked = false;
    dialog.classList.remove('is-turning-forward', 'is-turning-reverse');
    state.closeProject();
    isOpen = false;
    if (fallbackModal) {
      dialog.removeAttribute('open');
      dialog.removeAttribute('data-storybook-fallback');
      clearFallbackInert();
      fallbackModal = false;
    } else if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    doc.documentElement.classList.remove('storybook-open');
    restoreFocusAndScroll();
    onClosed();
    return true;
  }

  dialog.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.matches('[data-story-close]')) close();
    else if (target.matches('[data-gallery-prev]')) moveImage(-1);
    else if (target.matches('[data-gallery-next]')) moveImage(1);
    else if (target.matches('[data-chapter-prev]')) setChapter(state.state.chapterIndex - 1, 'reverse');
    else if (target.matches('[data-chapter-next]')) setChapter(state.state.chapterIndex + 1, 'forward');
    else if (target.matches('[data-story-diamond], [data-story-pill]')) {
      const next = Number(target.dataset.chapterIndex);
      setChapter(next, next < state.state.chapterIndex ? 'reverse' : 'forward');
    } else if (target.matches('[data-story-theme]')) {
      const theme = target.dataset.storyTheme;
      if (THEMES.includes(theme)) {
        onThemeChange(theme);
        syncTheme();
      }
    }
  });

  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.target.closest('[data-story-gallery]') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      moveImage(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (fallbackModal && event.key === 'Tab') {
      const items = focusableItems(dialog);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });

  return { open, setChapter, moveImage, close };
}
