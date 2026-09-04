# 04 — Frontend Specification

## Design System

### Colors (Tailwind custom palette)
```js
// tailwind.config.ts
colors: {
  nude:  { 50:'#FDFAF6', 100:'#F8F2EA', 200:'#EFE4D4', 300:'#E0CEBA' },
  bark:  { 700:'#3D2B1F', 800:'#2A1C12', 900:'#1A0F08' },
  gold:  { 300:'#D4A96A', 400:'#C4943E', 500:'#A87830', 600:'#8A611E' },
  mink:  { 400:'#8C7B6E', 500:'#6E5C50', 600:'#5A4A3F' },
}
```

### Typography
- **Font:** Tajawal (Google Fonts) — Arabic, clean, modern, trust-evoking
- **Direction:** RTL globally (`dir="rtl"` on `<html>`)
- **Scale:**
  - Hero H1: `text-4xl md:text-6xl font-black`
  - Section H2: `text-3xl font-bold`
  - Body: `text-base leading-relaxed`
  - Small trust copy: `text-sm text-mink-500`

### Spacing & Layout
- Max width: `max-w-7xl mx-auto px-4 sm:px-6`
- Section padding: `py-20 md:py-28`
- Cards: `rounded-3xl border border-nude-200 bg-white shadow-luxury`

### Animations
```js
// tailwind.config.ts → extend.animation
'cta-pulse': 'cta-pulse 2s ease-in-out infinite',  // CTA buttons
'float':     'float 4s ease-in-out infinite',        // product image
'shimmer':   'shimmer 2.5s linear infinite',          // loading states
```

---

## Pages Specification

### Page 1: Home Page (`/ar`)

**Layout (desktop): Text RIGHT, Image LEFT — alternating per section**

#### Section Order (scroll top → bottom):
```
1.  [NAVBAR]          Logo | Nav Links | Cart icon
2.  [ANNOUNCEMENT]    "الدفع عند الاستلام" — pulsing gold badge
3.  [HERO]            Hook headline + subtext + CTA + product image (left)
4.  [TRUST BAR]       4 icons: COD / Shipping / Guarantee / Reviews
5.  [PROBLEM]         "هذه مشاكلك؟" — 3 pain cards (stretch/cracks/wrinkles)
6.  [PRODUCT]         Product info RIGHT, image LEFT
7.  [HOW IT WORKS]    3-step visual (numbered, icon + text)
8.  [INGREDIENTS]     Science cards: Retinal + Centella + Niacinamide
9.  [RESULTS]         Before/after + clinical stats (% numbers big & bold)
10. [REVIEWS]         5-star reviews — real names, cities
11. [URGENCY]         Stock scarcity counter + "سعر الإطلاق ينتهي قريباً"
12. [FAQ]             Accordion — objection handling (6 questions)
13. [FINAL CTA]       Big bold CTA section before footer
14. [FOOTER]          Links, trust badges, social, legal
15. [STICKY BAR]      Fixed bottom: price + "اطلبي الآن" (after 700px scroll)
```

#### Hero Section Spec:
```tsx
// Desktop: image LEFT, text RIGHT
// Mobile: image top, text below

<section className="min-h-screen flex items-center bg-nude-50 pt-20">
  <div className="grid md:grid-cols-2 gap-12">
    {/* LEFT — Product Image */}
    <ProductHeroImage />  // 3 angles: front, side, texture closeup

    {/* RIGHT — Copy */}
    <div>
      <Badge>الريتينال المُغلَّف — لأول مرة في السعودية</Badge>
      <H1>جسمك يستحق أكثر من مرطب عادي</H1>
      <Subtext>سيروم الريتينال المُجدِّد — يعالج علامات التمدد، تشققات الجسم والتجاعيد من الجذر</Subtext>
      <PriceBlock price="99" original="149" />
      <CTAButton animate="cta-pulse">اطلبي الآن — الدفع عند الاستلام</CTAButton>
      <MiniTrust />  // 3 icons: COD, shipping, guarantee
    </div>
  </div>
</section>
```

