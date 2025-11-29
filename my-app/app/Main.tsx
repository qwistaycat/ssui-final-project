"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import svgPaths from "./svg-rgf6n3wvt2";
import scottyImg from "./assets/images/scotty.png";

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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous level" : "Next level"}
      className={`relative size-[60px] shrink-0 transition-opacity ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"
      } ${direction === "left" ? "rotate-[180deg] scale-y-[-100%]" : ""}`}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g>
          <rect fill={rectFill} height="60" rx="6" width="60" />
          <path d={svgPaths.p3c899c00} fill={arrowFill} />
        </g>
      </svg>
    </button>
  );
}

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

  return (
    <div className="bg-[#e4ecff] content-stretch flex gap-[36px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0" data-name="Components">
      <div className="flex items-center justify-center relative shrink-0">
        <ArrowButton disabled={isFirstLevel} onClick={onPrev} direction="left" />
      </div>
      <div className="flex flex-col font-['Lexend',sans-serif] font-normal h-[38px] justify-center leading-[0] relative shrink-0 text-[#ff4040] text-[25px] w-[149px] text-center">
        <p className="leading-[normal]">Level {level}/10</p>
      </div>
      <ArrowButton disabled={isLastLevel} onClick={onNext} direction="right" />
    </div>
  );
}

function Heading({
  level,
  onPrev,
  onNext,
}: {
  level: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="heading">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[100px] items-center justify-center p-[20px] relative w-full">
          <p className="font-madimi h-[106px] leading-[normal] not-italic relative shrink-0 text-[#ff4040] text-[80px] w-[477px]">AffineAffinity</p>
          <Components level={level} onPrev={onPrev} onNext={onNext} />
        </div>
      </div>
    </div>
  );
}

function Tutorial() {
  return (
        <div className="box-border content-stretch flex gap-[110px] items-center justify-center px-[40px] py-0 relative w-full">
          <div className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[25px] text-black w-[869px]">
            <p className="mb-0">{`Welcome to AffineAffinity, a game where you do affine transformations on images of Scotty by writing transformation matrices! `}</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">
              <span>{`Transformation matrices warp images by changing their pixel indices. `}</span>
              <a className="[text-underline-position:from-font] cursor-pointer decoration-solid underline" href="https://en.wikipedia.org/wiki/Affine_transformation">
                <span className="[text-underline-position:from-font] decoration-solid leading-[normal]" href="https://en.wikipedia.org/wiki/Affine_transformation">
                  Here's more information about transformation matrices.
                </span>
              </a>
            </p>
            <p className="mb-0">&nbsp;</p>
            <p>Start creating your own matrix to move Scotty to the right 20 and down 20 by changing the tx and ty values.</p>
          </div>
        </div>
  );
}

function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[14px] items-center justify-center overflow-clip pb-[30px] pt-[19px] px-[21px] relative rounded-[30px] shrink-0">
      <p className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] text-[30px] text-nowrap whitespace-pre">original image</p>
      <div className="relative shrink-0 size-[236px]" data-name="mascotStory_236x236 2">
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

