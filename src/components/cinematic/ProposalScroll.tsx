'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ScrollSlide } from './ScrollSlide';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { ClientData, Opportunity, PricingPlan } from '@/lib/clients';
import { useIsMobile } from '@/lib/useIsMobile';
import {
  Target, Cookie, Zap,
  MessageCircle, ExternalLink,
  BarChart2, Activity,
} from 'lucide-react';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
}

// Ranges sequenciais dentro do 1200vh (hero ocupa 0→~0.05)
// 8 slides dividem 0.05 → 1.0 = 0.95 / 8 = ~0.12 cada
const R = {
  header:        [0.05, 0.17] as [number, number],
  results:       [0.17, 0.29] as [number, number],
  goal1:         [0.29, 0.41] as [number, number],
  goal2:         [0.41, 0.53] as [number, number],
  goal3:         [0.53, 0.65] as [number, number],
  opportunities: [0.65, 0.77] as [number, number],
  pricing:       [0.77, 0.89] as [number, number],
  proposal:      [0.89, 1.00] as [number, number],
};

// ─── Accent text helper — parses *word* into serif+glow spans ────────────────
// Usage: renderAccentText("Esse *teto* não é do mercado.", "#77BDAC")
function renderAccentText(text: string, color: string = '#77BDAC', delay: number = 0) {
  const parts = text.split(/(\*[^*]+\*)/g);
  let accentIndex = 0;
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const word = part.slice(1, -1);
      const d = delay + accentIndex * 1.6;
      accentIndex++;
      return (
        <motion.span
          key={i}
          animate={{ textShadow: [`0 0 8px ${color}20`, `0 0 20px ${color}60`, `0 0 8px ${color}20`] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: d }}
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color }}
        >{word}</motion.span>
      );
    }
    return <span key={i} style={{ whiteSpace: 'pre-line' }}>{part}</span>;
  });
}

// ─── Shared helpers ──────────────────────────────────────────────────────────
// Smooth RGB interpolation through 3 stops: a (t=0) → b (t=0.5) → c (t=1)
// Returns [r, g, b] for flexible rgba usage
function lerpRGB3(
  t: number,
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): [number, number, number] {
  const mix = (from: number, to: number, p: number) => Math.round(from + (to - from) * p);
  if (t <= 0.5) {
    const p = t / 0.5;
    return [mix(a[0], b[0], p), mix(a[1], b[1], p), mix(a[2], b[2], p)];
  }
  const p = (t - 0.5) / 0.5;
  return [mix(b[0], c[0], p), mix(b[1], c[1], p), mix(b[2], c[2], p)];
}

// ─── Shared loop hook — rAF synced with browser paint ────────────────────────
// easeInOutCubic helper
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function useLoopProgress(isMobile: boolean = false) {
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const [normalizedValue, setNormalizedValue] = useState(0);

  useEffect(() => {
    startRef.current = Date.now();
    let raf: number;
    const throttleMs = isMobile ? 66 : 33; // ~15fps mobile, ~30fps desktop
    const tick = () => {
      const now = Date.now();
      if (now - lastRef.current >= throttleMs) {
        lastRef.current = now;
        const elapsed = (now - startRef.current) % (LOOP_S * 1000);
        const progress = elapsed / (LOOP_S * 1000);

        // 4 phases: up (0→0.42), hold top (0.42→0.55), down (0.55→0.88), hold bottom (0.88→1)
        let val: number;
        if (progress < 0.42) {
          val = 1 - Math.pow(1 - progress / 0.42, 3); // easeOutCubic
        } else if (progress < 0.55) {
          val = 1;
        } else if (progress < 0.88) {
          val = 1 - easeInOutCubic((progress - 0.55) / 0.33);
        } else {
          val = 0;
        }
        setNormalizedValue(val);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  return normalizedValue;
}

export default function ProposalScroll({ scrollYProgress, clientData }: ProposalScrollProps) {
  const { client, meetings, diagnosis } = clientData;
  const firstName = client.name.split(' ')[0];
  const meetingDate = meetings[0]?.date || '';
  const formattedDate = meetingDate
    ? new Date(meetingDate + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 1 — Header
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.header} scrollYProgress={scrollYProgress} zIndex={2}>
        <div className="slide-dot-grid" />

        {/* Floating decorative orbs */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '15%', right: '12%', width: 6, height: 6,
            borderRadius: '50%', background: 'rgba(119,189,172,0.3)',
            boxShadow: '0 0 12px rgba(119,189,172,0.15)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute', bottom: '22%', left: '8%', width: 4, height: 4,
            borderRadius: '50%', background: 'rgba(119,189,172,0.25)',
            boxShadow: '0 0 8px rgba(119,189,172,0.1)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{
            position: 'absolute', top: '35%', left: '18%', width: 3, height: 3,
            borderRadius: '50%', background: 'rgba(119,189,172,0.2)',
            pointerEvents: 'none',
          }}
        />

        <HeaderSlideContent scrollYProgress={scrollYProgress} firstName={firstName} formattedDate={formattedDate} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 2 — Resultados Projetados
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.results} scrollYProgress={scrollYProgress} zIndex={3}>
        <div className="slide-dot-grid" />

        {/* Floating decorative orbs */}
        <motion.div
          animate={{ y: [0, -6, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '12%', left: '10%', width: 5, height: 5,
            borderRadius: '50%', background: 'rgba(119,189,172,0.3)',
            boxShadow: '0 0 10px rgba(119,189,172,0.12)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '18%', right: '14%', width: 4, height: 4,
            borderRadius: '50%', background: 'rgba(119,189,172,0.2)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', top: '40%', right: '8%', width: 3, height: 3,
            borderRadius: '50%', background: 'rgba(119,189,172,0.15)',
            pointerEvents: 'none',
          }}
        />

        <ResultsSlideContent scrollYProgress={scrollYProgress} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 3 — Goal 1: Escala (counter + scale bar)
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.goal1} scrollYProgress={scrollYProgress} zIndex={4}>
        <div className="slide-dot-grid" />
        <ScaleGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[0]} range={R.goal1} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 4 — Goal 2: CPA
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.goal2} scrollYProgress={scrollYProgress} zIndex={5}>
        <div className="slide-dot-grid" />
        <CPAGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[1]} range={R.goal2} trackingScore={diagnosis.stapeChecker?.scores?.overall ?? 31} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 5 — Goal 3: Dados perdidos
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.goal3} scrollYProgress={scrollYProgress} zIndex={6}>
        <div className="slide-dot-grid" />
        <DataLossSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[2]} range={R.goal3} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 6 — Implementacao / Opportunities
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.opportunities} scrollYProgress={scrollYProgress} zIndex={7}>
        <div className="slide-dot-grid" />
        <OpportunitiesSlide scrollYProgress={scrollYProgress} opportunities={diagnosis.opportunities} range={R.opportunities} />
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 7 — Investimento / Pricing
          ═══════════════════════════════════════════════════════════════════════ */}
      {diagnosis.pricing && (
        <ScrollSlide range={R.pricing} scrollYProgress={scrollYProgress} zIndex={8}>
          <div className="slide-dot-grid" />
          <PricingSlide scrollYProgress={scrollYProgress} pricing={diagnosis.pricing} range={R.pricing} />
        </ScrollSlide>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 8 — Proposta + CTA (isLast: permanece visivel, sem fade-out)
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={9} isLast>
        <div className="slide-dot-grid" />

        <div className="slide-content text-center">
          <CTASlideContent diagnosis={diagnosis} scrollYProgress={scrollYProgress} range={R.proposal} />
        </div>
      </ScrollSlide>
    </>
  );
}

// ─── Terminal typing effect ───────────────────────────────────────────────────
interface TerminalLine {
  text: string;
  color?: string;   // default: teal
  prefix?: string;  // default: '>'
  delay?: number;   // ms before this line starts
}

