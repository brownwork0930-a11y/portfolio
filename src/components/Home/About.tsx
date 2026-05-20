import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import AnimatedSection from "./AnimatedSection";

export default function About({ t }: any) {
  return (
    <AnimatedSection className="max-w-[38rem] text-center leading-8 scroll-mt-28" delay={0.175}>
      <SectionHeading>{t.about.title}</SectionHeading>
      <p className="mb-3">
        {t.about.introduction}
      </p>
    </AnimatedSection>
  );
}
