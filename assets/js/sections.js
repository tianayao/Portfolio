function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function replaceList(doc, selector, values) {
  const list = doc.querySelector(selector);
  const items = Array.isArray(values) ? values.map(nonEmpty).filter(Boolean) : [];
  if (!list || !items.length) return;
  list.replaceChildren(...items.map(value => {
    const item = doc.createElement('li');
    item.textContent = value;
    return item;
  }));
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
  replaceList(doc, '#skill-list', data.skills);
  replaceList(doc, '#interest-list', data.interests);
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
  arrow.textContent = '↗';
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
