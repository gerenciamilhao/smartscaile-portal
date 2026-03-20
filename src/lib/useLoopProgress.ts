import { useState, useEffect, useRef } from 'react';
import { easeInOutCubic } from './animation-helpers';
import { tokens } from './tokens';

const LOOP_S = tokens.timing.loopDuration;

/**
 * Shared rAF-driven loop progress hook.
 * Returns a normalized value (0→1) that cycles through 4 phases:
 * up (easeOutCubic, 0→0.42) → hold top (0.42→0.55) → down (easeInOutCubic, 0.55→0.88) → hold bottom (0.88→1)
 *
 * @param isMobile - throttle to ~15fps on mobile, ~30fps on desktop
 * @param active - when false, pauses the rAF loop (default: true)
 */
export function useLoopProgress(isMobile: boolean = false, active: boolean = true) {
  const startRef = useRef(0);
  const lastRef = useRef(0);
  const [normalizedValue, setNormalizedValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    let raf: number;
    const throttleMs = isMobile ? 66 : 33; // ~15fps mobile, ~30fps desktop
    const tick = () => {
      const now = Date.now();
      if (now - lastRef.current >= throttleMs) {
        lastRef.current = now;
        const elapsed = (now - startRef.current) % (LOOP_S * 1000);
        const progress = elapsed / (LOOP_S * 1000);

        let val: number;
        if (progress < 0.42) {
          val = 1 - Math.pow(1 - progress / 0.42, 3); // easeOutCubic
        } else if (progress < 0.55) {
          val = 1;
        } else if (progress < 0.88) {
          val = 1 - easeInOutCubic((progress - 0.55) / 0.33);
        } else {
          val = 0;
        }
        setNormalizedValue(val);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, active]);

  return normalizedValue;
}
