import { AddTabs } from "@/components/AddTabs";
import { commands, MCP_URL, REPO_URL, SITE_URL } from "@/lib/content";

const cursorLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=offthemode&config=${Buffer.from(JSON.stringify({ url: MCP_URL })).toString("base64")}`;
const vscodeLink = `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "offthemode", type: "http", url: MCP_URL }))}`;
const skillsZip = `${SITE_URL}/skills/offthemode-skills.zip`;

const TOUCHES: Record<string, string> = {
  offthemode: "The .offthemode/ folder, plus one line you approve so your tool loads it; if you say yes, your usual setup in ~/.offthemode/ME.md",
  "revisit-checklist": "The checklist",
  reassess: "Only its own report, if you say so",
  "revisit-comments": "Code comments only",
  "revisit-glossary": "The plain-words summary",
  "view-project": "Nothing in your project: one temporary page",
  "revisit-state": "Where things stand, and new decisions",
};
const WHAT: Record<string, string> = {
  offthemode: "Sets up your project, new or existing, or tells you where it stands",
  "revisit-checklist": "Shows the checklist, or adds a new feature or idea to it",
  reassess: "Checks what's built against your core concept",
  "revisit-comments": "Removes stale or noisy comments, adds a why where code can't explain itself",
  "revisit-glossary": "Refreshes a summary of the project anyone can understand",
  "view-project": "Opens your project as a page in your browser",
  "revisit-state": "Saves where things stand, so a fresh session picks up from here; your AI also runs it on its own after changing files",
};
const ARG: Record<string, string> = { "revisit-checklist": " [idea]", "revisit-comments": " [path]" };
// The order people meet them in: set up first, then the rest from most to least used.
const SEQUENCE = ["offthemode", "revisit-checklist", "revisit-state", "view-project", "reassess", "revisit-comments", "revisit-glossary"];
const byUse = [...commands].sort((a, b) => SEQUENCE.indexOf(a.name) - SEQUENCE.indexOf(b.name));

const ORDER = [
  ["Rules", "The standard every change is held to"],
  ["Plan", "The vision and the core concept, before any code"],
  ["Look and feel", "If there's a UI: references, a color and type system, nothing average"],
  ["Backend and hosting", "Strong from the first commit, ready to go live"],
  ["Navigation", "Every screen and every state, walkable end to end"],
  ["The core", "Built fragment by fragment, each one proven"],
  ["Security", "Rules from day one, a full audit before launch"],
  ["Ship", "Launch, watch, learn, improve the setup itself"],
] as const;

// Google's site-name markup: WebSite with name and url, on the home page only. SoftwareApplication would earn no rich
// result here, since Google requires a rating or review for it and Off the Mode has none to show.
const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "Off the Mode", url: `${SITE_URL}/` };

export default function Home() {
  const zips = commands.map((c) => ({ name: c.name, href: `/skills/${c.name}.zip` }));
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is data, not code; "<" is escaped so the text can never close the script tag (Next's JSON-LD guide).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="bar">
        <div className="wrap">
          <a className="mark" href="/">Off the <span>Mode</span></a>
          <nav aria-label="Main">
            <a href="#add">Add it</a>
            <a href="/method">Method</a>
            <a href="/view">View</a>
            <a href={REPO_URL}>GitHub</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <p className="kicker">A prompt-engineering setup for AI coding tools</p>
            <h1 className="headline">
              Left alone, your AI builds{" "}
              <span className="redline">
                <span className="struck">the average</span>
                <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M1 6 C 30 3, 60 8, 99 4" />
                </svg>
                <span className="fix" aria-hidden="true">yours</span>
              </span>
              .
            </h1>
            <p className="lede">
              Off the Mode makes Claude, Cursor or any AI coding tool plan first, build in the right order, and hold an
              elite bar: clean code, fast screens, nothing that looks like every other app. It lives outside your
              project. Your project gets the <span className="inline">.offthemode/</span> folder, plus one line you
              approve so your tool loads it.
            </p>
            <div className="actions">
              <a className="btn btn--solid" href="#add">Add it to your tool</a>
              <a className="btn" href="/method">Read the method</a>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="doors">
          <div className="wrap">
            <div className="head">
              <span className="label">Two doors</span>
              <h2 className="title" id="doors">A new project, or one you&apos;ve already started</h2>
            </div>
            <div className="doors">
              <div className="door">
                <h3>New project</h3>
                <ol>
                  <li>Add Off the Mode to your AI tool.</li>
                  <li>In your project, say <span className="inline">set up off the mode</span>.</li>
                  <li>It interviews you about your vision and your core concept.</li>
                  <li>You get a plan, and a checklist of the core split into pieces you build one after another.</li>
                </ol>
                <p className="win"><b>First win</b>A clear plan, in about ten minutes.</p>
              </div>
              <div className="door">
                <h3>Existing project</h3>
                <ol>
                  <li>Add Off the Mode to your AI tool.</li>
                  <li>In your project, say <span className="inline">set up off the mode</span>.</li>
                  <li>It reads your code and tells you, in plain words, what it thinks the project is. You confirm.</li>
                  <li>It checks the code against your core concept and builds the checklist, with what&apos;s done already marked.</li>
                </ol>
                <p className="win"><b>First win</b>Where you really stand: about ten minutes on a small project, longer on a big one.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="order">
          <div className="wrap">
            <div className="head">
              <span className="label">How it works</span>
              <h2 className="title" id="order">One order, every project</h2>
            </div>
            <p className="intro">
              Phases overlap, and your sessions stay free: you code the way you always do. The rules hold the
              standard in every session, and the revisit commands keep things honest whenever you ask.
            </p>
            <ol className="order">
              {ORDER.map(([t, d], i) => (
                <li key={t} className={t === "The core" ? "core" : undefined}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t">{t}</span>
                  <span className="d">{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" aria-labelledby="commands">
          <div className="wrap">
            <div className="head">
              <span className="label">Commands</span>
              <h2 className="title" id="commands">Seven commands, each with one job</h2>
            </div>
            <div className="tablewrap">
              <table>
                <thead>
                  <tr><th>Say or type</th><th>What it does</th><th>What it can change</th></tr>
                </thead>
                <tbody>
                  {byUse.map((c) => (
                    <tr key={c.name}>
                      <td><code>/{c.name}{ARG[c.name] ?? ""}</code></td>
                      <td>{WHAT[c.name] ?? c.title}</td>
                      <td>{TOUCHES[c.name] ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">You can always just say it instead: &ldquo;run revisit-checklist&rdquo;, &ldquo;reassess the project&rdquo;.</p>
          </div>
        </section>

        <section className="section" id="add" aria-labelledby="add-title">
          <div className="wrap">
            <div className="head">
              <span className="label">Add it</span>
              <h2 className="title" id="add-title">Pick your tool</h2>
            </div>
            <p className="intro">
              Two ways in. The link: your tool reaches it over MCP, the standard way AI tools connect to outside tools,
              and updates arrive on their own. The skills: files on your machine, no server.
            </p>
            <AddTabs mcpUrl={MCP_URL} skillsZip={skillsZip} cursorLink={cursorLink} vscodeLink={vscodeLink} repoUrl={REPO_URL} zips={zips} />
          </div>
        </section>

        <section className="section" aria-labelledby="promises">
          <div className="wrap">
            <div className="head">
              <span className="label">Promises</span>
              <h2 className="title" id="promises">What it never does</h2>
            </div>
            <div className="promises">
              <div className="promise">
                <h3>Never slows you down</h3>
                <p>Your sessions stay free-form. Nothing forces the checklist on you; the revisits catch up when you ask, and your AI keeps where things stand saved as it works.</p>
              </div>
              <div className="promise">
                <h3>One folder, plus one line</h3>
                <p>
                  Everything in your project lives in <span className="inline">.offthemode/</span>, plus one line you approve so your tool
                  loads it. If you say yes, your usual setup (where your code and hosting live) is kept in one small file in your home folder, so the next project only asks you to confirm. Your code only changes when you ask your AI to change it.
                </p>
              </div>
              <div className="promise">
                <h3>Never sees your code</h3>
                <p>The server only hands out instructions and templates. Your AI tool does the reading and writing, on your machine.</p>
              </div>
              <div className="promise">
                <h3>Any language, any tool</h3>
                <p>It&apos;s a way of working, not a library. Web, mobile, backend, data: Claude, Cursor, VS Code and more.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>Off the Mode · MIT licence</span>
          <a href={REPO_URL}>GitHub</a>
          <a href="/method">The method</a>
          <span>The link: <span className="url">{MCP_URL}</span></span>
        </div>
      </footer>
    </>
  );
}
