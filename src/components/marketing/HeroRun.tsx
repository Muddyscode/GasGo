"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const PH_TOWER_SRC = "/brand/ph-tower.webp";

/**
 * Living Port Harcourt “gas world” — Garden City streets, plant tanks,
 * PH Tower twin-peak crown, GRA bungalow. Not Lagos landmarks.
 */
export function HeroRun({ className }: { className?: string }) {
  const clipId = `ph-tower-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={cn("hero-run relative min-h-[14.5rem] overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <Clouds />
        <Sun />
        <Hills />
        <Creek />
        <Plant />
        <GraHouse />
        <PhTower clipId={clipId} />
        <ShopBlock />
        <Trees />
        <Road />
        <Keke />
        <GasGoRun />
        <ForegroundCylinders />
        <JamHaze />
      </svg>
    </div>
  );
}

function Clouds() {
  return (
    <g className="hero-cloud" fill="#FFFFFF" fillOpacity="0.92">
      <ellipse cx="180" cy="42" rx="54" ry="22" />
      <ellipse cx="230" cy="38" rx="40" ry="18" />
      <ellipse cx="148" cy="48" rx="32" ry="14" />
      <ellipse cx="640" cy="28" rx="48" ry="16" />
      <ellipse cx="678" cy="24" rx="28" ry="12" />
    </g>
  );
}

function Sun() {
  return (
    <g transform="translate(118 18)">
      <circle cx="48" cy="48" r="36" fill="#FFC53D" />
      <circle cx="48" cy="48" r="26" fill="#FFE86A" />
    </g>
  );
}

function Hills() {
  return (
    <g>
      <path
        d="M0 220C120 188 210 210 320 198C460 182 520 230 680 216C840 200 920 168 1080 190C1200 206 1320 176 1440 196V460H0V220Z"
        fill="#D7E8B8"
      />
      <path
        d="M0 268C160 242 260 280 420 258C580 236 700 286 860 264C1020 242 1180 272 1440 250V460H0V268Z"
        fill="#C8DC9E"
      />
    </g>
  );
}

function Creek() {
  return (
    <g>
      <path
        d="M40 300C100 292 160 310 280 298V360C160 348 88 338 28 346C-16 352 -32 330 40 300Z"
        fill="#7DB8A4"
      />
      <path
        d="M80 318C148 312 220 324 300 316"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Plant() {
  return (
    <g transform="translate(40 168)">
      <rect x="20" y="86" width="210" height="78" rx="6" fill="#1F9D55" />
      <rect x="20" y="86" width="210" height="16" fill="#147A3E" />
      <rect x="36" y="110" width="36" height="28" rx="3" fill="#FFFFFF" fillOpacity="0.28" />
      <rect x="84" y="110" width="36" height="28" rx="3" fill="#FFFFFF" fillOpacity="0.18" />
      <rect x="20" y="148" width="210" height="8" fill="#FFC53D" />
      <text
        x="128"
        y="142"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        PLANT
      </text>
      <Bullet cx={48} />
      <Bullet cx={108} />
      <Bullet cx={168} />
      <rect x="196" y="48" width="10" height="40" fill="#16231C" />
      <path d="M201 48h28" stroke="#16231C" strokeWidth="4" strokeLinecap="round" />
      <path d="M229 48v22" stroke="#1F9D55" strokeWidth="4" strokeLinecap="round" />
      <rect x="222" y="68" width="16" height="10" rx="2" fill="#FFC53D" />
    </g>
  );
}

function Bullet({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx} 28)`}>
      <rect x="0" y="12" width="44" height="52" rx="22" fill="#F7FAF8" stroke="#16231C" strokeWidth="2" />
      <rect x="16" y="0" width="12" height="16" rx="3" fill="#16231C" />
      <path d="M10 34h24" stroke="#1F9D55" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function GraHouse() {
  return (
    <g transform="translate(430 186)">
      <rect x="18" y="78" width="168" height="70" rx="4" fill="#F4EFE3" />
      <path d="M8 80L102 18L196 80H8Z" fill="#8B5A2B" />
      <path d="M8 80L102 18L196 80" stroke="#16231C" strokeWidth="3" strokeLinejoin="round" />
      <rect x="28" y="90" width="36" height="28" rx="2" fill="#7DB8A4" />
      <rect x="78" y="90" width="36" height="28" rx="2" fill="#7DB8A4" />
      <rect x="132" y="96" width="32" height="52" rx="2" fill="#147A3E" />
      <rect x="0" y="146" width="210" height="10" fill="#C8B48A" />
      <rect x="148" y="58" width="18" height="28" fill="#8B5A2B" />
      <rect x="42" y="118" width="70" height="8" fill="#1F9D55" />
    </g>
  );
}

