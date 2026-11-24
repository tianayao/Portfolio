function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function skillGroups(data) {
  if (!Array.isArray(data)) return [];
  return data.map(group => ({
    title: nonEmpty(group?.title),
    icon: nonEmpty(group?.icon) || '✦\uFE0E',
    items: Array.isArray(group?.items) ? group.items.map(nonEmpty).filter(Boolean) : [],
  }));
}

function appendSafeEmphasis(doc, parent, value) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    const emphasized = part.startsWith('**') && part.endsWith('**') && part.length > 4;
    if (!emphasized) {
      parent.append(doc.createTextNode(part));
      continue;
    }
    const strong = doc.createElement('strong');
    strong.textContent = part.slice(2, -2);
    parent.append(strong);
  }
}

export function renderIntro(doc = document, data = {}) {
  for (const node of doc.querySelectorAll('[data-profile]')) {
    const value = nonEmpty(data[node.dataset.profile]);
    if (value) node.textContent = value;
  }

  for (const group of doc.querySelectorAll('[data-profile-paragraphs]')) {
    const values = data[group.dataset.profileParagraphs];
    const paragraphs = Array.isArray(values) ? values.map(nonEmpty).filter(Boolean) : [];
    if (!paragraphs.length) continue;
    group.replaceChildren(...paragraphs.map(value => {
      const paragraph = doc.createElement('p');
      appendSafeEmphasis(doc, paragraph, value);
      return paragraph;
    }));
  }
}

export function initIntroConcepts(doc = document) {
  const root = doc.querySelector('#intro-concepts');
  if (!root) return [];

  const panels = new Map([...root.querySelectorAll('[data-concept-panel]')]
    .map(panel => [panel.dataset.conceptPanel, panel]));
  const tabs = [...root.querySelectorAll('[data-concept-tab][aria-controls]')]
    .filter(tab => panels.get(tab.dataset.conceptTab)?.id === tab.getAttribute('aria-controls'));
  if (!tabs.length) return [];

  const activate = (tab, moveFocus = false) => {
    const concept = tab.dataset.conceptTab;
    if (!panels.has(concept)) return false;
    root.dataset.activeConcept = concept;
    for (const candidate of tabs) {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = panels.get(candidate.dataset.conceptTab);
      if (panel) panel.hidden = !selected;
    }
    if (moveFocus) tab.focus();
    return true;
  };

  root.classList.add('is-enhanced');
  const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
  activate(selected);

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex = null;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) nextIndex = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activate(tabs[nextIndex], true);
    });
  }
  return tabs;
}

export function renderAbout(doc = document, data = {}) {
  const copy = doc.querySelector('#about-content');
  const paragraphs = Array.isArray(data.about) ? data.about.map(nonEmpty).filter(Boolean) : [];
  if (copy && paragraphs.length) {
    copy.replaceChildren(...paragraphs.map(value => {
      const paragraph = doc.createElement('p');
      paragraph.textContent = value;
      return paragraph;
    }));
  }

  const mounts = [...doc.querySelectorAll('[data-skill-group]')];
  const groups = skillGroups(data.skillGroups);
  const canRenderGroups = groups.length === mounts.length
    && groups.every(group => group.title && group.items.length);
  if (!canRenderGroups) return;

  groups.forEach((group, index) => {
    const mount = mounts[index];
    const heading = mount.querySelector('h3');
    const list = mount.querySelector('[data-skill-items]');
    if (!heading || !list) return;
    const icon = doc.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = group.icon;
    heading.replaceChildren(icon, doc.createTextNode(` ${group.title}`));
    list.replaceChildren(...group.items.map(value => {
      const item = doc.createElement('li');
      item.textContent = value;
      return item;
    }));
  });
}

function safeWebHref(value, base = 'https://portfolio.invalid/') {
  const href = nonEmpty(value);
  if (!href || href.startsWith('//')) return null;
  const scheme = href.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme) return scheme === 'https' ? href : null;
  try {
    const safeBase = /^https?:/i.test(base || '') ? base : 'https://portfolio.invalid/';
    const url = new URL(href, safeBase);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return href;
  } catch {
    return null;
  }
}

function safeEmail(value) {
  const email = nonEmpty(value);
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function contactLink(doc, label, detail, href, kind) {
  const link = doc.createElement('a');
  link.className = 'contact-link';
  link.dataset.contactKind = kind;
  link.href = href;
  const labelNode = doc.createElement('span');
  labelNode.className = 'contact-link-label';
  labelNode.textContent = label;
  const detailNode = doc.createElement('span');
  detailNode.className = 'contact-link-detail';
  detailNode.textContent = detail;
  const arrow = doc.createElement('span');
  arrow.className = 'contact-link-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗\uFE0E';
  link.append(labelNode, detailNode, arrow);
  return link;
}

export function renderContact(doc = document, data = {}) {
  const container = doc.querySelector('#contact-links');
  const note = doc.querySelector('#contact-replacement-note');
  if (!container) return [];
  const links = [];
  const email = safeEmail(data.email);
  if (email) links.push(contactLink(doc, 'Email', email, `mailto:${email}`, 'email'));

  const linkedin = safeWebHref(data.linkedin, doc.baseURI);
  if (linkedin && /^https:\/\//i.test(linkedin)) links.push(contactLink(doc, 'LinkedIn', 'View profile', linkedin, 'linkedin'));

  const resume = safeWebHref(data.resume, doc.baseURI);
  if (resume) links.push(contactLink(doc, 'Résumé', 'Open résumé', resume, 'resume'));

  if (Array.isArray(data.portfolioLinks)) {
    for (const record of data.portfolioLinks) {
      const label = nonEmpty(record?.label);
      const href = safeWebHref(record?.href, doc.baseURI);
      if (label && href) links.push(contactLink(doc, label, 'Visit link', href, 'portfolio'));
    }
  }

  container.replaceChildren(...links);
  if (note) {
    const replacement = nonEmpty(data.replacementNote);
    if (replacement) note.textContent = replacement;
    note.hidden = links.length > 0;
  }
  return links;
}

export function initDiscoveries(doc = document) {
  const buttons = [...doc.querySelectorAll('.discovery-button[aria-controls]')];
  for (const button of buttons) {
    const panel = doc.getElementById(button.getAttribute('aria-controls'));
    if (!panel) continue;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }
  return buttons;
}

export function initBackToSurface(doc = document, view = window) {
  const link = doc.querySelector('.back-to-surface');
  if (!link) return null;
  link.addEventListener('click', event => {
    if (typeof view.scrollTo !== 'function') return;
    event.preventDefault();
    const reduced = Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    view.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' });
    doc.querySelector('#home')?.focus?.({ preventScroll: true });
  });
  return link;
}

export function syncPointerMode(doc = document, view = window) {
  let coarse = false;
  try { coarse = Boolean(view.matchMedia?.('(pointer: coarse)').matches); }
  catch { /* Pointer media queries are optional progressive enhancement. */ }
  if (coarse) doc.documentElement.dataset.pointer = 'coarse';
  else delete doc.documentElement.dataset.pointer;
  return coarse;
}
