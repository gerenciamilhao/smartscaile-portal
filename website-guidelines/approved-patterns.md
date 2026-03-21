# Approved Patterns — SmartScaile Portal

> Auto-gerado via `*save`. Fonte de verdade para replicar o visual do portal.
> Última atualização: 2026-03-20

## Feedback Geral

O que funcionou foi a **combinação** de todos os elementos: terminal aesthetic como fio condutor, animações sincronizadas pelo loop de 6s, minimalismo dark com crossfade suave. Nenhum elemento isolado se destaca — é o sistema inteiro que cria a experiência.

---

## Padrões Globais

### ScrollSlide Wrapper

```
Container: 1200vh (8 slides × 150vh)
Viewport: 100vh sticky
Slides: position absolute, sobrepostos
```

| Propriedade | Valor |
|-------------|-------|
| Fade-in | 30% do range (opacity 0→1, y 30→0) |
| Fade-out | 30% do range (opacity 1→0, y 0→-20) |
| Scale cap | `Math.min(window.innerHeight / 800, 1.20)` |
| isFirst | Sem fade-in (começa opaco), fade-out normal |
| isLast | Fade-in normal, sem fade-out (permanece opaco) |
| Contain | `contain: layout style paint` |
| willChange | `opacity, transform` |
| LazyContent | Monta no primeiro `isVisible`, desmonta via `display: none` |

**Regras críticas:**
1. NUNCA colocar background opaco nos slides (causa flash durante crossfade)
2. 30% overlap mínimo para entrada e saída
3. Drift máximo: 30px entrada, -20px saída
4. Background único no viewport sticky (`bg-hero-mesh`), slides transparentes

### Ranges (ProposalScroll)

| Slide | Range |
|-------|-------|
| Header | `[0.000, 0.125]` |
| Results | `[0.125, 0.250]` |
| Scale Goal | `[0.250, 0.375]` |
| CPA Goal | `[0.375, 0.500]` |
| Data Loss | `[0.500, 0.625]` |
| Opportunities | `[0.625, 0.750]` |
| Pricing | `[0.750, 0.875]` |
| CTA | `[0.875, 1.000]` |

### Tipografia

| Elemento | Font | Size | Weight | Extra |
|----------|------|------|--------|-------|
| H2 hero (slide 1) | Inter (sans) | `clamp(1.75rem, 7vw, 3rem)` | 600 | `letterSpacing: -0.02em`, `lineHeight: 1.15` |
| H2 internos (slides 2-6) | Inter (sans) | `clamp(1.35rem, 5vw, 2rem)` | 600 | `letterSpacing: -0.02em`, `lineHeight: 1.15` |
| H2 CTA (slide 8) | Inter (sans) | `clamp(1.75rem, 5.5vw, 2.4rem)` | 600 | `letterSpacing: -0.025em`, `lineHeight: 1.2` |
| Accent word | Playfair Display (serif) | inherit | inherit | `fontStyle: italic`, cor temática + `textShadow: 0 0 12px ${color}40` |
| Subtitle | Inter | `0.875rem` | 400 | `leading-relaxed`, cor `#9CA3AF` |
| Mono labels | Fira Code | `0.5rem–0.72rem` | 400-700 | `letterSpacing: 0.04em–0.14em` |
| Counter grande | Fira Code | `clamp(1.75rem, 6vw, 2.5rem)` | 600 | `tabular-nums`, `letterSpacing: -0.02em` |
| SectionBadge | Fira Code | `0.61rem` | 500 | `uppercase`, `letterSpacing: 0.14em` |

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| Teal (brand) | `#77BDAC` / `rgba(119,189,172,α)` | CTAs, accent, progress bars, positivo |
| Red (pain) | `#EF4444` / `rgba(239,68,68,α)` | Scores críticos, perda, alertas |
| Amber (warning) | `#F59E0B` / `rgba(245,158,11,α)` | Scores médios, CPA warning |
| Blue (tracking) | `#60A5FA` | Tracking score 51-89 |
| Green (success) | `#22C55E` | Lock open, confirmações |
| Text primary | `#F3F4F6` | Headlines, títulos |
| Text secondary | `#9CA3AF` | Body text, descrições |
| Text muted | `#6B7280` | Captions, meta |
| Text dark | `#374151` | Dimmed, labels menores |
| Text darker | `#27272a` | Line numbers, placeholders |
| Surface | `#0a0a0a` | Card backgrounds |
| Border subtle | `#1a1a1a` | Dividers |
| Background | `#050505` | Page background |

