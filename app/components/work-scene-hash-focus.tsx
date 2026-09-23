'use client';

import { useEffect } from 'react';

export function WorkSceneHashFocus() {
  useEffect(() => {
    const focusWorkScenes = () => {
      if (window.location.hash !== '#work-scenes') return;
      document.getElementById('tool-work-scenes-title')?.focus({ preventScroll: true });
    };

    focusWorkScenes();
    window.addEventListener('hashchange', focusWorkScenes);
    return () => window.removeEventListener('hashchange', focusWorkScenes);
  }, []);

  return null;
}
