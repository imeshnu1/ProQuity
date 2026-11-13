// Realistic sample data so every screen works before the backend exists.
// Replace these with API calls in src/store/app-store.ts.

export type Person = {
  id: string;
  name: string;
  title: string;
  firm: string;
  firmType: string;
  firmShort: string;
  website: string;
  location: string;
  checkSize: string;
  stage: string;
  stages: string[];
  sectors: string[];
  geos: string[];
  match: 'Strong Match' | 'Good Match';
  kind: 'provider' | 'advisor';
  about: string;
};

const mk = (p: Partial<Person> & Pick<Person, 'id' | 'name'>): Person => ({
  title: 'CEO',
  firm: 'Framework Ventures Partners',
  firmType: 'Venture Capitalist',
  firmShort: 'Venture Capital',
  website: 'https://www.framework.vc',
  location: 'Toronto, Canada',
  checkSize: '$500k – $2M',
  stage: 'Product/MVP',
  stages: ['Pre Seed', 'Seed'],
  sectors: ['Healthcare', 'Biotech'],
  geos: ['North America', 'United States'],
  match: 'Strong Match',
  kind: 'provider',
  about: 'Early-stage investor backing founders building category-defining companies.',
  ...p,
});

export const providers: Person[] = [
  mk({ id: 'p1', name: 'Susan Sandgren', sectors: ['Healthcare', 'Biotech', 'Technology/Software'] }),
  mk({ id: 'p2', name: 'Brad Chesak', title: 'Managing Partner', firm: 'Northwind Capital', firmShort: 'Private Equity', firmType: 'Private Equity partner', website: 'https://www.northwind.capital', location: 'Boston, USA', checkSize: '$2M – $10M', stage: 'Scaling', stages: ['Series A', 'Series B'], sectors: ['FinTech', 'Enterprise / B2B'] }),
  mk({ id: 'p3', name: 'Emily Johnson', title: 'Principal', firm: 'Innovate Capital Group', firmShort: 'Venture Capital', website: 'https://www.innovatecg.com', location: 'New York, USA', checkSize: '$100k – $500k', stage: 'Pre-Seed', stages: ['Pre Seed'], sectors: ['Healthcare', 'Consumer / DTC'], match: 'Good Match' }),
  mk({ id: 'p4', name: 'Brandon Scott', title: 'Angel Investor', firm: 'Scott Family Office', firmShort: 'Family Office', firmType: 'Solo Angel Investor', website: 'https://www.scottfo.com', location: 'Austin, USA', checkSize: '$50k – $250k', stage: 'Idea/Concept', stages: ['Pre Seed', 'Seed'], sectors: ['Marketplace', 'Software / SaaS'] }),
  mk({ id: 'p5', name: 'Ryan Thompson', title: 'Partner', firm: 'Stellaris Technologies Fund', firmShort: 'Corporate VC', firmType: 'Corporate Investor', website: 'https://www.stellaris.vc', location: 'San Francisco, USA', checkSize: '$1M – $5M', stage: 'Early Revenue', stages: ['Seed', 'Series A'], sectors: ['Climate / Energy', 'Industrial / Manufacturing'], match: 'Good Match' }),
  mk({ id: 'p6', name: 'Olivia Brown', title: 'Director', firm: 'Capital Square Ventures', firmShort: 'Real Estate', firmType: 'Real Estate Investor', website: 'https://www.capitalsquareventures.com', location: 'London, UK', checkSize: '$5M – $25M', stage: 'Expansion', stages: ['Growth/ Expansion'], sectors: ['Real Estate / PropTech'], geos: ['Europe', 'United Kingdom'] }),
];

export const advisors: Person[] = [
  mk({ id: 'a1', name: 'Daniel Ortiz', title: 'Managing Director', firm: 'NovaTech Advisory', firmShort: 'M&A Advisory', firmType: 'Investment Bank', website: 'https://www.novatech.com', location: 'Chicago, USA', kind: 'advisor', sectors: ['Technology/Software', 'FinTech'] }),
  mk({ id: 'a2', name: 'Priya Nair', title: 'Partner', firm: 'Harbor Placement Partners', firmShort: 'Placement Agent', firmType: 'Placement Agent', website: 'https://www.harborpp.com', location: 'Singapore', kind: 'advisor', geos: ['Asia', 'Singapore'], sectors: ['Consumer / DTC'] }),
  mk({ id: 'a3', name: 'Marcus Lee', title: 'Senior Advisor', firm: 'Keystone Capital Advisors', firmShort: 'Capital Advisory', firmType: 'Capital Advisor', website: 'https://www.keystoneca.com', location: 'Toronto, Canada', kind: 'advisor', match: 'Good Match' }),
];

