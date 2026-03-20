'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';

interface ScrollSlideProps {
  children: ReactNode;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
  zIndex?: number;
  /** Primeiro slide não faz fade-in — já começa visível */
  isFirst?: boolean;
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
const CONTENT_HEIGHT = 960;

export function ScrollSlide({
  children,
  range,
  scrollYProgress,
  zIndex = 2,
  isFirst = false,
  isLast = false,
}: ScrollSlideProps) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    setZoom(Math.min(1, window.innerHeight / CONTENT_HEIGHT));
  }, []);
  const [start, end] = range;
  const span = end - start;

  const inEnd    = start + span * 0.30; // fim da entrada (30% — mais suave)
  const outStart = isLast ? end : end - span * 0.30; // início da saída (30% — mais overlap)

  // Keypoints: [entrar, visível, começar-sair, terminar-sair]
  const opacityKeys = isFirst
    ? [start, start + 0.001, outStart, end]   // primeiro slide: começa opaco, sem fade-in
    : isLast
    ? [start, inEnd,  inEnd, end]     // último slide: fica opaco até o fim
    : [start, inEnd, outStart, end];
  const opacityVals = isFirst
    ? [1, 1, 1, 0]
    : isLast
    ? [0, 1, 1, 1]
    : [0, 1, 1,  0];

  const yKeys = isFirst
    ? [start, start + 0.001, outStart, end]
    : isLast
    ? [start, inEnd,  inEnd, end]
    : [start, inEnd, outStart, end];
  const yVals = isFirst
    ? [0, 0, 0, -20]
    : isLast
    ? [30, 0, 0, 0]
    : [30, 0, 0, -20];

  const opacity = useTransform(scrollYProgress, opacityKeys, opacityVals);
  const y       = useTransform(scrollYProgress, yKeys, yVals);

  const isVisible = useTransform(opacity, (v) => v > 0.005);
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
      <div style={{ zoom, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LazyContent isVisible={isVisible}>{children}</LazyContent>
      </div>
    </motion.div>
  );
}

function LazyContent({ isVisible, children }: { isVisible: MotionValue<boolean>; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Checar valor inicial no mount (isFirst já começa visível)
  useEffect(() => {
    const v = isVisible.get();
    if (v) {
      setMounted(true);
      setVisible(true);
    }
  }, [isVisible]);

  useMotionValueEvent(isVisible, 'change', (v) => {
    setVisible(v);
    if (v && !mounted) setMounted(true);
  });

  if (!mounted) return null;
  return <div style={{ display: visible ? 'contents' : 'none' }}>{children}</div>;
}
