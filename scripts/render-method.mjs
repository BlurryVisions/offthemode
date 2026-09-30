// Renders the method (BLUEPRINT.md, command markers already expanded) for content/site/method-page.html at build
// time, so /method reads without JavaScript and loads no third-party script. The page keeps a small script for the
// index, tabs, copy and ticks only.
import { Marked, Renderer } from "marked";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/[`*_~]/g, "").replace(/&[a-z]+;/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
const plain = (s) => String(s).replace(/[`*_]/g, "");
// The text a browser would show for a piece of rendered inline HTML (marked escapes only these five).
const textOf = (html) => html.replace(/<[^>]+>/g, "")
  .replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]);

const MARK = {
  yours: () => `<svg viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="6" fill="currentColor"/></svg>`,
  added: (i) => `<svg viewBox="0 0 22 22" aria-hidden="true"><path class="draw" style="--i:${i}" pathLength="1" d="M11 3.2 L19.2 17.4 L2.8 17.4 Z" fill="var(--paper)" stroke="var(--red)" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
  moved: (i) => `<svg viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="4.2" fill="var(--ink)"/><path class="draw" style="--i:${i}" pathLength="1" d="M11 2.4 a8.6 8.6 0 1 1 0 17.2 a8.6 8.6 0 1 1 0 -17.2" fill="none" stroke="var(--red)" stroke-width="1.6"/></svg>`,
  ins: () => `<svg viewBox="0 0 22 22" aria-hidden="true"><rect x="7" y="7" width="8" height="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/></svg>`,
};
MARK.none = MARK.yours;
const NOTE = /^(Why|Trap|Pro move|Rule|Output):?$/i;

// marked's renderer with the page's own blocks. `state` holds the guide being rendered, its heading ids, the tick
// counter and every template found so far (for the register and the index).
class PageRenderer extends Renderer {
  constructor(state) {
    super();
    this.state = state;
  }

