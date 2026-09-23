'use client';

import { useEffect } from 'react';

const headingByHash: Record<string, string> = {
  '#work-scenes': 'tool-work-scenes-title',
  '#tool-workflow-title': 'tool-workflow-title',
  '#all-tools': 'tool-directory-title',
};

export function ToolHashFocus() {
  useEffect(() => {
    const focusHeading = () => {
      const headingId = headingByHash[window.location.hash];
      if (headingId) document.getElementById(headingId)?.focus({ preventScroll: true });
    };

    focusHeading();
    window.addEventListener('hashchange', focusHeading);
    return () => window.removeEventListener('hashchange', focusHeading);
  }, []);

  return null;
}
