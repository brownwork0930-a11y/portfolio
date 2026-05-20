import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Timeline from "./Timeline";
import SectionWrapper from "@/components/common/SectionWrapper";

export default function Experience({ t, data }: any) {
  return (
    <SectionWrapper id="experience" sectionKey="Experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>{t.experience.title}</SectionHeading>
      <Timeline data={data} />
    </SectionWrapper>
  );
}
