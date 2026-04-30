# PORTFOLIO REVIEW — Harsh Edition

**Reviewed:** `http://localhost:8889/` and `http://localhost:8889/work` on 2026-04-23
**Audience:** Claude Code. Work through this top-to-bottom. Don't argue with the tone; the content is the useful part. Priorities are P0 → P2. Each item states the problem, cites the file(s), and prescribes the fix.

---

## Verdict

This is a half-finished React playground wearing a portfolio as a costume. The code has a clear ambition — theme engine, node graph, role-switcher, four resumes — but the deployed surface shows a single hero screen and a gimmicky work page. Roughly half the `/src/components/sections` tree is **defined and never rendered**. The landing page makes confident senior-engineer claims with zero evidence surfaced. The `/work` page replaces a scannable project list with a particle field and a graph that doesn't actually filter. A recruiter gets fifteen seconds and an animation.

Before any more features, **ship what's already written or delete it.** Right now the repo is an argument against the developer, not for them.

---

## P0 — The site is mostly unshipped

### 1. Half the codebase is dead code

The following components are written, styled, and imported nowhere:

- `src/components/Layout/Navbar.tsx`
- `src/components/Layout/Footer.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/Experience.tsx`
- `src/components/sections/Education.tsx`
- `src/components/sections/Skills.tsx`
- `src/components/sections/Projects.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/sections/ComingSoon.tsx`
- `src/components/ThemeSwitcher/ThemeSwitcher.tsx`

`App.tsx` defines only two routes (`/` and `/work`) and the home page renders nothing but `<Hero />`. A visitor cannot reach About, Experience, Education, Skills, Projects, or Contact. There is no navbar. There is no footer. There is no theme switcher — despite four fully-authored theme stylesheets in `src/styles/themes/`.

