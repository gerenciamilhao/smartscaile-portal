# SmartScaile LP — Design System & Style Guide

## Color Tokens

### Brand (Teal)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-teal` | `#77BDAC` | Primary brand, CTAs, headings accent |
| `--color-teal-dim` | `#5fa695` | Hover states |
| `--color-teal-muted` | `rgba(119,189,172,0.15)` | Subtle fills, backgrounds |
| `--color-teal-border` | `rgba(119,189,172,0.3)` | Border accents |

### Dark Surfaces
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#050505` | Page background |
| `--color-surface` | `#0d0d0d` | Card surfaces, elevated areas |
| `--color-elevated` | `#111111` | Icon containers, elevated cards |
| `--color-card-dark` | `#0a0a0a` | Card backgrounds |

### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-base` | `#F3F4F6` | Primary text, headings |
| `--color-text-secondary` | `#9CA3AF` | Body text, descriptions |
| `--color-text-muted` | `#6B7280` | Captions, meta text |
| `#4B5563` | — | Dimmed text, placeholders |
| `#3B3B3B` | — | Very subtle text |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-subtle` | `#1a1a1a` | Card borders, dividers |
| `--color-border-default` | `#27272a` | Default borders |

### Pain Theme (Red) — NEW
| Token | Value | Usage |
|-------|-------|-------|
| `--color-pain-red` | `#EF4444` | Primary pain red |
| `--color-pain-dim` | `#DC2626` | Hover/active state |
| `--color-pain-muted` | `rgba(239,68,68,0.15)` | Subtle fills |
| `--color-pain-border` | `rgba(239,68,68,0.3)` | Pain borders |
| `--color-pain-bg` | `#0a0505` | Pain hero background |

---

## Typography

### Font Families
- **Sans:** Inter (--font-inter) — Body, UI elements, badges
- **Serif:** Playfair Display (--font-playfair) — Headings (h1, h2), stat values
- **Mono:** Fira Code / Cascadia Code — Code blocks, event names, terminal UI

### Scale
| Element | Size | Weight | Font |
|---------|------|--------|------|
| H1 (Hero) | `clamp(2.4rem, 9vw, 3.75rem)` | 700 | Playfair |
| H2 (Section) | `clamp(1.75rem, 6vw, 2.5rem)` | 700 | Playfair |
| H3 (Card title) | `1.25rem` / `0.875rem` | 600-700 | Inter |
| Body | `0.875rem` – `1rem` | 400 | Inter |
| Caption | `0.75rem` | 400-500 | Inter |
| Badge | `0.7rem` | 500 | Inter |
| Mono small | `0.65rem` – `0.72rem` | 400-700 | Fira Code |

---

## Spacing System

| Element | Value |
|---------|-------|
| Section padding (top/bottom) | `80px` |
| Section max-width | `800px` |
| Section heading margin-bottom | `48px` |
| Card padding | `20px` – `24px` |
| Card border-radius | `16px` – `24px` |
| Badge margin-bottom | `16px` |
| Grid gap | `12px` – `16px` |
| Page horizontal padding | `20px` |

---

## Card Patterns

### Terminal Card
```
┌─────────────────────────────┐
│ ● ● ●  filename.js   meta  │ ← Header: dots + monospace filename
├─────────────────────────────┤
│                             │ ← Content area
│                             │
└─────────────────────────────┘
```
- Border-radius: `16px`
- Border: `1px solid #27272a` (default) or teal variant
- Background: `#0a0a0a`
- Header bg: `#080808`
- Header border-bottom: `1px solid #1a1a1a`
- Traffic light dots: `#FF5F56`, `#FFBD2E`, `#27C93F` (8-10px)

### Info Card
- Border-radius: `16px`
- Border: `1px solid #1a1a1a`
- Background: `#0a0a0a`
- Padding: `20px`
- Hover: border transitions to `rgba(119,189,172,0.25)`, bg to `#0d0d0d`

