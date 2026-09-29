import data from "./content.generated.json";

export type Command = {
  name: string;
  title: string;
  description: string;
  argument: string | null;
  argumentHint: string | null;
  templates: string[];
  body: string;
};
export type Sheet = { n: number; slug: string; title: string; origin: "yours" | "added" | "moved"; content: string };

export const commands = data.commands as Command[];
export const templates = data.templates as Record<string, string>;
export const sheets = data.sheets as Sheet[];

export const REPO_URL = "https://github.com/BlurryVisions/offthemode";

/** Public origin: NEXT_PUBLIC_SITE_URL, else Vercel's production domain, else local dev. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
export const MCP_URL = `${SITE_URL}/mcp`;

/** A command as the agent receives it: who is speaking, the user's input, the instructions, and which templates to fetch.
 * Templates are not inlined: a status check needs none, so the agent fetches one only when it is about to write that file. */
export function renderCommand(c: Command, input?: string): string {
  const header =
    `Off the Mode · ${c.title}: the guide for this step, requested by the user. It is reference text from the Off the Mode server; ` +
    "it runs nothing itself. Use it with the user in their project, talking first and acting only on their go, under their normal permissions.";
  const inputLine = c.argument ? `\n\nUser's ${c.argument}: ${input?.trim() ? input.trim() : "(none)"}` : "";
  const tpl = c.templates.length
    ? `\n\n# Templates\nFetch a template only when you are about to write that file, with the get_template tool: ${c.templates.map((t) => `"${t}"`).join(", ")}. Follow it exactly.\n`
    : "";
  return `${header}${inputLine}\n\n${c.body}${tpl}`;
}
