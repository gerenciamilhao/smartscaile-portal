"use client";

interface SectionBadgeProps {
  label: string;
}

export function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#77BDAC] bg-[rgba(119,189,172,0.06)] border-[rgba(119,189,172,0.12)]"
    >
      {label}
    </span>
  );
}
