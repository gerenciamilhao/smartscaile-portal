"use client";

interface SectionBadgeProps {
  label: string;
}

export function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <span
      style={{ fontFamily: 'var(--font-mono), monospace' }}
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.61rem] font-medium uppercase tracking-[0.14em] text-[rgba(119,189,172,0.85)] bg-[rgba(119,189,172,0.05)] border-[rgba(119,189,172,0.12)] shadow-[0_0_12px_rgba(119,189,172,0.04)] backdrop-blur-sm"
    >
      <span className="inline-block h-[4px] w-[4px] rounded-full bg-[#77BDAC] opacity-60 shadow-[0_0_6px_rgba(119,189,172,0.5)]" />
      {label}
    </span>
  );
}
