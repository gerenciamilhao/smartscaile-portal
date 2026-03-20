'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  AlertTriangle, XCircle, TrendingUp, Target, BarChart2,
} from 'lucide-react';
import SlideToUnlock, { type SlideToUnlockHandle } from '@/components/ui/SlideToUnlock';
import type { ClientData } from '@/lib/clients';
import { PURCHASE_POOL_EXTENDED as PURCHASE_POOL } from '@/lib/purchase-pool';

export interface PainHeroHandle {
  resetSlider: () => void;
}

interface PainHeroProps {
  onUnlock: () => void;
  clientData?: ClientData | null;
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
const DEFAULT_TICKER_NAMES = [
  'Hotmart', 'Kiwify', 'Meta Pixel', 'Google Ads',
  'Google Analytics 4', 'TikTok Pixel', 'Facebook CAPI', 'Elementor',
];

// ─── Types ────────────────────────────────────────────────────────────────────
type PainRowStatus = 'processed' | 'blocked';

type PainRow = {
  uid: string;
  platform: { initial: string; color: string; bg: string };
  name: string;
  value: string;
  status: PainRowStatus;
  failLabel?: string;
  blockReason?: string;
};

const FAIL_LABELS = ['BLOCKED', 'FAILED', 'LOST'] as const;
const BLOCK_REASONS = ['ITP blocked', 'Cookie expired', 'Ad blocker', 'Safari restriction', 'iOS 17 blocked', '3rd-party rejected'];

// ─── Row background (mirrors Hero's rowBg) ──────────────────────────────────
function rowBg(status: PainRowStatus, isTop: boolean): { background: string; border: string } {
  if (!isTop) return { background: 'transparent', border: '1px solid transparent' };
  if (status === 'processed') return { background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.12)' };
  return { background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.10)' };
}

// ─── Source Tag (always client-side) ────────────────────────────────────────
function SourceTag() {
  return (
    <span style={{
      color: 'rgba(96,165,250,0.45)',
      fontSize: '0.55rem', fontFamily: 'monospace', fontWeight: 400,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>
      client-side
    </span>
  );
}

// ─── Status Chip (mirrors Hero's StatusChip) ────────────────────────────────
function StatusChip({ status, failLabel }: { status: PainRowStatus; failLabel?: string }) {
  if (status === 'processed') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 7px', borderRadius: '4px',
        background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.26)',
        color: '#4ADE80', fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 700,
        flexShrink: 0,
      }}>
        <motion.span
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }}
        />
        Processed
      </span>
    );
  }

  const label = failLabel || 'BLOCKED';
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    BLOCKED: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
    FAILED:  { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)', text: '#fb923c' },
    LOST:    { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)', text: '#ef4444' },
  };
  const c = colors[label] || colors.BLOCKED;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 7px', borderRadius: '4px',
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 700,
      flexShrink: 0,
    }}>
      <XCircle size={8} />
      {label}
    </span>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
