# Guía completa — VisionLoop Site Replicator (modo página-por-página)

## Requisitos previos

### Sistema
- **Windows 10+**, **macOS 10.15+**, o **Linux**
- **Node.js 20.0 o superior** → descargar desde [nodejs.org](https://nodejs.org)
- **~600 MB libres** en disco

### Software
- **Claude Code** (descarga desde [claude.ai/code](https://claude.ai/code))
- **VSCode** (opcional, para editar el código generado)
- **pnpm** (opcional pero recomendado: `npm install -g pnpm`)

---

## Instalación en Claude Code

### Opción A — Directa (solo este proyecto)

1. **Abre la carpeta**
   ```bash
   cd kit-visionloop-replicator
   claude
   ```

2. **Escribe cualquier cosa**
   ```
   Replica https://linear.app
   ```

Claude detecta automáticamente todas las páginas y empieza a generar homepage.

### Opción B — Global (en todos tus proyectos)

1. Copia `visionloop-replicator.md` desde `.claude/skills/`

2. Pégalo en tu carpeta global:
   ```bash
   # Windows
   C:\Users\{TuUsuario}\.claude\skills\visionloop-replicator.md

   # macOS/Linux
   ~/.claude/skills/visionloop-replicator.md
   ```

3. Reinicia Claude Code

4. Ahora en cualquier proyecto:
   ```
   Usa la skill visionloop-replicator para replicar https://ejemplo.com
   ```

---

## Flujo paso a paso

### PASO 1: Envía URL

```
Replica https://linear.app
```

Claude **automáticamente**:
- Abre la URL con Playwright
- Analiza la navbar
- Detecta páginas disponibles
- Pregunta si empezamos con homepage

### PASO 2: Claude genera homepage (8-20 min)

Claude ejecuta automáticamente:

1. **Crawling** — descarga screenshots, assets, HTML
2. **Análisis** — 5 analysts en paralelo (layout, design, typography, components, motion)
3. **Generación** — N builders generan componentes
4. **Loop iterativo** — compara, detecta diferencias, se corrige
5. **Validación** — visual + funcional + Lighthouse en paralelo

Al terminar:

```
✅ HOMEPAGE COMPLETADA EN 12 ITERACIONES

📊 Scores finales
  Desktop:  99.2%
  Tablet:   97.8%
  Mobile:   97.3%
  Lighthouse: 94 / 96 / 92 / 100

📂 Proyecto en: replica/
  ├── app/page.tsx (homepage)
  ├── app/layout.tsx (Navbar + Footer)
  ├── components/sections/shared/ (Navbar, Footer)
  ├── components/sections/pages/home/ (Hero, Features, CTA)
  ├── lib/design-tokens.ts (CONGELADO)
  └── lib/page-registry.ts
```

### PASO 3: Claude sugiere siguiente página

Al terminar, Claude analiza la navbar y propone:

```
🔗 ¿Cuál es la próxima página?

Detecté en la navegación:

1️⃣  /about
    → Reutiliza Navbar + Footer
    → Complejidad media (hero + texto + team)
    → Tiempo estimado: 8-15 min

2️⃣  /pricing
    → Reutiliza Navbar + Footer
    → Complejidad alta (tabla pricing, comparación)
    → Tiempo estimado: 12-20 min

3️⃣  /blog
    → Reutiliza Navbar + Footer
    → Complejidad media (grid posts)
    → Tiempo estimado: 10-18 min

4️⃣  /docs
    → Reutiliza Navbar + Footer
    → Complejidad media (sidebar + contenido)
    → Tiempo estimado: 9-16 min

O mándame otra URL/screenshot/HTML
```

### PASO 4: Elige qué hacer (3 opciones)

#### OPCIÓN A: Continuar con siguiente página
```
Siguiente: /about
```

Claude genera `/about`:
- **Reutiliza**: Navbar + Footer + design tokens + public/images/shared/
- **Genera nuevo**: componentes específicos de /about
- **Sin discrepancias**: design tokens congelados
- **Itera**: hasta ≥99% / 97% similitud

Tiempo: 8-15 minutos

Luego vuelve a ofrecer siguiente página.

#### OPCIÓN B: Editar antes de pasar a siguiente
```
Editar primero
```

Abre VSCode y edita la página actual:

```bash
cd replica
code .
pnpm dev

# Edita lo que necesites:
# - components/sections/pages/home/Hero.tsx
# - lib/design-tokens.ts (si necesitas cambiar colores)
# - tailwind.config.ts (si necesitas más breakpoints)
# 
# Los cambios se ven en tiempo real (hot reload)
```

Cuando termines de editar:
```
Siguiente: /about
```

Claude genera `/about` con tus cambios ya aplicados.

#### OPCIÓN C: Terminar aquí
```
Listo
```

El proyecto queda listo con las páginas generadas. Puedes:
- `cd replica && pnpm dev` para ver en local
- `cd replica && npx vercel` para deployar a Vercel
- Editar manualmente en VSCode
- Agregar más páginas tú mismo después

---

## Instalación en VSCode (para editar código)

Una vez que Claude generó `replica/`:

```bash
cd replica
code .
```

### Levanta el dev server
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Edita libremente
- `app/page.tsx` — estructura de homepage
- `app/[slug]/page.tsx` — rutas dinámicas para otras páginas
- `components/sections/shared/` — Navbar, Footer (reutilizables)
- `components/sections/pages/home/` — Hero, Features, CTA, etc.
- `lib/design-tokens.ts` — colores, tipografías, spacing
- `tailwind.config.ts` — Tailwind config

Los cambios se ven al guardar (hot reload).

---

## Estructura de carpetas (evoluciona)

### Después de homepage

```
replica/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── [slug]/page.tsx       ← Dinámico para futuras páginas
│   ├── layout.tsx            ← Navbar + Footer (global)
│   └── globals.css
├── components/sections/
│   ├── shared/
│   │   ├── Navbar.tsx        ← COMPARTIDO
│   │   └── Footer.tsx        ← COMPARTIDO
│   └── pages/
│       └── home/
│           ├── Hero.tsx
│           ├── Features.tsx
│           └── CTA.tsx
├── lib/
│   ├── page-registry.ts      ← { home: {...} }
│   ├── design-tokens.ts      ← CONGELADO
│   └── utils.ts
├── public/images/
│   ├── shared/               ← logo, etc.
│   └── pages/home/
└── package.json
```

### Después de agregar /about

```
components/sections/pages/
├── home/
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── CTA.tsx
└── about/               ← NUEVA CARPETA
    ├── AboutHero.tsx
    ├── Team.tsx
    └── Values.tsx

lib/page-registry.ts
→ { home: {...}, about: {...} }

public/images/pages/
├── home/
└── about/              ← NUEVA CARPETA

app/[slug]/page.tsx atiende automáticamente /about
```

---

## Tiempo estimado

| Elemento | Tiempo |
|---|---|
| Homepage (primera) | 8-20 min |
| Página típica (/about, /pricing) | 8-18 min |
| Página compleja (multisección) | 12-25 min |
| **Sitio completo (5 páginas)** | **50-120 min** |

Puedes hacerlo en varias sesiones sin perder progreso.

---

## Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "El dev server no arranca"
```bash
# Verifica que el puerto 3000 está libre
lsof -i :3000           # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Si algo está en el puerto, usa otro
pnpm dev --port 3001
```

### "Playwright install falla"
```bash
npx playwright install chromium --with-deps
```

### "Claude genera una página mal"
Tras 3 iteraciones sin mejora, Claude rehace el componente desde cero. Si sigue mal:
1. Pide "Editar primero"
2. Edita manualmente el componente problemático en VSCode
3. Pide "Siguiente: /about" para pasar a otra página
4. No pierdes el progreso de la página anterior

### "Lighthouse no llega a 90 en una página"
```
Optimiza lighthouse de esta página
```

Claude aplica fixes automáticas (Next/Image, fuentes, lazy loading, etc.)

### "¿Pierdo progreso si me equivoco?"

No. Cada página está en su carpeta independiente:
- `components/sections/pages/home/` — aislada
- `components/sections/pages/about/` — aislada
- `public/images/pages/home/` — aislada
- `public/images/pages/about/` — aislada

Puedes regenerar una página sin afectar otras.

### "Quiero agregar más páginas manualmente después"

La arquitectura está lista para ello. Crea:

```
components/sections/pages/contact/
├── ContactHero.tsx
├── ContactForm.tsx
└── ContactInfo.tsx
```

Actualiza `lib/page-registry.ts`:

```ts
export const pageRegistry = {
  home: { route: '/', sections: [...] },
  about: { route: '/about', sections: [...] },
  contact: { route: '/contact', sections: [Navbar, ContactHero, ContactForm, ContactInfo, Footer] },
};
```

Listo. `app/[slug]/page.tsx` atiende automáticamente `/contact`.

---

## Deploy a Vercel

### Opción 1: Deploy después de generar todo

```bash
cd replica
npx vercel
```

Sigue los prompts. Tu sitio estará en `{proyecto}.vercel.app` en 1 minuto.

### Opción 2: Deploy progresivo (mientras terminas otras páginas)

```bash
# Después de generar homepage
cd replica
npx vercel
# Sitio en vivo con homepage

# Luego generas /about
# Cambios se detectan automáticamente

npx vercel
# Sitio actualizado con homepage + about
```

---

## FAQ

**P: ¿Necesito instalar nada manual?**
R: No. La skill auto-instala Playwright, Sharp, Pixelmatch, etc.

**P: ¿Cómo edito componentes después?**
R: `cd replica && code .`, edita, `pnpm dev` para ver cambios.

**P: ¿Cuáles son los design tokens?**
R: `lib/design-tokens.ts` contiene colores, tipografías, spacing. Se congelan tras homepage.

**P: ¿Puedo cambiar colores entre páginas?**
R: No. Design tokens están congelados para evitar discrepancias. Si una página necesita colores diferentes, Claude lo detecta y avisa.

**P: ¿Qué pasa si fallo en una página?**
R: Cada página es independiente. Puedes regenerarla sin afectar otras.

**P: ¿Cómo agrego página nueva manualmente?**
R: Crea `components/sections/pages/{page}/`, actualiza `lib/page-registry.ts`.

**P: ¿Funciona offline después de generado?**
R: Sí. El proyecto funciona offline una vez descargados los assets. Internet solo se necesita para el crawling inicial.

---

## Reglas importantes

1. **Design tokens congelados** — se establece con homepage, no cambian
2. **Navbar + Footer compartidos** — se reutilizan sin modificar
3. **Sin inventar contenido** — usa copy real del sitio original
4. **No simplificamos design** — glassmorphism, gradientes, todo se replica
5. **Reutilización de assets** — images/shared/ se descarga una sola vez

---

## Soporte

Si algo no funciona:

1. Verifica Node.js ≥20: `node -v`
2. Limpia e reinstala:
   ```bash
   rm -rf node_modules .next
   pnpm install
   ```
3. Intenta de nuevo: `pnpm dev`
4. Si sigue fallando, pídele a Claude que debuggee el error exacto

---

**VisionLoop v2.0 — Página perfecta tras página perfecta, sin estrés.**
