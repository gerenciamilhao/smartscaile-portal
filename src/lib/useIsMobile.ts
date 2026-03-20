import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);
  return mobile;
}
