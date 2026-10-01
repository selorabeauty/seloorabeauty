import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';
import TrackPageView from '@/components/ui/TrackPageView';

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const SNAPCHAT_PIXEL_ID = process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID;

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
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-arabic antialiased">
        <TrackPageView />
        {children}

        {/* ── TikTok Pixel ── */}
        {TIKTOK_PIXEL_ID && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.methods.length;n++)ttq.setAndDefer(e,e.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        )}

        {/* ── Snapchat Pixel ── */}
        {SNAPCHAT_PIXEL_ID && (
          <Script id="snapchat-pixel" strategy="afterInteractive">
            {`
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');
              snaptr('init', '${SNAPCHAT_PIXEL_ID}');
              snaptr('track', 'PAGE_VIEW');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
