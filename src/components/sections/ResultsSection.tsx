export default function ResultsSection() {
  return (
    <section id="results" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="section-heading text-center">صور وتجارب العملاء</h2>
        <p className="section-sub text-center">مساحة مخصصة لصور قبل وبعد الموثقة عند توفرها.</p>
        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
              مكان لصورة قبل وبعد
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
