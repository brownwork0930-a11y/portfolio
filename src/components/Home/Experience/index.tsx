import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Timeline from "./Timeline";
import SectionTracker from "@/components/common/SectionTracker";

export default function Experience({ t, data }: any) {
  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionTracker sectionKey="Experience" />
      <SectionHeading>{t.experience.title}</SectionHeading>
      <Timeline data={data} />
    </section>
  );
}
