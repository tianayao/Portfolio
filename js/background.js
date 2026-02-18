(() => {
  const canvas = $('#ballet-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const ribbons = Array.from({ length: 6 }, (_, i) => ({
    y: (i + 1) * (window.innerHeight / 7),
    speed: 0.001 + i * 0.0005,
    amp: 20 + i * 6,
    hue: i % 2 ? '122, 27%, 84%' : '206, 58%, 79%'
  }));

  const leaves = Array.from({ length: 22 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    s: Math.random() * 0.8 + 0.2,
    v: Math.random() * 0.3 + 0.2
  }));

  const draw = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ribbons.forEach((r, idx) => {
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `hsla(${r.hue}, 0.28)`;
      for (let x = 0; x < canvas.width; x += 6) {
        const y = r.y + Math.sin((x * 0.01) + t * r.speed * 8) * r.amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = idx % 2 ? 'rgba(212,224,208,.08)' : 'rgba(167,199,231,.08)';
      ctx.fillRect((idx * 190 + (t * 0.02)) % (canvas.width + 180) - 180, r.y - 40, 150, 80);
    });

    leaves.forEach((leaf) => {
      leaf.y += leaf.v;
      leaf.x += Math.sin((t * 0.001) + leaf.y * 0.01) * 0.2;
      if (leaf.y > canvas.height + 20) {
        leaf.y = -20;
        leaf.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(Math.sin(t * 0.001 + leaf.x) * 0.8);
      ctx.scale(leaf.s, leaf.s);
      ctx.fillStyle = 'rgba(201, 106, 74, .18)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
})();