export const filterGroups: { key: string; label: string; options: string[] }[] = [
  { key: 'firmType', label: 'Firm Type', options: ['Solo Angel Investor', 'Venture Capitalist', 'Seed Stage Investor', 'Private Equity partner', 'Corporate Investor', 'Real Estate Investor', 'Impact Investor', 'Crowdfunding Contributor'] },
  { key: 'stage', label: 'Funding Stage', options: ['Pre Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Growth/ Expansion', 'Late Stage/ Pre IPO', 'Secondary Transactions'] },
  { key: 'sector', label: 'Industry Focus', options: ['Software / SaaS', 'FinTech', 'Healthcare', 'Biotech', 'Consumer / DTC', 'Marketplace', 'Enterprise / B2B', 'Climate / Energy', 'Real Estate / PropTech'] },
  { key: 'check', label: 'Check size', options: ['Under $100k', '$100k – $500k', '$500k – $2M', '$2M – $10M', '$10M+'] },
  { key: 'geo', label: 'Geographic Focus', options: ['North America', 'Europe', 'Asia', 'ANZ', 'Middle East', 'Latin America', 'Africa'] },
];

export type ChatStatus = 'Contacted' | 'In Conversation' | 'Negotiation' | 'Closed';
export const chatTags: ChatStatus[] = ['Contacted', 'In Conversation', 'Negotiation', 'Closed'];

export type Message = { id: string; from: 'me' | 'them'; text?: string; file?: { name: string; size: string }; time: string; day?: string };
export type Conversation = { id: string; personId: string; status: ChatStatus; unread: boolean; time: string; messages: Message[] };

const intro =
  'Hello Susan,\nThis is John doe from Psquare Company. I would like to get connected with you. I came across your work at the Framework Ventures Partners and would love to connect to explore potential alignment.\nWe’re currently building in the pre-seed stage and would value your insights. Looking forward to connect.';

export const conversations: Conversation[] = [
  { id: 'c1', personId: 'p1', status: 'Contacted', unread: true, time: '01:00 PM', messages: [
    { id: 'm1', from: 'me', text: intro, time: '01:00 PM', day: 'Today' },
    { id: 'm2', from: 'me', file: { name: 'Investor Pitch Document', size: 'PDF • 12 MB' }, time: '01:00 PM' },
  ] },
  { id: 'c2', personId: 'p2', status: 'In Conversation', unread: false, time: '01:00 PM', messages: [
    { id: 'm1', from: 'me', text: 'Hi Brad, sharing our deck ahead of next week’s call.', time: '11:20 AM', day: 'Yesterday' },
    { id: 'm2', from: 'them', text: 'Thanks John — looks interesting. Can you send last quarter’s revenue numbers?', time: '01:00 PM' },
  ] },
  { id: 'c3', personId: 'p3', status: 'Contacted', unread: true, time: '01:00 PM', messages: [{ id: 'm1', from: 'me', text: 'Hi Emily, would love to connect about our pre-seed round.', time: '01:00 PM', day: 'Today' }] },
  { id: 'c4', personId: 'p4', status: 'In Conversation', unread: false, time: '01:00 PM', messages: [{ id: 'm1', from: 'them', text: 'Happy to chat. Does Thursday work?', time: '01:00 PM', day: 'Today' }] },
  { id: 'c5', personId: 'p5', status: 'Negotiation', unread: false, time: '01:00 PM', messages: [{ id: 'm1', from: 'them', text: 'We’ve reviewed the term sheet draft and have a few comments.', time: '01:00 PM', day: 'Today' }] },
  { id: 'c6', personId: 'p6', status: 'Closed', unread: false, time: '01:00 PM', messages: [{ id: 'm1', from: 'them', text: 'Great working with you. Welcome to the portfolio!', time: '01:00 PM', day: 'Today' }] },
];

export const notificationsSeed = [
  { id: 'n1', day: 'Today', title: 'Follow-up with Sandgren', body: 'Send a follow-up email to confirm availability.' },
  { id: 'n2', day: 'Today', title: 'Unlock Proquity Premium', body: 'Access exclusive capital providers and unlock unlimited connection requests.' },
  { id: 'n3', day: 'Today', title: 'Email Opened', body: 'Sarah Jenkins has opened your outreach email regarding the seed round.' },
  { id: 'n4', day: 'Yesterday', title: 'New Capital Match', body: '3 New investors match your criteria for "Fintech Series A".' },
  { id: 'n5', day: 'Yesterday', title: 'Subscription Confirmed', body: 'You’ve successfully subscribed to the monthly plan. Here is your receipt.' },
];

export const aiPrompts = ['Write warm intro', 'Draft outreach message', 'Polite follow-up', 'Investor fit analysis'];

