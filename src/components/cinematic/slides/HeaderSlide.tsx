'use client';

import React, { useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { ClientData } from '@/lib/clients';
import { useIsMobile } from '@/lib/useIsMobile';
import { useTerminalTyping, type TerminalLine } from '@/lib/useTerminalTyping';

function TerminalTyping({ lines, isMobile = false, fontSize }: { lines: TerminalLine[]; isMobile?: boolean; fontSize?: string }) {
  const { visibleChars, activeLine } = useTerminalTyping(lines);

  return (
    <div style={{ position: 'relative' }}>
      {!isMobile && (
        <div style={{
          position: 'absolute', inset: -16, borderRadius: 20,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(119,189,172,0.06) 0%, transparent 60%)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
      )}

      <div style={{
        position: 'relative',
        borderRadius: 14,
        background: 'linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(5,5,5,0.88) 100%)',
        border: '1px solid rgba(119,189,172,0.08)',
        backdropFilter: isMobile ? 'none' : 'blur(16px)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: fontSize ?? '0.7rem',
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
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              fontSize: '0.5rem', color: '#374151', letterSpacing: '0.06em',
              textTransform: 'uppercase', fontWeight: 500,
            }}>
              smartscaile — audit
            </span>
          </div>
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
                <span style={{
                  width: 20, flexShrink: 0, textAlign: 'right', marginRight: 12,
                  color: '#27272a', fontSize: 'clamp(0.4rem, 1vw, 0.55rem)', userSelect: 'none',
                }}>
                  {i + 1}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
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

export function HeaderSlideContent({ scrollYProgress, firstName, formattedDate, diagnosis }: {
  scrollYProgress: MotionValue<number>;
  firstName: string;
  formattedDate: string;
  diagnosis: ClientData['diagnosis'];
}) {
  const isMobile = useIsMobile();
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
          <TerminalTyping lines={terminalLines} isMobile={isMobile} fontSize="clamp(0.45rem, 1.3vw, 0.65rem)" />
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
