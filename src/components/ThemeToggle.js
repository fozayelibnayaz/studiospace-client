"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "studiospace-theme";

export default function ThemeToggle({ overlay = false, className = "" }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "studio" ? "studio" : "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "studio" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — theme just won't persist */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light / dark theme"
      title={theme === "light" ? "Switch to dark" : "Switch to light"}
      className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${
        overlay
          ? "text-[#f7f3e9] hover:bg-white/10"
          : "border border-base-content/10 text-base-content hover:bg-base-content/5"
      } ${className}`}
    >
      {mounted && theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
