"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { ConcentricLogo } from "./concentric-logo";
import { fadeUp } from "@/lib/animations";

const NAV_LINKS = ["Home", "How It Works", "Philosophy", "Use Cases"];

const SOCIALS = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Linkedin", icon: Linkedin, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
];

export function Navbar() {
  return (
    <motion.header
      {...fadeUp(0)}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-28 py-4"
    >
      <nav className="flex items-center justify-between gap-4">
        {/* Logo + wordmark */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <ConcentricLogo size="sm" />
          <span className="font-bold text-lg tracking-tight text-foreground">
            Mindloop
          </span>
        </a>

        {/* Center nav links */}
        <ul className="hidden md:flex items-center gap-2 text-sm">
          {NAV_LINKS.map((link, i) => (
            <li key={link} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-muted-foreground/50 select-none">•</span>
              )}
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {SOCIALS.map(({ label, icon: Icon, href }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass flex w-10 h-10 items-center justify-center rounded-full text-foreground/80 hover:text-foreground"
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