---

## Button Variants

### Primary (Teal Solid)
- Background: `#77BDAC`
- Color: `#050505`
- Border-radius: `12px`
- Padding: `14px 32px` (hero) / `12px 24px` (section)
- Font-weight: 600
- Hover: bg `#5fa695`
- Shadow: `.shadow-teal`

### Secondary (Outline)
- Background: transparent
- Color: `#77BDAC`
- Border: `1px solid rgba(119,189,172,0.3)`
- Hover: border `0.6 opacity`, bg `rgba(119,189,172,0.08)`

---

## Section Badge Pattern
```html
<div class="badge">LABEL</div>
```
- Display: `inline-flex`
- Padding: `4px 12px`
- Border-radius: `9999px` (pill)
- Background: `rgba(119,189,172,0.06)`
- Border: `1px solid rgba(119,189,172,0.12)`
- Color: `#77BDAC`
- Font: `0.7rem`, weight 500, `letter-spacing: 0.1em`, `text-transform: uppercase`

---

## Motion Patterns

### Easing
- Primary: `[0.16, 1, 0.3, 1]` (custom spring-like)
- Secondary: `easeOut`

### Entry Animations
| Pattern | Initial | Animate | Duration |
|---------|---------|---------|----------|
| FadeUp | `opacity:0, y:24` | `opacity:1, y:0` | 0.6s |
| FadeIn | `opacity:0` | `opacity:1` | 0.5s |
| StaggerItem | `opacity:0, y:20` | `opacity:1, y:0` | 0.5s |
| Scale In | `opacity:0, scale:0.9` | `opacity:1, scale:1` | 0.5s |

### Stagger
- Delay between items: `0.07s`
- Viewport trigger: `once: true, amount: 0.05`

### FadeUpSection (sections dentro do stickyBoundaryRef)
```tsx
initial={{ opacity: 0, y: 56 }}    // y: 56 — mais pronunciado (entra pelo gap de baixo)
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: false, amount: 0.12 }}  // repete ao scrollar; activa com 12% visível
transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
```

### Keyframe Animations
| Name | Duration | Usage |
|------|----------|-------|
| `border-pulse` | 3s infinite | Animated card borders |
| `glow-pulse` | 3s infinite | Pulsing box shadows |
| `live-pulse` | 1.5s infinite | Live indicator dots |
| `float-y` | 3.5s infinite | Floating elements |
| `shimmer` | 4s infinite | Gradient text shimmer |
| `ticker-scroll` | 32s linear | Horizontal ticker |
| `pulse-pain` | 2s infinite | **NEW** Pain hero pulsing |
| `blocked-flash` | 1.5s infinite | **NEW** Blocked event flash |

---

## Background Effects

### Hero Mesh
```css
.bg-hero-mesh {
  radial-gradient(ellipse 100% 70% at 50% -10%, rgba(119,189,172,0.07)),
  radial-gradient(ellipse 60% 40% at 90% 90%, rgba(119,189,172,0.04)),
  #050505;
}
```

### Dot Grid
```css
.bg-mesh-subtle {
  background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
  background-size: 28px 28px;
}
```

### Ambient Glows
- Teal: `rgba(119,189,172,0.05)`, blur `60px`, 256-384px circles
- Pain Red: `rgba(239,68,68,0.06)`, blur `80px`

---

## Section Rhythm

### Single Canvas Architecture
Todas as sections partilham UM background aplicado no wrapper da página:
- **Wrapper:** `bg-hero-mesh` — **SEM** `background-attachment: fixed` (causa linhas de divisão visíveis)
- **Todas as sections:** `background: transparent`
- **Sem backgrounds alternados** — ritmo visual vem do padding vertical + FadeUp

Ver `website-guidelines/layout-architecture.md` para spec completo.

