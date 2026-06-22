# VisionLoop Site Replicator

Sistema autónomo multi-agente para replicar sitios web **página por página** con fidelidad visual extrema (≥99% similitud, sin discrepancias).

## Comportamiento al iniciar

Cuando el usuario abra esta carpeta en Claude Code y escriba cualquier cosa, responde:

> **Bienvenido a VisionLoop Site Replicator**
>
> Soy un sistema autónomo que clona sitios web página por página con fidelidad visual extrema.
>
> Así funciona:
> 1. **Tú envías una URL** (ej: https://linear.app)
> 2. **Yo analizo la navbar** y detecto todas las páginas disponibles
> 3. **Genero la homepage perfectamente** (≥99% fidelidad)
> 4. **Congelo design tokens** (paleta, tipografía, spacing)
> 5. **Al terminar, sugiero cuál página hacer siguiente**
> 6. **Reutilizo Navbar + Footer** entre páginas (sin discrepancias)
> 7. **Repito hasta tener todas las páginas**
>
> **Resultado:** sitio multi-página perfecto, sin inconsistencias, listo para Vercel.
>
> **¿Qué URL quieres replicar?**
>
> Puedo trabajar con:
> 1. **URL del sitio** — crawleo, descargo assets, capturo screenshots (lo más fiel)
> 2. **Screenshot full-page** (PNG/JPG/WebP) — analizo la imagen
> 3. **HTML completo** — parseo el DOM
>
> Mándame la URL. Replico página por página, no todas a la vez.

Después usa la skill `visionloop-replicator` automáticamente y lanza el pipeline.

## Qué genera (página-por-página)

### Primera página (ej: homepage)
- **Carpeta `replica/app/`** — página 1 (page.tsx) + layout global (layout.tsx)
- **Carpeta `components/sections/shared/`** — Navbar, Footer (se reutilizan entre páginas)
- **Carpeta `components/sections/pages/home/`** — componentes específicos de homepage
- **Carpeta `lib/`** — design-tokens.ts (CONGELADO), page-registry.ts
- **Carpeta `public/images/shared/`** — logo, assets globales (descargados una sola vez)
- **Carpeta `public/images/pages/home/`** — assets específicos de homepage
- **Carpeta `references/pages/home/`** — screenshots y análisis de la página
- **Lighthouse ≥ 90** en las 4 métricas

### Segunda página en adelante (ej: /about, /pricing)
- **Carpeta `components/sections/pages/{page}/`** — solo componentes nuevos de esa página
- **Carpeta `public/images/pages/{page}/`** — solo assets de esa página
- **Reuso automático:** Navbar + Footer + design tokens + images/shared/
- **Sin discrepancias:** design tokens están congelados
- **Actualización:** lib/page-registry.ts se actualiza con la nueva página

## Requisitos mínimos

- **Node.js 20+** (verificar: `node -v`)
- **pnpm** o npm (la skill instala automáticamente si falta)
- **~600 MB libres** en disco (Next.js + assets + node_modules)

**La skill auto-instala todo lo demás** (Playwright, Sharp, Pixelmatch, etc.) la primera vez (~30 segundos).

## Stack generado

- **Next.js 15** (App Router)
- **React 19** (Server Components por defecto)
- **TypeScript** (strict: true)
- **Tailwind CSS** (con design tokens extraídos de la referencia)
- **Framer Motion** (animaciones)
- **shadcn/ui** (componentes base)
- **Lucide Icons** (iconografía)
- **Next/Image** (optimización automática)

## Características principales

### Por página
✅ **Fidelidad ≥99%** — cada página se genera hasta superar threshold
✅ **Loop autónomo** — se corrige sola automáticamente
✅ **Sin discrepancias** — design tokens congelados, componentes shared reutilizables
✅ **Sugerencias inteligentes** — detecta navbar y propone próxima página
✅ **Edición intermedia** — puedes editar entre páginas sin afectar otras

### Por iteración (cada página)
✅ **5 analysts en paralelo** — diseccionan layout, design, typography, componentes, motion
✅ **N builders paralelos** — generan secciones específicas de la página
✅ **3 comparators paralelos** — desktop/tablet/mobile en cada iteración
✅ **N fixers paralelos** — aplican correcciones por componente
✅ **Anti-loop inteligente** — regenéra desde cero tras 3 iter sin mejora
✅ **Validación multi-dimensión** — visual + funcional + Lighthouse paralelo

### General
✅ **Assets auto-descargados** — imágenes, SVGs, fuentes, iconos
✅ **Responsive perfecto** — 3 breakpoints validados
✅ **Production-ready** — deploy a Vercel sin cambios
✅ **Arquitectura modular** — app/[slug]/page.tsx atiende todas las páginas

## Flujo típico de uso

### Paso 1: Abre el kit en Claude Code
```bash
cd kit-visionloop-replicator
claude
```

### Paso 2: Envía una URL
En el chat:
```
Replica https://linear.app
```

Claude detecta automáticamente todas las páginas en la navbar.

### Paso 3: Claude genera homepage
- Analiza, genera, itera automáticamente
- Congela design tokens
- **Tiempo: 8-20 min**

### Paso 4: Claude sugiere siguiente página
```
✅ Homepage lista.

Próximas páginas sugeridas:
  1️⃣  /about (8-15 min)
  2️⃣  /pricing (12-20 min)
  3️⃣  /blog (10-18 min)

¿Cuál quieres hacer siguiente?
```

### Paso 5: Tú eliges (3 opciones)

**A) Continuar con otra página:**
```
Siguiente: /about
```
Claude genera /about reutilizando Navbar + Footer + design tokens.

