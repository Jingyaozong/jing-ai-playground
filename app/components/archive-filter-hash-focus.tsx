'use client';

import { useEffect } from 'react';

export function ArchiveFilterHashFocus({ hash, headingId }: { hash: string; headingId: string }) {
  useEffect(() => {
    const focusHeading = () => {
      if (window.location.hash === hash) {
        document.getElementById(headingId)?.focus({ preventScroll: true });
      }
    };

    focusHeading();
    window.addEventListener('hashchange', focusHeading);
    return () => window.removeEventListener('hashchange', focusHeading);
  }, [hash, headingId]);

  return null;
}
