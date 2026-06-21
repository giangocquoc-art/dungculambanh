"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import {
  ChatGPTIcon,
  PerplexityIcon,
  GoogleAIIcon,
} from "./platform-icons";

const PLATFORMS = [
  {
    name: "ChatGPT",
    description:
      "Conversational answers that synthesize the web into a single, cited reply.",
    Icon: ChatGPTIcon,
  },
  {
    name: "Perplexity",
    description:
      "Real-time research with transparent sources and follow-up questions.",
    Icon: PerplexityIcon,
  },
  {
    name: "Google AI",
    description:
      "AI Overviews that summarize results before a single click is made.",
    Icon: GoogleAIIcon,
  },
];

export function SearchChanged() {
  return (
    <section
      id="how-it-works"
      className="relative w-full px-6 pt-52 md:pt-64 pb-6 md:pb-9"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Heading */}
        <motion.h2
          {...fadeUp(0.05)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground"
        >
          Search has{" "}
          <span className="font-serif italic font-normal">changed.</span> Have
          you?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-2xl text-lg text-muted-foreground mb-24"
        >
          The way people discover ideas has shifted overnight. Answers now come
          before pages, and attention is won or lost in a single sentence.
        </motion.p>

        {/* Platform cards */}
        <div className="grid w-full md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {PLATFORMS.map(({ name, description, Icon }, i) => (
            <motion.div
              key={name}
              {...fadeUp(0.3 + i * 0.12)}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-[200px] w-[200px] items-center justify-center">
                <Icon className="h-[140px] w-[140px]" />
              </div>
              <h3 className="font-semibold text-base text-foreground">
                {name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-[220px]">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.7)}
          className="text-sm text-muted-foreground text-center"
        >
          If you don&apos;t answer the questions, someone else will.
        </motion.p>
      </div>
    </section>
  );
}
