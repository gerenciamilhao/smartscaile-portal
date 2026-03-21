'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ClientData } from '@/lib/clients';
import { MessageCircle } from 'lucide-react';
import { renderAccentText } from '@/lib/animation-helpers';
import type { TerminalLine } from '@/lib/useTerminalTyping';

const CTA_LINES: TerminalLine[] = [
  { text: 'smartscaile deploy --client kim-paiffer', prefix: '$', color: '#6B7280' },
  { text: '1ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 500 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'kick-off liberado', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'configurando server-side...', prefix: ' ', color: '#4B5563', delay: 400 },
  { text: 'GTM first-party domain', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Custom Loader (antiblock)', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Cookie Keeper', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Dedup browser x server', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'Purchase via Webhook', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'UTM tracking & backup', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: 'First Touch + Last Touch', prefix: '  →', color: '#77BDAC', delay: 100 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: '2ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 400 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'go live → tracking ativo', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'teste A/B pixel antigo vs novo (30 dias)', prefix: '>', color: '#F59E0B', delay: 300 },
  { text: '40 dias de acompanhamento + validação', prefix: '✓', color: '#77BDAC', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: '3ª parcela confirmada', prefix: '>', color: '#9CA3AF', delay: 400 },
  { text: 'verificando pagamento...', prefix: ' ', color: '#4B5563', delay: 1200 },
  { text: 'estrutura validada', prefix: '✓', color: '#22C55E', delay: 300 },
  { text: '', prefix: ' ', color: '#1a1a1a', delay: 200 },
  { text: 'ciclo completo', prefix: '!', color: '#22C55E', delay: 600 },
];

const LOCK_OPEN_LINE = 3;

export function CTASlideContent({ diagnosis, scrollYProgress, range }: {
  diagnosis: ClientData['diagnosis'];
  scrollYProgress: MotionValue<number>;
  range: [number, number];
}) {
  const [visibleChars, setVisibleChars] = useState<number[]>(CTA_LINES.map(() => 0));
  const [activeLine, setActiveLine] = useState(0);
  const [loopKey, setLoopKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slideOpacity = useTransform(scrollYProgress, [range[0], range[0] + (range[1] - range[0]) * 0.30], [0, 1]);
  useEffect(() => {
    const unsubscribe = slideOpacity.on('change', (v) => {
      setIsVisible(v > 0.5);
    });
    return unsubscribe;
  }, [slideOpacity]);

  const lockOpen = activeLine >= LOCK_OPEN_LINE;
  const lockColor = lockOpen ? '#22C55E' : '#EF4444';
  const accentColor = lockOpen ? '#77BDAC' : '#EF4444';
  const accentRgba = (a: number) => lockOpen ? `rgba(119,189,172,${a})` : `rgba(239,68,68,${a})`;

  const resetAndLoop = useCallback(() => {
    setVisibleChars(CTA_LINES.map(() => 0));
    setActiveLine(0);
    setLoopKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (activeLine >= CTA_LINES.length) {
      const holdTimer = setTimeout(resetAndLoop, 1500);
      return () => clearTimeout(holdTimer);
    }
    const line = CTA_LINES[activeLine];
    const fullText = `${line.prefix ?? '>'} ${line.text}`;
    const charCount = visibleChars[activeLine];
    if (charCount >= fullText.length) {
      const nextTimer = setTimeout(() => setActiveLine((a) => a + 1), line.delay ?? 120);
      return () => clearTimeout(nextTimer);
    }
    const speed = 22 + Math.random() * 18;
    const charTimer = setTimeout(() => {
      setVisibleChars((prev) => { const next = [...prev]; next[activeLine] = charCount + 1; return next; });
    }, speed);
    return () => clearTimeout(charTimer);
  }, [activeLine, visibleChars, loopKey, resetAndLoop, isVisible]);

  return (
    <>
      <div
        style={{
          width: 56, height: 56, borderRadius: '50%',
          border: `1px solid ${lockColor}30`,
          background: `${lockColor}0A`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          transition: 'all 0.8s ease',
          boxShadow: `0 0 20px ${lockColor}15, 0 0 40px ${lockColor}08`,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: `1px solid ${lockColor}25`,
          background: `${lockColor}0D`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.8s ease',
        }}>
          {lockOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.6s ease' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.6s ease' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )}
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(1.75rem, 5.5vw, 2.4rem)', color: '#F3F4F6', lineHeight: 1.2, letterSpacing: '-0.025em', maxWidth: 480, margin: '0 auto 10px' }}>
        {renderAccentText(diagnosis.copy?.cta?.headline ?? 'O *resultado* é a garantia.', accentColor)}
      </h2>
      <p style={{ fontSize: '0.875rem', color: lockOpen ? '#9CA3AF' : '#6B7280', lineHeight: 1.55, maxWidth: 380, margin: '0 auto 14px', transition: 'color 0.6s ease' }}>
        {diagnosis.copy?.cta?.subtitle ?? 'Teste A/B por 30 dias. Pixel antigo vs. novo. O resultado decide. Setup se paga em 2 semanas.'}
      </p>

      <div style={{ maxWidth: 540, margin: '0 auto 20px', textAlign: 'left' }}>
        <div style={{
          borderRadius: 14,
          background: 'linear-gradient(180deg, rgba(12,12,12,0.95) 0%, rgba(5,5,5,0.92) 100%)',
          border: `1px solid ${accentRgba(0.12)}`,
          overflow: 'hidden',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.7rem',
          lineHeight: 1.8,
          boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 1px ${accentRgba(0.15)}, inset 0 1px 0 rgba(255,255,255,0.03)`,
          transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
        }}>
          <div style={{
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.015)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', opacity: 0.65 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', opacity: 0.65 }} />
            </div>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '0.5rem', color: '#374151', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              smartscaile — deploy
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: lockColor, transition: 'background 0.8s ease' }}
              />
              <span style={{ fontSize: '0.45rem', color: lockOpen ? '#4B5563' : '#374151', letterSpacing: '0.05em', transition: 'color 0.8s ease' }}>
                {lockOpen ? 'active' : 'idle'}
              </span>
            </div>
          </div>

          <div style={{ padding: '14px 20px' }}>
            {CTA_LINES.map((line, i) => {
              const isBlank = line.text === '';
              const fullText = isBlank ? '' : `${line.prefix ?? '>'} ${line.text}`;
              const chars = visibleChars[i];
              const notYet = i > activeLine && chars === 0;
              const displayed = fullText.slice(0, chars);
              const showCursor = i === activeLine && activeLine < CTA_LINES.length && !isBlank;

              if (isBlank) {
                return <div key={`${loopKey}-${i}`} style={{ height: '0.6em' }} />;
              }

              return (
                <div key={`${loopKey}-${i}`} style={{
                  color: line.color ?? '#77BDAC',
                  height: '1.55em',
                  visibility: notYet ? 'hidden' : 'visible',
                  display: 'flex', alignItems: 'center',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                  <span style={{
                    width: 20, flexShrink: 0, textAlign: 'right', marginRight: 12,
                    color: '#1f1f1f', fontSize: '0.55rem', userSelect: 'none',
                  }}>
                    {i + 1}
                  </span>
                  <span>
                    {notYet ? '\u00A0' : displayed}
                    {showCursor && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ color: accentColor, marginLeft: 1, transition: 'color 0.8s ease' }}
                      >
                        ▌
                      </motion.span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/351934157309"
        target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: accentColor, border: `1px solid ${accentRgba(0.25)}`, borderRadius: 10, padding: '9px 20px', textDecoration: 'none', transition: 'all 0.6s ease' }}
      >
        <MessageCircle size={14} strokeWidth={1.5} />
        Fechar proposta
      </a>
    </>
  );
}
