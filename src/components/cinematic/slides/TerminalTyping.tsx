'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTerminalTyping, type TerminalLine } from '@/lib/useTerminalTyping';

export type { TerminalLine };

export function TerminalTyping({ lines, fontSize, title }: {
  lines: TerminalLine[];
  fontSize?: string;
  title?: string;
}) {
  const { visibleChars, activeLine } = useTerminalTyping(lines);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'relative',
        borderRadius: 14,
        background: 'linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(5,5,5,0.88) 100%)',
        border: '1px solid rgba(119,189,172,0.08)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: fontSize ?? '0.7rem',
        lineHeight: 1.8,
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      }}>
        {/* Window chrome */}
        <div style={{
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.015)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', opacity: 0.65 }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', opacity: 0.65 }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', opacity: 0.65 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              fontSize: '0.5rem', color: '#374151', letterSpacing: '0.06em',
              textTransform: 'uppercase', fontWeight: 500,
            }}>
              {title ?? 'smartscaile — audit'}
            </span>
          </div>
          <div style={{ width: 46 }} />
        </div>

        {/* Terminal body */}
        <div style={{ padding: '16px 20px' }}>
          {lines.map((line, i) => {
            const fullText = `${line.prefix ?? '>'} ${line.text}`;
            const chars = visibleChars[i];
            const notYet = i > activeLine && chars === 0;
            const displayed = fullText.slice(0, chars);
            const showCursor = i === activeLine && activeLine < lines.length;

            return (
              <div key={i} style={{
                color: line.color ?? '#77BDAC',
                height: '1.5em',
                visibility: notYet ? 'hidden' : 'visible',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{
                  width: 20, flexShrink: 0, textAlign: 'right', marginRight: 12,
                  color: '#27272a', fontSize: 'clamp(0.4rem, 1vw, 0.55rem)', userSelect: 'none',
                }}>
                  {i + 1}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                  {notYet ? '\u00A0' : displayed}
                  {showCursor && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ color: '#77BDAC', marginLeft: 1 }}
                    >
                      ▌
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '6px 16px',
          borderTop: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 4, height: 4, borderRadius: '50%', background: '#77BDAC' }}
            />
            <span style={{ fontSize: '0.45rem', color: '#374151', letterSpacing: '0.05em' }}>
              live
            </span>
          </div>
          <span style={{ fontSize: '0.45rem', color: '#27272a' }}>
            stape.io/checker
          </span>
        </div>
      </div>
    </div>
  );
}
