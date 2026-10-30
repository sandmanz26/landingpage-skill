// The clock follows the reading position through "Setengah jam Anda" (12.00 → 12.30),
// and the booking form writes the WhatsApp message. Without this script the page
// still shows the whole half hour and a working WhatsApp link.
(() => {
  const C = 2 * Math.PI * 80;
  const arc = document.getElementById('arc');
  const hand = document.getElementById('hand');
  const time = document.getElementById('time');
  const step = document.getElementById('step');
  const section = document.getElementById('setengah-jam');
  const items = [...section.querySelectorAll('li[data-min]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  function draw(min, label) {
    arc.setAttribute('stroke-dasharray', `${(min / 60) * C} ${C}`);
    hand.setAttribute('transform', `rotate(${min * 6} 100 100)`);
    time.textContent = `12.${pad(Math.round(min))}`;
    step.textContent = label;
  }

  function update() {
    const mid = innerHeight * 0.5;
    let current = items[0];
    for (const li of items) if (li.getBoundingClientRect().top < mid) current = li;
    const first = items[0].getBoundingClientRect().top;
    const last = items[items.length - 1].getBoundingClientRect().top;
    let min;
    if (reduce || first >= mid) min = Number(current.dataset.min);
    else if (last <= mid) min = 30;
    else min = Math.min(30, Math.max(0, ((mid - first) / (last - first)) * 30));
    if (first > innerHeight) return draw(0, 'Setengah jam di jam istirahat');
    // The label follows the time shown, not the row nearest the middle.
    const shown = [...items].reverse().find((li) => Number(li.dataset.min) <= Math.round(min)) || items[0];
    draw(min, shown.dataset.label);
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  // Booking: build the message from the chosen day and time.
  const day = document.getElementById('day');
  const hour = document.getElementById('hour');
  const message = document.getElementById('message');
  const wa = document.getElementById('wa');
  for (let m = 9 * 60; m <= 19 * 60 + 30; m += 30) {
    const o = document.createElement('option');
    o.textContent = `${pad(Math.floor(m / 60))}.${pad(m % 60)}`;
    if (m === 12 * 60) o.selected = true;
    hour.append(o);
  }
  function compose() {
    const text = `Halo Senyum Dental, saya ingin periksa dan bersihkan gigi hari ${day.value} pukul ${hour.value}. Apakah jadwalnya tersedia?`;
    message.textContent = text;
    wa.href = `https://wa.me/6281200000000?text=${encodeURIComponent(text)}`;
  }
  day.addEventListener('change', compose);
  hour.addEventListener('change', compose);
  compose();
})();
