"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionBadge } from "./SectionBadge";

interface ProposalHeaderProps {
  clientName: string;
  meetingDate: string;
}

export function ProposalHeader({ clientName, meetingDate }: ProposalHeaderProps) {
  const firstName = clientName.split(" ")[0];
  const formattedDate = new Date(meetingDate + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="px-5 pb-10 pt-12">
      <div className="mx-auto max-w-[800px]">
        <FadeUp>
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-inter)] text-sm font-medium tracking-wide text-[#9CA3AF]">
              smartscaile.
            </span>
            <SectionBadge label="Proposta Exclusiva" />
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1
            className="mt-8 font-[family-name:var(--font-playfair)] text-[clamp(2rem,7vw,3.25rem)] font-bold leading-[1.1] text-[#F3F4F6]"
          >
            Gabriel, vamos escalar.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#9CA3AF]">
            Com base na nossa conversa de{" "}
            <span className="text-[#F3F4F6]">{formattedDate}</span>, montamos
            um plano para destravar a escala do Kim Pifer e estruturar seu
            lancamento do zero.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
