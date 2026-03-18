"use client";

import { motion } from "framer-motion";
import { FadeUp, ScaleIn } from "@/components/ui/motion";
import { SectionBadge } from "./SectionBadge";
import { ExternalLink } from "lucide-react";

interface Goal {
  metric: string;
  label: string;
  description: string;
}

interface StapeChecker {
  noteId: string;
  url: string;
  label: string;
}

interface ProjectedResultsProps {
  headline: string;
  goals: Goal[];
  stapeChecker?: StapeChecker;
}

export function ProjectedResults({ headline, goals, stapeChecker }: ProjectedResultsProps) {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-[800px]">
        <FadeUp>
          <div className="mb-4">
            <SectionBadge label="Resultados Projetados" />
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold text-[#F3F4F6]">
            {headline}
          </h2>
        </FadeUp>

        {/* Goal cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {goals.map((goal, i) => (
            <ScaleIn key={goal.label} delay={0.1 + i * 0.1}>
              <div
                className="relative overflow-hidden rounded-2xl border p-6 text-center"
                style={{
                  background: "rgba(10,10,10,0.8)",
                  backdropFilter: "blur(12px)",
                  borderColor: "rgba(119,189,172,0.15)",
                }}
              >
                {/* Subtle glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(119,189,172,0.06), transparent)",
                  }}
                />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2 + i * 0.1,
                    }}
                  >
                    <span className="font-[family-name:var(--font-playfair)] text-[1.75rem] font-bold leading-none text-[#77BDAC]">
                      {goal.metric}
                    </span>
                  </motion.div>

                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#F3F4F6]">
                    {goal.label}
                  </p>
                  <p className="mt-3 text-[0.8rem] leading-relaxed text-[#9CA3AF]">
                    {goal.description}
                  </p>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        {/* Stape checker link */}
        {stapeChecker && (
          <FadeUp delay={0.5}>
            <div className="mt-8 flex justify-center">
              <a
                href={stapeChecker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-[rgba(119,189,172,0.2)] bg-[rgba(119,189,172,0.04)] px-5 py-3 text-sm font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.4)] hover:bg-[rgba(119,189,172,0.08)]"
              >
                {stapeChecker.label}
                <ExternalLink
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
            <p className="mt-3 text-center text-[0.7rem] text-[#6B7280]">
              Relatorio independente gerado pela Stape. Dados objetivos da sua estrutura atual.
            </p>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