const PainHero = forwardRef<PainHeroHandle, PainHeroProps>(function PainHero({ onUnlock, clientData }, ref) {
  const painCopy = clientData?.diagnosis?.copy?.painHero;
  const sliderRef = useRef<SlideToUnlockHandle>(null);

  useImperativeHandle(ref, () => ({
    resetSlider() {
      sliderRef.current?.reset();
    },
  }), []);

  const [rows, setRows] = useState<PainRow[]>([
    { uid: 'init-0', ...PURCHASE_POOL[0], status: 'processed' },
    { uid: 'init-1', ...PURCHASE_POOL[1], status: 'blocked', failLabel: 'BLOCKED', blockReason: 'ITP blocked' },
    { uid: 'init-2', ...PURCHASE_POOL[2], status: 'processed' },
  ]);

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const CONTENT_HEIGHT = 860;
    setZoom(Math.min(1, window.innerHeight / CONTENT_HEIGHT));
  }, []);

  const [lostCount, setLostCount] = useState(10);
  const [counterPulse, setCounterPulse] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sceneIdxRef = useRef(0);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timeoutsRef.current.push(t);
  }, []);

  useEffect(() => {
    function runScene() {
      const idx = sceneIdxRef.current++;
      const event = PURCHASE_POOL[idx % PURCHASE_POOL.length];
      const isFail = Math.random() > 0.65; // ~35% fail
      const base = `s${idx}`;

      if (isFail) {
        const failLabel = FAIL_LABELS[Math.floor(Math.random() * FAIL_LABELS.length)];
        const blockReason = BLOCK_REASONS[Math.floor(Math.random() * BLOCK_REASONS.length)];

        setRows(prev => [
          { uid: `${base}-fail`, ...event, status: 'blocked' as PainRowStatus, failLabel, blockReason },
          ...prev.slice(0, 2),
        ]);

        setLostCount(prev => prev + 1);
        setCounterPulse(true);
        setTimeout(() => setCounterPulse(false), 300);

        schedule(runScene, 3200 + Math.random() * 600);
      } else {
        setRows(prev => [
          { uid: `${base}-ok`, ...event, status: 'processed' as PainRowStatus },
          ...prev.slice(0, 2),
        ]);

        schedule(runScene, 2800 + Math.random() * 600);
      }
    }

    schedule(runScene, 2000);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [schedule]);

  return (
    <motion.section
      key="pain-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-pain-mesh select-none"
      style={{
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient red glow — central top only */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'rgba(239,68,68,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div className="bg-mesh-subtle" style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />


      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '640px', margin: '0 auto', padding: '60px 0 40px', textAlign: 'center', zoom: zoom }}>

        {/* ─── Badge ─── */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
          {/* Danger icon — flutuando à direita em perspectiva */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ position: 'absolute', top: '-22px', right: '-18px', pointerEvents: 'none' }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              borderRadius: '8px',
              background: 'rgba(239,68,68,0.09)',
              border: '1px solid rgba(239,68,68,0.22)',
              transform: 'rotate(20deg)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <AlertTriangle size={11} color="#EF4444" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Main badge — com dot em vez do triângulo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="animate-pulse-pain" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '9999px',
              border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
              color: '#EF4444', fontSize: '0.65rem', fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <motion.span
                animate={{ opacity: [1, 0.35, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }}
              />
              {painCopy?.badge ?? 'Client-Side Tracking'}
            </div>
          </motion.div>
        </div>

        {/* ─── Ticker ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            width: '100%', maxWidth: '560px', overflow: 'hidden', marginBottom: '24px', margin: '0 auto 24px',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <div className="animate-ticker">
            {[...(painCopy?.ticker ?? DEFAULT_TICKER_NAMES), ...(painCopy?.ticker ?? DEFAULT_TICKER_NAMES)].map((name, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 14px', borderRadius: '9999px', background: 'transparent', border: '1px solid rgba(239,68,68,0.1)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <span style={{ color: '#6B7280', fontSize: '0.65rem', fontWeight: 400 }}>{name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Headline ─── */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif"
          style={{
            fontWeight: 700, lineHeight: 1.12, color: '#F3F4F6',
            marginBottom: '18px', fontSize: 'clamp(1.8rem, 7vw, 2.8rem)',
          }}
        >
          {painCopy?.headline ? (
            (() => {
              const parts = painCopy.headline.split(/(\*[^*]+\*)/g);
              return parts.map((part: string, i: number) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return <span key={i} className="text-glow-red" style={{ color: '#EF4444' }}>{part.slice(1, -1)}</span>;
                }
                return <span key={i}>{part}</span>;
              });
            })()
          ) : (
            <>
              Cada dia sem{' '}
              <span className="text-glow-red" style={{ color: '#EF4444' }}>Server-Side</span>
              <br />
              é dinheiro perdido.
            </>
          )}
        </motion.h1>

        {/* ─── Subtitle ─── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          style={{ color: '#9CA3AF', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}
        >
          {painCopy?.subtitle ?? 'Eventos bloqueados, conversões perdidas. Veja o impacto real no seu investimento.'}
        </motion.p>

        {/* ── 3 mini balões acima do card (tema vermelho) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: '4px', position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '56px' }}>
            {[
              { Icon: XCircle,   text: painCopy?.balloons?.[0] ?? 'Conversões invisíveis' },
              { Icon: BarChart2, text: painCopy?.balloons?.[1] ?? 'Má atribuição'      },
              { Icon: Target,    text: painCopy?.balloons?.[2] ?? 'Dificuldade em escalar' },
            ].map(({ Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                style={{ display: 'flex', justifyContent: 'center', padding: '0 10px' }}
              >
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  {/* Tail UP - border */}
                  <div style={{ position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid rgba(239,68,68,0.2)' }} />
                  {/* Tail UP - fill */}
                  <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #0a0505' }} />
                  <motion.div
                    animate={{ boxShadow: ['0 0 0 1px rgba(239,68,68,0.15)', '0 0 0 1px rgba(239,68,68,0.4)', '0 0 0 1px rgba(239,68,68,0.15)'] }}
                    transition={{ duration: 3 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px', background: '#0a0505',
                      borderRadius: '10px',
                      fontSize: '0.6rem', color: '#9CA3AF', lineHeight: 1.4, whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={9} color="rgba(239,68,68,0.7)" strokeWidth={2} />
                    {text}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Terminal Card (identical structure to Hero) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '460px', margin: '0 auto', position: 'relative', paddingBottom: '40px', transform: 'translateX(5%)' }}
        >
          {/* Card with 3D perspective (same as Hero) */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid rgba(239,68,68,0.15)',
              background: '#0a0a0a',
              overflow: 'hidden',
              textAlign: 'left',
              transform: 'perspective(900px) rotateY(-8deg) rotateX(5deg)',
              transformOrigin: 'center center',
              boxShadow: '28px 28px 64px rgba(0,0,0,0.6), -4px -4px 24px rgba(0,0,0,0.3), 0 0 48px rgba(239,68,68,0.04)',
              transition: 'transform 0.4s ease, box-shadow 0.4s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(900px) rotateY(-4deg) rotateX(2deg) scale(1.01)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(900px) rotateY(-8deg) rotateX(5deg)'; }}
          >
            {/* Terminal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(239,68,68,0.08)', background: '#080505' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5F56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C93F' }} />
                <span style={{ marginLeft: '8px', color: '#4B5563', fontSize: '0.65rem', fontFamily: 'monospace' }}>live-events.js</span>
              </div>
              <span className="animate-blocked-flash" style={{ color: '#EF4444', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                ISSUES DETECTED
              </span>
            </div>

            {/* Stream header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ color: '#9CA3AF', fontSize: '0.72rem', fontFamily: 'monospace' }}>Event stream</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="live-dot-red" />
                <span style={{ color: '#EF4444', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>DEGRADED</span>
              </div>
            </div>

            {/* ── Animated event rows (same structure as Hero) ── */}
            <div style={{ padding: '8px 12px', minHeight: '162px', overflow: 'hidden' }}>
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((row, i) => {
                  const bg = rowBg(row.status, i === 0);
                  const isFail = row.status === 'blocked';
                  return (
                    <motion.div
                      key={row.uid}
                      layout
                      initial={{ opacity: 0, y: -18, scale: 0.96 }}
                      animate={{
                        opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.3,
                        y: 0,
                        scale: i === 0 ? 1 : i === 1 ? 0.988 : 0.975,
                      }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        marginBottom: '5px',
                        position: 'relative',
                        ...bg,
                      }}
                    >
                      {/* Platform badge */}
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '7px',
                        background: row.platform.bg, border: `1px solid ${row.platform.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: row.platform.color, fontSize: '0.55rem', fontWeight: 700, fontFamily: 'monospace',
                        opacity: isFail ? 0.5 : 1,
                      }}>
                        {row.platform.initial}
                      </div>

                      {/* Event name */}
                      <span style={{
                        color: isFail ? '#6B7280' : '#9CA3AF',
                        fontSize: '0.72rem', fontFamily: 'monospace', flex: 1,
                        textDecoration: isFail ? 'line-through' : 'none',
                        textDecorationColor: 'rgba(239,68,68,0.3)',
                      }}>
                        {row.name}
                      </span>

                      {/* Source + Status chips (same position as Hero) */}
                      <SourceTag />
                      <StatusChip status={row.status} failLabel={row.failLabel} />

                      {/* Value */}
                      <span style={{
                        color: isFail ? '#4B5563' : '#77BDAC',
                        fontWeight: 700, fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums',
                        textDecoration: isFail ? 'line-through' : 'none',
                        textDecorationColor: 'rgba(239,68,68,0.3)',
                      }}>
                        {row.value}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Card footer (same as Hero) */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['GA4', 'TikTok', 'Meta'].map((logo) => (
                  <span key={logo} style={{
                    padding: '2px 8px', borderRadius: '4px',
                    background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.08)',
                    color: '#6B7280', fontSize: '0.6rem', fontWeight: 600,
                  }}>
                    {logo}
                  </span>
                ))}
              </div>
              <span style={{ color: '#EF4444', fontSize: '0.6rem', fontFamily: 'monospace' }}>3 platforms affected</span>
            </div>
          </div>

          {/* Badges wrapper — EMQ + eventos perdidos lado a lado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', bottom: '-6px', left: '-16px', display: 'flex', gap: '6px', zIndex: 10 }}
          >
            {/* EMQ badge */}
            <motion.div
              className="animate-float"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                border: '1px solid rgba(239,68,68,0.15)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                  style={{ position: 'absolute', inset: '-5px', borderRadius: '11px', background: 'rgba(239,68,68,0.12)' }}
                />
                <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={12} color="#EF4444" strokeWidth={2} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', lineHeight: 1 }}>
                  <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>EMQ</span>
                  <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>4.5</span>
                  <span style={{ color: 'rgba(239,68,68,0.5)', fontWeight: 600, fontSize: '0.6rem', fontFamily: 'monospace' }}>/10</span>
                </div>
                <div style={{ color: '#4B5563', fontSize: '0.45rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                  Event Match Quality
                </div>
              </div>
            </motion.div>

            {/* Eventos perdidos — ligeiramente menor */}
            <motion.div
              animate={{ scale: counterPulse ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="animate-float"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '12px',
                background: counterPulse ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                border: '1px solid rgba(239,68,68,0.15)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                transition: 'background 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: '-4px', borderRadius: '9px', background: 'rgba(239,68,68,0.12)' }}
                />
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={12} color="#EF4444" strokeWidth={2} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <motion.div
                  key={lostCount}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '1px', lineHeight: 1 }}
                >
                  <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>{lostCount}</span>
                </motion.div>
                <div style={{ color: '#4B5563', fontSize: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                  eventos perdidos
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>


        {/* ─── Slider ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{ marginTop: '56px' }}
        >
          <SlideToUnlock ref={sliderRef} onUnlock={onUnlock} />
        </motion.div>
      </div>
    </motion.section>
  );
});

export default PainHero;
