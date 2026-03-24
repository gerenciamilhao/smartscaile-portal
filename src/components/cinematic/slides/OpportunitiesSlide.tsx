'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { Opportunity } from '@/lib/clients';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

export function OpportunitiesSlide({ scrollYProgress, opportunities, range }: {
  scrollYProgress: MotionValue<number>;
  opportunities: Opportunity[];
  range: [number, number];
}) {
  const [s] = range;
  const span = range[1] - range[0];
  const t = (offset: number) => s + span * offset;

  const topBarOpacity   = useTransform(scrollYProgress, [t(0.05), t(0.18)], [0, 1]);
  const noteOpacity     = useTransform(scrollYProgress, [t(0.10), t(0.28)], [0, 1]);
  const noteY           = useTransform(scrollYProgress, [t(0.10), t(0.28)], [24, 0]);

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
        <SectionBadge label="Solução" />
      </motion.div>

      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.08), t(0.24)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

      <motion.div style={{ opacity: noteOpacity, y: noteY, position: 'relative' }}>
        <div style={{
          borderRadius: 14, overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(119,189,172,0.08)',
          background: 'linear-gradient(180deg, #0c0c0c 0%, #050505 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 1px rgba(119,189,172,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
          maxWidth: 580,
        }}>
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

          <div style={{ padding: '16px 18px 6px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F3F4F6', lineHeight: 1.3 }}>
              O que vamos implementar
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: '0.55rem', color: '#374151', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.04em' }}>
                {opportunities.length} itens
              </span>
              <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#374151' }} />
              <span style={{ fontSize: '0.55rem', color: '#374151', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.04em' }}>
                priorizadas por impacto
              </span>
            </div>
          </div>

          <div style={{
            height: 1, margin: '8px 18px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          }} />

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
              <span style={{ fontSize: '0.4rem', color: '#374151', fontFamily: 'var(--font-mono), monospace' }}>
                smartscaile.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

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
