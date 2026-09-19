"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  clampPercent,
  getGaugeColor,
  getGaugeLevel,
  ringGeometry,
  strokeOffset,
} from "./utils";
import { gauge } from "@/config/tokens";

export type GaugeRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  breathe?: boolean;
};

export function GaugeRing({
  percent,
  size = gauge.heroSize,
  strokeWidth,
  className,
  breathe,
}: GaugeRingProps) {
  const uid = useId();
  const gradientId = `gauge-grad-${uid}`;
  const filterId = `gauge-glow-${uid}`;

  const p = clampPercent(percent);
  const level = getGaugeLevel(p);
  const color = getGaugeColor(p);
  const shouldBreathe = breathe ?? level === "critical";

  const { stroke, radius, circumference, center } = useMemo(
    () => ringGeometry(size, strokeWidth),
    [size, strokeWidth],
  );

  const offset = strokeOffset(p, circumference);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0",
        shouldBreathe && "animate-gauge-breathe",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.85} />
          </linearGradient>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor={color}
              floodOpacity="0.25"
            />
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={gauge.track}
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {level === "critical" && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeOpacity={0.2}
            className="animate-gauge-pulse origin-center"
            style={{ transformOrigin: "center" }}
          />
        )}

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#${filterId})`}
          className="gas-gauge-ring-progress origin-center"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            transition:
              "stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke 400ms ease",
            ["--gauge-circumference" as string]: `${circumference}`,
            ["--gauge-offset" as string]: `${offset}`,
          }}
        />
      </svg>
    </div>
  );
}
