import { AddTabs } from "@/components/AddTabs";
import { commands, MCP_URL, REPO_URL } from "@/lib/content";

const cursorLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=offthemode&config=${Buffer.from(JSON.stringify({ url: MCP_URL })).toString("base64")}`;
const vscodeLink = `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "offthemode", type: "http", url: MCP_URL }))}`;

const TOUCHES: Record<string, string> = {
  offthemode: "Only the .offthemode/ folder",
  listrevisit: "The checklist",
  reassess: "Nothing: it reports",
  commentrevisit: "Code comments only",
  glossaryrevisit: "The plain-words summary",
};
const WHAT: Record<string, string> = {
  offthemode: "Sets up your project, new or existing, or tells you where it stands",
  listrevisit: "Shows the checklist, or adds a new feature or idea to it",
  reassess: "Checks what's built against your core concept",
  commentrevisit: "Removes stale or noisy comments, adds a why where code can't explain itself",
  glossaryrevisit: "Refreshes a summary of the project anyone can understand",
};
const ARG: Record<string, string> = { listrevisit: " [idea]", commentrevisit: " [path]" };

const ORDER = [
  ["Rules", "The standard every change is held to"],
  ["Plan", "The vision and the core concept, before any code"],
  ["Look and feel", "If there's a UI: references, tokens, nothing average"],
  ["Backend and hosting", "Strong from the first commit, ready to go live"],
  ["Navigation", "Every screen and every state, walkable end to end"],
  ["The core", "Built fragment by fragment, each one proven"],
  ["Security", "Rules from day one, a full audit before launch"],
  ["Ship", "Launch, watch, learn, improve the setup itself"],
] as const;

export default function Home() {
  const zips = commands.map((c) => ({ name: c.name, href: `/skills/${c.name}.zip` }));
  return (
    <>
      <header className="bar">
        <div className="wrap">
          <a className="mark" href="/">Off the <span>Mode</span></a>
          <nav aria-label="Main">
            <a href="#add">Add it</a>
            <a href="/method">Method</a>
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
              project. Your project only gets one folder.
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
                <p className="win"><b>First win</b>Where you really stand, in about ten minutes.</p>
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
              <h2 className="title" id="commands">Five commands, each with one job</h2>
            </div>
            <div className="tablewrap">
              <table>
                <thead>
                  <tr><th>Say or type</th><th>What it does</th><th>What it can change</th></tr>
                </thead>
                <tbody>
                  {commands.map((c) => (
                    <tr key={c.name}>
                      <td><code>/{c.name}{ARG[c.name] ?? ""}</code></td>
                      <td>{WHAT[c.name] ?? c.title}</td>
                      <td>{TOUCHES[c.name] ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">You can always just say it instead: &ldquo;run listrevisit&rdquo;, &ldquo;reassess the project&rdquo;.</p>
          </div>
        </section>

        <section className="section" id="add" aria-labelledby="add-title">
          <div className="wrap">
            <div className="head">
              <span className="label">Add it</span>
              <h2 className="title" id="add-title">Pick your tool</h2>
            </div>
            <AddTabs mcpUrl={MCP_URL} cursorLink={cursorLink} vscodeLink={vscodeLink} repoUrl={REPO_URL} zips={zips} />
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
                <p>Your sessions stay free-form. Nothing forces the checklist on you; the revisits catch up when you ask.</p>
              </div>
              <div className="promise">
                <h3>One folder, nothing else</h3>
                <p>Everything lives in <span className="inline">.offthemode/</span>. Your code only changes when you ask your AI to change it.</p>
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
          <a href="/mcp">MCP endpoint</a>
        </div>
      </footer>
    </>
  );
}
