'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { ScrollSlide } from './ScrollSlide';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useTransform } from 'framer-motion';
import type { ClientData } from '@/lib/clients';
import {
  TrendingUp, Target, Rocket, Users,
  Server, Cookie, Shield, Zap,
  ArrowRight, MessageCircle, Clock, ExternalLink,
  BarChart2, Activity, Sparkles,
} from 'lucide-react';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
}

// Ranges sequenciais dentro do 750vh (hero ocupa 0→~0.08)
// 5 slides dividem 0.08 → 1.0 = 0.92 / 5 = ~0.184 cada
const R = {
  header:        [0.08, 0.26] as [number, number],
  results:       [0.26, 0.44] as [number, number],
  desires:       [0.44, 0.62] as [number, number],
  opportunities: [0.62, 0.80] as [number, number],
  proposal:      [0.80, 1.00] as [number, number],
};

const desireIcons: Record<string, React.ReactNode> = {
  scale:  <TrendingUp size={15} strokeWidth={1.5} />,
  target: <Target size={15} strokeWidth={1.5} />,
  rocket: <Rocket size={15} strokeWidth={1.5} />,
  users:  <Users size={15} strokeWidth={1.5} />,
};

const oppIcons = [
  <Server key="0" size={13} strokeWidth={1.5} />,
  <Cookie key="1" size={13} strokeWidth={1.5} />,
  <Shield key="2" size={13} strokeWidth={1.5} />,
  <Zap    key="3" size={13} strokeWidth={1.5} />,
  <Rocket key="4" size={13} strokeWidth={1.5} />,
];

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
          SLIDE 3 — Objetivos / Desires
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.desires} scrollYProgress={scrollYProgress} zIndex={4}>
        <div className="slide-dot-grid" />

        <div className="slide-content">
          <SectionBadge label="Seus Objetivos" />
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            {diagnosis.desires.headline}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUpItem, visible: { ...fadeUpItem.visible, transition: { ...fadeUpItem.visible.transition, delay: 0.05 } } }}
            className="mt-2 max-w-[520px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
          >
            {diagnosis.desires.intro}
          </motion.p>

          {/* Separator */}
          <div className="separator-line my-4" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2.5"
          >
            {diagnosis.desires.items.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUpItem}
                className="proposal-card flex items-start gap-2.5 rounded-xl border border-[rgba(119,189,172,0.06)] bg-[#0a0a0a] p-3 hover:border-[rgba(119,189,172,0.18)] hover:bg-[rgba(10,10,10,0.9)]"
              >
                <div className="icon-pulse mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(119,189,172,0.08)] text-[#77BDAC]"
                  style={{ border: '1px solid rgba(119,189,172,0.12)' }}
                >
                  {desireIcons[item.icon] || <Target size={15} strokeWidth={1.5} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.75rem] font-semibold text-[#F3F4F6]">{item.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-relaxed text-[#9CA3AF]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 4 — Implementacao / Opportunities
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.opportunities} scrollYProgress={scrollYProgress} zIndex={5}>
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
          SLIDE 5 — Proposta + CTA (isLast: permanece visivel, sem fade-out)
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={6} isLast>
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
  const s = 0.08;
  const span = 0.18;
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
    <motion.div style={{ opacity, y }}>
      <div className="proposal-card" style={{
        padding: '14px 16px', borderRadius: 14,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${clr}12`,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${clr}10`, border: `1px solid ${clr}18`,
          }}>
            <motion.div
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.4 }}
              style={{ color: clr, display: 'flex', alignItems: 'center' }}
            >
              {subScoreIcons[label] || <Activity size={12} strokeWidth={1.5} />}
            </motion.div>
          </div>
          <span style={{
            fontSize: '0.6rem', color: '#9CA3AF',
            fontFamily: 'var(--font-mono), monospace', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {label}
          </span>
        </div>
        {/* Score number — large */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: '1.75rem', lineHeight: 1, color: clr,
            textShadow: `0 0 16px ${clr}30`,
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '0.55rem', color: '#4B5563',
            fontFamily: 'var(--font-mono), monospace',
          }}>
            /100
          </span>
        </div>
        {/* Progress bar — fill → hold → reset loop */}
        <div style={{
          height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.04)',
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
              height: '100%', borderRadius: 2,
              background: `linear-gradient(90deg, ${clr}40, ${clr})`,
              boxShadow: `0 0 10px ${clr}40`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Results Slide — Stape-inspired diagnostic ──────────────────────────────
function ResultsSlideContent({ scrollYProgress, diagnosis }: {
  scrollYProgress: MotionValue<number>;
  diagnosis: ClientData['diagnosis'];
}) {
  const s = 0.26;
  const span = 0.18;
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
  const ringSize = 160;
  const ringStroke = 10;
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
        className="mt-2 mb-6 max-w-[480px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
      >
        Analisamos a estrutura de tracking atual. O resultado fala por si.
      </motion.p>

      {/* ── Diagnostic panel: ring centered + 2x2 grid below ── */}
      <motion.div
        style={{ opacity: panelOpacity, y: panelY }}
        className="flex flex-col items-center gap-6"
      >
        {/* Overall ring — centered */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          position: 'relative',
        }}>
          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: -8, right: -20, width: 5, height: 5,
              borderRadius: '50%', background: `${scoreColor(overallScore)}80`,
              boxShadow: `0 0 8px ${scoreColor(overallScore)}30`, pointerEvents: 'none', zIndex: 3,
            }}
          />
          <motion.div
            animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{
              position: 'absolute', bottom: 24, left: -14, width: 3, height: 3,
              borderRadius: '50%', background: `${scoreColor(overallScore)}60`,
              pointerEvents: 'none', zIndex: 3,
            }}
          />
          <motion.div
            animate={{ y: [0, -4, 0], x: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{
              position: 'absolute', top: '40%', left: -22, width: 4, height: 4,
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
                position: 'absolute', inset: -28, borderRadius: '50%',
                background: `radial-gradient(circle, ${scoreColor(overallScore)}18 0%, transparent 65%)`,
                filter: 'blur(24px)', pointerEvents: 'none',
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
                filter={`drop-shadow(0 0 6px ${scoreColor(overallScore)}60)`}
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
                marginBottom: 4,
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
                  fontSize: '2.75rem', lineHeight: 1, color: scoreColor(overallScore),
                }}
              >
                {overallScore}
              </motion.span>
              <span style={{
                fontSize: '0.6rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                marginTop: 2,
              }}>
                <span style={{ color: '#4B5563' }}>/</span>100
              </span>
            </div>
          </div>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
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

        {/* Sub-scores — 2×2 grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8, width: '100%',
        }}>
          {subScoreItems.map((item, i) => (
            <SubScoreCard
              key={item.label}
              label={item.label}
              score={item.score}
              opacity={item.opacity}
              y={item.y}
              delay={i}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Footer: Stape link + scroll chevron ── */}
      <motion.div
        style={{ opacity: footerOpacity, y: footerY }}
        className="mt-6 flex flex-col items-center gap-4"
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