### Tokens (lib/tokens.ts)

```ts
timing: {
  loopDuration: 6,                          // LOOP_S
  loopTimes: [0, 0.5, 0.67, 1],            // 3s fill, 1s hold, 2s reset
}
layout: {
  contentHeight: 960,
  slideMaxWidth: 640,
  scrollHeight: '1200vh',
}
```

### macOS Window Chrome

Reutilizado em Header (terminal), Opportunities (notes), Pricing (proposta), CTA (deploy):

```
┌─ ● ● ●  filename.ext    meta ─┐
├────────────────────────────────┤
│           content              │
└────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| Dots | 8×8px, gap 6px, `#FF5F56` / `#FFBD2E` / `#27C93F`, opacity 0.65 |
| Header padding | `10px 16px` |
| Header bg | `rgba(255,255,255,0.015)` ou `#080808` |
| Header border-bottom | `1px solid rgba(255,255,255,0.04)` |
| Filename | mono `0.5rem–0.65rem`, `#374151` ou `rgba(119,189,172,0.7)` |
| Card radius | `14px` |
| Card border | `1px solid rgba(119,189,172,0.08)` |
| Card bg | `linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(5,5,5,0.88) 100%)` |
| Card shadow | `0 16px 48px rgba(0,0,0,0.5)` |

### SectionBadge

```
● LABEL
```

| Propriedade | Valor |
|-------------|-------|
| Display | `inline-flex`, center, gap `6px` |
| Padding | `6px 14px` |
| Radius | `9999px` (pill) |
| Background | `rgba(119,189,172,0.05)` |
| Border | `1px solid rgba(119,189,172,0.12)` |
| Shadow | `0 0 12px rgba(119,189,172,0.04)` + `backdrop-blur-sm` |
| Color | `rgba(119,189,172,0.85)` |
| Font | mono `0.61rem`, weight 500, `letter-spacing: 0.14em`, uppercase |
| Dot | 4px circle, `#77BDAC`, opacity 0.6, shadow `0 0 6px rgba(119,189,172,0.5)` |

### Accent Line

```
className="accent-line mb-5"
```
- `40px` width, gradient `linear-gradient(90deg, #77BDAC, rgba(119,189,172,0.1))`
- Animação de entrada: `scaleX 0→1` via `useTransform`, `transformOrigin: left`

### Top Bar Pattern (slides 2-8)

```tsx
<div className="mb-6 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="live-dot" />
    <span style={{ fontFamily: mono, fontSize: '0.6rem', color: '#6B7280' }}>
      0X / 06
    </span>
  </div>
  <SectionBadge label="..." />
</div>
```

### Footer Navigation Indicator

```tsx
<div className="flex w-full items-center gap-3">
  <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
  <motion.div animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
    <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" /></svg>
  </motion.div>
  <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
</div>
```

### Slide Spacing Pattern

| Elemento | Margin |
|----------|--------|
| Top bar → accent line | `mb-6` |
| Accent line → headline | `mb-5` |
| Headline → subtitle | `mt-2` |
| Subtitle → content | `mb-8` a `mb-10` |
| Content → footer | `mt-8` a `mt-10` |

---

## Hooks Compartilhados

### useLoopProgress

Loop rAF-driven de 6s com 4 fases, compartilhado entre slides 3, 4 e 5:

