// The owner's hurdles in a session, read from Claude Code's own session file: what the owner had to answer, read
// and do by hand, turn by turn (a turn starts at a message the owner typed). The patterns are plain heuristics,
// written out below; they count the same way for both arms, so the numbers compare arms, and the report keeps a
// few of the lines they matched so a reader can check them.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lines } from "../agent-usage.mjs";

// What the owner typed: user messages in the main chat, not tool results, notices (they start with "<"), skill
// texts or interruptions, and not the summary Claude Code writes when it compacts a long chat.
export function ownerText(e) {
  if (e.type !== "user" || e.isSidechain || e.isMeta || e.isCompactSummary || e.isVisibleInTranscriptOnly || !e.timestamp) return "";
  const c = e.message?.content;
  const text = typeof c === "string" ? c : Array.isArray(c) ? c.filter((x) => x.type === "text").map((x) => x.text).join(" ") : "";
  return text && !text.startsWith("<") && !text.startsWith("[Request interrupted") ? text : "";
}

// The end of a reply, where a question to the owner sits: its last 600 characters, code blocks, inline code and
// links left out (a "?" in a URL or a snippet, such as `user?.name` or `/progress?tab=done`, is no question).
const ending = (text) => text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "").replace(/https?:\S+/g, "").trim().slice(-600);

// 1. A turn that ended asking the owner: its last reply's ending holds a "?". The owner must answer before the work
//    goes on.
export const asksOwner = (text) => ending(text).includes("?");

// 2. A turn that ended asking for a go-ahead: to start, build, commit, push or ship (D-025: ask to decide, never to
//    start). The phrases come from the research count of lasscrobits' real turns (35 of 118 before D-025, 13 of 133
//    after), with commit, merge, deploy and proceed added, and "Go to push?" (two real turns ended on it). "Your
//    call" counts only with a start, build, ship or push word close after it: alone it hands the owner a decision,
//    the kind of question D-025 asks for ("the next step is your call: keep waiting, or move renames to the phone
//    app").
export const GO_AHEAD = new RegExp([
  String.raw`want me to`, String.raw`shall i`,
  String.raw`should i (?:push|start|go|build|commit|ship|merge|deploy|proceed|begin)`,
  String.raw`ready (?:to|for me to)`, String.raw`say (?:go|yes)`, String.raw`your go\b`, String.raw`give me (?:a|the) go`,
  String.raw`ok(?:ay)? to (?:push|start|ship|commit|merge|deploy|proceed)`,
  String.raw`(?:ship|push|commit|merge|deploy) (?:it|them|this|these)(?: now)?\?`,
  String.raw`start (?:it|now|on it)\?`, String.raw`go ahead\?`,
  String.raw`go to (?:push|start|build|ship|commit|merge|deploy)\b`,
  String.raw`your calls?\b[\s\S]{0,40}?\b(?:push|start|build|ship|commit|merge|deploy)\b`,
].join("|"), "i");
export const asksGoAhead = (text) => GO_AHEAD.test(ending(text));

// 3. Off the Mode's internal words in what the owner reads, each occurrence once: a path under .offthemode/, a
//    decision or risk id (D-123, R-12), a checklist item id (F4.2; a bare F4 is too often something else), and the
//    names of its notes files (from content/templates: CHECKLIST.md, STATE.md...). Code blocks count too: the owner
//    reads them.
const NOTES = readdirSync(fileURLToPath(new URL("../../content/templates", import.meta.url))).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
export const INTERNAL = new RegExp(String.raw`\.offthemode\/[\w./-]*|\b[DR]-\d{2,}\b|\bF\d{1,2}\.\d+\b|\b(?:${NOTES.join("|")})\.md\b`, "g");

