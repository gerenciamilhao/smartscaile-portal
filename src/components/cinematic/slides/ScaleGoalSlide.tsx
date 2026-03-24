'use client';

import React, { useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { renderAccentText } from '@/lib/animation-helpers';
import { TerminalTyping, type TerminalLine } from './TerminalTyping';
import type { Goal, StapeScore } from '@/lib/clients';

export function ScaleGoalSlide({ scrollYProgress, goal, range, stapeScores, domain }: {
  scrollYProgress: MotionValue<number>;
  goal: Goal;
  range: [number, number];
  stapeScores?: StapeScore;
  domain?: string;
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const metricOpacity   = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const metricY         = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const terminalOpacity = useTransform(scrollYProgress, [t(0.20), t(0.36)], [0, 1]);
  const terminalY       = useTransform(scrollYProgress, [t(0.20), t(0.36)], [16, 0]);
  const tagsOpacity     = useTransform(scrollYProgress, [t(0.34), t(0.48)], [0, 1]);
  const tagsY           = useTransform(scrollYProgress, [t(0.34), t(0.48)], [10, 0]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.46), t(0.58)], [0, 1]);

  const scores = stapeScores;
  const terminalLines = useMemo<TerminalLine[]>(() => [
    { text: `stape audit --domain ${domain ?? 'example.com'}`, prefix: '$', color: '#6B7280' },
    { text: 'conectando...', prefix: ' ', color: '#4B5563', delay: 300 },
    { text: `score geral ················ ${scores?.overall ?? '—'}/100`, color: scores && scores.overall <= 30 ? '#EF4444' : '#F59E0B', delay: 200 },
    { text: `analytics ·················· ${scores?.analytics ?? '—'}/100`, delay: 100 },
    { text: `ads tracking ··············· ${scores?.ads ?? '—'}/100`, delay: 100 },
    { text: `cookie lifetime ············ ${scores?.cookieLifetime ?? '—'}/100`, color: scores && scores.cookieLifetime <= 30 ? '#EF4444' : '#77BDAC', delay: 100 },
    { text: `page speed ················· ${scores?.pageSpeed ?? '—'}/100`, delay: 100 },
    { text: 'server-side (CAPI) ········ not detected', color: '#EF4444', delay: 200 },
    { text: 'data loss estimado ········ ~30%', color: '#EF4444', delay: 150 },
    { text: 'resultado: intervenção necessária', prefix: '!', color: '#F59E0B', delay: 400 },
  ], [scores, domain]);

  return (
    <div className="slide-content">
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
        <SectionBadge label="Diagnóstico" />
      </motion.div>

      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

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

      {/* Terminal audit */}
      <motion.div style={{ opacity: terminalOpacity, y: terminalY }}>
        <div style={{ maxWidth: 520 }}>
          <TerminalTyping lines={terminalLines} fontSize="clamp(0.45rem, 1.3vw, 0.65rem)" />
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        style={{ opacity: tagsOpacity, y: tagsY }}
        className="mt-5 flex flex-wrap gap-2.5"
      >
        {(goal.tags ?? ['27/100', 'Sem CAPI', 'Client-side', 'Cookie 1 dia']).map((label, i) => (
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
