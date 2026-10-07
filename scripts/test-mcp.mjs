// Talks to the MCP endpoint the way a client does and checks every command answers.
// usage: npm run test:mcp            (http://localhost:3000/mcp)
//        MCP_URL=https://.../mcp npm run test:mcp
const URL_ = process.env.MCP_URL ?? "http://localhost:3000/mcp";
const MODERN = "2026-07-28";
let id = 0;
let failures = 0;

// Streamable HTTP may answer as JSON or as a one-event SSE stream.
async function post(body, headers = {}, timeoutMs = 10000) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  const type = res.headers.get("content-type") ?? "";
  return type.includes("event-stream")
    ? JSON.parse(text.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join(""))
    : JSON.parse(text);
}

async function rpc(method, params = {}, version = "2025-06-18") {
  // Before 2025-06-18 there was no protocol-version header.
  const json = await post({ jsonrpc: "2.0", id: ++id, method, params }, version === "2024-11-05" ? {} : { "mcp-protocol-version": version });
  if (json.error) throw new Error(`${method}: ${json.error.message}`);
  return json.result;
}

function expect(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
}

for (const version of ["2024-11-05", "2025-06-18"]) {
  const init = await rpc("initialize", { protocolVersion: version, capabilities: {}, clientInfo: { name: "offthemode-test", version: "1" } }, version);
  expect(init.serverInfo?.name === "offthemode" && init.protocolVersion === version, `initialize ${version} · server "${init.serverInfo?.name}" · protocol ${init.protocolVersion}`);
  const tools = (await rpc("tools/list", {}, version)).tools.length;
  expect(tools === 9, `tools/list ${version} · ${tools} tools`);
  if (version !== "2025-06-18") continue;
  // The standing rule applies only where the project opted in, and points to RULES.md §Guides instead of listing work.
  const ins = init.instructions ?? "";
  expect(ins.includes("only for a project that has a .offthemode/ folder") && ins.includes("§Guides") && ins.includes("unless you already read them") && ins.includes("Source: https://github.com/"),
    "initialize · instructions: conditioned on .offthemode/, point to §Guides, carry the source link");
}

const tools = (await rpc("tools/list")).tools.map((t) => t.name).sort();
const wantTools = ["get_method", "get_template", "offthemode", "reassess", "revisit-checklist", "revisit-comments", "revisit-glossary", "revisit-state", "view-project"];
expect(JSON.stringify(tools) === JSON.stringify(wantTools), `tools/list · ${tools.join(", ")}`);

const note = "add CSV export to reports";
const lr = (await rpc("tools/call", { name: "revisit-checklist", arguments: { note } })).content[0].text;
expect(lr.includes(`User's note: ${note}`) && lr.includes("# Off the Mode · revisit checklist") && lr.includes('get_template tool: "CHECKLIST.md"') && !lr.includes("<template"),
  "tools/call revisit-checklist · note and instructions, template fetched on demand (not inlined)");
