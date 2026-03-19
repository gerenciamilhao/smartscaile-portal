'use client';

import { type ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

interface ScrollSlideProps {
  children: ReactNode;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
  zIndex?: number;
  /** Último slide não faz fade-out — permanece visível até o footer */
  isLast?: boolean;
}

/**
 * Slide cinematográfico com entrada E saída suaves.
 *
 * Entrada (primeiros 25% do range): fade 0→1 + drift 40px→0
 * Saída  (últimos 20% do range):    fade 1→0 + drift 0→-30px (sobindo)
 *
 * Dessa forma a transição entre slides parece um crossfade elegante,
 * não um bloco duro. O slide atual some enquanto o próximo aparece.
 */
export function ScrollSlide({
  children,
  range,
  scrollYProgress,
  zIndex = 2,
  isLast = false,
}: ScrollSlideProps) {
  const [start, end] = range;
  const span = end - start;

  const inEnd    = start + span * 0.30; // fim da entrada (30% — mais suave)
  const outStart = isLast ? end : end - span * 0.30; // início da saída (30% — mais overlap)

  // Keypoints: [entrar, visível, começar-sair, terminar-sair]
  const opacityKeys = isLast
    ? [start, inEnd,  inEnd, end]   // último slide: fica opaco até o fim
    : [start, inEnd, outStart, end];
  const opacityVals = isLast
    ? [0, 1, 1, 1]
    : [0, 1, 1,  0];

  const yKeys = isLast
    ? [start, inEnd,  inEnd, end]
    : [start, inEnd, outStart, end];
  const yVals = isLast
    ? [30, 0, 0, 0]
    : [30, 0, 0, -20];

  const opacity = useTransform(scrollYProgress, opacityKeys, opacityVals);
  const y       = useTransform(scrollYProgress, yKeys, yVals);

  const pointer    = useTransform(opacity, (v) => (v > 0.1 ? 'auto' : 'none'));
  const visibility = useTransform(opacity, (v) =>
    v > 0.01 ? ('visible' as const) : ('hidden' as const),
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: pointer,
        visibility,
        position: 'absolute',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </motion.div>
  );
}