/** Stylized PH Tower — twin-peak / V crown from the Garden City landmark photo. */
function PhTower({ clipId }: { clipId: string }) {
  return (
    <g transform="translate(780 42)" className="hero-run__tower">
      <defs>
        <clipPath id={clipId}>
          <path d="M36 56 L64 10 L80 28 L96 10 L124 56 V246 H36 Z" />
        </clipPath>
      </defs>
      <ellipse cx="80" cy="276" rx="78" ry="10" fill="#16231C" opacity="0.12" />
      <rect x="8" y="246" width="144" height="32" rx="4" fill="#F7FAF8" />
      <rect x="20" y="238" width="120" height="12" fill="#FFFFFF" />
      <image
        href={PH_TOWER_SRC}
        x="28"
        y="8"
        width="104"
        height="240"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <path
        d="M36 56 L64 10 L80 28 L96 10 L124 56 V246 H36 Z"
        fill="#16231C"
        fillOpacity="0.12"
        stroke="#16231C"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M64 10 L80 28 L96 10"
        fill="none"
        stroke="#16231C"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M36 56 H124" stroke="#FFC53D" strokeWidth="4" />
      <rect x="70" y="250" width="20" height="22" rx="2" fill="#1F9D55" />
    </g>
  );
}

function ShopBlock() {
  return (
    <g transform="translate(920 168)">
      <rect x="0" y="70" width="72" height="120" rx="4" fill="#2BB862" />
      <rect x="10" y="84" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="40" y="84" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="10" y="112" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="40" y="112" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="68" y="56" width="64" height="134" rx="4" fill="#FFC53D" />
      <rect x="80" y="72" width="40" height="26" rx="2" fill="#FFFFFF" fillOpacity="0.55" />
      <rect x="86" y="116" width="28" height="42" rx="2" fill="#147A3E" />
    </g>
  );
}

function Trees() {
  return (
    <g>
      <Palm x={390} y={210} />
      <Mango x={660} y={228} />
      <Palm x={860} y={200} />
      <Mango x={1324} y={220} />
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="18" y="40" width="8" height="72" rx="3" fill="#6B4226" />
      <path d="M22 44C4 28 2 8 12 4C18 22 22 28 22 44Z" fill="#1F9D55" />
      <path d="M22 44C40 26 52 10 44 2C34 18 26 30 22 44Z" fill="#147A3E" />
      <path d="M22 48C8 52 -6 46 -8 36C8 40 16 44 22 48Z" fill="#2BB862" />
    </g>
  );
}

function Mango({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="22" y="52" width="8" height="56" rx="3" fill="#6B4226" />
      <ellipse cx="26" cy="40" rx="28" ry="26" fill="#1F9D55" />
      <ellipse cx="18" cy="34" rx="14" ry="12" fill="#2BB862" />
    </g>
  );
}

