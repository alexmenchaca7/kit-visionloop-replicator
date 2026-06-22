# VisionLoop Site Replicator

> **Autonomous multi-agent system** that clones websites **page by page** with ≥99% visual fidelity — powered by Claude Code.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Claude Code](https://img.shields.io/badge/Powered%20by-Claude%20Code-orange)](https://claude.ai/code)

## What it does

- Takes any URL and autonomously generates a pixel-perfect **Next.js 15 clone**, page by page.
- Runs **5 analyst agents in parallel** (layout, design, typography, components, motion) per page.
- Runs **N builder agents** to generate each page section independently, then assembles them.
- Runs **3 comparator agents** (desktop / tablet / mobile) to diff the clone against the original.
- **Self-corrects per component** until it reaches ≥99% desktop / ≥97% mobile visual similarity.
- **Freezes design tokens** after the homepage — every subsequent page inherits them with zero inconsistency.
- Preserves multi-session progress — each page lives in its own isolated folder.
- Auto-installs all dependencies (Playwright, Sharp, Pixelmatch) on first run.

## How it works

```
You: Replica https://linear.app

Claude: [5 analyst agents run in parallel]
        → layout analyst, design analyst, typography analyst,
          component analyst, motion analyst

        [N builder agents generate sections in parallel]
        → hero builder, nav builder, features builder, …

        [3 comparator agents run visual diff]
        → desktop 99.1% ✅ / tablet 97.3% ✅ / mobile 98.8% ✅

        [fixers auto-apply corrections per component]
        → re-compare until ≥99%

Claude: ✅ Homepage done (99.2% similarity). Design tokens frozen.

        Next pages detected in navbar:
          1️⃣  /about   (8–15 min)
          2️⃣  /pricing (12–20 min)

You: Next: /about

Claude: [reuses Navbar + Footer + frozen design tokens]
        [generates only /about-specific components]
        ✅ /about done (99.1% similarity)
```

No discrepancies between pages — design tokens are frozen after the first page and reused everywhere.

## Requirements

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **Claude Code** (latest) — [claude.ai/code](https://claude.ai/code)
- **~600 MB disk space**

Everything else (Playwright, Sharp, Pixelmatch, shadcn/ui) installs automatically on first run.

## Installation

```bash
git clone https://github.com/alexmenchaca7/kit-visionloop-replicator
cd kit-visionloop-replicator
claude
```

To make the skill available in **all** your projects (not just this folder):

```bash
# macOS / Linux
mkdir -p ~/.claude/skills
cp .claude/skills/visionloop-replicator.md ~/.claude/skills/

# Windows
mkdir "%USERPROFILE%\.claude\skills"
copy .claude\skills\visionloop-replicator.md "%USERPROFILE%\.claude\skills\"
```

Restart Claude Code. Now any project can use the skill.

## Usage

Open the folder in Claude Code and send a URL:

```
Replica https://linear.app
```

Other valid inputs:

```
Replica this screenshot    ← drag a PNG/JPG into the chat
Replica from this HTML     ← paste raw HTML
Next: /about               ← continue to next page after homepage
```

To view the result locally:

```bash
cd replica
pnpm dev          # open http://localhost:3000
```

To deploy:

```bash
cd replica
npx vercel        # live in ~1 minute
```

## Tech stack (generated output)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + extracted design tokens |
| Animations | Framer Motion |
| Components | shadcn/ui + Lucide Icons |
| Images | Next/Image (auto-optimized) |
| Testing | Playwright (visual diff) + Pixelmatch |
| Deploy | Vercel (zero-config) |

## Project structure

```
kit-visionloop-replicator/
├── CLAUDE.md                          ← agent behavior & workflow rules
├── INSTRUCCIONES.md                   ← full setup guide (Spanish)
├── README.md                          ← this file
├── .claude/
│   └── skills/
│       └── visionloop-replicator.md  ← the agentic pipeline (~41 KB)
└── replica/                           ← generated Next.js project
    ├── app/                           ← App Router pages
    ├── components/
    │   └── sections/
    │       ├── shared/                ← Navbar, Footer (reused across pages)
    │       └── pages/
    │           └── home/              ← page-specific components
    ├── lib/
    │   ├── design-tokens.ts           ← frozen after page 1
    │   └── page-registry.ts           ← updated per new page
    ├── public/images/
    │   ├── shared/                    ← logo, global assets
    │   └── pages/home/                ← page-specific assets
    ├── references/pages/home/         ← DOM, computed styles, content JSON
    └── scripts/                       ← capture, compare, crawl, validate
```

> `replica/` is generated at runtime and is git-ignored. Each page lives in its own isolated subfolder — you can regenerate one page without touching others.

## Agent pipeline (per page)

| Agent type | Count | Role |
|---|---|---|
| **Analysts** | 5 parallel | Dissect layout, design, typography, components, motion |
| **Builders** | N parallel | Generate each page section independently |
| **Comparators** | 3 parallel | Desktop / tablet / mobile visual diff |
| **Fixers** | N parallel | Apply component-level corrections |

Self-correction loop runs until ≥99% desktop / ≥97% mobile. After 3 iterations without improvement the component is regenerated from scratch (anti-loop guard).

### Estimated time per page

| Page type | Time |
|---|---|
| Homepage (first — design tokens extracted here) | 8–20 min |
| Typical page (/about, /pricing) | 8–18 min |
| Complex page (many sections) | 12–25 min |
| Full 5-page site | 50–120 min |

Progress is preserved between sessions — pick up where you left off.

## License

MIT
