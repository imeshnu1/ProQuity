// Proquity AI — on-device stand-in.
// BACKEND: replace these functions with a call to your server, which calls the Claude API with the
// user's opportunity details and returns the text. The screens already show loading states.
import type { Person } from '@/data/sample';
import type { Answers, Profile } from '@/store/app-store';

type Ctx = { profile: Profile; answers: Answers };

const company = (c: Ctx) => c.profile.companyName || 'our company';
const me = (c: Ctx) => [c.profile.firstName || 'John', c.profile.lastName || 'Doe'].join(' ');
const raise = (c: Ctx) => (c.answers.details.raiseSize as string) || (c.profile.raiseSize as string) || 'our current round';
const stage = (c: Ctx) => c.profile.currentStage || 'early';
const sector = (c: Ctx) => {
  const v = c.answers.details.industries;
  return (Array.isArray(v) ? v[0] : v) || 'technology';
};

export function draftEmail(tone: string, prompt: string, p: Person, c: Ctx) {
  const first = p.name.split(' ')[0];
  const open: Record<string, string> = {
    Professional: `Hello ${first},`,
    Friendly: `Hi ${first}!`,
    Confident: `${first},`,
    Concise: `Hi ${first},`,
  };
  const body: Record<string, string> = {
    Professional: `This is ${me(c)} from ${company(c)}. I came across your work at ${p.firm} and would love to connect to explore potential alignment.\nWe’re currently at the ${stage(c)} stage in ${sector(c)}, raising ${raise(c)}, and would value your insights.`,
    Friendly: `I’m ${me(c)}, founder of ${company(c)}. I’ve been following ${p.firm}’s ${p.sectors[0]} investments and thought we might be a great fit.\nWe’re building in ${sector(c)} and raising ${raise(c)} — would love to swap notes!`,
    Confident: `I’m ${me(c)}, building ${company(c)} in ${sector(c)}. We’re raising ${raise(c)} and ${p.firm}’s focus on ${p.stages[0]} makes you a natural partner.\nI’d like to show you why we’re worth a closer look.`,
    Concise: `${me(c)} from ${company(c)} here — ${sector(c)}, ${stage(c)} stage, raising ${raise(c)}. Given ${p.firm}’s focus, I think there’s a fit.`,
  };
  const extra = prompt.trim() ? `\n${prompt.trim().replace(/^./, (x) => x.toUpperCase())}` : '';
  const close: Record<string, string> = {
    Professional: '\nLooking forward to connecting.',
    Friendly: '\nWould you be open to a quick chat next week?',
    Confident: '\nDo you have 20 minutes this week?',
    Concise: '\nOpen to a 15-minute call?',
  };
  return {
    subject: tone === 'Concise' ? `${company(c)} — ${raise(c)} raise` : `Introduction: ${company(c)} × ${p.firm}`,
    body: `${open[tone]}\n${body[tone]}${extra}${close[tone]}\n\nBest,\n${me(c)}`,
  };
}

export function aiReply(q: string, c: Ctx, people: Person[]) {
  const t = q.toLowerCase();
  const top = people[0];
  if (t.includes('warm intro'))
    return `Here’s a warm intro you can send to a mutual contact:\n\n“Hi Alex — would you be open to introducing me to ${top.name} at ${top.firm}? We’re raising ${raise(c)} for ${company(c)} (${sector(c)}), and ${top.firm} backs ${top.stages.join(' & ')} companies like ours. Happy to send a forwardable blurb.”`;
  if (t.includes('outreach'))
    return draftEmail('Professional', '', top, c).body;
  if (t.includes('follow'))
    return `Hi ${top.name.split(' ')[0]},\nJust following up on my note last week about ${company(c)}. We’ve made good progress since — happy to share a short update and our deck. Would a 15-minute call this week work?\n\nBest,\n${me(c)}`;
  if (t.includes('fit') || t.includes('analysis'))
    return `Investor fit for your ${raise(c)} raise:\n\n• ${people[0].name} (${people[0].firm}) — Strong: ${people[0].stages.join('/')} focus, ${people[0].checkSize} checks.\n• ${people[1].name} (${people[1].firm}) — Good: larger checks (${people[1].checkSize}); better for your next round.\n• ${people[2].name} (${people[2].firm}) — Strong on stage, partial sector overlap.\n\nStart with ${people[0].name}; I can draft the outreach.`;
  if (t.includes('deck') || t.includes('pitch'))
    return `A strong ${stage(c)}-stage deck usually has 10–12 slides: Problem, Solution, Product, Market size, Traction, Business model, Competition, Team, Financials, and The Ask (${raise(c)}). Investors in ${sector(c)} will look closely at traction and unit economics.`;
  return `Good question. Based on your opportunity (${sector(c)}, raising ${raise(c)}), I’d focus on the 84 investors who match your stage and geography. Want me to draft an outreach message or analyse investor fit?`;
}
