// Talks to the MCP endpoint the way a client does and checks every command answers.
// usage: npm run test:mcp            (http://localhost:3000/mcp)
//        MCP_URL=https://.../mcp npm run test:mcp
const URL_ = process.env.MCP_URL ?? "http://localhost:3000/mcp";
let id = 0;
let failures = 0;

async function rpc(method, params = {}) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
  });
  const text = await res.text();
  const type = res.headers.get("content-type") ?? "";
  // Streamable HTTP may answer as JSON or as a one-event SSE stream.
  const json = type.includes("event-stream")
    ? JSON.parse(text.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join(""))
    : JSON.parse(text);
  if (json.error) throw new Error(`${method}: ${json.error.message}`);
  return json.result;
}

function expect(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
}

const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "offthemode-test", version: "1" } });
expect(init.serverInfo?.name === "offthemode", `initialize · server "${init.serverInfo?.name}" · protocol ${init.protocolVersion}`);
expect(typeof init.instructions === "string" && init.instructions.includes("offthemode"), "initialize · instructions present");

const tools = (await rpc("tools/list")).tools.map((t) => t.name).sort();
const wantTools = ["commentrevisit", "get_method", "get_template", "glossaryrevisit", "listrevisit", "offthemode", "reassess"];
expect(JSON.stringify(tools) === JSON.stringify(wantTools), `tools/list · ${tools.join(", ")}`);

const note = "add CSV export to reports";
const lr = (await rpc("tools/call", { name: "listrevisit", arguments: { note } })).content[0].text;
expect(lr.includes(`User's note: ${note}`) && lr.includes("# Off the Mode · list revisit") && lr.includes('get_template tool: "CHECKLIST.md"') && !lr.includes("<template"),
  "tools/call listrevisit · note and instructions, template fetched on demand (not inlined)");

for (const name of ["offthemode", "reassess", "commentrevisit", "glossaryrevisit"]) {
  const t = (await rpc("tools/call", { name, arguments: {} })).content[0].text;
  // Size guard: commands carry instructions only, so a status check stays cheap (~4 chars per token).
  expect(t.length > 500 && t.length < 6000 && t.includes("Off the Mode"), `tools/call ${name} · ${t.length} chars (~${Math.round(t.length / 4)} tokens, limit 1500)`);
}

const tpl = (await rpc("tools/call", { name: "get_template", arguments: { name: "RULES.md" } })).content[0].text;
expect(tpl.startsWith("RULES ·"), "tools/call get_template RULES.md");

const index = (await rpc("tools/call", { name: "get_method", arguments: {} })).content[0].text;
const firstSlug = index.match(/^- ([a-z0-9-]+) ·/m)?.[1];
expect(Boolean(firstSlug) && index.includes("p3-visual-language"), "tools/call get_method · index lists the sheets");
const sheet = (await rpc("tools/call", { name: "get_method", arguments: { sheet: "p3-visual-language" } })).content[0].text;
expect(sheet.startsWith("## P3 · Visual Language"), "tools/call get_method p3-visual-language");

const prompts = (await rpc("prompts/list")).prompts.map((p) => p.name).sort();
expect(prompts.length === 5, `prompts/list · ${prompts.join(", ")}`);
const pr = await rpc("prompts/get", { name: "listrevisit", arguments: { note } });
expect(pr.messages?.[0]?.content?.text?.includes(`User's note: ${note}`), "prompts/get listrevisit");

const resources = (await rpc("resources/list")).resources;
expect(resources.length >= 30, `resources/list · ${resources.length} resources`);
const res = await rpc("resources/read", { uri: "offthemode://templates/CHECKLIST.md" });
expect(res.contents?.[0]?.text?.startsWith("# Checklist"), "resources/read CHECKLIST.md");

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
