'use client';

import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';

export interface SlideToUnlockHandle {
  reset: () => void;
}

interface SlideToUnlockProps {
  onUnlock: () => void;
}

const THRESHOLD = 0.8;

const SlideToUnlock = forwardRef<SlideToUnlockHandle, SlideToUnlockProps>(function SlideToUnlock({ onUnlock }, ref) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const x = useMotionValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useImperativeHandle(ref, () => ({
    reset() {
      setUnlocked(false);
      animate(x, 0, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
    },
  }), [x]);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth - 56);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const progress    = useTransform(x, [0, trackWidth || 1], [0, 1]);
  const textOpacity = useTransform(x, [0, (trackWidth || 1) * 0.35], [1, 0]);
  const trackBorder = useTransform(progress, [0, 1], ['rgba(239,68,68,0.25)', 'rgba(119,189,172,0.3)']);
  const thumbBg     = useTransform(progress, [0, 0.5, 1], ['rgba(239,68,68,0.85)', 'rgba(190,120,80,0.9)', 'rgba(119,189,172,0.9)']);
  const lockRotate  = useTransform(x, [0, trackWidth || 1], [0, 360]);

  const handleDragEnd = useCallback(() => {
    const ratio = x.get() / (trackWidth || 1);
    if (ratio >= THRESHOLD) {
      animate(x, trackWidth, { duration: 0.25, ease: [0.16, 1, 0.3, 1] });
      setUnlocked(true);
      setTimeout(() => onUnlock(), 550);
    } else {
      animate(x, 0, { duration: 0.45, ease: [0.16, 1, 0.3, 1] });
    }
  }, [trackWidth, x, onUnlock]);

  return (
    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
      <motion.div
        ref={trackRef}
        style={{
          position: 'relative', height: '52px', borderRadius: '26px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid', borderColor: trackBorder,
          overflow: 'hidden',
          cursor: unlocked ? 'default' : 'grab',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        {/* Subtle fill que avança com o thumb */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(239,68,68,0.06), rgba(119,189,172,0.06))',
          opacity: useTransform(progress, [0, 1], [0.4, 1]),
        }} />

        {/* Label */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: textOpacity,
        }}>
          <span style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.06em' }}>
            Deslize para desbloquear
          </span>
        </motion.div>

        {/* Thumb draggável */}
        <motion.div
          drag={unlocked ? false : 'x'}
          dragConstraints={{ left: 0, right: trackWidth }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{
            position: 'absolute', top: '4px', left: '4px',
            width: '44px', height: '44px', borderRadius: '22px',
            background: thumbBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: unlocked ? 'default' : 'grab',
            x, zIndex: 2,
          }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {unlocked ? (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <LockOpen size={18} color="#050505" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div style={{ rotate: lockRotate }}>
              <Lock size={18} color="#050505" strokeWidth={2.5} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

    </div>
  );
});

export default SlideToUnlock;
