# Stufit Design Brief

## Register

**Product** — gamified study platform. This is an app UI, not a marketing site. The interface is an instrument users operate daily.

## Product Identity

**Name:** Stufit (study + fit)

**Category:** Gamified self-improvement / study challenge platform

**Language:** Korean

## Users & Context

- **Primary user:** Korean students and learners (teens through young adults) who struggle with consistency in self-study
- **State:** Arriving with motivation but fragile discipline. They need the app to make studying feel rewarding and competitive
- **Context:** Used on mobile and desktop throughout the day — checking attendance, logging study time, joining challenges, browsing the community
- **Pressure:** Fighting procrastination. The app must feel immediate and game-like enough to pull them in

## Core Jobs

1. **Monitor** — track personal study progress, streaks, and challenge status
2. **Compare** — see rankings, climb tiers (Bronze → Challenger), compare against peers
3. **Operate** — join challenges, log daily study time, check attendance, manage bets
4. **Explore** — browse community posts, shop for profile items
5. **Configure** — manage profile, items, and account

## Domain Artifact

The **challenge** is the central artifact. Everything orbits around joining, tracking, and completing study challenges with timers, bet points, and daily check-ins. The tier badge is the status symbol.

## Voice

- **Motivating but not patronizing.** Game-like energy without feeling like a kids' app
- **Friendly and direct.** Korean conversational tone — approachable, not formal
- **Competitive spark.** Rankings and tiers should feel aspirational, not punishing
- **Trust through transparency.** Points, scores, and progress must feel earned and visible

## Anti-References

- Do not look like a generic SaaS dashboard (cream + purple gradients, centered cards)
- Do not look like a children's game (bouncy mascots, rainbow palettes, excessive animations)
- Do not look like a dry academic LMS (tables of grades, muted institutional blues)
- Do not use the generic tech gradient (blue-violet CTAs, purple-to-cyan)
- Do not use exclamation points or over-eager copy
- Avoid centered hero + card grid as the default composition for every screen

## Composition Defaults

- **Home / Challenge list:** Explore + Compare — browse challenges, see active ones, rank previews
- **Challenge detail:** Operate + Monitor — timer, daily check-in, progress tracking, member list
- **Ranking:** Compare — leaderboard, tier progression, score breakdown
- **Community:** Explore — post list, categories, search, engagement
- **Shop:** Explore + Configure — browse items, equip profile, spend points
- **Attendance:** Monitor — calendar view, streak counter, point rewards
- **Profile / My Page:** Configure — tier display, equipped items, stats summary

## Visual Foundation

### Existing System
- **Primary:** Teal-green `#0d6b63`, `#096b68`, accent `#70c1b3`
- **Background:** Light gray `#eeeeee`, white `#ffffff`
- **Body text:** `#333333`
- **Font:** Noto Sans KR (body), Instrument Sans (where English appears)
- **Tier colors:** Bronze `#A97142`, Silver `#8B949E`, Gold `#D4AF37`, Platinum `#4FB1C6`, Emerald `#2FA66A`, Diamond `#3C84FF`, Master `#7E57C2`, Challenger `#E53935`
- **Tier badges:** Custom PNG medal images per tier
- **Logo:** `/img/logo.png`

### Current Issues
- Heavy reliance on `style.css` with inline styles and `!important` overrides scattered across components
- No design token system — colors, spacing, and radii are hardcoded
- Mobile breakpoint at 750px with a hamburger menu
- Inconsistent component patterns (mix of CSS classes and inline styles)

## Design Principles

1. **Tier-first.** The ranking tier is the most visible identity marker. It should appear prominently on every relevant surface
2. **Game feel, tool reliability.** The interface should feel like a game dashboard but operate like a reliable tool — stats update instantly, progress is never lost
3. **Mobile-native.** Most users will be on phones. Design for thumb reach, touch targets 44px+, and vertical scroll flow
4. **Green means progress.** The teal-green primary color is the signal of forward motion. Use it deliberately
5. **Korean-first typography.** Noto Sans KR drives all labels and body. Instrument Sans is for numbers, codes, and English supplementary text only

## Accessibility

- Touch targets: minimum 44×44px on mobile
- Contrast: text against background must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- Focus rings: visible, consistent, never suppressed without replacement
- Form labels: always visible, never placeholder-only
- Color is not the only signal — tier badges and status use shape + color + label

## Component Rules

- Buttons use the teal-green primary with white text for primary actions
- Cards are acceptable for challenge listings, shop items, and post previews — genuinely card-shaped content
- Forms should be compact and single-column on mobile
- Modals for alerts, confirmations, and my-page
- Header is persistent across all views
- Footer exists on public pages (login, signup)
