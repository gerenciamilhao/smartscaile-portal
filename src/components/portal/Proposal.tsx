"use client";

import { motion } from "framer-motion";
import { FadeUp, ScaleIn } from "@/components/ui/motion";
import { SectionBadge } from "./SectionBadge";
import { ArrowRight, MessageCircle, Shield, Clock, Rocket } from "lucide-react";

interface ProposalProps {
  headline: string;
  description: string;
  timeline: string;
  guarantee: string;
  cta: string;
}

export function Proposal({ headline, description, timeline, guarantee, cta }: ProposalProps) {
  return (
    <section className="relative px-5 py-20">
      {/* Teal ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(119,189,172,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative mx-auto max-w-[800px]">
        <FadeUp>
          <div className="mb-4">
            <SectionBadge label="Proposta smartscaile." />
          </div>
          <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold text-[#F3F4F6]">
            {headline}
          </h2>
          <p className="mb-12 max-w-[640px] text-[0.9375rem] leading-relaxed text-[#9CA3AF]">
            {description}
          </p>
        </FadeUp>

        {/* Info cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <ScaleIn delay={0.1}>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] border border-[#1f1f1f]">
                <Clock size={16} className="text-[#77BDAC]" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Timeline</p>
              <p className="mt-1 text-sm font-semibold text-[#F3F4F6]">{timeline}</p>
            </div>
          </ScaleIn>

          <ScaleIn delay={0.2}>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] border border-[#1f1f1f]">
                <Shield size={16} className="text-[#77BDAC]" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Garantia</p>
              <p className="mt-1 text-sm font-semibold text-[#F3F4F6]">{guarantee}</p>
            </div>
          </ScaleIn>

          <ScaleIn delay={0.3}>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] border border-[#1f1f1f]">
                <Rocket size={16} className="text-[#77BDAC]" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Metodo</p>
              <p className="mt-1 text-sm font-semibold text-[#F3F4F6]">Teste A/B validado com dados reais</p>
            </div>
          </ScaleIn>
        </div>

        {/* CTA */}
        <FadeUp delay={0.4}>
          <div className="flex flex-col items-center gap-4">
            <motion.a
              href="https://wa.me/351934157309?text=Oi%20Carlos%2C%20quero%20agendar%20a%20call%20de%20implementa%C3%A7%C3%A3o"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#77BDAC] px-8 py-4 text-base font-semibold text-[#050505] transition-colors hover:bg-[#5fa695]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: "0 0 30px rgba(119,189,172,0.15), 0 0 60px rgba(119,189,172,0.05)",
              }}
            >
              {cta}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="https://wa.me/351934157309?text=Oi%20Carlos%2C%20vi%20a%20proposta%20no%20portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(119,189,172,0.3)] bg-transparent px-6 py-3 text-sm font-medium text-[#77BDAC] transition-colors hover:border-[rgba(119,189,172,0.5)] hover:bg-[rgba(119,189,172,0.05)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle size={14} />
              Falar no WhatsApp
            </motion.a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
