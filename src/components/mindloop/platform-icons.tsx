import { cn } from "@/lib/utils";

interface PlatformIconProps {
  className?: string;
}

/**
 * Monochrome line-art icons representing the three AI search platforms.
 * Rendered as crisp SVGs (no raster assets needed) — stroke-only, currentColor.
 */

// ChatGPT — abstract stylized blossom / spark knot
export function ChatGPTIcon({ className }: PlatformIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* outer rounded hexagon */}
        <path
          d="M100 28 L158 61 L158 139 L100 172 L42 139 L42 61 Z"
          opacity="0.45"
        />
        {/* central knot — six petals */}
        <path d="M100 70 C118 70 130 86 130 100 C130 118 112 130 100 130 C82 130 70 114 70 100 C70 82 88 70 100 70 Z" />
        <path d="M100 70 C100 86 100 114 100 130" opacity="0.6" />
        <path d="M70 100 C86 100 114 100 130 100" opacity="0.6" />
        <path d="M78 78 C90 90 110 110 122 122" opacity="0.45" />
        <path d="M122 78 C110 90 90 110 78 122" opacity="0.45" />
      </g>
    </svg>
  );
}

// Perplexity — radar / target rings with a spark
export function PerplexityIcon({ className }: PlatformIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="100" cy="100" r="68" opacity="0.35" />
        <circle cx="100" cy="100" r="46" opacity="0.55" />
        <circle cx="100" cy="100" r="24" />
        {/* radar sweep */}
        <path d="M100 100 L148 64" opacity="0.7" />
        <path d="M100 100 L52 136" opacity="0.7" />
        {/* spark */}
        <path d="M148 64 L156 52 L150 64 L162 60 L150 64" />
      </g>
    </svg>
  );
}

// Google AI — four-point sparkle / Gemini-style star
export function GoogleAIIcon({ className }: PlatformIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* four-point sparkle */}
        <path d="M100 36 C108 72 128 92 164 100 C128 108 108 128 100 164 C92 128 72 108 36 100 C72 92 92 72 100 36 Z" />
        {/* small sparkle */}
        <path d="M150 150 C154 142 158 138 166 134 C158 138 154 142 150 134 C146 142 142 138 134 134 C142 138 146 142 150 150 Z" opacity="0.6" />
      </g>
    </svg>
  );
}
