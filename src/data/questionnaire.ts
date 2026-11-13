// Every question and answer in the Capital Seeker onboarding, as designed in Figma.
// Intent → Purpose → Stage/Strategy/Type → Opportunity Details.

export type Choice = { id: string; title: string; subtitle?: string; tags?: string[] };

export const roles: Choice[] = [
  {
    id: 'seeker',
    title: 'Capital Seeker',
    subtitle: 'Looking to raise capital or seek liquidity',
    tags: ['Startup Founders', 'Business Owners', 'Fund Managers', 'Real Estate Sponsors'],
  },
  {
    id: 'provider',
    title: 'Capital Provider',
    subtitle: 'Looking to invest, acquire or deploy capital',
    tags: ['Angel Investors', 'VCs', 'Family Offices', 'Lenders'],
  },
  {
    id: 'advisor',
    title: 'Capital Advisor',
    subtitle: 'Supporting capital raises, acquisitions or exits',
    tags: ['Investment Bankers', 'M&A Advisors', 'Placement Agents'],
  },
];

export const intents: Choice[] = [
  {
    id: 'raise',
    title: 'Raise Capital',
    subtitle: 'Seeking equity or debt capital',
    tags: ['Growth', 'Acquisition Financing', 'Investment Funds', 'Real Estate'],
  },
  {
    id: 'liquidity',
    title: 'Seek Liquidity',
    subtitle: 'Looking to sell part or all of an ownership position',
    tags: ['Business Exit', 'Secondaries'],
  },
];

export type PurposeId = 'growth' | 'acquisition' | 'fund' | 'realestate' | 'exit' | 'secondary';

export const purposes: Record<'raise' | 'liquidity', { question: string; choices: Choice[] }> = {
  raise: {
    question: 'What are you raising capital for?',
    choices: [
      { id: 'growth', title: 'Growth', subtitle: 'Funding to build or scale a business', tags: ['Startups', 'Operating Businesses', 'Expansion Capital'] },
      { id: 'acquisition', title: 'Acquisition Financing', subtitle: 'Funding to acquire a business or assets', tags: ['Single acquisition', 'Buy-and-build'] },
      { id: 'fund', title: 'Investment Fund', subtitle: 'Funding for a pooled investment vehicle', tags: ['VC', 'PE', 'Credit', 'Real Estate funds'] },
      { id: 'realestate', title: 'Real Estate Investment', subtitle: 'Funding a specific property or development project', tags: ['Residential', 'Commercial', 'Mixed-Use'] },
    ],
  },
  liquidity: {
    question: 'What type of liquidity are you seeking?',
    choices: [
      { id: 'exit', title: 'Business Exit', subtitle: 'Selling part or all of a business', tags: ['M&A', 'Buyout'] },
      { id: 'secondary', title: 'Secondary Liquidity', subtitle: 'Selling an ownership position', tags: ['Founder Shares', 'LP Interests', 'Early Investor Stakes'] },
    ],
  },
};

export const stageQuestions: Record<PurposeId, { question: string; optional?: boolean; note: string; choices: Choice[] }> = {
  growth: {
    question: 'What best describes your current stage?',
    note: 'This helps us tailor the next steps.',
    choices: [
      { id: 'idea', title: 'Idea/Concept', subtitle: 'Pre-product or early concept stage' },
      { id: 'mvp', title: 'Product / MVP', subtitle: 'Product built, pilots, or beta users' },
      { id: 'early-revenue', title: 'Early Revenue', subtitle: 'Initial customers or revenue traction' },
      { id: 'scaling', title: 'Scaling', subtitle: 'Growing revenue or users with a repeatable model' },
      { id: 'expansion', title: 'Expansion', subtitle: 'Established business expanding markets or products' },
    ],
  },
  acquisition: {
    question: 'What type of acquisition approach best reflects your current thinking?',
    optional: true,
    note: 'You can update this anytime.',
    choices: [
      { id: 'single', title: 'Single Acquisition', subtitle: 'Focused on acquiring one primary target' },
      { id: 'buy-and-build', title: 'Multiple Acquisitions (Buy-and-Build)', subtitle: 'Executing a consolidation or roll-up strategy' },
      { id: 'flexible', title: 'Flexible / Exploring Options', subtitle: 'Open to different acquisition paths' },
    ],
  },
  fund: {
    question: 'What best describes your fund strategy?',
    note: 'You can update this anytime.',
    choices: [
      { id: 'vc', title: 'Venture Capital', subtitle: 'Early-stage or growth-stage equity investments' },
      { id: 'pe', title: 'Private Equity / Growth Equity', subtitle: 'Control or minority investments in established businesses' },
      { id: 'credit', title: 'Credit / Private Debt', subtitle: 'Debt, structured credit, or yield-focused strategies' },
      { id: 're-fund', title: 'Real Estate Fund', subtitle: 'Equity or debt investments in real estate assets' },
    ],
  },
  realestate: {
    question: 'What type of real estate asset is this?',
    note: 'You can update this anytime.',
    choices: [
      { id: 'residential', title: 'Residential', subtitle: 'Multifamily, single-family rental, condos' },
      { id: 'commercial', title: 'Commercial', subtitle: 'Office, retail, industrial, hospitality' },
      { id: 'mixed', title: 'Mixed-Use', subtitle: 'Combination of residential and commercial' },
    ],
  },
  exit: {
    question: 'What best describes your business today?',
    note: 'You can update this anytime.',
    choices: [
      { id: 'early', title: 'Early Stage', subtitle: 'Pre-revenue or early revenue stage' },
      { id: 'profitable', title: 'Profitable & Growing', subtitle: 'Consistent revenue with ongoing growth' },
      { id: 'exit-ready', title: 'Exit-Ready', subtitle: 'Stable business prepared for exit' },
    ],
  },
  secondary: {
    question: 'What are you looking to sell?',
    note: 'You can update this anytime.',
    choices: [
      { id: 'founder-shares', title: 'Founder or Employee Shares', subtitle: 'Selling shares you personally own in a private company' },
      { id: 'investor-shares', title: 'Investor Shares', subtitle: 'Selling an ownership position held as an investor' },
      { id: 'lp', title: 'LP Fund Interest', subtitle: 'Selling an interest in a private investment fund' },
    ],
  },
};

