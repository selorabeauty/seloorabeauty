import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import '../globals.css';
import TrackPageView from '@/components/ui/TrackPageView';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'سيلورا بيوتي | طقم علاج تشققات الجسم — سيروم وكريم اللوز والأرجان',
  description:
    'طقم سيلورا لعلاج تشققات الجسم — سيروم وكريم بزيت اللوز الحلو والأرجان المغربي. يفتح لون التشققات ويستعيد مرونة البشرة خلال ٤ أسابيع. دفع عند الاستلام. شحن سريع داخل المملكة.',
  keywords: 'علاج تشققات الجسم، تشققات الحمل، سيروم تشققات، كريم تشققات، زيت اللوز، زيت الأرجان، سيلورا بيوتي، Sellura Beauty',
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Pixel IDs are public (visible in page source anyway) — hardcoded
  // fallbacks guarantee pixels always fire regardless of env config.
  const TIKTOK_PIXEL_ID =
    process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
    || 'DB186MJC77UCLKF28K40';
  const SNAPCHAT_PIXEL_ID =
    process.env.SNAPCHAT_PIXEL_ID || process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
    || '69bd7e07-0a73-407c-9be4-993fcae37ccb';

  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        {/*
          Raw inline <script> tags — NOT next/script.
          next/script afterInteractive only injects after React hydration;
          these run during HTML parse so the pixel SDK always initializes
          (this is what Pixel Helper checks for).
        */}
        {TIKTOK_PIXEL_ID && (
          <script
            id="tiktok-pixel"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                  window.__ttPvId = window.__ttPvId || (crypto.randomUUID ? crypto.randomUUID() : 'pv' + Date.now());
                  ttq.load('${TIKTOK_PIXEL_ID}');
                  ttq.page({event_id: window.__ttPvId});
                }(window, document, 'ttq');
              `,
            }}
          />
        )}
        {SNAPCHAT_PIXEL_ID && (
          <script
            id="snapchat-pixel"
            dangerouslySetInnerHTML={{
              __html: `
                (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');
                var __pvId = window.__ttPvId || (window.__ttPvId = crypto.randomUUID ? crypto.randomUUID() : 'pv' + Date.now());
                window.__snapPixelId='${SNAPCHAT_PIXEL_ID}';
                snaptr('init', '${SNAPCHAT_PIXEL_ID}');
                snaptr('track', 'PAGE_VIEW', {client_dedup_id: __pvId});
              `,
            }}
          />
        )}
      </head>
      <body className="font-arabic antialiased">
        <TrackPageView />
        {children}
      </body>
    </html>
  );
}