  // ```prompt title="..." and ```file path="..." become copyable templates; other fences become code panels.
  code(t) {
    const st = this.state;
    const info = (t.lang || "").trim();
    const kind = (info.match(/^(\S+)/) || [, ""])[1].toLowerCase();
    const text = t.text.replace(/\s+$/, "");
    const lines = text.split("\n").length;
    const body = esc(text).replace(/\{\{([^}\n]+)\}\}/g, '<span class="ph">{{$1}}</span>');
    if (kind === "prompt" || kind === "file") {
      const label = kind === "prompt" ? (info.match(/title="([^"]*)"/) || [, "Untitled prompt"])[1] : (info.match(/path="([^"]*)"/) || [, "file"])[1];
      let id = (kind === "prompt" ? "prompt-" : "file-") + slug(label);
      while (st.tplIds.has(id)) id += "-2";
      st.tplIds.add(id);
      (kind === "prompt" ? st.reg.prompts : st.reg.files).push({ id, label, sheet: st.sheet });
      const clamp = lines > 26;
      return `<figure class="tpl tpl--${kind}${clamp ? " is-clamped" : ""}" id="${id}">
        <figcaption class="tpl__bar"><span class="tpl__kind">${kind === "prompt" ? "Prompt" : "File"}</span><span class="tpl__title">${esc(label)}</span><span class="tpl__meta">${lines} lines</span><button class="tpl__copy" type="button" data-copy="${id}">Copy</button></figcaption>
        <pre><code>${body}</code></pre>${clamp ? `<button class="tpl__more" type="button" data-more="${id}" data-lines="${lines}">Show all ${lines} lines</button>` : ""}</figure>\n`;
    }
    const id = `code-${++st.seq}`;
    const wrap = /^(md|markdown|text|txt|)$/.test(kind) ? " code--wrap" : "";
    return `<div class="code${wrap}" id="${id}"><div class="code__bar"><span>${esc(kind || "text")}</span><button type="button" data-copy="${id}">Copy</button></div><pre><code>${body}</code></pre></div>\n`;
  }

  // "> **Why:** ...", "> **Trap:** ..." and the like become labelled notes.
  blockquote(t) {
    const [first, ...rest] = t.tokens;
    const strong = first?.type === "paragraph" ? first.tokens?.[0] : undefined;
    const m = strong?.type === "strong" ? strong.text.trim().match(NOTE) : null;
    if (!m) return super.blockquote(t);
    const inline = first.tokens.slice(1);
    if (inline[0]?.type === "text") inline[0] = { ...inline[0], text: inline[0].text.replace(/^[\s:]+/, "") };
    const lead = this.parser.parseInline(inline).trim();
    return `<aside class="note note--${m[1].toLowerCase().replace(/\s+/g, "-")}"><span class="note__tag">${esc(m[1])}</span>` +
      `<div class="note__body">${lead ? `<p>${lead}</p>\n` : ""}${this.parser.parse(rest)}</div></aside>\n`;
  }

  table(t) {
    return `<div class="tablewrap">${super.table(t)}</div>\n`;
  }

  // h3 and h4 inside a guide get stable ids, so any part of a guide can be linked.
  heading(t) {
    const st = this.state;
    if (!st.sheet || (t.depth !== 3 && t.depth !== 4)) return super.heading(t);
    const inner = this.parser.parseInline(t.tokens);
    let id = `${st.sheet.id}--${slug(textOf(inner))}`;
    while (st.headingIds.has(id)) id += "-2";
    st.headingIds.add(id);
    return `<h${t.depth} id="${id}">${inner}</h${t.depth}>\n`;
  }

  // Checklist items get a real checkbox; the page script keeps its tick in this browser under the checkbox's id.
  listitem(item) {
    const st = this.state;
    if (!item.task || !st.sheet) return super.listitem(item);
    const box = `<input type="checkbox" id="tick:${st.sheet.id}:${st.tickN++}">`;
    const [first, ...rest] = item.tokens;
    if (first?.type === "paragraph") {
      const inline = first.tokens.filter((x) => x.type !== "checkbox");
      return `<li class="task"><p class="task__p">${box}<span> ${this.parser.parseInline(inline)}</span></p>\n${this.parser.parse(rest)}</li>\n`;
    }
    return `<li class="task">${box}<span> ${this.parser.parse(item.tokens.filter((x) => x.type !== "checkbox"))}</span></li>\n`;
  }
}

// The method's title (its H1), the lede before the first guide, and one entry per "## " guide with its group.
function splitSheets(tokens) {
  let title = "Blueprint";
  const lede = [];
  const sheets = [];
  let cur = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === "heading" && t.depth === 1 && !cur) { title = plain(t.text); continue; }
    if (t.type === "heading" && t.depth === 2) {
      cur = { name: plain(t.text), tokens: [], raw: t.raw, origin: "none" };
      let j = i + 1;
      while (tokens[j] && tokens[j].type === "space") j++;
      const m = tokens[j]?.type === "html" && tokens[j].text.match(/origin:\s*(yours|added|moved)/i);
      if (m) { cur.origin = m[1].toLowerCase(); i = j; }
      sheets.push(cur);
      continue;
    }
    if (!cur) lede.push(t);
    else { cur.tokens.push(t); cur.raw += t.raw; }
  }
  const isPhase = (s) => /^P\d+\s*·/.test(s.name);
  const firstP = sheets.findIndex(isPhase);
  const lastP = sheets.findLastIndex(isPhase);
  const used = new Set();
  sheets.forEach((s, k) => {
    const pm = s.name.match(/^(P\d+)\s*·\s*(.+)$/);
    const am = s.name.match(/^Always-On\s*·\s*(.+)$/i);
    s.num = pm ? pm[1] : "";
    s.short = pm ? pm[2] : am ? am[1] : s.name;
    s.group = am ? "always" : firstP < 0 || k < firstP ? "frame" : k <= lastP ? "build" : "reference";
    s.kind = pm ? "phase" : s.group === "build" ? "insert" : s.group;
    let id = slug(s.name);
    while (used.has(id)) id += "-2";
    used.add(id);
    s.id = id;
    s.raw = s.raw.replace(/<!--\s*origin:[^>]*-->\n?/gi, "");
  });
  return { title, lede, sheets };
}

