"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const SOLUTION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const FEATURES = [
  {
    title: "Curated Feed",
    description:
      "A personalized stream of newsletters tuned to your interests, with less noise and more signal.",
  },
  {
    title: "Writer Tools",
    description:
      "Compose, schedule, and analyze with a calm editor built for depth instead of engagement bait.",
  },
  {
    title: "Community",
    description:
      "Turn readers into conversations. Threads, replies, and shared annotations around every issue.",
  },
  {
    title: "Distribution",
    description:
      "Reach inboxes, feeds, and AI answers — optimized so your words travel where attention goes.",
  },
];

export function Solution() {
  return (
    <section
      id="use-cases"
      className="relative w-full px-6 py-32 md:py-44 border-t border-border/30"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        {/* Label */}
        <motion.span
          {...fadeUp(0.05)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground"
        >
          Solution
        </motion.span>

        {/* Heading */}
        <motion.h2
          {...fadeUp(0.15)}
          className="mt-4 text-4xl md:text-6xl font-medium tracking-[-1.5px] text-foreground text-center max-w-3xl"
        >
          The platform for{" "}
          <span className="font-serif italic font-normal">meaningful</span>{" "}
          content
        </motion.h2>

        {/* Video */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-12 w-full overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-[3/1] w-full">
            <video
              className="h-full w-full object-cover"
              src={SOLUTION_VIDEO}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid w-full md:grid-cols-4 gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              {...fadeUp(0.4 + i * 0.1)}
              className="flex flex-col"
            >
              <h3 className="font-semibold text-base text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
