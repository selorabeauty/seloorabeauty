'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';
import { captureClickIds, trackPixelPageView, mirrorInitialPageView } from '@/lib/pixels';

export default function TrackPageView() {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    captureClickIds();          // persist ttclid/ScCid from landing URLs
    track.pageview();           // internal analytics on every route

    // The <head> snippet already fired the browser PageView with a shared
    // event_id — just mirror it to CAPI so blocked browsers still count.
    if (firstRun.current) {
      firstRun.current = false;
      mirrorInitialPageView();
      return;
    }
    trackPixelPageView();
  }, [pathname]);

  return null;
}
