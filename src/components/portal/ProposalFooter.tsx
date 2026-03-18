"use client";

import { FadeUp } from "@/components/ui/motion";

export function ProposalFooter() {
  return (
    <footer className="px-5 pb-16 pt-10">
      <div className="mx-auto max-w-[800px]">
        <FadeUp>
          <div className="flex flex-col items-center gap-6">
            {/* Glassmorphism badge */}
            <div
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-[#6B7280]"
              style={{
                background: "rgba(10,10,10,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(119,189,172,0.1)",
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#77BDAC]" />
              Preparado exclusivamente para voce por smartscaile.
            </div>

            {/* Logo */}
            <p className="text-sm font-medium tracking-wide text-[#3B3B3B]">
              smartscaile.
            </p>
          </div>
        </FadeUp>
      </div>
    </footer>
  );
}
