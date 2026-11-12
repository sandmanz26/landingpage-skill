#!/usr/bin/env node
// Motion recipes: movements seen in the team's references, rebuilt in our own code and tested, so
// a motion that was admired once can be used again (motion/recipes.json, motion/index.html).
//
//   node motion.mjs list                      every recipe: what it shows, the message it carries, where it was seen
//   node motion.mjs find <words> [--ref id]   recipes that match words (story, product, date, steps…) or a reference id
//   node motion.mjs get <id> [<id> …] [--out dir]   the HTML, CSS and JS of those recipes (tokens, base and core once)
//
// The spec's Motion spec names the recipes it uses on its "Recipes:" line (motion/functions.md).
// The demo's words and pictures are samples: replace them from the spec.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'motion');
export const loadRecipes = () => JSON.parse(fs.readFileSync(path.join(dir, 'recipes.json'), 'utf8')).recipes;
// Recipe ids a reference was seen using (library.mjs attaches them to its entry).
export const recipesForRef = (refId) => loadRecipes().filter((r) => (r.seen_in || []).some((s) => s.ref === refId || String(refId).startsWith(`${s.ref}-`))).map((r) => r.id);

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const [cmd, ...rest] = args._;
  const recipes = loadRecipes();
  const blocks = (file) => {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    const out = {};
    const re = /(?:<!--|\/\*)\s*motion:([\w-]+)\s*(?:-->|\*\/)\n?([\s\S]*?)(?:<!--|\/\*)\s*\/motion\s*(?:-->|\*\/)/g;
    for (let m; (m = re.exec(text)); ) out[m[1]] = (out[m[1]] || '') + m[2].replace(/\s+$/, '\n');
    return out;
  };
  const line = (r) => `${r.id}  [${r.function}]${r.kit ? `  (kit: ${r.kit})` : ''}\n  shows:    ${r.shows}\n  carries:  ${r.carries}\n  not when: ${r.not_when}\n  trigger:  ${r.trigger} · ${r.timing}\n  reduced:  ${r.reduced}\n  seen in:  ${(r.seen_in || []).map((s) => `${s.site} (${s.ref})`).join(', ') || '-'}`;
  if (cmd === 'list') {
    console.log(recipes.map(line).join('\n\n'));
    console.log(`\n${recipes.length} recipes. Demo: ${path.relative(process.cwd(), path.join(dir, 'index.html'))}. Get one: motion.mjs get <id>`);
  } else if (cmd === 'find') {
    const words = rest.map((w) => w.toLowerCase());
    const hit = recipes
      .map((r) => {
        const text = JSON.stringify(r).toLowerCase();
        const score = words.filter((w) => text.includes(w)).length + (args.ref && (r.seen_in || []).some((s) => s.ref === args.ref) ? 5 : 0);
        return { r, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    if (!hit.length) {
      console.log('No recipe matches. Run: motion.mjs list. A motion that fits none is written as "custom: <what and why>" in the motion spec, and proposed as a new recipe.');
      process.exit(1);
    }
    console.log(hit.slice(0, 5).map((x) => line(x.r)).join('\n\n'));
  } else if (cmd === 'get' && rest.length) {
    const unknown = rest.filter((n) => !recipes.some((r) => r.id === n));
    if (unknown.length) {
      console.error(`Unknown recipe(s): ${unknown.join(', ')}. Run: motion.mjs list`);
      process.exit(2);
    }
    const html = blocks('index.html');
    const css = blocks('motion.css');
    const js = blocks('motion.js');
    const own = rest.filter((n) => !recipes.find((r) => r.id === n).kit);
    const viaKit = rest.map((n) => recipes.find((r) => r.id === n)).filter((r) => r.kit);
    const outHtml = own.map((n) => `<!-- motion:${n} -->\n${html[n] || ''}<!-- /motion -->\n`).join('\n');
    const outCss = ['tokens', 'base', ...own].filter((n) => css[n]).map((n) => `/* motion:${n} */\n${css[n]}/* /motion */\n`).join('\n');
    const outJs = ['core', ...own].filter((n) => js[n]).map((n) => `/* motion:${n} */\n${js[n]}/* /motion */\n`).join('\n');
    const head = "<!-- In <head>: <script>document.documentElement.classList.add('js')</script> and the CSS; motion.js before </body>. Map the tokens to the spec's (--ground, --ink, --accent, durations). -->\n";
    if (args.out) {
      fs.mkdirSync(args.out, { recursive: true });
      if (own.length) {
        fs.writeFileSync(path.join(args.out, 'motion.html'), head + outHtml);
        fs.writeFileSync(path.join(args.out, 'motion.css'), outCss);
        fs.writeFileSync(path.join(args.out, 'motion.js'), outJs);
      }
      console.log(`motion: ${own.join(', ') || '(none of its own)'} → ${args.out}/ (motion.html, motion.css, motion.js)`);
    } else if (own.length) console.log(`${head}${outHtml}\n<style>\n${outCss}</style>\n<script>\n${outJs}</script>`);
    for (const r of viaKit) console.error(`${r.id}: lives in the kit: node kit.mjs get ${r.kit}`);
    for (const n of own) {
      const r = recipes.find((x) => x.id === n);
      console.error(`${n}: ${r.needs ? `needs ${r.needs}; ` : ''}not when: ${r.not_when}`);
    }
  } else {
    console.error('Usage: node motion.mjs list | find <words> [--ref id] | get <id> [<id> …] [--out dir]');
    process.exit(2);
  }
}
