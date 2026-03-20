'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BarChart2, Tag, Target, Megaphone, Music, Server,
  ShoppingBag, Activity, Mail, ShoppingCart, Clock, CalendarCheck, Award,
} from 'lucide-react';
import type { ClientData } from '@/lib/clients';

// ─── Ticker ───────────────────────────────────────────────────────────────────
const tools = [
  { name: 'Google Analytics 4',  Icon: BarChart2,    color: '#E37400' },
  { name: 'Google Tag Manager',  Icon: Tag,          color: '#4285F4' },
  { name: 'Meta CAPI',           Icon: Target,       color: '#0081FB' },
  { name: 'Google Ads',          Icon: Megaphone,    color: '#FBBC04' },
  { name: 'TikTok Events API',   Icon: Music,        color: '#fe2c55' },
  { name: 'Stape Server GTM',    Icon: Server,       color: '#77BDAC' },
  { name: 'Shopify',             Icon: ShoppingBag,  color: '#95BF47' },
  { name: 'Hotjar',              Icon: Activity,     color: '#FD3A5C' },
  { name: 'Klaviyo',             Icon: Mail,         color: '#B68AD4' },
  { name: 'WooCommerce',         Icon: ShoppingCart, color: '#7F54B3' },
];
const tickerItems = [...tools, ...tools];

// ─── Purchase pool ────────────────────────────────────────────────────────────
const PURCHASE_POOL = [
  { platform: { initial: 'GA', color: '#E37400', bg: 'rgba(227,116,0,0.14)'  }, name: 'purchase',        value: 'R$ 749,00'   },
  { platform: { initial: 'M',  color: '#0081FB', bg: 'rgba(0,129,251,0.14)'  }, name: 'Purchase',        value: 'R$ 215,00'   },
  { platform: { initial: 'GA', color: '#E37400', bg: 'rgba(227,116,0,0.14)'  }, name: 'purchase',        value: 'R$ 1.247,00' },
  { platform: { initial: 'TK', color: '#fe2c55', bg: 'rgba(254,44,85,0.14)'  }, name: 'CompletePayment', value: 'R$ 89,90'    },
  { platform: { initial: 'M',  color: '#0081FB', bg: 'rgba(0,129,251,0.14)'  }, name: 'Purchase',        value: 'R$ 412,00'   },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type RowStatus = 'browser' | 'server-dedup' | 'server-only';

type Row = {
  uid: string;
  platform: { initial: string; color: string; bg: string };
  name: string;
  value: string;
  status: RowStatus;
};

// ─── Row background ───────────────────────────────────────────────────────────
function rowBg(status: RowStatus, isTop: boolean): { background: string; border: string } {
  if (!isTop) return { background: 'transparent', border: '1px solid transparent' };
  switch (status) {
    case 'browser':      return { background: 'rgba(74,222,128,0.05)',  border: '1px solid rgba(74,222,128,0.12)'  };
    case 'server-dedup': return { background: 'rgba(251,191,36,0.04)',  border: '1px solid rgba(251,191,36,0.10)'  };
    case 'server-only':  return { background: 'rgba(119,189,172,0.05)', border: '1px solid rgba(119,189,172,0.12)' };
  }
}

// ─── Source Tag ───────────────────────────────────────────────────────────────
function SourceTag({ status }: { status: RowStatus }) {
  const isServer = status === 'server-dedup' || status === 'server-only';
  return (
    <span style={{
      color: isServer ? 'rgba(119,189,172,0.45)' : 'rgba(96,165,250,0.45)',
      fontSize: '0.55rem', fontFamily: 'monospace', fontWeight: 400,
      flexShrink: 0, letterSpacing: '0.02em',
    }}>
      {isServer ? 'server-side' : 'client-side'}
    </span>
  );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: RowStatus }) {
  const isDedup     = status === 'server-dedup';
  const isRecovered = status === 'server-only';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 7px', borderRadius: '4px',
      background: isDedup ? 'rgba(251,191,36,0.10)' : isRecovered ? 'rgba(119,189,172,0.10)' : 'rgba(74,222,128,0.12)',
      border: `1px solid ${isDedup ? 'rgba(251,191,36,0.22)' : isRecovered ? 'rgba(119,189,172,0.26)' : 'rgba(74,222,128,0.26)'}`,
      color: isDedup ? '#FCD34D' : isRecovered ? '#77BDAC' : '#4ADE80',
      fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 700,
      flexShrink: 0,
    }}>
      {!isDedup && (
        <motion.span
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: isRecovered ? '#77BDAC' : '#4ADE80', flexShrink: 0 }}
        />
      )}
      {isDedup ? 'Deduplicated' : isRecovered ? 'Recovered' : 'Processed'}
    </span>
  );
}

