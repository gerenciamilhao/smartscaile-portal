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
import { ROISlide } from './slides/ROISlide';
import { PricingSlide } from './slides/PricingSlide';
import { CTASlideContent } from './slides/CTASlide';

interface ProposalScrollProps {
  scrollYProgress: MotionValue<number>;
  clientData: ClientData;
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

  const hasRoi = !!diagnosis.roi;

  // 9 slides if ROI present, 8 otherwise
  const sliceSize = hasRoi ? 1 / 9 : 1 / 8;
  const r = (i: number): [number, number] => [i * sliceSize, (i + 1) * sliceSize];

  let idx = 0;

  return (
    <>
      {/* SLIDE 1 — Header */}
      <ScrollSlide range={r(idx)} scrollYProgress={scrollYProgress} zIndex={2} isFirst>
        <HeaderSlideContent firstName={firstName} formattedDate={formattedDate} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 2 — Resultados Projetados */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={3}>
        <ResultsSlideContent scrollYProgress={scrollYProgress} diagnosis={diagnosis} />
      </ScrollSlide>

      {/* SLIDE 3 — Goal 1: Escala */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={4}>
        <ScaleGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[0]} range={r(idx)} stapeScores={diagnosis.stapeChecker?.scores} domain={diagnosis.stapeChecker?.domain} />
      </ScrollSlide>

      {/* SLIDE 4 — Goal 2: CPA */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={5}>
        <CPAGoalSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[1]} range={r(idx)} trackingScore={diagnosis.stapeChecker?.scores?.overall ?? 31} />
      </ScrollSlide>

      {/* SLIDE 5 — Goal 3: Dados perdidos */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={6}>
        <DataLossSlide scrollYProgress={scrollYProgress} goal={diagnosis.goals[2]} range={r(idx)} />
      </ScrollSlide>

      {/* SLIDE 6 — Implementação / Opportunities */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={7}>
        <OpportunitiesSlide scrollYProgress={scrollYProgress} opportunities={diagnosis.opportunities} range={r(idx)} />
      </ScrollSlide>

      {/* SLIDE 7 — ROI (condicional) */}
      {hasRoi && (
        <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={8}>
          <ROISlide scrollYProgress={scrollYProgress} roi={diagnosis.roi!} range={r(idx)} />
        </ScrollSlide>
      )}

      {/* SLIDE 7/8 — Investimento / Pricing */}
      {diagnosis.pricing && (
        <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={hasRoi ? 9 : 8}>
          <PricingSlide scrollYProgress={scrollYProgress} pricing={diagnosis.pricing} range={r(idx)} />
        </ScrollSlide>
      )}

      {/* SLIDE 8/9 — Proposta + CTA (isLast) */}
      <ScrollSlide range={r(++idx)} scrollYProgress={scrollYProgress} zIndex={hasRoi ? 10 : 9} isLast>
        <div className="slide-content text-center">
          <CTASlideContent diagnosis={diagnosis} scrollYProgress={scrollYProgress} range={r(idx)} clientId={client.id} />
        </div>
      </ScrollSlide>
    </>
  );
}
