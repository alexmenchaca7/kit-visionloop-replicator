---
name: visionloop-replicator
description: "Clona sitios web con fidelidad visual extrema usando visión computacional y un loop autónomo de auto-corrección. Recibe una URL, un screenshot full-page o HTML, hace reverse engineering visual, genera el sitio en Next.js + Tailwind + TypeScript, toma screenshots de la implementación, compara contra la referencia con pixelmatch/SSIM, detecta diferencias de layout/spacing/tipografía/color y itera automáticamente hasta superar 99% de similitud visual. Triggers: 'clonar sitio web', 'replicar web', 'copiar diseño de una página', 'reconstruir sitio desde screenshot', 'visionloop', 'site replicator', 'reverse engineering visual', 'pixel perfect clone', 'duplicar landing', 'recrear web desde URL', 'reconstruir desde imagen', 'auto-replicar diseño'."
---

# VisionLoop Site Replicator

Replica un sitio web con fidelidad visual extrema. Recibe URL, screenshot o HTML y genera una implementación en Next.js que se compara visualmente contra la referencia, corrigiéndose sola hasta superar el umbral de similitud.

**Regla fundamental: fidelidad visual > velocidad de desarrollo. Nunca te detengas hasta superar el threshold o agotar la estrategia anti-loop.**

---

## Reglas inviolables (anti-atajo, anti-ahorro)

Estas reglas **anulan cualquier heurística de eficiencia**, presupuesto de contexto, instinto de "ya tengo suficientes datos" o "lo hago yo más rápido". Si una de estas se rompe, el output es defectuoso por definición — no negociable.

1. **Prohibido saltar la fase de analysts.** Los 5 analyst agents del Paso 4 son **obligatorios** incluso si crees que ya extrajiste todo el contenido en pasos anteriores. La razón: cada analyst tiene un foco que el orchestrator NO replica (especialmente `motion-analyst` y `component-classifier`). La heurística "< 3 sub-tareas = secuencial" NO aplica al Paso 4 — siempre son 5, siempre paralelos.

2. **Prohibido scaffold-sin-cablear.** Si el orchestrator crea `lib/motion.ts`, `lib/carousel.ts`, `lib/animations.ts` o similar, **debe verificar en el Paso 7 que al menos un import existe en `components/`**. Un archivo de utilidades sin importadores cuenta como bug bloqueante, no como "preparado para más tarde".

3. **Prohibido análisis de screenshot-único.** Un PNG estático es ciego a:
   - Carruseles (Swiper, Slick, Glide, Embla, Splide, Keen, swiper-container, slider-container)
   - Acordeones / tabs / dropdowns con state inicial colapsado
   - Hover states (cards que se expanden, navbars con submenú)
   - Scroll-triggered animations (fade, slide, parallax, count-up, reveal)
   - Modales / lightboxes
   - Sticky/parallax behavior

   El crawler **DEBE** ejecutar las inspecciones del Paso 3.5 ANTES de tomar el screenshot. Si esas inspecciones no se hicieron, el resultado está incompleto por construcción.

4. **Pixelmatch no es la verdad — es UNA señal.** Un score de 60% sobre un full-page screenshot de 11.000 píxeles de alto no significa "60% de calidad visual" — significa "la altura total no coincide y todo se desplaza". Combinar SIEMPRE pixelmatch con el `structural-fidelity-score` (definido en el Paso 6.5). El threshold del 99% pixelmatch solo aplica a **crops por sección** (ver Paso 6.4), nunca al full-page.

5. **Si dudas si hacer algo, hazlo.** En este skill, "no estoy seguro si esa sección es un slider" → confirmar grepeando el DOM. "No sé si esto necesita animación" → revisar `data-animation` / `data-aos` / clases `wow` / scroll handlers. "Tal vez bastaría con un grid estático" → NO bastaría. Si el original lo tiene, la réplica lo tiene.

6. **Token budget NO es razón válida para reducir scope.** Si el orchestrator se ve tentado a "consolidar el análisis a mano para ahorrar contexto", está fallando la regla 1. La conversación se compactará automáticamente — no es tu problema. Tu problema es la fidelidad.

7. **El loop NO termina en "se ve parecido".** Termina cuando: (a) `structural-fidelity-score ≥ 0.95` Y (b) la lista de features-detectadas-pero-no-replicadas está vacía Y (c) el threshold pixelmatch por sección (no full-page) se cumple. Si alguna falla, sigue iterando o documenta explícitamente por qué es imposible.

---

## Arquitectura multi-agente

VisionLoop opera como un sistema orquestado donde múltiples sub-agentes trabajan en paralelo cuando las tareas son independientes. Regla operativa:

> Cuando un paso esté marcado con ⚡ **Paralelizable**, lanza TODAS las sub-tareas en un único mensaje con múltiples llamadas a la tool `Agent`. No las ejecutes en secuencia.

### Roles del sistema

| Rol | Cuándo aparece | Responsabilidad |
|---|---|---|
| **Orchestrator** (tú) | Siempre | Coordina pipeline, mantiene estado, history, scores, decide cuándo parar |
| **Analyst agents** | Paso 4 | Diseccionan la referencia (5 en paralelo) |
| **Builder agents** | Paso 5 | Generan secciones (1 por sección, en paralelo) |
| **Comparator agents** | Paso 6 | Comparan breakpoints (3 en paralelo por iteración) |
| **Fixer agents** | Paso 6 | Aplican correcciones a archivos independientes (N en paralelo) |
| **Validator agents** | Paso 7 | Visual + funcional + Lighthouse (3 en paralelo) |

