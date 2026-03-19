'use client';

import { type MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { ScrollSlide } from './ScrollSlide';
import { SectionBadge } from '@/components/portal/SectionBadge';
import type { ClientData } from '@/lib/clients';
import {
  TrendingUp, Target, Rocket, Users,
  Server, Cookie, Shield, Zap,
  ArrowRight, MessageCircle, Clock, ExternalLink,
  BarChart2, Activity, Sparkles,
} from 'lucide-react';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
}

// Ranges sequenciais dentro do 600vh (hero ocupa 0→~0.10)
// 5 slides dividem 0.12 → 1.0 = 0.88 / 5 = ~0.176 cada
const R = {
  header:        [0.10, 0.28] as [number, number],
  results:       [0.28, 0.46] as [number, number],
  desires:       [0.46, 0.64] as [number, number],
  opportunities: [0.64, 0.82] as [number, number],
  proposal:      [0.82, 1.00] as [number, number],
};

const desireIcons: Record<string, React.ReactNode> = {
  scale:  <TrendingUp size={15} strokeWidth={1.5} />,
  target: <Target size={15} strokeWidth={1.5} />,
  rocket: <Rocket size={15} strokeWidth={1.5} />,
  users:  <Users size={15} strokeWidth={1.5} />,
};

const oppIcons = [
  <Server key="0" size={13} strokeWidth={1.5} />,
  <Cookie key="1" size={13} strokeWidth={1.5} />,
  <Shield key="2" size={13} strokeWidth={1.5} />,
  <Zap    key="3" size={13} strokeWidth={1.5} />,
  <Rocket key="4" size={13} strokeWidth={1.5} />,
];