// ---- Opportunity Details (step 4) ----

const raise7 = ['Under $5M', '$5M – $10M', '$10M – $25M', '$25M – $50M', '$50M – $100M', '$100M+', 'Not sure yet'];
const raiseSmall = ['Under $2M', '$2M – $5M', '$5M – $10M', '$10M – $25M', '$25M – $50M', '$50M+', 'Not sure yet'];
const fundSize = ['Under $25M', '$25M – $50M', '$50M – $100M', '$100M – $250M', '$250M – $500M', '$500M+'];
const dealSize = ['Under $1M', '$1M – $5M', '$5M – $10M', '$10M+', 'Not sure yet'];
const stake = ['Under $500K', '$500K – $1M', '$1M – $5M', '$5M – $10M', '$10M+', 'Not sure yet'];

export const industries = [
  'Software / SaaS',
  'FinTech',
  'Healthtech / Biotech',
  'Consumer / DTC',
  'Marketplace',
  'Enterprise / B2B',
  'Climate / Energy',
  'Industrial / Manufacturing',
  'Real Estate / PropTech',
  'Other',
];

export const geographies: Choice[] = [
  { id: 'North America', title: 'North America', subtitle: 'United States • Canada' },
  { id: 'Europe', title: 'Europe', subtitle: 'UK • EU • Nordics • Eastern Europe' },
  { id: 'Asia', title: 'Asia', subtitle: 'East Asia • South Asia • Southeast Asia' },
  { id: 'ANZ', title: 'ANZ', subtitle: 'Australia • New Zealand' },
  { id: 'Middle East', title: 'Middle East', subtitle: 'GCC • Israel • Turkey' },
  { id: 'Latin America', title: 'Latin America', subtitle: 'Mexico • Brazil • Andean Region • Southern Cone' },
  { id: 'Africa', title: 'Africa', subtitle: 'North Africa • Sub-Saharan Africa' },
];

export const countriesByRegion: Record<string, string[]> = {
  'North America': ['United States of America', 'Canada'],
  Europe: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Spain', 'Ireland', 'Poland'],
  Asia: ['India', 'Singapore', 'Japan', 'South Korea', 'Indonesia', 'Sri Lanka', 'Vietnam'],
  ANZ: ['Australia', 'New Zealand'],
  'Middle East': ['United Arab Emirates', 'Saudi Arabia', 'Israel', 'Turkey', 'Qatar'],
  'Latin America': ['Mexico', 'Brazil', 'Colombia', 'Chile', 'Argentina', 'Peru'],
  Africa: ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco'],
};
export { countries as allCountries } from '@/data/countries';

export type Field =
  | { kind: 'chips'; key: string; label: string; options: string[]; optional?: boolean }
  | { kind: 'select'; key: string; label: string; options: Choice[]; optional?: boolean; placeholder?: string }
  | { kind: 'industries'; key: string; label: string; multi: boolean; optional?: boolean }
  | { kind: 'geo'; key: string; label: string; optional?: boolean };

const equityDebt = (equity: string, debt: string): Choice[] => [
  { id: 'Equity', title: 'Equity', subtitle: equity },
  { id: 'Debt', title: 'Debt', subtitle: debt },
];

