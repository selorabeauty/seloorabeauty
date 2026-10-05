'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';
import { captureClickIds, trackPixelPageView } from '@/lib/pixels';

export default function TrackPageView() {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    captureClickIds();          // persist ttclid/ScCid from landing URLs
    track.pageview();           // internal analytics on every route

    // The <head> pixel snippets already fire the initial PageView —
    // only fire pixel pageview on subsequent SPA route changes.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    trackPixelPageView();
  }, [pathname]);

  return null;
}