// ─── Floating Code Background ─────────────────────────────────────────────────
const CYCLE = 30;
const CODE_SNIPPETS: Array<{
  text: string; x: string; y: string; peak: number;
  rx: number; ry: number; drift: number;
}> = [
  { text: 'gtag("event", "conversion", {\n  send_to: "AW-CONVERSION_ID" });',              x: '18%', y: '34%', peak: 0.36, rx:  14, ry: -18, drift:  60 },
  { text: 'analytics.track("conversion", {\n  source: "organic" });',                       x: '58%', y: '38%', peak: 0.32, rx: -10, ry:  16, drift: -50 },
  { text: 'window.dataLayer = window.dataLayer || [];',                                     x: '14%', y: '52%', peak: 0.30, rx:   6, ry:  22, drift:  45 },
  { text: 'const serverSideTracking =\n  fetch("/api/track", {\n    method: "POST"\n  });', x: '22%', y: '68%', peak: 0.32, rx: -16, ry: -12, drift: -70 },
  { text: 'const ecommerce = { purchase: {\n  transaction_id: "T12345" } };',               x: '54%', y: '62%', peak: 0.34, rx:  12, ry: -14, drift:  55 },
  { text: "fbq('track', 'Purchase', {\n  value: 249.00,\n  currency: 'BRL'\n});",           x: '60%', y: '45%', peak: 0.30, rx:  -8, ry:  20, drift: -45 },
  { text: '{\n  "event_name": "Purchase",\n  "action_source": "website"\n}',                x: '66%', y: '74%', peak: 0.30, rx:  18, ry:  -6, drift:  65 },
  { text: 'event_id: crypto.randomUUID()',                                                  x: '30%', y: '82%', peak: 0.30, rx: -12, ry:  14, drift: -40 },
  { text: '{ "match_keys":\n  { "em": sha256(email) } }',                                  x: '42%', y: '32%', peak: 0.28, rx:   8, ry: -20, drift:  50 },
  { text: 'server_event_time:\n  Math.floor(Date.now() / 1000)',                            x: '70%', y: '56%', peak: 0.30, rx:  -6, ry:  16, drift: -60 },
];

