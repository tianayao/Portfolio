export function computeOceanProgress(scrollY, start, end) {
  if (![scrollY, start, end].every(Number.isFinite)) return 0;
  if (end <= start) return scrollY > start ? 1 : 0;
  return Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
}

export function initNavigation(doc = document) {
  const header = doc.querySelector('#site-header');
  const toggle = doc.querySelector('#menu-toggle');
  const nav = doc.querySelector('#main-nav');
  if (!header || !toggle || !nav) return;
  toggle.hidden = false;
  header.classList.add('nav-enhanced');
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
  });
  doc.addEventListener('pointerdown', event => { if (!header.contains(event.target)) close(); });
  header.addEventListener('focusout', event => { if (!header.contains(event.relatedTarget)) close(); });
  doc.defaultView?.matchMedia?.('(min-width: 761px)').addEventListener?.('change', close);
}

export function initOcean(doc = document, win = window) {
  const root = doc.documentElement;
  const reveals = Array.from(doc.querySelectorAll('[data-reveal]'));
  const preference = win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduced = Boolean(preference?.matches);
  let observer;
  const revealAll = () => reveals.forEach(node => { node.classList.remove('reveal-pending'); node.classList.add('is-visible'); });
  function updateMotion() {
    reduced = Boolean(preference?.matches);
    root.dataset.motion = reduced ? 'reduced' : 'full';
    root.style.setProperty('--pointer-x', '0px');
    root.style.setProperty('--pointer-y', '0px');
    root.style.setProperty('--hero-drift', '0px');
    if (reduced) { observer?.disconnect(); revealAll(); }
  }
  updateMotion();
  preference?.addEventListener?.('change', updateMotion);
  if (!reduced && win.IntersectionObserver) {
    try {
      observer = new win.IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }, { threshold: .08 });
      for (const node of reveals) { observer.observe(node); node.classList.add('reveal-pending'); }
    } catch { revealAll(); }
  } else revealAll();

  let scheduled = false;
  let pointerX = 0;
  let pointerY = 0;
  const render = () => {
    scheduled = false;
    const scroll = win.scrollY || 0;
    const start = doc.querySelector('#work')?.offsetTop || 0;
    const end = (doc.querySelector('#contact')?.offsetTop || doc.body.scrollHeight) - (win.innerHeight || 0);
    const progress = computeOceanProgress(scroll, start, end);
    root.style.setProperty('--ocean-progress', String(progress));
    root.style.setProperty('--hero-drift', reduced ? '0px' : `${Math.min(scroll * .08, 45)}px`);
    root.style.setProperty('--pointer-x', reduced ? '0px' : `${pointerX}px`);
    root.style.setProperty('--pointer-y', reduced ? '0px' : `${pointerY}px`);
    const header = doc.querySelector('#site-header');
    header?.classList.toggle('is-compact', scroll > 40);
    header?.classList.toggle('is-deep', progress > .55);
  };
  const schedule = () => {
    if (scheduled) return;
    if (!win.requestAnimationFrame) { render(); return; }
    scheduled = true;
    win.requestAnimationFrame(render);
  };
  win.addEventListener?.('scroll', schedule, { passive: true });
  win.addEventListener?.('resize', schedule, { passive: true });
  const hero = doc.querySelector('#home');
  if (win.requestAnimationFrame && win.matchMedia?.('(hover: hover) and (pointer: fine)').matches) {
    hero?.addEventListener('pointermove', event => {
      if (reduced) return;
      const rect = hero.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * 16;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * 12;
      schedule();
    }, { passive: true });
    hero?.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; schedule(); });
  }
  render();
}