function Road() {
  return (
    <g>
      <path d="M0 392h1440v68H0Z" fill="#3D4A42" />
      <path d="M0 388h1440v8H0Z" fill="#2A332E" />
      <path
        className="hero-run__dash"
        d="M-40 424h1520"
        stroke="#FFC53D"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        className="hero-run__dash hero-run__dash--edge"
        d="M-40 404h1520"
        stroke="#FFFFFF"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function JamHaze() {
  return (
    <rect
      className="hero-run__haze"
      x="0"
      y="368"
      width="1440"
      height="92"
      fill="#FFC53D"
      opacity="0.16"
    />
  );
}

function Keke() {
  return (
    <g className="hero-run__keke">
      <g transform="translate(80 352)">
        <ellipse cx="70" cy="48" rx="58" ry="7" fill="#16231C" opacity="0.16" />
        <rect x="28" y="8" width="72" height="28" rx="8" fill="#FFC53D" />
        <rect x="28" y="8" width="72" height="8" rx="8" fill="#FFE86A" />
        <rect x="8" y="18" width="28" height="20" rx="6" fill="#1F9D55" />
        <rect x="14" y="22" width="14" height="10" rx="2" fill="#FFFFFF" fillOpacity="0.4" />
        <SpokeWheel className="hero-run__wheel" cx={22} cy={44} r={9} />
        <SpokeWheel className="hero-run__wheel" cx={58} cy={44} r={9} />
        <SpokeWheel className="hero-run__wheel" cx={90} cy={44} r={9} />
      </g>
    </g>
  );
}

/** Green truck + cylinder + motion dashes — the GasGo mark, running the road. */
function GasGoRun() {
  return (
    <g className="hero-run__truck">
      <g transform="translate(40 328)">
        <g className="hero-run__soul" strokeLinecap="round">
          <path d="M-22 22h42" stroke="#1F9D55" strokeWidth="5" />
          <path d="M-34 36h48" stroke="#FFC53D" strokeWidth="6" />
          <path d="M-18 50h36" stroke="#1F9D55" strokeWidth="5" />
          <path d="M-28 43h22" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="3" />
        </g>
        <ellipse cx="118" cy="66" rx="90" ry="8" fill="#16231C" opacity="0.18" />
        <rect x="24" y="16" width="148" height="42" rx="8" fill="#1F9D55" />
        <rect x="24" y="16" width="148" height="10" rx="8" fill="#2BB862" />
        <rect x="24" y="36" width="148" height="4" fill="#FFC53D" />
        <rect x="168" y="22" width="52" height="36" rx="6" fill="#147A3E" />
        <path d="M214 22h12l16 18v18h-10c-4 0-7-3-8-7L214 22Z" fill="#16231C" />
        <rect x="180" y="26" width="28" height="16" rx="3" fill="#FFFFFF" fillOpacity="0.35" />
        <rect x="46" y="22" width="18" height="22" rx="6" fill="#FFFFFF" />
        <rect x="50" y="18" width="10" height="6" rx="1.5" fill="#147A3E" />
        <path d="M49 34h12" stroke="#1F9D55" strokeWidth="1.6" strokeLinecap="round" />
        <SpokeWheel className="hero-run__wheel" cx={64} cy={60} r={12} />
        <SpokeWheel className="hero-run__wheel" cx={186} cy={60} r={12} />
      </g>
    </g>
  );
}

function ForegroundCylinders() {
  return (
    <g>
      <g transform="translate(520 348)">
        <MiniCyl x={0} />
        <MiniCyl x={28} />
      </g>
    </g>
  );
}

function MiniCyl({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="6" y="0" width="7" height="7" rx="1.4" fill="#16231C" />
      <rect x="0" y="7" width="19" height="32" rx="8" fill="#FFFFFF" stroke="#16231C" strokeWidth="1.5" />
      <path d="M4 20h11" stroke="#1F9D55" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function SpokeWheel({
  cx,
  cy,
  r,
  className,
}: {
  cx: number;
  cy: number;
  r: number;
  className?: string;
}) {
  const spoke = r * 0.62;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={className}>
        <circle r={r} fill="#16231C" />
        <path
          d={`M0 ${-spoke}v${spoke * 2}M${-spoke} 0h${spoke * 2}`}
          stroke="#FFC53D"
          strokeWidth={r > 10 ? 2.2 : 1.6}
          strokeLinecap="round"
        />
        <circle r={r * 0.38} fill="#FFC53D" />
      </g>
    </g>
  );
}
