## Why each part exists
<!-- origin: added -->

Each part of the method is there because building with AI goes wrong in a specific way without it.

| Part | What goes wrong without it |
|---|---|
| Product-First Doctrine | The person, the job and the moment of value are never written down, so the AI fills them in with the average product. |
| Always-On · Verification Loop | Nothing checks the work: "done" means the AI stopped typing. |
| Security from day one (P0 rules, a threat sketch in P1, the P7 audit) | Permissions, tenancy and where personal data lives get decided during backend work anyway. A security phase at the end finds them too late. |
| Living Checklist and P2 · Core Spike | The riskiest piece of the core gets built last, and if it needs a different data shape, everything built before it bends. |
| Taming Complexity | Every feature arrives with a new control until the product is cluttered. |
| Expertise Injection | "Act as a senior engineer" changes the tone, not the decisions. |
| Always-On · Real Data, and Words & Voice | Screens are judged on placeholder text and copy is left to defaults, so everything looks generic. |
| P0 · Constitution (lessons) | Corrections are lost between sessions and the same mistakes come back. |
| P8 · Ship & Operate, and Instrumentation | Hosted isn't shipped: no launch, no monitoring, no loop from real use back to the product. |
| Always-On · Agent Orchestration | One AI in one session does everything, including reviewing its own work. |
| Evidence in PRODUCT.md, and the Five-Person Test | Every judge is a model or the builder; nobody checks that real people reach the moment of value. |
| P3 · Visual Language (taste) | "Unique" is defined against the average instead of toward a real point of view, so it drifts into the next trend. |
