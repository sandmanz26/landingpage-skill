// Frame smoothness while scrolling: does the page stutter ("patah-patah")? Records the time
// between animation frames during a trackpad-like scroll. A long frame (over 50 ms) is a visible
// hitch; frames over 33 ms are dropped frames at 60 Hz. Headless rendering in a container is
// slower than a real device, so compare pages measured on the same machine, never a threshold.
import { gotoStable, dismissOverlays } from './browser.mjs';

export async function measureSmoothness(browser, url, { cpu = 1, viewport = { width: 1440, height: 900 } } = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  if (cpu > 1) {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  }
  const load = await gotoStable(page, url, { timeout: 45000 });
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
  // Long tasks are JavaScript blocking the main thread: they stutter on any device. Long frames
  // without long tasks are rendering cost (blur, WebGL, big layers), which a real GPU may absorb.
  const renderer = await page.evaluate(() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl ? 'webgl (renderer hidden)' : 'no webgl';
    } catch {
      return 'unknown';
    }
  });
  await page.evaluate(() => {
    window.__ddLong = [];
    try {
      new PerformanceObserver((l) => window.__ddLong.push(...l.getEntries().map((e) => e.duration))).observe({ type: 'longtask' });
    } catch {}
    window.__ddFrames = [];
    window.__ddRec = true;
    let last = performance.now();
    const tick = (t) => {
      window.__ddFrames.push(t - last);
      last = t;
      if (window.__ddRec) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.max(20, Math.min(100, Math.ceil(Math.min(height, 8000) / 100)));
  const started = Date.now();
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(400);
  const ms = Date.now() - started;
  const { frames: raw, longTasks } = await page.evaluate(() => {
    window.__ddRec = false;
    return { frames: window.__ddFrames, longTasks: window.__ddLong };
  });
  const frames = raw.slice(1);
  await context.close();
  const sorted = [...frames].sort((a, b) => a - b);
  const pct = (p) => (sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] * 10) / 10 : null);
  return {
    loadFailed: !!load.failed,
    cpuSlowdown: cpu,
    scrolledMs: ms,
    frames: frames.length,
    fps: Math.round((frames.length / (ms / 1000)) * 10) / 10,
    medianMs: pct(0.5),
    p95Ms: pct(0.95),
    maxMs: Math.round(Math.max(0, ...frames)),
    longFrames: frames.filter((f) => f > 50).length,
    droppedShare: frames.length ? Math.round((frames.filter((f) => f > 33.4).length / frames.length) * 100) : null,
    longTasks: longTasks.length,
    longTaskMs: Math.round(longTasks.reduce((a, b) => a + b, 0)),
    // Share of the scroll the main thread was blocked by scripts.
    scriptBlockedShare: Math.round((longTasks.reduce((a, b) => a + b, 0) / ms) * 100),
    renderer,
  };
}
