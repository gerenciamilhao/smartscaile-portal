'use client';

import { useState, useCallback, useRef } from 'react';
import { useIsMobile } from '@/lib/useIsMobile';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import PainHero, { type PainHeroHandle } from './PainHero';
import Hero from './Hero';
import TokenModal from './TokenModal';
import ProposalScroll from './ProposalScroll';
import { ProgressIndicator } from './ProgressIndicator';
import { ProposalFooter } from '@/components/portal/ProposalFooter';
import type { ClientData } from '@/lib/clients';

type PageState = 'locked' | 'unlocked';

const SECTION_LABELS = ['Início', 'Auditoria', 'Escala', 'CPA', 'Dados', 'Implementação', 'Investimento', 'Proposta'];

interface CinematicExperienceProps {
  initialData?: ClientData | null;
}

export default function CinematicExperience({ initialData }: CinematicExperienceProps) {
  const [pageState, setPageState] = useState<PageState>(initialData ? 'unlocked' : 'locked');
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(initialData || null);
  const painRef = useRef<PainHeroHandle>(null);

  const handleUnlock = useCallback(() => setShowModal(true), []);

  const handleTokenSuccess = useCallback(async () => {
    setShowModal(false);
    // Fetch data first, then transition
    try {
      const res = await fetch('/api/client-data');
      if (res.ok) setClientData(await res.json());
    } catch {}
    setPageState('unlocked');
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    painRef.current?.resetSlider();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {pageState === 'locked' && (
          <PainHero key="pain" ref={painRef} onUnlock={handleUnlock} clientData={clientData} />
        )}

        {pageState === 'unlocked' && (
          <motion.div
            key="solution"
            initial={initialData ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <UnlockedExperience clientData={clientData} />
          </motion.div>
        )}
      </AnimatePresence>

      <TokenModal open={showModal} onClose={handleModalClose} onSuccess={handleTokenSuccess} />

      {/* DEV: botão de reset para testar fluxo */}
      {process.env.NODE_ENV === 'development' && pageState === 'unlocked' && (
        <button
          onClick={() => { setPageState('locked'); setClientData(null); window.scrollTo(0, 0); }}
          style={{
            position: 'fixed', top: 12, right: 12, zIndex: 9999,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#EF4444', fontSize: '0.6rem', fontFamily: 'monospace',
            cursor: 'pointer', opacity: 0.6,
          }}
        >
          ← PainHero
        </button>
      )}
    </>
  );
}

// ─── Unlocked Experience ──────────────────────────────────────────────────────
function UnlockedExperience({ clientData }: { clientData: ClientData | null }) {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasProposal = !!clientData;

  // Scroll progress do container
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  // Hero sai: fade + drift up — desativa completamente ao terminar
  const heroOpacity    = useTransform(scrollYProgress, [0, 0.02, 0.06], [1, 1, 0]);
  const heroY          = useTransform(scrollYProgress, [0, 0.02, 0.06], [0, 0, -40]);
  const heroPointer    = useTransform(scrollYProgress, (v) => v > 0.06 ? 'none' : 'auto');
  const heroVisibility = useTransform(scrollYProgress, (v) =>
    v > 0.08 ? ('hidden' as const) : ('visible' as const)
  );

  return (
    <>
      {/* Container tall — 1200vh dá respiração entre os 8 slides */}
      <div
        ref={scrollRef}
        style={{ height: hasProposal ? '1200vh' : 'auto', position: 'relative' }}
      >
        {/* Viewport sticky — fica preso no topo */}
        <div
          className="bg-hero-mesh"
          style={{
            position: hasProposal ? 'sticky' : 'relative',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Persistent ambient glow — always visible, disguises slide transitions */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            {/* Top-center teal glow */}
            <div
              style={{
                position: 'absolute',
                top: '-15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '50%',
                background: 'radial-gradient(ellipse at center, rgba(119,189,172,0.07) 0%, transparent 70%)',
                filter: isMobile ? 'blur(20px)' : 'blur(60px)',
              }}
            />
            {/* Bottom-right subtle glow */}
            <div
              style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(ellipse at center, rgba(119,189,172,0.04) 0%, transparent 70%)',
                filter: isMobile ? 'blur(20px)' : 'blur(80px)',
              }}
            />
          </div>

          {/* Hero — fades e sobe ao scrollar */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              opacity:    hasProposal ? heroOpacity    : 1,
              y:          hasProposal ? heroY          : 0,
              pointerEvents: hasProposal ? heroPointer    : 'auto',
              visibility: hasProposal ? heroVisibility : 'visible',
            }}
          >
            <Hero clientData={clientData} />
          </motion.div>

          {/* Slides da proposta — cada um aparece por cima do Hero */}
          {hasProposal && (
            <ProposalScroll scrollYProgress={scrollYProgress} clientData={clientData} />
          )}
        </div>
      </div>

      {hasProposal && <ProposalFooter />}

      {hasProposal && (
        <ProgressIndicator scrollYProgress={scrollYProgress} sections={SECTION_LABELS} />
      )}
    </>
  );
}