```
Phase 1 (0→0.42):    easeOutCubic — sobe
Phase 2 (0.42→0.55): hold topo — segura no máximo
Phase 3 (0.55→0.88): easeInOutCubic — desce
Phase 4 (0.88→1):    hold fundo — segura no mínimo
```

| Propriedade | Valor |
|-------------|-------|
| Throttle desktop | ~30fps (33ms) |
| Throttle mobile | ~15fps (66ms) |
| Retorna | `normalizedValue` (0→1) |
| Dependência | `easeInOutCubic` de `animation-helpers.ts` |

### useTerminalTyping

Hook de digitação char-by-char com loop, usado nos slides 1 e 8:

| Propriedade | Valor |
|-------------|-------|
| Typing speed | `25 + Math.random() * 20` ms (variação natural) |
| Hold after complete | 3000ms (default) |
| Loop | Reset all → recomeça |
| Interface | `{ text, color?, prefix?, delay? }` |
| Retorna | `{ visibleChars, activeLine, loopKey }` |

### Helpers (animation-helpers.ts)

| Helper | Uso |
|--------|-----|
| `scoreColor(v)` | `≤30 → #EF4444`, `31-50 → #F59E0B`, `>50 → #77BDAC` |
| `lerpRGB3(t, a, b, c)` | Interpolação linear 3 stops: teal(0) → amber(0.5) → red(1) |
| `renderAccentText(text, color)` | Parse `*word*` em spans serif+italic+glow |
| `easeInOutCubic(x)` | Easing function para `useLoopProgress` |
| `getServiceIconName(title)` | Map service title → Lucide icon name |

---

## Slide 1 — Header

**Componente:** `HeaderSlideContent`
**isFirst:** true (sem fade-in)
**Features:** terminal typing, 3D perspective, char-by-char loop

### Layout

```
┌── live-dot + "smartscaile."  ──  SectionBadge ──┐
│ accent-line                                      │
│ H2: "Destrave a *escala.*"                       │
│ Subtitle (max-w-480)                             │
│ Terminal (perspective 800, rotateY 8deg)          │
│ Footer arrow + dividers                          │
│ Mouse scroll indicator                           │
└──────────────────────────────────────────────────┘
```

### Terminal 3D

| Propriedade | Valor |
|-------------|-------|
| Perspective | `800` |
| Transform | `rotateY(8deg) rotateX(1deg)` |
| Transform origin | `left center` |
| Max width | `520px` |
| Font size | `clamp(0.45rem, 1.3vw, 0.65rem)` |

### Terminal Lines

```
$ stape audit --domain pre-especializacao.com.br    (#6B7280)
  conectando...                                      (#4B5563)
  score geral ················ XX/100                 (dynamic via scoreColor)
  analytics ·················· XX/100                 (#77BDAC)
  ads tracking ··············· XX/100                 (#77BDAC)
  cookie lifetime ············ XX/100                 (dynamic)
  page speed ················· XX/100                 (#77BDAC)
  server-side (CAPI) ········ not detected           (#EF4444)
  data loss estimado ········ ~30-40%                (#EF4444)
! resultado: intervenção necessária                  (#F59E0B)
```

### Mouse Scroll Indicator

| Propriedade | Valor |
|-------------|-------|
| Container | 18×28px, border `1px solid rgba(119,189,172,0.25)`, radius 9 |
| Dot | 3×5px, radius 2, `#77BDAC` |
| Animation | `y: [2, 10, 2]`, `opacity: [1, 0, 1]`, 1.8s infinite |

---

## Slide 2 — Results

**Componente:** `ResultsSlideContent`
**Features:** score ring loop, sub-scores minimal, stape diagnostic

### Score Ring

| Propriedade | Valor |
|-------------|-------|
| Size | 180px |
| Stroke | 8px |
| Track | `rgba(255,255,255,0.04)` |
| Arc | `scoreColor(score)` dinâmico |
| Stroke linecap | `round` |
| Loop | `strokeDashoffset: [circ, filledOffset, filledOffset, circ]` |
| Timing | `duration: 6s`, `times: [0, 0.5, 0.67, 1]`, `ease: [0.16, 1, 0.3, 1]` |

