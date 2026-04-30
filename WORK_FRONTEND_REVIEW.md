# /work — Frontend Critic's Review

**Scope:** strictly the frontend of the `/work` route. What the user sees, how it moves, how it behaves under the mouse, the keyboard, and a screen reader. Nothing about data models, SEO, or anything that isn't on screen.
**Reviewed:** `http://localhost:8889/work?role={swe,aiml,data,infra}` on 2026-04-23
**Files in scope:** `src/pages/Work.tsx`, `src/pages/Work.module.css`, `src/components/work/NodeGraph.tsx`, `src/components/work/NodeGraph.module.css`, `src/components/work/ProjectModal.tsx`, `src/components/work/ProjectModal.module.css`, `src/components/work/ParticleField.tsx`, `src/components/work/ParticleField.module.css`

---

## Verdict

This page is doing a magic trick, and the audience is a recruiter with eighteen tabs open. They land expecting a list of work. They get a dark void, drifting dust, six softly-glowing orbs with no visible text on them, and a one-line instruction: "Click a node to dig in." That is not a portfolio. That is a loading screen impersonating one.

The visual language is confident and the code is competent, but the **frontend is hostile to the task it exists for**. Every decision is trading readability for atmosphere. Labels are hidden until hover. The filter doesn't actually filter. The orb sizes and colors imply a taxonomy with no legend. Three simultaneous perpetual animation layers run with no reduced-motion respect. And the back link is stranded in the top-left like a Windows 95 Close button.

Below is what's wrong. Each item cites the file and prescribes the minimum fix.

---

## A. The page is the wrong *shape*

### A1. The constellation is a decorative void where a list should be

`src/pages/Work.tsx` renders `ParticleField` + `NodeGraph` and nothing else content-wise. There are no titles visible on the page until you hover an orb. A first-time visitor with a trackpad sees six glowing circles, reads *"Click a node to dig in"*, and is now doing work that the UI should have done. This is interaction-as-puzzle, not interaction-as-disclosure.

**Fix:** make the default view a list. Six cards stacked. Each card shows title + org + dates + one-line summary + tech chip row + a "Details" affordance. Put the constellation behind a `List | Graph` toggle, default to List. The graph can be the flourish; it can't be the interface.

### A2. `overflow: hidden` on a content page

`Work.module.css` `.work { overflow: hidden; ... }` — combined with `min-height: 100vh` this means the page literally cannot scroll. Fine today because the orb canvas is `clamp(420px, 65vh, 720px)` and fits. The moment you add a list, or a footer, or anything under the graph, the overflow traps it off-screen. Delete `overflow: hidden` unless there's an explicit reason (there isn't).

### A3. The header floats, the back-link floats, the graph floats

The `.backLink` is `position: absolute` top-left corner, disconnected from the header. The header is centered. The graph is centered with jittered dots. Three independent floating islands on a dark bg = no structure. Recruiter's eye has nowhere to land.

**Fix:** move the back link into an actual top bar or breadcrumb (`Home › Work`). Align it with the page grid, not the window corner.

---

## B. The filter lies

### B1. "Dimmed" nodes are still clickable, still tabbable, still in the a11y tree

`NodeGraph.tsx` does:

```tsx
const matchesRole = activeRole === null || node.roles.includes(activeRole);
const dimmed = !matchesRole;
// ... renders <motion.button ... className={dimmed ? styles.dimmed : ''} />
```

`.dimmed` is `opacity: 0.22; filter: saturate(0.4);`. The element is still in the DOM, still receives focus, still fires `onSelect` on click, still announces to screen readers. So:

- A screen reader user hears **all six** buttons for every role — the "filter" is invisible to them.
- A keyboard user tabs through six buttons; the dimmed ones are still interactive, order unchanged.
- The accessibility tree (verified) shows all six `button "Open details for …"` entries regardless of `?role=`.

That isn't a filter. That's a rendering hint for sighted, mouse-only users.

**Fix:** either (a) unmount non-matching nodes, or (b) apply `hidden` / `aria-hidden` + `inert` when dimmed and remove them from keyboard order. Option (a) is cleaner. The graph should visibly rearrange when the filter changes so it's obvious something happened.

### B2. Dim-but-present produces a dead empty-state

If any role had zero matching projects, every orb would render at opacity 0.22 with no other indication. The user would see a near-empty canvas and no message. There is no empty state branch.

**Fix:** if filtered list is empty, render a centered "No projects tagged for this role yet." string — and make sure that case is actually reachable or remove the role.

---

## C. The labels are invisible until you hover. On touch, they're invisible forever.

`NodeGraph.module.css`:

```css
.label {
  opacity: 0;
  transition: opacity 0.18s ease;
}
.node:hover .label,
.node:focus-visible .label {
  opacity: 1;
}
```