expect(lr.includes("only the first word of the note") && lr.includes("the user's own words") && !/\{\{\??NOTE/.test(lr),
  "tools/call revisit-checklist · says what to do with a cut-off note; no raw placeholder");

for (const name of ["offthemode", "reassess", "revisit-comments", "revisit-glossary", "view-project", "revisit-state"]) {
  const t = (await rpc("tools/call", { name, arguments: {} })).content[0].text;
  // Size guard: commands carry instructions only, so a status check stays cheap (~4 chars per token). Raised from 6000
  // to 8000 on 2026-10-07 (D-015) because squeezing under 6000 had started to cost clarity, and to 9000 on 2026-10-08
  // (D-023) for setup's old-name upgrade; quality wins over the guard.
  expect(t.length > 500 && t.length < 9000 && t.includes("Off the Mode"), `tools/call ${name} · ${t.length} chars (~${Math.round(t.length / 4)} tokens, limit 2250)`);
  if (name === "offthemode") expect(t.startsWith("Set up Off the Mode:") && !t.includes("Off the Mode · Set up"), "tools/call offthemode · header names it once");
  // view-project gives a line for each shell, each writing every note as a <template data-offthemode-file>, and the skills' offline copy.
  if (name === "view-project") expect(t.includes(`curl -fsSL https://offthemode.vercel.app/view -o "$OUT"`) && t.includes("Invoke-WebRequest https://offthemode.vercel.app/view") && (t.match(/<template data-offthemode-file=/g) ?? []).length === 2 && t.includes("view.html"),
    "tools/call view-project · the macOS and Linux line, the PowerShell line, the skills' view.html");
}

const tpl = (await rpc("tools/call", { name: "get_template", arguments: { name: "RULES.md" } })).content[0].text;
expect(tpl.startsWith("RULES ·"), "tools/call get_template RULES.md");

const index = (await rpc("tools/call", { name: "get_method", arguments: {} })).content[0].text;
const firstSlug = index.match(/^- ([a-z0-9-]+) ·/m)?.[1];
expect(Boolean(firstSlug) && index.includes("p3-visual-language · P3 · Visual Language · has working rules"), "tools/call get_method · index lists the guides and which have working rules");
const rules = (await rpc("tools/call", { name: "get_method", arguments: { sheet: "p3-visual-language" } })).content[0].text;
expect(rules.startsWith("## P3 · Visual Language\n\n### Working rules") && rules.includes('sheet "p3-visual-language" and full: true') && Buffer.byteLength(rules) < 5000,
  `tools/call get_method p3-visual-language · working rules only, ${(Buffer.byteLength(rules) / 1024).toFixed(1)} KB, with the way to the whole guide`);
const whole = (await rpc("tools/call", { name: "get_method", arguments: { sheet: "p3-visual-language", full: true } })).content[0].text;
expect(whole.startsWith("## P3 · Visual Language") && whole.includes("> **Output:**") && whole.length > rules.length * 5,
  `tools/call get_method p3-visual-language full: true · whole guide, ${(Buffer.byteLength(whole) / 1024).toFixed(1)} KB`);
const plain = (await rpc("tools/call", { name: "get_method", arguments: { sheet: "always-on-words-voice" } })).content[0].text;
expect(plain.startsWith("## Always-On · Words & Voice") && !plain.includes("### Working rules"), "tools/call get_method always-on-words-voice · no working rules, so the whole guide");

const prompts = (await rpc("prompts/list")).prompts.map((p) => p.name).sort();
expect(prompts.length === 7, `prompts/list · ${prompts.join(", ")}`);
const pr = await rpc("prompts/get", { name: "revisit-checklist", arguments: { note } });
expect(pr.messages?.[0]?.content?.text?.includes(`User's note: ${note}`), "prompts/get revisit-checklist");

const resources = (await rpc("resources/list")).resources;
expect(resources.length >= 30, `resources/list · ${resources.length} resources`);
const res = await rpc("resources/read", { uri: "offthemode://templates/CHECKLIST.md" });
expect(res.contents?.[0]?.text?.startsWith("# Checklist"), "resources/read CHECKLIST.md");

// Nothing is ever published (content changes only on redeploy), so a change-notification stream is refused at once.
const started = Date.now();
const meta = {
  "io.modelcontextprotocol/protocolVersion": MODERN,
  "io.modelcontextprotocol/clientInfo": { name: "offthemode-test", version: "1" },
  "io.modelcontextprotocol/clientCapabilities": {},
};
let listen;
try {
  listen = await post(
    { jsonrpc: "2.0", id: ++id, method: "subscriptions/listen", params: { notifications: { toolsListChanged: true }, _meta: meta } },
    { "mcp-protocol-version": MODERN, "mcp-method": "subscriptions/listen" },
    5000,
  );
} catch (e) {
  listen = { error: { message: `no answer (${e.name})` } };
}
expect(listen.error?.code === -32603 && Date.now() - started < 5000, `subscriptions/listen ${MODERN} · refused in ${Date.now() - started} ms (${listen.error?.message ?? "accepted"})`);

// Someone who opens the link in a browser lands on the site's add section.
const page = await fetch(URL_, { headers: { accept: "text/html,application/xhtml+xml" }, redirect: "manual" });
expect(page.status === 302 && (page.headers.get("location") ?? "").endsWith("/#add"), `GET in a browser · ${page.status} to ${page.headers.get("location")}`);

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
