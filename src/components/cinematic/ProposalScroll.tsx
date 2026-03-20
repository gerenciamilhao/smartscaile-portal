'use client';

import React from 'react';
import { type MotionValue } from 'framer-motion';
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

// Ranges sequenciais — header começa do 0 (sem Hero)
// 8 slides × 0.125 = 1.0 — container 1200vh → 150vh por slide
const R = {
  header:        [0.000, 0.125] as [number, number],
  results:       [0.125, 0.250] as [number, number],
  goal1:         [0.250, 0.375] as [number, number],
  goal2:         [0.375, 0.500] as [number, number],
  goal3:         [0.500, 0.625] as [number, number],
  opportunities: [0.625, 0.750] as [number, number],
  pricing:       [0.750, 0.875] as [number, number],
  proposal:      [0.875, 1.000] as [number, number],
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
      {/* SLIDE 1 — Header */}
      <ScrollSlide range={R.header} scrollYProgress={scrollYProgress} zIndex={2} isFirst>
        <HeaderSlideContent firstName={firstName} formattedDate={formattedDate} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 2 — Resultados Projetados */}
      <ScrollSlide range={R.results} scrollYProgress={scrollYProgress} zIndex={3}>
        <ResultsSlideContent scrollYProgress={scrollYProgress} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 3 — Goal 1: Escala */}
      <ScrollSlide range={R.goal1} scrollYProgress={scrollYProgress} zIndex={4}>
        <ScaleGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[0]} range={R.goal1} />
      </ScrollSlide>

      {/* SLIDE 4 — Goal 2: CPA */}
      <ScrollSlide range={R.goal2} scrollYProgress={scrollYProgress} zIndex={5}>
        <CPAGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[1]} range={R.goal2} trackingScore={diagnosis.stapeChecker?.scores?.overall ?? 31} />
      </ScrollSlide>

      {/* SLIDE 5 — Goal 3: Dados perdidos */}
      <ScrollSlide range={R.goal3} scrollYProgress={scrollYProgress} zIndex={6}>
        <DataLossSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[2]} range={R.goal3} />
      </ScrollSlide>

      {/* SLIDE 6 — Implementação / Opportunities */}
      <ScrollSlide range={R.opportunities} scrollYProgress={scrollYProgress} zIndex={7}>
        <OpportunitiesSlide scrollYProgress={scrollYProgress} opportunities={diagnosis.opportunities} range={R.opportunities} />
      </ScrollSlide>

      {/* SLIDE 7 — Investimento / Pricing */}
      {diagnosis.pricing && (
        <ScrollSlide range={R.pricing} scrollYProgress={scrollYProgress} zIndex={8}>
            <PricingSlide scrollYProgress={scrollYProgress} pricing={diagnosis.pricing} range={R.pricing} />
        </ScrollSlide>
      )}

      {/* SLIDE 8 — Proposta + CTA (isLast) */}
      <ScrollSlide range={R.proposal} scrollYProgress={scrollYProgress} zIndex={9} isLast>
        <div className="slide-content text-center">
          <CTASlideContent diagnosis={diagnosis} scrollYProgress={scrollYProgress} range={R.proposal} />
        </div>
      </ScrollSlide>
    </>
  );
}
