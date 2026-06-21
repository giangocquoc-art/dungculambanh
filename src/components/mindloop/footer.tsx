"use client";

const FOOTER_LINKS = ["Privacy", "Terms", "Contact"];

export function Footer() {
  return (
    <footer className="mt-auto w-full px-8 md:px-28 py-12 border-t border-border/30">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © 2026 Mindloop. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
