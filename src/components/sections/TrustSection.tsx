import { Banknote, Headphones, PackageCheck } from 'lucide-react';

const ITEMS = [
  { Icon: Banknote, title: 'الدفع عند الاستلام', description: 'اطلب الآن وادفع عند وصول طلبك.' },
  { Icon: PackageCheck, title: 'طقم متكامل', description: 'سيروم Daranca 30 مل وديرما رولر 0.5 ملم.' },
  { Icon: Headphones, title: 'خدمة العملاء', description: 'تواصل معنا للاستفسار عن المنتج والطلب.' },
];

export default function TrustSection() {
  return (
    <section className="bg-[#0B1B3D] py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6">
        {ITEMS.map(({ Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-white/15 p-6">
            <Icon className="text-amber-300" size={24} />
            <h3 className="font-bold mt-4">{title}</h3>
            <p className="text-sm text-blue-100 mt-2">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