**B) Editar primero:**
```
Editar primero
```
Abre VSCode, edita la homepage, luego:
```bash
cd replica && code .
pnpm dev
# ... edita ... 
# Luego en Claude: "Siguiente: /about"
```

**C) Terminar:**
```
Listo
```
El proyecto queda con las páginas hechas, listo para deployar.

### Paso 6: Repetir hasta tener todas las páginas

Cada página genera → sugiere siguiente → repite.

### Paso 7: Deploy a Vercel
```bash
cd replica
npx vercel
```

Listo en 1 minuto. La arquitectura `app/[slug]/page.tsx` atiende todas las rutas dinámicamente.

## No necesitas

- ❌ Instalar Playwright manualmente (la skill lo hace)
- ❌ Configurar Tailwind (está preconfigurado con design tokens)
- ❌ Escribir componentes — la skill los genera
- ❌ Optimizar imágenes — Next/Image lo hace
- ❌ Hacer iteraciones a mano — el loop autónomo lo hace

## Tiempo estimado (por página)

- **Homepage:** 8-20 min
- **Página típica (/about, /pricing, /blog):** 8-18 min
- **Página compleja (multisección):** 12-25 min

**Sitio completo (5 páginas):** 50-120 minutos total
(pero puedes hacerlo en varias sesiones sin perder progreso)

Cada página itera hasta superar ≥99% desktop / 97% mobile.

## Soporte rápido

**"El loop se queda atascado en una página"** → Tras 3 iteraciones sin mejora, Claude rehace el componente desde cero. Si sigue mal, documenta y avisa. Puedes editar manualmente después.

**"Quiero editar antes de pasar a la siguiente página"** → Pide "Editar primero", abre `cd replica && code .`, modifica lo que necesites, luego "Siguiente: /about".

**"Lighthouse de una página no llega a 90"** → Pide: "optimiza lighthouse de esta página" y Claude aplica correcciones.

**"¿Pierdo progreso si cambio de página?"** → No. El proyecto queda intacto. Cada página se genera en su carpeta específica. Puedes volver a generar otra página después.

**"Quiero deployar mientras termino otras páginas"** → `cd replica && npx vercel`. Las rutas dinámicas atienden todas las páginas (hechas y futuras).

**"Quiero agregar una página manualmente después"** → Crea `components/sections/pages/{page}/` con tus componentes, actualiza `lib/page-registry.ts`, listo. La arquitectura está preparada.
