// Checks the view against this repo's own files. Run after `npm run content`, which builds public/view/index.html.
// usage: npm run test:view
// It works the hashes out again from the built page instead of trusting the build, so a bug in the build's
// own checks can't pass this test.
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseProject } from "../content/site/view-parse.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
function expect(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
}
// A difference worth seeing that must not fail the run.
function note(ok, what) {
  console.log(`${ok ? "ok  " : "note"} ${what}`);
}

// 1. The parser counts the same as the checklist's header: verified items, out of every item not dropped.
// Only a note: the checklist is a map, not a gate, so a header that lags its marks never fails CI. The page shows
// the same difference to the builder in a plain line.
const dir = join(ROOT, ".offthemode");
const files = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => [f, readFileSync(join(dir, f), "utf8")]));
const { checklist } = parseProject(files);
const items = [...checklist.fragments.flatMap((f) => f.items), ...checklist.foundation];
const verified = items.filter((i) => i.mark === "verified").length;
const total = items.filter((i) => i.mark !== "dropped").length;
note(checklist.verified !== null && checklist.total !== null, `CHECKLIST.md header · Verified ${checklist.verified}/${checklist.total}`);
const same = verified === checklist.verified && total === checklist.total;
note(same, `parser · ${verified} verified of ${total} (${items.length} items, ${items.length - total} dropped, ${checklist.fragments.length} fragments) ${same ? "matches" : "differs from"} the header`);

// 2. The built page opens its <head> with the CSP, which allows no connection and runs only the scripts it hashes.
const page = readFileSync(join(ROOT, "public/view/index.html"), "utf8");
const head = page.match(/<head\b[^>]*>\s*(<[^>]*>)/i);
const meta = head?.[1] ?? "";
const csp = meta.match(/^<meta http-equiv="Content-Security-Policy" content="([^"]*)">$/)?.[1] ?? "";
expect(csp !== "", "public/view/index.html · the CSP meta is the first element of <head>");
const directives = new Map(csp.split(";").map((d) => d.trim().split(/\s+/)).map(([name, ...values]) => [name, values]));
expect(directives.get("connect-src")?.join(" ") === "'none'", "CSP · connect-src 'none'");
expect(directives.get("default-src")?.join(" ") === "'none'", "CSP · default-src 'none'");
const listed = directives.get("script-src") ?? [];
const scripts = [...page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map((m) => m[1]);
const actual = scripts.map((s) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`);
expect(scripts.length > 0 && listed.length === actual.length && actual.every((h) => listed.includes(h)),
  `CSP · script-src lists exactly the ${actual.length} inline script${actual.length === 1 ? "" : "s"}, each hash matching`);
expect(!/<script\b[^>]*\ssrc\s*=/i.test(page), "page · loads no outside script");

// 3. The parser went in as written today, and nothing in the page can send data out.
const parser = readFileSync(join(ROOT, "content/site/view-parse.mjs"), "utf8").replace(/^export /gm, "").trimEnd();
expect(page.includes(parser) && !page.includes("/*__PARSER__*/"), "page · holds the current view-parse.mjs, with export removed");
const calls = [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /\bEventSource\b/, /\bsendBeacon\b/, /\bnew\s+Image\s*\(/]
  .map((re) => page.match(re)?.[0]).filter(Boolean);
expect(!calls.length, `page · no network call${calls.length ? ` (found ${calls.join(", ")})` : ""}`);

// 4. /listview appends the notes after </html> as <template data-offthemode-file> elements, so the page's own
// script must look for them (npm run test:listview runs the whole path in a browser).
expect(scripts.some((s) => s.includes("template[data-offthemode-file]")), "page · its script reads the notes /listview embeds (template[data-offthemode-file])");

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