### Separação entre Sections
- **Padding vertical:** `80px` top e bottom em cada section
- **Animação de entrada:** FadeUp (`opacity:0, y:24` → `opacity:1, y:0`) no viewport
- **Sem section-line dividers**
- **Sem alternância `#050505` / `#0d0d0d`**

---

## Icon System

- Library: **Lucide React** (`lucide-react`)
- Size: `16px` (cards), `14px` (badges), `9px` (inline)
- Stroke width: `1.5` – `2`
- Color: `#77BDAC` (teal), `#25D366` (WhatsApp), `#EF4444` (pain)
- Container: `40px` box, radius `10px`, bg `#111`, border `1px solid #1f1f1f`

---

---

## Padrão: Mini Balloon Pills

Pequenas pills flutuantes acima de cards com tail CSS triangular apontando para cima.
- Background: `#0d0d0d` (teal hero) / `#0a0505` (pain hero)
- Border animada via **boxShadow pulse**: `['0 0 0 1px rgba(cor,0.15)', '0 0 0 1px rgba(cor,0.4)', ...]`
- Tail UP (border): `borderBottom: '6px solid rgba(cor,0.2)'`, `top: -7px`
- Tail UP (fill): `borderBottom: '5px solid bgColor'`, `top: -4px`
- Padding: `5px 10px`, borderRadius: `10px`, icon size `9px`

---

## Padrão: "Lights Going Out" (State Transition)

Para badges clicáveis que disparam troca de estado:
- **Dot:** Framer Motion `backgroundColor` (NÃO `background` shorthand), green → gray, `duration: 0.35s`
- **Badge:** CSS `transition` com `delay: 0.2s` — dot apaga primeiro, badge segue
- Cinza: `color: #4B5563`, border `rgba(75,85,99,0.25)`, bg `rgba(75,85,99,0.04)`
- **CRÍTICO:** `background` shorthand não anima no Framer Motion — usar sempre `backgroundColor`

---

## Padrão: Floating Accent Badge (Decorativo)

Badge absoluto flutuando sobre o elemento pai como acento visual:
- Wrapper pai: `position: relative`
- Rotação: **apenas 2D** `rotate(Ndeg)` — perspective 3D causa distorção visual
- Típico: `top: -22px, right: -18px, transform: rotate(20deg)`, padding `5px`, radius `8px`
- `pointerEvents: 'none'` obrigatório

---

## Framer Motion + CSS Transform

Quando `motion.div` precisa de transform CSS fixo (não animado pelo FM):
- **Não funciona:** `style={{ transform: 'perspective(...)' }}` em motion.div
- **Solução:** `transform` numa `<div>` filha normal dentro do `motion.div`

---

## Counter Badges — Valor Inicial

Iniciar em `9-11` para transmitir atividade em curso (nunca 0 ou 1).

---

## Ticker

- Animação contínua: `32s linear infinite`, sem pause on hover
- Mask lateral: `linear-gradient(to right, transparent, black 12%, black 88%, transparent)`

---

---

## Padrão: 3D Tilt Card (Video Player)

Card com perspectiva 3D leve e hover suave — usar para media embeds, mockups, screenshots:
- Idle: `transform: perspective(900px) rotateY(-4deg) rotateX(3deg)`
- Hover: `rotateY(-2deg) rotateX(1deg) scale(1.01)` com `transition: 0.4s ease`
- Shadow: `20px 20px 60px rgba(0,0,0,0.5), -4px -4px 20px rgba(0,0,0,0.25)`
- Teal glow idle: `0 0 40px rgba(119,189,172,0.04)` — hover: `0.08`
- `transformOrigin: 'center center'`
- **CRÍTICO:** `transform` CSS em `<div>` filha de `motion.div` — não misturar com FM transforms

---

## Padrão: Play Button com Pulse Ring

Para placeholders de vídeo:
```tsx
// Anel pulsante
animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', border: '1px solid rgba(119,189,172,0.3)' }}

// Botão principal
animate={{ scale: [1, 1.08, 1] }}
transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
// 72×72px, border: '2px solid rgba(119,189,172,0.3)', bg: 'rgba(119,189,172,0.1)'
```

