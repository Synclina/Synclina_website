import { useId } from "react";

/** The looping S: two strokes that lock together. Logo grid, 200 x 180. */
export const RIBBON_PATHS = {
  a: "M150 20 H50 A50 50 0 0 0 50 120 H110",
  b: "M70 70 H120 A50 50 0 0 1 120 170 H40",
};
export const RIBBON_VIEWBOX = "-10 5 200 180";

type Props = {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  /** Attribute on each stroke, for draw-in animations. */
  pathAttr?: string;
  title?: string;
};

/** The Sync ribbon drawn as two gradient strokes. Never filled, never glowing. */
export default function Ribbon({ size = 120, className, strokeWidth = 20, pathAttr, title }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={RIBBON_VIEWBOX}
      width={size}
      height={typeof size === "number" ? (size * 180) / 200 : undefined}
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`rg${id}`} x1="0" y1="180" x2="190" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3A1CD8" />
          <stop offset="0.55" stopColor="#7C3EF0" />
          <stop offset="1" stopColor="#C96EFF" />
        </linearGradient>
      </defs>
      {(["a", "b"] as const).map((k) => (
        <path
          key={k}
          d={RIBBON_PATHS[k]}
          stroke={`url(#rg${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          {...(pathAttr ? { [pathAttr]: k } : {})}
        />
      ))}
    </svg>
  );
}
