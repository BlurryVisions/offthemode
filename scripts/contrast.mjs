// WCAG 2.2 AA contrast for the colours both pages use, in light and in dark.
// Each check names the CSS rule its colour comes from, so the numbers follow the code, not a copy.
// Text needs 4.5:1 (3:1 when large); a border or ring that is the only way to see a control needs 3:1.
// Buttons with a visible text label are identified by that text, so their borders are not checked.
// Run: npm run audit (optional, not part of npm run check or CI). It exits 1 on any failure, or when a named rule is missing.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------- CSS: rules and tokens ----------
function parseRules(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const stack = [];
  let buf = "";
  for (const ch of css) {
    if (ch === "{") { stack.push(buf.trim()); buf = ""; continue; }
    if (ch === "}") {
      const sel = stack.pop() ?? "";
      if (buf.trim() && !sel.startsWith("@")) {
        const decls = {};
        for (const d of buf.split(";")) {
          const i = d.indexOf(":");
          if (i > 0) decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
        }
        const media = stack.filter((s) => s.startsWith("@")).join(" ").replace(/\s+/g, "");
        rules.push({ sels: sel.split(",").map((s) => s.trim().replace(/\s+/g, " ")), media, decls });
      }
      buf = "";
      continue;
    }
    buf += ch;
  }
  return rules;
}
const tokensOf = (rules, sel, media) => Object.fromEntries(
  rules.filter((r) => r.sels.includes(sel) && r.media === media)
    .flatMap((r) => Object.entries(r.decls).filter(([k]) => k.startsWith("--")).map(([k, v]) => [k.slice(2), v])),
);

