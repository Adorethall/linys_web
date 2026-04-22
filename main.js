(() => {

  /* ===== NAV scroll ===== */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ===== Mobile hamburger ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ===== Typing effect ===== */
  const roles = ['AI产品经理', '工作流搭建者', '数据分析师', '创意内容人'];
  const el = document.getElementById('typingText');
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();

  /* ===== Intersection Observer: fade-in + trigger animations ===== */
  const fadeEls = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => io.observe(el));

  /* ===== Count-up numbers ===== */
  function countUp(el) {
    const target = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || 0);
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * ease).toFixed(decimal);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const metricIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.metric-num').forEach(countUp);
      // hook bar
      e.target.querySelector('#hookFill')?.classList.add('animated');
      // parallel bars
      e.target.querySelectorAll('.pt-fill').forEach(b => b.classList.add('animated'));
      metricIo.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.workflow-card').forEach(c => metricIo.observe(c));

  /* ===== Radar chart ===== */
  const svg = document.getElementById('radarChart');
  if (svg) {
    const dims = [
      { label: '产品思维', value: 0.88 },
      { label: 'AI工具',   value: 0.92 },
      { label: '数据分析', value: 0.82 },
      { label: '内容创意', value: 0.80 },
      { label: '开发能力', value: 0.72 },
    ];
    const cx = 150, cy = 150, R = 100, n = dims.length;

    function pt(i, r) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }

    const NS = 'http://www.w3.org/2000/svg';

    // grid rings
    [0.25, 0.5, 0.75, 1].forEach(scale => {
      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('points', dims.map((_, i) => pt(i, R * scale).join(',')).join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', '#d4cdc0');
      poly.setAttribute('stroke-width', '1');
      svg.appendChild(poly);
    });

    // axes
    dims.forEach((_, i) => {
      const [x, y] = pt(i, R);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', x); line.setAttribute('y2', y);
      line.setAttribute('stroke', '#d4cdc0');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });

    // data polygon
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', dims.map((d, i) => pt(i, R * d.value).join(',')).join(' '));
    poly.setAttribute('fill', 'rgba(201,100,66,.15)');
    poly.setAttribute('stroke', '#c96442');
    poly.setAttribute('stroke-width', '2');
    svg.appendChild(poly);

    // dots
    dims.forEach((d, i) => {
      const [x, y] = pt(i, R * d.value);
      const circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', x); circle.setAttribute('cy', y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#c96442');
      svg.appendChild(circle);
    });

    // labels
    dims.forEach((d, i) => {
      const [x, y] = pt(i, R + 22);
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', x); text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('fill', '#6b6560');
      text.textContent = d.label;
      svg.appendChild(text);
    });
  }

})();
