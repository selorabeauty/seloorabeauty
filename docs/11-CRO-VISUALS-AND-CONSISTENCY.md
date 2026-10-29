# 11 — CRO Audit: Consistency, Claims & Realistic Imagery

## 1. Product identity (single source of truth)
Store sells: **Selora Copper-Peptide (GHK-Cu) + Centella Serum 100ml (199 SAR)** and **Titanium Body Derma Roller 0.5mm, 540 needles (49 SAR)**; set 249 SAR; 3-month set 447 SAR.

Mismatches found before this change:
| Where | Said | Fix |
|---|---|---|
| Ads video 01–10 (`docs/ads/`) | Argan + Sweet Almond + Shea "serum/cream" | Re-edit scripts/VO to copper peptide + Centella + roller, or ship a real shea/argan cream |
| `messages/ar.json` (homepage) | Shea/Argan/Almond trio, 279 SAR | Updated to match store |
| `docs/01`, `docs/08` | Retinal serum 99 SAR | Outdated — archive |
| Brand | سيلورا بيوتي / Seloora / سيلورا ديرما / Selora Derma Laboratory | Use **سيلورا بيوتي / Selora Beauty** everywhere (domain keeps `seloorabeauty.shop`) |
| `lp` metadata | "Natural botanical oils" | Updated |

Argan / Sweet Almond / Shea: do **not** claim them unless they are on the real INCI list. Ask the supplier for the INCI and certificate of analysis first.

## 2. Claims to remove or substantiate (ad-policy + trust risk)
Still present in the full store (not LP): "87% improvement", "+94% elasticity" (`Hero.tsx`, `ResultsSection.tsx`), "ISO 22716" (`IngredientsSection.tsx`), "SFDA approved" in a review (`products/[slug]/page.tsx`), "clinical" wording, English `messages/en.json`, review counts/ratings, and testimonials. Only keep claims you can document. Fabricated reviews/before-afters are an FTC/SFDA/platform-ban risk and shoppers detect them.

## 3. Image plan (replace AI-looking images)
Rules: real people, real lighting, imperfect skin, phone camera, no plastic gloss. Shoot on iPhone, natural window light, no filters. Get written consent from models.

| Slot | Shot | Brief / AI-reference prompt (only for mood boards — final images should be real photos) |
|---|---|---|
| Hero | Bottle + roller on a bathroom shelf | "iPhone photo, real bathroom shelf, slightly messy towel, daylight from window, amber serum bottle with pump + gold-handled derma roller in capsule, visible label, soft shadows, no studio gloss" |
| Texture | Serum drop on fingertip/skin | "macro iPhone shot of a clear gel serum droplet on a real forearm, visible pores and fine hair, side window light" |
| Application | Hand applying serum on thigh/abdomen, no face | "handheld POV, woman's hand massaging serum on upper thigh, natural skin tone with faint stretch marks left untouched, bedroom daylight" |
| Roller proof | Roller on skin, needles macro | "close-up of the 0.5mm titanium roller head resting on a palm, needles in focus, neutral background" |
| Before/After | Same pose, light, distance, camera; weeks 0 / 4 / 8 / 12 | Real customers only, dated, unretouched, with consent and the caption "النتائج تختلف من شخص لآخر" |
| UGC | Unboxing, bathroom-mirror selfie, COD delivery moment | Ask 10 early buyers for 15s videos in exchange for a free refill |
| Size/scale | Product held in hand next to a coin/phone | shows real 100ml size |

Replace in `public/images/`: `serum-hero`, `copper-roller-duo`, `before-after-*`, `problem-*`, `review-selfie-*` (all AI-looking). Keep file names so no code change is needed.

## 4. Copy framework (applied in `/lp`)
Empathy hook → reframe (stretch marks are not your fault) → mechanism (roller prepares, serum cares) → honest timeline (8–12 weeks) → risk reversal (COD + 30 days) → one clear CTA. Keep the form at name/phone/city.

## 5. Checkout/CRO quick wins
- Show the COD + 30-day return line right above the submit button (done on LP).
- Add a visible WhatsApp number and the physical return policy link on LP.
- Add real review photos/videos once collected; show a date and city.
- Make sure the ad's first frame shows the exact bottle and roller that appear on the page.
- LP currently shows a fake success message and a client-side fallback order ID when the API fails (`src/app/lp/page.tsx` catch block) and fires a Purchase pixel anyway. Orders may be lost and pixel data polluted; show an error and a WhatsApp fallback instead.
