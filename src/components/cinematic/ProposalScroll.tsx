'use client';

import React from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { ScrollSlide } from './ScrollSlide';
import type { ClientData } from '@/lib/clients';

import { HeaderSlideContent } from './slides/HeaderSlide';
import { ResultsSlideContent } from './slides/ResultsSlide';
import { ScaleGoalSlide } from './slides/ScaleGoalSlide';
import { CPAGoalSlide } from './slides/CPAGoalSlide';
import { DataLossSlide } from './slides/DataLossSlide';
import { OpportunitiesSlide } from './slides/OpportunitiesSlide';
import { PricingSlide } from './slides/PricingSlide';
import { CTASlideContent } from './slides/CTASlide';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
}

// Ranges sequenciais dentro do 1200vh (hero ocupa 0→~0.05)
// 8 slides dividem 0.05 → 1.0 = 0.95 / 8 = ~0.12 cada
const R = {
  header:        [0.05, 0.17] as [number, number],
  results:       [0.17, 0.29] as [number, number],
  goal1:         [0.29, 0.41] as [number, number],
  goal2:         [0.41, 0.53] as [number, number],
  goal3:         [0.53, 0.65] as [number, number],
  opportunities: [0.65, 0.77] as [number, number],
  pricing:       [0.77, 0.89] as [number, number],
  proposal:      [0.89, 1.00] as [number, number],
};

// Floating decorative orbs — shared pattern for slide backgrounds
function SlideOrbs({ config }: { config: Array<{ top?: string; bottom?: string; left?: string; right?: string; size: number; dur: number; delay: number; y?: number[] }> }) {
  return (
    <>
      {config.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: orb.y ?? [0, -(orb.size + 2), 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          style={{
            position: 'absolute', top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right,
            width: orb.size, height: orb.size, borderRadius: '50%',
            background: 'rgba(119,189,172,0.25)',
            boxShadow: '0 0 10px rgba(119,189,172,0.12)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

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
      {/* SLIDE 1 — Header */}
      <ScrollSlide range={R.header} scrollYProgress={scrollYProgress} zIndex={2}>
        <div className="slide-dot-grid" />
        <SlideOrbs config={[
          { top: '15%', right: '12%', size: 6, dur: 5, delay: 0, y: [0, -8, 0] },
          { bottom: '22%', left: '8%', size: 4, dur: 7, delay: 1.5, y: [0, 6, 0] },
          { top: '35%', left: '18%', size: 3, dur: 6, delay: 0.8, y: [0, -5, 0] },
        ]} />
        <HeaderSlideContent scrollYProgress={scrollYProgress} firstName={firstName} formattedDate={formattedDate} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 2 — Resultados Projetados */}
      <ScrollSlide range={R.results} scrollYProgress={scrollYProgress} zIndex={3}>
        <div className="slide-dot-grid" />
        <SlideOrbs config={[
          { top: '12%', left: '10%', size: 5, dur: 6, delay: 0, y: [0, -6, 0] },
          { bottom: '18%', right: '14%', size: 4, dur: 7.5, delay: 2, y: [0, 5, 0] },
          { top: '40%', right: '8%', size: 3, dur: 5.5, delay: 1, y: [0, -4, 0] },
        ]} />
        <ResultsSlideContent scrollYProgress={scrollYProgress} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 3 — Goal 1: Escala */}
      <ScrollSlide range={R.goal1} scrollYProgress={scrollYProgress} zIndex={4}>
        <div className="slide-dot-grid" />
        <ScaleGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[0]} range={R.goal1} />
      </ScrollSlide>

      {/* SLIDE 4 — Goal 2: CPA */}
      <ScrollSlide range={R.goal2} scrollYProgress={scrollYProgress} zIndex={5}>
        <div className="slide-dot-grid" />
        <CPAGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[1]} range={R.goal2} trackingScore={diagnosis.stapeChecker?.scores?.overall ?? 31} />
      </ScrollSlide>

      {/* SLIDE 5 — Goal 3: Dados perdidos */}
      <ScrollSlide range={R.goal3} scrollYProgress={scrollYProgress} zIndex={6}>
        <div className="slide-dot-grid" />
        <DataLossSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[2]} range={R.goal3} />
      </ScrollSlide>

      {/* SLIDE 6 — Implementação / Opportunities */}
      <ScrollSlide range={R.opportunities} scrollYProgress={scrollYProgress} zIndex={7}>
        <div className="slide-dot-grid" />
        <OpportunitiesSlide scrollYProgress={scrollYProgress} opportunities={diagnosis.opportunities} range={R.opportunities} />
      </ScrollSlide>

      {/* SLIDE 7 — Investimento / Pricing */}
      {diagnosis.pricing && (
        <ScrollSlide range={R.pricing} scrollYProgress={scrollYProgress} zIndex={8}>
          <div className="slide-dot-grid" />
          <PricingSlide scrollYProgress={scrollYProgress} pricing={diagnosis.pricing} range={R.pricing} />
        </ScrollSlide>
      )}

      {/* SLIDE 8 — Proposta + CTA (isLast) */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={9} isLast>
        <div className="slide-dot-grid" />
        <div className="slide-content text-center">
          <CTASlideContent diagnosis={diagnosis} scrollYProgress={scrollYProgress} range={R.proposal} />
        </div>
      </ScrollSlide>
    </>
  );
}