### Reglas de coordinación

1. **Lock-in de design tokens** — los tokens (paleta, tipografía, spacing) se congelan al final del Paso 4. Ningún builder los modifica durante Paso 5.
2. **Ownership de archivos** — cada agente solo escribe en su archivo asignado. Si dos agentes necesitan el mismo archivo, secuencializa.
3. **Recursos compartidos** (`tailwind.config.ts`, `lib/design-tokens.ts`, `app/globals.css`) — solo el orchestrator los toca. Aplica cambios a estos ANTES de lanzar fixers paralelos.
4. **Dev server** — instancia única en background. Los comparators usan contexts de Playwright distintos sobre la misma instancia, no varios `pnpm dev`.
5. **History append-only** — solo el orchestrator escribe en `references/iterations/`.
6. **Heurística de paralelismo** — si una etapa paralela tendría < 3 sub-tareas, ejecútala secuencial (el overhead de spawnear no compensa). Con 3+ siempre paraleliza. **Excepción: Paso 4 (analysts) y Paso 7 (validators) son SIEMPRE paralelos y SIEMPRE completos — esta heurística no aplica a ellos, nunca, bajo ningún pretexto de eficiencia o "ya tengo los datos".**

### Contrato de los sub-agentes

Cada sub-agente recibe un prompt auto-contenido con:
- Su rol y archivo de output exclusivo
- Inputs concretos (rutas a screenshots, JSON de tokens, región del crop)
- Formato de respuesta esperado (JSON estructurado cuando aplique)
- Lista explícita de archivos que NO debe tocar

Esto evita race conditions y permite mergear resultados de forma determinista.

---

## Paso 1 — Recibir el input y analizar sitio

Saluda al usuario y pregunta de forma conversacional:

> **¿Qué página quieres replicar?**
>
> Puedo trabajar con:
>
> 1. **URL de una página** — la crawleo, descargo assets, capturo screenshots
> 2. **Screenshot full-page** (PNG/JPG/WebP) — analizo la imagen
> 3. **HTML completo** — parseo el DOM
>
> Replico **página por página**, no todas a la vez. Así cada página queda perfecta (≥99% fidelidad).

### Paso 1b — Detección automática de navegación (si hay URL)

Antes de hacer nada, realiza un **análisis rápido del sitio**:

1. Abre la URL con Playwright
2. Espera renderizado (`networkidle`)
3. Extrae la **navbar / menú principal** (busca `<nav>`, `<header>` con links)
4. Identifica enlaces internos (del mismo dominio)
5. Clasifica páginas por tipo:
   - **Homepage** (/)
   - **Páginas principales** (About, Services, Pricing, Contact, Blog, Docs, etc.)
   - **Subpáginas** (blog posts, case studies, etc.)

Output: `site-map.json`
```json
{
  "domain": "linear.app",
  "current_page": "/",
  "available_pages": [
    { "url": "/", "label": "Home", "type": "homepage", "navbar": true },
    { "url": "/about", "label": "About", "type": "main", "navbar": true },
    { "url": "/pricing", "label": "Pricing", "type": "main", "navbar": true },
    { "url": "/contact", "label": "Contact", "type": "main", "navbar": false },
    { "url": "/blog", "label": "Blog", "type": "main", "navbar": true }
  ],
  "suggested_order": ["/", "/about", "/pricing", "/blog"]
}
```

Luego confirma con el usuario:
- **¿Empezamos con la homepage?** (default: sí)
- **¿Qué viewport priorizamos?** desktop / mobile / ambos (default: ambos)

No hagas más preguntas. Lanza el pipeline.

---

## Paso 2 — Auto-instalación de dependencias

Antes de empezar, asegúrate de tener el entorno listo. Avisa al usuario:

> Preparando herramientas (Playwright, Sharp, Pixelmatch). Tarda ~30 segundos la primera vez.

Crea el proyecto base si no existe:

```bash
pnpm create next-app@latest replica --typescript --tailwind --app --use-pnpm --src-dir=false --import-alias="@/*" --eslint
cd replica
pnpm add playwright sharp pixelmatch pngjs ssim.js cheerio framer-motion lucide-react clsx tailwind-merge
pnpm add -D @types/pixelmatch @types/pngjs
pnpm exec playwright install chromium
```

Si Next.js ya existe, salta a instalar solo lo que falte.

Si pnpm no está disponible, fallback a npm sin bloquear el flujo:
```bash
npm install -g pnpm || npm install
```

---

## Paso 3 — Crawling inteligente de página actual (si hay URL)

Crea `scripts/crawl.ts` y ejecútalo **solo para la página actual**. Debe:

1. Abrir la URL específica con Playwright (headless: false en primera pasada).
2. `page.waitForLoadState('networkidle')` + `waitForTimeout(2000)` para lazy loading.
3. Scroll automático en pasos de 800px hasta el final, para forzar imágenes lazy.
4. Capturar screenshots full-page en tres breakpoints:
   - desktop: 1440×900
   - tablet: 768×1024
   - mobile: 375×812
5. Descargar todos los assets **reutilizables entre páginas**:
   - imágenes globales (logo, navbar background, etc.) → `public/images/shared/`
   - imágenes específicas de esta página → `public/images/pages/{pagename}/`
   - SVGs inline → guardar como archivos
   - fuentes (parsear `@font-face` y URLs) → `public/fonts/` (descarga una sola vez, reutiliza)
   - iconos (Lucide, Heroicons, custom SVG)
6. Extraer del DOM:
   - HTML estructurado completo
   - `getComputedStyle` de cada nodo significativo → JSON con tokens
   - Animaciones detectadas
