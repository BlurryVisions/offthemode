---
name: glossaryrevisit
title: Glossary Revisit
description: Write or refresh the plain-words project summary in .offthemode/GLOSSARY.md, for anyone to understand. Use when the user says /glossaryrevisit or needs to explain or present the project.
templates: GLOSSARY.md
---
# Off the Mode · glossary revisit

Write or update the "## In plain words" section of `.offthemode/GLOSSARY.md`: a summary of this project for people, not agents. Leave "## Terms" untouched.

Sources: `.offthemode/PRODUCT.md` for the intent; `.offthemode/CHECKLIST.md` and the code for what actually works today. Never describe planned work as working.

Rules:
- Anyone can understand it: a new teammate, an investor, a relative. Short sentences, everyday words.
- No technical words: no stack, framework, database, API, model or architecture names. If a product word is unavoidable, explain it under "Words you'll hear".
- Say what people can do, never how it's built.
- Under 300 words, so it fits on one screen. Count them with a command (such as wc -w) where you can run one, not by eye.

Before showing it, reread every sentence as someone outside tech and rewrite any they would have to ask about. Show the new section and, if one exists, what changed and why (usually "Where we are"). Write it on the user's go.

End with this line: See it as a page: /listview, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).
