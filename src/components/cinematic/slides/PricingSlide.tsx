'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { PricingPlan } from '@/lib/clients';
import { getServiceIconName } from '@/lib/animation-helpers';
import {
  Settings, Server, Target, MessageCircle, Database, Webhook,
  BarChart2, Zap, Headphones, ShieldCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  Settings, Server, Target, MessageCircle, Database, Webhook,
  BarChart2, Zap, Headphones, ShieldCheck,
};

function getServiceIcon(title: string) {
  return iconMap[getServiceIconName(title)] || ShieldCheck;
}

function MetaLogo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ opacity }}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
    </svg>
  );
}

function GoogleAdsLogo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
      <path d="M3.9998 22.9291C1.7908 22.9291 0 21.1383 0 18.9293s1.7908-3.9998 3.9998-3.9998 3.9998 1.7908 3.9998 3.9998-1.7908 3.9998-3.9998 3.9998z" fill="#4285F4"/>
      <path d="M23.4641 16.9287L15.4632 3.072C14.3586 1.1587 11.9121.5028 9.9988 1.6074S7.4295 5.1585 8.5341 7.0718l8.0009 13.8567c1.1046 1.9133 3.5511 2.5679 5.4644 1.4646 1.9134-1.1046 2.568-3.5511 1.4647-5.4644z" fill="#34A853"/>
      <path d="M7.5137 4.8438L1.5645 15.1484A4.5 4.5 0 0 1 4 14.4297c2.5597-.0075 4.6248 2.1585 4.4941 4.7148l3.2168-5.5723-3.6094-6.25c-.4499-.7793-.6322-1.6394-.5878-2.4784z" fill="#FBBC04"/>
    </svg>
  );
}

function GA4Logo({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E37400" style={{ opacity }}>
      <path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z"/>
    </svg>
  );
}