7. Detectar el framework original

Output del crawler en `references/pages/{pagename}/`:
```
references/
├── pages/
│   └── home/              ← o 'index' para /
│       ├── screenshots/
│       │   ├── desktop.png
│       │   ├── tablet.png
│       │   └── mobile.png
│       ├── assets/        ← assets específicos de esta página
│       │   ├── images/
│       │   └── svgs/
│       ├── dom.html
│       ├── computed-styles.json
│       └── design-tokens.json  ← tokens de esta página (para comparar)
├── shared-assets/         ← assets compartidos entre páginas (navbar, footer, logo)
│   ├── images/
│   ├── fonts/
│   └── icons/
└── site-map.json          ← descargado en Paso 1b
```

**Reutilización entre páginas**: si el usuario genera homepage y luego /about:
- Navbar, Footer, colores globales, tipografía → **reutilizar** (no re-descargar)
- Assets específicos de /about → descargar solo nuevos

Si el input es solo screenshot/HTML, salta el crawling.

---

## Paso 3.5 — Inspección de interactividad (obligatoria antes de analizar)

**Por qué este paso existe:** un PNG estático es ciego a carruseles, animaciones scroll-triggered, hover states, acordeones y modales. Sin este paso, los analysts del Paso 4 inventan grids estáticos donde el original tiene sliders. El orchestrator **NO puede pasar al Paso 4 sin los 4 sub-outputs de abajo**.

### 3.5.a — Grep estructural del DOM guardado

Crea `scripts/detect-interactivity.ts` y ejecútalo sobre `references/pages/{page}/dom.html`. Debe buscar:

```ts
const SIGNATURES = {
  carousels: [
    /\bswiper(-container|-slide|-wrapper|-scrollbar)?\b/i,
    /\bslick(-slide|-track|-list)?\b/i,
    /\bglide(__slide|__track)?\b/i,
    /\bembla__(slide|container|viewport)\b/i,
    /\bsplide__(slide|track|list)\b/i,
    /\bkeen-slider(__slide)?\b/i,
    /\bcarousel-(item|inner|cell)\b/i,
    /class="[^"]*slider[^"]*"/i,
  ],
  animations: [
    /data-animation="[^"]+"/g,
    /data-aos="[^"]+"/g,
    /data-scroll="[^"]+"/g,
    /class="[^"]*\b(wow|fade-in|fade-up|reveal|animate__)[^"]*"/i,
    /IntersectionObserver/i,
    /requestAnimationFrame/i,
  ],
  accordions: [/aria-expanded="(true|false)"/g, /class="[^"]*accordion[^"]*"/i, /<details/g],
  modals: [/role="dialog"/g, /aria-modal="true"/g, /class="[^"]*(modal|lightbox|overlay)[^"]*"/i],
  sticky: [/position:\s*sticky/g, /position:\s*fixed/g],
};
```

Output: `references/pages/{page}/interactivity.json` con matches agrupados por categoría y sección (usando el bbox del DOM para mapear cada match a una sección del Paso 4).

### 3.5.b — Inspección dinámica con Playwright (live state)

Antes de cerrar la página en el crawler, agrega:

```ts
const interactiveData = await page.evaluate(() => ({
  swiperInstances: Array.from(document.querySelectorAll('.swiper, [class*="swiper"]'))
    .map(el => ({
      selector: el.className,
      slideCount: el.querySelectorAll('.swiper-slide').length,
      bbox: el.getBoundingClientRect(),
    })),
  animatedElements: Array.from(document.querySelectorAll('[style*="transform"], [data-animation]'))
    .slice(0, 50)
    .map(el => ({
      tag: el.tagName,
      cls: el.className,
      transform: getComputedStyle(el).transform,
      animation: getComputedStyle(el).animation,
      transition: getComputedStyle(el).transition,
    })),
  observersHinted: !!window.IntersectionObserver &&
                    document.querySelectorAll('[data-animation], [data-aos]').length,
}));
fs.writeFileSync(path.join(ROOT, 'dynamic-state.json'), JSON.stringify(interactiveData, null, 2));
```

### 3.5.c — Captura multi-frame de carruseles

Por cada item en `swiperInstances` (o equivalente para otras libs):
1. `page.evaluate(el => el.scrollIntoView({ block: 'center' }), elementHandle)`
2. Captura frame inicial → `references/pages/{page}/carousels/section-{i}-frame-0.png`
3. Dispara `next` 3-5 veces: click en `.swiper-button-next` (o equivalente), o si no existe, swipe simulado con `page.mouse`
4. Captura frame por cada slide visible
5. Output JSON: `carousels/section-{i}.json` con `slideCount, slidesVisible, gap, hasArrows, hasDots, hasScrollbar, dragEnabled`

Esto permite que los analysts vean **todos los slides**, no solo el visible.

### 3.5.d — Captura de hover states

Para cada selector relevante (`button`, `a.cta`, `.card`, `.project-item`, `nav a`), hover y captura el delta (no full-page, solo el bbox del elemento + 40px de padding). Output: `references/pages/{page}/hover-states/{selector-hash}.png` + JSON con cambios de computed style detectados (color, transform, box-shadow, etc.).

### Resumen de outputs obligatorios antes del Paso 4

```
references/pages/{page}/
├── interactivity.json        ← 3.5.a (grep DOM signatures)
├── dynamic-state.json        ← 3.5.b (Playwright live state)
├── carousels/
│   ├── section-0.json
│   ├── section-0-frame-0.png
│   └── section-0-frame-N.png
└── hover-states/
    └── {selector-hash}.png + .json
```

