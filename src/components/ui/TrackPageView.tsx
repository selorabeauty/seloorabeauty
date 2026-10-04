'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';
import { captureClickIds, trackPixelPageView } from '@/lib/pixels';

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    captureClickIds();          // persist ttclid/ScCid from landing URLs
    track.pageview();           // internal analytics
    trackPixelPageView();       // ttq.page() + snaptr PAGE_VIEW on every route
  }, [pathname]);

  return null;
}
