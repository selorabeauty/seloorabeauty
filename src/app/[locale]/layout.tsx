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
  title: 'سيلورا بيوتي | سيروم الريتينال المجدد للبشرة',
  description:
    'سيروم ريتينال مركّز لتجديد التشققات، ترميم اليدين من أضرار القيادة اليومية، وإعادة المرونة والشباب. دفع عند الاستلام. شحن سريع داخل المملكة.',
  keywords: 'سيروم ريتينال، تشققات، ترميم اليدين، اسمرار القيادة، سيلورا بيوتي، عناية بالبشرة السعودية',
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
        {children}
      </body>
    </html>
  );
}