---

---

## Padrão: Scroll-Driven Section Entry (stickyBoundaryRef)

Para sections dentro do `stickyBoundaryRef`, o spacer de `30vh` posiciona o conteúdo para aparecer no gap abaixo do sticky player:

```
gap_visível ≈ 30vh  (= 100vh - 65px - VideoSection 70vh)
spacer = 30vh  →  section entra em scrollYProgress = 0 (player começa a encolher)
scroll_range = Σ(minHeight das sections)
```

Cada section: envolver em `<FadeUpSection>` (ver Motion Patterns acima).

---

## Padrão: Scroll-Driven Overlay Sync (EMQ Panel)

Para painéis que devem sincronizar visibilidade com um elemento que escala via scroll:

```tsx
// Fade + scale sincronizados com o fim do shrink do player (scrollYProgress = 0.5)
const opacity = useTransform(scrollYProgress, [0.05, 0.50, 0.65, 0.82], [0, 1, 1, 0]);
const scale   = useTransform(scrollYProgress, [0.05, 0.50, 0.65, 0.82], [0.93, 1, 1, 0.96]);

// MarginTop dinâmico: compensa dead space do CSS scale (transformOrigin: top)
const marginTop = useTransform(playerScale, (s) => {
  const innerWidth = Math.min(800, window.innerWidth) - 40;
  const videoHeight = (innerWidth * 9) / 16;
  return GAP_PX - videoHeight * (1 - s);  // GAP_PX = 64
});
```

**Keyframe pattern:** `[start_fade, sync_point, hold_end, fade_out]`
- `start_fade`: quando o elemento mãe começa a mudar (≈ 0.05)
- `sync_point`: full visibility sincronizado com o fim do efeito mãe (= 0.50)
- `hold_end` / `fade_out`: tempo de exposição antes de sair (0.65 / 0.82)

---

---

## Padrão: Scroll Slide Crossfade (Proposal Slides)

Sistema de slides cinematográficos sobrepostos dentro de viewport sticky, controlados via `scrollYProgress`.

### Arquitetura
```
Container tall (750vh) → viewport sticky (100vh) → slides absolute sobrepostos
```
- **Background único**: `bg-hero-mesh` no viewport sticky. Slides são **transparentes** (sem background)
- **Ambient glow persistente**: Elemento fixo (z-index 0) no viewport sticky com radial gradients teal. Cria continuidade visual entre slides

### Transição entre slides
```tsx
// ScrollSlide.tsx
const inEnd    = start + span * 0.30; // 30% do range para fade-in
const outStart = end - span * 0.30;   // 30% do range para fade-out

// Entrada: opacity 0→1, y 30→0
// Saída: opacity 1→0, y 0→-20
// isLast: sem fade-out
```

### Regras CRÍTICAS
1. **NUNCA** colocar `background` opaco nos slides — causa "flash" escuro durante crossfade
2. **30% overlap mínimo** para entrada e saída — valores menores criam corte visível
3. **Drift sutil**: max 30px entrada, max -20px saída — mais que isso distrai
4. **Ambient glow NO viewport**, não nos slides — glows por slide criam artefatos na transição
5. **Dot grid parcial** com `mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)` para fade suave nas bordas

### Elementos decorativos por slide
- Glassmorphism cards (`.glass-card`): `backdrop-filter: blur(12px)`, border teal sutil, hover scale(1.02)
- Glass pills (`.glass-pill`): Para info badges (timeline, guarantee)
- Step numbers (`.step-number`): 20px circle, monospace, teal border
- Impact badges: `.impact-high` (teal glow), `.impact-medium` (amber glow)
- Accent line: 40px, `linear-gradient(90deg, #77BDAC, rgba(119,189,172,0.1))`
- Separator line: `linear-gradient(90deg, transparent, rgba(119,189,172,0.12) 30%, ... 70%, transparent)`
- Stagger animation: `staggerChildren: 0.07`, `delayChildren: 0.1`
- Icon pulse: `box-shadow` pulse 3s infinite
- CTA glow pulse: `box-shadow` pulse 2.5s infinite

