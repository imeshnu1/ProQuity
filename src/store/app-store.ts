// All app state and every data action lives here.
// Each action is where a real backend call will go later (see comments marked BACKEND).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PurposeId, VisibilityId } from '@/data/questionnaire';
import {
  aiChatHistorySeed,
  conversations as seedConversations,
  notificationsSeed,
  type ChatStatus,
  type Conversation,
  type Message,
} from '@/data/sample';

export type Plan = 'free' | '1m' | '3m' | '6m';
export type PitchDeck = { kind: 'file'; name: string; size: string } | { kind: 'url'; url: string } | null;
export type Booking = {
  id: string;
  personId: string;
  agenda: string;
  description: string;
  date: string; // ISO
  location: string;
  status: 'scheduled' | 'completed';
};

export type Profile = {
  firstName: string;
  lastName: string;
  linkedin: string;
  photo: string | null;
  headline: string;
  hq: string;
  companyName: string;
  companyWebsite: string;
  companyLogo: string | null;
  raiseSize: string;
  currentStage: string;
  annualRevenue: string;
  pitchDeck: PitchDeck;
  geoFocus: string[];
  readiness: string;
};

const emptyProfile: Profile = {
  firstName: '',
  lastName: '',
  linkedin: '',
  photo: null,
  headline: 'Founder & Director',
  hq: 'Headquarter location',
  companyName: '',
  companyWebsite: '',
  companyLogo: null,
  raiseSize: '',
  currentStage: '',
  annualRevenue: '',
  pitchDeck: null,
  geoFocus: [],
  readiness: '',
};

const linkedInProfile: Partial<Profile> = {
  firstName: 'John',
  lastName: 'Doe',
  linkedin: 'https://www.linkedin.com/in/johndoe',
  photo: 'initials',
  hq: 'Toronto, Canada',
};

export type Answers = {
  intent: 'raise' | 'liquidity' | null;
  purpose: PurposeId | null;
  stage: string | null;
  details: Record<string, string | string[]>;
};

type State = {
  hydrated: boolean;
  signedIn: boolean;
  onboarded: boolean;
  authMethod: 'email' | 'linkedin' | null;
  email: string;
  role: 'seeker' | 'provider' | 'advisor' | null;
  answers: Answers;
  profile: Profile;
  visibility: VisibilityId;
  notificationsOn: boolean | null;
  plan: Plan;
  requestsToday: number;
  profileStatus: 'draft' | 'in-review' | 'approved';
  conversations: Conversation[];
  bookings: Booking[];
  aiHistory: string[];
  notifications: typeof notificationsSeed;
  customTags: { name: string; ids: string[] }[];
  premiumBannerDismissed: boolean;
  homeAlertDismissed: boolean;
};

type Actions = {
  setHydrated: () => void;
  setRole: (r: State['role']) => void;
  signIn: (method: 'email' | 'linkedin', email?: string, existing?: boolean) => void;
  signOut: () => void;
  deleteAccount: () => void;
  setAnswer: (patch: Partial<Answers>) => void;
  setDetail: (key: string, value: string | string[]) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  setVisibility: (v: VisibilityId) => void;
  setNotifications: (on: boolean) => void;
  finishOnboarding: () => void;
  setPlan: (p: Plan) => void;
  setEmail: (e: string) => void;
  submitForReview: () => void;
  sendConnectionRequest: (personId: string, subject: string, body: string, file?: { name: string; size: string } | null, withSummary?: boolean) => string;
  sendMessage: (conversationId: string, text: string) => void;
  setConversationStatus: (ids: string[], status: ChatStatus) => void;
  markRead: (id: string) => void;
  addTag: (name: string, ids: string[]) => void;
  bookCall: (b: Omit<Booking, 'id' | 'status'>) => void;
  addAiHistory: (title: string) => void;
  removeAiHistory: (title: string) => void;
  dismissPremiumBanner: () => void;
  dismissHomeAlert: () => void;
};

export const FREE_DAILY_REQUESTS = 1;
export const PREMIUM_DAILY_REQUESTS = 5;

const initial: State = {
  hydrated: false,
  signedIn: false,
  onboarded: false,
  authMethod: null,
  email: '',
  role: null,
  answers: { intent: null, purpose: null, stage: null, details: {} },
  profile: emptyProfile,
  visibility: 'targeted',
  notificationsOn: null,
  plan: 'free',
  requestsToday: 0,
  profileStatus: 'draft',
  conversations: seedConversations,
  bookings: [],
  aiHistory: aiChatHistorySeed,
  notifications: notificationsSeed,
  customTags: [],
  premiumBannerDismissed: false,
  homeAlertDismissed: false,
};

