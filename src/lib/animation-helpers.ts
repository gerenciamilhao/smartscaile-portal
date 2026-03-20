import React from 'react';

/**
 * Parse *word* into serif+glow accent spans.
 * Usage: renderAccentText("Esse *teto* não é do mercado.", "#77BDAC")
 */
export function renderAccentText(text: string, color: string = '#77BDAC', delay: number = 0) {
  const parts = text.split(/(\*[^*]+\*)/g);
  let accentIndex = 0;
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const word = part.slice(1, -1);
      accentIndex++;
      return React.createElement('span', {
        key: i,
        style: { fontFamily: 'var(--font-serif)', fontStyle: 'italic', color, textShadow: `0 0 12px ${color}40` },
      }, word);
    }
    return React.createElement('span', { key: i, style: { whiteSpace: 'pre-line' } }, part);
  });
}

/**
 * Smooth RGB interpolation through 3 stops: a (t=0) → b (t=0.5) → c (t=1)
 */
export function lerpRGB3(
  t: number,
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): [number, number, number] {
  const mix = (from: number, to: number, p: number) => Math.round(from + (to - from) * p);
  if (t <= 0.5) {
    const p = t / 0.5;
    return [mix(a[0], b[0], p), mix(a[1], b[1], p), mix(a[2], b[2], p)];
  }
  const p = (t - 0.5) / 0.5;
  return [mix(b[0], c[0], p), mix(b[1], c[1], p), mix(b[2], c[2], p)];
}

/**
 * Score color based on value thresholds.
 */
export function scoreColor(v: number) {
  return v <= 30 ? '#EF4444' : v <= 50 ? '#F59E0B' : '#77BDAC';
}

/**
 * Match a service title to a Lucide icon component name.
 */
export function getServiceIconName(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('tag manager') || t.includes('gtm')) return 'Settings';
  if (t.includes('servidor') || t.includes('server') || t.includes('stape')) return 'Server';
  if (t.includes('meta') || t.includes('pixel')) return 'Target';
  if (t.includes('whatsapp')) return 'MessageCircle';
  if (t.includes('banco de dados') || t.includes('database')) return 'Database';
  if (t.includes('webhook') || t.includes('purchase')) return 'Webhook';
  if (t.includes('ga4') || t.includes('analytics')) return 'BarChart2';
  if (t.includes('google ads')) return 'Zap';
  if (t.includes('acompanhamento') || t.includes('suporte')) return 'Headphones';
  if (t.includes('reestrutura')) return 'Settings';
  return 'ShieldCheck';
}

/**
 * easeInOutCubic easing function.
 */
export const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