Si alguno falta, **log explícito y reintenta**. No skipear.

---

## Paso 4 — Reverse engineering visual ⚡ Paralelizable

Lanza **5 analyst agents en paralelo** (un único mensaje con 5 llamadas a `Agent`). Cada uno escribe SU archivo exclusivo en `analysis/`:

| Agente | Output exclusivo | Foco de análisis |
|---|---|---|
| `layout-analyst` | `analysis/layout.md` | grids, containers, columns, gutters, spacing system, breakpoints, z-index |
| `design-analyst` | `analysis/design.md` | paleta hex exacta, gradientes (dirección + stops), sombras, radius, glassmorphism/neumorphism, overlays |
| `typography-analyst` | `analysis/typography.md` | font-families con fallback, escala h1→p, weights, line-heights, tracking |
| `component-classifier` | `analysis/components.md` | lista ordenada de secciones (navbar, hero, features, pricing, faq, footer…) con tipo + región (bbox en píxeles del screenshot) |
| `motion-analyst` | `analysis/motion.md` + `analysis/motion.json` | Lee `interactivity.json` + `dynamic-state.json` + `carousels/` + `hover-states/`. Para cada signature detectada en 3.5.a, identifica: (a) qué sección de `components.md` la usa, (b) librería original (Swiper/AOS/Framer/CSS), (c) reemplazo en stack Next (Embla para carruseles, framer-motion `whileInView` para fade-ins, Radix para accordions/dialogs). **PROHIBIDO** devolver "no se detectaron animaciones" si `interactivity.json` tiene matches. **PROHIBIDO** devolver una sección como "static grid" si está en la lista de carousels. Output JSON: `{ "carousels": [{section, library, slidesVisible, gap, drag, hasArrows, hasDots}], "scrollAnims": [{section, type, stagger, delay}], "hoverStates": [{selector, effect}], "stickyEls": [...] }` |

### Inputs comunes a todos los analysts
- `references/screenshots/desktop.png`
- `references/dom.html` (si existe)
- `references/computed-styles.json` (si existe)

### Reglas obligatorias del prompt a cada analyst
- "Solo escribe en `analysis/{tu-archivo}.md`. No toques nada más."
- "Devuelve también un JSON al final con los datos clave (para que el orchestrator mergee sin re-leer el .md)."
- "Si dudas, anota la duda en el archivo en lugar de inventar."

### Merge (orchestrator, secuencial al terminar los 5)
1. Lee los 5 outputs.
2. Genera `analysis.md` consolidado.
3. **Lock-in**: escribe `references/design-tokens.json` final con paleta, tipografía y spacing. A partir de aquí estos tokens son inmutables hasta el final.
4. Genera la lista ordenada de secciones a construir → guía del Paso 5.

---

## Paso 5 — Generación del proyecto ⚡ Paralelizable

### 5.1 Setup base (orchestrator, secuencial)

Antes de paralelizar, el orchestrator deja el terreno listo:
- Crea proyecto Next.js (Paso 2 ya lo hizo) y estructura de carpetas
- Escribe `tailwind.config.ts` con los design tokens locked
- Escribe `lib/design-tokens.ts`, `lib/utils.ts`, `lib/motion.ts`
- Escribe `app/globals.css` con fuentes (`next/font`) y resets
- Esqueleto de `app/layout.tsx` con metadata

A partir de aquí estos archivos son **read-only** para builders.

### 5.2 Builders en paralelo ⚡ (por página)

Por cada sección en `analysis/pages/{current_page}/components.md`, lanza un `section-builder` agent.

**Prompt-template para cada builder:**
```
Eres el builder de la sección "{Hero|Pricing|...}" de la página "{page_name}".

INPUTS (read-only):
- references/pages/{page_name}/screenshots/desktop.png
- references/pages/{page_name}/screenshots/mobile.png
- lib/design-tokens.ts (IMMUTABLE — no modificar)
- Lista de componentes shared: [Navbar, Footer, Container, Logo…]
- Page registry de páginas anteriores (si existen)

OUTPUT exclusivo:
- components/sections/pages/{page_name}/{SectionName}.tsx

NO toques:
- tailwind.config.ts
- lib/design-tokens.ts
- app/globals.css
- components/sections/shared/
- componentes de otras páginas
- app/layout.tsx

Reglas:
- Server Component salvo que necesites interactividad
- Imágenes con next/image → usar ruta public/images/pages/{page_name}/
- Animaciones con framer-motion
- Accesibilidad: aria-*, semántica

Devuelve JSON: { "file": "...", "page": "{page_name}", "shared_needs": ["Navbar", "Footer"] }
```

### 5.2.5 Mapeo obligatorio motion → builders (orchestrator)

El orchestrator debe leer `analysis/motion.json` y **enriquecer cada prompt de builder** con su lista específica de:
- `useCarousel: true | false` + librería (default Embla, ~3KB) + config (slidesVisible, gap, drag, arrows, dots, scrollbar)
- `useScrollAnimation: variant-name` (de `lib/motion.ts`)
- `useHoverEffect: type` (lift, glow, slide, reveal)
- `useStickyBehavior: boolean`

Si un builder NO recibe ninguno de estos pero su sección aparece en `motion.json`, **es un bug del orchestrator — abortar y revisar.**

Además: si `motion.json` lista cualquier carrusel, el orchestrator debe:
1. Instalar `embla-carousel-react embla-carousel-autoplay` **antes** de spawnear builders
2. Escribir `lib/embla-config.ts` con presets accesibles (loop, dragFree, slidesToScroll, breakpoints, keyboard nav, prefers-reduced-motion respetado) que todos los builders consuman
3. Escribir `components/ui/Carousel.tsx` como wrapper accesible (`role="region"`, `aria-roledescription="carousel"`, prev/next buttons, dots, scrollbar)

