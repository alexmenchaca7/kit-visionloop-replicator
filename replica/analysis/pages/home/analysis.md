# Virya Energy — Homepage Analysis (consolidated)

## Design tokens (locked)

### Colors (from computed-styles + screenshot inspection)
- **Brand deep green** `#174338` — primary brand bg (used for stats card, footer, CTA band, hero overlay base)
- Brand green variants: `#0f4338`, `#185649`, lighter `#1a513a`
- **Accent orange** `#ff5938` — CTA buttons, hero accent ("Fit For"/"Energy"), "Build with us"
- **Cream** `#eee8e2` — large section bg blocks ("Brand Promise", "Worldwide", solutions banners)
- Surface white `#fefefe` / pure white
- Ink (body text) `#1f1e1e`
- Muted gray `#9f908d` — secondary text, dividers
- Subtle gray bg `#f9f9f9` / `#f2f2f2`

### Typography
- **Single family**: Source Sans Pro / Source Sans 3 (weights 400, 500, 600). Use `next/font/google` → `Source_Sans_3`.
- Base body 16px / 1.6
- Scale (extracted from computed styles):
  - hero headline ≈ 112px desktop (clamp 64px→112px)
  - section headings ≈ 75px desktop (clamp 36px→72px)
  - h3 ≈ 60px / 24px small headings
  - body 16px, small 15px, label 12px

### Spacing / radii
- Section padding: clamp(4rem, 8vw, 7rem) vertical
- Container max-width ≈ 1320px (with 40px gutters at lg)
- Border radius: cards 16-24px, pill buttons (full radius)
- Cream sections often have rounded outer corners (~24-32px)

### Motion
- Subtle fade-up on scroll (Framer Motion fadeUp)
- Smooth scroll behavior
- Easing brand: cubic-bezier(0.22, 1, 0.36, 1)

---

## Section breakdown (top to bottom)

| # | Section            | Type          | Bg       | Notes |
|---|--------------------|---------------|----------|-------|
| 0 | Navbar (shared)    | sticky header | white    | Logo + dropdowns (Our expertise / Your activity) + 6 nav items + orange CTA |
| 1 | Hero               | full-bleed    | image+overlay | Wind-turbine landscape image, big "Fit For Purpose Energy" headline (orange "Fit For" + cream/white "Purpose Energy" or mixed), tagline + body + 2 CTAs |
| 2 | Expertise grid     | feature cards | white    | 6 cards in 3×2 grid with icon + title + body + link |
| 3 | Stats              | dark card     | deep green | 4 metrics inside a green card on light bg, with "Learn more" |
| 4 | Brand Promise      | banner        | cream    | Large heading + body + CTA in cream block with rounded corners |
| 5 | Worldwide impact   | map           | cream    | World map graphic, filters (All/Hydrogen/Solar/Wind), region pills, project list |
| 6 | Solutions (Landowners) | image banner | dark img | Image bg with overlay, heading + benefits chip list + CTA |
| 7 | Solutions (Manufacturing) | image banner | dark img | Same template, different image+copy |
| 8 | Featured Projects  | image grid    | white    | 6 project cards with image + category chip + title |
| 9 | Latest News        | news grid     | white    | 3 cards with image + categories + date + title + "See more" |
| 10| Final CTA          | band          | deep green | Centered headline + orange button |
| 11| Footer (shared)    | footer        | deep green | Logo + 3 columns of links + social + legal |

---

## Per-section build notes

### Hero
- Use a hero background image (one of the wind turbine assets, e.g. `2024_10_22-Vyria-Drone-c-Tof-Studio-Antoine-BRODKOM-_brod.kom-31.jpg`)
- Headline split: "Fit For" (orange) + "Purpose" (cream/orange) + "Energy" (orange or cream)
- Eyebrow small text above, body text + 2 CTAs (orange primary + outline secondary)
- Sub-band below hero with eyebrow "Energy" + body + dual CTAs (the actual data we have)

### Expertise grid
- 6 cards: Wind, Solar, Hydrogen, Energy supply, Service companies, Tailor made B2B
- Icons via Lucide (Wind, Sun, Atom, Zap/Plug, Activity, Factory)
- Each card: icon, title (medium weight), body, "→ Link" with arrow
- Cards have subtle hover lift, no border on white bg

### Stats card
- Inside a `#174338` rounded card with cream/white text
- 4 large numbers with small label below each
- "Virya Energy in a few numbers" heading + "Learn more" link in orange

### Brand Promise / Solutions / Worldwide banners
- Rounded cream blocks with generous padding
- Headlines very large
- Worldwide includes a world map SVG (Asia + Europe highlighted, project counts)

### News cards
- Categories as colored pills (Solar = orange tint, etc.)
- Date + location small caps
- Image top, content bottom

### Final CTA
- Deep green band, centered text "Start your energy transition today."
- Orange "Get started" button

---

## Reusable components needed

- `Container` — max-w-[1320px] mx-auto px-5/6/10
- `Button` — variants: primary (orange), secondary (outline), ghost
- `LinkArrow` — text + animated arrow on hover
- `SectionHeading` — eyebrow + heading + subheading variants
- `CategoryPill` — for news/projects
- `IconBadge` — small icon container for expertise cards
