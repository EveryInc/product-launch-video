---
name: product-launch-video
description: >
  Build polished product launch videos in Remotion from brief → storyboard → render → multi-agent
  review → iterate. Designed for 15-30s social clips for product launches, feature demos, and
  before/after transformations. Triggers on: product video, launch video, demo video, remotion
  video, make a video for launch.
---

# Product Launch Video Workflow

A repeatable workflow for producing 15-30s product launch videos using Remotion. Built for feature launches, app demos, and before/after transformations destined for X, LinkedIn, YouTube Shorts, and landing pages.

## When to use

- Product launch needs a short, social-ready video
- New feature demo for X/LinkedIn
- Before/after product transformation clip
- Landing page hero video

## Prerequisites

- Node.js 18+
- This repo cloned and `npm install` run
- ffmpeg (only if exporting GIFs)
- A screen recording of the product (30-60s, used as design inspiration only)
- The launch copy: headline, tagline, key features, tone direction

## Workflow

### 1. Gather inputs (parallel)

Pull these in parallel before writing anything:

- **The brief** — launch post, landing page, one-pager. Extract: headline, taglines, key features, tone.
- **Brand tokens** — fonts, colors, icons, logos. If you have a design system, surface its values. Otherwise, pull from the live product.
- **Screen recording** — a 30-60s recording of the product in real use. This is your **design inspiration** and a source of truth for actual UI copy. Never invent labels, agent names, or features that don't exist in the real app.
- **Voice calibration** (optional) — if the video has narration or you're ghostwriting captions in a specific voice, pull recent posts/clips to match cadence and word choice.

### 2. Storyboard before any code

Write a shot-list table. Resist the urge to start coding.

| Beat | Time | Visual | Text overlay |
|------|------|--------|-------------|

**Rules that save you from re-rendering:**

- **Use real product UI copy.** Screenshot the actual app and mirror what's there. Invented labels are the #1 reason launches feel fake.
- **Lead with the viewer's problem** (hook), not the product name.
- **Product must appear within 3 seconds** (a16z Speedrun research on launch videos).
- **Before/after is the money shot** — design the whole video around it.
- **All text must be readable at 720p** (phone feed). Minimum 18px equivalent.
- **85%+ of social views are muted** — burn all captions in. No VO unless explicitly requested.

### 3. Build in Remotion

This repo ships with a minimal Remotion scaffold. Start from `src/LaunchVideo.tsx` and customize:

- Keep the composition thin — extract scenes, theme, fonts, and mock data into their own files as complexity grows
- Register new compositions in `src/Root.tsx` (one per aspect ratio if shipping to multiple platforms)
- Use `staticFile()` for assets in `public/`
- Defaults are 1920×1080 at 30fps, h264 crf 18 — see the Ship section for platform-specific overrides

**Font loading pattern** (prevents character clipping and layout thrash):

```tsx
const [handle] = useState(() => delayRender('fonts'));
useEffect(() => {
  const font = new FontFace('Name', `url(${staticFile('fonts/file.otf')})`);
  font.load().then(f => { document.fonts.add(f); continueRender(handle); });
}, [handle]);
```

**Crossfade transitions** — handle at the orchestrator/root level, not per-scene. Per-scene exit fades fight the orchestrator and cause double-fading.

### 4. Render-audit loop

```bash
# Single frame audit
npx remotion still <comp-id> out/test.png --frame 60

# Full render
npx remotion render <comp-id> out/video.mp4 --codec=h264 --crf=18
```

Render one frame per scene first. Fix layout/clipping issues before full render. Check:

- Text not clipped (line-height >= 1.2 for serif fonts with descenders)
- Panels not stacking unexpectedly (AbsoluteFill defaults to `flex-direction: column`)
- Content not truncated in bubbles, cards, or chat UI

### 5. Multi-agent review (the step that catches everything)

After 2-3 self-iterations, render ~20 frames (peak moments + transition frames) to `out/review/` and spawn **4 review agents in parallel**. Each reads the PNG frames and returns a prioritized fix list.

1. **Design/layout critic** — off-kilter elements, misalignment, proportions, cropping
2. **Text/readability critic** — legibility at 720p, contrast, truncation, typos
3. **Narrative/pacing critic** — story arc, attention peaks/drops, earned duration, CTA strength
4. **Brand consistency critic** — fonts, colors, UI chrome matching the real product

Compile all 4 critic outputs + your own notes into a single revision plan before the next render pass. This step finds things you stop seeing after 50 renders.

### 6. Iterate on feedback

Watch the render in QuickTime (or your player of choice) and iterate. Common feedback patterns and their fixes:

- **"This text is cut off"** → line-height or overflow issue
- **"This feels clunky"** → animation timing too fast/slow; check counter digit-flicker rate
- **"You invented this label"** → replace with real UI copy from the screen recording
- **"Hold longer here"** → extend scene duration, keep animation timing the same
- **"A little long overall"** → cut redundant scenes (the narrative critic usually identifies which)

### 7. Ship for the right platform

**Ask the user which platforms they're publishing to before rendering.** Aspect ratio and duration limits differ — a 16:9 clip cropped to 9:16 in post usually looks bad. If the video is going to multiple platforms with different aspect ratios, create a separate Remotion composition for each and render independently.

This repo defaults to 1920×1080 landscape. Change dimensions in `src/Root.tsx` to fit the target platform:

| Platform | Aspect | Recommended size | Max duration |
|----------|--------|------------------|--------------|
| X / Twitter (feed) | 16:9 | 1920×1080 | 2:20 |
| X / Twitter (vertical) | 9:16 | 1080×1920 | 2:20 |
| LinkedIn (feed, landscape) | 16:9 | 1920×1080 | 10 min |
| LinkedIn (feed, square) | 1:1 | 1200×1200 | 10 min |
| YouTube (standard) | 16:9 | 1920×1080 | — |
| YouTube Shorts | 9:16 | 1080×1920 | 60s |
| Instagram Feed | 4:5 | 1080×1350 | 60s |
| Instagram Reels | 9:16 | 1080×1920 | 90s |
| TikTok | 9:16 | 1080×1920 | 3 min |

Recommended deliverable pack:

- MP4 in each requested aspect ratio
- GIF version for embeds and Slack shares (see Render commands below)
- Caption variants for each platform (length and tone differ)
- A thread/feature-list version for X and LinkedIn replies

## Hard-won lessons

- **Never invent product UI labels.** Screenshot the real app and mirror the copy exactly. This is the single biggest source of launch video cringe.
- **Find the one moment only your product can deliver — give it the most screen time.** Every launch video has a differentiating beat. The rest of the video should set it up. Don't spread the runtime evenly across features.
- **Before/after stagger beats simultaneous.** Land the "before" first for 0.7-1s, then crash in the "after" with a spring overshoot and a color flash. Much more dramatic than both appearing together.
- **Counter animations**: match per-frame digit rate to whatever feels natural. A bigger target number shouldn't fit in the same animation window — stretch it.
- **Endcard: one headline + CTA.** Don't stack 3 lines of copy. Use the landing page's actual tagline — not something you invented to sound punchier.
- **Ground your "problem state" in something viewers recognize without explanation.** If they need a sentence to understand what's wrong, the hook is too abstract.

## Render commands

```bash
# Preview in browser (hot-reload studio)
npm run studio

# Single frame (fastest way to audit)
npx remotion still <comp-id> out/frame.png --frame 60

# Full video
npx remotion render <comp-id> out/video.mp4 --codec=h264 --crf=18

# GIF (for embeds — requires ffmpeg)
ffmpeg -y -i out/video.mp4 \
  -vf "fps=15,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  out/video.gif
```
