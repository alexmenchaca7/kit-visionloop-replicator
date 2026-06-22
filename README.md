# VisionLoop Site Replicator

> **Autonomous multi-agent system** that clones websites **page by page** with ≥99% visual fidelity — powered by Claude Code.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Claude Code](https://img.shields.io/badge/Powered%20by-Claude%20Code-orange)](https://claude.ai/code)

---

## What is this?

A **production-grade agentic pipeline** that takes a URL and autonomously generates a pixel-perfect Next.js clone of any website, page by page. It uses computer vision, multi-agent orchestration, and iterative self-correction to reach ≥99% visual similarity.

You give it a URL. It gives you a deployable Next.js 15 project.

---

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

Claude: ✅ Homepage done (99.2% similarity)

        Next pages detected in navbar:
          1️⃣  /about  (8-15 min)
          2️⃣  /pricing (12-20 min)

You: Next: /about

Claude: [reuses Navbar + Footer + frozen design tokens]
        [generates only /about-specific components]
        ✅ /about done (99.1% similarity)
```

No discrepancies between pages — design tokens are frozen after the first page and reused everywhere.

---

## Architecture

```
kit-visionloop-replicator/
├── CLAUDE.md                        ← agent behavior & workflow rules
├── INSTRUCCIONES.md                 ← full setup guide
├── .claude/
│   └── skills/
│       └── visionloop-replicator.md ← the agentic pipeline (41 KB)
└── replica/                         ← generated Next.js project
    ├── app/                         ← App Router pages
    ├── components/
    │   └── sections/
    │       ├── shared/              ← Navbar, Footer (reused across pages)
    │       └── pages/
    │           └── home/            ← page-specific components
    ├── lib/
    │   ├── design-tokens.ts         ← frozen after page 1
    │   └── page-registry.ts         ← updated per new page
    ├── public/images/
    │   ├── shared/                  ← logo, global assets
    │   └── pages/home/              ← page-specific assets
    ├── references/pages/home/       ← DOM, computed styles, content JSON
    └── scripts/                     ← capture, compare, crawl, validate
```

---

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

---

## Agent pipeline (per page)

| Agent type | Count | Role |
|---|---|---|
| **Analysts** | 5 parallel | Dissect layout, design, typography, components, motion |
| **Builders** | N parallel | Generate page sections independently |
| **Comparators** | 3 parallel | Desktop / tablet / mobile visual diff |
| **Fixers** | N parallel | Apply component-level corrections |

Self-correction loop runs until ≥99% desktop / ≥97% mobile. After 3 iterations without improvement it regenerates the component from scratch (anti-loop).

---

## Quick start

### Requirements
- Node.js 20+
- Claude Code (latest)
- ~600 MB disk space

Everything else (Playwright, Sharp, Pixelmatch) installs automatically on first run.

### Run

```bash
git clone https://github.com/AlejandroMenchaca/kit-visionloop-replicator
cd kit-visionloop-replicator
claude
```

Then in the Claude Code chat:

```
Replica https://linear.app
```

### Deploy output

```bash
cd replica
npx vercel
```

The `app/[slug]/page.tsx` architecture handles all routes dynamically — deploy at any point during page generation.

---

## Page-by-page workflow

```
SESSION 1 (~15 min):
  Replica https://linear.app
  → Claude generates homepage
  → Design tokens frozen

SESSION 2 (~18 min):
  Next: /about
  → Reuses Navbar + Footer + tokens
  → Generates /about-specific components

SESSION 3 (~20 min):
  Next: /pricing
  → ✅ Done

TOTAL: ~50 min → multi-page site, zero inconsistencies
```

Multi-session: progress is preserved between sessions. Each page lives in its own folder.

---

## Key design decisions

**Why page-by-page instead of all at once?**
Design tokens are extracted and frozen after the homepage. Every subsequent page inherits them — guaranteeing visual consistency without rework.

**Why parallel agents?**
Each section of a page is analyzed and built independently, then assembled. Fixers run per-component in parallel too — faster convergence, isolated failures.

**Why Next.js App Router + dynamic slug?**
`app/[slug]/page.tsx` serves all pages from a single route. You can deploy mid-generation and the site works with however many pages exist.

---

## Estimated time per page

| Page type | Time |
|---|---|
| Homepage (first) | 8–20 min |
| Typical page (/about, /pricing) | 8–18 min |
| Complex page (many sections) | 12–25 min |
| Full 5-page site | 50–120 min |

---

## Rules (enforced by the agent)

1. **No invented content** — uses real copy from the site
2. **No design simplification** — glassmorphism, gradients, everything gets replicated
3. **No token drift** — design tokens are frozen after page 1
4. **No shared component modifications** — Navbar + Footer are write-once
5. **No discrepancies** — that's the point of page-by-page

---

**VisionLoop Site Replicator** — Perfect page after perfect page, autonomously.
