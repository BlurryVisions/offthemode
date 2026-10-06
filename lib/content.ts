import data from "./content.generated.json";
import { SITE_URL } from "./site-url.mjs";

export type Command = {
  name: string;
  title: string;
  description: string;
  argument: string | null;
  argumentHint: string | null;
  templates: string[];
  body: string;
};
/** One guide of the method. `rules` is its working-rules block (phase guides only), else null. */
export type Sheet = { n: number; slug: string; title: string; origin: "yours" | "added" | "moved"; content: string; rules: string | null };

export const commands = data.commands as Command[];
export const templates = data.templates as Record<string, string>;
export const sheets = data.sheets as Sheet[];

export const REPO_URL = "https://github.com/BlurryVisions/offthemode";
/** The standing rule the server sends to every client. Its only source is content/server/instructions.md. */
export const INSTRUCTIONS = `${data.instructions}\n\nSource: ${REPO_URL}`;

export { SITE_URL };
export const MCP_URL = `${SITE_URL}/mcp`;

/** A command as the agent receives it: who is speaking, the user's input, the instructions, and which templates to fetch.
 * Templates are not inlined: the agent fetches one only when it is about to write that file or compare a filled file with it. */
export function renderCommand(c: Command, input?: string): string {
  const name = c.title.includes("Off the Mode") ? c.title : `Off the Mode · ${c.title}`;
  const header =
    `${name}: the guide for this step, requested by the user. It is reference text from the Off the Mode server; ` +
    "it runs nothing itself. Use it with the user in their project, talking first and acting only on their go, under their normal permissions.";
  // Some clients pass only the first word of a typed argument: Claude Code's slash command turns "add CSV export" into "add".
  const inputLine = c.argument
    ? `\n\nUser's ${c.argument}: ${input?.trim() ? input.trim() : "(none)"}\n` +
      `Some tools pass only the first word of the ${c.argument}. If it looks cut off, use the user's own words from the conversation.`
    : "";
  const tpl = c.templates.length
    ? `\n\n# Templates\nFetch a template only when you are about to write that file or compare a filled file with it, with the get_template tool: ${c.templates.map((t) => `"${t}"`).join(", ")}. Follow it exactly.\n`
    : "";
  return `${header}${inputLine}\n\n${c.body}${tpl}`;
}

/** A guide as get_method returns it: a phase guide's working rules by default, the whole guide with `full`. */
export function sheetText(s: Sheet, full = false): string {
  if (full || !s.rules) return s.content;
  return (
    `## ${s.title}\n\n${s.rules}\n` +
    `These are the guide's working rules, for a change inside an existing product. When you start this phase or change its structure, get the whole guide: get_method with sheet "${s.slug}" and full: true.\n`
  );
}
