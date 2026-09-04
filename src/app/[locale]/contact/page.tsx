import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm, { WHATSAPP_NUMBER } from '@/components/ui/ContactForm';
import { Mail, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';

export const metadata = {
  title: 'تواصلي معنا | سيلورا بيوتي',
  description: 'تواصلي مع فريق دعم سيلورا بيوتي — عبر البريد الإلكتروني أو واتساب. نرد خلال ٢٤ ساعة.',
};

const INFO_CARDS = [
  {
    icon: MessageCircle,
    color: '#25D366',
    bg: '#EAF5EE',
    border: '#A8D8B8',
    label: 'واتساب',
    value: 'تواصلي مباشرة',
    sub: 'رد سريع خلال ساعات',
    isWhatsapp: true,
  },
  {
    icon: Mail,
    color: '#C4943E',
    bg: '#FBF3E3',
    border: '#E8C98A',
    label: 'البريد الإلكتروني',
    value: 'hello@seloorabeauty.shop',
    sub: 'نرد خلال ٢٤ ساعة',
    isWhatsapp: false,
  },
  {
    icon: Clock,
    color: '#6E5C50',
    bg: '#F8F2EA',
    border: '#EFE4D4',
    label: 'ساعات الدعم',
    value: 'الأحد — الخميس',
    sub: '٩ صباحاً — ٦ مساءً',
    isWhatsapp: false,
  },
  {
    icon: MapPin,
    color: '#6E5C50',
    bg: '#F8F2EA',
    border: '#EFE4D4',
    label: 'التوصيل',
    value: 'جميع مناطق المملكة',
    sub: 'الرياض · جدة · الدمام وأكثر',
    isWhatsapp: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#FDFAF6' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-heading mb-3">تواصلي معنا</h1>
            <p className="section-sub">
              فريقنا موجود لمساعدتكِ — استفساراتك، طلباتك، ملاحظاتك كلها مهمة لنا
            </p>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {INFO_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl p-5 flex items-start gap-4 transition-shadow hover:shadow-lg"
                  style={{ background: card.bg, border: `1.5px solid ${card.border}` }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold mb-0.5" style={{ color: '#8C7B6E' }}>{card.label}</div>
                    <div className="font-black text-sm" style={{ color: '#1A0F08' }}>{card.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6E5C50' }}>{card.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* WhatsApp CTA — prominent */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً سيلورا، عندي استفسار...')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 font-black text-lg mb-10 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #1ebe5d 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px -4px rgba(37,211,102,0.40)',
            }}
          >
            <MessageCircle size={22} />
            تواصلي معنا عبر واتساب
            <Phone size={18} style={{ opacity: 0.8 }} />
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: '#EFE4D4' }} />
            <span className="text-sm font-bold" style={{ color: '#8C7B6E' }}>أو أرسلي رسالة</span>
            <div className="flex-1 h-px" style={{ background: '#EFE4D4' }} />
          </div>

          {/* Email Form */}
          <div
            className="rounded-3xl p-6 sm:p-8 mb-10"
            style={{ background: '#fff', border: '1.5px solid #EFE4D4', boxShadow: '0 2px 16px -2px rgba(58,40,24,0.07)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: '#FBF3E3' }}
              >
                <Mail size={18} style={{ color: '#C4943E' }} />
              </div>
              <div>
                <h2 className="font-black text-lg" style={{ color: '#1A0F08' }}>أرسلي رسالتك</h2>
                <p className="text-xs" style={{ color: '#8C7B6E' }}>سنرد على بريدك الإلكتروني خلال ٢٤ ساعة</p>
              </div>
            </div>
            <ContactForm />
          </div>

          {/* FAQ link */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: '#FBF3E3', border: '1px solid #E8C98A' }}
          >
            <p className="font-medium text-sm" style={{ color: '#8A611E' }}>
              هل سؤالك عن المنتج أو الطلب؟{' '}
              <a href="/ar#faq" className="font-black underline" style={{ color: '#C4943E' }}>
                اطلعي على الأسئلة الشائعة أولاً ←
              </a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
