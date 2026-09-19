"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getGaugeColor,
  getGaugeLevel,
  ringGeometry,
  strokeOffset,
} from "./utils";
import { useSpringPercent } from "./useSpringPercent";
import { gauge, ink } from "@/config/tokens";

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

  const animated = useSpringPercent(percent);
  const level = getGaugeLevel(percent);
  const color = getGaugeColor(percent);
  const shouldBreathe = breathe ?? level === "critical";
  const isCaution = level === "caution";

  const { stroke, radius, circumference, center } = useMemo(() => {
    const cautionWidth =
      strokeWidth ??
      (isCaution
        ? Math.max(11, Math.round(size * 0.082))
        : undefined);
    return ringGeometry(size, cautionWidth);
  }, [size, strokeWidth, isCaution]);

  const offset = strokeOffset(animated, circumference);
  const trackStroke = isCaution
    ? `color-mix(in srgb, ${gauge.track} 70%, ${ink})`
    : gauge.track;

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
            x="-24%"
            y="-24%"
            width="148%"
            height="148%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation={isCaution ? 2.2 : 3}
              floodColor={isCaution ? ink : color}
              floodOpacity={isCaution ? 0.18 : 0.25}
            />
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackStroke}
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {isCaution && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={ink}
            strokeWidth={stroke + 3}
            strokeOpacity={0.14}
            strokeLinecap="round"
          />
        )}

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
            willChange: "stroke-dashoffset",
          }}
        />
      </svg>
    </div>
  );
}
