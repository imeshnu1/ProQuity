/// <reference types="jest" />
// Unit tests for the app's rules: questionnaire, profile score, filters, calculators, AI drafts, plans.
import { calculators } from '@/data/calculators';
import { plans } from '@/data/plans';
import { intents, opportunityFields, purposes, stageQuestions, type PurposeId } from '@/data/questionnaire';
import { advisors, findPerson, providers } from '@/data/sample';
import { completion, FREE_DAILY_REQUESTS, isPremium, PREMIUM_DAILY_REQUESTS, useApp } from '@/store/app-store';
import { applyFilters, filterCount } from '@/store/filters';
import { aiReply, draftEmail } from '@/utils/ai';
import { isEmail, isUrl, maskEmail } from '@/utils/format';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const calc = (id: string, v: Record<string, number>) => calculators.find((c) => c.id === id)!.compute(v);

describe('questionnaire', () => {
  test('two intents', () => expect(intents.map((i) => i.id)).toEqual(['raise', 'liquidity']));
  test('raise has 4 purposes, liquidity 2', () => {
    expect(purposes.raise.choices).toHaveLength(4);
    expect(purposes.liquidity.choices).toHaveLength(2);
  });
  test.each(Object.keys(stageQuestions))('stage question exists for %s', (k) => {
    expect(stageQuestions[k as PurposeId].choices.length).toBeGreaterThanOrEqual(3);
  });
  test('acquisition stage is optional', () => expect(stageQuestions.acquisition.optional).toBe(true));
  test.each(Object.keys(opportunityFields))('details for %s have at least one required field', (k) => {
    expect(opportunityFields[k as keyof typeof opportunityFields].some((f) => !f.optional)).toBe(true);
  });
  test('every purpose has details', () => {
    for (const c of [...purposes.raise.choices, ...purposes.liquidity.choices]) expect(opportunityFields[c.id as PurposeId]).toBeDefined();
  });
});

describe('profile completion score', () => {
  const base = useApp.getState();
  test('empty profile scores 0', () => expect(completion({ ...base, answers: { ...base.answers, purpose: null } }).score).toBe(0));
  test('core + photo + info = 75 (Figma)', () => {
    const s = { ...base, answers: { ...base.answers, purpose: 'growth' as const }, profile: { ...base.profile, firstName: 'J', lastName: 'D', photo: 'x' } };
    expect(completion(s).score).toBe(75);
  });
  test('+ company = 86 (Figma)', () => {
    const s = { ...base, answers: { ...base.answers, purpose: 'growth' as const }, profile: { ...base.profile, firstName: 'J', lastName: 'D', photo: 'x', companyName: 'P' } };
    expect(completion(s).score).toBe(86);
  });
  test('everything = 100', () => {
    const s = { ...base, answers: { ...base.answers, purpose: 'growth' as const }, profile: { ...base.profile, firstName: 'J', lastName: 'D', photo: 'x', companyName: 'P', pitchDeck: { kind: 'url' as const, url: 'a.com' } } };
    expect(completion(s).score).toBe(100);
  });
});

describe('store actions', () => {
  beforeEach(() => useApp.getState().deleteAccount());
  test('email sign up is not onboarded', () => {
    useApp.getState().signIn('email', 'a@b.co');
    expect(useApp.getState().signedIn).toBe(true);
    expect(useApp.getState().onboarded).toBe(false);
  });
  test('LinkedIn fills name', () => {
    useApp.getState().signIn('linkedin');
    expect(useApp.getState().profile.firstName).toBe('John');
  });
  test('existing login is onboarded', () => {
    useApp.getState().signIn('email', 'a@b.co', true);
    expect(useApp.getState().onboarded).toBe(true);
  });
  test('connection request creates conversation and counts', () => {
    const id = useApp.getState().sendConnectionRequest('a1', 'Hi', 'Body', null, true);
    const c = useApp.getState().conversations.find((x) => x.id === id)!;
    expect(c.status).toBe('Contacted');
    expect(c.messages).toHaveLength(2);
    expect(useApp.getState().requestsToday).toBe(1);
  });
  test('request to existing contact appends', () => {
    const before = useApp.getState().conversations.length;
    useApp.getState().sendConnectionRequest('p1', 'Hi', 'Again');
    expect(useApp.getState().conversations.length).toBe(before);
  });
  test('move conversations', () => {
    useApp.getState().setConversationStatus(['c1', 'c3'], 'Negotiation');
    expect(useApp.getState().conversations.filter((c) => c.status === 'Negotiation').length).toBe(3);
  });
  test('custom tags', () => {
    useApp.getState().addTag('Hot', ['c1']);
    useApp.getState().addTag('Hot', ['c1', 'c2']);
    expect(useApp.getState().customTags).toEqual([{ name: 'Hot', ids: ['c1', 'c2'] }]);
  });
  test('booking', () => {
    useApp.getState().bookCall({ personId: 'p1', agenda: 'A', description: '', date: new Date().toISOString(), location: 'Zoom' });
    expect(useApp.getState().bookings[0].status).toBe('scheduled');
  });
  test('delete resets everything', () => {
    useApp.getState().signIn('email', 'a@b.co', true);
    useApp.getState().setPlan('3m');
    useApp.getState().deleteAccount();
    expect(useApp.getState().signedIn).toBe(false);
    expect(useApp.getState().plan).toBe('free');
  });
  test('ai history dedupes', () => {
    useApp.getState().addAiHistory('X');
    useApp.getState().addAiHistory('X');
    expect(useApp.getState().aiHistory.filter((h) => h === 'X')).toHaveLength(1);
  });
});

