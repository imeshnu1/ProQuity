import type { Plan } from '@/store/app-store';

// Prices are consistent with the Manage Subscription screen in Figma ($39 / $81.90 / $117).
export const plans: { id: Exclude<Plan, 'free'>; label: string; months: number; total: number; perMonth: number; off?: string }[] = [
  { id: '1m', label: '1 Month', months: 1, total: 39, perMonth: 39 },
  { id: '3m', label: '3 Months', months: 3, total: 81.9, perMonth: 27.3, off: '30% Off' },
  { id: '6m', label: '6 Months', months: 6, total: 117, perMonth: 19.5, off: '50% Off' },
];

export const planName = (p: Plan) => (p === 'free' ? 'Free Plan' : `${plans.find((x) => x.id === p)!.label} (Current)`);

export const benefits = [
  { t: 'Message Capital Providers', s: 'Reach out to matched investors and advisors.' },
  { t: 'View Full Investor Profiles', s: 'See firm details, focus areas, and activity.' },
  { t: 'Priority Visibility', s: 'Your opportunity is surfaced higher to relevant matches.' },
  { t: 'Faster AI Matching', s: 'Get new matches as they become active.' },
];
