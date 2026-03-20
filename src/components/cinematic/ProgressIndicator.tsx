'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';

interface ProgressIndicatorProps {
  scrollYProgress: MotionValue<number>;
  sections: string[];
}

// Midpoints — exatamente no centro de cada slide range (8 slides)
const SLIDE_MIDS = [0.11, 0.23, 0.35, 0.47, 0.59, 0.71, 0.83, 0.945];

// Each slide's exact range boundaries (from ProposalScroll R)
const SLIDE_RANGES: [number, number][] = [
  [0.05, 0.17],
  [0.17, 0.29],
  [0.29, 0.41],
  [0.41, 0.53],
  [0.53, 0.65],
  [0.65, 0.77],
  [0.77, 0.89],
  [0.89, 1.00],
];

export function ProgressIndicator({ scrollYProgress, sections }: ProgressIndicatorProps) {
  const isMobile = useIsMobile();
  const overallOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.08, 0.96, 1.0],
    [0, 0, 1, 1, 0],
  );

  const thumbPercent = useTransform(scrollYProgress, [0.06, 1.0], [0, 100]);
  const thumbTop = useTransform(thumbPercent, (v) => `${Math.min(100, Math.max(0, v))}%`);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          bottom: 160,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          opacity: overallOpacity,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {sections.map((label, i) => (
            <ProgressDot key={label} index={i} label={label} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </motion.div>

      {/* Rail lateral direito */}
      <motion.div
        style={{
          position: 'fixed', right: 14, top: '50%', transform: 'translateY(-50%)',
          height: '28vh', width: 1.5, borderRadius: 1,
          background: 'rgba(119,189,172,0.06)', zIndex: 50, opacity: overallOpacity,
        }}
      >
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: thumbTop,
            background: 'rgba(119,189,172,0.1)', borderRadius: 1,
          }}
        />
        <motion.div
          style={{
            position: 'absolute', left: '50%', x: '-50%', top: thumbTop, y: '-50%',
            width: 5, height: 5, borderRadius: '50%', background: '#77BDAC',
            boxShadow: '0 0 6px rgba(119,189,172,0.25)',
          }}
        />
      </motion.div>
    </>
  );
}

function ProgressDot({ index, label, scrollYProgress }: {
  index: number; label: string; scrollYProgress: MotionValue<number>;
}) {
  const [start, end] = SLIDE_RANGES[index];
  const mid = SLIDE_MIDS[index];

  // Dot: visible only within this slide's range, peak at midpoint
  const dotOpacity = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.15, 1, 0.15],
  );
  const scale = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.7, 1, 0.7],
  );

  // Label: only visible around midpoint, 0 everywhere else
  const lblIn  = mid - 0.04;
  const lblOut = mid + 0.04;
  const lblOpacity = useTransform(scrollYProgress, (v) => {
    if (v < lblIn || v > lblOut) return 0;
    const dist = Math.abs(v - mid);
    return Math.max(0, (1 - dist / 0.04) * 0.7);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
      <motion.span style={{
        opacity: lblOpacity, fontSize: '0.6rem', color: '#77BDAC',
        letterSpacing: '0.06em', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-mono), monospace',
        fontWeight: 500,
        position: 'absolute',
        bottom: '100%',
        marginBottom: 8,
      }}>
        {label}
      </motion.span>
      <motion.div style={{
        width: 8, height: 8, borderRadius: '50%', backgroundColor: '#77BDAC',
        scale, opacity: dotOpacity,
      }} />
    </div>
  );
}
