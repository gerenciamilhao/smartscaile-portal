'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll via Lenis.
 * GSAP ScrollTrigger removido — nenhum componente o utiliza.
 * Framer Motion useScroll cuida do scroll tracking.
 */
export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
