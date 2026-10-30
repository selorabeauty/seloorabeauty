export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-[#f2f6fa]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="section-heading text-center">آراء العملاء</h2>
        <p className="section-sub text-center">ستظهر تقييمات العملاء هنا عند توفرها.</p>
        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="rounded-3xl border border-dashed border-slate-300 bg-white p-6">
              <div aria-hidden="true" className="text-slate-300 text-xl">☆☆☆☆☆</div>
              <p className="text-sm text-slate-500 mt-4">مكان لتقييم العميل</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