function sheetHTML(s, body, marked) {
  const groupLabel = { frame: "Start here", build: s.kind === "insert" ? "Used alongside a phase" : "Build order", always: "In every phase", reference: "Reference" }[s.group];
  return `<section class="sheet col" id="${s.id}" data-origin="${s.origin}" data-group="${s.group}">
      <header class="sheet__head${s.num ? "" : " no-num"}">
        <div class="sheet__num">${esc(s.num)}</div>
        <div class="sheet__meta"><span>${groupLabel}</span><button class="sheet__copy" type="button" data-sheet="${s.id}">Copy guide</button></div>
        <h2 class="sheet__title">${marked.parseInline(s.short)}</h2>
      </header>
      <div class="prose">${body}</div>
    </section>`;
}

function registerHTML(reg) {
  const rows = (list, kind) => list.map((r) => `<tr><td class="${kind === "file" ? "path" : ""}"><a class="go" href="#${r.id}">${esc(r.label)}</a></td><td>${r.sheet ? esc(r.sheet.num || r.sheet.short) : ""}</td><td><button type="button" data-copy="${r.id}">Copy</button></td></tr>`).join("");
  return `<section class="sheet col" id="register" data-origin="none" data-group="reference">
    <header class="sheet__head no-num"><div class="sheet__num"></div>
      <div class="sheet__meta"><span>Reference</span></div>
      <h2 class="sheet__title">All templates</h2></header>
    <div class="prose">
      <p>Every prompt and file template on this page, in one place. Copy them into any project or any AI tool. Placeholders are marked <span class="ph">{{LIKE_THIS}}</span>.</p>
      <h3 id="register-prompts">Prompts (${reg.prompts.length})</h3>
      <div class="tablewrap reg"><table><thead><tr><th>Prompt</th><th>Guide</th><th></th></tr></thead><tbody>${rows(reg.prompts, "prompt")}</tbody></table></div>
      <h3 id="register-files">Files (${reg.files.length})</h3>
      <div class="tablewrap reg"><table><thead><tr><th>Path</th><th>Guide</th><th></th></tr></thead><tbody>${rows(reg.files, "file")}</tbody></table></div>
    </div></section>`;
}

// The build order as a line of stations, with the lens above it and the always-on guides below it.
function pipeHTML(sheets) {
  const lens = sheets.filter((s) => /product-first/i.test(s.name));
  const loops = sheets.filter((s) => s.group === "always");
  let di = 0;
  const stations = sheets.filter((s) => s.group === "build").map((s) => {
    const isIns = s.kind === "insert";
    const mk = isIns ? MARK.ins(0) : MARK[s.origin](s.origin === "added" || s.origin === "moved" ? di++ : 0);
    return `<li class="st st--${isIns ? "ins" : s.origin}"><a href="#${s.id}"><span class="st__mark">${mk}</span><span class="st__num">${isIns ? "+" : esc(s.num)}</span><span class="st__name">${esc(s.short)}</span></a></li>`;
  }).join("");
  return `
    <div class="pipe__cap">
      <span><span class="mk">${MARK.none(0)}</span>Phase</span>
      <span><span class="mk">${MARK.ins(0)}</span>Guide used alongside a phase</span>
    </div>
    <div class="pipe__scroll"><div class="pipe__inner">
      ${lens.length ? `<div class="pipe__lens"><span class="lbl">Applies to every step</span>${lens.map((s) => `<a href="#${s.id}">${esc(s.short)}</a>`).join("")}</div>` : ""}
      <ol class="line">${stations}</ol>
      ${loops.length ? `<div class="pipe__loops"><span class="lbl">In every phase</span>${loops.map((s) => `<a href="#${s.id}">${esc(s.short)}</a>`).join('<span class="sep">/</span>')}</div>` : ""}
    </div></div>`;
}

