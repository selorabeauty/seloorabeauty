'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── واتساب: ضع رقمك هنا بعدين (بدون + ومع رمز الدولة) ──
export const WHATSAPP_NUMBER = '966XXXXXXXXX';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [status,  setStatus]  = useState<Status>('idle');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = 'الاسم مطلوب';
    if (!email.trim())   e.email   = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'بريد إلكتروني غير صحيح';
    if (!message.trim()) e.message = 'الرسالة مطلوبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    const payload = { name, email, orderId, subject, message, sentAt: new Date().toISOString() };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      } else {
        // Fallback: open mailto if no webhook configured
        window.location.href =
          `mailto:hello@seloorabeauty.shop` +
          `?subject=${encodeURIComponent(subject || 'رسالة من الموقع')}` +
          `&body=${encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\nرقم الطلب: ${orderId}\n\n${message}`)}`;
      }
      setStatus('sent');
      setName(''); setEmail(''); setOrderId(''); setSubject(''); setMessage('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        className="rounded-3xl p-10 text-center flex flex-col items-center gap-4"
        style={{ background: '#EAF5EE', border: '1.5px solid #A8D8B8' }}
      >
        <CheckCircle2 size={48} style={{ color: '#2D6B41' }} />
        <h3 className="font-black text-xl" style={{ color: '#1A4A2A' }}>تم إرسال رسالتك! ✅</h3>
        <p className="text-sm" style={{ color: '#2D6B41' }}>
          سنرد عليكِ خلال ٢٤ ساعة على بريدك الإلكتروني.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-secondary mt-2 px-6 py-2.5 text-sm"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
            الاسم <span style={{ color: '#C0392B' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="سارة الأحمد"
            className={cn('input', errors.name && 'input-error')}
          />
          {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
            البريد الإلكتروني <span style={{ color: '#C0392B' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            dir="ltr"
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
            placeholder="example@email.com"
            className={cn('input text-start', errors.email && 'input-error')}
          />
          {errors.email && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.email}</p>}
        </div>
      </div>

      {/* Order ID + Subject */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
            رقم الطلب <span className="text-xs font-normal" style={{ color: '#8C7B6E' }}>(اختياري)</span>
          </label>
          <input
            type="text"
            value={orderId}
            dir="ltr"
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="SLR-XXXXXX"
            className="input text-start"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
            موضوع الرسالة <span className="text-xs font-normal" style={{ color: '#8C7B6E' }}>(اختياري)</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
          >
            <option value="">اختاري الموضوع</option>
            <option value="استفسار عن طلبي">استفسار عن طلبي</option>
            <option value="استفسار عن المنتج">استفسار عن المنتج</option>
            <option value="طلب استرداد">طلب استرداد</option>
            <option value="مشكلة في التوصيل">مشكلة في التوصيل</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
          رسالتك <span style={{ color: '#C0392B' }}>*</span>
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
          placeholder="اكتبي رسالتك هنا..."
          className={cn('input resize-none', errors.message && 'input-error')}
        />
        {errors.message && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.message}</p>}
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FDE8E8', color: '#C0392B', border: '1px solid #f5c6c6' }}>
          حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل عبر الواتساب.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-gold self-start px-8 py-3.5 flex items-center gap-2 disabled:opacity-70"
      >
        {status === 'sending'
          ? <><Loader2 size={16} className="animate-spin" /> جاري الإرسال...</>
          : 'إرسال الرسالة →'}
      </button>
    </form>
  );
}
