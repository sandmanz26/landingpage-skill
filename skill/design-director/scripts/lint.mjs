#!/usr/bin/env node
// Scans source files for stock copy, placeholders and default styling patterns.
//
//   node lint.mjs <files or folders...> [--json]
//
// Patterns live in rules/lint-words.json; a team adds or overrides them in
// team/lint-words.json. Exit code 1 when anything FAILs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args._.length) {
  console.error('Usage: node lint.mjs <files or folders...> [--json]');
  process.exit(2);
}
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { copy: [], code: [] };
  }
};
const base = read(path.join(skillDir, 'rules/lint-words.json'));
const team = read(path.join(skillDir, 'team/lint-words.json'));
const merge = (a = [], b = []) => {
  const map = new Map(a.map((e) => [e.pattern, e]));
  for (const e of b) map.set(e.pattern, e);
  return [...map.values()].filter((e) => e.severity !== 'off');
};
const patterns = [...merge(base.copy, team.copy), ...merge(base.code, team.code)].map((e) => ({
  ...e,
  re: new RegExp(e.pattern, 'giu'),
}));
const emoji = /\p{Extended_Pictographic}/u;

const EXT = /\.(html?|css|scss|js|jsx|ts|tsx|vue|svelte|astro|md|mdx|json)$/i;
const SKIP = /(^|\/)(node_modules|\.git|\.design|dist|build|\.next|\.astro|coverage)(\/|$)/;
const files = [];
const walk = (p) => {
  if (SKIP.test(p)) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const f of fs.readdirSync(p)) walk(path.join(p, f));
  else if (EXT.test(p) && st.size < 2_000_000) files.push(p);
};
for (const a of args._) walk(a);

const findings = [];
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const p of patterns) {
      p.re.lastIndex = 0;
      const m = p.re.exec(line);
      if (m) findings.push({ severity: p.severity.toUpperCase(), file, line: i + 1, match: m[0], why: p.why });
    }
    // Emoji inside markup text (not in comments or strings of code files is hard
    // to tell apart, so only check markup).
    if (/\.(html?|jsx|tsx|vue|svelte|astro)$/i.test(file) && emoji.test(line.replace(/<!--.*?-->/g, '')))
      findings.push({ severity: 'WARN', file, line: i + 1, match: line.match(emoji)[0], why: 'Emoji used as an icon or decoration' });
  });
}

if (args.json) console.log(JSON.stringify({ files: files.length, findings }, null, 2));
else {
  for (const f of findings) console.log(`${f.severity.padEnd(4)} ${f.file}:${f.line} "${f.match}" ${f.why}`);
  const fail = findings.filter((f) => f.severity === 'FAIL').length;
  console.log(`\n${files.length} files, ${fail} FAIL, ${findings.length - fail} WARN`);
}
process.exit(findings.some((f) => f.severity === 'FAIL') ? 1 : 0);
