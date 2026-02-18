(() => {
  const roles = ['UX Designer', 'UI Designer', 'Front-end Developer', 'Data Storyteller'];
  const typedRole = $('#typedRole');
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % roles.length;
    typedRole.textContent = roles[idx];
  }, 2200);

  const header = $('#siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
  });

  const tabs = $$('.tab');
  const onlinePanel = $('#onlinePanel');
  const pdfPanel = $('#pdfPanel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const showPdf = tab.dataset.tab === 'pdf';
      pdfPanel.classList.toggle('hidden', !showPdf);
      onlinePanel.classList.toggle('hidden', showPdf);
    });
  });

  $$('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  $('#year').textContent = new Date().getFullYear();
})();
