export interface Review {
  name: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
}

/**
 * GENUINE reviews only. Add an entry here when a real customer sends one
 * (WhatsApp screenshot, post-delivery message) and you have their permission.
 * Do not add invented testimonials — they are deceptive advertising and risk
 * ad-account and legal action. While this list is empty, the product page
 * shows neutral placeholder review cards instead of fake reviews.
 */
export const REAL_REVIEWS: Review[] = [];
