"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "meganbuildscommerce-theme";

export default function ThemeToggle() {
  const [lightsOn, setLightsOn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const on = stored === "on";
      setLightsOn(on);
      document.documentElement.classList.toggle("lights-on", on);
    }
  }, []);

  function toggle() {
    const next = !lightsOn;
    setLightsOn(next);
    document.documentElement.classList.toggle("lights-on", next);
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      aria-pressed={lightsOn}
      aria-label={lightsOn ? "Turn lights off" : "Turn lights on"}
    >
      {lightsOn ? "Lights off" : "Lights on"}
    </button>
  );
}
