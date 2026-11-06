#!/usr/bin/env node
// Reading experience and voice, measured (copy/method.md). Reads the copy (.design/copy.md) or the
// built page (an HTML file or URL) and the voice file, and writes copycheck.json.
//
//   node copycheck.mjs <copy.md | page.html | url> [--voice .design/voice.md] [--out .design/copycheck.json]
//
// FAIL: a sentence over 30 words, a paragraph over 80 words, a headline over 60 characters,
// self-praise or corporate abstraction (copy/words.json, team/copy-words.json), a glossary "Not"
// word from voice.md. WARN: average sentence over 18 words, 8%+ long words, generic buttons.
// Exit 1 on any FAIL.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, resolveTarget, parseArgs } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) {
  console.error('Usage: node copycheck.mjs <copy.md | page.html | url> [--voice .design/voice.md] [--out .design/copycheck.json]');
  process.exit(2);
}
const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {});
const base = readJson(path.join(here, '..', 'copy', 'words.json'));
const team = readJson(path.join(here, '..', 'team', 'copy-words.json'));
const list = (k) => [...new Set([...(base[k] || []), ...(team[k] || [])])];

// Glossary "Not" words from voice.md: the second column of the table under "## Glossary".
const voicePath = args.voice || (fs.existsSync('.design/voice.md') ? '.design/voice.md' : null);
const avoid = [];
if (voicePath && fs.existsSync(voicePath)) {
  const v = fs.readFileSync(voicePath, 'utf8');
  const at = v.search(/^##\s*(Glossary|Glosarium)\b/im);
  if (at >= 0) {
    for (const line of v.slice(at).split('\n').slice(1)) {
      if (/^##\s/.test(line)) break;
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (line.trim().startsWith('|') && cells.length >= 2 && !/^(say|not|katakan|bukan|-+)$/i.test(cells[1]) && !/^[-: ]+$/.test(cells[1]) && cells[1]) avoid.push(cells[1]);
    }
  }
}

// Blocks: { kind: heading | paragraph | item | button, text, section }
let blocks = [];
if (/\.md$/i.test(target)) {
  const text = fs.readFileSync(target, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  let section = '(top)';
  const stop = text.search(/^##\s*(Reader tests|Tes pembaca)\b/im);
  for (const chunk of (stop >= 0 ? text.slice(0, stop) : text).split(/\n\s*\n/)) {
    let para = [];
    const flush = () => {
      if (para.length) blocks.push({ kind: 'paragraph', text: para.join(' '), section });
      para = [];
    };
    for (const raw of chunk.split('\n').filter((l) => l.trim())) {
      const line = raw.trim();
      if (/^>\s?/.test(line) || /^\|/.test(line)) continue; // notes and tables are not reading copy
      const h = line.match(/^(#{1,3})\s+(.*)/);
      if (h) {
        flush();
        section = h[2];
        blocks.push({ kind: 'heading', text: h[2], section });
        continue;
      }
      for (const m of line.matchAll(/\[([^\]]+)\]\([^)]*\)/g)) blocks.push({ kind: 'button', text: m[1], section });
      const item = /^[-*]\s/.test(line);
      const rest = line.replace(/\[([^\]]+)\]\([^)]*\)/g, '').replace(/^[-*]\s+/, '').replace(/[*_`]/g, '').trim();
      if (rest.length < 2) continue;
      if (item) {
        flush();
        blocks.push({ kind: 'item', text: rest, section });
      } else para.push(rest);
    }
    flush();
  }
} else {
  const { url, close } = await resolveTarget(target);
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Text is all this check reads: do not wait for heavy pictures or video.
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
  blocks = await page.evaluate(() => {
    const out = [];
    let section = '(top)';
    const t = (e) => (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim();
    for (const el of document.body.querySelectorAll('h1, h2, h3, p, li, blockquote, figcaption, dd, a, button')) {
      if (el.closest('nav, footer, [aria-hidden="true"]') || /^skip to|^lewati ke/i.test((el.innerText || '').trim())) continue;
      const text = t(el);
      if (!text) continue;
      if (/^H[1-3]$/.test(el.tagName)) {
        section = text;
        out.push({ kind: 'heading', text, section });
      } else if (el.matches('a, button')) {
        if (text.length < 60 && (el.tagName === 'BUTTON' || getComputedStyle(el).display !== 'inline')) out.push({ kind: 'button', text, section });
      } else if (!el.querySelector('p, li')) out.push({ kind: el.tagName === 'LI' ? 'item' : 'paragraph', text, section });
    }
    return out;
  });
  await browser.close();
  await close();
}

const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[\p{Lu}"“(\d])/u).map((x) => x.trim()).filter(Boolean);
const re = (w) => new RegExp(`(^|[^\\p{L}])${w}(?=$|[^\\p{L}])`, 'iu');
const findings = [];
const add = (severity, rule, message, sample) => findings.push({ severity, rule, message, sample });

const prose = blocks.filter((b) => b.kind === 'paragraph' || b.kind === 'item');
const allSentences = prose.flatMap((b) => sentences(b.text).map((s) => ({ s, n: words(s).length, section: b.section })));
const allWords = prose.flatMap((b) => words(b.text));
const avg = allSentences.length ? allSentences.reduce((a, x) => a + x.n, 0) / allSentences.length : 0;
const longWords = allWords.filter((w) => w.replace(/[^\p{L}]/gu, '').length >= 13);

const longSentences = allSentences.filter((x) => x.n > 30);
if (longSentences.length) add('FAIL', 'long-sentence', `${longSentences.length} sentence(s) over 30 words: split them`, longSentences.slice(0, 3).map((x) => `${x.n} words: ${x.s.slice(0, 90)}…`));
const longParas = prose.filter((b) => b.kind === 'paragraph' && words(b.text).length > 80);
if (longParas.length) add('FAIL', 'long-paragraph', `${longParas.length} paragraph(s) over 80 words: one idea per paragraph`, longParas.slice(0, 3).map((b) => `${words(b.text).length} words in "${b.section}"`));
const longHeads = blocks.filter((b) => b.kind === 'heading' && b.text.length > 60);
if (longHeads.length) add('FAIL', 'long-headline', `${longHeads.length} headline(s) over 60 characters`, longHeads.slice(0, 3).map((b) => b.text));
if (avg > 18) add('WARN', 'sentence-average', `Sentences average ${avg.toFixed(1)} words (8-18 reads easily on a phone)`);
if (allWords.length && longWords.length / allWords.length >= 0.08) add('WARN', 'long-words', `${Math.round((longWords.length / allWords.length) * 100)}% of words have 13+ letters: is there a shorter word the reader uses?`, [...new Set(longWords)].slice(0, 8));

const text = blocks.map((b) => b.text).join('\n');
// A hit inside a longer hit ("leading" in "industry-leading") counts once.
const hits = (arr) => {
  const found = arr.filter((w) => re(w).test(text));
  return found.filter((w) => !found.some((o) => o !== w && o.toLowerCase().includes(w.toLowerCase())));
};
const praise = hits(list('selfPraise'));
if (praise.length) add('FAIL', 'self-praise', 'The brand describes itself instead of showing it: replace each with the fact behind it', praise);
const abstract = hits(list('abstract'));
if (abstract.length) add('FAIL', 'abstract-words', 'Corporate abstractions read "too high": say the concrete thing', abstract);
const glossary = avoid.filter((w) => re(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(text));
if (glossary.length) add('FAIL', 'glossary', 'Words the glossary says the reader does not use', glossary);
if (!voicePath) add('WARN', 'no-voice', 'No voice.md: the reader and the glossary are not written down (copy/method.md)');
const generic = blocks.filter((b) => b.kind === 'button' && list('genericButtons').some((g) => b.text.trim().toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim() === g));
if (generic.length) add('WARN', 'generic-button', 'Buttons should say what happens', [...new Set(generic.map((b) => b.text))]);

const report = {
  target,
  voice: voicePath,
  time: new Date().toISOString(),
  stats: { headings: blocks.filter((b) => b.kind === 'heading').length, paragraphs: prose.length, sentences: allSentences.length, words: allWords.length, averageSentence: Number(avg.toFixed(1)), longWordShare: allWords.length ? Number((longWords.length / allWords.length).toFixed(3)) : 0 },
  skim: blocks.filter((b) => b.kind === 'heading' || b.kind === 'button').map((b) => (b.kind === 'button' ? `  [${b.text}]` : b.text)),
  findings,
  summary: { fail: findings.filter((f) => f.severity === 'FAIL').length, warn: findings.filter((f) => f.severity === 'WARN').length },
};
const out = args.out || (fs.existsSync('.design') ? '.design/copycheck.json' : null);
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`copycheck: ${report.stats.words} words, ${report.stats.sentences} sentences, average ${report.stats.averageSentence} words${out ? ` → ${out}` : ''}`);
for (const f of findings) console.log(`  ${f.severity} ${f.rule}: ${f.message}${f.sample ? `\n     ${[].concat(f.sample).join(' · ')}` : ''}`);
console.log('\nSkim test (headings and buttons only):');
for (const l of report.skim.slice(0, 40)) console.log(`  ${l}`);
process.exit(report.summary.fail ? 1 : 0);