function MatrixGrid({ tx, ty }: { tx: number; ty: number }) {
  return (
    <div className="[grid-area:2_/_2] bg-white font-['Lexend',sans-serif] font-normal gap-[10px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] leading-[0] overflow-clip relative shrink-0 size-[144px] text-[25px] text-center">
      <div className="[grid-area:1_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">1</p>
      </div>
      <div className="[grid-area:1_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:1_/_3] flex flex-col justify-center relative shrink-0 text-[#6ca512]">
        <p className="leading-[normal]">{tx}</p>
      </div>
      <div className="[grid-area:2_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:2_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">1</p>
      </div>
      <div className="[grid-area:2_/_3] flex flex-col justify-center relative shrink-0 text-[#8000af]">
        <p className="leading-[normal]">{ty}</p>
      </div>
      <div className="[grid-area:3_/_1] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:3_/_2] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="[grid-area:3_/_3] flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame1({ tx, ty }: { tx: number; ty: number }) {
  return (
    <div className="bg-white box-border gap-[50px] grid items-center justify-items-center grid-cols-[32px_minmax(0,_1fr)_32px] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[273px] overflow-clip pb-[100px] pt-[30px] px-[30px] relative rounded-[30px] shrink-0 w-[310px]">
      <div className="[grid-area:2_/_1] h-[142px] relative shrink-0 w-[32px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 142">
          <g id="Vector">
            <path d="M0 0H32V13H0V0Z" fill="var(--fill-0, black)" />
            <path d="M0 129H32V142H0V129Z" fill="var(--fill-0, black)" />
            <path d="M0 142V0H13V142H0Z" fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <p className="[grid-area:1_/_1_/_auto_/_span_3] font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] self-start text-[30px] text-center">matrix</p>
      <div className="[grid-area:2_/_3] flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[142px] relative w-[32px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 142">
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
        <MatrixGrid tx={tx} ty={ty} />
      </div>
    </div>
  );
}

function Group3({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100 - 50);
      onChange(newValue);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate position: value ranges from -50 to 50, map to 0-229px
  const position = ((value + 50) / 100) * 229;
  const barWidth = position;

  return (
    <div 
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 229 11">
        <g id="Group 4">
          <rect fill="var(--fill-0, #D9D9D9)" height="11" id="Rectangle 57" rx="5.5" width="229" />
          <rect fill="var(--fill-0, #A2E538)" height="11" id="Rectangle 58" rx="5.5" width={barWidth} />
          <circle cx={position} cy="5.5" fill="var(--fill-0, #6CA512)" id="Ellipse 280" r="5.5" />
        </g>
      </svg>
    </div>
  );
}

function Group2({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    
    const updateValue = (clientX: number) => {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100 - 50);
      onChange(newValue);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    updateValue(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate position: value ranges from -50 to 50, map to 0-229px
  const position = ((value + 50) / 100) * 229;
  const barWidth = position;

  return (
    <div 
      className="h-[11px] relative shrink-0 w-[229px] cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 229 11">
        <g id="Group 3">
          <rect fill="var(--fill-0, #D9D9D9)" height="11" id="Rectangle 55" rx="5.5" width="229" />
          <rect fill="var(--fill-0, #DA73FF)" height="11" id="Rectangle 56" rx="5.5" width={barWidth} />
          <circle cx={position} cy="5.5" fill="var(--fill-0, #8000AF)" id="Ellipse 279" r="5.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame3({ tx, ty, onTxChange, onTyChange }: { tx: number; ty: number; onTxChange: (value: number) => void; onTyChange: (value: number) => void }) {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[17px] items-center justify-center overflow-clip p-[30px] relative rounded-[30px] shrink-0">
      <p className="font-['Lexend',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5377d1] text-[30px] text-nowrap whitespace-pre">variables</p>
      <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#6ca512] text-[40px] text-nowrap whitespace-pre">tx = {tx}</p>
      <Group3 value={tx} onChange={onTxChange} />
      <p className="font-['Lexend',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8000af] text-[40px] text-nowrap whitespace-pre">ty = {ty}</p>
      <Group2 value={ty} onChange={onTyChange} />
    </div>
  );
}

function Question({ tx, ty, onTxChange, onTyChange }: { tx: number; ty: number; onTxChange: (value: number) => void; onTyChange: (value: number) => void }) {
  return (
        <div className="box-border content-stretch flex gap-[32px] items-center justify-center px-[40px] py-[35px] relative w-full">
          <Frame />
          <Frame1 tx={tx} ty={ty} />
          <Frame3 tx={tx} ty={ty} onTxChange={onTxChange} onTyChange={onTyChange} />
        </div>
  );
}

function Problem({
  level,
  onPrevLevel,
  onNextLevel,
  tx,
  ty,
  onTxChange,
  onTyChange,
}: {
  level: number;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  tx: number;
  ty: number;
  onTxChange: (value: number) => void;
  onTyChange: (value: number) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1005px]" data-name="problem">
      <Heading level={level} onPrev={onPrevLevel} onNext={onNextLevel} />
      <Tutorial />
      <Question tx={tx} ty={ty} onTxChange={onTxChange} onTyChange={onTyChange} />
    </div>
  );
}

function Frame5() {
  return <div className="h-[70px] shrink-0" />;
}

function Frame4() {
  return (
    <div className="bg-[#ca6262] box-border content-stretch flex gap-[10px] h-[51px] items-center justify-center overflow-clip px-[41px] py-px relative rounded-[15px] shrink-0">
      <p className="font-['Lexend',sans-serif] font-normal h-[40px] leading-[normal] relative shrink-0 text-[#bebebe] text-[30px] text-center w-[85px]">next</p>
    </div>
  );
}

function Answer() {
  return (
    <div className="bg-[#ff9e9e] box-border content-stretch flex flex-col gap-[40px] items-center overflow-clip px-[70px] py-[20px] relative shrink-0" data-name="answer">
      <p className="font-['Lexend',sans-serif] font-normal h-[100px] leading-[normal] relative shrink-0 text-[100px] text-white w-[227px]">Goal</p>
      <div className="relative shrink-0 size-[236px]" data-name="mascotStory_236x236 3">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-black inset-0" />
          <div className="absolute inset-0 overflow-hidden">
            <Image alt="Scotty goal" src={scottyImg} fill className="object-contain" sizes="236px" />
          </div>
        </div>
      </div>
      <Frame5 />
      <div className="relative shrink-0 size-[236px]" data-name="mascotStory_236x236 2">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-black inset-0" />
          <div className="absolute inset-0 overflow-hidden">
            <Image alt="Scotty transformed" src={scottyImg} fill className="object-contain" sizes="236px" />
          </div>
        </div>
      </div>
      <Frame4 />
    </div>
  );
}

export default function Main({ level }: { level: number }) {
  const router = useRouter();
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const handlePrevLevel = () => {
    if (level > 1) {
      router.push(`/level/${level - 1}`);
    }
  };

  const handleNextLevel = () => {
    if (level < 10) {
      router.push(`/level/${level + 1}`);
    }
  };

  return (
    <div className="bg-[#ffd3d3] content-stretch flex items-center relative size-full justify-space-between" data-name="MAIN">
      <Problem
        level={level}
        onPrevLevel={handlePrevLevel}
        onNextLevel={handleNextLevel}
        tx={tx}
        ty={ty}
        onTxChange={setTx}
        onTyChange={setTy}
      />
      <Answer />
    </div>
  );
}
