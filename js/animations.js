(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  $$('.section-reveal').forEach((section) => observer.observe(section));

  const sections = ['#home', '#projects', '#about', '#cv'].map((id) => $(id));
  const leaves = $$('.leaf');
  const navLinks = $$('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
      const idx = sections.findIndex((s) => s.id === entry.target.id);
      leaves.forEach((leaf, leafIdx) => leaf.classList.toggle('is-visible', leafIdx <= idx));
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => sectionObserver.observe(section));
})();
