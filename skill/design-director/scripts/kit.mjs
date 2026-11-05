#!/usr/bin/env node
// The kit: sections the team has tested (inspector 0 FAIL, reduced motion, touch, keyboard), built
// from tokens so each project restyles them instead of starting from nothing.
//
//   node kit.mjs list                       sections, the customer question each answers, what it needs
//   node kit.mjs get <name> [<name> …]      the HTML, CSS and JS of those sections (tokens and base once)
//   node kit.mjs get <names> --out dir      writes section.html, kit.css, kit.js into dir
//
// The HTML carries data-kit-sample: the inspector fails a page that still has it, so every word and
// picture is replaced from the spec. Restyle through the tokens (kit:tokens), never by copying
// another site's look (rules/copyright.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const kit = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'kit');
const args = parseArgs(process.argv.slice(2));
const [cmd, ...names] = args._;
const sections = JSON.parse(fs.readFileSync(path.join(kit, 'sections.json'), 'utf8')).sections;

// Blocks between "kit:<name>" and "/kit" markers, in HTML comments or CSS/JS comments.
const blocks = (file) => {
  const text = fs.readFileSync(path.join(kit, file), 'utf8');
  const out = {};
  const re = /(?:<!--|\/\*)\s*kit:([\w-]+)\s*(?:-->|\*\/)\n?([\s\S]*?)(?:<!--|\/\*)\s*\/kit\s*(?:-->|\*\/)/g;
  for (let m; (m = re.exec(text)); ) out[m[1]] = m[2].replace(/\s+$/, '\n');
  return out;
};

if (cmd === 'list') {
  for (const s of sections) {
    console.log(`${s.name}\n  answers: ${s.answers}\n  needs:   ${s.needs}\n  visitor: ${s.operates}`);
  }
  console.log(`\nDemo: ${path.relative(process.cwd(), path.join(kit, 'index.html'))} (sample content). Get one: kit.mjs get <name>`);
} else if (cmd === 'get' && names.length) {
  const html = blocks('index.html');
  const css = blocks('kit.css');
  const js = blocks('kit.js');
  const unknown = names.filter((n) => !html[n]);
  if (unknown.length) {
    console.error(`Unknown section(s): ${unknown.join(', ')}. Run: kit.mjs list`);
    process.exit(2);
  }
  const outHtml = names.map((n) => `<!-- kit:${n} -->\n${html[n]}<!-- /kit -->\n`).join('\n');
  const outCss = ['tokens', 'base', ...names].filter((n) => css[n]).map((n) => `/* kit:${n} */\n${css[n]}/* /kit */\n`).join('\n');
  const outJs = names.filter((n) => js[n]).map((n) => `/* kit:${n} */\n${js[n]}/* /kit */\n`).join('\n');
  const head = "<!-- In <head>: <link rel=\"stylesheet\" href=\"kit.css\"> and <script>document.documentElement.classList.add('js')</script> -->\n";
  if (args.out) {
    fs.mkdirSync(args.out, { recursive: true });
    fs.writeFileSync(path.join(args.out, 'section.html'), head + outHtml);
    fs.writeFileSync(path.join(args.out, 'kit.css'), outCss);
    if (outJs) fs.writeFileSync(path.join(args.out, 'kit.js'), outJs);
    console.log(`kit: ${names.join(', ')} → ${args.out}/ (section.html, kit.css${outJs ? ', kit.js' : ''}). Pictures in the demo are samples: kit/img/.`);
  } else {
    console.log(`${head}${outHtml}\n<style>\n${outCss}</style>\n${outJs ? `<script>\n${outJs}</script>\n` : ''}`);
  }
  for (const n of names) {
    const s = sections.find((x) => x.name === n);
    if (s) console.error(`${n}: replace the sample content with ${s.needs}`);
  }
} else {
  console.error('Usage: node kit.mjs list | get <name> [<name> …] [--out dir]');
  process.exit(2);
}