Si `motion.json` lista scroll animations, el orchestrator debe verificar que `lib/motion.ts` existe Y que el primer builder lo importa. Scaffold-sin-usar está **prohibido por la regla inviolable #2**.

### 5.3 Shared components (orchestrator, primera página)

Solo en la **primera página**:
- Extrae componentes compartidos detectados (Navbar, Footer, Logo, Container)
- Crea `components/sections/shared/{Name}.tsx`
- Congelados hasta el final (no se modifican al agregar páginas)

Para páginas posteriores: **reutiliza los shared components** existentes.

### 5.4 Registry de páginas (orchestrator, dinámico)

Crea/actualiza `lib/page-registry.ts`:

```typescript
export const pageRegistry = {
  home: {
    route: '/',
    sections: [Hero, Features, Pricing, CTA],
  },
  about: {
    route: '/about',
    sections: [AboutHero, Mission, Team],
  },
  // Se agrega aquí cada página nueva
};

export function getPageSections(slug: string) {
  return pageRegistry[slug as keyof typeof pageRegistry]?.sections || [];
}
```

### 5.5 Actualizar rutas (orchestrator)

**Primera página**: `app/page.tsx` (importa secciones de home)

```tsx
import { pageRegistry } from '@/lib/page-registry';

export default function Home() {
  const sections = pageRegistry.home.sections;
  return <>{sections.map(Section => <Section key={Section.id} />)}</>;
}
```

**Páginas posteriores**: `app/[slug]/page.tsx` (dinámico)

```tsx
import { pageRegistry } from '@/lib/page-registry';

export default function Page({ params }: { params: { slug: string } }) {
  const sections = pageRegistry[params.slug as keyof typeof pageRegistry]?.sections;
  if (!sections) return notFound();
  return <>{sections.map(Section => <Section key={Section.id} />)}</>;
}
```

**Layout global** (`app/layout.tsx`): Navbar + Footer + metadata

```tsx
import Navbar from '@/components/sections/shared/Navbar';
import Footer from '@/components/sections/shared/Footer';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

No se toca entre páginas.

---

## Paso 5b — Estructura del proyecto (página-por-página)

Estructura adaptada para múltiples páginas:

```
app/
├── layout.tsx                    ← Navbar, Footer, metadata global
├── page.tsx                      ← Página 1 generada (ej: homepage)
├── [slug]/
│   └── page.tsx                  ← Páginas dinámicas (ej: /about, /pricing)
├── globals.css
components/
├── ui/                           ← shadcn/ui base (compartido)
├── sections/
│   ├── shared/
│   │   ├── Navbar.tsx           ← Reutilizable entre páginas
│   │   ├── Footer.tsx           ← Reutilizable entre páginas
│   │   └── Container.tsx
│   └── pages/
│       ├── home/                 ← Secciones de la página actual
│       │   ├── Hero.tsx
│       │   ├── Features.tsx
│       │   └── CTA.tsx
│       └── about/                ← Se agrega cuando replicas /about
│           ├── Mission.tsx
│           └── Team.tsx
lib/
├── utils.ts
├── motion.ts
└── design-tokens.ts              ← Global, se congela tras página 1
public/
├── images/
│   ├── shared/                   ← Logo, navbar backgrounds, etc.
│   └── pages/
│       ├── home/
│       ├── about/
│       └── pricing/              ← Se agrega cuando replicas esa página
├── fonts/                        ← Global (descargado una vez)
└── icons/
types/
styles/
```

**Clave**: `app/[slug]/page.tsx` es un **catch-all dinámico** que importa los componentes de cada página según la ruta:

```tsx
// app/[slug]/page.tsx
import { getPageSections } from '@/lib/page-registry';

export default function Page({ params }: { params: { slug: string } }) {
  const sections = getPageSections(params.slug);
  return <>{sections.map(Section => <Section key={Section.id} />)}</>;
}
```

Esto permite agregar páginas sin modificar `app/layout.tsx`.

### Reglas de código

- **TypeScript estricto** — `strict: true` en tsconfig
- **Atomic components** — cada sección es un componente; cada componente reutilizable vive en `components/ui` o `components/shared`
- **Sin inline styles** salvo cuando sea estrictamente necesario (transformaciones dinámicas)
- **Tailwind con design tokens** — extender `tailwind.config.ts` con la paleta exacta extraída
- **Framer Motion** para animaciones — variantes reusables en `lib/motion.ts`
- **Accesibilidad** — `aria-*`, semántica correcta, contraste AAA donde sea posible
- **Next/Image** para todas las imágenes con `priority` solo en hero
- **Server Components por defecto**, `'use client'` solo donde sea necesario

Mapea cada sección detectada en el análisis a un archivo en `components/sections/` e impórtala desde `app/page.tsx`.

---

## Paso 6 — Loop autónomo de comparación ⚡ Comparators y fixers paralelizables

Este es el corazón de la skill. El loop en sí es secuencial (cada iteración depende de la anterior), pero **dentro de cada iteración** hay dos fases paralelas masivas.

### Estructura de una iteración

```
[orchestrator] capture screenshots (3 viewports en paralelo via Playwright contexts)
       ↓
[3 comparators en paralelo ⚡] desktop, tablet, mobile → diff regions + fixes sugeridos
       ↓
[orchestrator] merge + dedup de fixes, separar shared vs por-componente
       ↓