function sheetIndexHTML(sheets) {
  const groups = [["frame", "Start here"], ["build", "Build order"], ["always", "In every phase"], ["reference", "Reference"]];
  let ix = "";
  for (const [g, label] of groups) {
    const list = sheets.filter((s) => s.group === g);
    if (g === "reference") list.push({ id: "register", num: "", short: "All templates", origin: "none", kind: "reference" });
    if (!list.length) continue;
    ix += `<div class="ix-group">${label}</div>`;
    for (const s of list) {
      ix += `<a class="ix${s.kind === "insert" ? " ix--sub" : ""}" href="#${s.id}" data-target="${s.id}"><span class="ix__num">${esc(s.num || (s.kind === "insert" ? "+" : ""))}</span><span class="ix__name">${esc(s.short)}</span><span class="mk">${MARK[s.origin](0).replace(/class="draw"/g, "")}</span></a>`;
    }
  }
  return ix;
}

/** Renders the method and returns the page's parts, keyed by the slot names in method-page.html. */
export function renderMethod(md) {
  const state = { sheet: null, headingIds: new Set(), tickN: 0, seq: 0, tplIds: new Set(), reg: { prompts: [], files: [] } };
  // setOptions, not the constructor: use() keeps only enumerable renderer keys, so it would drop class methods.
  const marked = new Marked().setOptions({ gfm: true, breaks: false, renderer: new PageRenderer(state) });
  const tokens = marked.lexer(md);
  const render = (list) => { list.links = tokens.links; return marked.parser(list); };
  const { title, lede, sheets } = splitSheets(tokens);

  const ledeHTML = render(lede);
  const docParts = sheets.map((s) => {
    state.sheet = s;
    state.headingIds = new Set();
    return sheetHTML(s, render(s.tokens), marked);
  });
  state.sheet = null;
  const { reg } = state;
  docParts.push(registerHTML(reg));

  const cells = [["Method", esc(title)], ["Guides", String(sheets.length)], ["Prompts", String(reg.prompts.length)], ["File templates", String(reg.files.length)]];
  const tplLink = (r, cls) => `<a class="ix ix--tpl ${cls}" href="#${r.id}" data-label="${esc(r.label.toLowerCase())}"><span class="ix__name">${esc(r.label)}</span><span class="ix__num">${r.sheet ? esc(r.sheet.num || "") : ""}</span></a>`;
  // "Copy guide" copies a guide's Markdown source, which the page can't get back from its HTML.
  const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
  const guideMd = JSON.stringify(Object.fromEntries(sheets.map((s) => [s.id, s.raw.trim() + "\n"])))
    .replace(/</g, "\\u003c").replaceAll(LS, "\\u2028").replaceAll(PS, "\\u2029");

  return {
    slots: {
      title: esc(title),
      lede: ledeHTML,
      tblock: cells.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(""),
      pipe: pipeHTML(sheets),
      doc: docParts.join(""),
      colophon: `${sheets.length} guides · ${reg.prompts.length} prompts · ${reg.files.length} file templates. Your AI opens the guide that matches the work; you can read any of them here.`,
      sheetList: sheetIndexHTML(sheets),
      promptList: reg.prompts.map((r) => tplLink(r, "")).join(""),
      fileList: reg.files.map((r) => tplLink(r, "ix--file")).join(""),
      nPrompts: String(reg.prompts.length),
      nFiles: String(reg.files.length),
      guideMd,
    },
    counts: { sheets: sheets.length, prompts: reg.prompts.length, files: reg.files.length },
  };
}
