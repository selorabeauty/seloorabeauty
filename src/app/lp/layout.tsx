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
  title: 'سيلورا بيوتي | روتين العناية بتشققات الجسم — ببتيدات النحاس + ديرما رولر',
  description: 'سيروم ببتيدات النحاس GHK-Cu مع السيكا وديرما رولر 0.5mm للعناية بمظهر تشققات الجسم وملمس البشرة. دفع عند الاستلام وشحن لجميع مدن المملكة.',
};

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-arabic antialiased bg-[#FDFAF6] text-[#1A0F08]">
        <TrackPageView />
        {children}
      </body>
    </html>
  );
}
