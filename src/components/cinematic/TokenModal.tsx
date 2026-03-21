'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X, Loader2 } from 'lucide-react';

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
            background: 'rgba(0,0,0,0.98)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: '360px',
              margin: '0 20px',
              overflow: 'hidden',
              borderRadius: '20px',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 2,
                width: 28, height: 28, borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#374151',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#9CA3AF';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <X size={13} strokeWidth={1.5} />
            </button>

            {/* Content */}
            <div style={{ position: 'relative', padding: '44px 32px 32px', zIndex: 1 }}>

              {/* Logo */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <motion.img
                  src="/logo-avatar.png"
                  alt="smartscaile."
                  width={64}
                  height={64}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'block' }}
                />
              </div>

              {/* Branding */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                style={{ textAlign: 'center', marginBottom: '28px' }}
              >
                <p style={{
                  color: '#9CA3AF', fontSize: '0.85rem',
                  lineHeight: 1.5, maxWidth: 260, margin: '0 auto',
                }}>
                  Insira o token enviado para acessar sua proposta exclusiva
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                {/* Input */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, borderRadius: '5px',
                    background: 'rgba(119,189,172,0.06)',
                    border: '1px solid rgba(119,189,172,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Lock size={9} color="#77BDAC" strokeWidth={2} style={{ opacity: 0.6 }} />
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    className="input-masked"
                    value={token}
                    onChange={e => { setToken(e.target.value); if (error) setError(''); }}
                    placeholder="Token de acesso"
                    disabled={loading}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 42px',
                      borderRadius: '12px',
                      border: error
                        ? '1px solid rgba(239,68,68,0.30)'
                        : '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#F3F4F6',
                      fontSize: '16px',
                      fontFamily: 'var(--font-mono), monospace',
                      letterSpacing: '0.1em',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => {
                      if (!error) {
                        e.currentTarget.style.borderColor = 'rgba(119,189,172,0.25)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(119,189,172,0.06)';
                      }
                    }}
                    onBlur={e => {
                      if (!error) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      style={{
                        marginTop: '10px',
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 12px', borderRadius: '8px',
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.12)',
                      }}
                    >
                      <div style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#EF4444', flexShrink: 0,
                      }} />
                      <span style={{ color: '#EF4444', fontSize: '0.72rem', fontFamily: 'var(--font-mono), monospace' }}>
                        {error}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading || !token.trim()}
                  whileHover={!loading && token.trim() ? { scale: 1.015 } : {}}
                  whileTap={!loading && token.trim() ? { scale: 0.985 } : {}}
                  style={{
                    marginTop: '14px', width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: loading || !token.trim()
                      ? 'rgba(119,189,172,0.06)'
                      : 'linear-gradient(180deg, rgba(119,189,172,0.18) 0%, rgba(119,189,172,0.12) 100%)',
                    color: '#77BDAC',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    cursor: loading || !token.trim() ? 'default' : 'pointer',
                    opacity: loading || !token.trim() ? 0.35 : 1,
                    transition: 'opacity 0.3s, background 0.3s',
                    boxShadow: loading || !token.trim() ? 'none' : '0 0 20px rgba(119,189,172,0.06)',
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={14} strokeWidth={2} />
                      </motion.div>
                      Verificando...
                    </>
                  ) : (
                    <>
                      Acessar proposta
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </>
                  )}
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  marginTop: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 3, height: 3, borderRadius: '50%', background: '#77BDAC' }}
                />
                <span style={{
                  color: '#27272a', fontSize: '0.5rem',
                  fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  Preparado exclusivamente para você
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
