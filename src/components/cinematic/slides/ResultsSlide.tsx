'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { ClientData } from '@/lib/clients';
import { scoreColor } from '@/lib/animation-helpers';
import { tokens } from '@/lib/tokens';
import { BarChart2, Target, Cookie, Zap, Activity, ExternalLink } from 'lucide-react';

const LOOP_S = tokens.timing.loopDuration;
const LOOP_TIMES = tokens.timing.loopTimes;

const subScoreIcons: Record<string, React.ReactNode> = {
  'Analytics': <BarChart2 size={13} strokeWidth={1.5} />,
  'Ads': <Target size={13} strokeWidth={1.5} />,
  'Cookie Lifetime': <Cookie size={13} strokeWidth={1.5} />,
  'Page Speed': <Zap size={13} strokeWidth={1.5} />,
};

function SubScoreCard({ label, score, opacity, y, delay }: {
  label: string; score: number;
  opacity: MotionValue<number>; y: MotionValue<number>; delay: number;
}) {
  const clr = scoreColor(score);
  const pct = `${score}%`;

  return (
    <motion.div style={{ opacity, y, padding: '12px 0' }}>
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

export function ResultsSlideContent({ scrollYProgress, diagnosis }: {
  scrollYProgress: MotionValue<number>;
  diagnosis: ClientData['diagnosis'];
}) {
  const s = 0.125;
  const span = 0.125;
  const t = (offset: number) => s + span * offset;

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
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            02 / 06
          </span>
        </div>
        <SectionBadge label={diagnosis.copy?.audit?.badge ?? 'Auditoria Técnica'} />
      </motion.div>

      <motion.div
        style={{ scaleX: useTransform(scrollYProgress, [t(0.06), t(0.20)], [0, 1]), transformOrigin: 'left' }}
        className="accent-line mb-5"
      />

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

      <motion.div
        style={{ opacity: panelOpacity, y: panelY }}
        className="flex flex-row items-center gap-12"
      >
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          position: 'relative', flexShrink: 0,
        }}>
          <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
            <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
                fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={ringStroke}
              />
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
              />
            </svg>
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
