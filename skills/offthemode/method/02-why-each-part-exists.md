## Why each part exists

Each part of the method is there because building with AI goes wrong in a specific way without it.

| Part | What goes wrong without it |
|---|---|
| Product-First Doctrine | The person, the job and the moment of value are never written down, so the AI fills them in with the average product. |
| Doubts written as hypotheses | A guess is treated as fact. When it turns out wrong, everything built on top of it has to move. |
| Talk first, then do | The AI changes things you never agreed to, and you only find out when you read the changed files. |
| Always-On · Verification Loop | Nothing checks the work: "done" means the AI stopped typing. |
| Security from day one (RULES.md §Safety, a threat sketch in P1, the P7 audit) | Permissions, tenancy (keeping each customer's data apart) and where personal data lives get decided during backend work anyway. A security phase at the end finds them too late. |
| Living Checklist and P2 · Core Spike | The riskiest piece of the core gets built last, and if it needs a different data shape, everything built before it bends. |
| Taming Complexity | Every feature arrives with a new control until the product is cluttered. |
| Expertise Injection | "Act as a senior engineer" changes the tone, not the decisions. |
| Always-On · Real Data, and Words & Voice | Screens are judged on placeholder text and copy is left to defaults, so everything looks generic. |
| RULES.md, grown from corrections | Corrections are lost between sessions and the same mistakes come back. |
| STATE.md and DECISIONS.md | Every session starts cold: the AI re-reads the code to find where things stand and reopens decisions that were already made. |
| GLOSSARY.md | Nobody outside the build can say what the product does in plain words, and the code, the copy and the chat use three names for one thing. |
| P8 · Ship & Operate, and Instrumentation | Hosted is not shipped: no launch, no monitoring, no loop from real use back to the product. |
| Always-On · Being Found | Search is left to a launch-day checklist after rendering, addresses and words were chosen without it, so the pages strangers should find stay invisible and private ones can show up. |
| Always-On · Agent Orchestration | One AI in one session does everything, including reviewing its own work. |
| Evidence in PRODUCT.md, and the Five-Person Test | Every judge is a model or the builder; nobody checks that real people reach the moment of value. |
| P3 · Visual Language (PRODUCT.md §Feeling, DESIGN.md) | "Unique" is defined against the average instead of toward a real point of view, so it drifts into the next trend. |