function PricingCard({ plan, opacity, y }: {
  plan: PricingPlan;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const formattedAmount = plan.amount.toLocaleString('pt-BR');
  const filtered = plan.services.filter(s => !s.title.toLowerCase().includes('smartlink'));
  const coreServices = filtered.slice(0, -1);
  const highlightService = filtered[filtered.length - 1];

  return (
    <motion.div style={{ opacity, y, width: '100%', maxWidth: 480 }}>
      <div
        style={{
          borderRadius: 14,
          border: '1px solid rgba(119,189,172,0.20)',
          background: 'rgba(8, 14, 12, 0.97)',
          overflow: 'hidden',
          boxShadow: '0 24px 50px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(119,189,172,0.12)',
        }}
      >
        <div style={{
          padding: '10px 18px',
          borderBottom: '1px solid rgba(119,189,172,0.12)',
          background: 'rgba(8, 16, 13, 0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
            <span style={{ marginLeft: 10, fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem', color: 'rgba(119,189,172,0.7)' }}>
              proposta-final.md
            </span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 99,
            background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.30)',
            fontFamily: 'var(--font-mono), monospace', fontSize: '0.58rem',
            fontWeight: 700, color: '#22c55e', letterSpacing: '0.05em',
          }}>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
            />
            APROVADO
          </span>
        </div>

        <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono), monospace', fontSize: '0.6rem', fontWeight: 600,
            color: 'rgba(119,189,172,0.65)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {plan.name}
          </span>
        </div>

        <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1, color: '#77BDAC', opacity: 0.6 }}>
              {plan.installments}x
            </span>
            <span style={{
              fontFamily: 'var(--font-mono), monospace', fontWeight: 700,
              fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', lineHeight: 1, color: '#77BDAC',
              letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
            }}>
              R${formattedAmount}
            </span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: 'rgba(119,189,172,0.06)', border: '1px solid rgba(119,189,172,0.15)',
              fontFamily: 'var(--font-mono), monospace', fontSize: '0.55rem', fontWeight: 600,
              color: 'rgba(119,189,172,0.7)', letterSpacing: '0.08em',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#77BDAC', opacity: 0.6 }} />
              SEM JUROS
            </span>
          </div>
        </div>

        <div style={{ padding: '12px 20px 18px', display: 'flex', justifyContent: 'center' }}>
          <span style={{
            padding: '5px 14px', borderRadius: 6,
            background: 'rgba(119,189,172,0.08)', border: '1px solid rgba(119,189,172,0.20)',
            fontSize: '0.65rem', fontWeight: 600, color: 'rgba(119,189,172,0.85)', letterSpacing: '0.02em',
          }}>
            {plan.discount}
          </span>
        </div>

        <div style={{
          padding: '10px 20px', fontSize: '0.6rem', fontWeight: 600,
          color: 'rgba(119,189,172,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase',
          textAlign: 'center', borderTop: '1px solid rgba(119,189,172,0.10)',
        }}>
          O que está incluso
        </div>

        <div style={{ padding: '6px 16px 0' }}>
          {coreServices.map((service, i) => {
            const Icon = getServiceIcon(service.title);
            return (
              <div key={i} style={{
                marginBottom: 5, padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  flexShrink: 0, marginTop: 2, width: 28, height: 28, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(119,189,172,0.06)', border: '1px solid rgba(119,189,172,0.10)',
                }}>
                  <Icon size={14} color="rgba(119,189,172,0.55)" strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.78rem', color: '#E5E7EB', lineHeight: 1.5, fontWeight: 500 }}>
                    {service.title}
                  </div>
                  {service.detail && (
                    <div style={{ fontSize: '0.65rem', color: 'rgba(119,189,172,0.55)', marginTop: 2, lineHeight: 1.4 }}>
                      {service.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {highlightService && (
          <div style={{ padding: '6px 16px 18px' }}>
            <div style={{
              marginTop: 4, padding: '12px 14px', borderRadius: 8,
              background: 'rgba(119,189,172,0.08)',
              border: '1px solid rgba(119,189,172,0.15)',
              borderLeftWidth: 2, borderLeftColor: 'rgba(119,189,172,0.50)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-mono), monospace', fontSize: '0.55rem', fontWeight: 600,
                  color: '#77BDAC', opacity: 0.85, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  Diferencial
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#F3F4F6', lineHeight: 1.5, fontWeight: 600 }}>
                {highlightService.title}
              </div>
              {highlightService.detail && (
                <div style={{ fontSize: '0.7rem', color: 'rgba(119,189,172,0.7)', marginTop: 3, lineHeight: 1.45 }}>
                  {highlightService.detail}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PricingSlide({ scrollYProgress, pricing, range }: {
  scrollYProgress: MotionValue<number>;
  pricing: { plans: PricingPlan[] };
  range: [number, number];
}) {
  const [start, end] = range;
  const span = end - start;

  const badgeOpacity = useTransform(scrollYProgress, [start + span * 0.08, start + span * 0.22], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [start + span * 0.08, start + span * 0.22], [12, 0]);
  const card1Opacity = useTransform(scrollYProgress, [start + span * 0.14, start + span * 0.32], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [start + span * 0.14, start + span * 0.32], [20, 0]);
  const card2Opacity = useTransform(scrollYProgress, [start + span * 0.20, start + span * 0.38], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [start + span * 0.20, start + span * 0.38], [20, 0]);
  const elemOpacity = useTransform(scrollYProgress, [start + span * 0.25, start + span * 0.42], [0, 1]);

  return (
    <div className="slide-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingBottom: 60, maxWidth: 520, margin: '0 auto' }}>
      {/* Orbs decorativos */}
      {[
        { top: '10%', left: '6%', size: 5, dur: 5.5, delay: 0 },
        { top: '30%', right: '5%', size: 4, dur: 6.5, delay: 1.2 },
        { top: '55%', left: '3%', size: 3, dur: 7, delay: 2 },
        { top: '75%', right: '8%', size: 4, dur: 5, delay: 0.5 },
        { top: '85%', left: '10%', size: 3, dur: 6, delay: 1.8 },
      ].map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          animate={{ y: [0, -(orb.size + 3), 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          style={{
            position: 'absolute', top: orb.top,
            ...(orb.left ? { left: orb.left } : { right: orb.right }),
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: 'rgba(119,189,172,0.3)',
            boxShadow: '0 0 10px rgba(119,189,172,0.12)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div style={{ opacity: badgeOpacity, y: badgeY }}>
        <SectionBadge label="Investimento" />
      </motion.div>

      <div style={{ position: 'relative', marginTop: 14, overflow: 'visible' }}>
        {/* Ícones flutuantes: Meta, Google Ads, GA4 */}
        <motion.div style={{ opacity: elemOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 2 }}>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '50%', right: -20, padding: 8, borderRadius: 12, background: 'rgba(0,129,251,0.06)', border: '1px solid rgba(0,129,251,0.15)', boxShadow: '0 4px 20px rgba(0,129,251,0.08)' }}
          >
            <MetaLogo size={22} opacity={0.8} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            style={{ position: 'absolute', top: '58%', left: -20, padding: 8, borderRadius: 12, background: 'rgba(66,133,244,0.06)', border: '1px solid rgba(66,133,244,0.15)', boxShadow: '0 4px 20px rgba(66,133,244,0.08)' }}
          >
            <GoogleAdsLogo size={22} opacity={0.8} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ position: 'absolute', top: '32%', left: -20, padding: 8, borderRadius: 12, background: 'rgba(227,116,0,0.06)', border: '1px solid rgba(227,116,0,0.15)', boxShadow: '0 4px 20px rgba(227,116,0,0.08)' }}
          >
            <GA4Logo size={20} opacity={0.7} />
          </motion.div>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 520, width: '100%', margin: '0 auto' }}>
          {pricing.plans.length > 1 ? (
            <PricingCard plan={pricing.plans[1]} opacity={card2Opacity} y={card2Y} />
          ) : (
            <PricingCard plan={pricing.plans[0]} opacity={card1Opacity} y={card1Y} />
          )}
        </div>
      </div>
    </div>
  );
}
