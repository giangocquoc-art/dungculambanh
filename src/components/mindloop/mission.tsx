"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { fadeUp } from "@/lib/animations";

const MISSION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

// Paragraph 1 — "curiosity", "meets", "clarity" are highlighted (foreground)
const P1_HIGHLIGHTS = new Set(["curiosity", "meets", "clarity"]);
const P1 =
  "We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having.";
const P2 =
  "A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved.";

type WordColor = "foreground" | "subtitle";

interface WordProps {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
  color: WordColor;
}

function Word({ text, progress, range, color }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={
        color === "foreground"
          ? "text-foreground"
          : "text-[hsl(var(--hero-subtitle))]"
      }
    >
      {text}{" "}
    </motion.span>
  );
}

export function Mission() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.2"],
  });

  // Flatten all words across both paragraphs to compute even progress ranges.
  const p1Tokens = P1.split(" ");
  const p2Tokens = P2.split(" ");
  const total = p1Tokens.length + p2Tokens.length;

  // small overlap so the sweep feels continuous
  const step = 1 / total;
  const pad = step * 0.35;

  return (
    <section
      id="philosophy"
      className="relative w-full px-6 pt-0 pb-32 md:pb-44"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        {/* Large square video */}
        <motion.div
          {...fadeUp(0.05)}
          className="relative mb-16 h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] md:h-[640px] md:w-[640px] lg:h-[800px] lg:w-[800px] overflow-hidden rounded-3xl"
        >
          <video
            className="h-full w-full object-cover"
            src={MISSION_VIDEO}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>

        {/* Scroll-reveal text */}
        <div
          ref={containerRef}
          className="relative flex max-w-4xl flex-col items-center"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-[1.25] text-center">
            {p1Tokens.map((word, i) => {
              const t = i / total;
              return (
                <Word
                  key={`p1-${i}`}
                  text={word}
                  progress={scrollYProgress}
                  range={[t, Math.min(t + step + pad, 1)]}
                  color={P1_HIGHLIGHTS.has(word) ? "foreground" : "subtitle"}
                />
              );
            })}
          </p>

          <p className="mt-10 text-xl md:text-2xl lg:text-3xl font-medium tracking-[-0.5px] leading-[1.3] text-center">
            {p2Tokens.map((word, i) => {
              const idx = p1Tokens.length + i;
              const t = idx / total;
              return (
                <Word
                  key={`p2-${i}`}
                  text={word}
                  progress={scrollYProgress}
                  range={[t, Math.min(t + step + pad, 1)]}
                  color="foreground"
                />
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
