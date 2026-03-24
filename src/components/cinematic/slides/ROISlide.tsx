'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useIsMobile } from '@/lib/useIsMobile';
import { useLoopProgress } from '@/lib/useLoopProgress';
import { renderAccentText } from '@/lib/animation-helpers';
import type { Roi, RoiProjection } from '@/lib/clients';

/* ── Projection Card ───────────────────────────────────────── */

function ProjectionCard({ p, featured }: { p: RoiProjection; featured?: boolean }) {
  const isFromTo = !!(p.from && p.to);

  return (
    <div style={{
      flex: 1,
      padding: '14px 16px',
      borderRadius: 16,
      background: '#0a0a0a',
      border: '1px solid rgba(119,189,172,0.10)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    }}>
      <span style={{
        fontSize: '0.45rem', color: '#9CA3AF',
        fontWeight: 500, letterSpacing: '0.06em',
        textTransform: 'uppercase' as const, display: 'block', marginBottom: 8,
      }}>
        {p.label}
      </span>

      {isFromTo ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontSize: '0.8rem',
            color: '#EF4444', fontWeight: 600,
            textDecoration: 'line-through',
            opacity: 0.7,
          }}>
            {p.from}
          </span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
            <path d="M1 4H10M10 4L7 1M10 4L7 7" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#77BDAC', fontWeight: 700,
          }}>
            {p.to}
          </span>
        </div>
      ) : (
        <span style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#77BDAC', fontWeight: 700,
        }}>
          {p.value}
        </span>
      )}

      <span style={{
        fontSize: '0.45rem', color: '#4B5563',
        display: 'block', marginTop: 6,
      }}>
        {p.description}
      </span>
    </div>
  );
}

/* ── Payback Ring ──────────────────────────────────────────── */

function PaybackRing({ progress, size = 72 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: -4,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(119,189,172,${0.06 * progress}) 40%, transparent 70%)`,
      }} />

      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#77BDAC" strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 50ms linear', filter: 'drop-shadow(0 0 4px rgba(119,189,172,0.3))' }}
        />
      </svg>

      {/* Center dot */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#77BDAC',
            boxShadow: '0 0 8px rgba(119,189,172,0.4)',
          }}
        />
      </div>
    </div>
  );
}

/* ── ROI Slide ─────────────────────────────────────────────── */

export function ROISlide({ scrollYProgress, roi, range }: {
  scrollYProgress: MotionValue<number>;
  roi: Roi;
  range: [number, number];
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);
  const row1Opacity     = useTransform(scrollYProgress, [t(0.22), t(0.36)], [0, 1]);
  const row1Y           = useTransform(scrollYProgress, [t(0.22), t(0.36)], [16, 0]);
  const row2Opacity     = useTransform(scrollYProgress, [t(0.30), t(0.44)], [0, 1]);
  const row2Y           = useTransform(scrollYProgress, [t(0.30), t(0.44)], [16, 0]);
  const paybackOpacity  = useTransform(scrollYProgress, [t(0.38), t(0.52)], [0, 1]);
  const paybackY        = useTransform(scrollYProgress, [t(0.38), t(0.52)], [12, 0]);
  const tagsOpacity     = useTransform(scrollYProgress, [t(0.46), t(0.56)], [0, 1]);
  const footerOpacity   = useTransform(scrollYProgress, [t(0.54), t(0.64)], [0, 1]);

  const isMobile = useIsMobile();
  const normalizedValue = useLoopProgress(isMobile);

  const paybackProgress = Math.min(normalizedValue * 1.3, 1);
  const daysCounter = Math.round(roi.paybackDays * paybackProgress);

  const proj = roi.projections;

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
            07 / 07
          </span>
        </div>
        <SectionBadge label="Projeção de Retorno" />
      </motion.div>

      {/* Accent line */}
      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      {/* Headline */}
      <motion.h2
        style={{
          opacity: headlineOpacity, y: headlineY,
          fontFamily: 'var(--font-sans)', fontWeight: 600,
          fontSize: 'clamp(1.15rem,4vw,1.6rem)',
          color: '#F3F4F6', letterSpacing: '-0.02em', lineHeight: 1.15,
        }}
      >
        {roi.headline.includes('*') ? renderAccentText(roi.headline, '#77BDAC') : roi.headline}
      </motion.h2>
      <motion.p
        style={{ opacity: headlineOpacity, y: headlineY }}
        className="mt-2 mb-10 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
      >
        {roi.subtitle}
      </motion.p>

      {/* Projections + Payback grid */}
      <div className="max-w-[440px]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
        {/* Row 1: first 2 projections (featured) */}
        <motion.div style={{ opacity: row1Opacity, y: row1Y }} className="flex gap-3 mb-3">
          {proj.slice(0, 2).map((p, i) => (
            <ProjectionCard key={i} p={p} />
          ))}
        </motion.div>

        {/* Row 2: remaining projections */}
        {proj.length > 2 && (
          <motion.div style={{ opacity: row2Opacity, y: row2Y }} className="flex gap-3 mb-3">
            {proj.slice(2, 4).map((p, i) => (
              <ProjectionCard key={i} p={p} />
            ))}
          </motion.div>
        )}

        {/* Payback counter — visually connected */}
        <motion.div style={{ opacity: paybackOpacity, y: paybackY }}>
          <div style={{
            padding: '14px 16px', borderRadius: 16,
            background: '#0a0a0a',
            border: '1px solid rgba(119,189,172,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <span style={{
                fontSize: '0.45rem', color: '#9CA3AF', fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                display: 'block', marginBottom: 6,
              }}>
                payback estimado
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1,
                  color: '#77BDAC',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {daysCounter}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                  dias
                </span>
              </div>
            </div>

            <PaybackRing progress={paybackProgress} size={56} />
          </div>
        </motion.div>
      </div>

      {/* Tags */}
      {roi.tags && (
        <motion.div
          style={{ opacity: tagsOpacity }}
          className="mt-4 flex flex-wrap gap-2.5"
        >
          {roi.tags.map((label, i) => (
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
                fontSize: '0.55rem', color: '#77BDAC',
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
      )}

      {/* Footer scroll indicator */}
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
