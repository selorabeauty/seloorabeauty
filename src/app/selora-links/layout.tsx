import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import '../globals.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'سيلورا بيوتي — إدارة روابط الإعلانات',
  robots: 'noindex, nofollow',
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="font-arabic antialiased bg-[#140C06] text-[#FDFAF6]">
        {children}
      </body>
    </html>
  );
}
