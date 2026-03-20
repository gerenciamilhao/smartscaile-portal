"use client";

import Image from "next/image";

const LinkedInIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export function ProposalFooter() {
  return (
    <footer className="px-5 py-8">
      <div className="mx-auto max-w-[400px]">
        <div className="flex flex-col items-center gap-4">

          {/* Logo + badge inline */}
          <div className="flex items-center gap-3">
            <Image
              src="/avatar-sm.png"
              alt="smartscaile."
              width={28}
              height={28}
              style={{
                opacity: 0.2,
                filter: "brightness(1.8) contrast(0.85)",
                mixBlendMode: "screen",
              }}
            />
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 rounded-full bg-[#77BDAC]" />
              <span className="text-[0.6rem] text-[#4B5563]">
                Preparado exclusivamente para você por smartscaile.
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/carloskorber/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[0.55rem] text-[#374151] transition-colors hover:text-[#77BDAC]"
            >
              <LinkedInIcon />
              Carlos Korber
            </a>
            <span className="text-[0.5rem] text-[#1a1a1a]">·</span>
            <a
              href="https://www.linkedin.com/in/ramon-lemos-723105264/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[0.55rem] text-[#374151] transition-colors hover:text-[#77BDAC]"
            >
              <LinkedInIcon />
              Ramon Lemos
            </a>
          </div>

          {/* Legal */}
          <p className="text-[0.5rem] text-[#1f1f1f]">
            © 2026 SMARTSCAILE MARTECH LTDA · 61.918.211/0001-00
          </p>

        </div>
      </div>
    </footer>
  );
}
