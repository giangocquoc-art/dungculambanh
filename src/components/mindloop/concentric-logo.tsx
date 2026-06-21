import { cn } from "@/lib/utils";

interface ConcentricLogoProps {
  className?: string;
  /** size of the outer circle. Inner circle scales proportionally. */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { outer: "w-7 h-7", inner: "w-3 h-3" },
  md: { outer: "w-10 h-10", inner: "w-5 h-5" },
  lg: { outer: "w-14 h-14", inner: "w-7 h-7" },
};

/**
 * Mindloop brand mark — two concentric circles.
 * Outer ring uses border-foreground/60, inner ring uses border-foreground/60.
 */
export function ConcentricLogo({ className, size = "sm" }: ConcentricLogoProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full border-2 border-foreground/60",
        s.outer,
        className,
      )}
      aria-hidden="true"
    >
      <div className={cn("rounded-full border border-foreground/60", s.inner)} />
    </div>
  );
}