describe('plans', () => {
  test('free is not premium', () => expect(isPremium('free')).toBe(false));
  test('paid plans are premium', () => expect(isPremium('6m')).toBe(true));
  test('limits', () => expect(PREMIUM_DAILY_REQUESTS).toBeGreaterThan(FREE_DAILY_REQUESTS));
  test('totals match Manage Subscription screen', () => expect(plans.map((p) => p.total)).toEqual([39, 81.9, 117]));
  test('discounts are correct', () => {
    expect(Math.round((1 - 81.9 / (39 * 3)) * 100)).toBe(30);
    expect(Math.round((1 - 117 / (39 * 6)) * 100)).toBe(50);
  });
});

describe('filters', () => {
  test('search by name', () => expect(applyFilters(providers, {}, 'susan')).toHaveLength(1));
  test('firm type', () => expect(applyFilters(providers, { firmType: ['Venture Capitalist'] }, '').every((p) => p.firmType === 'Venture Capitalist')).toBe(true));
  test('stage', () => expect(applyFilters(providers, { stage: ['Series A'] }, '').map((p) => p.id).sort()).toEqual(['p2', 'p5']));
  test('geo', () => expect(applyFilters(providers, { geo: ['Europe'] }, '').map((p) => p.id)).toEqual(['p6']));
  test('count', () => expect(filterCount({ a: ['1', '2'], b: ['3'] })).toBe(3));
  test('findPerson covers advisors', () => expect(findPerson(advisors[0].id).kind).toBe('advisor'));
});

describe('calculators (Figma: $50,000 − $20,000 = $30,000)', () => {
  test('burn rate', () => expect(calc('burn', { exp: 50000, rev: 20000 }).value).toBe('$ 30,000'));
  test('runway', () => expect(calc('runway', { cash: 600000, burn: 50000 }).value).toBe('12.0'));
  test('runway infinite when no burn', () => expect(calc('runway', { cash: 1, burn: 0 }).value).toBe('∞'));
  test('dilution', () => expect(calc('dilution', { pre: 8e6, inv: 2e6, own: 50 }).value).toBe('40.0%'));
  test('fundraise target', () => expect(calc('target', { burn: 100000, months: 18, buffer: 20 }).value).toBe('$ 2,160,000'));
  test('pre-money', () => expect(calc('premoney', { post: 10e6, inv: 2e6 }).value).toBe('$ 8,000,000'));
  test('post-money', () => expect(calc('postmoney', { pre: 8e6, inv: 2e6 }).value).toBe('$ 10,000,000'));
  test('comparable', () => expect(calc('comparable', { rev: 1e6, mult: 8 }).value).toBe('$ 8,000,000'));
  test('vc method', () => expect(calc('vc', { exit: 100e6, roi: 10, dil: 20 }).value).toBe('$ 8,000,000'));
  test('only burn rate is free', () => expect(calculators.filter((c) => c.free).map((c) => c.id)).toEqual(['burn']));
});

describe('AI drafts', () => {
  const ctx = { ...useApp.getState(), profile: { ...useApp.getState().profile, firstName: 'John', lastName: 'Doe', companyName: 'Psquare' } };
  test.each(['Professional', 'Friendly', 'Confident', 'Concise'])('%s draft mentions company and person', (tone) => {
    const d = draftEmail(tone, '', providers[0], ctx);
    expect(d.body).toContain('Psquare');
    expect(d.body).toContain('Susan');
    expect(d.subject.length).toBeLessThanOrEqual(200);
  });
  test('prompt is included', () => expect(draftEmail('Professional', 'mention our 3x growth', providers[0], ctx).body).toContain('Mention our 3x growth'));
  test('fit analysis lists investors', () => expect(aiReply('Investor fit analysis', ctx, providers)).toContain(providers[0].name));
});

describe('format helpers', () => {
  test('email', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('a@b')).toBe(false);
  });
  test('url', () => {
    expect(isUrl('https://x.com/deck.pdf')).toBe(true);
    expect(isUrl('not a url')).toBe(false);
  });
  test('mask', () => expect(maskEmail('johnathan@gmail.com')).toBe('john***@gmail.com'));
});