function TerminalTyping({ lines }: { lines: TerminalLine[] }) {
  const [visibleChars, setVisibleChars] = useState<number[]>(lines.map(() => 0));
  const [activeLine, setActiveLine] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  const resetAndLoop = useCallback(() => {
    setVisibleChars(lines.map(() => 0));
    setActiveLine(0);
    setLoopKey((k) => k + 1);
  }, [lines]);

  useEffect(() => {
    if (activeLine >= lines.length) {
      // All lines typed — hold 3s then restart
      const holdTimer = setTimeout(resetAndLoop, 3000);
      return () => clearTimeout(holdTimer);
    }

    const line = lines[activeLine];
    const fullText = `${line.prefix ?? '>'} ${line.text}`;
    const charCount = visibleChars[activeLine];

    if (charCount >= fullText.length) {
      // Line done — pause then next line
      const nextTimer = setTimeout(() => setActiveLine((a) => a + 1), line.delay ?? 120);
      return () => clearTimeout(nextTimer);
    }

    // Type next character
    const speed = 25 + Math.random() * 20; // natural variation
    const charTimer = setTimeout(() => {
      setVisibleChars((prev) => {
        const next = [...prev];
        next[activeLine] = charCount + 1;
        return next;
      });
    }, speed);
    return () => clearTimeout(charTimer);
  }, [activeLine, visibleChars, lines, loopKey, resetAndLoop]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient glow behind terminal */}
      <div style={{
        position: 'absolute', inset: -16, borderRadius: 20,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(119,189,172,0.06) 0%, transparent 60%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        borderRadius: 14,
        background: 'linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(5,5,5,0.88) 100%)',
        border: '1px solid rgba(119,189,172,0.08)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.7rem',
        lineHeight: 1.8,
        boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 1px rgba(119,189,172,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}>
        {/* Window chrome */}
        <div style={{
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.015)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', opacity: 0.65 }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', opacity: 0.65 }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', opacity: 0.65 }} />
          </div>
          <div style={{
            flex: 1, display: 'flex', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '0.5rem', color: '#374151', letterSpacing: '0.06em',
              textTransform: 'uppercase', fontWeight: 500,
            }}>
              smartscaile — audit
            </span>
          </div>
          {/* Spacer to center title */}
          <div style={{ width: 46 }} />
        </div>

        {/* Terminal body */}
        <div style={{ padding: '16px 20px' }}>
          {lines.map((line, i) => {
            const fullText = `${line.prefix ?? '>'} ${line.text}`;
            const chars = visibleChars[i];
            const notYet = i > activeLine && chars === 0;
            const displayed = fullText.slice(0, chars);
            const showCursor = i === activeLine && activeLine < lines.length;

            return (
              <div key={i} style={{
                color: line.color ?? '#77BDAC',
                height: '1.5em',
                visibility: notYet ? 'hidden' : 'visible',
                display: 'flex', alignItems: 'center',
              }}>
                {/* Line number */}
                <span style={{
                  width: 20, flexShrink: 0, textAlign: 'right', marginRight: 12,
                  color: '#27272a', fontSize: '0.55rem', userSelect: 'none',
                }}>
                  {i + 1}
                </span>
                <span>
                  {notYet ? '\u00A0' : displayed}
                  {showCursor && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ color: '#77BDAC', marginLeft: 1 }}
                    >
                      ▌
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '6px 16px',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 4, height: 4, borderRadius: '50%', background: '#77BDAC' }}
            />
            <span style={{ fontSize: '0.45rem', color: '#374151', letterSpacing: '0.05em' }}>
              live
            </span>
          </div>
          <span style={{ fontSize: '0.45rem', color: '#27272a' }}>
            stape.io/checker
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Header Slide — scroll-driven animations ─────────────────────────────────
function HeaderSlideContent({ scrollYProgress, firstName, formattedDate, diagnosis }: {
  scrollYProgress: MotionValue<number>;
  firstName: string;
  formattedDate: string;
  diagnosis: ClientData['diagnosis'];
}) {
  const s = 0.06;
  const span = 0.13;
  const t = (offset: number) => s + span * offset;

  const topBarOpacity    = useTransform(scrollYProgress, [t(0.05), t(0.20)], [0, 1]);
  const accentScaleX     = useTransform(scrollYProgress, [t(0.08), t(0.25)], [0, 1]);
  const headlineOpacity  = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const headlineY        = useTransform(scrollYProgress, [t(0.10), t(0.28)], [20, 0]);
  const subtitleOpacity  = useTransform(scrollYProgress, [t(0.16), t(0.34)], [0, 1]);
  const subtitleY        = useTransform(scrollYProgress, [t(0.16), t(0.34)], [16, 0]);
  const terminalOpacity  = useTransform(scrollYProgress, [t(0.22), t(0.40)], [0, 1]);
  const terminalY        = useTransform(scrollYProgress, [t(0.22), t(0.40)], [16, 0]);
  const footerOpacity    = useTransform(scrollYProgress, [t(0.38), t(0.52)], [0, 1]);

  // Terminal lines from diagnosis data
  const scores = diagnosis.stapeChecker?.scores;
  const terminalLines = useMemo<TerminalLine[]>(() => [
    { text: 'stape audit --domain pre-especializacao.com.br', prefix: '$', color: '#6B7280' },
    { text: 'conectando...', prefix: ' ', color: '#4B5563', delay: 300 },
    { text: `score geral ················ ${scores?.overall ?? '—'}/100`, color: scores && scores.overall <= 30 ? '#EF4444' : '#F59E0B', delay: 200 },
    { text: `analytics ·················· ${scores?.analytics ?? '—'}/100`, delay: 100 },
    { text: `ads tracking ··············· ${scores?.ads ?? '—'}/100`, delay: 100 },
    { text: `cookie lifetime ············ ${scores?.cookieLifetime ?? '—'}/100`, color: scores && scores.cookieLifetime <= 30 ? '#EF4444' : '#77BDAC', delay: 100 },
    { text: `page speed ················· ${scores?.pageSpeed ?? '—'}/100`, delay: 100 },
    { text: 'server-side (CAPI) ········ not detected', color: '#EF4444', delay: 200 },
    { text: 'data loss estimado ········ ~30-40%', color: '#EF4444', delay: 150 },
    { text: 'resultado: intervenção necessária', prefix: '!', color: '#F59E0B', delay: 400 },
  ], [scores]);

  return (
    <div className="slide-content">
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            smartscaile.
          </span>
        </div>
        <SectionBadge label={diagnosis.copy?.hero?.badge ?? 'Proposta Exclusiva'} />
      </motion.div>

      <motion.div
        style={{ scaleX: accentScaleX, transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      <motion.h2
        style={{ opacity: headlineOpacity, y: headlineY, fontFamily: 'var(--font-sans)', fontWeight: 600, lineHeight: 1.15, color: '#F3F4F6', fontSize: 'clamp(1.75rem, 7vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        {diagnosis.copy?.hero?.headline ?? 'Destrave a'}{' '}
        <span className="text-glow" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#77BDAC' }}>{diagnosis.copy?.hero?.accentWord ?? 'escala.'}</span>
      </motion.h2>

      <motion.p
        style={{ opacity: subtitleOpacity, y: subtitleY }}
        className="mt-4 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {(diagnosis.copy?.hero?.subtitle ?? '{firstName}, sua operação sustenta R$100k/dia. O tracking é o que está segurando. Montamos o plano para liberar esse potencial.').replace('{firstName}', firstName).replace('{formattedDate}', formattedDate)}
      </motion.p>

      {/* Terminal — perspective tilt from right */}
      <motion.div
        style={{
          opacity: terminalOpacity,
          y: terminalY,
          perspective: 800,
        }}
        className="mt-6"
      >
        <div style={{
          transform: 'rotateY(8deg) rotateX(1deg)',
          transformOrigin: 'left center',
          maxWidth: 520,
        }}>
          <TerminalTyping lines={terminalLines} />
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-6 flex items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[0.5rem] font-medium uppercase tracking-[0.15em] text-[#374151]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            role para continuar
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
      </motion.div>
    </div>
  );
}

// ─── CTA Slide — terminal typing + synced lock ──────────────────────────────
const CTA_LINES: TerminalLine[] = [
  { text: 'smartscaile deploy --client atom-traders', prefix: '$', color: '#6B7280' },
  { text: '1ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 500 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'kick-off liberado', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'configurando server-side...', prefix: ' ', color: '#4B5563', delay: 400 },
  { text: 'GTM first-party domain', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Custom Loader (antiblock)', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Cookie Keeper (restaura cookies apagados)', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Dedup browser x server', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Purchase via Webhook', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'UTM tracking & backup', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'First Touch + Last Touch', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: '2ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 400 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'go live → tracking ativo', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'teste A/B pixel antigo vs novo (30 dias)', prefix: '>', color: '#F59E0B', delay: 300 },
  { text: '40 dias de acompanhamento + validação', prefix: '✓', color: '#77BDAC', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: '3ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 400 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'estrutura validada', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'ciclo completo', prefix: '!', color: '#22C55E', delay: 600 },
];

// Line index where lock opens (kick-off liberado)
const LOCK_OPEN_LINE = 3;

function CTASlideContent({ diagnosis, scrollYProgress, range }: {
  diagnosis: ClientData['diagnosis'];
  scrollYProgress: MotionValue<number>;
  range: [number, number];
}) {
  const [visibleChars, setVisibleChars] = useState<number[]>(CTA_LINES.map(() => 0));
  const [activeLine, setActiveLine] = useState(0);
  const [loopKey, setLoopKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Detect slide visibility via scroll position
  const slideOpacity = useTransform(scrollYProgress, [range[0], range[0] + (range[1] - range[0]) * 0.30], [0, 1]);
  useEffect(() => {
    const unsubscribe = slideOpacity.on('change', (v) => {
      setIsVisible(v > 0.5);
    });
    return unsubscribe;
  }, [slideOpacity]);

  // Lock is open from kick-off until terminal resets (activeLine back to 0)
  const lockOpen = activeLine >= LOCK_OPEN_LINE;
  const lockColor = lockOpen ? '#22C55E' : '#EF4444';
  const accentColor = lockOpen ? '#77BDAC' : '#EF4444';
  const accentRgba = (a: number) => lockOpen ? `rgba(119,189,172,${a})` : `rgba(239,68,68,${a})`;
  const orbColor = lockOpen ? 'rgba(119,189,172,' : 'rgba(239,68,68,';

  const resetAndLoop = useCallback(() => {
    setVisibleChars(CTA_LINES.map(() => 0));
    setActiveLine(0);
    setLoopKey((k) => k + 1);
  }, []);

  useEffect(() => {
    // Only run typing when slide is visible
    if (!isVisible) return;

    if (activeLine >= CTA_LINES.length) {
      const holdTimer = setTimeout(resetAndLoop, 1500);
      return () => clearTimeout(holdTimer);
    }
    const line = CTA_LINES[activeLine];
    const fullText = `${line.prefix ?? '>'} ${line.text}`;
    const charCount = visibleChars[activeLine];
    if (charCount >= fullText.length) {
      const nextTimer = setTimeout(() => setActiveLine((a) => a + 1), line.delay ?? 120);
      return () => clearTimeout(nextTimer);
    }
    const speed = 22 + Math.random() * 18;
    const charTimer = setTimeout(() => {
      setVisibleChars((prev) => { const next = [...prev]; next[activeLine] = charCount + 1; return next; });
    }, speed);
    return () => clearTimeout(charTimer);
  }, [activeLine, visibleChars, loopKey, resetAndLoop, isVisible]);

  return (
    <>
      {/* Ambient glow — reacts to lock state */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1,
        transition: 'background 1s ease',
        background: lockOpen
          ? 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(119,189,172,0.06) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(239,68,68,0.06) 0%, transparent 70%)',
      }} />

      {/* Floating orbs — react to lock state */}
      {[
        { top: '12%', left: '4%', size: 4, dur: 7, delay: 0 },
        { top: '20%', right: '5%', size: 3, dur: 9, delay: 2 },
        { top: '75%', left: '6%', size: 5, dur: 11, delay: 3.5 },
      ].map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          animate={{ y: [0, -(orb.size + 2), 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          style={{
            position: 'absolute', top: orb.top,
            ...(orb.left ? { left: orb.left } : { right: orb.right }),
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: `${orbColor}0.3)`,
            boxShadow: `0 0 10px ${orbColor}0.12)`,
            pointerEvents: 'none',
            transition: 'background 1s ease, box-shadow 1s ease',
          }}
        />
      ))}

      {/* Lock icon — synced with terminal */}
      <div
        style={{
          width: 56, height: 56, borderRadius: '50%',
          border: `1px solid ${lockColor}30`,
          background: `${lockColor}0A`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          transition: 'all 0.8s ease',
          boxShadow: `0 0 20px ${lockColor}15, 0 0 40px ${lockColor}08`,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: `1px solid ${lockColor}25`,
          background: `${lockColor}0D`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.8s ease',
        }}>
          {lockOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.6s ease' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.6s ease' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )}
        </div>
      </div>

      {/* Headline */}
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.75rem, 5.5vw, 2.4rem)', color: '#F3F4F6', lineHeight: 1.2, letterSpacing: '-0.025em', maxWidth: 480, margin: '0 auto 10px' }}>
        {renderAccentText(diagnosis.copy?.cta?.headline ?? 'O *resultado* é a garantia.', accentColor)}
      </h2>
      <p style={{ fontSize: '0.875rem', color: lockOpen ? '#9CA3AF' : '#6B7280', lineHeight: 1.55, maxWidth: 380, margin: '0 auto 14px', transition: 'color 0.6s ease' }}>
        {diagnosis.copy?.cta?.subtitle ?? 'Teste A/B por 30 dias. Pixel antigo vs. novo. O resultado decide. Setup se paga em 2 semanas.'}
      </p>

      {/* Terminal — same style as slide 1, larger */}
      <div style={{ maxWidth: 540, margin: '0 auto 20px', textAlign: 'left' }}>
        <div style={{
          borderRadius: 14,
          background: 'linear-gradient(180deg, rgba(12,12,12,0.95) 0%, rgba(5,5,5,0.92) 100%)',
          border: `1px solid ${accentRgba(0.12)}`,
          overflow: 'hidden',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.7rem',
          lineHeight: 1.8,
          boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 1px ${accentRgba(0.15)}, inset 0 1px 0 rgba(255,255,255,0.03)`,
          transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
        }}>
          {/* Window chrome */}
          <div style={{
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.015)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', opacity: 0.65 }} />
            </div>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '0.5rem', color: '#374151', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              smartscaile — deploy
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: lockColor, transition: 'background 0.8s ease' }}
              />
              <span style={{ fontSize: '0.45rem', color: lockOpen ? '#4B5563' : '#374151', letterSpacing: '0.05em', transition: 'color 0.8s ease' }}>
                {lockOpen ? 'active' : 'idle'}
              </span>
            </div>
          </div>

          {/* Terminal body */}
          <div style={{ padding: '14px 20px' }}>
            {CTA_LINES.map((line, i) => {
              const isBlank = line.text === '';
              const fullText = isBlank ? '' : `${line.prefix ?? '>'} ${line.text}`;
              const chars = visibleChars[i];
              const notYet = i > activeLine && chars === 0;
              const displayed = fullText.slice(0, chars);
              const showCursor = i === activeLine && activeLine < CTA_LINES.length && !isBlank;

              // Blank lines = spacers (no line number, shorter height)
              if (isBlank) {
                return <div key={`${loopKey}-${i}`} style={{ height: '0.6em' }} />;
              }

              return (
                <div key={`${loopKey}-${i}`} style={{
                  color: line.color ?? '#77BDAC',
                  height: '1.55em',
                  visibility: notYet ? 'hidden' : 'visible',
                  display: 'flex', alignItems: 'center',
                }}>
                  <span style={{
                    width: 20, flexShrink: 0, textAlign: 'right', marginRight: 12,
                    color: '#1f1f1f', fontSize: '0.55rem', userSelect: 'none',
                  }}>
                    {i + 1}
                  </span>
                  <span>
                    {notYet ? '\u00A0' : displayed}
                    {showCursor && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ color: accentColor, marginLeft: 1, transition: 'color 0.8s ease' }}
                      >
                        ▌
                      </motion.span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: accentColor, border: `1px solid ${accentRgba(0.25)}`, borderRadius: 10, padding: '9px 20px', textDecoration: 'none', transition: 'all 0.6s ease' }}
      >
        <MessageCircle size={14} strokeWidth={1.5} />
        Falar no WhatsApp
      </a>

    </>
  );
}

// ─── Score color helper ──────────────────────────────────────────────────────
function scoreColor(v: number) {
  return v <= 30 ? '#EF4444' : v <= 50 ? '#F59E0B' : '#77BDAC';
}

// ─── Sub-score icons ─────────────────────────────────────────────────────────
const subScoreIcons: Record<string, React.ReactNode> = {
  'Analytics': <BarChart2 size={13} strokeWidth={1.5} />,
  'Ads': <Target size={13} strokeWidth={1.5} />,
  'Cookie Lifetime': <Cookie size={13} strokeWidth={1.5} />,
  'Page Speed': <Zap size={13} strokeWidth={1.5} />,
};

// ─── Loop timing: fill → hold 1s → smooth reset ─────────────────────────────
// Total 6s: 3s fill (easeOut) → 1s hold → 2s reset (easeInOut)
const LOOP_S     = 6;
const LOOP_TIMES = [0, 0.5, 0.67, 1]; // 3s fill, 1s hold, 2s reset

// ─── Sub-score card (hooks-safe — own component, loop animation) ─────────────
function SubScoreCard({ label, score, opacity, y, delay }: {
  label: string; score: number;
  opacity: MotionValue<number>; y: MotionValue<number>; delay: number;
}) {
  const clr = scoreColor(score);
  const pct = `${score}%`;

  return (
    <motion.div style={{ opacity, y, padding: '12px 0' }}>
      {/* Row: icon + label + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ color: clr, opacity: 0.6, display: 'flex', alignItems: 'center' }}>
          {subScoreIcons[label] || <Activity size={13} strokeWidth={1.5} />}
        </div>
        <span style={{
          fontSize: '0.65rem', color: '#9CA3AF',
          fontFamily: 'var(--font-mono), monospace', fontWeight: 500,
          letterSpacing: '0.04em',
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginLeft: 'auto' }}>
          <span style={{
            fontFamily: 'var(--font-mono), monospace', fontWeight: 600,
            fontSize: '0.85rem', lineHeight: 1, color: clr,
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '0.45rem', color: '#374151',
            fontFamily: 'var(--font-mono), monospace',
          }}>
            /100
          </span>
        </div>
      </div>
      {/* Thin progress bar — fill → hold → reset loop */}
      <div style={{
        height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: ['0%', pct, pct, '0%'] }}
          transition={{
            duration: LOOP_S,
            repeat: Infinity,
            ease: [0.16, 1, 0.3, 1],
            times: LOOP_TIMES,
            delay: delay * 0.15,
          }}
          style={{
            height: '100%', borderRadius: 1,
            background: `linear-gradient(90deg, ${clr}30, ${clr})`,
            boxShadow: `0 0 6px ${clr}25`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Results Slide — Stape-inspired diagnostic ──────────────────────────────
function ResultsSlideContent({ scrollYProgress, diagnosis }: {
  scrollYProgress: MotionValue<number>;
  diagnosis: ClientData['diagnosis'];
}) {
  const s = 0.19;
  const span = 0.14;
  const t = (offset: number) => s + span * offset;

  // Scroll-driven entry (layout only) — data animations are loop-based
  const topBarOpacity    = useTransform(scrollYProgress, [t(0.05), t(0.15)], [0, 1]);
  const headlineOpacity  = useTransform(scrollYProgress, [t(0.06), t(0.18)], [0, 1]);
  const headlineY        = useTransform(scrollYProgress, [t(0.06), t(0.18)], [20, 0]);
  const panelOpacity     = useTransform(scrollYProgress, [t(0.08), t(0.20)], [0, 1]);
  const panelY           = useTransform(scrollYProgress, [t(0.08), t(0.20)], [24, 0]);
  const sc1Opacity       = useTransform(scrollYProgress, [t(0.14), t(0.24)], [0, 1]);
  const sc1Y             = useTransform(scrollYProgress, [t(0.14), t(0.24)], [12, 0]);
  const sc2Opacity       = useTransform(scrollYProgress, [t(0.18), t(0.28)], [0, 1]);
  const sc2Y             = useTransform(scrollYProgress, [t(0.18), t(0.28)], [12, 0]);
  const sc3Opacity       = useTransform(scrollYProgress, [t(0.22), t(0.32)], [0, 1]);
  const sc3Y             = useTransform(scrollYProgress, [t(0.22), t(0.32)], [12, 0]);
  const sc4Opacity       = useTransform(scrollYProgress, [t(0.26), t(0.36)], [0, 1]);
  const sc4Y             = useTransform(scrollYProgress, [t(0.26), t(0.36)], [12, 0]);
  const footerOpacity    = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const footerY          = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);

  const scores = diagnosis.stapeChecker?.scores;
  const overallScore = scores?.overall ?? 0;

  // Ring SVG math — loop animation (not scroll-driven)
  const ringSize = 180;
  const ringStroke = 8;
  const r = (ringSize - ringStroke) / 2;
  const circ = 2 * Math.PI * r;
  const filledOffset = circ - (overallScore / 100) * circ;

  const subScoreItems = [
    { label: 'Analytics', score: scores?.analytics ?? 0, opacity: sc1Opacity, y: sc1Y },
    { label: 'Ads', score: scores?.ads ?? 0, opacity: sc2Opacity, y: sc2Y },
    { label: 'Cookie Lifetime', score: scores?.cookieLifetime ?? 0, opacity: sc3Opacity, y: sc3Y },
    { label: 'Page Speed', score: scores?.pageSpeed ?? 0, opacity: sc4Opacity, y: sc4Y },
  ];

  return (
    <div className="slide-content">
      {/* Top bar */}
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            02 / 05
          </span>
        </div>
        <SectionBadge label={diagnosis.copy?.audit?.badge ?? 'Auditoria Técnica'} />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.06), t(0.20)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Headline */}
      <motion.h2
        style={{ opacity: headlineOpacity, y: headlineY, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.35rem,5vw,2rem)', color: '#F3F4F6', letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {diagnosis.copy?.audit?.headline ?? diagnosis.headline}
        <br />
        {diagnosis.copy?.audit?.accentWord && (
          <motion.span
            animate={{ textShadow: [`0 0 10px ${diagnosis.copy.audit.accentColor ?? '#EF4444'}25`, `0 0 24px ${diagnosis.copy.audit.accentColor ?? '#EF4444'}80`, `0 0 10px ${diagnosis.copy.audit.accentColor ?? '#EF4444'}25`] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: diagnosis.copy.audit.accentColor ?? '#EF4444' }}
          >{diagnosis.copy.audit.accentWord}</motion.span>
        )}
      </motion.h2>
      <motion.p
        style={{ opacity: headlineOpacity, y: headlineY }}
        className="mt-2 mb-10 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {diagnosis.copy?.audit?.subtitle ?? 'Analisamos a estrutura de tracking atual. O resultado fala por si.'}
      </motion.p>

      {/* ── Diagnostic panel: ring left + sub-scores right ── */}
      <motion.div
        style={{ opacity: panelOpacity, y: panelY }}
        className="flex flex-row items-center gap-12"
      >
        {/* Left: Overall ring */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          position: 'relative', flexShrink: 0,
        }}>
          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: -10, right: -24, width: 5, height: 5,
              borderRadius: '50%', background: `${scoreColor(overallScore)}80`,
              boxShadow: `0 0 8px ${scoreColor(overallScore)}30`, pointerEvents: 'none', zIndex: 3,
            }}
          />
          <motion.div
            animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{
              position: 'absolute', bottom: 28, left: -18, width: 3, height: 3,
              borderRadius: '50%', background: `${scoreColor(overallScore)}60`,
              pointerEvents: 'none', zIndex: 3,
            }}
          />
          <motion.div
            animate={{ y: [0, -4, 0], x: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{
              position: 'absolute', top: '45%', left: -26, width: 4, height: 4,
              borderRadius: '50%', background: `${scoreColor(overallScore)}40`,
              pointerEvents: 'none', zIndex: 3,
            }}
          />

          <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
            {/* Breathing glow synced with ring fill */}
            <motion.div
              animate={{
                opacity: [0.3, 1, 1, 0.3],
                scale: [0.9, 1.08, 1.08, 0.9],
              }}
              transition={{
                duration: LOOP_S,
                repeat: Infinity,
                ease: 'easeInOut',
                times: LOOP_TIMES,
              }}
              style={{
                position: 'absolute', inset: -32, borderRadius: '50%',
                background: `radial-gradient(circle, ${scoreColor(overallScore)}18 0%, transparent 65%)`,
                filter: 'blur(28px)', pointerEvents: 'none',
              }}
            />
            <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
              {/* Track */}
              <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
                fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={ringStroke}
              />
              {/* Animated arc — fill → hold → reset */}
              <motion.circle cx={ringSize / 2} cy={ringSize / 2} r={r}
                fill="none" stroke={scoreColor(overallScore)} strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                animate={{
                  strokeDashoffset: [circ, filledOffset, filledOffset, circ],
                }}
                transition={{
                  duration: LOOP_S,
                  repeat: Infinity,
                  ease: [0.16, 1, 0.3, 1],
                  times: LOOP_TIMES,
                }}
                filter={`drop-shadow(0 0 8px ${scoreColor(overallScore)}50)`}
              />
            </svg>
            {/* Center content */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}>
              <span style={{
                fontSize: '0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
                marginBottom: 6,
              }}>
                Overall score
              </span>
              <motion.span
                animate={{ textShadow: [
                  `0 0 16px ${scoreColor(overallScore)}20`,
                  `0 0 28px ${scoreColor(overallScore)}50`,
                  `0 0 16px ${scoreColor(overallScore)}20`,
                ]}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 700,
                  fontSize: '3rem', lineHeight: 1, color: scoreColor(overallScore),
                }}
              >
                {overallScore}
              </motion.span>
              <span style={{
                fontSize: '0.65rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                marginTop: 3,
              }}>
                <span style={{ color: '#4B5563' }}>/</span>100
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20,
            background: `${scoreColor(overallScore)}10`,
            border: `1px solid ${scoreColor(overallScore)}20`,
          }}>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  `0 0 4px ${scoreColor(overallScore)}40`,
                  `0 0 8px ${scoreColor(overallScore)}70`,
                  `0 0 4px ${scoreColor(overallScore)}40`,
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: scoreColor(overallScore),
              }}
            />
            <span style={{
              fontSize: '0.55rem', fontWeight: 600, color: scoreColor(overallScore),
              textTransform: 'uppercase', letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono), monospace',
            }}>
              {overallScore <= 30 ? 'Crítico' : overallScore <= 50 ? 'Atenção' : 'Bom'}
            </span>
          </div>
        </div>

        {/* Right: Sub-scores — clean vertical list */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', maxWidth: 280 }}>
          {subScoreItems.map((item, i) => (
            <div key={item.label}>
              <SubScoreCard
                label={item.label}
                score={item.score}
                opacity={item.opacity}
                y={item.y}
                delay={i}
              />
              {i < subScoreItems.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.03)' }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer: Stape link + scroll chevron ── */}
      <motion.div
        style={{ opacity: footerOpacity, y: footerY }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        {diagnosis.stapeChecker && (
          <a href={diagnosis.stapeChecker.url} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-[rgba(119,189,172,0.12)] bg-[rgba(119,189,172,0.03)] px-3.5 py-2 text-[0.65rem] font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.25)] hover:bg-[rgba(119,189,172,0.06)]">
            {diagnosis.stapeChecker.label}
            <ExternalLink size={11} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        )}

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
          <motion.div
            animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
              <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Scale Goal Slide — counter + scale bar (single animation source) ────────
function ScaleGoalSlide({ scrollYProgress, goal, range }: {
  scrollYProgress: MotionValue<number>;
  goal: { metric: string; label: string; description: string };
  range: [number, number];
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const metricOpacity   = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const metricY         = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const barOpacity      = useTransform(scrollYProgress, [t(0.20), t(0.36)], [0, 1]);
  const barY            = useTransform(scrollYProgress, [t(0.20), t(0.36)], [16, 0]);
  const descOpacity     = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const descY           = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.46), t(0.58)], [0, 1]);

  // Single animation source — rAF synced
  const isMobile = useIsMobile();
  const TARGET = 100000;
  const START = 3000;
  const normalizedValue = useLoopProgress(isMobile);

  const barPct = 3 + 97 * normalizedValue;
  const counterValue = Math.round(START + (TARGET - START) * normalizedValue);
  const formattedCounter = counterValue.toLocaleString('pt-BR');

  return (
    <div className="slide-content">
      {/* Top bar */}
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            03 / 07
          </span>
        </div>
        <SectionBadge label="Meta de Escala" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Headline */}
      <motion.h2
        style={{ opacity: metricOpacity, y: metricY, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.35rem,5vw,2rem)', color: '#F3F4F6', letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {goal.label.includes('*') ? renderAccentText(goal.label, '#77BDAC') : goal.label}
      </motion.h2>
      <motion.p
        style={{ opacity: metricOpacity, y: metricY }}
        className="mt-2 mb-8 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

      {/* Counter — clean, minimal */}
      <motion.div style={{ opacity: barOpacity, y: barY }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: '0.75rem', color: '#4B5563',
            fontFamily: 'var(--font-mono), monospace', fontWeight: 500,
          }}>
            R$
          </span>
          <span style={{
            fontFamily: 'var(--font-mono), monospace', fontWeight: 600,
            fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', lineHeight: 1,
            color: '#77BDAC',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}>
            {formattedCounter}
          </span>
          <span style={{
            fontSize: '0.6rem', color: '#374151',
            fontFamily: 'var(--font-mono), monospace', fontWeight: 500,
          }}>
            /dia
          </span>
        </div>
      </motion.div>

      {/* Scale bar — synced with counter via normalizedValue */}
      <motion.div style={{ opacity: barOpacity, y: barY }} className="mt-5 max-w-[380px]">
        <div style={{
          height: 3, borderRadius: 1.5, background: 'rgba(255,255,255,0.04)',
          overflow: 'hidden', position: 'relative',
        }}>
          <div
            style={{
              height: '100%', borderRadius: 1.5,
              width: `${barPct}%`,
              background: 'linear-gradient(90deg, rgba(119,189,172,0.3), #77BDAC)',
              transition: 'width 50ms linear',
              boxShadow: normalizedValue > 0.1 ? '0 0 8px rgba(119,189,172,0.15)' : 'none',
            }}
          />
        </div>
        {/* Labels below */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: '0.5rem', color: '#4B5563', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.03em' }}>
            atual
          </span>
          <span style={{ fontSize: '0.5rem', color: '#4B5563', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.03em' }}>
            potencial
          </span>
        </div>
      </motion.div>

      {/* Context pills — floating with staggered movement */}
      <motion.div
        style={{ opacity: descOpacity, y: descY }}
        className="mt-5 flex flex-wrap gap-2.5"
      >
        {['117k seguidores', 'R$297 ticket', 'Funil ativo', 'Nicho amplo'].map((label, i) => (
          <motion.span
            key={label}
            animate={{
              opacity: [0.4, 0.4, 0.85, 0.85, 0.4, 0.4],
              y: [0, 0, -3, -3, 0, 0],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.15, 0.3, 0.55, 0.7, 1],
              delay: i * 1.2,
            }}
            style={{
              fontSize: '0.55rem', color: '#9CA3AF',
              fontFamily: 'var(--font-mono), monospace',
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(119,189,172,0.04)',
              border: '1px solid rgba(119,189,172,0.08)',
              letterSpacing: '0.04em',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1, 1.4, 1.4, 1, 1],
                opacity: [0.4, 0.4, 0.9, 0.9, 0.4, 0.4],
              }}
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.3, 0.55, 0.7, 1],
                delay: i * 1.2,
              }}
              style={{ width: 4, height: 4, borderRadius: '50%', background: '#77BDAC' }}
            />
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Footer chevron */}
      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-10 flex w-full items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
      </motion.div>
    </div>
  );
}

// ─── CPA Tracking Ring — smaller version of slide 2 ring, driven by value ────
function CPATrackingRing({ trackingValue, trackingColor, normalizedValue }: {
  trackingValue: number; trackingColor: string; normalizedValue: number;
}) {
  const size = 120;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filledOffset = circ - (trackingValue / 100) * circ;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      position: 'relative', flexShrink: 0,
    }}>
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -5, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: -6, right: -14, width: 4, height: 4,
          borderRadius: '50%', background: `${trackingColor}80`,
          boxShadow: `0 0 6px ${trackingColor}30`, pointerEvents: 'none', zIndex: 3,
        }}
      />
      <motion.div
        animate={{ y: [0, 4, 0], x: [0, -2, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute', bottom: 20, left: -10, width: 3, height: 3,
          borderRadius: '50%', background: `${trackingColor}60`,
          pointerEvents: 'none', zIndex: 3,
        }}
      />

      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Breathing glow */}
        <div
          style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            background: `radial-gradient(circle, ${trackingColor}${normalizedValue > 0.5 ? '18' : '08'} 0%, transparent 65%)`,
            filter: 'blur(20px)', pointerEvents: 'none',
            transition: 'background 200ms ease',
          }}
        />

        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
          />
          {/* Arc — driven by normalizedValue via trackingValue */}
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={trackingColor} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={filledOffset}
            style={{ transition: 'stroke-dashoffset 50ms linear, stroke 100ms linear' }}
            filter={`drop-shadow(0 0 6px ${trackingColor}40)`}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 2,
        }}>
          <span style={{
            fontSize: '0.4rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
            textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
            marginBottom: 4,
          }}>
            tracking
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: '2rem', lineHeight: 1, color: trackingColor,
            transition: 'color 100ms linear',
          }}>
            {trackingValue}
          </span>
          <span style={{
            fontSize: '0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
            marginTop: 2,
          }}>
            <span style={{ color: '#4B5563' }}>/</span>100
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── CPA Goal Slide — tracking score ↑ while CPA ↓ ─────────────────────────
function CPAGoalSlide({ scrollYProgress, goal, range, trackingScore }: {
  scrollYProgress: MotionValue<number>;
  goal: { metric: string; label: string; description: string };
  range: [number, number];
  trackingScore: number;
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const metricOpacity   = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const metricY         = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const labelOpacity    = useTransform(scrollYProgress, [t(0.28), t(0.42)], [0, 1]);
  const labelY          = useTransform(scrollYProgress, [t(0.28), t(0.42)], [12, 0]);
  const descOpacity     = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const descY           = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.46), t(0.58)], [0, 1]);

  // Single animation source — rAF synced
  const isMobile = useIsMobile();
  const TRACKING_START = trackingScore;
  const TRACKING_TARGET = 100;
  const CPA_START = 191;
  const CPA_TARGET = 100;
  const normalizedValue = useLoopProgress(isMobile);

  // Tracking goes UP: 31→100, CPA goes DOWN: 191→100
  const trackingValue = Math.round(TRACKING_START + (TRACKING_TARGET - TRACKING_START) * normalizedValue);
  const cpaValue = Math.round(CPA_START - (CPA_START - CPA_TARGET) * normalizedValue);
  const trackingColor = trackingValue <= 30 ? '#EF4444' : trackingValue <= 50 ? '#F59E0B' : trackingValue < 90 ? '#60A5FA' : '#77BDAC';
  const cpaColor = cpaValue <= CPA_TARGET ? '#77BDAC' : cpaValue > 150 ? '#EF4444' : '#F59E0B';


  return (
    <div className="slide-content">
      {/* Top bar */}
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            04 / 07
          </span>
        </div>
        <SectionBadge label="Meta de CPA" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Headline */}
      <motion.h2
        style={{ opacity: metricOpacity, y: metricY, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.35rem,5vw,2rem)', color: '#F3F4F6', letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {goal.label.includes('*') ? renderAccentText(goal.label, '#77BDAC') : goal.label}
      </motion.h2>
      <motion.p
        style={{ opacity: metricOpacity, y: metricY }}
        className="mt-2 mb-8 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

      {/* Ring + CPA counter layout */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Tracking Score Ring — synced with normalizedValue */}
          <CPATrackingRing trackingValue={trackingValue} trackingColor={trackingColor} normalizedValue={normalizedValue} />

          {/* CPA counter + meta badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* CPA counter */}
            <div>
              <span style={{
                fontSize: '0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                display: 'block', marginBottom: 6,
              }}>
                CPA médio
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: '0.7rem', color: '#4B5563', fontFamily: 'var(--font-mono), monospace', fontWeight: 500 }}>R$</span>
                <span style={{
                  fontFamily: 'var(--font-mono), monospace', fontWeight: 600,
                  fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', lineHeight: 1,
                  color: cpaColor,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                }}>
                  {cpaValue}
                </span>
              </div>
            </div>

            {/* Meta badge — alive */}
            <motion.div
              animate={{
                borderColor: ['rgba(119,189,172,0.12)', 'rgba(119,189,172,0.25)', 'rgba(119,189,172,0.12)'],
                boxShadow: ['0 0 0px rgba(119,189,172,0)', '0 0 12px rgba(119,189,172,0.08)', '0 0 0px rgba(119,189,172,0)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                padding: '5px 12px', borderRadius: 20,
                background: 'rgba(119,189,172,0.06)',
                border: '1px solid rgba(119,189,172,0.12)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 4, height: 4, borderRadius: '50%', background: '#77BDAC' }}
              />
              <span style={{
                fontSize: '0.5rem', color: '#77BDAC', fontFamily: 'var(--font-mono), monospace',
                fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              }}>
                meta
              </span>
              <span style={{
                fontFamily: 'var(--font-mono), monospace', fontWeight: 600,
                fontSize: '0.7rem', color: '#77BDAC',
              }}>
                R$100
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Context pills — same hold-release pattern */}
      <motion.div
        style={{ opacity: descOpacity, y: descY }}
        className="mt-5 flex flex-wrap gap-2.5"
      >
        {['30-40% invisível', `Score ${TRACKING_START}/100`, 'Pixel desatualizado'].map((label, i) => (
          <motion.span
            key={label}
            animate={{
              opacity: [0.4, 0.4, 0.85, 0.85, 0.4, 0.4],
              y: [0, 0, -3, -3, 0, 0],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.15, 0.3, 0.55, 0.7, 1],
              delay: i * 1.2,
            }}
            style={{
              fontSize: '0.55rem', color: '#D97706',
              fontFamily: 'var(--font-mono), monospace',
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(245,158,11,0.04)',
              border: '1px solid rgba(245,158,11,0.12)',
              letterSpacing: '0.04em',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1, 1.4, 1.4, 1, 1],
                opacity: [0.4, 0.4, 0.9, 0.9, 0.4, 0.4],
              }}
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.3, 0.55, 0.7, 1],
                delay: i * 1.2,
              }}
              style={{ width: 4, height: 4, borderRadius: '50%', background: '#F59E0B' }}
            />
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Footer chevron */}
      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-10 flex w-full items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
      </motion.div>
    </div>
  );
}

// ─── Pricing Card — ROAS ComparisonCard DNA (extracted for hooks rule) ────────
function PricingCard({ plan, opacity, y }: {
  plan: PricingPlan;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const formattedAmount = plan.amount.toLocaleString('pt-BR');

  // Colors — solo hero card (teal DNA)
  const cardBg    = 'rgba(8, 14, 12, 0.97)';
  const headerBg  = 'rgba(8, 16, 13, 0.95)';
  const borderCol = 'rgba(119,189,172,0.20)';
  const accentCol = 'rgba(119,189,172,';
  const fnameCol  = 'rgba(119,189,172,0.7)';
  const numCol    = '#77BDAC';

  // Split services: last item (acompanhamento) gets special treatment
  const coreServices = plan.services.slice(0, -1);
  const highlightService = plan.services[plan.services.length - 1];

  return (
    <motion.div style={{ opacity, y, width: '100%', maxWidth: 440 }}>
      {/* Card with breathing glow — hero solo */}
      <motion.div
        animate={{
          boxShadow: [
            '0 24px 50px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(119,189,172,0.10), 0 0 30px rgba(119,189,172,0.03)',
            '0 24px 50px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(119,189,172,0.18), 0 0 45px rgba(119,189,172,0.07)',
            '0 24px 50px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(119,189,172,0.10), 0 0 30px rgba(119,189,172,0.03)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          borderRadius: 14,
          border: `1px solid ${borderCol}`,
          background: cardBg,
          overflow: 'hidden',
        }}
      >

        {/* ── Chrome header ── */}
        <div style={{
          padding: '10px 18px',
          borderBottom: '1px solid rgba(119,189,172,0.12)',
          background: headerBg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
            <span style={{
              marginLeft: 10,
              fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem', color: fnameCol,
            }}>
              proposta-final.md
            </span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 99,
            background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.30)',
            fontFamily: 'var(--font-mono), monospace', fontSize: '0.58rem',
            fontWeight: 700, color: '#22c55e', letterSpacing: '0.05em',
          }}>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
            />
            APROVADO
          </span>
        </div>

        {/* ── Plan name ── */}
        <div style={{
          padding: '16px 20px 0', textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.6rem', fontWeight: 600,
            color: 'rgba(119,189,172,0.65)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {plan.name}
          </span>
        </div>

        {/* ── Hero investment number ── */}
        <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono), monospace', fontWeight: 500,
              fontSize: '0.95rem', lineHeight: 1, color: numCol,
              opacity: 0.6,
            }}>
              {plan.installments}x
            </span>
            <span style={{
              fontFamily: 'var(--font-mono), monospace', fontWeight: 700,
              fontSize: 'clamp(2.1rem, 5.5vw, 2.8rem)', lineHeight: 1, color: numCol,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              R${formattedAmount}
            </span>
          </div>
          {/* SEM JUROS — inline badge under the price */}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: 'rgba(119,189,172,0.06)',
              border: '1px solid rgba(119,189,172,0.15)',
              fontFamily: 'var(--font-mono), monospace', fontSize: '0.55rem', fontWeight: 600,
              color: 'rgba(119,189,172,0.7)', letterSpacing: '0.08em',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: numCol, opacity: 0.6 }} />
              SEM JUROS
            </span>
          </div>
        </div>

        {/* ── Discount à vista — positive treatment ── */}
        <div style={{ padding: '12px 20px 18px', display: 'flex', justifyContent: 'center' }}>
          <span style={{
            padding: '5px 14px', borderRadius: 6,
            background: 'rgba(119,189,172,0.08)',
            border: '1px solid rgba(119,189,172,0.20)',
            fontSize: '0.65rem', fontWeight: 600, color: 'rgba(119,189,172,0.85)',
            letterSpacing: '0.02em',
          }}>
            {plan.discount}
          </span>
        </div>

        {/* ── Section label ── */}
        <div style={{
          padding: '10px 20px',
          fontSize: '0.6rem', fontWeight: 600,
          color: 'rgba(119,189,172,0.6)',
          letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
          borderTop: '1px solid rgba(119,189,172,0.10)',
        }}>
          O que está incluso
        </div>

        {/* ── Core service rows ── */}
        <div style={{ padding: '6px 16px 0' }}>
          {coreServices.map((service, i) => (
            <div key={i} style={{
              marginBottom: 6,
              padding: '9px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.025)',
              borderLeft: '2px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                fontSize: '0.8rem', color: '#F3F4F6',
                lineHeight: 1.5, fontWeight: 500,
              }}>
                {service.title}
              </div>
              {service.detail && (
                <div style={{
                  fontSize: '0.7rem', color: 'rgba(119,189,172,0.7)',
                  marginTop: 3, lineHeight: 1.45,
                }}>
                  {service.detail}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Highlight service (acompanhamento) — visually distinct ── */}
        {highlightService && (
          <div style={{ padding: '6px 16px 18px' }}>
            <div style={{
              marginTop: 4,
              padding: '12px 14px', borderRadius: 8,
              background: `${accentCol}0.08)`,
              borderLeft: `2px solid ${accentCol}0.50)`,
              border: `1px solid ${accentCol}0.15)`,
              borderLeftWidth: 2,
              borderLeftColor: `rgba(119,189,172,0.50)`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.55rem', fontWeight: 600,
                  color: numCol, opacity: 0.85,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  Diferencial
                </span>
              </div>
              <div style={{
                fontSize: '0.85rem', color: '#F3F4F6',
                lineHeight: 1.5, fontWeight: 600,
              }}>
                {highlightService.title}
              </div>
              {highlightService.detail && (
                <div style={{
                  fontSize: '0.7rem', color: 'rgba(119,189,172,0.7)',
                  marginTop: 3, lineHeight: 1.45,
                }}>
                  {highlightService.detail}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}

// ─── Platform logo SVGs (Simple Icons — official brand marks) ────────────────
function MetaLogo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ opacity }}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
    </svg>
  );
}

function GoogleAdsLogo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
      <path d="M3.9998 22.9291C1.7908 22.9291 0 21.1383 0 18.9293s1.7908-3.9998 3.9998-3.9998 3.9998 1.7908 3.9998 3.9998-1.7908 3.9998-3.9998 3.9998z" fill="#4285F4"/>
      <path d="M23.4641 16.9287L15.4632 3.072C14.3586 1.1587 11.9121.5028 9.9988 1.6074S7.4295 5.1585 8.5341 7.0718l8.0009 13.8567c1.1046 1.9133 3.5511 2.5679 5.4644 1.4646 1.9134-1.1046 2.568-3.5511 1.4647-5.4644z" fill="#34A853"/>
      <path d="M7.5137 4.8438L1.5645 15.1484A4.5 4.5 0 0 1 4 14.4297c2.5597-.0075 4.6248 2.1585 4.4941 4.7148l3.2168-5.5723-3.6094-6.25c-.4499-.7793-.6322-1.6394-.5878-2.4784z" fill="#FBBC04"/>
    </svg>
  );
}

function GA4Logo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E37400" style={{ opacity }}>
      <path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z"/>
    </svg>
  );
}

// ─── Floating platform logos config ──────────────────────────────────────────
// Card 1 (left): Apenas Meta
// Card 2 (right): Meta + Google Ads + GA4

// ─── Pricing Slide — ROAS-style dual comparison cards ────────────────────────
function PricingSlide({ scrollYProgress, pricing, range }: {
  scrollYProgress: MotionValue<number>;
  pricing: { plans: PricingPlan[] };
  range: [number, number];
}) {
  const [start, end] = range;
  const span = end - start;

  // Badge entry
  const badgeOpacity = useTransform(scrollYProgress, [start + span * 0.08, start + span * 0.22], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [start + span * 0.08, start + span * 0.22], [12, 0]);

  // Card 1 entry
  const card1Opacity = useTransform(scrollYProgress, [start + span * 0.14, start + span * 0.32], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [start + span * 0.14, start + span * 0.32], [20, 0]);

  // Card 2 entry (staggered)
  const card2Opacity = useTransform(scrollYProgress, [start + span * 0.20, start + span * 0.38], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [start + span * 0.20, start + span * 0.38], [20, 0]);

  // Elements entry
  const elemOpacity = useTransform(scrollYProgress, [start + span * 0.25, start + span * 0.42], [0, 1]);

  return (
    <div className="slide-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingBottom: 60, transform: 'scale(0.82)', transformOrigin: 'center center' }}>

      {/* ── Floating orbs ── */}
      {[
        { top: '10%', left: '6%', size: 5, dur: 5.5, delay: 0 },
        { top: '30%', right: '5%', size: 4, dur: 6.5, delay: 1.2 },
        { top: '55%', left: '3%', size: 3, dur: 7, delay: 2 },
        { top: '75%', right: '8%', size: 4, dur: 5, delay: 0.5 },
        { top: '85%', left: '10%', size: 3, dur: 6, delay: 1.8 },
      ].map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          animate={{ y: [0, -(orb.size + 3), 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          style={{
            position: 'absolute', top: orb.top,
            ...(orb.left ? { left: orb.left } : { right: orb.right }),
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: 'rgba(119,189,172,0.3)',
            boxShadow: '0 0 10px rgba(119,189,172,0.12)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Section badge */}
      <motion.div style={{ opacity: badgeOpacity, y: badgeY }}>
        <SectionBadge label="Investimento" />
      </motion.div>

      {/* Two cards + floating logos wrapper */}
      <div style={{ position: 'relative', marginTop: 14, overflow: 'visible' }}>

        {/* ── Floating platform logos — ao redor do card único ── */}
        <motion.div style={{ opacity: elemOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 2 }}>
          {/* Meta (left top) */}
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '12%', left: -90,
              padding: 8, borderRadius: 12,
              background: 'rgba(0,129,251,0.06)',
              border: '1px solid rgba(0,129,251,0.15)',
              boxShadow: '0 4px 20px rgba(0,129,251,0.08)',
            }}
          >
            <MetaLogo size={22} opacity={0.8} />
          </motion.div>

          {/* Google Ads (right top) */}
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            style={{
              position: 'absolute', top: '20%', right: -95,
              padding: 8, borderRadius: 12,
              background: 'rgba(66,133,244,0.06)',
              border: '1px solid rgba(66,133,244,0.15)',
              boxShadow: '0 4px 20px rgba(66,133,244,0.08)',
            }}
          >
            <GoogleAdsLogo size={22} opacity={0.8} />
          </motion.div>

          {/* GA4 (left bottom) */}
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', top: '60%', left: -85,
              padding: 8, borderRadius: 12,
              background: 'rgba(227,116,0,0.06)',
              border: '1px solid rgba(227,116,0,0.15)',
              boxShadow: '0 4px 20px rgba(227,116,0,0.08)',
            }}
          >
            <GA4Logo size={20} opacity={0.7} />
          </motion.div>

        </motion.div>

        {/* ── Card único (plano completo) ── */}
        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 480, width: '100%', margin: '0 auto' }}>
          {pricing.plans.length > 1 ? (
            <PricingCard
              plan={pricing.plans[1]}
              opacity={card2Opacity}
              y={card2Y}
            />
          ) : (
            <PricingCard
              plan={pricing.plans[0]}
              opacity={card1Opacity}
              y={card1Y}
            />
          )}
        </div>
      </div>

      {/* ── Ambient glow ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(119,189,172,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

    </div>
  );
}

// ─── Data Loss Slide — daily loss counter + split bar + monthly badge ─────────
function DataLossSlide({ scrollYProgress, goal, range }: {
  scrollYProgress: MotionValue<number>;
  goal: { metric: string; label: string; description: string };
  range: [number, number];
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const metricOpacity   = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const metricY         = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const labelOpacity    = useTransform(scrollYProgress, [t(0.28), t(0.42)], [0, 1]);
  const labelY          = useTransform(scrollYProgress, [t(0.28), t(0.42)], [12, 0]);
  const descOpacity     = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const descY           = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.46), t(0.58)], [0, 1]);

  const isMobile = useIsMobile();
  // Loop animation — loss builds up each cycle
  const DAILY_LOSS = 1200;
  const MONTHLY_LOSS = 36000;
  const normalizedValue = useLoopProgress(isMobile);

  const lossValue = Math.round(DAILY_LOSS * normalizedValue);
  const monthlyLossValue = Math.round(MONTHLY_LOSS * normalizedValue);
  const formattedLoss = lossValue.toLocaleString('pt-BR');
  const formattedMonthly = monthlyLossValue.toLocaleString('pt-BR');

  // Smooth color interpolation: teal (0) → amber (0.5) → red (1)
  const [lr, lg, lb] = lerpRGB3(normalizedValue,
    [119, 189, 172], // #77BDAC teal
    [245, 158, 11],  // #F59E0B amber
    [239, 68, 68],   // #EF4444 red
  );
  const lossColor = `rgb(${lr},${lg},${lb})`;
  const lossRgba = (a: number) => `rgba(${lr},${lg},${lb},${a})`;

  return (
    <div className="slide-content">
      {/* Top bar */}
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            05 / 07
          </span>
        </div>
        <SectionBadge label="Perda de Dados" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Headline */}
      <motion.h2
        style={{ opacity: metricOpacity, y: metricY, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.35rem,5vw,2rem)', color: '#F3F4F6', letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {goal.label.includes('*') ? renderAccentText(goal.label, '#EF4444') : goal.label}
      </motion.h2>
      <motion.p
        style={{ opacity: metricOpacity, y: metricY }}
        className="mt-2 mb-8 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

      {/* Loss calculator — quiet ledger with smooth color */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="max-w-[300px]">
        <div style={{ fontFamily: 'var(--font-mono), monospace', fontVariantNumeric: 'tabular-nums' }}>
          {/* Row 1 — investment (context, very quiet) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
            <span style={{ fontSize: '0.55rem', color: '#4B5563', fontWeight: 400, letterSpacing: '0.04em' }}>
              investimento/dia
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 400 }}>
              R$4.000
            </span>
          </div>

          {/* Row 2 — daily loss (animated, subtle) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.04em', color: lossRgba(0.5) }}>
              perda estimada
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: lossRgba(0.8) }}>
              -R${formattedLoss}
            </span>
          </div>

          {/* Split bar — visible (teal) shrinks, lost (color) grows */}
          <div style={{
            height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.03)',
            overflow: 'hidden', display: 'flex', margin: '8px 0 4px',
          }}>
            <div style={{
              height: '100%',
              width: `${100 - 30 * normalizedValue}%`,
              background: 'linear-gradient(90deg, rgba(119,189,172,0.2), rgba(119,189,172,0.5))',
              transition: 'width 50ms linear',
              borderRadius: '1px 0 0 1px',
            }} />
            <div style={{
              height: '100%',
              width: `${30 * normalizedValue}%`,
              background: `linear-gradient(90deg, ${lossRgba(0.6)}, ${lossRgba(0.2)})`,
              transition: 'width 50ms linear',
              borderRadius: '0 1px 1px 0',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.4rem', color: 'rgba(119,189,172,0.4)', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.05em' }}>
              visível
            </span>
            <span style={{ fontSize: '0.4rem', color: lossRgba(0.4), fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.05em' }}>
              perdido
            </span>
          </div>

          {/* Row 3 — monthly total (hero element, smooth color) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0 0' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.04em', color: lossRgba(0.5) }}>
              perda/mês
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 3, height: 3, borderRadius: '50%',
                background: lossRgba(0.6 + 0.4 * normalizedValue),
              }} />
              <span style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', fontWeight: 600,
                letterSpacing: '-0.02em', color: lossColor,
              }}>
                R${formattedMonthly}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Red pills — technical causes */}
      <motion.div
        style={{ opacity: descOpacity, y: descY }}
        className="mt-5 flex flex-wrap gap-2.5"
      >
        {['Sem CAPI', 'Cookie 1 dia', '100% client-side'].map((label, i) => (
          <motion.span
            key={label}
            animate={{
              opacity: [0.4, 0.4, 0.85, 0.85, 0.4, 0.4],
              y: [0, 0, -3, -3, 0, 0],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.15, 0.3, 0.55, 0.7, 1],
              delay: i * 1.2,
            }}
            style={{
              fontSize: '0.55rem', color: '#EF4444',
              fontFamily: 'var(--font-mono), monospace',
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(239,68,68,0.04)',
              border: '1px solid rgba(239,68,68,0.12)',
              letterSpacing: '0.04em',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1, 1.4, 1.4, 1, 1],
                opacity: [0.4, 0.4, 0.9, 0.9, 0.4, 0.4],
              }}
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.3, 0.55, 0.7, 1],
                delay: i * 1.2,
              }}
              style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }}
            />
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* Footer chevron */}
      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-10 flex w-full items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
      </motion.div>
    </div>
  );
}

// ─── Opportunity Card — extracted for hooks safety (no useTransform in .map) ─
// ─── Opportunity Card (extracted for hooks rule) ─────────────────────────────
function OpportunityCard({ opp, index, opacity, y }: {
  opp: Opportunity;
  index: number;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const impactColor = opp.impact === 'high' ? '#77BDAC' : '#F59E0B';

  return (
    <motion.div style={{ opacity, y }}>
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'background 0.3s ease',
      }}>
        {/* Title row: checkbox + title + impact dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Checkbox — fills in with staggered delay */}
          <motion.div
            animate={{
              borderColor: ['rgba(119,189,172,0.15)', 'rgba(119,189,172,0.3)', 'rgba(119,189,172,0.15)'],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
            style={{
              width: 15, height: 15, borderRadius: 3, flexShrink: 0,
              border: '1.5px solid rgba(119,189,172,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
              style={{
                width: 7, height: 7, borderRadius: 1.5,
                background: '#77BDAC',
              }}
            />
          </motion.div>
          <span style={{
            fontSize: '0.85rem', fontWeight: 500, color: '#E5E7EB',
            lineHeight: 1.4, flex: 1,
          }}>
            {opp.title}
          </span>
          {/* Impact dot — breathing */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
              boxShadow: [
                `0 0 0px ${impactColor}00`,
                `0 0 6px ${impactColor}30`,
                `0 0 0px ${impactColor}00`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
            style={{
              width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
              background: impactColor,
            }}
          />
        </div>

        {/* Description — indented to align with title */}
        <p style={{
          fontSize: '0.75rem', lineHeight: 1.65, color: '#9CA3AF',
          marginTop: 5, marginLeft: 25,
        }}>
          {opp.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Opportunities Slide — Apple Notes container ─────────────────────────────
function OpportunitiesSlide({ scrollYProgress, opportunities, range }: {
  scrollYProgress: MotionValue<number>;
  opportunities: Opportunity[];
  range: [number, number];
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  // Scroll-driven transforms
  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const noteOpacity     = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const noteY           = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);

  // Per-card stagger — tight stagger (3%), wider range (16%) for smooth entry
  const c0Opacity = useTransform(scrollYProgress, [t(0.20), t(0.36)], [0, 1]);
  const c0Y       = useTransform(scrollYProgress, [t(0.20), t(0.36)], [8, 0]);
  const c1Opacity = useTransform(scrollYProgress, [t(0.23), t(0.39)], [0, 1]);
  const c1Y       = useTransform(scrollYProgress, [t(0.23), t(0.39)], [8, 0]);
  const c2Opacity = useTransform(scrollYProgress, [t(0.26), t(0.42)], [0, 1]);
  const c2Y       = useTransform(scrollYProgress, [t(0.26), t(0.42)], [8, 0]);
  const c3Opacity = useTransform(scrollYProgress, [t(0.29), t(0.45)], [0, 1]);
  const c3Y       = useTransform(scrollYProgress, [t(0.29), t(0.45)], [8, 0]);
  const c4Opacity = useTransform(scrollYProgress, [t(0.32), t(0.48)], [0, 1]);
  const c4Y       = useTransform(scrollYProgress, [t(0.32), t(0.48)], [8, 0]);

  const footerOpacity = useTransform(scrollYProgress, [t(0.48), t(0.60)], [0, 1]);

  const cardTransforms = [
    { opacity: c0Opacity, y: c0Y },
    { opacity: c1Opacity, y: c1Y },
    { opacity: c2Opacity, y: c2Y },
    { opacity: c3Opacity, y: c3Y },
    { opacity: c4Opacity, y: c4Y },
  ];

  return (
    <div className="slide-content">
      {/* Top bar */}
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            06 / 07
          </span>
        </div>
        <SectionBadge label="Implementação" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Apple Notes container + floating elements */}
      <motion.div style={{ opacity: noteOpacity, y: noteY, position: 'relative' }}>

        {/* Floating tech pills — distributed around card */}
        {[
          // Right side — hugging card edge
          { label: 'CAPI', top: 12, right: -6, left: undefined, bottom: undefined, delay: 0, dur: 6 },
          { label: 'server-side', top: 100, right: -10, left: undefined, bottom: undefined, delay: 1.5, dur: 7 },
          { label: 'cookie keeper', top: undefined, right: -4, left: undefined, bottom: 60, delay: 3, dur: 5.5 },
          { label: 'dedup', top: undefined, right: 2, left: undefined, bottom: 10, delay: 2.2, dur: 6.5 },
          // Left side
          { label: 'GTM SS', top: 30, right: undefined, left: -60, bottom: undefined, delay: 0.8, dur: 6.8 },
          { label: 'cookieper', top: undefined, right: undefined, left: -55, bottom: 80, delay: 2.5, dur: 5.8 },
          { label: 'custom loader', top: 150, right: undefined, left: -80, bottom: undefined, delay: 1.2, dur: 7.2 },
        ].map((pill) => (
          <motion.span
            key={pill.label}
            animate={{
              y: [0, -4, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: pill.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: pill.delay,
            }}
            style={{
              position: 'absolute',
              top: pill.top, right: pill.right, left: pill.left, bottom: pill.bottom,
              fontSize: '0.4rem', color: 'rgba(119,189,172,0.45)',
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 500, letterSpacing: '0.06em',
              padding: '3px 8px', borderRadius: 10,
              border: '1px solid rgba(119,189,172,0.06)',
              background: 'rgba(119,189,172,0.02)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {pill.label}
          </motion.span>
        ))}

        {/* Floating orbs — both sides */}
        {[
          { top: 20, left: -35, right: undefined, bottom: undefined, size: 4, delay: 0, dur: 8 },
          { top: undefined, left: -25, right: undefined, bottom: 40, size: 3, delay: 2, dur: 9 },
          { top: 8, left: undefined, right: -40, bottom: undefined, size: 3, delay: 1, dur: 7.5 },
          { top: undefined, left: undefined, right: -25, bottom: 30, size: 4, delay: 3.5, dur: 8.5 },
          { top: 120, left: -45, right: undefined, bottom: undefined, size: 2, delay: 4, dur: 10 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, i % 2 === 0 ? -5 : 4, 0],
              x: [0, i % 2 === 0 ? 2 : -2, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
            style={{
              position: 'absolute',
              top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
              width: orb.size, height: orb.size, borderRadius: '50%',
              background: 'rgba(119,189,172,0.25)',
              boxShadow: '0 0 6px rgba(119,189,172,0.08)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Ambient glow behind note */}
        <div style={{
          position: 'absolute', top: '50%', left: '30%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,189,172,0.04) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Note card */}
        <div style={{
          borderRadius: 14, overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(119,189,172,0.08)',
          background: 'linear-gradient(180deg, #0c0c0c 0%, #050505 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 1px rgba(119,189,172,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
          maxWidth: 580,
        }}>
          {/* macOS title bar */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#080808',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F', opacity: 0.65 }} />
            </div>
            <span style={{
              fontSize: '0.65rem', color: '#4B5563', fontWeight: 500,
              fontFamily: 'var(--font-mono), monospace',
              letterSpacing: '0.03em', flex: 1, textAlign: 'center',
              marginRight: 44,
            }}>
              implementação.md
            </span>
          </div>

          {/* Note heading */}
          <div style={{ padding: '16px 18px 6px' }}>
            <h3 style={{
              fontSize: '1.1rem', fontWeight: 600, color: '#F3F4F6',
              lineHeight: 1.3,
            }}>
              O que vamos implementar
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{
                fontSize: '0.55rem', color: '#374151',
                fontFamily: 'var(--font-mono), monospace',
                letterSpacing: '0.04em',
              }}>
                {opportunities.length} itens
              </span>
              <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#374151' }} />
              <span style={{
                fontSize: '0.55rem', color: '#374151',
                fontFamily: 'var(--font-mono), monospace',
                letterSpacing: '0.04em',
              }}>
                priorizadas por impacto
              </span>
            </div>
          </div>

          {/* Separator */}
          <div style={{
            height: 1, margin: '8px 18px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          }} />

          {/* Opportunity items */}
          <div style={{ padding: '0 2px 6px' }}>
            {opportunities.map((opp, i) => (
              <OpportunityCard
                key={opp.title}
                opp={opp}
                index={i}
                opacity={cardTransforms[i]?.opacity ?? c4Opacity}
                y={cardTransforms[i]?.y ?? c4Y}
              />
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            padding: '8px 18px',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 3, height: 3, borderRadius: '50%', background: '#77BDAC' }}
              />
              <span style={{
                fontSize: '0.4rem', color: '#374151',
                fontFamily: 'var(--font-mono), monospace',
              }}>
                smartscaile.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer chevron */}
      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-8 flex w-full items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(119,189,172,0.15), transparent)' }} />
        <motion.div
          animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
      </motion.div>
    </div>
  );
}