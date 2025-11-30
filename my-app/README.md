This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Main.tsx (Technical Notes)

The game lives in `app/Main.tsx`. Key pieces:

- **Level routing**: The dynamic route `app/level/[level]/page.tsx` renders `Main(level)`. The header arrows and the side progress menu push to `/level/{n}`.
- **State + persistence**: Sliders store `tx`, `ty`, `s`, `g`, `h`. Values are loaded/saved per-level in `localStorage` (`affineAffinityValues`). Solved levels persist separately (`affineAffinitySolved`), so checkmarks survive refresh/navigation.
- **Targets and gating**: `getLevelTarget` defines per-level goals (tx/ty/s/g/h). `isLevelSolved` compares current values to targets. When solved, the “next” button lights up and moves to the next level (Level 10 shows a “congrats” state). The progress menu uses the same solve check. A “Reset all” button appears once all levels are solved and clears both sliders and solved state.
- **Transforms**: The goal and live Scotty images use CSS transforms to show translation, scale, and skew based on the current level and slider values. Level-specific goal transforms mirror the targets (e.g., Level 3 scales down, Level 5 skews horizontally, etc.).
- **Matrix/variables UI**: Matrix layout adapts per level (translate, scale, shear, or all). The variables card swaps sliders accordingly (single `s` on scale levels, `g` or `h` on shear levels, all controls on later levels) and includes a per-level reset button.
- **Progress menu**: Clickable levels; completion checkmarks only appear when a level is actually solved. Shows a “Reset all” button after all 10 are completed.
- **Tutorial + math**: Level 1 tutorial includes a KaTeX-rendered matrix equation with a labeled `M` (including tx/ty/s/g/h). KaTeX CSS/JS is loaded in `app/layout.tsx`. Additional inline links (wiki + Flexbox Froggy) sit in the tutorial text.
- **Assets**: Scotty image is imported from `app/assets/images/scotty.png`; arrow SVG path sits in `app/svg-rgf6n3wvt2.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