function FloatingCodeBg() {
  return (
    <div style={{ position: 'absolute', top: '10vh', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {CODE_SNIPPETS.map((snippet, i) => {
        const phaseDelay = -(i / CODE_SNIPPETS.length) * CYCLE;
        const d = snippet.drift;
        return (
          <motion.pre
            key={i}
            animate={{
              opacity: [0,            snippet.peak, snippet.peak,  snippet.peak * 0.08, 0            ],
              scale:   [0.52,         0.80,         1.0,           1.40,                1.70          ],
              x:       [`${d}px`,     `${d * 0.35}px`, '0px',     `${-d * 0.25}px`,   `${-d * 0.6}px`],
              filter:  ['blur(8px)', 'blur(2px)',  'blur(0px)',   'blur(4px)',           'blur(12px)'  ],
              rotateX: [snippet.rx,   snippet.rx * 0.45, snippet.rx * 0.15, 0,          0             ],
              rotateY: [snippet.ry,   snippet.ry * 0.45, snippet.ry * 0.15, 0,          0             ],
            }}
            transition={{
              times: [0, 0.2, 0.45, 0.78, 1],
              duration: CYCLE,
              delay: phaseDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: snippet.x,
              top: snippet.y,
              color: '#FFD000',
              fontSize: '0.68rem',
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontWeight: 500,
              lineHeight: 1.6,
              letterSpacing: '0.01em',
              whiteSpace: 'pre',
              userSelect: 'none',
              maxWidth: '280px',
              transformOrigin: 'center center',
              textShadow: '0 0 24px rgba(255,208,0,0.5)',
            }}
          >
            {snippet.text}
          </motion.pre>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface HeroProps {
  clientData?: ClientData | null;
}

const DEFAULT_SUBTITLE = 'Preparamos algo especial para voc\u00ea. Role para ver sua proposta personalizada.';

export default function Hero({ clientData }: HeroProps) {
  const firstName = clientData?.client?.name?.split(' ')[0];
  const heroCopy = clientData?.diagnosis?.copy?.pageHero;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const defaultTickerNames = tools.map(t => t.name);
  const tickerNames = heroCopy?.ticker ?? defaultTickerNames;
  const tickerDoubled = [...tickerNames, ...tickerNames];
  const defaultDoubled = [...defaultTickerNames, ...defaultTickerNames];
  const [rows, setRows] = useState<Row[]>([
    { uid: 'init-0', platform: PURCHASE_POOL[0].platform, name: PURCHASE_POOL[0].name, value: PURCHASE_POOL[0].value, status: 'browser'      },
    { uid: 'init-1', platform: PURCHASE_POOL[0].platform, name: PURCHASE_POOL[0].name, value: PURCHASE_POOL[0].value, status: 'server-dedup' },
    { uid: 'init-2', platform: PURCHASE_POOL[2].platform, name: PURCHASE_POOL[2].name, value: PURCHASE_POOL[2].value, status: 'server-only'  },
  ]);

  const [recoveredCount, setRecoveredCount] = useState(10);
  const [recoveryPulse, setRecoveryPulse] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sceneIdxRef = useRef(0);

  useEffect(() => {
    function schedule(fn: () => void, delay: number) {
      const t = setTimeout(fn, delay);
      timeoutsRef.current.push(t);
    }

    function runScene() {
      const idx = sceneIdxRef.current++;
      const event = PURCHASE_POOL[idx % PURCHASE_POOL.length];
      const isDedup = Math.random() > 0.3;
      const base = `s${idx}`;

      if (isDedup) {
        setRows(prev => [
          { uid: `${base}-browser`, ...event, status: 'browser' as RowStatus },
          ...prev.slice(0, 2),
        ]);

        schedule(() => {
          setRows(prev => [
            prev[0],
            { uid: `${base}-srv`, ...event, status: 'server-dedup' as RowStatus },
            ...prev.slice(1, 2),
          ]);
        }, 1400);

        schedule(runScene, 5400);
      } else {
        setRows(prev => [
          { uid: `${base}-srv`, ...event, status: 'server-only' as RowStatus },
          ...prev.slice(0, 2),
        ]);
        setRecoveredCount(prev => prev + 1);
        setRecoveryPulse(true);
        setTimeout(() => setRecoveryPulse(false), 300);
        schedule(runScene, 3400);
      }
    }

    schedule(runScene, 1600);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <section
      suppressHydrationWarning
      className="select-none"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px 40px', overflow: 'hidden' }}
    >
      {/* Floating code snippets background */}
      <FloatingCodeBg />

      <div className="bg-mesh-subtle" style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center',
          gap: '6px', marginBottom: '12px', padding: '5px 14px', borderRadius: '9999px',
          border: '1px solid rgba(119,189,172,0.2)',
          background: 'rgba(119,189,172,0.05)',
          color: '#77BDAC',
          fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span className="live-dot" />
        {heroCopy?.badge ?? 'Server-Side Tracking Ativo'}
      </motion.div>

      {/* ── Tools Ticker ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '560px', overflow: 'hidden', marginBottom: '24px', WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}
      >
        <div className="animate-ticker">
          {(mounted ? tickerDoubled : defaultDoubled).map((name, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 14px', borderRadius: '9999px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ color: '#6B7280', fontSize: '0.65rem', fontWeight: 400 }}>{name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '640px', margin: '0 auto', padding: '0', textAlign: 'center' }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif"
          style={{ fontWeight: 700, lineHeight: 1.12, color: '#F3F4F6', marginBottom: '18px', fontSize: 'clamp(1.8rem, 7vw, 2.8rem)' }}
        >
          {firstName ? (
            <>
              {firstName},{' '}
              <span className="text-glow" style={{ color: '#77BDAC' }}>vamos escalar.</span>
            </>
          ) : (
            <>
              O Diferencial das
              <br />
              Campanhas de{' '}
              <span className="text-glow" style={{ color: '#77BDAC' }}>Alta performance.</span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          suppressHydrationWarning
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          style={{ color: '#9CA3AF', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}
        >
          {firstName
            ? (heroCopy?.subtitle ?? DEFAULT_SUBTITLE)
            : 'Agende um diagnóstico estratégico gratuito. Em 30 minutos identificamos o gargalo da sua estrutura de tracking.'}
        </motion.p>

        {/* ── 3 Balloons above live events ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: '4px', position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '56px' }}>
            {[
              { Icon: Activity, text: heroCopy?.balloons?.[0] ?? '+95% de precisão'  },
              { Icon: Server,   text: heroCopy?.balloons?.[1] ?? 'Melhor atribuição' },
              { Icon: Award,    text: heroCopy?.balloons?.[2] ?? 'Redução de CPA'    },
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
                  <div style={{ position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid rgba(119,189,172,0.2)' }} />
                  {/* Tail UP - fill */}
                  <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #0d0d0d' }} />
                  <motion.div
                    animate={{ boxShadow: ['0 0 0 1px rgba(119,189,172,0.15)', '0 0 0 1px rgba(119,189,172,0.4)', '0 0 0 1px rgba(119,189,172,0.15)'] }}
                    transition={{ duration: 3 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px', background: '#0d0d0d',
                      borderRadius: '10px',
                      fontSize: '0.6rem', color: '#9CA3AF', lineHeight: 1.4, whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={9} color="rgba(119,189,172,0.7)" strokeWidth={2} />
                    {text}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 3D Live Events Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '460px', margin: '0 auto', position: 'relative', paddingBottom: '40px', transform: 'translateX(5%)' }}
        >
          {/* Card with 3D perspective */}
          <div
            style={{ borderRadius: '16px', border: '1px solid #27272a', background: '#0a0a0a', overflow: 'hidden', textAlign: 'left', transform: 'perspective(900px) rotateY(-8deg) rotateX(5deg)', transformOrigin: 'center center', boxShadow: '28px 28px 64px rgba(0,0,0,0.6), -4px -4px 24px rgba(0,0,0,0.3), 0 0 48px rgba(119,189,172,0.04)', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(900px) rotateY(-4deg) rotateX(2deg) scale(1.01)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(900px) rotateY(-8deg) rotateX(5deg)'; }}
          >
            {/* Terminal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1a1a1a', background: '#080808' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5F56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C93F' }} />
                <span style={{ marginLeft: '8px', color: '#4B5563', fontSize: '0.65rem', fontFamily: 'monospace' }}>live-events.js</span>
              </div>
              <span style={{ color: '#6B7280', fontSize: '0.6rem' }}>Server-side events</span>
            </div>

            {/* Stream header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #111' }}>
              <span style={{ color: '#9CA3AF', fontSize: '0.72rem', fontFamily: 'monospace' }}>Live event stream</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="live-dot" />
                <span style={{ color: '#77BDAC', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>CONNECTED</span>
              </div>
            </div>

            {/* ── Animated event rows ── */}
            <div style={{ padding: '8px 12px', minHeight: '162px', overflow: 'hidden' }}>
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((row, i) => {
                  const bg = rowBg(row.status, i === 0);
                  const isDedup = row.status === 'server-dedup';
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
                        marginLeft: isDedup ? '18px' : '0',
                        ...bg,
                      }}
                    >
                      {/* └ knee arrow — only on server-dedup */}
                      {isDedup && (
                        <span style={{
                          position: 'absolute',
                          left: '-14px',
                          color: '#374151',
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          userSelect: 'none',
                        }}>
                          └
                        </span>
                      )}

                      {/* Platform badge */}
                      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: row.platform.bg, border: `1px solid ${row.platform.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: row.platform.color, fontSize: '0.55rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        {row.platform.initial}
                      </div>

                      {/* Event name */}
                      <span style={{ color: '#9CA3AF', fontSize: '0.72rem', fontFamily: 'monospace', flex: 1 }}>
                        {row.name}
                      </span>

                      {/* Source + Status chips */}
                      <SourceTag status={row.status} />
                      <StatusChip status={row.status} />

                      {/* Value */}
                      <span style={{ color: '#77BDAC', fontWeight: 700, fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums' }}>
                        {row.value}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Card footer */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['GA4', 'TikTok', 'Meta'].map((logo) => (
                  <span key={logo} style={{ padding: '2px 8px', borderRadius: '4px', background: '#111', border: '1px solid #1f1f1f', color: '#6B7280', fontSize: '0.6rem', fontWeight: 600 }}>
                    {logo}
                  </span>
                ))}
              </div>
              <span style={{ color: '#4B5563', fontSize: '0.6rem' }}>3 platforms</span>
            </div>
          </div>

          {/* Badges wrapper — EMQ + eventos recuperados lado a lado */}
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
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: '-5px', borderRadius: '11px', background: 'rgba(119,189,172,0.12)' }}
                />
                <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'rgba(119,189,172,0.09)', border: '1px solid rgba(119,189,172,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={12} color="#77BDAC" strokeWidth={2} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', lineHeight: 1 }}>
                  <span style={{ color: '#77BDAC', fontWeight: 700, fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>EMQ</span>
                  <span style={{ color: '#77BDAC', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>9.4</span>
                  <span style={{ color: 'rgba(119,189,172,0.5)', fontWeight: 600, fontSize: '0.6rem', fontFamily: 'monospace' }}>/10</span>
                </div>
                <div style={{ color: '#374151', fontSize: '0.45rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                  Event Match Quality
                </div>
              </div>
            </motion.div>

            {/* Eventos recuperados — ligeiramente menor */}
            <motion.div
              animate={{ scale: recoveryPulse ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="animate-float"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '12px',
                background: recoveryPulse ? 'rgba(119,189,172,0.12)' : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.8) contrast(1.1)',
                border: '1px solid rgba(119,189,172,0.15)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                transition: 'background 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ scale: [1, 1.7], opacity: [0.2, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                  style={{ position: 'absolute', inset: '-4px', borderRadius: '9px', background: 'rgba(119,189,172,0.12)' }}
                />
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(119,189,172,0.09)', border: '1px solid rgba(119,189,172,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={12} color="#77BDAC" strokeWidth={2} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <motion.div
                  key={recoveredCount}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '1px', lineHeight: 1 }}
                >
                  <span style={{ color: '#77BDAC', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>{recoveredCount}</span>
                </motion.div>
                <div style={{ color: '#374151', fontSize: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                  eventos recuperados
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '36px', gap: '8px' }}
        >
          <span style={{ color: '#374151', fontSize: '0.58rem', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {clientData ? 'role para ver sua proposta' : 'scroll'}
          </span>
          {/* Mouse outline */}
          <div style={{ position: 'relative', width: '18px', height: '28px', border: '1px solid rgba(119,189,172,0.25)', borderRadius: '9px' }}>
            <motion.div
              animate={{ y: [2, 13, 2], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '5px', borderRadius: '2px', background: '#77BDAC' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
