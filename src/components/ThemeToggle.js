"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "studiospace-theme";

export default function ThemeToggle() {
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
      title={theme === "light" ? "Switch to studio dark" : "Switch to light"}
      className="btn btn-sm btn-ghost btn-circle border border-base-300 text-base-content hover:bg-base-200 transition-colors"
    >
      {mounted && theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
