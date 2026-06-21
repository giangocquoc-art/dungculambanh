"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ConcentricLogo } from "./concentric-logo";
import { HlsVideo } from "./hls-video";

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export function CTA() {
  return (
    <section className="relative w-full overflow-hidden py-32 md:py-44 border-t border-border/30">
      {/* HLS background video */}
      <div className="absolute inset-0 z-0">
        <HlsVideo src={HLS_URL} />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-background/45" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.div {...fadeUp(0.05)}>
          <ConcentricLogo size="md" />
        </motion.div>

        <motion.h2
          {...fadeUp(0.15)}
          className="mt-8 text-4xl md:text-6xl font-medium tracking-[-1.5px] text-foreground"
        >
          Start Your <span className="font-serif italic font-normal">Journey</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-5 max-w-xl text-lg text-muted-foreground"
        >
          Join thousands of curious minds reading, writing, and thinking out
          loud. Your next idea is one conversation away.
        </motion.p>

        <motion.div
          {...fadeUp(0.45)}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Subscribe Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground"
          >
            Start Writing
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
