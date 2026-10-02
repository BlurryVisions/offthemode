"use client";
import { useRef, useState } from "react";
import { Copy } from "./Copy";

type Props = {
  mcpUrl: string;
  skillsZip: string;
  cursorLink: string;
  vscodeLink: string;
  repoUrl: string;
  zips: { name: string; href: string }[];
};

const TABS = ["Claude", "Claude Code", "Cursor", "VS Code (Copilot)", "Codex", "Other tools", "Skills"] as const;
type Tab = (typeof TABS)[number];

export function AddTabs({ mcpUrl, skillsZip, cursorLink, vscodeLink, repoUrl, zips }: Props) {
  const [tab, setTab] = useState<Tab>("Claude");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const next = (i + TABS.length) % TABS.length;
    setTab(TABS[next]!);
    refs.current[next]?.focus();
  };
  const json = (servers: object) => JSON.stringify(servers, null, 2);
  // One paste installs all six skills. unzip creates only the last folder, so ~/.agents is made first
  // (Claude Code always has ~/.claude).
  const install = (dir: string) =>
    `curl -fsSL ${skillsZip} -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ${dir}`;
  const claudeLine = install("~/.claude/skills");
  const agentsLine = `mkdir -p ~/.agents/skills && ${install("~/.agents/skills")}`;

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
              if (e.key === "Home") { e.preventDefault(); move(0); }
              if (e.key === "End") { e.preventDefault(); move(TABS.length - 1); }
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
              <p>On a Team or Enterprise plan, only admins can add connectors. Ask yours to add it for the organization.</p>
              <p>
                Then say <span className="inline">set up off the mode</span> in a Claude session that can open your project
                folder, because setup reads the project and writes its files there. In a chat without your files, it drafts
                each file in the chat for you to save. For a codebase, Claude Code is the better fit (next tab).
              </p>
            </>
          )}
          {t === "Claude Code" && (
            <>
              <p>For Claude Code in the terminal and in its VS Code and JetBrains extensions.</p>
              <p>
                <b>One paste: the skills.</b> Run this once in a terminal (in VS Code: Terminal, then New Terminal). It
                installs all six skills for every project. They are files on your machine, so they work in auto mode with
                no extra step, and the commands are simply <span className="inline">/offthemode</span>,{" "}
                <span className="inline">/listrevisit</span> and so on.
              </p>
              <Copy text={claudeLine} label="the Claude Code install command" />
              <p>
                Run it again to update. For one project only, put the folders in that project&apos;s{" "}
                <span className="inline">.claude/skills/</span> instead.
              </p>
              <p><b>Or the link</b>, if you want updates to arrive on their own. Run this once. It adds Off the Mode for every project:</p>
              <Copy text={`claude mcp add --transport http --scope user offthemode ${mcpUrl}`} label="the add command" />
              <p>
                Auto mode, Claude Code&apos;s default, blocks tools from a server you just added until you allow them. Type{" "}
                <span className="inline">/permissions</span> in Claude Code and add this allow rule, or switch the session to
                Manual mode once and approve the tool when it asks:
              </p>
              <Copy text="mcp__offthemode" label="the allow rule" />
              <p>
                Run <span className="inline">claude mcp list</span> to check that <span className="inline">offthemode</span> shows
                as connected. The commands then show up as <span className="inline">/mcp__offthemode__listrevisit</span> and so
                on, or just say what you want.
              </p>
            </>
          )}
          {t === "Cursor" && (
            <>
              <div className="buttons">
                <a className="btn btn--solid" href={cursorLink}>Add to Cursor</a>
              </div>
              <p>Or add it by hand to <span className="inline">.cursor/mcp.json</span> in your project, or <span className="inline">~/.cursor/mcp.json</span> for every project:</p>
              <Copy block text={json({ mcpServers: { offthemode: { url: mcpUrl } } })} label="the Cursor config" />
              <p>Cursor also loads the skills, with no server: see the Skills tab.</p>
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
          {t === "Codex" && (
            <>
              <p>Add these lines to <span className="inline">~/.codex/config.toml</span>, then restart Codex:</p>
              <Copy block text={`[mcp_servers.offthemode]\nurl = "${mcpUrl}"`} label="the Codex config" />
              <p>Codex also loads the skills, with no server: see the Skills tab.</p>
            </>
          )}
          {t === "Other tools" && (
            <>
              <p>
                Windsurf, Zed, Cline and any other tool that supports MCP servers over HTTP can use this link. In the
                tool&apos;s MCP settings, add a remote server (often labelled HTTP or streamable HTTP) named{" "}
                <span className="inline">offthemode</span>, with this link as its URL:
              </p>
              <Copy text={mcpUrl} label="the Off the Mode link" />
              <p>Gemini CLI also loads the skills, with no server: see the Skills tab.</p>
            </>
          )}
          {t === "Skills" && (
            <>
              <p>
                No server at all: the skills are files your AI tool loads from its skills folder. Install all six together.
                Setup hands over to listrevisit and reassess, so one skill on its own is not enough.
              </p>
              <ul>
                <li>
                  <b>Claude Code</b> reads <span className="inline">.claude/skills/</span> in a project, or{" "}
                  <span className="inline">~/.claude/skills/</span> for every project.
                </li>
                <li>
                  <b>Codex, Gemini CLI, Cursor and VS Code</b> read <span className="inline">.agents/skills/</span> in a
                  project, or <span className="inline">~/.agents/skills/</span> for every project.
                </li>
              </ul>
              <p>One paste in a terminal installs them for every project. For Claude Code:</p>
              <Copy text={claudeLine} label="the Claude Code install command" />
              <p>For Codex, Gemini CLI, Cursor or VS Code:</p>
              <Copy text={agentsLine} label="the install command for the other tools" />
              <p>Or download them, and unzip the six folders into the skills folder yourself.</p>
              <div className="buttons">
                <a className="btn btn--solid" href="/skills/offthemode-skills.zip" download>Download all skills</a>
                <a className="btn" href={`${repoUrl}/tree/main/skills`}>Browse on GitHub</a>
              </div>
              <p>On claude.ai you upload one skill at a time, so each has its own zip. Upload all six:</p>
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
