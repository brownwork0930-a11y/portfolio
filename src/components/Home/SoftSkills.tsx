import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import SectionWrapper from "@/components/common/SectionWrapper";
import AnimatedBadgeLi from "./AnimatedBadgeLi";

export default function SoftSkills({ t, data }: { t: any, data: string[] }) {
  return (
    <SectionWrapper
      id="soft_skills"
      sectionKey="Skills"
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>{t.soft_skills.title}</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
        {data.map((skill: string, index: number) => (
          <AnimatedBadgeLi
            key={index}
            index={index}
            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80"
          >
            {skill}
          </AnimatedBadgeLi>
        ))}
      </ul>
    </SectionWrapper>
  );
}
