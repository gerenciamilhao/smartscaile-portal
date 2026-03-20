'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import { useIsMobile } from '@/lib/useIsMobile';
import { useLoopProgress } from '@/lib/useLoopProgress';
import { renderAccentText } from '@/lib/animation-helpers';

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
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}
          />
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={trackingColor} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={filledOffset}
            style={{ transition: 'stroke-dashoffset 50ms linear, stroke 100ms linear' }}
          />
        </svg>

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

export function CPAGoalSlide({ scrollYProgress, goal, range, trackingScore }: {
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

  const isMobile = useIsMobile();
  const TRACKING_START = trackingScore;
  const TRACKING_TARGET = 100;
  const CPA_START = 191;
  const CPA_TARGET = 100;
  const normalizedValue = useLoopProgress(isMobile);

  const trackingValue = Math.round(TRACKING_START + (TRACKING_TARGET - TRACKING_START) * normalizedValue);
  const cpaValue = Math.round(CPA_START - (CPA_START - CPA_TARGET) * normalizedValue);
  const trackingColor = trackingValue <= 30 ? '#EF4444' : trackingValue <= 50 ? '#F59E0B' : trackingValue < 90 ? '#60A5FA' : '#77BDAC';
  const cpaColor = cpaValue <= CPA_TARGET ? '#77BDAC' : cpaValue > 150 ? '#EF4444' : '#F59E0B';

  return (
    <div className="slide-content">
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            04 / 06
          </span>
        </div>
        <SectionBadge label="Meta de CPA" />
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

      <motion.div style={{ opacity: labelOpacity, y: labelY }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <CPATrackingRing trackingValue={trackingValue} trackingColor={trackingColor} normalizedValue={normalizedValue} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={{
                fontSize: '0.5rem', color: '#6B7280', fontFamily: 'var(--font-mono), monospace',
                fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                display: 'block', marginBottom: 6,
              }}>
                CPA médio
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, whiteSpace: 'nowrap' }}>
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
