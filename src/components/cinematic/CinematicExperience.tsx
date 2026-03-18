'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PainHero, { type PainHeroHandle } from './PainHero';
import Hero from './Hero';
import TokenModal from './TokenModal';

type PageState = 'locked' | 'unlocking' | 'unlocked';

export default function CinematicExperience() {
  const [pageState, setPageState] = useState<PageState>('locked');
  const [showModal, setShowModal] = useState(false);
  const painRef = useRef<PainHeroHandle>(null);

  const handleUnlock = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleTokenSuccess = useCallback(() => {
    setShowModal(false);
    setPageState('unlocking');
    setTimeout(() => {
      setPageState('unlocked');
    }, 800);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    // Reset slider to initial position without re-mounting PainHero
    painRef.current?.resetSlider();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {/* ── Pain Hero (locked) ── */}
        {pageState === 'locked' && (
          <PainHero key="pain" ref={painRef} onUnlock={handleUnlock} />
        )}

        {/* ── Unlock overlay ── */}
        {pageState === 'unlocking' && (
          <motion.div
            key="unlock-transition"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'linear-gradient(to bottom, #0a0505, #050505)' }}
          />
        )}

        {/* ── Hero (unlocked) ── */}
        {pageState === 'unlocked' && (
          <motion.div
            key="solution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-hero-mesh"
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Token Modal (overlay, independent of AnimatePresence) ── */}
      <TokenModal
        open={showModal}
        onClose={handleModalClose}
        onSuccess={handleTokenSuccess}
      />
    </>
  );
}