const now = () => {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const useApp = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      setHydrated: () => set({ hydrated: true }),
      setRole: (role) => set({ role }),
      // BACKEND: exchange LinkedIn OAuth code / verify email OTP, then load the user.
      signIn: (method, email, existing) => {
        const patch: Partial<State> = { signedIn: true, authMethod: method, email: email || 'johndoe@gmail.com' };
        if (method === 'linkedin') patch.profile = { ...get().profile, ...linkedInProfile };
        if (existing) {
          patch.onboarded = true;
          patch.role = 'seeker';
          patch.profile = { ...get().profile, ...linkedInProfile, companyName: 'Psquare Company', companyWebsite: 'www.psquarecompany.com', raiseSize: '$500k - $2M', currentStage: 'Product/MVP', annualRevenue: '$1M-$5M' };
          patch.answers = { intent: 'raise', purpose: 'growth', stage: 'mvp', details: { raiseSize: '$5M – $10M', capitalType: 'Equity', industries: ['Software / SaaS'], geo: 'North America', country: 'United States of America' } };
        }
        set(patch);
      },
      signOut: () => set({ signedIn: false }),
      deleteAccount: () => set({ ...initial, hydrated: true }),
      setAnswer: (patch) => set({ answers: { ...get().answers, ...patch } }),
      setDetail: (key, value) => {
        const a = get().answers;
        set({ answers: { ...a, details: { ...a.details, [key]: value } } });
      },
      updateProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),
      setVisibility: (visibility) => set({ visibility }),
      setNotifications: (notificationsOn) => set({ notificationsOn }),
      finishOnboarding: () => set({ onboarded: true }),
      // BACKEND: verify App Store / Play receipt server-side.
      setPlan: (plan) => set({ plan }),
      setEmail: (email) => set({ email }),
      submitForReview: () => set({ profileStatus: 'in-review' }),
      sendConnectionRequest: (personId, subject, body, file, withSummary) => {
        const convs = get().conversations;
        const existing = convs.find((c) => c.personId === personId);
        const msgs: Message[] = [{ id: String(Date.now()), from: 'me', text: (subject ? subject + '\n\n' : '') + body, time: now(), day: 'Today' }];
        if (file) msgs.push({ id: String(Date.now() + 1), from: 'me', file, time: now() });
        if (withSummary) msgs.push({ id: String(Date.now() + 2), from: 'me', file: { name: 'Profile Summary', size: 'Shared with request' }, time: now() });
        let id: string;
        if (existing) {
          id = existing.id;
          set({ conversations: convs.map((c) => (c.id === id ? { ...c, messages: [...c.messages, ...msgs], time: now() } : c)) });
        } else {
          id = 'c' + Date.now();
          set({ conversations: [{ id, personId, status: 'Contacted', unread: false, time: now(), messages: msgs }, ...convs] });
        }
        set({ requestsToday: get().requestsToday + 1 });
        return id;
      },
      sendMessage: (cid, text) =>
        set({
          conversations: get().conversations.map((c) =>
            c.id === cid ? { ...c, time: now(), messages: [...c.messages, { id: String(Date.now()), from: 'me', text, time: now() }] } : c,
          ),
        }),
      setConversationStatus: (ids, status) =>
        set({ conversations: get().conversations.map((c) => (ids.includes(c.id) ? { ...c, status } : c)) }),
      markRead: (id) => set({ conversations: get().conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)) }),
      addTag: (name, ids) => {
        const rest = get().customTags.filter((t) => t.name !== name);
        set({ customTags: [...rest, { name, ids }] });
      },
      bookCall: (b) => set({ bookings: [{ ...b, id: 'b' + Date.now(), status: 'scheduled' }, ...get().bookings] }),
      addAiHistory: (title) => set({ aiHistory: [title, ...get().aiHistory.filter((t) => t !== title)] }),
      removeAiHistory: (title) => set({ aiHistory: get().aiHistory.filter((t) => t !== title) }),
      dismissPremiumBanner: () => set({ premiumBannerDismissed: true }),
      dismissHomeAlert: () => set({ homeAlertDismissed: true }),
    }),
    {
      name: 'proquity-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (s) => s?.setHydrated(),
    },
  ),
);

// ---- Derived helpers ----
export const isPremium = (plan: Plan) => plan !== 'free';

export function completion(s: Pick<State, 'profile' | 'onboarded' | 'answers'>) {
  const p = s.profile;
  const items = [
    { key: 'Core Matching Info', done: !!s.answers.purpose, weight: 30 },
    { key: 'Profile Photo', done: !!p.photo, weight: 15 },
    { key: 'Profile Info', done: !!(p.firstName && p.lastName), weight: 30 },
    { key: 'Company Information', done: !!p.companyName, weight: 11 },
    { key: 'Pitch Deck', done: !!p.pitchDeck, weight: 14 },
  ];
  const score = items.reduce((n, i) => n + (i.done ? i.weight : 0), 0);
  return { items, score };
}

export function fullName(p: Profile) {
  return [p.firstName, p.lastName].filter(Boolean).join(' ') || 'John Doe';
}
