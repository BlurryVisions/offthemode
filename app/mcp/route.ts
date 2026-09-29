import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { commands, templates, sheets, renderCommand, REPO_URL } from "@/lib/content";

const templateNames = Object.keys(templates) as [string, ...string[]];
const sheetSlugs = sheets.map((s) => s.slug) as [string, ...string[]];

const handler = createMcpHandler(
  (server) => {
    for (const c of commands) {
      const arg = c.argument;
      const inputSchema = arg
        ? z.object({ [arg]: z.string().max(2000).optional().describe(c.argumentHint ?? arg) })
        : z.object({});

      server.registerTool(
        c.name,
        {
          title: c.title,
          description: `${c.description} Read-only: returns a guide (text) for this step; it changes nothing by itself.`,
          inputSchema,
          annotations: { readOnlyHint: true, openWorldHint: false },
        },
        async (args: Record<string, unknown>) => ({
          content: [{ type: "text" as const, text: renderCommand(c, arg ? (args[arg] as string | undefined) : undefined) }],
        }),
      );

      server.registerPrompt(
        c.name,
        {
          title: c.title,
          description: c.description,
          argsSchema: arg ? z.object({ [arg]: z.string().optional().describe(c.argumentHint ?? arg) }) : z.object({}),
        },
        (args: Record<string, string | undefined>) => ({
          messages: [{ role: "user" as const, content: { type: "text" as const, text: renderCommand(c, arg ? args[arg] : undefined) } }],
        }),
      );
    }

    server.registerTool(
      "get_template",
      {
        title: "Get an Off the Mode template",
        description: `Returns one of the templates for the project's .offthemode/ folder: ${templateNames.join(", ")}.`,
        inputSchema: z.object({ name: z.enum(templateNames) }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ name }: { name: string }) => ({ content: [{ type: "text" as const, text: templates[name] ?? "" }] }),
    );

    server.registerTool(
      "get_method",
      {
        title: "Read the Off the Mode method",
        description:
          "Returns an Off the Mode guide: planning, look and feel, backend, navigation, the core, security, shipping, and the always-on practices. Open the guide that matches the work you are about to do (the project's .offthemode/RULES.md §Guides maps work to guides), once per session. Call with no sheet for the index.",
        inputSchema: z.object({ sheet: z.enum(sheetSlugs).optional() }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ sheet }: { sheet?: string }) => {
        if (!sheet) {
          const index = sheets.map((s) => `- ${s.slug} · ${s.title}`).join("\n");
          return { content: [{ type: "text" as const, text: `Off the Mode · the method. Fetch one sheet at a time.\n\n${index}` }] };
        }
        const found = sheets.find((s) => s.slug === sheet);
        return { content: [{ type: "text" as const, text: found?.content ?? `No sheet "${sheet}".` }] };
      },
    );

    for (const name of templateNames) {
      server.registerResource(
        `template-${name}`,
        `offthemode://templates/${name}`,
        { title: `Template · ${name}`, description: `The .offthemode/${name} template`, mimeType: "text/markdown" },
        async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: templates[name] ?? "" }] }),
      );
    }
    for (const s of sheets) {
      server.registerResource(
        `method-${s.slug}`,
        `offthemode://method/${s.slug}`,
        { title: `Method · ${s.title}`, mimeType: "text/markdown" },
        async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: s.content }] }),
      );
    }
  },
  {
    serverInfo: { name: "offthemode", version: "0.1.0" },
    instructions:
      "Off the Mode makes you plan first, build in the right order and hold an elite bar. Each tool returns instructions to follow in the user's project; the project's plan and memory live in its .offthemode/ folder. " +
      "Standing rule, even when no Off the Mode command was run: if the project has a .offthemode/ folder, read .offthemode/RULES.md and .offthemode/STATE.md before your first change in a session, and follow RULES.md. " +
      "Before design, backend, navigation, core, security or launch work, open the matching guide with get_method (RULES.md §Guides maps the work to the guide), once per session. " +
      "Start with the offthemode tool (set up, or status if already set up). Then, when the user asks: listrevisit (the checklist), reassess (code vs core concept), commentrevisit (comments only), glossaryrevisit (plain-words summary). " +
      `Source: ${REPO_URL}`,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
