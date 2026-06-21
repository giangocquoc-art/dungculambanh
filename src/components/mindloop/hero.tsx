"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Bottom fade to background */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 pt-28 md:pt-32 text-center">
        {/* Avatar row */}
        <motion.div
          {...fadeUp(0.05)}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            <img
              src="/avatars/avatar-1.png"
              alt="Subscriber avatar"
              className="h-8 w-8 rounded-full border-2 border-background object-cover"
            />
            <img
              src="/avatars/avatar-2.png"
              alt="Subscriber avatar"
              className="h-8 w-8 rounded-full border-2 border-background object-cover"
            />
            <img
              src="/avatars/avatar-3.png"
              alt="Subscriber avatar"
              className="h-8 w-8 rounded-full border-2 border-background object-cover"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            7,000+ people already subscribed
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.15)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground"
        >
          Get <span className="font-serif italic font-normal">Inspired</span>{" "}
          with Us
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--hero-subtitle))]"
        >
          Join our feed for meaningful updates, news around technology and a
          shared journey toward depth and direction.
        </motion.p>

        {/* Email form */}
        <motion.form
          {...fadeUp(0.45)}
          onSubmit={(e) => e.preventDefault()}
          className="liquid-glass mt-10 flex w-full max-w-lg items-center gap-2 rounded-full p-2"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
            className="flex-1 bg-transparent px-5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-wide text-background hover:bg-foreground/90 transition-colors"
          >
            SUBSCRIBE
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
