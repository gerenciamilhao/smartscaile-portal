'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useIsMobile } from '@/lib/useIsMobile';
import { useLoopProgress } from '@/lib/useLoopProgress';
import { renderAccentText, lerpRGB3 } from '@/lib/animation-helpers';

export function DataLossSlide({ scrollYProgress, goal, range }: {
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
  const DAILY_LOSS = 1200;
  const MONTHLY_LOSS = 36000;
  const normalizedValue = useLoopProgress(isMobile);

  const lossValue = Math.round(DAILY_LOSS * normalizedValue);
  const monthlyLossValue = Math.round(MONTHLY_LOSS * normalizedValue);
  const formattedLoss = lossValue.toLocaleString('pt-BR');
  const formattedMonthly = monthlyLossValue.toLocaleString('pt-BR');

  const [lr, lg, lb] = lerpRGB3(normalizedValue,
    [119, 189, 172],
    [245, 158, 11],
    [239, 68, 68],
  );
  const lossColor = `rgb(${lr},${lg},${lb})`;
  const lossRgba = (a: number) => `rgba(${lr},${lg},${lb},${a})`;

  return (
    <div className="slide-content">
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            05 / 06
          </span>
        </div>
        <SectionBadge label="Perda de Dados" />
      </motion.div>

      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

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

      <motion.div style={{ opacity: labelOpacity, y: labelY }} className="max-w-[300px]">
        <div style={{ fontFamily: 'var(--font-mono), monospace', fontVariantNumeric: 'tabular-nums' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
            <span style={{ fontSize: '0.55rem', color: '#4B5563', fontWeight: 400, letterSpacing: '0.04em' }}>
              investimento/dia
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 400 }}>
              R$4.000
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.04em', color: lossRgba(0.5) }}>
              perda estimada
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: lossRgba(0.8) }}>
              -R${formattedLoss}
            </span>
          </div>

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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0 0' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.04em', color: lossRgba(0.5) }}>
              perda/mês
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
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
