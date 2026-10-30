const CARDS = [
  { icon: '🧪', title: 'ببتيدات النحاس GHK-Cu', text: 'سيروم 30 مل ضمن روتين العناية بمظهر البشرة.' },
  { icon: '🪡', title: 'ديرما رولر تيتانيوم 0.5mm', text: 'أداة للعناية بالبشرة. اتبع تعليمات الشركة المصنّعة للاستخدام والتنظيف.' },
];

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-amber-700 font-bold text-sm">THE PROTOCOL</span>
          <h2 className="section-heading mt-3">تعرّف على عناصر الطقم</h2>
          <p className="section-sub">خطوتان في روتين واحد للعناية بالبشرة.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map((card) => (
            <article key={card.title} className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-lg font-black text-slate-900 mt-4">{card.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 mt-2">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
