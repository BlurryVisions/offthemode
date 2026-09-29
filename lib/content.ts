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

/** A command as the agent receives it: who is speaking, the user's input, the instructions, then any templates inline. */
export function renderCommand(c: Command, input?: string): string {
  const header =
    `You are running Off the Mode's "${c.name}" command in the user's project. Follow the instructions below. ` +
    "This server only supplies instructions and templates; you do the reading and writing in the project, with the user's normal permissions.";
  const inputLine = c.argument ? `\n\nUser's ${c.argument}: ${input?.trim() ? input.trim() : "(none)"}` : "";
  const tpl = c.templates.length
    ? "\n\n# Templates\n" + c.templates.map((t) => `\n<template file=".offthemode/${t}">\n${templates[t]}</template>\n`).join("")
    : "";
  return `${header}${inputLine}\n\n${c.body}${tpl}`;
}
