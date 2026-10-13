# شخصيات الأفاتار — لكل فيديو

**قاعدة الاتساق الذهبية:** شخصية العميلة لازم تكون **نفس الوجه** بكل الفيديوهات الوجدانية/UGC. الناس تتعرف على الوجه بعد ٢–٣ مشاهدات والثقة تتراكم. ولّد الصورة مرة وحدة، خزّنها، وارجع لها لكل فيديو (نفس مرجع الصورة/seed).

**طريقة العمل:**
1. ولّد بورتريه الأساس بالـNano Banana Pro (البرومبتات تحت)
2. دخّله على أداة lip-sync (HeyGen / D-ID / Kling talk) مع السكربت الصوتي من ملف الفيديو
3. ولّد اللقطات الحركية (B-roll) بنفس الوجه عبر image-reference بـSora/Veo
4. كسّر "شكل AI": grain خفيف + اهتزاز كاميرا subtle + صوت غرفة بالخلفية

---

## أفاتار A — "نورة" العميلة (الشخصية الرئيسية)

**تستخدم في:** فيديو ١ (المراية)، فيديو ٤ (سكبتك)، فيديو ٨ (الفرح)، فيديو ٩ (الدولاب)

**الشخصية:** سعودية أواخر العشرينات، أم حديثة، وجه حنون وقابل للتعاطف — مو مودل مثالي. الجمال "الحقيقي" يبيع أكثر من الكمال.

**برومبت البورتريه (Nano Banana Pro):**
```
Photorealistic portrait of a Saudi woman, late 20s, natural beauty without heavy makeup, warm brown eyes, gentle relatable face — the kind of woman you'd see at a Saudi mall, wearing a soft beige hijab loosely draped, cozy home background softly blurred, looking at camera with a slightly tired but hopeful expression, natural skin texture with visible pores, soft window daylight, 9:16 vertical portrait, iPhone-photo realism
```

**نسخة بدون حجاب (للمشاهد البيتية داخل غرفتها):**
```
Same woman — dark brown hair in a loose low bun, oversized beige home tee, same warm home setting, same face and features
```

**لوحات Lip-sync (لكل مشهد كلام):**
- `video-01`: نفس الوجه قدام مراية حمام — تعبير متألم → مرتاح
- `video-04`: جالسة على أرض غرفة نوم، رف كريمات وراها — تعبير متذمر → متفاجئ
- `video-08`: ماسكة فستان — تعبير قلق → فرح
- `video-09`: قدام دولاب ملابس — طاقة إيجابية واثقة

---

## أفاتار B — الحامل (للفيديو ٦)

**الشخصية:** سعودية حامل بالشهر السادس تقريباً — هادئة، مطمئنة، "أم مستعدة". لازم بطنها يكون واضح باللقطات.

**برومبت البورتريه:**
```
Photorealistic portrait of a pregnant Saudi woman, early 30s, visibly pregnant (around 6 months) wearing an elegant cream-colored maternity dress, serene maternal expression, sitting in a bright bedroom with soft beige tones and plants, natural window light, warm peaceful mood, 9:16 vertical, photorealistic skin, modest elegant styling
```

**اللقطات الحركية:**
```
9:16, same pregnant woman, hands applying rich white cream onto pregnant belly in gentle circles, golden hour bedroom light, serene, photorealistic
```

---

## أفاتار C — الدكتورة (فيديو ٣)

**الشخصية:** دكتورة جلدية سعودية، بداية الثلاثينات — واثقة، دافية، تشرح ببساطة. السلطة + اللطف مع بعض.

**برومبت البورتريه:**
```
Photorealistic portrait of a Saudi female dermatologist, early 30s, white medical coat over modest clothing, elegant light taupe hijab neatly worn, warm modern clinic background softly blurred (shelves, plants, clean design), confident kind expression looking directly at camera, soft professional studio lighting, natural skin texture, 9:16 vertical portrait
```

**لوحة الـlip-sync:**
```
9:16 talking head, the dermatologist speaking confidently to camera, subtle natural hand gestures, natural blinks, slight head tilts while explaining, clinical warm lighting, realistic — source plate for lip-sync
```

**ملاحظة امتثال:** لا تكتب "دكتورة" نصاً بالإعلان ولا اسم طبي — السكربت يقول "أشوف هذا بالعيادة يومياً" ويكفي. المعطف الأبيض يعطي السلطة بدون ادعاء رسمي.

---

## أفاتار D — الصيدلي (فيديو ١٠)

**الشخصية:** صيدلي سعودي، منتصف الثلاثينات — خبير، مباشر، "يشرح لك ليش". بديل: نسخة نسائية لو جمهورك يفضل صوت بنت.

**برومبت البورتريه:**
```
Photorealistic portrait of a Saudi male pharmacist, mid 30s, short neat beard, white pharmacist coat, standing behind a modern clean pharmacy counter, shelves with products softly blurred behind, confident trustworthy expression looking at camera, bright professional lighting, 9:16 vertical portrait, realistic skin texture
```

**لوحة الـlip-sync:**
```
9:16 talking head, the pharmacist holding an amber serum bottle and a white cream jar side by side toward the camera, explaining gesture, slight head movement, bright clinical light — lip-sync plate
```

---

## الفيديوهات بدون أفاتار

| الفيديو | الشخصية |
|---|---|
| ٢ — ASMR سيروم | أيدي فقط — ماكرو، بدون وجه نهائياً |
| ٥ — أحمر/أبيض | جلد + جرافيك فقط — صوت راوي بدون شخصية |
| ٧ — ASMR كريم | أيدي فقط — ماكرو |

**برومبت الأيدي (للأيدي الحريرية):**
```
Photorealistic close-up of elegant female hands, natural short manicure, warm olive skin tone, soft natural light, luxury skincare commercial aesthetic — hands only, no face
```

---

## توليد الصوت (لكل أفاتار)

| الأفاتار | نوع الصوت | الإعدادات |
|---|---|---|
| نورة (A) | بنت سعودية عشرينات، عفوية شوي متعبة → متفائلة | ElevenLabs: female Arabic, low stability شوي = طبيعية |
| الحامل (B) | نسائي دافئ أمومي، بطيء هادئ | هدوء + دفء |
| الدكتورة (C) | نسائي واثق مهني، واضح ومباشر | ثبات أعلى = موثوقية |
| الصيدلي (D) | رجالي خليجي واضح، خبير | ثبات عالي |
| الراوي (فيديو ٥) | نسائي عاجل تعليمي | إيقاع أسرع شوي |

**نصيحة:** ولّد ٢–٣ أصوات لكل أفاتار واختبرها — الصوت يغير التحويل أكثر من الوجه أحياناً.

---

## ملخص التعيين

| الفيديو | الأفاتار | ملاحظة |
|---|---|---|
| ١ المراية | نورة (A) — بدون حجاب، بيتي | وجع → أمل |
| ٢ ASMR سيروم | أيدي فقط | — |
| ٣ الطبيبة | دكتورة (C) | lip-sync كامل |
| ٤ سكبتك | نورة (A) | سيلفي عفوي |
| ٥ أحمر/أبيض | راوي صوتي فقط | جرافيك + جلد |
| ٦ الحمل | حامل (B) | دافئ أمومي |
| ٧ ASMR كريم | أيدي فقط | — |
| ٨ الفرح | نورة (A) | قلق → انتصار |
| ٩ الدولاب | نورة (A) | طاقة إيجابية |
| ١٠ النظام | صيدلي (D) | ريتارقت فقط |
