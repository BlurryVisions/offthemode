"use client";
import { useRef, useState } from "react";
import { Copy } from "./Copy";

type Props = { mcpUrl: string; cursorLink: string; vscodeLink: string; repoUrl: string; zips: { name: string; href: string }[] };

const TABS = ["Claude", "Claude Code", "Cursor", "VS Code (Copilot)", "Other tools", "Skills"] as const;
type Tab = (typeof TABS)[number];

export function AddTabs({ mcpUrl, cursorLink, vscodeLink, repoUrl, zips }: Props) {
  const [tab, setTab] = useState<Tab>("Claude");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const next = (i + TABS.length) % TABS.length;
    setTab(TABS[next]!);
    refs.current[next]?.focus();
  };
  const json = (servers: object) => JSON.stringify(servers, null, 2);

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Your AI tool">
        {TABS.map((t, i) => (
          <button
            key={t}
            ref={(el) => { refs.current[i] = el; }}
            id={`tab-${i}`}
            className="tab"
            role="tab"
            type="button"
            aria-selected={tab === t}
            aria-controls={`panel-${i}`}
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(i + 1);
              if (e.key === "ArrowLeft") move(i - 1);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {TABS.map((t, i) => (
        <div key={t} id={`panel-${i}`} className="panel" role="tabpanel" aria-labelledby={`tab-${i}`} hidden={tab !== t}>
          {t === "Claude" && (
            <>
              <p>In the Claude desktop app or on claude.ai:</p>
              <ol>
                <li>Open <b>Settings</b>, then <b>Connectors</b>.</li>
                <li>Choose <b>Add custom connector</b>, name it <b>Off the Mode</b>, and paste this link.</li>
              </ol>
              <Copy text={mcpUrl} label="the Off the Mode link" />
              <p>Then, in a chat about your project, say <span className="inline">set up off the mode</span>.</p>
            </>
          )}
          {t === "Claude Code" && (
            <>
              <p>For Claude Code in the terminal and in its VS Code and JetBrains extensions.</p>
              <p><b>Easiest: the skills</b> (last tab). They install as files on your machine, work in auto mode with no extra step, and give you clean commands like <span className="inline">/offthemode</span>.</p>
              <p><b>Or the link.</b> Run this once in a terminal (in VS Code: Terminal → New Terminal). It adds Off the Mode for every project:</p>
              <Copy text={`claude mcp add --transport http --scope user offthemode ${mcpUrl}`} label="the command" />
              <p>Auto mode, Claude Code&apos;s default, blocks tools from a server you just added until you allow them. Type <span className="inline">/permissions</span> in Claude Code and add this allow rule, or switch the session to Manual mode once and approve the tool when it asks:</p>
              <Copy text="mcp__offthemode" label="the allow rule" />
              <p>Commands then show up as <span className="inline">/mcp__offthemode__listrevisit</span> and so on, or just say what you want.</p>
            </>
          )}
          {t === "Cursor" && (
            <>
              <div className="buttons">
                <a className="btn btn--solid" href={cursorLink}>Add to Cursor</a>
              </div>
              <p>Or add it by hand to <span className="inline">.cursor/mcp.json</span> in your project, or <span className="inline">~/.cursor/mcp.json</span> for every project:</p>
              <Copy block text={json({ mcpServers: { offthemode: { url: mcpUrl } } })} label="the Cursor config" />
            </>
          )}
          {t === "VS Code (Copilot)" && (
            <>
              <p>This is for GitHub Copilot, VS Code&apos;s own AI chat. Using the Claude extension inside VS Code? Use the Claude Code tab instead.</p>
              <div className="buttons">
                <a className="btn btn--solid" href={vscodeLink}>Add to VS Code (Copilot)</a>
              </div>
              <p>Or add it by hand to <span className="inline">.vscode/mcp.json</span> in your project:</p>
              <Copy block text={json({ servers: { offthemode: { type: "http", url: mcpUrl } } })} label="the VS Code config" />
            </>
          )}
          {t === "Other tools" && (
            <>
              <p>Any AI tool that supports MCP servers over HTTP (Windsurf, Zed, Cline and others) can use this link. Add a server in the tool&apos;s MCP settings and paste it:</p>
              <Copy text={mcpUrl} label="the Off the Mode link" />
            </>
          )}
          {t === "Skills" && (
            <>
              <p>No server at all: download the skills and put the folders where your tool loads skills. In Claude Code that&apos;s <span className="inline">.claude/skills/</span> in your project, or <span className="inline">~/.claude/skills/</span> for every project. Claude, Cursor, VS Code, Codex and Gemini CLI all read the same skill format.</p>
              <div className="buttons">
                <a className="btn btn--solid" href="/skills/offthemode-skills.zip" download>Download all skills</a>
                <a className="btn" href={`${repoUrl}/tree/main/skills`}>Browse on GitHub</a>
              </div>
              <p>Uploading to claude.ai one skill at a time? Each has its own zip:</p>
              <div className="zips">
                {zips.map((z) => <a key={z.name} href={z.href} download>{z.name}.zip</a>)}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