A touch device has no `:hover`. A user on iPad, iPhone, any trackpad-tap interaction, sees **six unlabeled circles**. Their only options are: tap blindly, or leave. Keyboard users get the label, which is nice, but they also need to know which node is focused when `outline-offset: 6px` draws a ring 6px outside a 75–110px absolutely-positioned button — the ring is a circle in space with no tether to the circle it labels.

**Fix (pick one, whichever matches intent):**
- Labels always visible below each orb (my recommendation). Drop the `opacity: 0` reveal.
- Or: if you must keep the reveal, show labels on first render for `coarse` pointers: `@media (pointer: coarse) { .label { opacity: 1; } }`.

### C1. The `pointer-events: none` on the label is fine

…but it means even if you do want to click the label text it won't register. Trivial, but someone will eventually report it.

---

## D. Motion is out of control

Everything on `/work` is moving, all the time:

1. **ParticleField canvas** — 60 particles with `requestAnimationFrame` perpetual drift. Opacity `0.55`.
2. **Six NodeGraph orbs** — each with `animate={{ x: [0, driftX, -driftX*0.7, 0], y: [0, -driftY, driftY*0.6, 0] }}` and `transition: { repeat: Infinity }`. Perpetual. Unseedable. No start/stop.
3. **Framer Motion entrance** — every orb does `initial={{ opacity: 0, scale: 0.7 }}` then scales in on `whileInView`.
4. **Modal** — animated entrance/exit, spinning close button (`transform: rotate(90deg)` on hover — cute, unnecessary).

**Nothing here checks `prefers-reduced-motion`.** Grep confirms: `prefers-reduced-motion` is respected in `src/components/themed/**` (matrix rain, cyberpunk grid, GoT embers, etc.) — all of which render on `/` if the theme is set, **none of which render on `/work`**. The `/work` page has the least reduced-motion hygiene on the whole site.

The cumulative effect: a vestibular-disorder user lands on `/work` and gets six drifting disks plus a drifting particle layer plus a scale-and-fade entrance plus a modal that animates in. No escape hatch.

**Fix:** add `useReducedMotion()` from framer-motion in both `NodeGraph` and `ProjectModal`. If true, drop the perpetual drift, cut the entrance `scale`/`y`, hold the close button still. Also: `ParticleField` should short-circuit `tick()` under reduced-motion — the canvas can render a static snapshot and stop the RAF loop.

### D1. CSS `transform: scale(1.08)` on hover fights Framer Motion's `transform: translate3d(x, y, 0)`

`.node:hover .orb { transform: scale(1.08); }` lives on the `.orb` child. Framer Motion applies `x` and `y` via inline `transform` to the `.node` parent. Technically on separate elements, but the scale on hover combined with the parent's mid-flight drift transform produces a visible stutter: the parent is mid-animation and the child abruptly scales. It reads as "this UI glitches when I touch it," not "this UI is alive."

**Fix:** move the scale to the parent (where framer-motion lives) and expose it as a framer-motion `whileHover`, so both transforms are composed in one place.

---

## E. The orb visual language is expensive and illegible

### E1. Per-orb glow chrome is too much, for no semantic payoff

Each orb has: a radial gradient fill, a 1.5px border, a 22px outer box-shadow, an 18px inset shadow. Internships layer a second 12px magenta shadow on the cyan. Research swaps the gradient center to pure white and bumps the outer shadow to 30px. Class gets a grey variant.

All that work happens so a visitor can distinguish four node types — **and the visitor has no legend to tell them which is which.** The chrome is ornamental labor with no communicative outcome.

**Fix:** either ship a legend row above the graph ("◎ Research · ● Project · ◐ Internship · ○ Class") with matching swatches, or cut the types down to one style and rely on the modal to disclose category. If you keep types, the visual vocabulary should be *one* cheap cue (say, a thin ring color) plus a text label under the orb — not four bespoke shadow recipes.

### E2. Sizes encode meaning that isn't communicated

`SIZE_BY_TYPE`: research 110, project 100, internship 90, class 75. The implicit hierarchy is "research > everything > class," which is a personal statement. A visitor reads it as "bigger = more important" and draws wrong conclusions (e.g. "the OHQ platform is less important than a research gig" because project is 100 and research is 110, despite OHQ being the highlight of the resume). If sizing is meaningful, say so. If not, unify.

**Fix:** either make sizes equal and let the modal disclose type, or expose a `size` concept that reflects *recency* or *prominence*, not the author's internal ranking of work categories — and explain it in a legend.

### E3. The grid-jitter positioning means nothing

