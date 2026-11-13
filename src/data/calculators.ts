// Fundraising calculators (Figma: Calculators, Valuation Calculator, Burn rate Calculator).
import { fmtMoney } from '@/utils/format';

export type Calc = {
  id: string;
  group: 'Calculator' | 'Valuation Calculator';
  icon: string;
  title: string;
  blurb: string;
  free?: boolean;
  fields: { key: string; label: string; help: string; prefix?: string; suffix?: string }[];
  compute: (v: Record<string, number>) => { value: string; unit?: string; note: string; tip: string };
};

export const calculators: Calc[] = [
  {
    id: 'burn', group: 'Calculator', icon: 'activity', title: 'Burn Rate', free: true,
    blurb: 'Calculate your monthly cash consumption accurately.',
    fields: [
      { key: 'exp', label: 'Monthly Operating Expenses', help: 'Total Fixed + Variable Costs per month', prefix: '$' },
      { key: 'rev', label: 'Monthly Revenue', help: 'Average Monthly Income', prefix: '$' },
    ],
    compute: ({ exp, rev }) => ({
      value: fmtMoney(exp - rev), unit: '/ month',
      note: exp - rev > 0 ? 'This is the amount of cash your startup is losing every month based on your current expenses and revenue.' : 'You are cash-flow positive — revenue covers your expenses.',
      tip: 'Lower burn rates increase runway and fundraising flexibility. Consider auditing fixed costs.',
    }),
  },
  {
    id: 'runway', group: 'Calculator', icon: 'send', title: 'Runway Calculator',
    blurb: 'Estimate your startup’s survival time based on current cash.',
    fields: [
      { key: 'cash', label: 'Cash in Bank', help: 'Current cash balance', prefix: '$' },
      { key: 'burn', label: 'Monthly Net Burn', help: 'Expenses minus revenue per month', prefix: '$' },
    ],
    compute: ({ cash, burn }) => {
      const m = burn > 0 ? cash / burn : Infinity;
      return { value: isFinite(m) ? m.toFixed(1) : '∞', unit: 'months', note: `At this burn you can operate until about ${isFinite(m) ? new Date(Date.now() + m * 30.4 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'indefinitely'}.`, tip: 'Start raising when you have at least 9–12 months of runway left.' };
    },
  },
  {
    id: 'dilution', group: 'Calculator', icon: 'pie-chart', title: 'Dilution Impact',
    blurb: 'See ownership impact after a new investment round.',
    fields: [
      { key: 'pre', label: 'Pre-Money Valuation', help: 'Company value before the round', prefix: '$' },
      { key: 'inv', label: 'Investment Amount', help: 'New money raised', prefix: '$' },
      { key: 'own', label: 'Your Current Ownership', help: 'Percentage you own today', suffix: '%' },
    ],
    compute: ({ pre, inv, own }) => {
      const post = pre + inv;
      const after = post ? (own * pre) / post : 0;
      return { value: `${after.toFixed(1)}%`, unit: 'ownership after', note: `New investors will own ${post ? ((inv / post) * 100).toFixed(1) : 0}% on a ${fmtMoney(post)} post-money valuation.`, tip: 'Founders typically sell 15–25% per priced round.' };
    },
  },
  {
    id: 'target', group: 'Calculator', icon: 'target', title: 'Fundraise Target',
    blurb: 'Determine optimal capital needs for your goals.',
    fields: [
      { key: 'burn', label: 'Planned Monthly Burn', help: 'Expected spend per month after raising', prefix: '$' },
      { key: 'months', label: 'Runway Goal', help: 'Months until your next milestone', suffix: 'months' },
      { key: 'buffer', label: 'Safety Buffer', help: 'Extra cushion for surprises', suffix: '%' },
    ],
    compute: ({ burn, months, buffer }) => ({ value: fmtMoney(burn * months * (1 + buffer / 100)), note: 'This is the amount to raise to reach your next milestone with a cushion.', tip: 'Most seed rounds plan for 18–24 months of runway.' }),
  },
  {
    id: 'premoney', group: 'Valuation Calculator', icon: 'dollar-sign', title: 'Pre-Money Valuation',
    blurb: 'Determine your startup’s value prior to receiving external funding.',
    fields: [
      { key: 'post', label: 'Post-Money Valuation', help: 'Agreed value after investment', prefix: '$' },
      { key: 'inv', label: 'Investment Amount', help: 'New money raised', prefix: '$' },
    ],
    compute: ({ post, inv }) => ({ value: fmtMoney(post - inv), note: 'Pre-money = post-money − investment.', tip: 'Negotiate on pre-money so the option pool top-up is clear.' }),
  },
  {
    id: 'postmoney', group: 'Valuation Calculator', icon: 'trending-up', title: 'Post-Money Valuation',
    blurb: 'Calculate total company value after new capital is added.',
    fields: [
      { key: 'pre', label: 'Pre-Money Valuation', help: 'Company value before the round', prefix: '$' },
      { key: 'inv', label: 'Investment Amount', help: 'New money raised', prefix: '$' },
    ],
    compute: ({ pre, inv }) => ({ value: fmtMoney(pre + inv), note: `Investors will own ${pre + inv ? ((inv / (pre + inv)) * 100).toFixed(1) : 0}% of the company.`, tip: 'SAFEs are usually priced on a post-money basis.' }),
  },
  {
    id: 'comparable', group: 'Valuation Calculator', icon: 'shuffle', title: 'Comparable Analysis',
    blurb: 'Benchmark your value against similar companies in your sector.',
    fields: [
      { key: 'rev', label: 'Annual Revenue (ARR)', help: 'Current annualised revenue', prefix: '$' },
      { key: 'mult', label: 'Sector Revenue Multiple', help: 'Typical multiple for comparable companies', suffix: 'x' },
    ],
    compute: ({ rev, mult }) => ({ value: fmtMoney(rev * mult), note: 'Indicative valuation based on comparable revenue multiples.', tip: 'Adjust the multiple for growth rate and gross margin.' }),
  },
  {
    id: 'vc', group: 'Valuation Calculator', icon: 'crosshair', title: 'VC Method',
    blurb: 'Work back from an expected exit to today’s value.',
    fields: [
      { key: 'exit', label: 'Expected Exit Value', help: 'Value at exit in 5–7 years', prefix: '$' },
      { key: 'roi', label: 'Target Return Multiple', help: 'Investor’s required multiple', suffix: 'x' },
      { key: 'dil', label: 'Expected Future Dilution', help: 'Dilution from later rounds', suffix: '%' },
    ],
    compute: ({ exit, roi, dil }) => ({ value: fmtMoney(roi ? (exit / roi) * (1 - dil / 100) : 0), unit: 'post-money', note: 'Maximum post-money valuation an investor could accept today.', tip: 'VCs often target 10x+ at seed and 5x at Series A.' }),
  },
];
