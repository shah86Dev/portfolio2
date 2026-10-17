"use client";

import type { MethodStage } from "@/content";
import { placeNodes } from "@/lib/universe";

interface Props {
  stages: MethodStage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Suppresses the idle pulse when the visitor prefers reduced motion. */
  animate: boolean;
}

const SIZE = 600;
const CENTER = SIZE / 2;
/** Pulled in from the edge so node labels clear the overlay pills. */
const ORBIT = 170;

/**
 * The non-WebGL Engineering Universe.
 *
 * Rendered instead of the 3D scene when WebGL is unavailable or the device is
 * a phone. It is a working alternative, not an apology: the same six stages,
 * the same selection state, the same detail panel.
 *
 * It is `aria-hidden` because the UniverseRail beside it carries the
 * semantics — these shapes are a visual mirror, and nothing inside is
 * focusable.
 */
export function UniverseDiagram({ stages, activeIndex, onSelect, animate }: Props) {
  const nodes = placeNodes(stages.length, ORBIT);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <defs>
        <radialGradient id="universe-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="var(--color-signal)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="universe-core-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-raised)" />
          <stop offset="100%" stopColor="var(--color-surface-sunken)" />
        </linearGradient>
      </defs>

      {/* Ambient field */}
      <circle cx={CENTER} cy={CENTER} r={250} fill="url(#universe-core-glow)" />

      {/* Technical rings */}
      {[ORBIT, ORBIT - 48, ORBIT - 96].map((r, i) => (
        <circle
          key={r}
          cx={CENTER}
          cy={CENTER}
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={1}
          strokeDasharray={i === 0 ? "2 7" : undefined}
          opacity={i === 0 ? 1 : 0.6}
        />
      ))}

      {/* Connectors */}
      {nodes.map((node, index) => {
        const active = index === activeIndex;
        return (
          <line
            key={`line-${stages[index]?.id ?? index}`}
            x1={CENTER}
            y1={CENTER}
            x2={CENTER + node.x}
            y2={CENTER + node.y}
            stroke={active ? "var(--color-signal)" : "var(--color-line-strong)"}
            strokeWidth={active ? 1.5 : 1}
            opacity={active ? 0.9 : 0.5}
            className="transition-[stroke,opacity] duration-[--dur-base]"
          />
        );
      })}

      {/* Central structure: "the system under construction" */}
      <g>
        <polygon
          points={hexagon(CENTER, CENTER, 52)}
          fill="url(#universe-core-face)"
          stroke="var(--color-line-strong)"
          strokeWidth={1}
        />
        <polygon
          points={hexagon(CENTER, CENTER, 33)}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth={1}
          opacity={0.75}
        />
        <polygon
          points={hexagon(CENTER, CENTER, 16)}
          fill="var(--color-signal)"
          opacity={0.9}
        >
          {animate ? (
            <animate
              attributeName="opacity"
              values="0.55;0.95;0.55"
              dur="4.5s"
              repeatCount="indefinite"
            />
          ) : null}
        </polygon>
      </g>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const stage = stages[index];
        if (!stage) return null;
        const active = index === activeIndex;
        const cx = CENTER + node.x;
        const cy = CENTER + node.y;

        return (
          <g
            key={stage.id}
            onClick={() => onSelect(index)}
            className="cursor-pointer"
          >
            {/* Generous invisible hit area for touch. */}
            <circle cx={cx} cy={cy} r={46} fill="transparent" />

            {active ? (
              <circle
                cx={cx}
                cy={cy}
                r={32}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth={1}
                opacity={0.6}
              />
            ) : null}

            <polygon
              points={diamond(cx, cy, active ? 19 : 14)}
              fill={active ? "var(--color-signal)" : "var(--color-surface-raised)"}
              stroke={active ? "var(--color-signal-strong)" : "var(--color-line-strong)"}
              strokeWidth={1.25}
              className="transition-all duration-[--dur-base]"
            />

            {/* Labels sit outward from the ring: above the upper nodes,
                below the lower ones, beside the ones on the horizon. */}
            <text
              x={cx}
              y={cy + (node.y < -40 ? -38 : node.y > 40 ? 46 : 5)}
              textAnchor="middle"
              className="font-mono"
              fontSize={13}
              letterSpacing="0.12em"
              fill={active ? "var(--color-ink)" : "var(--color-ink-faint)"}
              style={{ textTransform: "uppercase" }}
            >
              {stage.ordinal} {stage.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function hexagon(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}

function diamond(cx: number, cy: number, r: number): string {
  return [
    `${cx},${cy - r}`,
    `${cx + r},${cy}`,
    `${cx},${cy + r}`,
    `${cx - r},${cy}`,
  ].join(" ");
}
