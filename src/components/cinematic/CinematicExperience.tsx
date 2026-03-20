'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import PainHero, { type PainHeroHandle } from './PainHero';
import TokenModal from './TokenModal';
import ProposalScroll from './ProposalScroll';
import { ProgressIndicator } from './ProgressIndicator';
import { ProposalFooter } from '@/components/portal/ProposalFooter';
import type { ClientData } from '@/lib/clients';

type PageState = 'locked' | 'unlocked';

const SECTION_LABELS = ['Início', 'Auditoria', 'Escala', 'CPA', 'Dados', 'Implementação'];

interface CinematicExperienceProps {
  initialData?: ClientData | null;
  clienteSlug?: string;
}

export default function CinematicExperience({ initialData, clienteSlug }: CinematicExperienceProps) {
  const [pageState, setPageState] = useState<PageState>(initialData ? 'unlocked' : 'locked');
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(initialData || null);
  const painRef = useRef<PainHeroHandle>(null);

  const handleUnlock = useCallback(() => setShowModal(true), []);

  const handleTokenSuccess = useCallback(async () => {
    setShowModal(false);
    // Fetch data first, then transition
    try {
      const url = clienteSlug ? `/api/client-data?cliente=${clienteSlug}` : '/api/client-data';
      const res = await fetch(url);
      if (res.ok) setClientData(await res.json());
    } catch {}
    setPageState('unlocked');
  }, [clienteSlug]);

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasProposal = !!clientData;

  // Scroll progress do container
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      {/* Container tall — 1200vh → 150vh por slide (8 slides) */}
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
          {/* Slides da proposta */}
          {hasProposal && (
            <ProposalScroll scrollYProgress={scrollYProgress} clientData={clientData} />
          )}
        </div>
      </div>

      {hasProposal && <ProposalFooter />}

      {hasProposal && (
        <ProgressIndicator scrollYProgress={scrollYProgress} sections={SECTION_LABELS} />
      )}

      {/* Back to top button */}
      {hasProposal && (
        <BackToHeroButton scrollYProgress={scrollYProgress} />
      )}
    </>
  );
}

// ─── Back to Hero button ──────────────────────────────────────────────────────
function BackToHeroButton({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.14, 0.96, 1.0],
    [0, 0, 1, 1, 0],
  );

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 50,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 99,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.6rem',
        fontFamily: 'var(--font-mono), monospace',
        fontWeight: 500,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: 'color 0.2s ease, border-color 0.2s ease',
      }}
      whileHover={{ color: 'rgba(119,189,172,0.8)', borderColor: 'rgba(119,189,172,0.2)' }}
    >
      <ArrowUp size={12} strokeWidth={1.5} />
      Início
    </motion.button>
  );
}
