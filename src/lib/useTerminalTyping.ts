import { useState, useEffect, useCallback } from 'react';

export interface TerminalLine {
  text: string;
  color?: string;
  prefix?: string;
  delay?: number;
}

/**
 * Terminal typing effect hook — types lines char-by-char, loops after hold.
 *
 * @param lines - array of terminal lines to type
 * @param active - only run typing when true (default: true)
 * @param holdMs - ms to hold after all lines typed before restarting (default: 3000)
 */
export function useTerminalTyping(lines: TerminalLine[], active: boolean = true, holdMs: number = 3000) {
  const [visibleChars, setVisibleChars] = useState<number[]>(lines.map(() => 0));
  const [activeLine, setActiveLine] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  const resetAndLoop = useCallback(() => {
    setVisibleChars(lines.map(() => 0));
    setActiveLine(0);
    setLoopKey((k) => k + 1);
  }, [lines]);

  useEffect(() => {
    if (!active) return;

    if (activeLine >= lines.length) {
      const holdTimer = setTimeout(resetAndLoop, holdMs);
      return () => clearTimeout(holdTimer);
    }

    const line = lines[activeLine];
    const fullText = `${line.prefix ?? '>'} ${line.text}`;
    const charCount = visibleChars[activeLine];

    if (charCount >= fullText.length) {
      const nextTimer = setTimeout(() => setActiveLine((a) => a + 1), line.delay ?? 120);
      return () => clearTimeout(nextTimer);
    }

    const speed = 25 + Math.random() * 20;
    const charTimer = setTimeout(() => {
      setVisibleChars((prev) => {
        const next = [...prev];
        next[activeLine] = charCount + 1;
        return next;
      });
    }, speed);
    return () => clearTimeout(charTimer);
  }, [activeLine, visibleChars, lines, loopKey, resetAndLoop, active, holdMs]);

  return { visibleChars, activeLine, loopKey };
}
