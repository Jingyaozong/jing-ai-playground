'use client';

import { useEffect, useRef } from 'react';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    node.classList.add('reveal-armed');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