---

## Padrão: Terminal Typing (Slide 1)

Terminal com efeito de digitação char-by-char em loop:
- **Window chrome**: 3 macOS dots (`#EF4444`, `#F59E0B`, `#22C55E`, opacity 0.65), 8px
- **Body**: glassmorphism (`backdrop-filter: blur(16px)`), bg linear gradient `rgba(12,12,12,0.92)` → `rgba(5,5,5,0.88)`
- **Border**: `1px solid rgba(119,189,172,0.08)`, radius `14px`
- **Font**: mono, `0.7rem`, `lineHeight: 1.8`
- **Line numbers**: `0.55rem`, color `#27272a`, width 20px + 12px margin
- **Bottom bar**: live dot pulsante + referência `stape.io/checker`
- **Cursor**: `▌`, blink 0.8s infinite
- **Typing speed**: 25 + random * 20ms (variação natural)
- **Loop**: todas as linhas tipadas → hold 3s → reset → recomeça
- **Fixed height**: linhas futuras renderizadas com `visibility: hidden` (evita layout shift)
- **Perspectiva 3D**: `rotateY(8deg) rotateX(1deg)`, `transformOrigin: 'left center'`, `perspective: 800`
- **Ambient glow**: `radial-gradient` atrás do terminal, blur 20px
- **Shadow**: `0 12px 40px rgba(0,0,0,0.4), 0 0 1px rgba(119,189,172,0.12), inset 0 1px 0 rgba(255,255,255,0.03)`

---

## Padrão: Score Ring Diagnostic (Slide 2)

Anel SVG animado com loop para exibir score geral:
- **Ring**: 180px, stroke 8px, `strokeLinecap: round`
- **Track**: `rgba(255,255,255,0.04)`
- **Arc**: cor dinâmica via `scoreColor(v)` — `#EF4444` (≤30), `#F59E0B` (31-50), `#77BDAC` (>50)
- **Loop timing**: `LOOP_S = 6`, `LOOP_TIMES = [0, 0.5, 0.67, 1]` — 3s fill, 1s hold, 2s smooth reset
- **Breathing glow**: synced com ring fill, `inset: -32`, blur 28px
- **Center**: "Overall score" (mono 0.5rem uppercase) + score number (serif 3rem bold) + "/100" (mono 0.65rem)
- **Status badge**: pill com pulsing dot, label dinâmico ("Crítico" / "Atenção" / "Bom")
- **Floating orbs**: 3 decorativos ao redor do ring

### Sub-scores (minimalistas)
- **Layout**: horizontal row — icon (13px, opacity 0.6) + label (mono 0.65rem) + score com `margin-left: auto`
- **Score**: mono 0.85rem bold, cor dinâmica
- **Barra de progresso**: 2px height, gradient `${clr}30` → `${clr}`, glow sutil
- **Loop**: mesmo timing do ring com delay staggered (`delay * 0.15`)
- **Separadores**: `1px rgba(255,255,255,0.03)` entre itens
- **Container**: `maxWidth: 280px`, sem background/borda (sem visual de card)
- **Padding vertical**: 12px por item

### Layout geral (Slide 2)
- Ring à esquerda + sub-scores à direita em desktop (`md:flex-row md:gap-12`)
- Stack vertical em mobile (`flex-col gap-8`)
- Gap top (headline → painel): `mb-10`
- Gap bottom (painel → footer): `mt-10`

---

## Padrão: Scroll-Driven Entry + Loop Animation

