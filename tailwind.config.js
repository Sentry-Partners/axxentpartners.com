/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.html", // all pages and injected partials (header.html, footer.html)
    "./assets/js/**/*.js", // classes added from JS (e.g., highlightActiveNav)
    "./**/*.svg", // classes inside inline SVGs
  ],
  safelist: [
    // critical runtime toggles / breakpoints used across the site
    "hidden",
    "md:hidden",
    "md:flex",
    "md:inline-flex",
    "overflow-hidden",
    "md:overflow-visible",
    "fixed",
    "inset-0",
    "inset-y-0",
    "right-0",
    "z-40",
    "z-50",
    "bg-black/50",
    "border-white/10",
    "bg-white/10",
    "text-white/80",
    "text-white/90",
    "font-semibold",
    "underline",
    "underline-offset-4",
    "bg-[var(--brand-bg)]",
    "text-[var(--brand-fg)]",
  ],
  theme: { extend: {} },
  plugins: [],
};
