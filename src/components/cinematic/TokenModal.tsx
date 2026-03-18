'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X, AlertTriangle } from 'lucide-react';

interface TokenModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TokenModal({ open, onClose, onSuccess }: TokenModalProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Token inválido');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,5,5,0.9)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
          }}
          onClick={onClose}
        >
          {/* Card — pain theme: #0a0505 bg, red borders */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: '400px',
              padding: '36px 32px 32px',
              borderRadius: '16px',
              background: '#0a0a0a',
              border: '1px solid rgba(239,68,68,0.15)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 48px rgba(239,68,68,0.04)',
              margin: '0 20px',
              overflow: 'hidden',
            }}
          >
            {/* Ambient red glow inside card */}
            <div style={{
              position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '200px',
              background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4B5563', padding: '6px', borderRadius: '8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#9CA3AF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4B5563'; }}
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            {/* Icon + Logo */}
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
              {/* Icon container — pain red theme, matches PainHero badge icon style */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.09)',
                  border: '1px solid rgba(239,68,68,0.22)',
                  marginBottom: '16px',
                }}
              >
                <AlertTriangle size={18} color="#EF4444" strokeWidth={2} />
              </motion.div>

              {/* Logo — Playfair 700 (same as PainHero) */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="font-serif"
                style={{
                  fontSize: '1.15rem', fontWeight: 700,
                  letterSpacing: '0.02em', color: '#F3F4F6',
                }}
              >
                smartscaile.
              </motion.p>

              {/* Subtitle — text-muted, same font as PainHero subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{ marginTop: '8px', color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.5 }}
              >
                Acesse seu portal exclusivo
              </motion.p>
            </div>

            {/* Badge — pain red theme, mirrors PainHero badge pattern */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
            >
              <div className="animate-pulse-pain" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px', borderRadius: '9999px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#EF4444',
                fontSize: '0.7rem', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }}
                />
                Acesso Protegido
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#4B5563',
                }} />
                <input
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Insira seu token de acesso"
                  disabled={loading}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
                    borderRadius: '12px',
                    border: '1px solid rgba(239,68,68,0.15)',
                    background: '#080505',
                    color: '#F3F4F6',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.06)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    style={{ marginTop: '10px', color: '#EF4444', fontSize: '0.8rem' }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Primary button — pain red solid */}
              <motion.button
                type="submit"
                disabled={loading || !token.trim()}
                whileHover={!loading && token.trim() ? { scale: 1.02 } : {}}
                whileTap={!loading && token.trim() ? { scale: 0.98 } : {}}
                style={{
                  marginTop: '16px', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: loading || !token.trim() ? 'default' : 'pointer',
                  opacity: loading || !token.trim() ? 0.3 : 1,
                  transition: 'opacity 0.2s, background 0.2s, box-shadow 0.2s',
                  boxShadow: loading || !token.trim()
                    ? 'none'
                    : '0 0 30px rgba(239,68,68,0.15), 0 4px 24px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={e => {
                  if (!loading && token.trim()) {
                    e.currentTarget.style.background = '#DC2626';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(239,68,68,0.25), 0 6px 28px rgba(0,0,0,0.4)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#EF4444';
                  if (!loading && token.trim()) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(239,68,68,0.15), 0 4px 24px rgba(0,0,0,0.4)';
                  }
                }}
              >
                {loading ? 'Verificando...' : 'Acessar diagnóstico'}
                {!loading && <ArrowRight size={14} />}
              </motion.button>
            </motion.form>

            {/* Footer — monospace, same style as PainHero terminal text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: '20px', textAlign: 'center',
                color: '#4B5563', fontSize: '0.6rem',
                fontFamily: 'monospace', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Preparado exclusivamente para você
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
