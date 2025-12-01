"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import svgPaths from "./assets/images/svg-rgf6n3wvt2";
import scottyImg from "./assets/images/scotty.png";

// Shape of per-level targets for success checks
// Variables are for the transformation matrix. The matrix M is as follows:
// [ s   0  tx ]
// [ 0   s  ty ]
// [ g   h   1 ]
type LevelTarget = {
  tx?: number;
  ty?: number;
  s?: number;
  g?: number;
  h?: number;
  nextLevel: number;
};

// LocalStorage key for persisted slider values
const STORAGE_VALUES_KEY = "affineAffinityValues";

declare global {
  interface Window {
    katex?: {
      render: (tex: string, el: HTMLElement, options?: Record<string, unknown>) => void;
    };
  }
}
// Default slider values per level, these are based on the identity matrix:
// [ 1 0 0 ]
// [ 0 1 0 ]
// [ 0 0 1 ]
function getDefaultValues() {
  return {
    tx: 0,
    ty: 0,
    s: 1,
    g: 0,
    h: 0,
  };
}

// Render a LaTeX snippet with KaTeX when available; fall back to text
function MathFormula({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Try to render LaTeX when component mounts or latex prop changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let attempts = 0;
    const maxAttempts = 20;
    const tryRender = () => {
      if (window.katex) {
        try {
          window.katex.render(latex, el, { throwOnError: false });
        } catch {
          el.textContent = latex;
        }
        return true;
      }
      return false;
    };
    // Initial attempt
    if (tryRender()) return;

    const interval = setInterval(() => {
      attempts += 1;
      if (tryRender() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [latex]);
// Fallback content while waiting for KaTeX
  return (
    <span
      ref={ref}
      className="inline-block bg-white rounded px-3 py-2 text-black"
      aria-label="Math formula"
    >
      {latex}
    </span>
  );
}

// Sidebar progress list that shows completion per level and supports navigation
// ProgressMenu component in the sidebar keeps track of which levels are solved, and supports navigation to different levels when a level button is clicked.
// Sidebar progress list; shows which levels are solved, lets you jump to a level,
// and reveals a reset-all button once all 10 are completed.
function ProgressMenu({
  level,
  solvedLevels,
  currentSolved,
  onNavigate,
  onResetAll,
}: {
  level: number;
  solvedLevels: Set<number>;
  currentSolved: boolean;
  onNavigate: (lv: number) => void;
  onResetAll: () => void;
}) {
  const allCompleted = solvedLevels.size === 10;

  return (
    <div className="bg-white/80 border border-[#ff9e9e] rounded-xl p-4 shadow-sm w-[160px]">
      <p className="text-[#ff4040] font-semibold mb-3 text-center">Progress</p>
      <ul className="space-y-2">
        {/* Render level buttons 1 to 10 */}
        {Array.from({ length: 10 }, (_, idx) => {
          const lv = idx + 1;
          // Determine if the level is completed or active
          const completed = solvedLevels.has(lv) || (lv === level && currentSolved);
          // Check if this level is the currently active level
          const active = lv === level;
          return (
            <li key={lv}>
              {/* Level button */}
              <button
                type="button"
                onClick={() => onNavigate(lv)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                  active ? "bg-[#ffe8e8]" : "hover:bg-[#dbe8ff]"
                }`}
              >
                {/* Level label and completion status -- it shows a checkmark if completed */}
                <span className="text-sm text-[#333] text-left">Level {lv}</span>
                <span
                  className={`text-sm font-semibold ${
                    completed ? "text-[#1CAFBF]" : "text-[#bebebe]"
                  }`}
                >
                  {/* Completion status: checkmark if completed, dot if not */}
                  {completed ? "✓" : "•"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {/* Reset all button shown when all 10 levels are completed */}
      {allCompleted && (
        <button
          type="button"
          onClick={onResetAll}
          className="mt-4 w-full rounded-md bg-[#ff9e9e] px-3 py-2 text-sm font-semibold text-white hover:bg-[#ff7f7f] transition-colors"
        >
          Reset all
        </button>
      )}
    </div>
  );
}

// Arrow buttons used in the level selector
function ArrowButton({
  disabled,
  onClick,
  direction,
}: {
  disabled: boolean;
  onClick: () => void;
  direction: "left" | "right";
}) {
  const rectFill = disabled ? "#d9d9d9" : "#5377D1";
  const arrowFill = disabled ? "#f0f0f0" : "white";
// Render the arrow button with appropriate styles and SVG
  return (
    // Button element with click handler and disabled state
    // Adjusts appearance based on direction (left/right) and disabled state
    // Includes an SVG arrow icon
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous level" : "Next level"}
      className={`relative size-[60px] shrink-0 transition-opacity ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:opacity-90"
      } ${direction === "left" ? "rotate-[180deg] scale-y-[-100%]" : ""}`}
    >
      {/* Arrow icon */}
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 60 60"
      >
        {/* Arrow icon */}
        <g>
          <rect fill={rectFill} height="60" rx="6" width="60" />
          <path d={svgPaths.p3c899c00} fill={arrowFill} />
        </g>
      </svg>
    </button>
  );
}

// Level selector widget shown in the header with previous/next buttons and current level display
function Components({
  level,
  onPrev,
  onNext,
}: {
  level: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isFirstLevel = level === 1;
  const isLastLevel = level === 10;
// Render the level selector with previous/next buttons and current level display
  return (
    <div
      className="bg-[#e4ecff] content-stretch flex gap-[36px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0"
      data-name="Components"
    >
      {/* Previous level button is disabled when on First level */}
      <div className="flex items-center justify-center relative shrink-0">
        {/* Previous level button */}
        <ArrowButton
          disabled={isFirstLevel}
          onClick={onPrev}
          direction="left"
        />
      </div>
      {/* Current level display */}
      <div className="flex flex-col font-['Lexend',sans-serif] font-normal h-[38px] justify-center leading-[0] relative shrink-0 text-[#ff4040] text-[25px] w-[149px] text-center">
        <p className="leading-[normal]">Level {level}/10</p>
      </div>
      {/* Next level button is disabled when on Last level */}
      <ArrowButton disabled={isLastLevel} onClick={onNext} direction="right" />
    </div>
  );
}

// Page header with title "AffineAffinity" + level navigation with arrows and Level indicator.
function Heading({
  level,
  onPrev,
  onNext,
}: {
  level: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Render the header with title and level navigation including previous/next buttons and current level display
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="heading"
    >
      {/* Header with title and level navigation*/}
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[100px] items-center justify-center p-[20px] relative w-full">
          <p className="font-madimi h-[106px] leading-[normal] not-italic relative shrink-0 text-[#ff4040] text-[80px] w-[477px]">
            AffineAffinity
          </p>
          {/* Level navigation with previous/next buttons and current level display */}
          <Components level={level} onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    </div>
  );
}

// Tutorial text copy per level (intro, info, links, LaTeX, tasks)
// Intro is the first paragraph
// info is the second paragraph
// task is the action prompt at the end which is the problem the user needs to solve
// link is an optional link in the info paragraph
// extraLink is an optional second link in the info paragraph

// Tutorial text data for each level is an array that loops through levels 1 to 10 depending on the current level.
const tutorialTexts = [
  {
    intro:
      "Welcome to AffineAffinity, a game where you do affine transformations on images of Scotty by writing transformation matrices! This project is inspired by",
    link: {
      href: "https://en.wikipedia.org/wiki/Affine_transformation#Image_transformation",
      label: "Here's more information about transformation matrices.",
    },
    extraLink: {
      href: "https://flexboxfroggy.com/",
      label: "Flexbox Froggy",
    },
    info: "An affine transform multiplies homogeneous coordinates in [x, y, 1] by a 3x3 matrix to produce new coordinates—each column of the matrix controls how x, y, and translation combine to form the new position.",
    latex: "\\begin{aligned} &\\begin{bmatrix}x'\\\\y'\\\\1\\end{bmatrix} = M \\cdot \\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}\\\\[6pt] &\\text{where } M = \\begin{bmatrix}s & 0 & tx\\\\ 0 & s & ty\\\\ g & h & 1\\end{bmatrix}\\end{aligned}",
    action:
      "Start creating your own matrix to move Scotty to the right 20 and down 20 by changing the tx and ty values.",
  },
  {
    intro: "Let's try another practice.",
    info: "Remember, translation matrices shift positions without stretching or rotating.",
    action:
      "This time, change the tx and ty values to move Scotty up 30 and left 10.",
  },
  {
    intro:
      "Now you're getting the hang of it! This time we will scale Scotty to shrink or grow.",
    info: "The s variable controls scaling. Values greater than 1 to enlarge Scotty, and values between 0 and 1 to shrink him.",
    action: "Shrink Scotty down to half his size.",
  },
  {
    intro: "",
    info: "Keep adjusting the s variable to see how Scotty scales up and down.",
    action: "Grow Scotty to 2.5 times his original size.",
  },
  {
    intro: "Let's shear Scotty this time.",
    info: "Change the g variable to see how Scotty skews.",
    action: "Skew Scotty horizontally by 20.",
  },
  {
    intro: "Now we will do it again vertically.",
    info: "Change the h variable to see how Scotty skews this time.",
    action: "Skew Scotty vertically by 40.",
  },
  {
    intro: "Let's keep shearing Scotty, but this time combine both horizontal and vertical shears.",
    info: "Isolate one variable to understand how it behaves on its own.",
    action: "Skew Scotty horizontally by 25 and vertically by 10.",
  },
  {
    intro: "Lets combine all the variables we have learned so far.",
    info: "Remember how these transformations build on each other in the matrix:",
    bullets: [
      "Translation (tx, ty) shifts position.",
      "Scaling (s) resizes the image.",
      "Shearing (g, h) skews the image.",
    ],
    action: "Try to warp Scotty to match the image on top. HINT: All numbers are divisible by 5.",
  },
  {
    intro:" Great, do it again!",
    info: "Remember how these transformations build on each other in the matrix:",
    bullets: [
      "Translation (tx, ty) shifts position.",
      "Scaling (s) resizes the image.",
      "Shearing (g, h) skews the image.",
    ],
    action: "Try to warp Scotty to match the image on top. HINT: All numbers are divisible by 5.",
  },
  {
    intro: "Final challenge! This one's really hard, so don't worry if you don't get it immediately.",
    info: "Remember how these transformations build on each other in the matrix:",
    bullets: [
      "Translation (tx, ty) shifts position.",
      "Scaling (s) resizes the image.",
      "Shearing (g, h) skews the image.",
    ],
    action: "Try to warp Scotty to match the image on top. HINT: All numbers are divisible by 5.",
  },
];

// Lookup table for the win condition of each level
// Each level has specific target values for the transformation matrix variables. 
// When the sliders match these target values, the level is considered solved, which then enables the "next" button to proceed to the next level.
function getLevelTarget(level: number): LevelTarget | undefined {
  const targets: Record<number, LevelTarget> = {
    1: { tx: 20, ty: 20, nextLevel: 2 },
    2: { tx: -10, ty: -30, nextLevel: 3 },
    3: { s: 0.5, nextLevel: 4 },
    4: { s: 2.5, nextLevel: 5 },
    5: { g: 20, nextLevel: 6 },
    6: { h: 40, nextLevel: 7 },
    7: { g: 25, h: 10, nextLevel: 8 },
    8: { tx: 25, ty: 25, s: 1.0, g: 0, h: 15, nextLevel: 9 },
    9: { tx: -20, ty: 0, s: 2.0, g: 15, h: 0, nextLevel: 10 },
    10: { tx: -15, ty: 20, s: 1.5, g: -30, h: 20, nextLevel: 10 },
  };
  return targets[level];
}

// Compare current slider values to the target for this level.
// We check if the user correctly set the matrix values to match the target for the current level, so they can proceed to the next level.
function isLevelSolved(
  level: number,
  values: { tx: number; ty: number; s: number; g: number; h: number }
): boolean {
  const target = getLevelTarget(level);
  if (!target) return false;
  return (
    (target.tx === undefined || target.tx === values.tx) &&
    (target.ty === undefined || target.ty === values.ty) &&
    (target.s === undefined || target.s === values.s) &&
    (target.g === undefined || target.g === values.g) &&
    (target.h === undefined || target.h === values.h)
  );
}

// Tutorial text renderer for current level (includes links, bullets, LaTeX)
// Renders the tutorial text content for the current level, including optional links, bullet points, and LaTeX formulas.
// It dynamically adjusts the content based on the level the user is on, looping through tutorialTexts array.
function Tutorial({ level }: { level: number }) {
  const clampedIndex = Math.min(
    Math.max(level - 1, 0),
    tutorialTexts.length - 1
  );
  const tutorialText = tutorialTexts[clampedIndex];
// Render the tutorial text content for the current level
  return (
    <div className="box-border content-stretch flex gap-[110px] items-center justify-center px-[40px] py-0 relative w-full">
      <div className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[15px] text-black w-[869px]">
        <p className="mb-4">
          {/* Intro is the first paragraph */}
          {tutorialText.intro}{" "}
          {tutorialText.extraLink && (
            <a
              className="text-black underline hover:text-[#3f5fb1]"
              href={tutorialText.extraLink.href}
            >
              {tutorialText.extraLink.label}
            </a>
          )}
        </p>
        {/* Info is the second paragraph */}
        {tutorialText.info && (
          <p className="mb-4">
            <span>{tutorialText.info} </span>
            {tutorialText.link && (
              <a
                className="[text-underline-position:from-font] cursor-pointer decoration-solid underline text-black hover:text-[#3f5fb1]"
                href={tutorialText.link.href}
              >
                <span className="[text-underline-position:from-font] decoration-solid leading-[normal]">
                  {tutorialText.link.label}
                </span>
              </a>
            )}
          </p>
        )}
        {/* Bullets are optional bullet points */}
        {tutorialText.bullets && tutorialText.bullets.length > 0 && (
          <ul className="list-disc pl-6 space-y-2 mb-4">
            {tutorialText.bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        )}
        {/* LaTeX is an optional formula */}
        {tutorialText.latex && (
          <div className="mb-4">
            <MathFormula latex={tutorialText.latex} />
          </div>
        )}
        {/* Action is the final prompt problem that user solves to advance to the next level */}
        {tutorialText.action && <p className="mb-0">{tutorialText.action}</p>}
      </div>
    </div>
  );
}

// Displays the original Scotty image.
function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[14px] items-center justify-center overflow-clip pb-[30px] pt-[19px] px-[21px] relative rounded-[30px] shrink-0">
      <p className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] text-[30px] text-nowrap whitespace-pre">
        original image
      </p>
      <div
        className="relative shrink-0 size-[236px]"
        data-name="mascotStory_236x236 2"
      >
        <Image
          alt="Scotty"
          src={scottyImg}
          fill
          className="object-cover pointer-events-none"
          sizes="236px"
          priority
        />
      </div>
    </div>
  );
}

// Renders the matrix values based on current mode and slider values
// The MatrixGrid component displays the 3x3 transformation matrix with dynamic values based on the current mode (translate, scale, shear, all) and slider values (tx, ty, s, g, h).
// The grid changes mode based on the current level, highlighting relevant values in different colors.
// The value in the slider is reflected in this matrix as the user interacts.
function MatrixGrid({
  mode,
  tx,
  ty,
  s,
  g,
  h,
  showG,
  showH,
  forceGColor = false,
  forceHColor = false,
}: {
  // Transformation modes: depending on the level, different transformations are highlighted to reflect learning goals.
  mode: "translate" | "scale" | "shear" | "all";
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
  showG: boolean;
  showH: boolean;
  forceGColor?: boolean;
  forceHColor?: boolean;
}) {
  const isScale = mode === "scale";
  const isShear = mode === "shear";
  const isAll = mode === "all";
  const effectiveG = showG ? g : 0;
  const effectiveH = showH ? h : 0;
// Render the 3x3 transformation matrix grid with dynamic values and colors based on the current mode and slider values
  return (
    <div className="[grid-area:2_/_2] bg-white font-['Lexend',sans-serif] font-normal gap-[10px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] leading-[0] overflow-clip relative shrink-0 size-[144px] text-[25px] text-center">
      <div className="[grid-area:1_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p className={`leading-[normal] ${isScale || isAll ? "text-[#1CAFBF]" : ""}`}>
          {isScale || isAll ? s.toFixed(1) : 1}
        </p>
      </div>
      <div className="[grid-area:1_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:1_/_3] flex flex-col justify-center relative shrink-0 text-[#6ca512]">
        <p className={`leading-[normal] ${isScale || isShear && !isAll ? "text-black" : ""}`}>
          {isScale || (isShear && !isAll) ? 0 : tx}
        </p>
      </div>
      <div className="[grid-area:2_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:2_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p className={`leading-[normal] ${isScale || isAll ? "text-[#1CAFBF]" : ""}`}>
          {isScale || isAll ? s.toFixed(1) : 1}
        </p>
      </div>
      <div className="[grid-area:2_/_3] flex flex-col justify-center relative shrink-0 text-[#8000af]">
        <p className={`leading-[normal] ${isScale || isShear && !isAll ? "text-black" : ""}`}>
          {isScale || (isShear && !isAll) ? 0 : ty}
        </p>
      </div>
      <div className="[grid-area:3_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p
          className={`leading-[normal] ${
            isShear || isAll
              ? forceGColor || effectiveG !== 0
                ? "text-[#FF9D00]"
                : "text-black"
              : ""
          }`}
        >
          {isShear || isAll ? effectiveG : 0}
        </p>
      </div>
      <div className="[grid-area:3_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p
          className={`leading-[normal] ${
            isShear || isAll
              ? forceHColor || effectiveH !== 0
                ? "text-[#EC2DA0]"
                : "text-black"
              : ""
          }`}
        >
          {isShear || isAll ? effectiveH : 0}
        </p>
      </div>
      <div className="[grid-area:3_/_3] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

// Matrix card with brackets and grid inside.
// This is the container for the matrix display, including the brackets and the MatrixGrid component inside.
// this container takes in the current level and all slider values to determine how to render the matrix.
function Frame1({
  level,
  tx,
  ty,
  s,
  g,
  h,
}: {
  level: number;
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
}) {
  const mode =
    level === 3 || level === 4
      ? "scale"
      : level === 5 || level === 6 || level === 7
        ? "shear"
        : level >= 8
          ? "all"
          : "translate";
  const showG = level === 5 || level === 7 || level >= 8;
  const showH = level === 6 || level === 7 || level >= 8;

  return (
    <div className="bg-white box-border gap-[50px] grid items-center justify-items-center grid-cols-[32px_minmax(0,_1fr)_32px] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[273px] overflow-clip pb-[100px] pt-[30px] px-[30px] relative rounded-[30px] shrink-0 w-[310px]">
      <div
        className="[grid-area:2_/_1] h-[142px] relative shrink-0 w-[32px]"
        data-name="Vector"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 32 142"
        >
          <g id="Vector">
            <path d="M0 0H32V13H0V0Z" fill="var(--fill-0, black)" />
            <path d="M0 129H32V142H0V129Z" fill="var(--fill-0, black)" />
            <path d="M0 142V0H13V142H0Z" fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <p className="[grid-area:1_/_1_/_auto_/_span_3] font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] self-start text-[30px] text-center">
        matrix
      </p>
      <div className="[grid-area:2_/_3] flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[142px] relative w-[32px]" data-name="Vector">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 32 142"
            >
              <g id="Vector">
                <path d="M0 0H32V13H0V0Z" fill="var(--fill-0, black)" />
                <path d="M0 129H32V142H0V129Z" fill="var(--fill-0, black)" />
                <path d="M0 142V0H13V142H0Z" fill="var(--fill-0, black)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="[grid-area:2_/_2] w-[144px] justify-self-center">
        <MatrixGrid
          mode={mode}
          tx={tx}
          ty={ty}
          s={s}
          g={g}
          h={h}
          showG={showG}
          showH={showH}
          forceGColor={level === 5 || level >= 7}
          forceHColor={level === 6 || level >= 7}
        />
      </div>
    </div>
  );
}

// tx slider (green) with drag handling
function Group3({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  // Handles mouse down event to start dragging the slider
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    // Update the slider value based on mouse position
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100 - 50);
      onChange(newValue);
    };
    // Handle mouse move event to update slider value while dragging
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };
    // Handle mouse up event to stop dragging the slider
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // Initial update on mouse down
    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate position: value ranges from -50 to 50, map to 0-229px
  const position = ((value + 50) / 100) * 229;
  // Width of the filled portion of the slider bar
  const barWidth = position;

  // Render the slider component with drag handling
  return (
    <div
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 229 11"
      >
        <g id="Group 4">
          <rect
            fill="var(--fill-0, #D9D9D9)"
            height="11"
            id="Rectangle 57"
            rx="5.5"
            width="229"
          />
          <rect
            fill="var(--fill-0, #A2E538)"
            height="11"
            id="Rectangle 58"
            rx="5.5"
            width={barWidth}
          />
          <circle
            cx={position}
            cy="5.5"
            fill="var(--fill-0, #6CA512)"
            id="Ellipse 280"
            r="5.5"
          />
        </g>
      </svg>
    </div>
  );
}

// ty slider (purple) with drag handling
function Group2({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  // Handles mouse down event to start dragging the slider and updating value for variable ty
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handles mouse down event to start dragging the slider
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    // Update the slider value based on mouse position
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100 - 50);
      onChange(newValue);
    };
    // Handle mouse move event to update slider value while dragging
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };
    // Handle mouse up event to stop dragging the slider
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // Initial update on mouse down
    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate position: value ranges from -50 to 50, map to 0-229px
  const position = ((value + 50) / 100) * 229;
  const barWidth = position;
  // Render the slider component with drag handling
  return (
    <div
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 229 11"
      >
        <g id="Group 3">
          <rect
            fill="var(--fill-0, #D9D9D9)"
            height="11"
            id="Rectangle 55"
            rx="5.5"
            width="229"
          />
          <rect
            fill="var(--fill-0, #DA73FF)"
            height="11"
            id="Rectangle 56"
            rx="5.5"
            width={barWidth}
          />
          <circle
            cx={position}
            cy="5.5"
            fill="var(--fill-0, #8000AF)"
            id="Ellipse 279"
            r="5.5"
          />
        </g>
      </svg>
    </div>
  );
}

// s (scale) slider (teal/blue) clamped to 0.0–3.0
function ScaleSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  // Handles mouse down event to start dragging the slider and updating value for variable s
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    // Update the slider value based on mouse position
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      const newValue = Math.round(ratio * 30) / 10; // 0.0 - 3.0
      onChange(newValue);
    };

    // Handle mouse move event to update slider value while dragging
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };

    // Handle mouse up event to stop dragging the slider
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Initial update on mouse down
    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Clamp value between 0 and 3 for position calculation
  const clamped = Math.max(0, Math.min(value, 3));
  const position = (clamped / 3) * 229;
  const barWidth = position;
  // Render the slider component with drag handling
  return (
    <div
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 229 11"
      >
        <g id="ScaleSlider">
          <rect
            fill="var(--fill-0, #D9D9D9)"
            height="11"
            rx="5.5"
            width="229"
          />
          <rect
            fill="var(--fill-0, #00E6FF)"
            height="11"
            rx="5.5"
            width={barWidth}
          />
          <circle cx={position} cy="5.5" fill="var(--fill-0, #1CAFBF)" r="5.5" />
        </g>
      </svg>
    </div>
  );
}

// g/h shear slider (-50 to 50)
function ShearSlider({
  value,
  onChange,
  barColor,
  thumbColor,
}: {
  value: number;
  onChange: (value: number) => void;
  barColor: string;
  thumbColor: string;
}) {
  // Handles mouse down event to start dragging the slider and updating value for shear variables g or h
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    // Update the slider value based on mouse position
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100 - 50);
      onChange(newValue);
    };
    // Handle mouse move event to update slider value while dragging
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };
    // Handle mouse up event to stop dragging the slider
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // Initial update on mouse down
    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  // Calculate position: value ranges from -50 to 50, map to 0-229px
  const position = ((value + 50) / 100) * 229;
  const barWidth = position;
  // Render the slider component with drag handling
  return (
    <div
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 229 11"
      >
        <g id="ShearSlider">
          <rect fill="var(--fill-0, #D9D9D9)" height="11" rx="5.5" width="229" />
          <rect fill={barColor} height="11" rx="5.5" width={barWidth} />
          <circle cx={position} cy="5.5" fill={thumbColor} r="5.5" />
        </g>
      </svg>
    </div>
  );
}

// Variables card: shows controls based on level mode and a reset button
function Frame3({
  level,
  tx,
  ty,
  s,
  g,
  h,
  onTxChange,
  onTyChange,
  onSChange,
  onGChange,
  onHChange,
  onReset,
}: {
  level: number;
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
  onTxChange: (value: number) => void;
  onTyChange: (value: number) => void;
  onSChange: (value: number) => void;
  onGChange: (value: number) => void;
  onHChange: (value: number) => void;
  onReset: () => void;
}) {
  // Determine which controls to show based on the current level
  const isScaleLevel = level === 3 || level === 4;
  const isShearLevel = level === 5 || level === 6 || level === 7;
  const isGOnly = level === 5;
  const isHOnly = level === 6;
  const isAllLevel = level >= 8;
  // Render the variables card with appropriate controls and reset button based on the current level
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip p-[30px] relative rounded-[30px] shrink-0">
      <p className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] text-[30px] text-nowrap whitespace-pre">
        variables
      </p>
      {/* Checks if the level is for scale variables and renders scale controls */}
      {isScaleLevel ? (
        <>
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#1CAFBF] text-[40px] text-nowrap whitespace-pre">
            s = {s.toFixed(1)}
          </p>
          <ScaleSlider value={s} onChange={onSChange} />
        </>
        // Checks if the level is for shear variables and renders shear controls
      ) : isShearLevel ? (
        <>
        {/* Checks if the level is for h variable only */}
          {!isHOnly && (
            <>
              <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#FF9D00] text-[40px] text-nowrap whitespace-pre">
                g = {g}
              </p>
              <ShearSlider value={g} onChange={onGChange} barColor="#FFD898" thumbColor="#FF9D00" />
            </>
          )}
          {/* Checks if the level is for g variable only */}
          {!isGOnly && (
            <>
              <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#EC2DA0] text-[40px] text-nowrap whitespace-pre">
                h = {h}
              </p>
              <ShearSlider value={h} onChange={onHChange} barColor="#FF98D6" thumbColor="#EC2DA0" />
            </>
          )}
        </>
      ) : isAllLevel ? (
        // Checks for if the level renders all variable controls for levels that involve all transformations
        <>
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#6ca512] text-[25px] text-nowrap whitespace-pre">
            tx = {tx}
          </p>
          <Group3 value={tx} onChange={onTxChange} />
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8000af] text-[25px] text-nowrap whitespace-pre">
            ty = {ty}
          </p>
          <Group2 value={ty} onChange={onTyChange} />
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#1CAFBF] text-[25px] text-nowrap whitespace-pre">
            s = {s.toFixed(1)}
          </p>
          <ScaleSlider value={s} onChange={onSChange} />
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#FF9D00] text-[25px] text-nowrap whitespace-pre">
            g = {g}
          </p>
          <ShearSlider value={g} onChange={onGChange} barColor="#FFD898" thumbColor="#FF9D00" />
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#EC2DA0] text-[25px] text-nowrap whitespace-pre">
            h = {h}
          </p>
          <ShearSlider value={h} onChange={onHChange} barColor="#FF98D6" thumbColor="#EC2DA0" />
        </>
      ) : (
        <>
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#6ca512] text-[30px] text-nowrap whitespace-pre">
            tx = {tx}
          </p>
          <Group3 value={tx} onChange={onTxChange} />
          <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8000af] text-[30px] text-nowrap whitespace-pre">
            ty = {ty}
          </p>
          <Group2 value={ty} onChange={onTyChange} />
        </>
      )}
      {/* Button resets the slider values back to default to the level */}
      <button
        type="button"
        onClick={onReset}
        className="mt-2 px-4 py-2 rounded-lg bg-[#e4ecff] text-[#5377d1] text-sm font-semibold hover:bg-[#d6e2ff] transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

// Main question div for a level -- contains cards for original image, matrix, and variables
function Question({
  level,
  tx,
  ty,
  s,
  g,
  h,
  onTxChange,
  onTyChange,
  onSChange,
  onGChange,
  onHChange,
  onReset,
}: {
  level: number;
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
  onTxChange: (value: number) => void;
  onTyChange: (value: number) => void;
  onSChange: (value: number) => void;
  onGChange: (value: number) => void;
  onHChange: (value: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="box-border content-stretch flex gap-[30px] items-center justify-center px-[40px] py-[30px] relative w-full">
      <Frame />
      <Frame1 level={level} tx={tx} ty={ty} s={s} g={g} h={h} />
      <Frame3
        level={level}
        tx={tx}
        ty={ty}
        s={s}
        g={g}
        h={h}
        onTxChange={onTxChange}
        onTyChange={onTyChange}
        onSChange={onSChange}
        onGChange={onGChange}
        onHChange={onHChange}
        onReset={onReset}
      />
    </div>
  );
}

// Wraps heading, tutorial, and question for the left column
function Problem({
  level,
  onPrevLevel,
  onNextLevel,
  tx,
  ty,
  s,
  g,
  h,
  onTxChange,
  onTyChange,
  onSChange,
  onGChange,
  onHChange,
  onReset,
}: {
  level: number;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
  onTxChange: (value: number) => void;
  onTyChange: (value: number) => void;
  onSChange: (value: number) => void;
  onGChange: (value: number) => void;
  onHChange: (value: number) => void;
  onReset: () => void;
}) {
  return (
    <div
      className="content-stretch flex flex-col relative shrink-0"
      data-name="problem"
    >
      <Heading level={level} onPrev={onPrevLevel} onNext={onNextLevel} />
      <Tutorial level={level} />
      <Question
        level={level}
        tx={tx}
        ty={ty}
        s={s}
        g={g}
        h={h}
        onTxChange={onTxChange}
        onTyChange={onTyChange}
        onSChange={onSChange}
        onGChange={onGChange}
        onHChange={onHChange}
        onReset={onReset}
      />
    </div>
  );
}
// Spacer frame to add vertical space at the bottom of the left column
function Frame5() {
  return <div className="h-[70px] shrink-0" />;
}

// Spacer frame to add vertical space at the bottom of the left column
function Frame4({
  level,
  tx,
  ty,
  s,
  g,
  h,
}: {
  level: number;
  tx: number;
  ty: number;
  s: number;
  g: number;
  h: number;
}) {
  const target = getLevelTarget(level);
  const solved = isLevelSolved(level, { tx, ty, s, g, h });
  const gateLevel = target !== undefined;
  // Determine if the current level is the final level
  const isFinalLevel = level === 10;
  // Set button background and text colors based on whether the level is solved and if it's the final level.
  // When complete, this button either shows "next" or "congrats!" if it is the last level.
  const bg = solved ? (isFinalLevel ? "#5377D1" : "#FF4040") : "#ca6262";
  // Text color is white if solved, gray if not solved yet
  const textColor = solved ? "#ffffff" : "#bebebe";
  // Button text changes based on whether the level is solved and if it's the final level.
  const buttonText = isFinalLevel && solved ? "congrats!" : "next";
 // Handle button click to navigate to the next level if solved and not the final level. If not solved, the button is disabled.
  const handleClick = () => {
    if (solved && target && !isFinalLevel) {
      window.location.href = `/level/${target.nextLevel}`;
    }
  };
  // Render the next/congrats button with appropriate styles and click handling
  return (
    <button
      type="button"
      onClick={handleClick}
      className="box-border content-stretch flex gap-[10px] h-[51px] items-center justify-center align-center overflow-clip px-[41px] py-px relative rounded-[15px] shrink-0 transition-colors mx-auto"
      style={{ backgroundColor: bg }}
      disabled={(gateLevel && !solved) || isFinalLevel}
    >
      <p
        className="font-['Lexend',sans-serif] font-normal h-[40px] leading-[normal] relative shrink-0 text-[25px] text-center w-[120px]"
        style={{ color: textColor }}
      >
        {buttonText}
      </p>
    </button>
  );
}

// Goal/answer column with target and live images plus gating button
// This component displays the goal image with the target transformation and the live image with the current transformation.
function Answer({ level, tx, ty, s, g, h }: { level: number; tx: number; ty: number; s: number; g: number; h: number }) {
  const goalTargets: Record<number, { offset: { x: number; y: number }; scale: number; shear: { x: number; y: number } }> = {
    1: { offset: { x: 20, y: 20 }, scale: 1, shear: { x: 0, y: 0 } },
    2: { offset: { x: -10, y: -30 }, scale: 1, shear: { x: 0, y: 0 } },
    3: { offset: { x: 0, y: 0 }, scale: 0.5, shear: { x: 0, y: 0 } },
    4: { offset: { x: 0, y: 0 }, scale: 2.5, shear: { x: 0, y: 0 } },
    5: { offset: { x: 0, y: 0 }, scale: 1, shear: { x: 20, y: 0 } },
    6: { offset: { x: 0, y: 0 }, scale: 1, shear: { x: 0, y: 40 } },
    7: { offset: { x: 0, y: 0 }, scale: 1, shear: { x: 25, y: 10 } },
    8: { offset: { x: 25, y: 25 }, scale: 1, shear: { x: 0, y: 15 } },
    9: { offset: { x: -20, y: 0 }, scale: 2.0, shear: { x: 15, y: 0 } },
    10: { offset: { x: -15, y: 20 }, scale: 1.5, shear: { x: -30, y: 20 } },
  };

  const goal = goalTargets[level] ?? { offset: { x: 0, y: 0 }, scale: 1, shear: { x: 0, y: 0 } };
  const goalTransform = `translate(${goal.offset.x}px, ${goal.offset.y}px) skew(${goal.shear.x}deg, ${goal.shear.y}deg) scale(${goal.scale})`;
  const shearX = level >= 5 ? g : 0;
  const shearY = level >= 5 ? h : 0;
  const liveTransform = `translate(${tx}px, ${ty}px) skew(${shearX}deg, ${shearY}deg) scale(${s})`;

  // Render the answer column with goal and live images along with the next/congrats button
  return (
    <div
      className="bg-[#ff9e9e] box-border align-center justify-center content-stretch flex flex-col gap-[20px] items-center overflow-clip px-[70px] py-[20px] h-screen relative shrink-0"
      data-name="answer"
    >
      <p className="font-['Lexend',sans-serif] font-normal h-[100px] leading-[normal] relative shrink-0 text-[50px] text-white text-center w-[227px]">
        Goal
      </p>
      <div
        className="relative shrink-0 size-[236px]"
        data-name="mascotStory_236x236 3"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute bg-black inset-0" />
          <div className="absolute inset-0 overflow-hidden">
            <Image
              alt="Scotty goal"
              src={scottyImg}
              fill
              className="object-contain"
              sizes="236px"
              style={{ transform: goalTransform }}
            />
          </div>
        </div>
      </div>
      <Frame5 />
      {/* Spacer frame to add vertical space at the bottom of the left column */}
      <div className="relative shrink-0 size-[236px] overflow-hidden bg-black">
        {/* Image of transformed Scotty */}
        <Image
          alt="Scotty transformed"
          src={scottyImg}
          fill
          className="object-contain pointer-events-none transition-transform duration-150"
          style={{ transform: liveTransform }}
          sizes="236px"
        />
      </div>
      <Frame4 level={level} tx={tx} ty={ty} s={s} g={g} h={h} />
    </div>
  );
}

// Root page component: handles routing, persistence, solved tracking, and layout
// Key for storing per-level slider values in localStorage
// Used to persist slider values for each level in localStorage
// This allows users to retain their progress on each level even after refreshing or navigating away.
// The values are stored as a JSON object with level numbers as keys and slider values as values.
// Example structure: { "1": { tx: 10, ty: -20, s: 1.5, g: 0, h: 0 }, "2": { ... }, ... }
// This key is used to retrieve and store the slider values for each level.
// It helps in providing a seamless user experience by maintaining the state of the sliders across sessions.
export default function Main({ level }: { level: number }) {
  const router = useRouter();
  const defaults = getDefaultValues();
  const [tx, setTx] = useState(defaults.tx);
  const [ty, setTy] = useState(defaults.ty);
  const [s, setS] = useState(defaults.s);
  const [g, setG] = useState(defaults.g);
  const [h, setH] = useState(defaults.h);
  const [solvedLevels, setSolvedLevels] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate solved levels and per-level slider values from localStorage when the page loads
  useEffect(() => {
    if (typeof window === "undefined") return;

    // load solved levels once (kept across pages)
    const stored = window.localStorage.getItem("affineAffinitySolved");
    if (stored) {
      try {
        const parsed: number[] = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSolvedLevels(new Set(parsed));
        // This means we are updating the state of solvedLevels within a useEffect hook.
        // We parse the stored JSON string to get an array of solved level numbers,
        // then convert that array into a Set for efficient lookup and state management.
      } catch {
        // enqueue empty on failure
        setSolvedLevels(new Set());
      }
    }

    // load slider values for this level
    const defaults = getDefaultValues();
    const storedValues = window.localStorage.getItem(STORAGE_VALUES_KEY);
    let saved = defaults;
    // Try to parse stored slider values for the current level
    if (storedValues) {
      try {
        const parsed: Record<string, { tx: number; ty: number; s: number; g: number; h: number }> =
          JSON.parse(storedValues);
        saved = parsed[String(level)] ?? defaults;
      } catch {
        saved = defaults;
      }
    }
    setTx(saved.tx);
    setTy(saved.ty);
    setS(saved.s);
    setG(saved.g);
    setH(saved.h);

    setHydrated(true);
  }, [level]);

  // Persist solved levels whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    window.localStorage.setItem("affineAffinitySolved", JSON.stringify(Array.from(solvedLevels)));
  }, [hydrated, solvedLevels]);

  // Persist current slider values for this level whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    const raw = window.localStorage.getItem(STORAGE_VALUES_KEY);
    let parsed: Record<string, { tx: number; ty: number; s: number; g: number; h: number }> = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }
    }
    parsed[String(level)] = { tx, ty, s, g, h };
    window.localStorage.setItem(STORAGE_VALUES_KEY, JSON.stringify(parsed));
  }, [hydrated, level, tx, ty, s, g, h]);

  // Mark the current level as solved once the values match the target
  useEffect(() => {
    const solved = isLevelSolved(level, { tx, ty, s, g, h });
    if (solved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSolvedLevels((prev) => {
        if (prev.has(level)) return prev;
        const next = new Set(prev);
        next.add(level);
        return next;
      });
    }
  }, [level, tx, ty, s, g, h]);
  const handlePrevLevel = () => {
    if (level > 1) {
      router.push(`/level/${level - 1}`);
    }
  };
  // Navigate to the next level if it exists
  const handleNextLevel = () => {
    if (level < 10) {
      router.push(`/level/${level + 1}`);
    }
  };
  // Reset sliders to default values for the current level
  const handleReset = () => {
    const defaults = getDefaultValues();
    setTx(defaults.tx);
    setTy(defaults.ty);
    setS(defaults.s);
    setG(defaults.g);
    setH(defaults.h);
  };
  // Render the main application layout with problem and answer sections
  return (
    <div
      className="bg-[#ffd3d3] content-stretch flex items-center gap-12 relative size-full justify-center"
      data-name="MAIN"
    >
      <Problem
        level={level}
        onPrevLevel={handlePrevLevel}
        onNextLevel={handleNextLevel}
        tx={tx}
        ty={ty}
        s={s}
        g={g}
        h={h}
        onTxChange={setTx}
        onTyChange={setTy}
        onSChange={setS}
        onGChange={setG}
        onHChange={setH}
        onReset={handleReset}
      />
      <div className="flex items-center gap-6">
        <Answer level={level} tx={tx} ty={ty} s={s} g={g} h={h} />
        <ProgressMenu
          level={level}
          solvedLevels={solvedLevels}
          currentSolved={isLevelSolved(level, { tx, ty, s, g, h })}
          onNavigate={(lv) => router.push(`/level/${lv}`)}
          onResetAll={() => {
            window.localStorage.removeItem("affineAffinitySolved");
            window.localStorage.removeItem(STORAGE_VALUES_KEY);
            setSolvedLevels(new Set());
            handleReset();
          }}
        />
      </div>
    </div>
  );
}
