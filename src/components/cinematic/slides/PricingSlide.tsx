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

function PricingCard({ plan, opacity, y }: {
  plan: PricingPlan;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const formattedAmount = plan.amount.toLocaleString('pt-BR');
  const coreServices = plan.services.slice(0, -1);
  const highlightService = plan.services[plan.services.length - 1];

  return (
    <motion.div style={{ opacity, y, width: '100%', maxWidth: 580 }}>
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

  return (
    <div className="slide-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingBottom: 60, transform: 'scale(0.82)', transformOrigin: 'center center' }}>
      <motion.div style={{ opacity: badgeOpacity, y: badgeY, transform: 'scale(1.22)', transformOrigin: 'center center' }}>
        <SectionBadge label="Investimento" />
      </motion.div>

      <div style={{ position: 'relative', marginTop: 14, overflow: 'visible' }}>
        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 620, width: '100%', margin: '0 auto' }}>
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