**Fix (pick one, don't delay):**
- **Option A — ship it:** Wire the existing sections into the home page. Modify `App.tsx` `HomePage` to render `<Navbar />`, `<Hero />`, `<About />`, `<Experience />`, `<Skills />`, `<Projects />`, `<Education />`, `<Contact />`, `<Footer />` in a single scrolling page with anchored nav. Render `<ThemeSwitcher />` in `Navbar`.
- **Option B — cut it:** If those sections are abandoned, delete the files, delete their CSS modules, delete their data dependencies, and remove them from the type tree. A half-built codebase is worse than a small one.

Do not ship as-is. Shipping dead code makes the repo look like a student project that was never finished — because it is one.

### 2. Two conflicting sources of truth for the same career

`src/data/projects.ts` and `src/data/experience.ts` describe the same jobs with different facts:

| Role | `projects.ts` | `experience.ts` |
| --- | --- | --- |
| OHQ | `dates: "Sep 2025 to present"`, `org: "Co-founder"` | `period: "Jan 2025 – Present"`, `company: "OHQ"`, `title: "Co-Founder & Lead Developer"` |
| Vijay Rekha | `dates: "Aug 2025 to present"` | *(truncated; verify)* |

Pick one. A recruiter who cross-references the resume PDF with the site and finds the dates don't even match the site itself will treat it as a credibility failure. Also: `extraBullets: ['TODO: source from notes']` on the Vijay Rekha entry in `projects.ts` is **live in the shipping build**. That is the single most embarrassing line on the site.

**Fix:**
- Collapse to one data file — `src/data/career.ts` — with a discriminated union of `project | internship | research | class`. Derive both the `Experience` list and `NodeGraph` nodes from it.
- Remove the `TODO` string from `PROJECTS[1].extraBullets`. Replace with real bullets or an empty array.
- Add a schema check in `validateProjects()` that fails the dev build when any bullet contains `/TODO|FIXME|XXX/i`.

### 3. The landing page claims expertise and shows no evidence

The hero pitch says:

> "I'm not just a feature builder. I think about graceful degradation, deployment, and what breaks at 2 AM. What I like most is solving messy, real-world problems…"

Then it offers a photo, a resume download button, and two social icons. That's it.

A recruiter looking at this for six seconds sees no metric, no logo, no project, no proof. Everything interesting — 500+ students, 85% faster validation, 90% less triage time, 300+ daily samples, z/OS integration — is hidden inside a PDF behind a download button. **If you never open the resume, the site says nothing.**

**Fix (above the fold, before they scroll or download anything):**
- A metric strip. Four tiles, numbers only, role-filtered:
  `500+ students served` · `85% faster clinical validation` · `90% less manual triage` · `6 services containerized`.
- A logo wall of orgs (UW-Madison, Morgridge, WI DoA, USP, Vijay Rekha Life Sciences) — grayscale, under the hero.
- A current-status line: "CS & Data Science @ UW-Madison — graduating May 2026" (or actual date). Right now nothing on the rendered page says he is a student.

---

## P1 — The hero is performing, not selling

### 4. The copy is overwritten for a junior candidate

Read the role hooks in `src/components/sections/Hero.tsx`:

- `"Full-stack systems end-to-end, from React UIs to multi-threaded control loops."` — fine, but hollow without a link to the control loop.
- `"AI that ships to production. Not AI that demos in notebooks."` — this is a swaggering line that needs receipts. The landing page has none. A senior reading this will immediately scan for the shipped AI product and find nothing clickable on the home page.
- `"Build it to survive 2 AM. Docker, CI/CD, fault-tolerant control systems."` — again, fine if there's evidence. There isn't on this page.

Confidence without proof reads as bluster. Tone down until the evidence catches up, or surface the evidence.

**Fix:**
- Under each role hook, render one proof link: `See the ML service → /work?role=aiml#ohq-ml`.
- Replace the generic "not just a feature builder" paragraph with two specific sentences from the real work: the E-Beam safety controller driver and the SSE+Redis queue. Concrete. Not posturing.

### 5. Four resumes is indecision, not optionality

`public/` ships `Anurag_Chinnaboina_Resume.pdf`, `_SWE.pdf`, `_AI_ML.pdf`, `_Data.pdf`, `_Infra.pdf`. The hero has a role tab that swaps the download. A recruiter sees this and thinks: *this person doesn't know what they want to be.*

**Fix (pick one posture):**
- Ship **one** resume, strongest version. Let the role tabs filter the node graph and copy, not the PDF.
- Or, if you really want role-specific resumes, don't make it a toggle. Make it an explicit "I'm applying for X role → this is the version for that role" framing. But this is almost always worse than one strong resume.
- Delete the unused PDFs from `public/` either way.

### 6. The `RippleIntro` gates the content behind animation

`src/components/sections/Hero.tsx` wraps the entire body in `<AnimatePresence>{introDone && ...}</AnimatePresence>`. Until the ripple animation fires `onComplete`, the name, tabs, hook, pitch, resume CTA, and social links are **not in the DOM**. Effects on new tab, mid-call screen-share, reduced-motion users, and crawlers that don't run JS for long all see nothing.

**Fix:**
- Render the content immediately. Let the ripple animate *on top* of visible content, not as a gate.
- If you keep a gate, respect `prefers-reduced-motion: reduce` and skip the intro entirely. Currently there is no such check.
- Add the real content to SSR/static fallback inside `index.html` for crawlers — or adopt SSG via Vite SSG if you're serious about SEO.

---

## P1 — `/work` is the wrong shape

### 7. NodeGraph + ParticleField is a demo, not a portfolio

`src/pages/Work.tsx` renders a particle field, a node graph, and role tabs. There is no scannable list of projects with titles, dates, orgs, and summaries. The page text for both `role=swe` and `role=infra` is **identical** — the same six project titles, no dates, no orgs, no summaries. Role filtering appears to be visual-only (dim/highlight) and does not change the reading order or accessibility tree. That's a filter that isn't a filter.

Recruiters don't want a constellation. They want a list. Senior engineers don't want a constellation either.

**Fix:**
- Default view = a proper list: card per project, showing title, org, dates, one-line summary, tech chips, and a "Details" button opening `ProjectModal`. Filter by role actually removes non-matching cards from the DOM.
- Move NodeGraph to a secondary view behind a toggle: `List | Graph`. Make List the default and the URL-default.
- Kill the ParticleField on this page. It's decorative noise on a content page.

### 8. `/work` tablist has accessibility gaps

Role tabs use `role="tab"` and `aria-selected`, but:

- No `aria-controls` pointing at a `tabpanel`.
- No `id` on any tabpanel — because there is no tabpanel element.
- No keyboard arrow-key handling. Pressing `ArrowRight` on a focused tab does nothing. WAI-ARIA tablist requires left/right/home/end.

Same issues exist on the role tabs in `Hero.tsx`.

**Fix:**
- Wrap the content each tab filters in a `<div role="tabpanel" id="panel-{role}" aria-labelledby="tab-{role}">` and give each tab an `id="tab-{role}"` + `aria-controls="panel-{role}"`.
- Add a `useRovingTabindex` or inline `onKeyDown` handler that moves focus on arrow keys and loops at the ends.

### 9. Suspense fallback is a blank screen

`App.tsx`:

```tsx
<Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
```

An empty 100vh div is not a loading state. On a slow network, a user clicking Work gets a white page.

**Fix:**
- Minimum: a centered spinner or the string "Loading work…".
- Better: a skeleton of the Work page (header + six project-card placeholders).

---

## P2 — SEO, meta, and link hygiene

### 10. Meta is barely there

`index.html` has `og:title` and `og:description` and nothing else. Specifically missing:

- `og:image` — shared links on Slack, LinkedIn, iMessage render as plain text.
- `og:url`.
- `twitter:card`, `twitter:image`.
- `<link rel="canonical">`.
- JSON-LD `schema.org/Person` (name, jobTitle, alumniOf, url, sameAs for GitHub/LinkedIn).

**Fix:** generate a static `og-image.png` (1200×630, name + role + accent), add all of the above to `index.html`. For JSON-LD, inline a `<script type="application/ld+json">` block in `index.html`.

### 11. Every project link is null

`src/data/projects.ts` — every entry has `links: { github: null, demo: null }`. The site has **zero** clickable code or demo links. The one GitHub link in the hero goes to `github.com/Anurax1321` — a handle that does not visibly match the name "Anurag Chinnaboina." That looks like an abandoned account or, worse, someone else's.

**Fix:**
- For every project, either link to a repo/branch/PR or explain why it's closed source in one line (e.g., "Internal — available on request"). Silent null is the worst option.
- Either rename the GitHub handle to something obviously tied to his name, or add a short line in Hero: "@Anurax1321 is me — [github.com/Anurax1321](https://github.com/Anurax1321)".

### 12. Contact is missing

There is no contact method on the rendered site. No email. No form. No "Say hi." The LinkedIn icon is the only viable inbound path — and `Contact.tsx` exists unused (see P0 item 1).

**Fix:** surface an email (obfuscated if spam is a concern) and/or wire `Contact.tsx` into the home page.

### 13. Hero photo is not responsive

`Hero.tsx` does `import photo from '../../assets/photo.jpg'`. A single asset, no `srcset`, no `sizes`, no `width`/`height` attributes, no `loading="lazy"` (fine at the hero, bad if it ever moves). Mobile gets the full-resolution headshot.

**Fix:** ship a `srcset` with 1x / 2x / 3x variants, set explicit `width` and `height` to eliminate layout shift, and consider an AVIF/WebP fallback pair.

### 14. Footer ritual is missing

The closing line "Built by Anurag Chinnaboina © 2026" is fine but isolated from any `<footer>` element, and this is on the hero. The separate `Footer.tsx` isn't rendered (see P0 item 1).

**Fix:** wire `Footer.tsx` in, put the copyright line there, and include at minimum: GitHub, LinkedIn, email, "Last updated YYYY-MM".

---

## P2 — Tonal and detail misses

### 15. Four themes signal indecision, and three of them undercut the pitch

The codebase has `minimal`, `matrix`, `cyberpunk`, and `got` themes. Three of four are maximalist genre costumes. The pitch is "I think about what breaks at 2 AM." Pairing that with a Game of Thrones embers background is a tonal contradiction. Matrix + Cyberpunk is hacker cliché.

**Fix:**
- Ship with `minimal` as the default and only production theme.
- Move the other three to a `/easter-eggs` or keyboard-shortcut reveal. Fun for visitors who find it, invisible to recruiters.
- Or: commit to one themed identity (pick the one that reflects the real work — likely `minimal`) and delete the others. Fewer choices = faster decision = stronger brand.

### 16. `validateProjects()` runs twice in dev

React 18 StrictMode double-invokes `useEffect`, which means `validateProjects()` in `Work.tsx` runs twice on every dev mount. If it throws, you'll see double errors; if it logs, double noise. Harmless but sloppy.

**Fix:** move the call to module top-level behind `if (import.meta.env.DEV)`, or memoize with a `didValidate` ref.

### 17. The `page title` lies slightly

`<title>Anurag Chinnaboina | Software Engineer</title>` — but the site allows him to pitch himself as AI/ML, Data, or Infra. Title is role-invariant.

**Fix:** update `document.title` via a small `useEffect` in `Hero.tsx` keyed off `activeRole`, e.g. `Anurag Chinnaboina | AI / ML Engineer` when `role=aiml`. This also helps the back button in multi-tab recruiter flows.

### 18. `useRoleParam` is called in two components with independent state

`Hero.tsx` and `Work.tsx` both call `useRoleParam()`. If the hook reads/writes the URL, this is fine. If it holds local state, they'll desync. Verify the hook is purely URL-driven (`useSearchParams`). If not, lift the role state to `ThemeProvider` context or a `RoleProvider`.

### 19. `StrictMode` + `AnimatePresence` + `RippleIntro` double-mount

Related to 16: `RippleIntro.onComplete` may fire twice in dev, setting `introDone` twice. Safe because it's idempotent, but if any analytics beacon or one-shot side effect hooks into the intro completion, it'll double-fire in dev. Worth guarding.

### 20. `© 2026` is a `new Date().getFullYear()` call — good. Launch year is missing.

`Footer.tsx` (unused) and the in-hero copyright use `new Date().getFullYear()` — so in 2027 it auto-updates. Good. But portfolios usually show a range: `© 2024–{current}`. Trivial but it signals continuity.

---

## Suggested execution order for Claude Code

Do these in order. Do not skip P0.

1. **P0-1** Decide render-or-delete on the unused sections. If rendering, wire into `App.tsx`'s `HomePage` and build a single-page scroll. If deleting, `rm` the files.
2. **P0-2** Unify `projects.ts` and `experience.ts` into `career.ts`. Delete the `TODO` bullet. Add a dev-time validator.
3. **P0-3** Add the metric strip, logo wall, and student-status line to the hero. Minimum: 4 stats, 5 org logos, 1 status sentence.
4. **P1-4** Rewrite the three role hooks to cite one specific project each.
5. **P1-5** Drop to one resume PDF unless there's a deliberate reason to keep four. Delete the unused PDFs from `public/`.
6. **P1-6** Remove the animation gate. Render hero content immediately; animate on top. Respect `prefers-reduced-motion`.
7. **P1-7** Add a list view to `/work` and make it the default. Move NodeGraph behind a toggle.
8. **P1-8, P1-9** Fix tablist a11y on both pages. Replace the empty Suspense fallback with a real skeleton.
9. **P2-10** Add the missing meta tags, generate an OG image, add JSON-LD.
10. **P2-11, P2-12** Add project links or "private" explanations. Surface a contact method. Clarify the GitHub handle.
11. **P2-13** Add responsive image variants for the headshot.
12. **P2-15** Ship with `minimal` only. Gate other themes behind an easter-egg toggle or delete them.
13. **P2-16 to P2-20** The small detail fixes. Do these last.

---

## What this site could be, if the above is done

A single scrolling landing page — Hero (with proof above the fold), About (one tight paragraph), Experience (derived from `career.ts`), Selected Projects (cards, not a constellation), Skills (one compact grid), Education (one line plus coursework), Contact (email + socials + form). `/work` remains as the deep-dive page. One resume. One theme. One confident voice. That's the version worth shipping.

Ship the small version well. Then decide if the graph, the four themes, and the four resumes earn their keep.

— end of review —
