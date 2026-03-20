export const tokens = {
  colors: {
    teal: '#77BDAC',
    tealRgba: (a: number) => `rgba(119,189,172,${a})`,
    red: '#EF4444',
    redRgba: (a: number) => `rgba(239,68,68,${a})`,
    amber: '#F59E0B',
    blue: '#60A5FA',
    green: '#22C55E',
    surface: '#0a0a0a',
    textPrimary: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    textDark: '#374151',
    textDarker: '#27272a',
    borderSubtle: '#1a1a1a',
  },
  fonts: {
    mono: 'var(--font-mono), monospace',
    serif: 'var(--font-serif)',
    sans: 'var(--font-sans)',
  },
  timing: {
    loopDuration: 6, // LOOP_S
    loopTimes: [0, 0.5, 0.67, 1] as [number, number, number, number],
  },
  layout: {
    contentHeight: 960,
    slideMaxWidth: 640,
    scrollHeight: '1200vh',
  },
} as const;