export const opportunityFields: Record<PurposeId | 'lp', Field[]> = {
  growth: [
    { kind: 'chips', key: 'raiseSize', label: 'How much capital are you looking to raise?', options: raise7 },
    { kind: 'select', key: 'capitalType', label: 'What type of capital are you raising?', options: equityDebt('Capital raised by selling ownership in a business', 'Capital raised through loans or credit facilities') },
    { kind: 'industries', key: 'industries', label: 'Which industry best describes your business?', multi: false },
    { kind: 'geo', key: 'geo', label: 'Where is the business primarily based or operating?' },
  ],
  acquisition: [
    { kind: 'chips', key: 'targetSize', label: 'What is your target acquisition size? (Optional)', options: raise7, optional: true },
    { kind: 'chips', key: 'raiseSize', label: 'How much capital are you looking to raise?', options: raise7 },
    { kind: 'select', key: 'capitalType', label: 'What type of capital are you raising?', options: equityDebt('Investor capital to fund an acquisition', 'Loans or credit facilities to finance an acquisition') },
    { kind: 'industries', key: 'industries', label: 'Which industries are you targeting? (Optional)', multi: true, optional: true },
    { kind: 'geo', key: 'geo', label: 'Where are you targeting acquisitions? (Optional)', optional: true },
  ],
  fund: [
    { kind: 'chips', key: 'targetSize', label: 'What is your target fund size? (Estimate)', options: fundSize },
    { kind: 'chips', key: 'dealSize', label: 'What is the typical investment size per deal? (Optional)', options: dealSize, optional: true },
    {
      kind: 'select', key: 'capitalType', label: 'What type of capital are you raising?',
      options: [
        { id: 'Equity Fund Capital', title: 'Equity Fund Capital', subtitle: 'LP commitments to an equity investment fund' },
        { id: 'Credit/Debt Fund Capital', title: 'Credit/Debt Fund Capital', subtitle: 'LP commitments for credit, lending, or more.' },
      ],
    },
    { kind: 'industries', key: 'industries', label: 'Which industries are you targeting?', multi: true },
    { kind: 'geo', key: 'geo', label: 'Where does your fund primarily invest? (Optional)', optional: true },
  ],
  realestate: [
    { kind: 'chips', key: 'projectValue', label: 'What is the approximate total project value? (Includes total equity and debt)', options: raise7 },
    { kind: 'chips', key: 'raiseSize', label: 'How much capital are you looking to raise?', options: raiseSmall },
    { kind: 'select', key: 'capitalType', label: 'What type of capital are you raising?', options: equityDebt('Investor capital for a real estate investment', 'Loans or credit facilities secured by real estate assets') },
    { kind: 'industries', key: 'industries', label: 'Which industries are you targeting?', multi: true },
    { kind: 'geo', key: 'geo', label: 'Where is the property located?' },
  ],
  exit: [
    { kind: 'chips', key: 'projectValue', label: 'What is the approximate value of your business?', options: raise7.slice(0, 6) },
    { kind: 'industries', key: 'industries', label: 'Which industry best describes your business?', multi: false },
    { kind: 'geo', key: 'geo', label: 'Where is the business primarily based or operating? (Optional)', optional: true },
  ],
  secondary: [
    { kind: 'chips', key: 'stakeValue', label: 'What is the approximate value of the stake you want to sell?', options: stake },
    { kind: 'industries', key: 'industries', label: 'What industry best describes your business?', multi: false },
    { kind: 'geo', key: 'geo', label: 'Where is the company primarily based? (Optional)', optional: true },
  ],
  lp: [
    { kind: 'chips', key: 'stakeValue', label: 'What is the approximate value of the stake you want to sell?', options: stake },
    { kind: 'geo', key: 'geo', label: 'Where does your fund primarily invest? (Optional)', optional: true },
  ],
};

export const currentStages: Choice[] = [
  ...stageQuestions.growth.choices,
  { id: 'late', title: 'Late Stage/Pre-IPO', subtitle: 'Mature company preparing for liquidity' },
];
export const annualRevenue = ['Pre-revenue', 'Under $1M', '$1M – $5M', '$5M – $10M', '$10M – $25M', '$25M – $50M', '$50M – $100M', '$100M+', 'Prefer not to disclose'];
export const readiness: Choice[] = [
  { id: 'Exploring options', title: 'Exploring options' },
  { id: 'Preparing to raise', title: 'Preparing to raise' },
  { id: 'Actively Raising', title: 'Actively Raising' },
];

export const visibilityOptions = [
  {
    id: 'private',
    title: 'Private & Anonymous',
    tag: 'Best for sensitive opportunities',
    body: 'Shared anonymously with matched capital providers. Your identity and company details are revealed only after mutual interest.',
  },
  {
    id: 'targeted',
    title: 'Targeted Visibility',
    tag: 'Balanced reach with control',
    body: 'Visible to a curated set of qualified capital providers. Details are shared selectively based on relevance and fit.',
  },
  {
    id: 'enhanced',
    title: 'Enhanced Reach',
    tag: 'Best for active raises or deals seeking faster traction',
    body: 'Visible to a broader set of qualified capital providers and advisors. Designed to increase discovery and inbound interest.',
  },
] as const;
export type VisibilityId = (typeof visibilityOptions)[number]['id'];
