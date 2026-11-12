/* motion:core */
// Two signals every recipe uses: .is-in once an element has entered the screen, and --p (0..1)
// while an element crosses the screen ("through") or while a tall section is pinned ("pin").
// With reduced motion --p is not written: the CSS falls back to its still state.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }) : null;
  for (const el of document.querySelectorAll('[data-enter]')) io ? io.observe(el) : el.classList.add('is-in');
  const tracked = [...document.querySelectorAll('[data-progress]')];
  let queued = false;
  const update = () => {
    queued = false;
    if (calm.matches) return;
    const vh = innerHeight;
    for (const el of tracked) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = el.dataset.progress === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
    }
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  update();
})();
/* /motion */

/* motion:chapter-ground */
// The ground follows the chapter under the middle of the screen.
(() => {
  const chapters = [...document.querySelectorAll('[data-ground]')];
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) document.body.dataset.ground = e.target.dataset.ground;
      else if (document.body.dataset.ground === e.target.dataset.ground) delete document.body.dataset.ground;
    }
  }, { rootMargin: '-50% 0px -50% 0px' });
  chapters.forEach((c) => io.observe(c));
})();
/* /motion */

/* motion:state-change */
(() => {
  for (const b of document.querySelectorAll('.m-acc button[aria-controls]')) {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    if (!panel) continue;
    const set = (open) => { b.setAttribute('aria-expanded', String(open)); panel.classList.toggle('is-open', open); };
    set(b.getAttribute('aria-expanded') === 'true');
    b.addEventListener('click', () => set(b.getAttribute('aria-expanded') !== 'true'));
  }
})();
/* /motion */

/* motion:count-from-real */
// The real number is in the HTML. On entry it runs up from 80% of itself: it never shows 0.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  if (calm.matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target;
      const end = Number(el.dataset.count);
      if (!Number.isFinite(end)) continue;
      const fmt = new Intl.NumberFormat(document.documentElement.lang || 'id');
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        el.textContent = fmt.format(Math.round(end * (0.8 + 0.2 * (1 - (1 - k) ** 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
})();
/* /motion */
