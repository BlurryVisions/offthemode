import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { commands, templates, sheets, renderCommand, sheetText, INSTRUCTIONS } from "@/lib/content";

const templateNames = Object.keys(templates) as [string, ...string[]];
const sheetSlugs = sheets.map((s) => s.slug) as [string, ...string[]];

const handler = createMcpHandler(
  (server) => {
    for (const c of commands) {
      const arg = c.argument;
      const argSchema = () => z.string().max(2000).optional().describe(c.argumentHint ?? arg ?? "");
      const inputSchema = arg ? z.object({ [arg]: argSchema() }) : z.object({});

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
          argsSchema: arg ? z.object({ [arg]: argSchema() }) : z.object({}),
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
          "Returns an Off the Mode guide: planning, look and feel, backend, navigation, the core, security, shipping, and the always-on practices. " +
          "Open the guide the project's .offthemode/RULES.md §Guides names for the work you are about to do, once per session. " +
          "A phase guide returns its short working rules, for a change inside an existing product; pass full: true for the whole guide when you start that phase or change its structure. " +
          "Call with no sheet for the index.",
        inputSchema: z.object({
          sheet: z.enum(sheetSlugs).optional(),
          full: z.boolean().optional().describe("true returns the whole guide instead of its working rules"),
        }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ sheet, full }: { sheet?: string; full?: boolean }) => {
        if (!sheet) {
          const index = sheets.map((s) => `- ${s.slug} · ${s.title}${s.rules ? " · has working rules" : ""}`).join("\n");
          return {
            content: [{
              type: "text" as const,
              text: "Off the Mode · the method. Fetch one guide at a time. A guide with working rules returns them unless you pass full: true; the others always come whole.\n\n" + index,
            }],
          };
        }
        const found = sheets.find((s) => s.slug === sheet);
        return { content: [{ type: "text" as const, text: found ? sheetText(found, full) : `No sheet "${sheet}".` }] };
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
    instructions: INSTRUCTIONS,
    // Content changes only on redeploy, so nothing is ever published: refuse change-notification streams at once
    // instead of holding a function open for each one.
    maxSubscriptions: 0,
  },
);

// Someone who opens the link in a browser lands on the add section of the site, not on a raw protocol error.
async function GET(request: Request): Promise<Response> {
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/html") && !accept.includes("text/event-stream")) {
    return Response.redirect(new URL("/#add", request.url), 302);
  }
  return handler(request);
}

export { GET, handler as POST, handler as DELETE };