[orchestrator] aplica fixes a recursos compartidos (tailwind, design-tokens, globals)
       ↓
[N fixers en paralelo ⚡] uno por archivo de componente afectado
       ↓
[orchestrator] update history, check threshold, check stall, decidir continuar
```

### Pseudocódigo del loop

```ts
const THRESHOLD = { desktop: 0.99, tablet: 0.97, mobile: 0.97 };
const MAX_ITERATIONS = 25;
const STALL_LIMIT = 3; // iteraciones sin mejora antes de replantear

let iteration = 0;
let lastScore = 0;
let stallCount = 0;
const history: Iteration[] = [];

while (iteration < MAX_ITERATIONS) {
  iteration++;

  // 1. Asegurar que el dev server está corriendo
  await ensureDevServer(); // pnpm dev en background si no

  // 2. Screenshot de la implementación en 3 breakpoints
  const generated = await captureImplementation();

  // 3. Comparar contra references/ usando pixelmatch + SSIM
  const scores = await compareAll(generated, references);

  // 4. Score ponderado v2 — pixelmatch ya NO es la métrica dominante
  // (pixelmatch sobre full-page miente: 1-2px de offset = millones de px "diferentes")
  const score =
    scores.pixel_per_section_avg  * 0.30 + // pixelmatch por CROP de sección (ver 6.4)
    scores.structural_fidelity    * 0.30 + // estructura, sliders, animaciones (ver 6.5)
    scores.interactivity_coverage * 0.20 + // % items de motion.json implementados
    scores.typography             * 0.10 +
    scores.spacing                * 0.10;

  history.push({ iteration, score, scores, diffMap: generated.diffMap });

  // 5. ¿Hemos terminado?
  if (passes(scores, THRESHOLD)) break;

  // 6. Anti-loop
  if (score <= lastScore + 0.005) stallCount++;
  else stallCount = 0;
  lastScore = score;

  if (stallCount >= STALL_LIMIT) {
    // Replantear: cambiar de estrategia
    await replanProblematicComponent(history);
    stallCount = 0;
    continue;
  }

  // 7. Auto-prompt de corrección a partir del diff map
  const corrections = await generateCorrectionPrompt(scores, generated.diffMap);
  await applyCorrections(corrections);
}
```

### 6.4 — Pixelmatch por sección (no full-page)

Comparar full-page con pixelmatch da scores artificialmente bajos: cualquier diferencia de 1-2px en altura total se compounding a millones de píxeles "diferentes". En su lugar:

1. Para cada sección de `components.md`, recortar tanto el screenshot de referencia como el generado usando el bbox de la sección (`sharp.extract`).
2. Resizear ambos crops a un ancho normalizado (ej. 1200px) preservando aspect ratio.
3. Pixelmatch sobre crops. Threshold: **0.99 desktop, 0.97 tablet, 0.97 mobile** — esto sí es alcanzable.
4. Reportar score por sección para que los fixers tengan target accionable (`"Hero crop: 87% → arregla padding, ver diff-hero-desktop.png"`).

El score full-page se sigue calculando pero solo como referencia, no como gate.

### 6.5 — Structural fidelity score

Mide la coincidencia de **estructura y features** independiente de píxeles. Esta es la métrica que más pesa cuando pixelmatch miente:

```ts
function computeStructuralFidelity(generated, reference, motionJson) {
  const checks = {
    sectionCount: implemented === expected,                           // 1.0 o 0.0
    carouselsImpl: motionJson.carousels.every(c =>
                     detectInCode(c.section, /embla|swiper|carousel/i)),
    scrollAnimsImpl: motionJson.scrollAnims.every(a =>
                     detectInCode(a.section, /whileInView|motion\.|useInView/i)),
    accordionsImpl: motionJson.accordions?.every(a =>
                     detectInCode(a.section, /accordion|<details|aria-expanded/i)) ?? 1,
    hoverStatesImpl: motionJson.hoverStates.every(h =>
                     detectInCode(h.selector, /hover:|whileHover/i)),
    ariaCompleteness: countAriaAttributes(generatedDom) /
                      Math.max(countAriaAttributes(referenceDom), 1),
    imageCountRatio: Math.min(generatedImages.length / referenceImages.length, 1),
    internalLinksMatch: linksOverlap(generated, reference),
  };
  return Object.values(checks).reduce((a, b) => a + Number(b), 0) / Object.keys(checks).length;
}
```

**Threshold: ≥ 0.95.** Si por debajo, los fixers reciben tareas concretas (ej: "sección `FeaturedProjects` falta carrusel → ver `motion.json#carousels[1]`, usar `lib/embla-config.ts` preset `projects`").

### Comparación visual ⚡ — 3 comparator agents en paralelo

En cada iteración, lanza 3 `Agent` calls **simultáneos**, uno por breakpoint:

