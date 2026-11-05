// design-director kit behaviour: progressive enhancement only. Without this script every section
// still shows all of its content (reveal cards show both pictures, before/after shows the split).
// The "js" class is set by one inline line in <head> (kit:base in kit.css says so), before the first
// paint, so the reveal cards do not shift the layout. Each part sits between "kit:<name>" and "/kit" comments; scripts/kit.mjs extracts them.

/* kit:reveal-cards */
// Tap, click or keyboard turns a card; hover does the same where hover exists (kit.css).
for (const card of document.querySelectorAll('.k-reveal')) {
  const button = card.querySelector('.k-reveal__toggle');
  if (!button) continue;
  const labels = [button.textContent.trim(), button.dataset.back || 'Kembali'];
  button.addEventListener('click', () => {
    const on = !card.hasAttribute('data-on');
    card.toggleAttribute('data-on', on);
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? labels[1] : labels[0];
  });
}
/* /kit */

/* kit:before-after */
for (const ba of document.querySelectorAll('.k-ba')) {
  const range = ba.querySelector('input[type="range"]');
  if (!range) continue;
  const set = () => ba.style.setProperty('--pos', `${range.value}%`);
  range.addEventListener('input', set);
  set();
}
/* /kit */
