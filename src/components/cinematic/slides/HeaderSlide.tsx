'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { ClientData } from '@/lib/clients';
import { useIsMobile } from '@/lib/useIsMobile';
import { useLoopProgress } from '@/lib/useLoopProgress';
import { lerpRGB3 } from '@/lib/animation-helpers';

export function HeaderSlideContent({ firstName, formattedDate, diagnosis }: {
  firstName: string;
  formattedDate: string;
  diagnosis: ClientData['diagnosis'];
}) {
  const isMobile = useIsMobile();
  const normalizedValue = useLoopProgress(isMobile);

  const monthlyLoss = diagnosis.goals?.[2]?.monthlyLoss ?? 3600;
  const dailyLoss = diagnosis.goals?.[2]?.dailyLoss ?? 120;
  const dailyInvestment = diagnosis.goals?.[2]?.dailyInvestment ?? 400;

  const lossValue = Math.round(monthlyLoss * normalizedValue);
  const formattedLoss = lossValue.toLocaleString('pt-BR');

  const [lr, lg, lb] = lerpRGB3(normalizedValue,
    [119, 189, 172],
    [245, 158, 11],
    [239, 68, 68],
  );
  const lossColor = `rgb(${lr},${lg},${lb})`;
  const lossRgba = (a: number) => `rgba(${lr},${lg},${lb},${a})`;

  return (
    <div className="slide-content">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            smartscaile.
          </span>
        </div>
        <SectionBadge label={diagnosis.copy?.hero?.badge ?? 'Proposta Exclusiva'} />
      </div>

      <div className="accent-line mb-5" />

      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, lineHeight: 1.15, color: '#F3F4F6', fontSize: 'clamp(1.35rem, 5vw, 2rem)', letterSpacing: '-0.02em' }}>
        {(diagnosis.copy?.hero?.headline ?? 'Destrave a').split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
        ))}{' '}
        <span className="text-glow" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#77BDAC' }}>{diagnosis.copy?.hero?.accentWord ?? 'escala.'}</span>
      </h2>

      <p className="mt-4 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]">
        {(diagnosis.copy?.hero?.subtitle ?? '{firstName}, sua operação sustenta R$100k/dia. O tracking é o que está segurando.').replace('{firstName}', firstName).replace('{formattedDate}', formattedDate)}
      </p>

      {/* Loss counter */}
      <div className="mt-8 max-w-[320px]" style={{ fontFamily: 'var(--font-mono), monospace', fontVariantNumeric: 'tabular-nums' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
          <span style={{ fontSize: '0.55rem', color: '#4B5563', fontWeight: 400, letterSpacing: '0.04em' }}>
            investimento/mês
          </span>
          <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 400 }}>
            R${(monthlyLoss > 0 ? Math.round(dailyInvestment * 30) : 12000).toLocaleString('pt-BR')}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.04em', color: lossRgba(0.5) }}>
            perda estimada/mês
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
            perda acumulada
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
              R${formattedLoss}/mês
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
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
      </div>

      {/* Mouse scroll indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <div style={{ position: 'relative', width: 18, height: 28, border: '1px solid rgba(119,189,172,0.25)', borderRadius: 9 }}>
          <motion.div
            animate={{ y: [2, 10, 2], opacity: [1, 0, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 4, width: 3, height: 5, borderRadius: 2, background: '#77BDAC' }}
          />
        </div>
      </div>
    </div>
  );
}
