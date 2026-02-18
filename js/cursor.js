(() => {
  const cursor = $('#cursor');
  const trail = $('#cursorTrail');
  if (!cursor || !trail || matchMedia('(hover: none)').matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  const interactive = 'a, button, .project-card, .magnetic';
  $$(interactive).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });

  const render = () => {
    tx += (x - tx) * 0.2;
    ty += (y - ty) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };

  render();
})();