**Prompt-template para `comparator-{viewport}`:**
```
Eres comparator-{desktop|tablet|mobile}.

INPUTS:
- references/screenshots/{viewport}.png  (target)
- replica/.captures/{iter}/{viewport}.png (generado)
- references/iterations/{iter-1}/diff-{viewport}.png (si existe, para evitar regresiones)
- analysis/components.md (regiones de cada sección)

PROCESO:
1. Carga ambas imágenes (Sharp para resize si difieren).
2. pixelmatch threshold 0.1, includeAA true → ratio píxeles diferentes.
3. ssim.js → similitud estructural.
4. Genera diff-{viewport}.png con áreas rojas.
5. Segmenta el diff cruzándolo con las regiones de components.md → identifica qué sección/es son las problemáticas.

OUTPUT exclusivo (JSON):
{
  "viewport": "desktop",
  "scores": {
    "pixel_similarity": 0.94,
    "ssim": 0.96,
    "layout_accuracy": 0.92,
    "typography_accuracy": 0.89,
    "spacing_accuracy": 0.95
  },
  "diff_regions": [
    {"component": "Navbar", "file": "components/sections/Navbar.tsx",
     "severity": 0.3, "issue": "padding-top 12px menos que referencia"},
    ...
  ],
  "fixes": [
    {"file": "components/sections/Navbar.tsx",
     "change": "pt-3 → pt-5",
     "rationale": "referencia muestra ~20px de gap superior"},
    {"file": "lib/design-tokens.ts",
     "change": "primary #6366F1 → #4F46E5"}
  ]
}

NO toques código fuente, solo genera el JSON y el diff PNG.
```

### Merge + dedup de fixes (orchestrator)

1. Recibe los 3 JSON de los comparators.
2. Agrupa fixes por `file`.
3. **Conflictos**: si dos viewports proponen cambios contradictorios al mismo archivo, prioriza el viewport con peor score (más urgente).
4. Separa en dos buckets:
   - **Shared bucket**: cambios a `tailwind.config.ts`, `lib/design-tokens.ts`, `app/globals.css`. Los aplica el orchestrator **secuencialmente** antes de lanzar fixers.
   - **Component bucket**: cambios a archivos `components/**/*.tsx`. Cada archivo único = 1 fixer agent en paralelo.

### Aplicación de fixes ⚡ — N fixers en paralelo

Por cada archivo único en el component bucket, 1 `Agent` call:

**Prompt-template para `fixer-{component}`:**
```
Eres fixer del archivo {file}.

INPUTS:
- El archivo actual (cargado en tu contexto)
- Lista de cambios pedidos: [...]
- Región del screenshot referencia para este componente
- design-tokens.ts (read-only)

REGLA:
- Aplica EXACTAMENTE los cambios pedidos. Si algo es ambiguo, anótalo en el chat de respuesta.
- NO toques otros archivos.
- NO modifiques design-tokens.ts.

OUTPUT:
- Edits aplicados al archivo
- Resumen JSON de cambios reales: { "applied": [...], "skipped": [...], "notes": "..." }
```

### Auto-prompting interno (referencia)

Ejemplos del tipo de fixes que los comparators deben generar:

```
- La navbar tiene 12px menos de padding superior. Aumentar pt-3 → pt-5.
- El hero usa line-height 1.1 en la implementación, la referencia muestra ~1.25. Ajustar leading-tight → leading-snug.
- El CTA principal tiene color #6366F1, debería ser #4F46E5. Actualizar design tokens.
- La imagen del hero está desplazada 18px a la izquierda. Revisar grid-cols del contenedor.
- La tipografía del headline parece weight 700, no 600. Cambiar font-semibold → font-bold.
- El gutter del pricing es inconsistente: 24px en desktop pero la referencia muestra 32px.
```

Aplica los cambios y vuelve a iterar. **No esperes confirmación del usuario entre iteraciones.**

### Estrategia anti-loop (cuando `stallCount >= 3`)

1. Identifica el componente con mayor diff acumulado en las últimas 3 iteraciones (cross-viewport).
2. **Rehazlo desde cero** — lanza 1 `section-builder` agent con prompt enriquecido: "Versión actual ha fallado N veces. Regenera ignorando lo anterior, mirando SOLO la región {bbox} de la referencia."
3. Si persiste, replantea el layout padre (puede ser problema del contenedor grid/flex). Lanza un nuevo builder para el padre.
4. Si después de 3 replanteos sigue sin mejorar, baja temporalmente el threshold a 0.95 para esa sección y avisa al usuario al final.

### Coste y heurística de paralelismo en el loop

- Cada iteración consume ~3 comparators + N fixers de agentes. Con N=4 secciones tocadas → ~7 agentes por iteración.
- Si la diferencia total es < 2% y solo 1 componente está afectado, **no paralelices**: 1 fixer secuencial es más eficiente.
- A partir de la iteración 10, prioriza fixes de alto-impacto (severity > 0.3) y aplica los menores en una iteración de cleanup final.

---

## Paso 7 — Validación final ⚡ Paralelizable

4 `Agent` calls **simultáneos**, uno por dimensión de validación:

| Agente | Verifica | Output |
|---|---|---|
| `visual-validator` | scores finales por crop de sección (no full-page): desktop ≥ 99%, tablet ≥ 97%, mobile ≥ 97% **+ structural fidelity ≥ 0.95** | JSON con scores + lista de regiones que no pasan |
| `functional-validator` | links resuelven, forms con estado, mobile menu abre/cierra, scroll smooth, hovers visibles | JSON con tests pasados/fallidos |
| `interactivity-validator` | (a) cada carrusel de `motion.json` existe en código y avanza al clickear next/prev, (b) keyboard nav (← →) funciona en cada slider, (c) drag con mouse funciona, (d) `prefers-reduced-motion` desactiva animaciones, (e) cada animación de `motion.json` se dispara al hacer scroll (verificar con `page.evaluate` + `IntersectionObserver` o capturando frame antes/después), (f) **scaffold check**: cada archivo en `lib/` es importado por al menos un componente (grep). Si no, listar como bug bloqueante. | JSON con tests pasados/fallidos por sección + lista de scaffolds huérfanos |
| `lighthouse-validator` | Lighthouse: Performance / A11y / Best Practices / SEO > 90 | JSON con las 4 métricas + recomendaciones específicas |

