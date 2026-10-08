// The one-paste skills install, in one place for the site (components/AddTabs.tsx) and the content build (the skills
// README, and the check that the method's copies match), so the lines never drift apart.

/** Off the Mode's skill folders, with the names the renames retired (D-023). The install removes them before unzipping,
 * because unzip -o adds and overwrites but never deletes: a renamed skill or a renumbered guide would linger beside the new one. */
export const SKILL_FOLDERS = [
  "offthemode", "reassess", "revisit-checklist", "revisit-comments", "revisit-glossary", "revisit-state", "view-project",
  "listrevisit", "listview", "commentrevisit", "glossaryrevisit",
];

/** Downloads first, so a failed download removes nothing; the subshell keeps the user's terminal where it was.
 * @param {string} zipUrl @param {string} dir @returns {string} */
export function installLine(zipUrl, dir) {
  return `curl -fsSL ${zipUrl} -o /tmp/offthemode-skills.zip && (mkdir -p ${dir} && cd ${dir} && rm -rf ${SKILL_FOLDERS.join(" ")} && unzip -oq /tmp/offthemode-skills.zip -x README.md)`;
}
