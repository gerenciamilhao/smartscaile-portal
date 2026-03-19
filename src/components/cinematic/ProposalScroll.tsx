'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { type MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { ScrollSlide } from './ScrollSlide';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useTransform } from 'framer-motion';
import type { ClientData } from '@/lib/clients';
import {
  Target, Rocket,
  Server, Cookie, Shield, Zap,
  ArrowRight, MessageCircle, Clock, ExternalLink,
  BarChart2, Activity,
} from 'lucide-react';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
}

// Ranges sequenciais dentro do 750vh (hero ocupa 0→~0.08)
// 5 slides dividem 0.08 → 1.0 = 0.92 / 5 = ~0.184 cada
const R = {
  header:        [0.06, 0.19] as [number, number],
  results:       [0.19, 0.33] as [number, number],
  goal1:         [0.33, 0.46] as [number, number],
  goal2:         [0.46, 0.59] as [number, number],
  goal3:         [0.59, 0.72] as [number, number],
  opportunities: [0.72, 0.86] as [number, number],
  proposal:      [0.86, 1.00] as [number, number],
};

const oppIcons = [
  <Server key="0" size={13} strokeWidth={1.5} />,
  <Cookie key="1" size={13} strokeWidth={1.5} />,
  <Shield key="2" size={13} strokeWidth={1.5} />,
  <Zap    key="3" size={13} strokeWidth={1.5} />,
  <Rocket key="4" size={13} strokeWidth={1.5} />,
];

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

function useLoopProgress() {
  const startRef = useRef(Date.now());
  const lastRef = useRef(0);
  const [normalizedValue, setNormalizedValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = Date.now();
      // Throttle to ~30fps (33ms) to avoid excess re-renders
      if (now - lastRef.current >= 33) {
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
  }, []);

  return normalizedValue;
}