// 4. Steps the owner must do by hand: lines that ask the owner to act. Two kinds:
//    a. a request: "you need to / you'll have to / can you / could you / would you / please", then within two words
//       an action (run, paste, open, click, approve, restart, set, push, sign in, check, try...);
//    b. an instruction for a hand action: a line or sentence starting (after a bullet or number) with paste, click,
//       tap, press, approve, reload, refresh, sign in, log in, visit, open the app/browser/page/console/terminal...,
//       or "run this / these / the following / it" (whole words: "Tapping it flips" describes, it doesn't ask); or a
//       line naming "in your terminal / shell".
//    A plan the AI will carry out itself ("1. Add the column") matches neither.
const ACTS = "run|paste|open|click|tap|approve|type|press|restart|reload|refresh|install|copy|visit|enter|execute|apply|set|add|create|delete|remove|push|deploy|merge|upload|download|select|choose|log ?in|sign ?in|go to|check|confirm|test|try";
export const HAND_REQUEST = new RegExp(String.raw`\b(?:you(?:'ll| will)?\s+(?:need|have)\s+to|(?:could|can|would) you|please)\s+(?:\w+\s+){0,2}?(?:${ACTS})\b`, "i");
export const HAND_ACTION = new RegExp(String.raw`(?:^|[.!]\s+)(?:[-*•]\s+|\d+[.)]\s+)?(?:\*\*)?(?:then\s+)?(?:paste|click|tap|press|approve|reload|refresh|sign ?in|log ?in|visit|open (?:the |your |a )?(?:app|browser|page|url|link|site|console|dashboard|terminal|settings|tab)|run (?:this|these|the following|it|them))\b|\bin your (?:terminal|shell)\b`, "i");
export const handSteps = (text) => text.split("\n").filter((l) => HAND_REQUEST.test(l) || HAND_ACTION.test(l)).map((l) => l.trim());

// 5. Reply length: the characters of all the main chat's text in a turn (what the owner reads), and of its last reply.

// The session's turns: the owner's message, and the main chat's text blocks until the next one.
export function ownerTurns(file) {
  const turns = [];
  for (const e of lines(file)) {
    const said = ownerText(e);
    if (said) { turns.push({ at: e.timestamp, said, texts: [] }); continue; }
    if (e.type !== "assistant" || e.isSidechain || !turns.length) continue;
    for (const b of Array.isArray(e.message?.content) ? e.message.content : []) {
      if (b.type === "text" && b.text?.trim()) turns.at(-1).texts.push(b.text);
    }
  }
  return turns;
}

export function turnHurdles(turn) {
  const all = turn.texts.join("\n\n"), last = turn.texts.at(-1) ?? "";
  const ids = all.match(INTERNAL) ?? [], steps = handSteps(all);
  return { at: turn.at, asked: asksOwner(last), goAhead: asksGoAhead(last), ids: ids.length, idsSeen: [...new Set(ids)].slice(0, 8), chars: all.length, lastChars: last.length, steps: steps.length, stepLines: steps.slice(0, 5).map((l) => l.slice(0, 160)) };
}

// Per session: the counts the report compares, and each turn's own.
export function sessionHurdles(file) {
  const turns = ownerTurns(file).map(turnHurdles);
  const sum = (k) => turns.reduce((s, t) => s + (typeof t[k] === "boolean" ? Number(t[k]) : t[k]), 0);
  return {
    turns: turns.length, asked: sum("asked"), goAhead: sum("goAhead"), ids: sum("ids"), turnsWithIds: turns.filter((t) => t.ids).length,
    charsPerTurn: turns.length ? Math.round(sum("chars") / turns.length) : 0, lastCharsPerTurn: turns.length ? Math.round(sum("lastChars") / turns.length) : 0,
    steps: sum("steps"), perTurn: turns,
  };
}

// What each measure means, for the report and --measure.
export const HURDLES = [
  ["asked", "turns that ended asking the owner something"],
  ["goAhead", "turns that ended asking to start, commit or push"],
  ["ids", "Off the Mode's internal ids and file names in replies"],
  ["charsPerTurn", "characters the owner reads per turn"],
  ["steps", "lines asking the owner to do something by hand"],
];
