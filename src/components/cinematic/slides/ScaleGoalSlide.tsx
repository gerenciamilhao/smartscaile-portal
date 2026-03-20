'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useIsMobile } from '@/lib/useIsMobile';
import { useLoopProgress } from '@/lib/useLoopProgress';
import { renderAccentText } from '@/lib/animation-helpers';

export function ScaleGoalSlide({ scrollYProgress, goal, range }: {
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

  const isMobile = useIsMobile();
  const TARGET = 100000;
  const START = 3000;
  const normalizedValue = useLoopProgress(isMobile);

  const barPct = 3 + 97 * normalizedValue;
  const counterValue = Math.round(START + (TARGET - START) * normalizedValue);
  const formattedCounter = counterValue.toLocaleString('pt-BR');

  return (
    <div className="slide-content">
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            03 / 06
          </span>
        </div>
        <SectionBadge label="Meta de Escala" />
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

      <motion.div style={{ opacity: barOpacity, y: barY }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: '0.5rem', color: '#4B5563', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.03em' }}>
            atual
          </span>
          <span style={{ fontSize: '0.5rem', color: '#4B5563', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.03em' }}>
            potencial
          </span>
        </div>
      </motion.div>

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