### Ring Center

| Elemento | Estilo |
|----------|--------|
| Label "Overall score" | mono `0.5rem`, `#6B7280`, uppercase, `letterSpacing: 0.08em` |
| Score number | serif `3rem`, weight 700, `scoreColor(score)` |
| "/100" | mono `0.65rem`, `#6B7280` |
| Breathing glow | `textShadow` pulse 3s: `16px→28px→16px`, cor dinâmica |

### Status Badge (abaixo do ring)

| Propriedade | Valor |
|-------------|-------|
| Padding | `5px 14px` |
| Radius | 20 |
| Background | `${scoreColor}10` |
| Border | `1px solid ${scoreColor}20` |
| Dot | 5px, pulse `scale: [1, 1.3, 1]` 1.8s |
| Label | mono `0.55rem`, weight 600, uppercase, `letterSpacing: 0.1em` |
| Labels | "Crítico" (≤30), "Atenção" (31-50), "Bom" (>50) |

### Sub-Score Cards

| Propriedade | Valor |
|-------------|-------|
| Layout | icon (13px, opacity 0.6) + label (mono 0.65rem, #9CA3AF) + score (mono 0.85rem, bold) |
| Progress bar | 2px height, gradient `${clr}30 → ${clr}`, glow `0 0 6px ${clr}25` |
| Bar loop | Mesmo timing do ring com `delay: index * 0.15` |
| Separator | `1px rgba(255,255,255,0.03)` |
| Container | `maxWidth: 280px` |
| Padding | `12px 0` por item |
| Stagger entrada scroll | Offset 0.04 entre cada sub-score |

### Layout Geral

```
[Ring 180px + Status Badge] ← gap: 48px → [Sub-scores maxWidth 280]
```

---

## Slide 3 — Scale Goal

**Componente:** `ScaleGoalSlide`
**Features:** synced counter + bar, context pills, useLoopProgress

### Counter

```tsx
R$ 3.000 → 100.000 /dia
```

| Propriedade | Valor |
|-------------|-------|
| "R$" | mono `0.75rem`, `#4B5563`, weight 500 |
| Value | mono `clamp(1.75rem, 6vw, 2.5rem)`, weight 600, `#77BDAC`, `tabular-nums` |
| "/dia" | mono `0.6rem`, `#374151`, weight 500 |

### Progress Bar

| Propriedade | Valor |
|-------------|-------|
| Max width | `380px` |
| Height | 3px |
| Track | `rgba(255,255,255,0.04)` |
| Fill | `linear-gradient(90deg, rgba(119,189,172,0.3), #77BDAC)` |
| Width | `3 + 97 * normalizedValue`% |
| Transition | `width 50ms linear` |
| Glow | `0 0 8px rgba(119,189,172,0.15)` quando `normalizedValue > 0.1` |
| Labels | "atual" / "potencial" (mono 0.5rem, `#4B5563`) |

### Context Pills (hold-release)

```tsx
animate={{
  opacity: [0.4, 0.4, 0.85, 0.85, 0.4, 0.4],
  y: [0, 0, -3, -3, 0, 0],
}}
transition={{
  duration: 5 + i * 0.8,     // 5-8s por pill
  times: [0, 0.15, 0.3, 0.55, 0.7, 1],
  delay: i * 1.2,             // stagger
}}
```

| Propriedade | Valor |
|-------------|-------|
| Font | mono `0.55rem`, `#9CA3AF` |
| Padding | `5px 12px` |
| Radius | 20 |
| Background | `rgba(119,189,172,0.04)` |
| Border | `1px solid rgba(119,189,172,0.08)` |
| Dot | 4px, `#77BDAC`, scale `[1, 1, 1.4, 1.4, 1, 1]` |
| Labels | `['117k seguidores', 'R$297 ticket', 'Funil ativo', 'Nicho amplo']` |

---

## Slide 4 — CPA Goal

**Componente:** `CPAGoalSlide`
**Features:** tracking ring + dual counter inverse, useLoopProgress

### Tracking Ring

| Propriedade | Valor |
|-------------|-------|
| Size | 120px |
| Stroke | 6px |
| Cores | `#EF4444` (≤30) → `#F59E0B` (31-50) → `#60A5FA` (51-89) → `#77BDAC` (90+) |
| Transition | `stroke-dashoffset 50ms linear, stroke 100ms linear` |
| Label | "tracking" (mono 0.4rem, `#6B7280`, uppercase) |
| Value | serif `2rem`, weight 700 |
| "/100" | mono `0.5rem`, `#6B7280` |

### CPA Counter

```
Tracking: 31 → 100 (sobe)
CPA: R$191 → R$100 (desce — inversamente correlacionado)
```

| Propriedade | Valor |
|-------------|-------|
| "CPA médio" label | mono `0.5rem`, `#6B7280`, uppercase, `letterSpacing: 0.06em` |
| "R$" | mono `0.7rem`, `#4B5563` |
| Value | mono `clamp(1.75rem, 6vw, 2.5rem)`, weight 600, cor dinâmica |
| CPA color | `≤100 → #77BDAC`, `101-150 → #F59E0B`, `>150 → #EF4444` |

### Meta Badge

| Propriedade | Valor |
|-------------|-------|
| Padding | `5px 12px` |
| Radius | 20 |
| Background | `rgba(119,189,172,0.06)` |
| Border | `1px solid rgba(119,189,172,0.12)` |
| Border pulse | `rgba(119,189,172, 0.12→0.25→0.12)` 4s |
| Glow pulse | `boxShadow: 0→12px→0` 4s |
| Dot | 4px, `#77BDAC`, scale `[1, 1.3, 1]` 2.5s |
| Labels | "meta" + "R$100" (mono 0.5rem/0.7rem, `#77BDAC`) |

### Warning Pills (amber)

| Propriedade | Valor |
|-------------|-------|
| Color | `#D97706` |
| Dot | `#F59E0B` |
| Background | `rgba(245,158,11,0.04)` |
| Border | `1px solid rgba(245,158,11,0.12)` |
| Animation | Mesma hold-release (6 keyframes, stagger 1.2s) |
| Labels | `['30-40% invisível', 'Score XX/100', 'Pixel desatualizado']` |

### Layout

```
[Tracking Ring 120px] ← gap: 32px → [CPA Counter + Meta Badge (column, gap 16)]
```

---

## Slide 5 — Data Loss

**Componente:** `DataLossSlide`
**Features:** loss calculator, lerpRGB3, split bar, useLoopProgress

### Loss Calculator Ledger

| Propriedade | Valor |
|-------------|-------|
| Max width | `300px` |
| Font | mono, `tabular-nums` |

### Rows

| Row | Label | Value | Estilo |
|-----|-------|-------|--------|
| Row 1 | "investimento/dia" | "R$4.000" | mono 0.55rem `#4B5563` / 0.7rem `#6B7280` fw400 |
| Row 2 | "perda estimada" | "-R$X" | mono 0.55rem/0.7rem, cor via `lerpRGB3`, fw500 |
| Row 3 | "perda/mês" | "R$X" | `clamp(1rem, 3.5vw, 1.25rem)`, fw600, cor `lossColor` |

### Split Bar

```
[████████ visível ████][███ perdido ███]
```

| Propriedade | Valor |
|-------------|-------|
| Height | 2px |
| Teal side | `width: ${100 - 30 * normalizedValue}%`, gradient teal 0.2→0.5 |
| Loss side | `width: ${30 * normalizedValue}%`, gradient `lossRgba(0.6→0.2)` |
| Transition | `width 50ms linear` |
| Labels | "visível" / "perdido" (mono 0.4rem, opacity 0.4) |

### lerpRGB3 Color Stops

```
t=0:   [119, 189, 172]  → teal (no loss)
t=0.5: [245, 158, 11]   → amber (moderate)
t=1:   [239, 68, 68]    → red (max loss)
```

### Row 3 — Hero (perda/mês)

| Propriedade | Valor |
|-------------|-------|
| Dot | 3px, cor `lossRgba(0.6 + 0.4 * normalizedValue)` |
| R$36.000 target | `formattedMonthly` com `toLocaleString('pt-BR')` |

### Danger Pills (red)

| Propriedade | Valor |
|-------------|-------|
| Color + dot | `#EF4444` |
| Background | `rgba(239,68,68,0.04)` |
| Border | `1px solid rgba(239,68,68,0.12)` |
| Labels | `['Sem CAPI', 'Cookie 1 dia', '100% client-side']` |

---

## Slide 6 — Opportunities

**Componente:** `OpportunitiesSlide`
**Features:** macOS notes container, checkbox breathing, impact dot breathing

### Notes Container

| Propriedade | Valor |
|-------------|-------|
| Radius | 14px |
| Border | `1px solid rgba(119,189,172,0.08)` |
| Background | `linear-gradient(180deg, #0c0c0c 0%, #050505 100%)` |
| Shadow | `0 12px 40px rgba(0,0,0,0.4), 0 0 1px rgba(119,189,172,0.12), inset 0 1px 0 rgba(255,255,255,0.03)` |
| Max width | `580px` |
| Filename | "implementação.md" (mono 0.65rem, `#4B5563`) |

### Header Inside

```
"O que vamos implementar"
X itens · priorizadas por impacto
```

| Propriedade | Valor |
|-------------|-------|
| Title | `1.1rem`, weight 600, `#F3F4F6` |
| Meta | mono `0.55rem`, `#374151`, dot separator 2px |

### Opportunity Card

| Propriedade | Valor |
|-------------|-------|
| Padding | `12px 18px` |
| Border bottom | `1px solid rgba(255,255,255,0.03)` |
| Checkbox | 15×15px, radius 3, border `1.5px solid rgba(119,189,172,0.15)` |
| Checkbox inner | 7×7px, radius 1.5, `#77BDAC` |
| Checkbox breathing | `borderColor: [0.15, 0.3, 0.15]` 4s, inner `scale: [0.8, 1, 0.8]` + `opacity: [0.35, 0.6, 0.35]` |
| Title | `0.85rem`, weight 500, `#E5E7EB` |
| Description | `0.75rem`, `#9CA3AF`, `marginLeft: 25px` |
| Impact dot | 5px circle, high=`#77BDAC` / medium=`#F59E0B` |
| Impact dot pulse | `scale: [1, 1.3, 1]`, `opacity: [0.4, 0.7, 0.4]`, glow `0→6px→0` 3s |
| Stagger delay | `index * 0.8` (checkbox), `index * 0.6` (impact dot) |

### Scroll-driven stagger (card entry)

```
c0: [t(0.20), t(0.36)] → offset entre cards: 0.03
c1: [t(0.23), t(0.39)]
c2: [t(0.26), t(0.42)]
c3: [t(0.29), t(0.45)]
c4: [t(0.32), t(0.48)]
```

---

## Slide 7 — Pricing

**Componente:** `PricingSlide`
**Features:** pricing card compact, macOS chrome, floating logos, inline discount

### O que funcionou
- Service rows compactas: icon 20×20, padding `6px 12px`, title+detail inline
- Discount badge inline com "SEM JUROS" na mesma linha
- maxWidth 620 (mais largo, menos alto)
- macOS chrome com "APROVADO" badge verde
- Floating logos (GTM, Meta, Google Ads, GA4) decorativos ao redor

### Pricing Card

| Propriedade | Valor |
|-------------|-------|
| Radius | 14px |
| Border | `1px solid rgba(119,189,172,0.15)` |
| Background | `linear-gradient(180deg, rgba(12,20,17,0.98) 0%, rgba(6,10,8,0.99) 100%)` |
| Shadow | `0 24px 50px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)` |
| Max width | `620px` |

### Chrome Header

| Propriedade | Valor |
|-------------|-------|
| Padding | `10px 18px` |
| Border bottom | `1px solid rgba(119,189,172,0.10)` |
| Background | `rgba(10,18,15,0.95)` |
| Filename | "proposta-final.md" (mono 0.65rem, `rgba(119,189,172,0.7)`) |

### "APROVADO" Badge

| Propriedade | Valor |
|-------------|-------|
| Padding | `3px 10px` |
| Radius | 99 |
| Background | `rgba(34,197,94,0.10)` |
| Border | `1px solid rgba(34,197,94,0.30)` |
| Color | `#22c55e` |
| Font | mono `0.58rem`, weight 700, `letterSpacing: 0.05em` |
| Dot pulse | 5px, `#22c55e`, `scale: [1, 1.4, 1]`, `opacity: [0.7, 1, 0.7]` 2.2s |

### Plan Name + Price

| Propriedade | Valor |
|-------------|-------|
| Plan name | mono `0.6rem`, weight 600, `rgba(119,189,172,0.65)`, `letterSpacing: 0.12em`, uppercase |
| Installments | mono `0.95rem`, weight 500, `#77BDAC` opacity 0.6 |
| Amount | mono `clamp(1.6rem, 4.5vw, 2.8rem)`, weight 700, `#77BDAC`, `letterSpacing: -0.03em` |

### Discount Row (inline)

```
[● SEM JUROS]  [desconto valor]
```

| "SEM JUROS" | Desconto |
|-------------|----------|
| pill: `5px 14px`, radius 99, mono 0.62rem, fw600 | `5px 14px`, radius 6, mono 0.65rem, fw600 |
| bg `rgba(119,189,172,0.06)`, border 0.15 | bg `rgba(119,189,172,0.08)`, border 0.20 |
| color `rgba(119,189,172,0.7)` | color `rgba(119,189,172,0.85)` |
| dot 5px `#77BDAC` opacity 0.6 | — |

### Service Rows

| Propriedade | Valor |
|-------------|-------|
| Margin bottom | 3px |
| Padding | `6px 12px` |
| Radius | 8 |
| Background | `rgba(119,189,172,0.03)` |
| Border | `1px solid rgba(119,189,172,0.06)` |
| Icon container | 20×20px, radius 6, bg `rgba(119,189,172,0.08)`, border 0.14 |
| Icon | Lucide 11px, `rgba(119,189,172,0.7)`, strokeWidth 1.5 |
| Title | `0.72rem`, `#E5E7EB`, weight 500 |
| Detail | `0.6rem`, `rgba(119,189,172,0.50)` |

### Highlight Service (último)

| Propriedade | Valor |
|-------------|-------|
| Padding | `8px 12px` |
| Radius | 8 |
| Background | `rgba(119,189,172,0.06)` |
| Border | `1px solid rgba(119,189,172,0.18)` |
| Border left | 3px solid `#77BDAC` |
| "Diferencial" label | mono `0.5rem`, weight 600, `#77BDAC` opacity 0.85, uppercase |
| Title | `0.78rem`, `#F3F4F6`, weight 600 |
| Detail | `0.62rem`, `rgba(119,189,172,0.7)` |

### Floating Logos

| Logo | Position | Animation |
|------|----------|-----------|
| GTM | top 30%, right -20 | `y: [0, -5, 0]`, rotate `[0, -2, 0]` 6s, delay 0.5 |
| Meta | top 55%, right -20 | `y: [0, -6, 0]`, rotate `[0, 3, 0]` 5.5s |
| Google Ads | top 58%, left -20 | `y: [0, -7, 0]`, rotate `[0, 4, 0]` 5s, delay 1.2 |
| GA4 | top 32%, left -20 | `y: [0, -4, 0]`, rotate `[0, -3, 0]` 7s, delay 2 |

Container: padding 8, radius 12, bg cor-específica 0.06, border 0.15, shadow `0 4px 20px cor 0.08`

### Orbs Decorativos

5 orbs com posições absolutas ao redor do card, animation `y + opacity` com durations 5-7s.

---

## Slide 8 — CTA (Proposal)

**Componente:** `CTASlideContent`
**isLast:** true (sem fade-out)
**Features:** terminal deploy typing, lock state reactive

### Lock Icon

| Propriedade | Valor |
|-------------|-------|
| Outer circle | 56×56px, radius 50%, border `1px solid ${lockColor}30`, bg `${lockColor}0A` |
| Inner circle | 40×40px, border `1px solid ${lockColor}25`, bg `${lockColor}0D` |
| Icon | SVG 20×20, strokeWidth 1.5 |
| Transition | `all 0.8s ease` |
| Shadow | `0 0 20px ${lockColor}15, 0 0 40px ${lockColor}08` |
| Lock color | `#EF4444` (closed) → `#22C55E` (open, after line 3) |

### Lock State Logic

```
LOCK_OPEN_LINE = 3  (quando "kick-off liberado" aparece)
Closed: lockColor=#EF4444, accentColor=#EF4444
Open:   lockColor=#22C55E, accentColor=#77BDAC
```

### Deploy Terminal

Mesma estrutura macOS chrome do slide 1, com:

| Propriedade | Valor |
|-------------|-------|
| Max width | `540px` |
| Title bar | "smartscaile — deploy" |
| Status dot | pulsante com `lockColor`, label "active"/"idle" |
| Typing speed | `22 + Math.random() * 18` ms |
| Blank lines | `height: 0.6em` |
| Border | transição `0.8s ease` com `accentRgba(0.12)` |

### Terminal Lines (CTA)

```
$ smartscaile deploy --client atom-traders     (#6B7280)
> 1ª parcela confirmada                        (#9CA3AF)
  verificando pagamento...                     (#4B5563)
✓ kick-off liberado                            (#22C55E) ← LOCK OPENS

  configurando server-side...                  (#4B5563)
  → GTM first-party domain                    (#77BDAC)
  → Custom Loader (antiblock)                 (#77BDAC)
  → Cookie Keeper                             (#77BDAC)
  → Dedup browser x server                    (#77BDAC)
  → Purchase via Webhook                      (#77BDAC)
  → UTM tracking & backup                     (#77BDAC)
  → First Touch + Last Touch                  (#77BDAC)

> 2ª parcela confirmada                        (#9CA3AF)
  verificando pagamento...                     (#4B5563)
✓ go live → tracking ativo                    (#22C55E)

> teste A/B pixel antigo vs novo (30 dias)     (#F59E0B)
✓ 40 dias de acompanhamento + validação       (#77BDAC)

> 3ª parcela confirmada                        (#9CA3AF)
  verificando pagamento...                     (#4B5563)
✓ estrutura validada                          (#22C55E)

! ciclo completo                               (#22C55E)
```

Loop: hold 1500ms após última linha → reset.

### CTA Button

| Propriedade | Valor |
|-------------|-------|
| Display | `inline-flex`, gap 8 |
| Font | `0.75rem` |
| Color | `accentColor` (dynamic) |
| Border | `1px solid ${accentRgba(0.25)}` |
| Radius | 10 |
| Padding | `9px 20px` |
| Transition | `all 0.6s ease` |
| Icon | `MessageCircle` 14px, strokeWidth 1.5 |
| Label | "Falar no WhatsApp" |

### Visibility Gate

O slide 8 usa `slideOpacity > 0.5` para ativar/pausar o typing (evita CPU em slide não visível).
