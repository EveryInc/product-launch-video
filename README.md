# product-launch-video

A [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code/skills) + minimal [Remotion](https://www.remotion.dev/) scaffold for building polished 15-30 second product launch videos.

Built for the moment between "we're shipping" and "we need a video for the tweet."

## What it does

Guides Claude Code through the full workflow:

1. Gather the launch brief, brand tokens, and a screen recording
2. Write a storyboard (shot-list table) before any code
3. Build scenes in Remotion using the included scaffold
4. Render → audit → iterate loop
5. Multi-agent review: 4 parallel critics check design, readability, pacing, and brand consistency
6. Ship as MP4 + GIF + social copy

The workflow bakes in hard-won rules — product on screen within 3 seconds, text readable at 720p, captions burned in for muted viewers, real UI copy only (no invented labels).

## Install

```bash
# Clone the repo
git clone https://github.com/EveryInc/product-launch-video.git
cd product-launch-video

# Install dependencies (includes Remotion)
npm install
```

The skill auto-loads for Claude Code because `SKILL.md` lives at `.claude/skills/product-launch-video/SKILL.md` inside the repo. Launch Claude Code from the cloned directory and it'll be available as `/product-launch-video`.

### Use the skill across all your projects

To make the skill available globally (not just in the cloned directory), symlink it into your user-level Claude Code skills folder:

```bash
mkdir -p ~/.claude/skills
ln -s "$(pwd)/.claude/skills/product-launch-video" ~/.claude/skills/product-launch-video
```

You'll still need to `cd` into the cloned repo to run the Remotion scaffold, but the skill itself will be invocable from anywhere.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or higher
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [ffmpeg](https://ffmpeg.org/) — optional, only if you want to export GIFs

Remotion installs as a dependency via `npm install` — no global install needed.

## Usage

Once installed, invoke the skill in Claude Code:

```
Make a launch video for our new feature. Here's the brief: [paste]
And here's a screen recording of the product: [drop file]
```

Claude will walk through the workflow, ask for missing inputs (brand tokens, tone), produce a storyboard for your review, and then build and render the video.

## What's in the repo

```
product-launch-video/
├── .claude/skills/product-launch-video/
│   └── SKILL.md          # The workflow Claude Code reads (auto-discovered)
├── SKILL.md              # Symlink to the above (for GitHub preview)
├── README.md             # This file
├── package.json          # Remotion deps
├── remotion.config.ts    # Render defaults (h264, crf 18)
├── src/
│   ├── index.ts          # Remotion entry point
│   ├── Root.tsx          # Composition registry
│   └── LaunchVideo.tsx   # Starter scene — replace with your own
├── public/
│   └── fonts/            # Drop your fonts here
└── out/                  # Rendered videos (gitignored)
```

## Output

Every run produces:

- `out/video.mp4` — 1920×1080, 30fps, h264 crf 18
- Optional `out/video.gif` — for embeds
- Caption variants for X and LinkedIn (generated inline)

## Design philosophy

- **Storyboard first, code second.** The most expensive mistake is building 8 scenes you have to rewrite.
- **Real UI copy only.** Screenshot the actual product and mirror what's there. Invented labels are the #1 tell of a video that feels fake.
- **Multi-agent review catches what you stop seeing.** After 50 renders, you lose the ability to see the video. Four parallel critics don't have that problem.