export const newsItems = [
  { id: 'nw1', category: 'FUNDING', title: 'AI startups raised $2.1 B globally in Q4', summary: 'Investor interest in AI remains strong despite market slowdown.', source: 'TechCrunch', ago: '2h ago' },
  { id: 'nw2', category: 'ACQUISITION', title: 'Tech giant acquires fintech startup for $500M', summary: 'Strategic move to enhance financial services offerings.', source: 'Bloomberg', ago: '1h ago' },
  { id: 'nw3', category: 'VENTURE', title: 'Announces new series B fund for upcoming Fintech startups', summary: 'The fund aims to support early-stage financial infrastructure.', source: 'Series Fund', ago: '2h ago' },
  { id: 'nw4', category: 'IPO', title: 'Renewable energy company set to go public with $1B valuation', summary: 'Market trends favor sustainable investments as demand grows.', source: 'Reuters', ago: '30m ago' },
  { id: 'nw5', category: 'Venture Capital', title: 'Emerging markets attract $3B in VC funding this quarter', summary: 'Southeast Asia and Latin America lead the surge.', source: 'Crunchbase', ago: '15m ago' },
];

export const articles = [
  { id: 'ar1', tag: 'Fundraising', title: 'How to Raise your first Seed Round', summary: 'A step-by-step guide for first time founders navigating their first raise.', mins: 5 },
  { id: 'ar2', tag: 'Product Development', title: 'MVP: The Art of Building Minimum Viable Products', summary: 'Key insights into prioritizing features and user feedback.', mins: 8 },
  { id: 'ar3', tag: 'Marketing', title: 'Building Your Brand on Social Media', summary: 'Strategies for effective engagement and growth.', mins: 7 },
  { id: 'ar4', tag: 'Startup Culture', title: 'Creating a Collaborative Work Environment', summary: 'Exploring best practices for team dynamics and culture.', mins: 6 },
  { id: 'ar5', tag: 'Fundraising', title: 'The Comprehensive Guide to Series A Term Sheets', summary: 'Valuation caps, discount rates and the clauses that matter.', mins: 5 },
];
export const articleTags = ['All', 'Fundraising', 'Strategy', 'Growth', 'Product Development', 'Marketing', 'Startup Culture'];

export const legalDocs = [
  { id: 'l1', tag: 'NDA', title: 'Standard Mutual NDA', summary: 'A Standard non-disclosure agreement for early-stage investor discussions.', meta: 'PDF • 12 MB', locked: false },
  { id: 'l2', tag: 'Term Sheets', title: 'Confidential Partnership Agreement', summary: 'A detailed agreement outlining the terms of a strategic partnership.', meta: 'DOCX • 52 MB', locked: true },
  { id: 'l3', tag: 'NDA', title: 'Employee Confidentiality Agreement', summary: 'A legal document to protect sensitive company information.', meta: 'PDF • 18 MB', locked: true },
  { id: 'l4', tag: 'SAFE', title: 'Post-Money SAFE (Valuation Cap)', summary: 'Simple agreement for future equity with a valuation cap.', meta: 'DOCX • 4 MB', locked: true },
  { id: 'l5', tag: 'Convertible', title: 'Convertible Note Template', summary: 'Short-term debt that converts into equity at a future round.', meta: 'PDF • 6 MB', locked: true },
];
export const legalTags = ['All', 'NDA', 'Term Sheets', 'SAFE', 'Convertible'];

export const pitchDecks = [
  { id: 'd1', company: 'Revolut', round: 'Series B', tagline: 'The Global Financial Superapp', meta: 'PDF • 5.2 MB', locked: false, vision: 'Financial Superapp', users: '35+ Worldwide', funding: '$1.7B Raised' },
  { id: 'd2', company: 'Slack', round: 'Series E', tagline: 'Team Collaboration Software', meta: 'XLSX • 4.1 MB', locked: true, vision: 'Where work happens', users: '10M+ daily', funding: '$1.2B Raised' },
  { id: 'd3', company: 'Stripe', round: 'Series C', tagline: 'Online Payment Processing', meta: 'PDF • 7.8 MB', locked: true, vision: 'Increase the GDP of the internet', users: 'Millions of businesses', funding: '$2.2B Raised' },
];

export const videos = [
  { id: 'v1', tag: 'Pitching', title: 'How to Pitch to Investors', summary: 'What investors look for in early-stage startup’s that it’s worth backing.', len: '8:20' },
  { id: 'v2', tag: 'Fundraising', title: 'Understanding Term Sheets', summary: 'Key clauses you need to know before signing any kind of deal.', len: '4:38' },
  { id: 'v3', tag: 'Fundraising', title: 'Seed Funding VS Series A', summary: 'The major differences in expectations, metrics and further steps.', len: '6:40' },
];

export const aiChatHistorySeed = ['Warm intro draft', 'Outreach message created', 'Investor fit analysis', 'Intro message refined'];

export const allPeople = [...providers, ...advisors];
export const findPerson = (id: string) => allPeople.find((p) => p.id === id) ?? providers[0];
