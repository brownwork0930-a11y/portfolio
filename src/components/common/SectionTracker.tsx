"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "@/context/active-section-context";

export default function SectionTracker({ sectionKey }: { sectionKey: string }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "-40% 0px -50% 0px",
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionKey);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionKey]);

  return <span ref={ref} />;
}