// Stagger animation variants
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ProposalScroll({ scrollYProgress, clientData }: ProposalScrollProps) {
  const { client, meetings, diagnosis } = clientData;
  const firstName = client.name.split(' ')[0];
  const meetingDate = meetings[0]?.date || '';
  const formattedDate = meetingDate
    ? new Date(meetingDate + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 1 — Header
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.header} scrollYProgress={scrollYProgress} zIndex={2}>
        {/* Decorative layers */}
        <div className="slide-dot-grid" />

        {/* Floating decorative orbs */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '15%', right: '12%', width: 6, height: 6,
            borderRadius: '50%', background: 'rgba(119,189,172,0.3)',
            boxShadow: '0 0 12px rgba(119,189,172,0.15)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute', bottom: '22%', left: '8%', width: 4, height: 4,
            borderRadius: '50%', background: 'rgba(119,189,172,0.25)',
            boxShadow: '0 0 8px rgba(119,189,172,0.1)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{
            position: 'absolute', top: '35%', left: '18%', width: 3, height: 3,
            borderRadius: '50%', background: 'rgba(119,189,172,0.2)',
            pointerEvents: 'none',
          }}
        />

        <div className="slide-content">
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-[0.6rem] font-medium tracking-wide text-[#6B7280]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
                smartscaile.
              </span>
            </div>
            <SectionBadge label="Proposta Exclusiva" />
          </motion.div>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className="accent-line mb-5"
          />

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif"
            style={{ fontWeight: 700, lineHeight: 1.12, color: '#F3F4F6', fontSize: 'clamp(1.75rem, 7vw, 3rem)' }}
          >
            Escale com{' '}
            <span className="text-glow" style={{ color: '#77BDAC' }}>inteligência.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[480px] text-[0.875rem] leading-relaxed text-[#9CA3AF]"
          >
            {firstName}, com base na nossa conversa de{' '}
            <span className="text-[#F3F4F6]">{formattedDate}</span>, preparamos um plano sob medida para destravar seus resultados.
          </motion.p>

          {/* Mini metric pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {[
              { Icon: BarChart2, text: 'Diagnóstico completo' },
              { Icon: Activity, text: 'Plano personalizado' },
              { Icon: Sparkles, text: 'Resultados projetados' },
            ].map(({ Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-pill flex items-center gap-1.5 rounded-full px-3 py-1.5"
              >
                <Icon size={10} className="text-[#77BDAC]" strokeWidth={1.5} />
                <span className="text-[0.6rem] text-[#9CA3AF]">{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center gap-3"
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
              {/* Mini chevron */}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
                <path d="M1 1L5 5L9 1" stroke="#77BDAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(119,189,172,0.15), transparent)' }} />
          </motion.div>
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 2 — Resultados Projetados
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.results} scrollYProgress={scrollYProgress} zIndex={3}>
        <div className="slide-dot-grid" />

        <div className="slide-content">
          <SectionBadge label="Resultados Projetados" />
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            {diagnosis.headline}
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-5 flex flex-col gap-2.5 md:flex-row md:gap-3"
          >
            {diagnosis.goals.map((goal, i) => (
              <motion.div
                key={goal.label}
                variants={fadeUpItem}
                className="glass-card flex-1 rounded-xl p-3.5"
              >
                {/* Sequential number */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    className="font-serif text-lg font-bold leading-none"
                    style={{ color: '#77BDAC', textShadow: '0 0 12px rgba(119,189,172,0.3)' }}
                  >
                    {goal.metric}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[#F3F4F6]">{goal.label}</p>
                <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-[#9CA3AF]">{goal.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {diagnosis.stapeChecker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 flex justify-center"
            >
              <a href={diagnosis.stapeChecker.url} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-lg border border-[rgba(119,189,172,0.12)] bg-[rgba(119,189,172,0.03)] px-3 py-2 text-[0.7rem] font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.25)]">
                {diagnosis.stapeChecker.label}
                <ExternalLink size={11} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          )}
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 3 — Objetivos / Desires
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.desires} scrollYProgress={scrollYProgress} zIndex={4}>
        <div className="slide-dot-grid" />

        <div className="slide-content">
          <SectionBadge label="Seus Objetivos" />
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            {diagnosis.desires.headline}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUpItem, visible: { ...fadeUpItem.visible, transition: { ...fadeUpItem.visible.transition, delay: 0.05 } } }}
            className="mt-2 max-w-[520px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
          >
            {diagnosis.desires.intro}
          </motion.p>

          {/* Separator */}
          <div className="separator-line my-4" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2.5"
          >
            {diagnosis.desires.items.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUpItem}
                className="proposal-card flex items-start gap-2.5 rounded-xl border border-[rgba(119,189,172,0.06)] bg-[#0a0a0a] p-3 hover:border-[rgba(119,189,172,0.18)] hover:bg-[rgba(10,10,10,0.9)]"
              >
                <div className="icon-pulse mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(119,189,172,0.08)] text-[#77BDAC]"
                  style={{ border: '1px solid rgba(119,189,172,0.12)' }}
                >
                  {desireIcons[item.icon] || <Target size={15} strokeWidth={1.5} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.75rem] font-semibold text-[#F3F4F6]">{item.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-relaxed text-[#9CA3AF]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 4 — Implementacao / Opportunities
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.opportunities} scrollYProgress={scrollYProgress} zIndex={5}>
        <div className="slide-dot-grid" />

        <div className="slide-content">
          <SectionBadge label="O que vamos implementar" />
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            Como vamos chegar la
          </motion.h2>

          {/* Top accent line */}
          <div className="accent-line mt-2 mb-4" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col gap-2"
          >
            {diagnosis.opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                variants={fadeUpItem}
                className="proposal-card flex items-start gap-2.5 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-3 hover:border-[rgba(119,189,172,0.15)] hover:bg-[rgba(10,10,10,0.9)]"
              >
                {/* Step number */}
                <div className="step-number mt-0.5">
                  {i + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#77BDAC]" style={{ opacity: 0.6 }}>
                      {oppIcons[i] || <Zap size={13} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-[0.75rem] font-semibold text-[#F3F4F6]">{opp.title}</h3>
                    <span className={`inline-flex shrink-0 items-center rounded-full border px-1.5 py-px text-[0.5rem] font-semibold uppercase tracking-wider ${
                      opp.impact === 'high' ? 'impact-high' : 'impact-medium'
                    }`}>
                      {opp.impact === 'high' ? 'Alto' : 'Medio'}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-relaxed text-[#9CA3AF]">{opp.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollSlide>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDE 5 — Proposta + CTA (isLast: permanece visivel, sem fade-out)
          ═══════════════════════════════════════════════════════════════════════ */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={6} isLast>
        <div className="slide-dot-grid" />

        <div className="slide-content text-center">
          {/* Badge with live dot */}
          <div className="inline-flex items-center gap-2">
            <SectionBadge label="Proposta smartscaile." />
          </div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpItem}
            className="mt-2.5 font-serif text-[clamp(1.375rem,5vw,2rem)] font-bold text-[#F3F4F6]"
          >
            {diagnosis.proposal.headline}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUpItem, visible: { ...fadeUpItem.visible, transition: { ...fadeUpItem.visible.transition, delay: 0.05 } } }}
            className="mx-auto mt-3 max-w-[520px] text-[0.8rem] leading-relaxed text-[#9CA3AF]"
          >
            {diagnosis.proposal.description}
          </motion.p>

          {/* Separator */}
          <div className="separator-line mx-auto my-5" style={{ maxWidth: '200px' }} />

          {/* Glass pills for timeline + guarantee */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-6 flex flex-wrap items-center justify-center gap-2.5"
          >
            <motion.div variants={fadeUpItem} className="glass-pill flex items-center gap-1.5 rounded-lg px-3 py-2">
              <Clock size={12} className="text-[#77BDAC]" strokeWidth={1.5} />
              <span className="text-[0.7rem] text-[#F3F4F6]">{diagnosis.proposal.timeline}</span>
            </motion.div>
            <motion.div variants={fadeUpItem} className="glass-pill flex items-center gap-1.5 rounded-lg px-3 py-2">
              <Shield size={12} className="text-[#77BDAC]" strokeWidth={1.5} />
              <span className="text-[0.7rem] text-[#F3F4F6]">{diagnosis.proposal.guarantee}</span>
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <a href="https://wa.me/5511999999999?text=Oi%20Carlos%2C%20quero%20agendar%20a%20call%20de%20implementa%C3%A7%C3%A3o"
              target="_blank" rel="noopener noreferrer"
              className="cta-glow-pulse group inline-flex items-center gap-2.5 rounded-xl bg-[#77BDAC] px-6 py-3 text-[0.8rem] font-semibold text-[#050505] transition-colors hover:bg-[#5fa695]">
              {diagnosis.proposal.cta}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://wa.me/5511999999999?text=Oi%20Carlos%2C%20vi%20a%20proposta%20no%20portal"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(119,189,172,0.18)] bg-transparent px-4 py-2 text-[0.7rem] font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.35)] hover:bg-[rgba(119,189,172,0.03)]">
              <MessageCircle size={12} />
              Falar no WhatsApp
            </a>
          </motion.div>

          {/* Footer brand mark */}
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <span className="live-dot" />
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.15em] text-[#374151]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
              smartscaile.
            </span>
          </div>
        </div>
      </ScrollSlide>
    </>
  );
}
