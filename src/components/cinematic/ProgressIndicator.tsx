'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface ProgressIndicatorProps {
  scrollYProgress: MotionValue<number>;
  sections: string[];
}

// Midpoints de cada slide (centro do range de cada slide em ProposalScroll)
const SLIDE_MIDS = [0.19, 0.37, 0.55, 0.73, 0.91];

export function ProgressIndicator({ scrollYProgress, sections }: ProgressIndicatorProps) {
  // Aparece quando começa o 1º slide, some no fim
  const overallOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.12, 0.96, 1.0],
    [0, 0, 1, 1, 0],
  );

  const thumbPercent = useTransform(scrollYProgress, [0.10, 1.0], [0, 100]);
  const thumbTop = useTransform(thumbPercent, (v) => `${Math.min(100, Math.max(0, v))}%`);

  return (
    <>
      {/* Dots no topo */}
      <motion.div
        style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          zIndex: 50, opacity: overallOpacity,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {sections.map((label, i) => (
            <TopDot key={label} index={i} label={label} scrollYProgress={scrollYProgress} />
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

function TopDot({ index, label, scrollYProgress }: {
  index: number; label: string; scrollYProgress: MotionValue<number>;
}) {
  const mid = SLIDE_MIDS[index];
  const r = 0.09;

  const scale      = useTransform(scrollYProgress, [mid - r, mid, mid + r], [0.7, 1, 0.7]);
  const dotOpacity = useTransform(scrollYProgress, [mid - r, mid, mid + r], [0.2, 1, 0.2]);
  const lblOpacity = useTransform(scrollYProgress, [mid - r, mid, mid + r], [0, 0.7, 0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <motion.div style={{
        width: 6, height: 6, borderRadius: '50%', backgroundColor: '#77BDAC',
        scale, opacity: dotOpacity,
      }} />
      <motion.span style={{
        opacity: lblOpacity, fontSize: '0.45rem', color: '#77BDAC',
        letterSpacing: '0.06em', whiteSpace: 'nowrap', fontFamily: 'monospace',
      }}>
        {label}
      </motion.span>
    </div>
  );
}