function parseColor(c) {
  c = c.trim();
  let m = c.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map((h) => parseInt(h + h, 16)).concat(1);
  m = c.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = c.match(/^rgba?\(([^)]+)\)$/i);
  if (m) { const p = m[1].split(",").map((x) => parseFloat(x)); return [p[0], p[1], p[2], p[3] ?? 1]; }
  return null;
}
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = (c) => {
  const s = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// ---------- one page, one theme ----------
function theme(rules, tokens) {
  class Missing extends Error {}
  // The last declaration of prop for this exact selector; rules outside @media win over those inside.
  const decl = (sel, prop) => {
    const hit = (rs) => rs.filter((r) => r.sels.includes(sel) && r.decls[prop] !== undefined).at(-1)?.decls[prop];
    return hit(rules.filter((r) => !r.media)) ?? hit(rules);
  };
  const token = (name, seen = []) => {
    const v = tokens[name];
    if (v === undefined) throw new Missing(`token --${name}`);
    const ref = v.match(/var\(--([a-z0-9-]+)\)/i);
    if (ref && !seen.includes(ref[1])) return token(ref[1], [...seen, name]);
    const c = parseColor(v);
    if (!c) throw new Missing(`colour of --${name}`);
    return c;
  };
  const fromValue = (v, where) => {
    const ref = v.match(/var\(--([a-z0-9-]+)\)/i);
    if (ref) return token(ref[1]);
    const lit = v.match(/#[0-9a-f]{3,6}\b|rgba?\([^)]+\)/i);
    if (lit) return parseColor(lit[0]);
    throw new Missing(`a colour in ${where}`);
  };
  // spec: "token" | [selector, prop] | { over: [top, under] } | { blend: [token, alpha or [selector, prop], under] }
  const color = (spec) => {
    if (typeof spec === "string") return token(spec);
    if (Array.isArray(spec)) {
      const v = decl(spec[0], spec[1]);
      if (v === undefined) throw new Missing(`${spec[1]} on "${spec[0]}"`);
      return fromValue(v, `${spec[0]} { ${spec[1]} }`);
    }
    if (spec.over) return over(color(spec.over[0]), color(spec.over[1]));
    if (spec.blend) {
      const [top, a, under] = spec.blend;
      const alpha = typeof a === "number" ? a : parseFloat(decl(a[0], a[1]) ?? "1");
      return over([...color(top).slice(0, 3), alpha], color(under));
    }
    throw new Error("bad colour spec");
  };
  return (check) => {
    try {
      const bg = over(color(check.bg), [255, 255, 255, 1]);
      let fg = color(check.fg);
      const op = check.op ? parseFloat(decl(check.op, "opacity") ?? "1") : 1;
      fg = over([...fg.slice(0, 3), fg[3] * op], bg);
      return { r: ratio(fg, bg) };
    } catch (e) {
      if (e instanceof Missing) return { missing: e.message };
      throw e;
    }
  };
}

// ---------- the checks ----------
const TEXT = 4.5, LARGE = 3, UI = 3;

const HOME = [
  ["body text", ["body", "color"], ["body", "background"], TEXT],
  ["text on raised surfaces (doors, table heads, fields)", "ink", [".door", "background"], TEXT],
  ["inline code and commands", "ink", [".inline", "background"], TEXT],
  ["top bar links", [".bar nav a", "color"], [".bar", "background"], TEXT],
  ["hero kicker", [".kicker", "color"], "paper", TEXT],
  ["headline, struck 'the average' (large)", [".redline .struck", "color"], "paper", LARGE],
  ["headline correction 'yours'", [".redline .fix", "color"], "paper", TEXT],
  ["logo 'Mode'", [".mark span", "color"], "paper", TEXT],
  ["section labels", [".label", "color"], "paper", TEXT],
  ["door step numbers", [".door ol li::marker", "color"], [".door", "background"], TEXT],
  ["'First win' label", [".win b", "color"], [".door", "background"], TEXT],
  ["order step text", [".order .d", "color"], "paper", TEXT],
  ["core step number (large)", [".order li.core .n", "color"], "paper", LARGE],
  ["notes under tables", [".note", "color"], "paper", TEXT],
  ["tab, not selected", [".tab", "color"], "paper", TEXT],
  ["tab, selected", ['.tab[aria-selected="true"]', "color"], "paper", TEXT],
  ["copy button", "ink", [".field", "background"], TEXT],
  ["copy button, hover and copied", [".copy:hover", "color"], [".copy:hover", "background"], TEXT],
  ["solid button", [".btn--solid", "color"], [".btn--solid", "background"], TEXT],
  ["solid button, hover", [".btn--solid:hover", "color"], { blend: [[".btn--solid:hover", "background"], [".btn--solid:hover", "opacity"], "paper"] }, TEXT],
  ["outline button, hover", [".btn:hover", "color"], { over: [[".btn:hover", "background"], "paper"] }, TEXT],
  ["promise text", [".promise p", "color"], "paper", TEXT],
  ["footer", ["footer", "color"], "paper", TEXT],
  ["footer link text", [".url", "color"], "paper", TEXT],
  ["link hover", ["a:hover", "color"], "paper", TEXT],
  ["focus ring on paper", [":focus-visible", "outline"], "paper", UI],
  ["focus ring on raised surfaces", [":focus-visible", "outline"], "paper-raised", UI],
  ["selected tab underline", ['.tab[aria-selected="true"]', "border-bottom-color"], "paper", UI],
  ["outline button border", [".btn", "border"], "paper", UI],
  ["copy field border", [".field", "border"], "paper", UI],
];

const IX = [".index", "background"];
const TPL = [".tpl", "background"];
const CODE = [".code", "background"];
const METHOD = [
  ["body text", ["body", "color"], ["body", "background"], TEXT],
  ["index: back link", [".index__kicker", "color"], IX, TEXT],
  ["index: tabs", [".tab", "color"], IX, TEXT],
  ["index: tab counts", { fg: [".tab", "color"], op: ".tab .n" }, IX, TEXT],
  ["index: selected tab", ['.tab[aria-selected="true"]', "color"], IX, TEXT],
  ["index: group labels", [".ix-group", "color"], IX, TEXT],
  ["index: numbers", [".ix__num", "color"], IX, TEXT],
  ["index: guides used alongside a phase", [".ix--sub .ix__name", "color"], IX, TEXT],
  ["index: footer", [".index__foot", "color"], IX, TEXT],
  ["index: current item", [".ix.is-current", "color"], [".ix.is-current", "background"], TEXT],
  ["index: item hover", [".ix:hover", "color"], { over: [[".ix:hover", "background"], IX] }, TEXT],
  ["search box text", [".pfilter", "color"], [".pfilter", "background"], TEXT],
  ["search box hint", [".pfilter::placeholder", "color"], [".pfilter", "background"], TEXT],
  ["hero kicker", [".hero__kicker", "color"], "paper", TEXT],
  ["title block labels", [".tblock dt", "color"], [".tblock > div", "background"], TEXT],
  ["pipeline caption", [".pipe__cap", "color"], "paper", TEXT],
  ["pipeline row labels", [".pipe__lens .lbl", "color"], "paper", TEXT],
  ["pipeline '/' separators", [".pipe__loops .sep", "color"], "paper", TEXT],
  ["pipeline guide names used alongside a phase", [".st--ins .st__name", "color"], "paper", TEXT],
  ["pipeline new step numbers", [".st--added .st__num", "color"], "paper", TEXT],
  ["guide number, new (large)", ['.sheet[data-origin="added"] .sheet__num', "color"], "paper", LARGE],
  ["guide meta line", [".sheet__meta", "color"], "paper", TEXT],
  ["guide revision label", ['.sheet[data-origin="added"] .rev', "color"], "paper", TEXT],
  ["'Copy guide' button", [".sheet__copy", "color"], "paper", TEXT],
  ["list '–' markers", [".prose ul > li::marker", "color"], "paper", TEXT],
  ["numbered list markers", [".prose ol > li::marker", "color"], "paper", TEXT],
  ["inline code", "ink", [".prose code", "background"], TEXT],
  ["ticked checklist item", [".prose li.task.is-done > span", "color"], "paper", TEXT],
  ["table heads", "ink", [".prose th", "background"], TEXT],
  ["note tags", [".note__tag", "color"], "paper", TEXT],
  ["'Trap' tag", [".note--trap .note__tag", "color"], "paper", TEXT],
  ["'Output' tag on its box", [".note__tag", "color"], [".note--output", "background"], TEXT],
  ["quotes", [".prose blockquote", "color"], "paper", TEXT],
  ["template text", [".tpl pre", "color"], TPL, TEXT],
  ["'Prompt' tag", [".tpl--prompt .tpl__kind", "color"], TPL, TEXT],
  ["template line count", [".tpl__meta", "color"], TPL, TEXT],
  ["template copy button", "ink", [".tpl__copy", "background"], TEXT],
  ["template copy button, hover", [".tpl__copy:hover", "color"], [".tpl__copy:hover", "background"], TEXT],
  ["'Show all' button", [".tpl__more", "color"], TPL, TEXT],
  ["{{PLACEHOLDER}} in a template", [".ph", "color"], { over: [[".ph", "background"], TPL] }, TEXT],
  ["{{PLACEHOLDER}} in text", [".ph", "color"], { over: [[".ph", "background"], "paper"] }, TEXT],
  ["{{PLACEHOLDER}} in a code block", [".ph", "color"], { over: [[".ph", "background"], CODE] }, TEXT],
  ["code block text", "ink", CODE, TEXT],
  ["code block label", [".code__bar", "color"], CODE, TEXT],
  ["code block copy", [".code__bar button", "color"], CODE, TEXT],
  ["template list copy buttons", [".reg td button", "color"], "paper", TEXT],
  ["colophon", [".colophon", "color"], "paper", TEXT],
  ["toast", [".toast", "color"], [".toast", "background"], TEXT],
  ["Index button", "ink", [".mast", "background"], TEXT],
  ["link hover", ["a:hover", "color"], "paper", TEXT],
  ["focus ring on paper", [":focus-visible", "outline"], "paper", UI],
  ["focus ring in the index", [":focus-visible", "outline"], IX, UI],
  ["focus ring on templates", [":focus-visible", "outline"], TPL, UI],
  ["focus ring on code blocks", [":focus-visible", "outline"], CODE, UI],
  ["selected tab underline", ['.tab[aria-selected="true"]', "border-bottom-color"], IX, UI],
  ["search box border, outside", [".pfilter", "border"], IX, UI],
  ["search box border, inside", [".pfilter", "border"], [".pfilter", "background"], UI],
  ["checkbox border", [".prose li.task input", "border"], "paper", UI],
];

// ---------- run ----------
const DARK = "@media(prefers-color-scheme:dark)";
const homeRules = parseRules(read("app/globals.css"));
const methodCss = read("content/site/method-page.html").match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!methodCss) { console.error("contrast: no <style> block in content/site/method-page.html"); process.exit(1); }
const methodRules = parseRules(methodCss);

const homeLight = tokensOf(homeRules, ":root", "");
const methodLight = tokensOf(methodRules, ":root", "");
const methodDark = tokensOf(methodRules, ':root:not([data-theme="light"])', DARK);
const methodDarkPicked = tokensOf(methodRules, ':root[data-theme="dark"]', "");
const PAGES = [
  ["Home · light", HOME, homeRules, homeLight],
  ["Home · dark", HOME, homeRules, { ...homeLight, ...tokensOf(homeRules, ":root", DARK) }],
  ["/method · light", METHOD, methodRules, methodLight],
  ["/method · dark", METHOD, methodRules, { ...methodLight, ...methodDark }],
];

let fails = 0;
for (const [name, checks, rules, tokens] of PAGES) {
  const measure = theme(rules, tokens);
  const lines = [];
  for (const [what, fgSpec, bg, need] of checks) {
    const spec = fgSpec && fgSpec.fg ? { fg: fgSpec.fg, op: fgSpec.op, bg } : { fg: fgSpec, bg };
    const res = measure(spec);
    if (res.missing) { fails++; lines.push(`MISSING ${what}: no ${res.missing}`); continue; }
    const ok = res.r >= need;
    if (!ok) fails++;
    lines.push(`${ok ? "pass" : "FAIL"} ${res.r.toFixed(2).padStart(5)} (needs ${need}) ${what}`);
  }
  const bad = lines.filter((l) => !l.startsWith("pass")).length;
  console.log(`\n${name}: ${checks.length - bad} of ${checks.length} pass`);
  for (const l of lines) if (!l.startsWith("pass") || process.argv.includes("--all")) console.log(`  ${l}`);
}

// /method keeps its dark colours twice (system dark, and dark picked by hand); they must match.
const drift = Object.keys({ ...methodDark, ...methodDarkPicked }).filter((k) => methodDark[k] !== methodDarkPicked[k]);
if (drift.length) { fails++; console.log(`\n/method: the two dark blocks differ on ${drift.map((k) => `--${k}`).join(", ")}`); }

console.log(fails ? `\ncontrast: ${fails} failure(s)` : "\ncontrast: all pass in both themes (add --all to see every pair)");
process.exit(fails ? 1 : 0);