`placeNodes()` splits the canvas into a ceil(sqrt(n·1.4)) grid and jitters each orb inside its cell. Deterministic, fine, doesn't reshuffle on re-render. But the *reason* for positioning isn't: positions don't reflect role overlap, timeline, tech similarity, importance, or anything. It's visual noise dressed as data-viz. The word "constellation" (in `aria-label`) is doing work the layout doesn't earn — there are no connections, no clusters, no axes.

**Fix:** either commit to a meaningful layout (timeline along X, role clusters along Y, edges for shared tech), or drop the spatial metaphor and render a clean responsive grid. Right now it's neither.

---

## F. Typography and contrast

### F1. Secondary text fails WCAG AA on body-size content

`var(--text-secondary, #8888aa)` on `var(--bg-primary, #0a0e1a)` yields roughly 4.1:1 — borderline for large text, below 4.5:1 for body. Used on:

- `.subtitle` at 1rem (center under "Work") — borderline.
- `.meta` row (org + dates) inside the modal at 0.88rem — **fails**.
- `.chip` border at 0.78rem — fine because text is `--text-primary`, but the border also hits 4.1:1.
- `.toggleBtn` default color at 0.82rem — **fails**.
- `.bullet` label "TODO" styling via `.todoBullet` (italic grey) at 0.94rem — **fails** (and this shouldn't exist at all — see F4).

**Fix:** bump secondary text to something nearer `#aaaacc` (roughly 6:1). Run an automated check with axe or Pa11y after.

### F2. Type ramp is flat

`.title` is 2.4rem, `.subtitle` is 1rem, `.chip` is 0.78rem, `.meta` is 0.88rem, `.bullet` is 0.94rem, `.summary` is 1.1rem, modal `.title` is 2rem. The 1rem / 0.94rem / 0.88rem / 0.78rem band does almost nothing distinct — the modal has four sizes living inside 0.22rem of each other. Either commit to a classic type scale (e.g. 1.0 · 0.875 · 0.75) or just use two sizes: body and caption.

### F3. `.backLink` has mismatched scale

0.85rem tiny pill in the viewport corner, next to a 2.4rem "Work" title. They never speak to each other. Either bring the back link into a nav row with its own affordance, or make it a larger, visually-tied element.

### F4. The `.todoBullet` style exists at all

`ProjectModal.module.css` ships a dedicated style for bullets that start with `TODO`. That means somebody wrote the style **so the TODO bullet would render gracefully**. The fix is not to style TODOs; the fix is not to have TODOs in the render path. Delete `.todoBullet` from the CSS, delete the `isTodoBullet()` helper, then the data won't survive shipping.

---

## G. Interaction details that leak amateurism

### G1. `/click.mp3` does not exist

`NodeGraph.tsx` calls `playSound('/click.mp3', 0.4)` on every orb click. The file is not in `public/` and not in `src/assets/`. `sound.ts` swallows the promise rejection silently — so functionally it's a no-op — but every click still hits a network request for a missing asset and spams the Network tab with a 404.

**Fix:** either ship the asset (and honor `prefers-reduced-motion` / a user mute control) or delete the `playSound` call. Shipping a no-op audio cue is worse than no audio — it's evidence of something abandoned mid-sentence.

### G2. The modal has no focus trap

`ProjectModal.tsx` focuses the close button on open and restores focus on close (good). But between open and close, Tab can walk out of the modal into the underlying page content — visually hidden behind the backdrop but still in the tab order. `aria-modal="true"` alone does not trap focus; it's an advisory attribute.

**Fix:** trap focus with `inert` on the main app shell while the modal is open (React 18+ supports `inert` on any element), or add a keyboard focus loop that cycles within the modal's tabbable descendants.

### G3. Clicking an orb doesn't change the URL

Open a project, refresh, it's closed. Copy the URL to share a specific project, the recipient lands on the empty graph. Modals that disclose primary content should have an owner URL.

**Fix:** `/work?role=swe&project=ohq` opens the OHQ modal on load. Straightforward `useSearchParams` tack-on since the role param is already URL-driven.

### G4. Modal is full-viewport on every screen size

`ProjectModal.module.css` sets the modal to `width: 100%; height: 100%; max-width: 100%`. It's a page, not a dialog. On a 27" display this makes the card of content feel lost in a sea of dark; on a phone it's fine. Either commit to making it a page (which means it should have a URL, see G3) or make it a proper centered dialog with `max-width: 920px` and some padding around it.

### G5. Close button is `position: fixed` and 90°-rotates on hover

Fixed + rotate on hover + a `&times;` glyph (not an icon) is two cute things stacked in one tiny control. Drop the rotation, use a `lucide-react` `X` icon, keep the element inside the modal's flow (`position: absolute` within `.modal`) so it doesn't overlap device chrome on notched phones.

### G6. `role="tablist"` + no `tabpanel` + no arrow-key navigation

`Work.tsx` renders `<div role="tablist">` with `<button role="tab" aria-selected>`. No `aria-controls`. No `id`. No `tabpanel` — the "panel" is just the graph below, un-associated. No `onKeyDown` to handle Left/Right/Home/End per the WAI-ARIA tab pattern.

**Fix:** add `aria-controls="project-constellation"` to each tab and `id="project-constellation" role="tabpanel" aria-labelledby="tab-{role}"` to the region. Implement roving tabindex + arrow-key cycling.

### G7. Tabs don't change focus target

When you click SWE → Data, nothing inside the graph receives focus. The user's focus stays on the tab. That's fine for a filter, but given that "tablist" is semantically promising a tabpanel, a screen reader user receives no signal that anything happened. See B1.

---

## H. Monochrome cyan everywhere

`--accent: #00f0ff` does a lot of unrelated jobs:

- Tab active fill
- Orb default fill
- Orb hover ring
- Orb focus outline
- Chip-free border mix
- Pill text (project type)
- Link color
- Link border
- Toggle button hover
- Bullet marker
- Back link hover border + text

That same cyan identifies a primary CTA, a decorative glow, a focus ring, a passive tag, and an external link. Nothing on this page is more or less clickable than anything else. Recruiter eye has no hierarchy.

**Fix:** define a real three-token system — `--accent` (one primary action at a time on screen), `--emphasis` (focus ring, hover), `--muted-tint` (decorative glows, chips). Right now it's all one token.

---

## I. Small things that still count

- **I1.** `<h2 id="modal-title-{node.id}">` inside a dialog that follows an `<h1>` on the page is fine, but the page has no top-level landmark (`<main>`) on `/work` — `Work.tsx` returns a `<div>`, not a `<main>`. Add `<main>` and move the back link outside it or into a `<nav>`.
- **I2.** `<Link to="/" className={styles.backLink}>` uses a left-arrow **entity** `&larr;` and the string "Home" — a screen reader reads "left arrow Home." Add an `aria-label="Back to home"` or use `← ` inside a `<span aria-hidden>`.
- **I3.** `NodeGraph` `aria-label="Project constellation"` is a cute name that tells a screen reader user nothing about what's in the region. Call it "Projects filtered by role," or drop the region role entirely.
- **I4.** `playSound('/click.mp3', 0.4)` fires on every click with no user control. Even once the asset exists, a portfolio that auto-plays sound on interaction should have a mute toggle and respect the system reduce-motion / reduce-noise preferences.
- **I5.** The `Show N more (the messy details)` toggle copy switches register — the rest of the modal is neutral professional, this one string is casual. Pick a voice and keep it.
- **I6.** Hover scales the orb to 1.08× but doesn't grow the hit target — on a 75px `class` orb that's a ~6px halo of "visible but not clickable," which is a minor but real miss on small screens.
- **I7.** Active-tab color choice: `.tabActive { background: var(--accent); color: var(--bg-primary); }` — cyan pill with near-black text. Contrast is fine, but the active state is the **loudest** thing on the page, which competes with the orbs for attention. Desaturate the active pill, or at least drop its shadow to sit it back.

---

## Priority execution order (frontend-only)

Do these in order; none require touching the data model.

1. **C** – Always-visible labels under each orb (or a labeled list as the default view). No hover gating.
2. **B1** – Make the role filter actually remove non-matching nodes from the DOM / a11y tree.
3. **A1** – Ship a list view and make it the default; move the graph behind a `List | Graph` toggle.
4. **D** – Respect `prefers-reduced-motion` across `NodeGraph`, `ParticleField`, and `ProjectModal`. Kill the continuous drift on the orbs when it's set; freeze the canvas RAF loop.
5. **F1, F4** – Bump secondary text contrast. Delete the `TODO` bullet style (and the TODO bullet itself).
6. **G2, G3** – Focus trap in modal; URL-owned modal state.
7. **E1, E2, H** – Simplify orb chrome, publish a legend if types stay, collapse the cyan monoculture into a three-token system.
8. **G6** – Proper tablist a11y: `aria-controls`, `tabpanel`, arrow-key nav.
9. **G1** – Ship or delete the click sound. No referenced assets that don't exist.
10. **A2, A3, I1–I7** – Cleanup sweep for the small stuff.

---

## One paragraph to the author

The craft is there. The page is clearly built by someone who likes frontend work, knows Framer Motion, respects `useMemo`, writes clean CSS modules, and thinks about determinism in a layout function. That's all visible. What's missing is the step where you ask *"is the user actually getting what they came here for?"* A visitor on `/work` came to read about your work. Right now, they have to solve a puzzle before they can start. Trade 60% of the atmosphere for 100% of the legibility and this page becomes your strongest one.

— end of review —