### Merge y corrección final (orchestrator)

1. Si los 3 pasan → éxito, ir a Paso 8.
2. Si alguno falla, los outputs ya contienen `fixes` accionables. Aplica con la misma lógica que el Paso 6:
   - Shared bucket primero (secuencial)
   - Component bucket en paralelo (N fixers)
3. Re-ejecuta los 3 validators en paralelo.
4. Máx 3 ciclos de validación. Si tras 3 ciclos algo sigue fallando, documéntalo en el resumen final.

### Correcciones típicas de Lighthouse
- imágenes → Next/Image con `sizes` correctos
- fuentes → `next/font` con `display: swap`
- JS → lazy load secciones below-the-fold via `dynamic()`

---

## Paso 8 — Presentar resultado & ofrecer siguiente página

Al terminar **la página actual**, muestra:

```
✅ Página completada en {N} iteraciones

📊 Scores finales (página actual: {page_name})
  Desktop:  99.2%
  Tablet:   97.8%
  Mobile:   97.4%
  Lighthouse: 94 / 96 / 92 / 100

📂 Proyecto en: replica/
   ├── app/{page_route}/page.tsx
   ├── components/sections/...
   └── Navbar & Footer compartidos

🚀 Cómo ver
   cd replica && pnpm dev

📸 Comparativa: replica/references/pages/{page_name}/final-diff.html

⚠️  Notas
  - {cualquier sección que quedó por debajo del threshold}
```

Luego, **analiza los enlaces de navegación detectados** en Paso 1b y ofrece:

```
🔗 ¿Cuál es la próxima página?

Basándome en la navegación principal, sugerencias en orden de importancia:

1️⃣  /about
    → Probablemente reutiliza Navbar + Footer de homepage
    → Complejidad media (hero + texto + CTA)
    → Tiempo estimado: 8-15 min

2️⃣  /pricing
    → Navbar + Footer compartidos
    → Complejidad alta (tabla de pricing, comparación)
    → Tiempo estimado: 12-20 min

3️⃣  /contact
    → Navbar + Footer compartidos
    → Complejidad baja (form + mapa)
    → Tiempo estimado: 6-10 min

4️⃣  /blog
    → Layout diferente (grid de posts)
    → Complejidad media
    → Tiempo estimado: 10-18 min

O mándame otra URL/screenshot/HTML si quieres una página que no está en la navbar.
```

**Opciones del usuario**:
- `Siguiente: /about` → reinicia el loop desde Paso 2 con esa URL
- `Siguiente: https://ejemplo.com/custom-page` → cambia de dominio si quiere
- `Editar primero` → te deja editar la página actual antes de avanzar
- `Listo` → termina aquí (proyecto queda con la página actual)

**Al cambiar de página**:
- Reusa `shared-assets/` (navbar, footer, colores, tipografía)
- Solo crawlea + genera componentes nuevos de la página
- **Design tokens globales se congelan** (paleta, spacing, tipografía)
- Si la página nueva usa colores/estilos diferentes, documéntalo y pregunta si expandir tokens

No muestres precios sugeridos ni consejos de venta.

---

## Reglas que la skill nunca debe romper

1. **No inventes contenido** — usa el copy real del HTML/screenshot. Si una imagen no se puede descargar, usa placeholder visible con dimensiones correctas, nunca relleno random.
2. **No simplifiques el diseño** — si la referencia tiene un detalle complejo (glassmorphism, gradiente animado), replícalo aunque tarde más.
3. **No detengas el loop por iteraciones largas** — solo por threshold cumplido o por anti-loop agotado.
4. **No commitees** sin permiso explícito del usuario.
5. **No uses posicionamiento absoluto** salvo overlays / modales / decoraciones puntuales.
6. **No dupliques componentes** — extrae a `components/shared` en cuanto haya dos usos.
7. **No reducir un carrusel a un grid estático.** Si `motion.json` detecta una sección como slider, ES un slider en la réplica. Cero excepciones.
8. **No scaffold sin cablear.** Cada archivo creado en `lib/` debe ser importado en al menos un componente, o se elimina. Verificar en Paso 7 (`interactivity-validator`).
9. **No reportar éxito si `structural_fidelity < 0.95`.** El pixelmatch puede mentir; la estructura no. Reportar éxito con structural<0.95 es el mismo bug que reportar tests rotos como verdes.
10. **No usar "ahorrar tokens / contexto" como razón para skipear un paso.** El plan se compacta automáticamente — la fidelidad no se recupera. Si te encuentras pensando "ya tengo los datos, hago el análisis a mano", estás violando la regla inviolable #1.

---

## Tips de implementación

- Para fuentes custom no resolubles, usa la más cercana de Google Fonts y déjalo anotado.
- Para vídeos de fondo, descarga el archivo solo si es < 10MB; si no, usa poster + autoplay con fallback.
- Para animaciones complejas, replica primero la estructura; los micro-detalles de motion se afinan en las últimas iteraciones.
- Para sitios con i18n, replica solo el idioma de la URL pasada.
- Si detectas un sitio React/Next/Vue, intenta descargar el bundle solo como referencia de design tokens, nunca para copiar código.

---

## Modo producción

El proyecto generado debe:
- Correr en Vercel sin tocar nada (`vercel deploy` funciona out of the box)
- Ser SSR-friendly (componentes async solo donde tiene sentido)
- SEO completo: `metadata` en `layout.tsx` con OG tags inferidos del original
- `robots.ts` y `sitemap.ts` generados
- `next.config.ts` con `images.remotePatterns` para los dominios de la referencia si se usa enlace en vez de descarga