Separação clara de responsabilidades:
- **Scroll** (`useTransform`) controla **entrada** dos elementos (opacity + y drift)
- **Loop** (`animate` com `repeat: Infinity`) controla **dados visuais** (ring, bars, typing)
- Animações de dados são independentes do scroll — iniciam quando o elemento aparece e rodam indefinidamente
- Hooks rule: `useTransform` não pode ser chamado dentro de `.map()` — extrair componente próprio

---

## Padrão: Synced Counter + Scale Bar (Slide 3)

Counter numérico e barra de progresso sincronizados por uma única fonte de animação:
- **Single source**: `useLoopProgress()` hook — `requestAnimationFrame` com throttle ~30fps, retorna `normalizedValue` 0→1
- **4 fases**: up (0→0.42, easeOutCubic) → hold topo (0.42→0.55) → down (0.55→0.88, easeInOutCubic) → hold fundo (0.88→1)
- **Counter**: mono font, `tabular-nums`, `clamp(1.75rem, 6vw, 2.5rem)`, cor `#77BDAC`
- **Barra**: `max-w-[380px]`, 3px height, gradiente `rgba(119,189,172,0.3) → #77BDAC`, glow condicional
- **Barra renderizada com `<div>` inline** (`width: ${barPct}%`, `transition: width 50ms linear`) — NÃO Framer Motion `animate`
- **Labels**: "atual" / "potencial" (mono 0.5rem, `#4B5563`)
- **CRÍTICO**: Ambos derivam do mesmo `normalizedValue` — garantia de sync perfeito

### Context Pills — Hold-Release Animation
Pills com animação que sobe, segura, e volta:
```tsx
animate={{
  opacity: [0.4, 0.4, 0.85, 0.85, 0.4, 0.4],
  y: [0, 0, -3, -3, 0, 0],
}}
transition={{
  duration: 5 + i * 0.8,    // 5-8s por pill
  times: [0, 0.15, 0.3, 0.55, 0.7, 1],  // rest → ease in → hold ~25% → ease out → rest
  delay: i * 1.2,           // stagger entre pills
}}
```
- **Dot pulsante**: `scale: [1, 1, 1.4, 1.4, 1, 1]` + `opacity: [0.4, 0.4, 0.9, 0.9, 0.4, 0.4]` no mesmo timing
- **Estilo**: mono 0.55rem, `padding: 5px 12px`, border `rgba(119,189,172,0.08)`, bg `rgba(119,189,172,0.04)`

---

## Padrão: Tracking Ring + CPA Counter (Slide 4)

Ring SVG de tracking score inversamente correlacionado com counter CPA:
- **Ring**: 120px, stroke 6, `CPATrackingRing` componente isolado
- **Cores tracking**: `#EF4444` (≤30) → `#F59E0B` (31-50) → `#60A5FA` (51-89) → `#77BDAC` (90+)
- **CPA counter**: mono font, `clamp(1.75rem, 6vw, 2.5rem)`, cor dinâmica (red→amber→teal)
- **Correlação inversa**: tracking sobe (31→100) enquanto CPA desce (R$191→R$100), mesma `normalizedValue`
- **Meta badge animado**: border pulse `rgba(119,189,172, 0.12→0.25)` 4s, glow `boxShadow` 4s, dot pulsante `scale 1→1.3` 2.5s
- **Layout**: ring à esquerda + CPA counter + meta badge à direita (`flex, gap: 32`)

### Warning Pills (dados negativos)
Pills em tom amber para indicar dados de alerta:
- **Texto**: `#D97706`, **dot**: `#F59E0B`
- **Background**: `rgba(245,158,11,0.04)`, **border**: `rgba(245,158,11,0.12)`
- Mesma animação hold-release das pills teal (6 keyframes, stagger 1.2s)

---

*Extracted from Hero.tsx, PainHero.tsx, VideoSection.tsx, ScrollSlide.tsx, ProposalScroll.tsx, page.tsx, globals.css, motion.tsx — v1.7*