#### Problem Section Spec (3 pain cards):
```tsx
// 3 cards — each targeting one angle
const PROBLEMS = [
  {
    icon: '🔴',
    title: 'علامات التمدد',
    subtitle: 'الخطوط البيضاء والحمراء على الجسم',
    pain: 'تتجنبين ارتداء ملابس السباحة؟ تشعرين بالحرج؟ المرطبات العادية لا تصل للجذر.',
    solution: 'الريتينال يبني الكولاجين في الطبقات العميقة — الوحيد القادر على التأثير الحقيقي',
  },
  {
    icon: '⚡',
    title: 'تشققات الجسم',
    subtitle: 'كعبك، ركبتك، كوعك — جفاف عميق',
    pain: 'المناخ الجاف في السعودية يسرق رطوبة بشرتك. المرطبات تُخفّف مؤقتاً فقط.',
    solution: 'Centella Asiatica + Niacinamide يُرمّمان الحاجز الجلدي من الداخل',
  },
  {
    icon: '✨',
    title: 'التجاعيد والخطوط الدقيقة',
    subtitle: 'الشمس والجفاف يُسرّعان الشيخوخة',
    pain: 'التعرض للشمس في السعودية يُسرّع ظهور التجاعيد بشكل أسرع من المناطق الأخرى.',
    solution: 'الريتينال المُغلَّف — نفس تأثير البوتوكس الخفيف بدون إبر وبدون أضرار',
  },
];
```

#### Reviews Section Spec:
```tsx
// Minimum 6 reviews — mix of cities and ages
const REVIEWS = [
  { name: 'أم سارة — الرياض', age: 34, stars: 5,
    text: 'بعد الحمل عندي خطوط تمدد كانت تزعجني كثير. بعد شهرين مع سيلورا — الخطوط الحمراء اختفت تقريباً والبيضاء خفّت بشكل واضح. ما توقعت النتيجة تكون بهالسرعة!' },
  { name: 'نوف الغامدي — جدة', age: 29, stars: 5,
    text: 'كعبي كان متشقق بشكل محرج جداً. من أسبوع ونص البشرة ناعمة وراحت التشققات. أفضل شيء جربته.' },
  { name: 'منال الشمري — الدمام', age: 38, stars: 5,
    text: 'التجاعيد حول عيوني خفّت بشكل واضح في ٣ أسابيع. الطبيبة سألتني وش سويتي على بشرتك 😄' },
  { name: 'هنوف العتيبي — مكة', age: 31, stars: 5,
    text: 'خفت من الريتينول دايماً لأنه يحمر بشرتي. هذا ما حمّر أبداً وشفت نتيجة من الأسبوع الثاني.' },
  { name: 'ريم السبيعي — الرياض', age: 26, stars: 5,
    text: 'اشتريته للتجاعيد، فاجأني إنه حسّن تشققات ركبتي كمان. عبوة ١٥٠مل تكفي للوجه والجسم.' },
  { name: 'دانة القحطاني — الطائف', age: 42, stars: 5,
    text: 'جربت كريمات بـ٣٠٠+ ريال ما شفت نتيجة. هذا بـ٩٩ ريال وهو الأحسن. أوصي فيه بشدة.' },
];
```

---

### Page 2: Product Detail (`/ar/product`)

**Layout:** Image LEFT (sticky), Info RIGHT on desktop

```
1. Breadcrumb
2. Product image (3 views) + badges (discount %, bestseller)
3. Product name + tagline
4. Star rating + review count
5. Problem it solves: 3 tabs (علامات التمدد | تشققات | تجاعيد)
6. Price block (99 SAR crossed out 149)
7. Quantity selector
8. CTA: "اطلبي الآن — الدفع عند الاستلام" (pulsing)
9. Secondary: "أضيفي للسلة"
10. Guarantee copy: "ضمان ٣٠ يوم"
11. Trust row: COD + shipping + guarantee icons
12. Ingredients deep-dive (accordion)
13. How to use (numbered steps)
14. Clinical results section (% stats)
15. Reviews (same component as homepage)
16. FAQ (product-specific)
```

---

### Page 3: Thank You / Order Success (`/ar/order/success`)

