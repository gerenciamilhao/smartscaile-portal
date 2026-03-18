"use client";

import { FadeUp, StaggerItem } from "@/components/ui/motion";
import { SectionBadge } from "./SectionBadge";
import {
  Server,
  Cookie,
  Shield,
  Zap,
  Rocket,
} from "lucide-react";

interface Opportunity {
  title: string;
  impact: string;
  effort: string;
  description: string;
}

interface OpportunitiesProps {
  opportunities: Opportunity[];
}

const opportunityIcons = [
  <Server key="server" size={18} strokeWidth={1.5} />,
  <Cookie key="cookie" size={18} strokeWidth={1.5} />,
  <Shield key="shield" size={18} strokeWidth={1.5} />,
  <Zap key="zap" size={18} strokeWidth={1.5} />,
  <Rocket key="rocket" size={18} strokeWidth={1.5} />,
];

function ImpactBadge({ impact }: { impact: string }) {
  const isHigh = impact === "high";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
        isHigh
          ? "bg-[rgba(119,189,172,0.1)] text-[#77BDAC] border border-[rgba(119,189,172,0.2)]"
          : "bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]"
      }`}
    >
      {isHigh ? "Alto Impacto" : "Medio"}
    </span>
  );
}

export function Opportunities({ opportunities }: OpportunitiesProps) {
  return (
    <section className="relative px-5 py-20">
      {/* Teal ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(119,189,172,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto max-w-[800px]">
        <FadeUp>
          <div className="mb-4">
            <SectionBadge label="O que vamos implementar" />
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold text-[#F3F4F6]">
            Como vamos chegar la
          </h2>
          <p className="mb-12 max-w-[640px] text-[0.9375rem] leading-relaxed text-[#9CA3AF]">
            Cada item abaixo e uma camada que adicionamos na sua operacao. Juntas, elas recuperam os dados perdidos e dao ao algoritmo do Meta o que ele precisa para otimizar.
          </p>
        </FadeUp>

        <div className="grid gap-4">
          {opportunities.map((opp, i) => (
            <StaggerItem key={opp.title} delay={i * 0.07}>
              <div className="flex items-start gap-5 rounded-2xl border border-[#27272a] bg-[#0a0a0a] p-5 transition-colors hover:border-[rgba(119,189,172,0.25)]">
                {/* Icon */}
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(119,189,172,0.08)] text-[#77BDAC]">
                  {opportunityIcons[i] || <Zap size={18} strokeWidth={1.5} />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-[#F3F4F6]">
                      {opp.title}
                    </h3>
                    <ImpactBadge impact={opp.impact} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#9CA3AF]">
                    {opp.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}
