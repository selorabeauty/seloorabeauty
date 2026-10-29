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
 * ad-account and legal action. Sections stay hidden while this list is empty.
 */
export const REAL_REVIEWS: Review[] = [];