```
1. Green checkmark animation (Framer Motion)
2. "تم استلام طلبكِ بنجاح! 🎉"
3. Order number
4. "سيتواصل معكِ المندوب خلال ١-٢ يوم عمل"
5. [UPSELL POPUP — 10 seconds auto-trigger]
   → "عرض خاص لكِ فقط: نفس السيروم بسعر ٧٩ ريال بدلاً من ٩٩"
   → Timer countdown 10 seconds
   → "أضيفيه لطلبي" / "لا شكراً"
6. WhatsApp share button: "شاركي تجربتك مع صديقاتك"
7. Instagram/Snapchat follow CTA
8. "تسوقي أكثر" link back to homepage
```

---

## Checkout Popup Specification

```
Trigger: Click any CTA button site-wide

Content:
├── Header: "أكملي طلبكِ — خطوتان فقط" + X close
├── Order Summary:
│   ├── Product image + name
│   ├── Quantity
│   ├── Subtotal / VAT 15% / COD fee 20 SAR / Total
│   └── "🔒 الدفع عند الاستلام — ادفعي للمندوب"
├── Social Proof Strip:
│   └── ⭐⭐⭐⭐⭐ "٢٤٠٠+ عميلة سعيدة" + 3 mini avatars
├── Form:
│   ├── الاسم الكامل (required)
│   └── رقم الجوال (KSA only: 05XXXXXXXX, 10 digits)
├── Submit CTA: "تأكيدي طلبي الآن" (pulsing animation)
└── Trust row: 🔒 آمن | 🚚 شحن سريع | 🔄 ضمان ٣٠ يوم
```

**Validation Rules:**
- Name: non-empty, min 2 chars
- Phone: `/^05[0-9]{8}$/` — KSA mobile only
- Show inline errors in Arabic on blur

---

## Upsell Popup Specification

```
Trigger: 10 seconds AFTER successful order submit → redirect to /order/success

Content:
├── Badge: "⚡ عرض لمرة واحدة — ينتهي خلال..."
├── Countdown timer: 10 seconds (visual bar + digits)
├── Product card: same serum, same image
├── "نفس السيروم الذي طلبتيه للتو"
├── Original: ~~٩٩ ريال~~ → Upsell: ٧٩ ريال فقط
├── "لماذا؟ لأن التوصيل موجود — نضيفه بدون رسوم إضافية"
├── CTA: "أضيفيه لطلبي الآن — ٧٩ ريال" (big, pulsing)
└── Skip: "لا شكراً، لا أريد التوفير"
```

**Behavior:**
- After 10s → popup closes, user stays on thank you page
- If accepted → POST `/api/orders/upsell` with `{order_id, accepted: true}`
- Upsell converts at ~15-25% → AOV jumps from 99 to ~178 SAR

---

## Component Architecture

### Reusable Components

| Component | Props | Usage |
|---|---|---|
| `CTAButton` | `label, onClick, animate?, size?` | All CTA buttons across site |
| `PriceBlock` | `price, original, currency?` | Product sections |
| `TrustBadge` | `icon, text` | Throughout page |
| `ReviewCard` | `name, city, stars, text, age?` | Reviews section |
| `IngredientCard` | `name, icon, science, benefit` | Ingredients section |
| `PainCard` | `icon, title, pain, solution` | Problem section |
| `CountdownTimer` | `seconds, onExpire` | Upsell popup |
| `StatBadge` | `value, label` | Results section (% stats) |

---

## Responsive Rules

| Element | Mobile | Desktop |
|---|---|---|
| Hero | Image top, text below | Image LEFT, text RIGHT |
| Product section | Image top, info below | Image LEFT (sticky), info RIGHT |
| Ingredients | Cards stacked | 3-column grid |
| Reviews | Horizontal scroll | 3-column grid |
| Problem cards | Stacked | 3-column grid |
| Checkout popup | Full screen bottom sheet | Centered modal max-w-xl |
| Sticky bar | Always visible after scroll | Always visible after scroll |

---

## Performance Rules

- Images: `next/image` with `priority` on hero, lazy elsewhere
- Pixels: Load after `window.onload` — never block LCP
- Fonts: `display: swap`, preload Tajawal
- Animations: `will-change: transform` on CTA buttons only
- Bundle: No heavy date libraries, no jQuery, no unused icon packs
