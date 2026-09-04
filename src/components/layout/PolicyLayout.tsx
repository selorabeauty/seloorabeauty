import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Props {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20" style={{ backgroundColor: '#F8F2EA' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A0F08' }}>{title}</h1>
          {lastUpdated && (
            <p className="text-sm mb-8" style={{ color: '#8C7B6E' }}>آخر تحديث: {lastUpdated}</p>
          )}
          <div
            className="rounded-3xl p-8 border"
            style={{ background: '#fff', borderColor: '#EFE4D4', boxShadow: '0 4px 32px -4px rgba(58,40,24,0.08)' }}
          >
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
