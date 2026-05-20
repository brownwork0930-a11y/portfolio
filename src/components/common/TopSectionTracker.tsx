"use client";

import { useEffect, useRef } from "react";
import { useActiveSectionContext } from "@/context/active-section-context";

// Sets activeSection → "About" whenever the page is scrolled near the top.
// Intersection observer won't work for the first section because it never
// enters the -40%/-50% detection band used by useSectionInView.
export default function TopSectionTracker() {
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();
  const timeRef = useRef(timeOfLastClick);

  useEffect(() => {
    timeRef.current = timeOfLastClick;
  }, [timeOfLastClick]);

  useEffect(() => {
    const check = () => {
      if (window.scrollY < 400 && Date.now() - timeRef.current > 1000) {
        setActiveSection("About");
      }
    };
    check(); // run on mount so initial state is correct
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [setActiveSection]);

  return null;
}
