"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    const style = "font-size: 14px; font-weight: bold; color: #10b981;";
    const style2 = "font-size: 11px; color: #6b7280;";
    console.log(
      "%c✨ Megan Builds Commerce ✨",
      `${style} letter-spacing: 0.1em;`
    );
    console.log(
      "%cEngineering as a high-leverage growth lever.",
      style2
    );
    console.log(
      "%cBuilding the technical architecture for 9-figure brands.",
      style2
    );
    console.log(
      "%cPsst — you found the console. Nice. 👋",
      "font-size: 10px; font-style: italic; color: #6b7280;"
    );
  }, []);
  return null;
}
