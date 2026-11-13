# Figma coverage — Capital Seeker V2

All 285 frames in the Figma section "Capital Seeker - V2" were checked against the app (13 Nov 2026).
Many Figma frames are the same screen in different states (empty, filled, dropdown open, error). Each row lists the frames and the app screen that covers them.

| Figma frames (# = order on the canvas) | What they show | App screen (file in `src/app/`) | Status |
|---|---|---|---|
| 0–1 | Splash | `index.tsx` | Built |
| 2, 194 | Welcome: Get Started / Login | `welcome.tsx` | Built |
| 4, 6 | "How to see messages from other users?" + system prompt | `notify-intro.tsx` | **Added in this pass** |
| 7, 8 | Role selection | `role.tsx` | Built (Provider/Advisor show "Coming soon") |
| 11, 15, 16 | Intro slides | `intro.tsx` | Built |
| 17, 18 | Sign up with email | `auth/signup.tsx` | Built |
| 3, 5 | Login | `auth/login.tsx` | Built |
| 9, 20 | LinkedIn authorise | `auth/linkedin.tsx` | Built |
| 10, 12–14, 21–23, 192 | 6-digit code, verified toast | `auth/verify.tsx` | Built |
| 24–26 | Intent | `onboarding/intent.tsx` | Built |
| 27–34 | Purpose (raise / liquidity) | `onboarding/purpose.tsx` | Built |
| 35–47 | Stage / strategy / type (all 7 paths incl. LP) | `onboarding/stage.tsx` | Built |
| 48–142 | Opportunity details: chips, inline capital-type dropdown, industry search, geography, full country list, filled states | `onboarding/details.tsx` | Built; **inline dropdown, full country list and Real Estate industries added in this pass** |
| 143–147 | Complete Personal Info, photo permission, photo picker | `onboarding/personal.tsx` | Built (photo picker is the phone's own) |
| 148–150, 155–171, 176 | Complete Your Profile + edit sheets (company, pitch deck doc/URL, stage, revenue, geography, readiness), saved toast | `onboarding/profile.tsx`, `components/ProfileEditor.tsx` | Built |
| 151 | Visibility preference | `onboarding/visibility.tsx`, `settings/visibility.tsx` | Built |
| 152, 153, 157 | Profile completion score sheet | `onboarding/ai.tsx`, `components/Score.tsx` | Built |
| 154, 158, 159, 172–179 | Proquity AI hand-off, matches, notification ask / declined / enabled, "Setting up your Dashboard" | `onboarding/ai.tsx`, `components/NotifyPrompt.tsx` | Built |
| 162, 180, 186 | Loading skeletons | Dashboard and provider/advisor lists | **Added in this pass** |
| 190, 191, 196 | Upgrade screen, App Store sheet, success | `paywall.tsx`, `components/StoreSheet.tsx` | Built |
| 19, 195, 203, 207, 208, 226 | Dashboard (first-time, existing, full access with P badge) | `(tabs)/home.tsx` | Built; **premium P badge added in this pass** |
| 199, 210 | Side menu + Unlock Premium card | `components/AppHeader.tsx` | Built |
| 161 | Bottom bar | `(tabs)/_layout.tsx` | Built |
| 201, 214, 252 | Capital Providers (locked / unlocked) | `(tabs)/providers.tsx` | Built |
| 205 | Capital Advisors | `(tabs)/advisors.tsx` | Built |
| 202, 206, 209, 213, 218 | Filters (counts, locked groups) | `filters.tsx` | Built |
| 211, 219 | Investor profile, Prev/Next | `investor/[id].tsx` | Built |
| 212 | Complete your profile to continue | `components/gates.tsx` | Built |
| 232 | Subscribe to unlock investor access | `components/gates.tsx` | Built |
| 231, 238, 245–247, 253, 254, 259, 260, 262–264, 268, 271, 272 | Send Connection Request, Write with AI, attachments, Free / Premium / Daily limit | `connect/[id].tsx` | Built |
| 279 | "New Message" email with Profile Summary | `connect/[id].tsx` (preview before sending) | **Added in this pass** |
| 258, 275 | Chat | `chat/[id].tsx` | Built |
| 227, 228, 237, 243, 250, 261 | Messages, filters, select chats, move to | `messages/index.tsx` | Built |
| 236, 242, 249, 257 | New Tag, Add People | `messages/new-tag.tsx` | Built |
| 223, 229, 233 | Proquity AI chat | `ai/index.tsx` | Built |
| 244 | Chat history | `ai/history.tsx` | Built |
| 224 | Notifications | `notifications.tsx` | Built |
| 215, 251, 255, 256 | Call Bookings (empty, scheduled, history) | `pitch-calls.tsx` | Built |
| 217, 220, 221, 225, 230, 234, 235, 239, 240, 248 | Book Pitch call, select provider, date & time, booked | `book-call.tsx` | Built |
| 216, 181 | Profile (with "See who's viewed") | `profile.tsx` | Built |
| 222 | Profile under review | `profile-review.tsx` | Built |
| 182–185, 187, 189, 197 | Settings, edit email, delete account, email updated | `settings/index.tsx` | Built |
| 188, 193, 198, 200, 204, 241 | Manage Subscription, App Store, success | `settings/subscription.tsx` | Built |
| 269 | Resources | `resources/index.tsx` | Built |
| 265, 270 | Legal templates, preview | `resources/legal.tsx`, `resources/legal-doc.tsx` | Built |
| 277, 281 | Sample pitch decks, preview | `resources/decks.tsx`, `resources/deck.tsx` | Built |
| 276, 280, 282–284 | Calculators, valuation calculators, burn rate | `resources/calculators.tsx`, `resources/calculator.tsx` | Built (all 8 work) |
| 278 | Video library | `resources/videos.tsx` | Built (playback needs real videos) |
| 266, 273 | Articles and blogs | `resources/articles.tsx`, `resources/article.tsx` | Built |
| 267, 274 | News | `resources/news.tsx`, `resources/news-item.tsx` | Built |

## Outside this section
Capital Provider V2/V3 and Capital Advisor sections are not built yet.

## Not real yet (needs a backend)
LinkedIn sign-in, email codes, payments, AI replies, push notifications, file storage, video playback, Join meeting links. Each shows a working stand-in.
