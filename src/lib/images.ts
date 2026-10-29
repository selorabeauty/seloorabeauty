/**
 * Central image registry. Every slot is null until a REAL photo is uploaded
 * (supplier product photos or genuine customer photos). While null, <Photo />
 * renders a neutral placeholder instead of a broken or AI-generated image.
 *
 * To go live with a photo: put the file in /public/images and set the path,
 * e.g. serum: '/images/serum-real.webp'. See docs/11-CRO-VISUALS-AND-CONSISTENCY.md
 * for the shot list and prompts.
 */
// Daranca serum + derma roller (supplier render, text-free crop), 800w WebP.
// Replace per-product slots with individual shots when available.
const PRODUCT_SHOT = '/images/daranca-duo-800.webp';

export const IMG: Record<'serum' | 'roller' | 'duo', string | null> = {
  serum: PRODUCT_SHOT,
  roller: PRODUCT_SHOT,
  duo: PRODUCT_SHOT,
};

export function realImages(list: (string | null | undefined)[]): string[] {
  return list.filter((s): s is string => Boolean(s));
}