// Stagger animation variants
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

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

        <div className="slide-content">
          <SectionBadge label="O que vamos implementar" />
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            Como vamos chegar la
          </motion.h2>

          {/* Top accent line */}
          <div className="accent-line mt-2 mb-4" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col gap-2"
          >
            {diagnosis.opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                variants={fadeUpItem}
                className="proposal-card flex items-start gap-2.5 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-3 hover:border-[rgba(119,189,172,0.15)] hover:bg-[rgba(10,10,10,0.9)]"
              >
                {/* Step number */}
                <div className="step-number mt-0.5">
                  {i + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#77BDAC]" style={{ opacity: 0.6 }}>
                      {oppIcons[i] || <Zap size={13} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-[0.75rem] font-semibold text-[#F3F4F6]">{opp.title}</h3>
                    <span className={`inline-flex shrink-0 items-center rounded-full border px-1.5 py-px text-[0.5rem] font-semibold uppercase tracking-wider ${
                      opp.impact === 'high' ? 'impact-high' : 'impact-medium'
                    }`}>
                      {opp.impact === 'high' ? 'Alto' : 'Medio'}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-relaxed text-[#9CA3AF]">{opp.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 7 — Proposta + CTA (isLast: permanece visivel, sem fade-out)
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={8} isLast>
        <div className="slide-dot-grid" />

        <div className="slide-content text-center">
          {/* Badge with live dot */}
          <div className="inline-flex items-center gap-2">
            <SectionBadge label="Proposta smartscaile." />
          </div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            {diagnosis.proposal.headline}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUpItem, visible: { ...fadeUpItem.visible, transition: { ...fadeUpItem.visible.transition, delay: 0.05 } } }}
            className="mx-auto mt-3 max-w-[520px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
          >
            {diagnosis.proposal.description}
          </motion.p>

          {/* Separator */}
          <div className="separator-line mx-auto my-5" style={{ maxWidth: '200px' }} />

          {/* Glass pills for timeline + guarantee */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-6 flex flex-wrap items-center justify-center gap-2.5"
          >
            <motion.div variants={fadeUpItem} className="glass-pill flex items-center gap-1.5 rounded-lg px-3 py-2">
              <Clock size={12} className="text-[#77BDAC]" strokeWidth={1.5} />
              <span className="text-[0.7rem] text-[#F3F4F6]">{diagnosis.proposal.timeline}</span>
            </motion.div>
            <motion.div variants={fadeUpItem} className="glass-pill flex items-center gap-1.5 rounded-lg px-3 py-2">
              <Shield size={12} className="text-[#77BDAC]" strokeWidth={1.5} />
              <span className="text-[0.7rem] text-[#F3F4F6]">{diagnosis.proposal.guarantee}</span>
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <a href="https://wa.me/5511999999999?text=Oi%20Carlos%2C%20quero%20agendar%20a%20call%20de%20implementa%C3%A7%C3%A3o"
              target="_blank" rel="noopener noreferrer"
              className="cta-glow-pulse group inline-flex items-center gap-2.5 rounded-xl bg-[#77BDAC] px-6 py-3 text-[0.8rem] font-semibold text-[#050505] transition-colors hover:bg-[#5fa695]">
              {diagnosis.proposal.cta}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://wa.me/5511999999999?text=Oi%20Carlos%2C%20vi%20a%20proposta%20no%20portal"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(119,189,172,0.18)] bg-transparent px-4 py-2 text-[0.7rem] font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.35)] hover:bg-[rgba(119,189,172,0.03)]">
              <MessageCircle size={12} />
              Falar no WhatsApp
            </a>
          </motion.div>

          {/* Footer brand mark */}
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <span className="live-dot" />
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.15em] text-[#374151]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
              smartscaile.
            </span>
          </div>
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
        <SectionBadge label="Proposta Exclusiva" />
      </motion.div>

      <motion.div
        style={{ scaleX: accentScaleX, transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      <motion.h2
        className="font-serif"
        style={{ opacity: headlineOpacity, y: headlineY, fontWeight: 700, lineHeight: 1.12, color: '#F3F4F6', fontSize: 'clamp(1.75rem, 7vw, 3rem)' }}
      >
        Escale com{' '}
        <span className="text-glow" style={{ color: '#77BDAC' }}>inteligência.</span>
      </motion.h2>

      <motion.p
        style={{ opacity: subtitleOpacity, y: subtitleY }}
        className="mt-4 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {firstName}, com base na nossa conversa de{' '}
        <span className="text-[#F3F4F6]">{formattedDate}</span>, preparamos um plano sob medida para destravar seus resultados.
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
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            02 / 05
          </span>
        </div>
        <SectionBadge label="Auditoria Técnica" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.06), t(0.20)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-4"
      />

      {/* Headline */}
      <motion.h2
        style={{ opacity: headlineOpacity, y: headlineY }}
        className="font-serif text-[clamp(1.25rem,4vw,1.75rem)] font-bold text-[#F3F4F6]"
      >
        {diagnosis.headline}
      </motion.h2>
      <motion.p
        style={{ opacity: headlineOpacity, y: headlineY }}
        className="mt-2 mb-10 max-w-[480px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
      >
        Analisamos a estrutura de tracking atual. O resultado fala por si.
      </motion.p>

      {/* ── Diagnostic panel: ring left + sub-scores right ── */}
      <motion.div
        style={{ opacity: panelOpacity, y: panelY }}
        className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12"
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
  const labelOpacity    = useTransform(scrollYProgress, [t(0.28), t(0.42)], [0, 1]);
  const labelY          = useTransform(scrollYProgress, [t(0.28), t(0.42)], [12, 0]);
  const descOpacity     = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const descY           = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.46), t(0.58)], [0, 1]);

  // Single animation source — rAF synced
  const TARGET = 100000;
  const START = 3000;
  const normalizedValue = useLoopProgress();

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
        className="accent-line mb-8"
      />

      {/* Counter — clean, minimal */}
      <motion.div style={{ opacity: metricOpacity, y: metricY }}>
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

      {/* Label */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="mt-8">
        <h3 style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700, color: '#F3F4F6',
          lineHeight: 1.3,
        }}>
          {goal.label}
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        style={{ opacity: descOpacity, y: descY }}
        className="mt-3 max-w-[520px] text-[0.8rem] leading-[1.8] text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

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
function CPATrackingRing({ trackingValue, trackingColor, normalizedValue, trackingStart }: {
  trackingValue: number; trackingColor: string; normalizedValue: number; trackingStart: number;
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
  const TRACKING_START = trackingScore;
  const TRACKING_TARGET = 100;
  const CPA_START = 191;
  const CPA_TARGET = 100;
  const normalizedValue = useLoopProgress();

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
        className="accent-line mb-8"
      />

      {/* Ring + CPA counter layout */}
      <motion.div style={{ opacity: metricOpacity, y: metricY }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Tracking Score Ring — synced with normalizedValue */}
          <CPATrackingRing trackingValue={trackingValue} trackingColor={trackingColor} normalizedValue={normalizedValue} trackingStart={TRACKING_START} />

          {/* CPA counter + meta badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* CPA counter */}
            <div>
              <span style={{
                fontSize: '0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                display: 'block', marginBottom: 6,
              }}>
                CPA média
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

      {/* Label */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="mt-8">
        <h3 style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700, color: '#F3F4F6',
          lineHeight: 1.3,
        }}>
          {goal.label}
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        style={{ opacity: descOpacity, y: descY }}
        className="mt-3 max-w-[520px] text-[0.8rem] leading-[1.8] text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

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

  // Loop animation — loss builds up each cycle
  const DAILY_INVEST = 4000;
  const DAILY_LOSS = 1200;
  const MONTHLY_LOSS = 36000;
  const normalizedValue = useLoopProgress();

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
        className="accent-line mb-8"
      />

      {/* Loss calculator — quiet ledger with smooth color */}
      <motion.div style={{ opacity: metricOpacity, y: metricY }} className="max-w-[300px]">
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

      {/* Label */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="mt-8">
        <h3 style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700, color: '#F3F4F6',
          lineHeight: 1.3,
        }}>
          {goal.label}
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        style={{ opacity: descOpacity, y: descY }}
        className="mt-3 max-w-[520px] text-[0.8rem] leading-[1.8] text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

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

// ─── Single Goal Slide — one metric per slide, hero-style ────────────────────
function SingleGoalSlide({ scrollYProgress, goal, range, slideNum, totalSlides, badge }: {
  scrollYProgress: MotionValue<number>;
  goal: { metric: string; label: string; description: string };
  range: [number, number];
  slideNum: string;
  totalSlides: string;
  badge: string;
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const metricOpacity   = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const metricY         = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const labelOpacity    = useTransform(scrollYProgress, [t(0.18), t(0.36)], [0, 1]);
  const labelY          = useTransform(scrollYProgress, [t(0.18), t(0.36)], [16, 0]);
  const descOpacity     = useTransform(scrollYProgress, [t(0.26), t(0.44)], [0, 1]);
  const descY           = useTransform(scrollYProgress, [t(0.26), t(0.44)], [12, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.42), t(0.56)], [0, 1]);

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
            {slideNum} / {totalSlides}
          </span>
        </div>
        <SectionBadge label={badge} />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-8"
      />

      {/* Metric — hero element */}
      <motion.div style={{ opacity: metricOpacity, y: metricY }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontWeight: 700,
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1,
          color: '#77BDAC',
          display: 'block',
        }}>
          {goal.metric}
        </span>
      </motion.div>

      {/* Label */}
      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="mt-4">
        <span style={{
          fontSize: '0.9rem', fontWeight: 600, color: '#F3F4F6',
          lineHeight: 1.4,
        }}>
          {goal.label}
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        style={{ opacity: descOpacity, y: descY }}
        className="mt-3 max-w-[480px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
      >
        {goal.description}
      </motion.p>

      {/* Footer chevron */}
      <motion.div
        style={{ opacity: footerOpacity }}
        className="mt-12 flex w-full items-center gap-3"
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
