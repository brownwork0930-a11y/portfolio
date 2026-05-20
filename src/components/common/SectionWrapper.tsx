"use client";

import { useSectionInView } from "@/lib/useSectionInView";

interface Props {
  id?: string;
  className?: string;
  sectionKey: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ id, className, sectionKey, children }: Props) {
  const { ref } = useSectionInView(sectionKey);
  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
