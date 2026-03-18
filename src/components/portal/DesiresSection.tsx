"use client";

import { FadeUp, StaggerItem } from "@/components/ui/motion";
import { SectionBadge } from "./SectionBadge";
import { TrendingUp, Target, Rocket, Users } from "lucide-react";

interface DesireItem {
  icon: string;
  title: string;
  description: string;
}

interface DesiresSectionProps {
  headline: string;
  intro: string;
  items: DesireItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  scale: <TrendingUp size={18} strokeWidth={1.5} />,
  target: <Target size={18} strokeWidth={1.5} />,
  rocket: <Rocket size={18} strokeWidth={1.5} />,
  users: <Users size={18} strokeWidth={1.5} />,
};

export function DesiresSection({ headline, intro, items }: DesiresSectionProps) {
  return (
    <section className="relative px-5 py-20">
      {/* Subtle teal ambient */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(119,189,172,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative mx-auto max-w-[800px]">
        <FadeUp>
          <div className="mb-4">
            <SectionBadge label="Seus Objetivos" />
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold text-[#F3F4F6]">
            {headline}
          </h2>
          <p className="mb-12 max-w-[640px] text-[0.9375rem] leading-relaxed text-[#9CA3AF]">
            {intro}
          </p>
        </FadeUp>

        {/* Desire cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <StaggerItem key={item.title} delay={i * 0.07}>
              <div className="flex items-start gap-4 rounded-2xl border border-[rgba(119,189,172,0.12)] bg-[#0a0a0a] p-5 transition-colors hover:border-[rgba(119,189,172,0.25)]">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(119,189,172,0.08)] text-[#77BDAC]">
                  {iconMap[item.icon] || <Target size={18} strokeWidth={1.5} />}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[#F3F4F6]">
                    {item.title}
                  </h3>
                  <p className="text-[0.8rem] leading-relaxed text-[#9CA3AF]">
                    {item.description}
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
