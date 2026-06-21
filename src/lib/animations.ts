import type { Variants } from "framer-motion";

/**
 * Reusable fade-up animation helper used across all Mindloop sections.
 * Staggered by `delay` (seconds). Plays once when the element scrolls into view.
 */
export const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

/**
 * fadeUp variants form (for use with `variants` prop / staggered children).
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};
