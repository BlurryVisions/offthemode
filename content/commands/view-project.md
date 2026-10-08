---
name: view-project
title: View Project
description: Open the project's .offthemode/ notes as one page in the browser, read on this computer. Use when the user says /view-project or wants to see the project at a glance. Writes nothing in the project.
---
# Off the Mode · view project

Open the project's `.offthemode/` notes as one page in the user's browser: the checklist, the plan, the plain summary, the decisions, where things stand and the last check against the core concept. This writes nothing in the project, only one temporary file, so the user typing the command is the request: run it at once, with no plan to approve first.

1. Find the nearest `.offthemode/` that holds RULES.md, in the folder you work in or a folder above it, and run the line from the folder that holds it (the home folder's `~/.offthemode/` holds only ME.md and is not a project). If there is none, say the project isn't set up yet and offer the offthemode command, which sets it up.
2. Run the line for the user's system. It saves the view page as a temporary file, adds each `.offthemode/*.md` file to its end as base64 (text the page decodes), and opens it in the default browser.
   - macOS and Linux (on Linux, `xdg-open` instead of `open`, and `OUT="$HOME/offthemode-view.html"`, since a browser installed as a snap, as on Ubuntu, can't open files in /tmp): `OUT="${TMPDIR:-/tmp}/offthemode-view.html"; curl -fsSL https://offthemode.vercel.app/view -o "$OUT" && for f in .offthemode/*.md; do printf '<template data-offthemode-file="%s">' "${f##*/}"; base64 < "$f" | tr -d '\n'; printf '</template>\n'; done >> "$OUT" && open "$OUT"`
   - Windows PowerShell: `& { $ErrorActionPreference="Stop"; $out="$env:TEMP\offthemode-view.html"; Invoke-WebRequest https://offthemode.vercel.app/view -OutFile $out -UseBasicParsing; Get-ChildItem .offthemode\*.md | ForEach-Object { '<template data-offthemode-file="' + $_.Name + '">' + [Convert]::ToBase64String([IO.File]::ReadAllBytes($_.FullName)) + '</template>' } | Add-Content $out; Start-Process $out }`
   - With the skills, copy `view.html` from this skill's folder to the temporary file (`cp`, or `Copy-Item` on Windows) in place of the download, so it works offline.
3. If you can't run commands, or a step fails, say so and give the link instead: https://offthemode.vercel.app/view, where the user opens the `.offthemode` folder; nothing is uploaded.

Reply in one or two lines: the page is a snapshot of the notes as they are now (run /view-project again after they change), nothing from the project left the computer, and the temporary file's path.
