import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import SectionWrapper from "@/components/common/SectionWrapper";
import AnimatedBadge from "./AnimatedBadge";

type SkillGroup = { category: string; skills: string[] };

export default function Skills({ t, data }: { t: any, data: SkillGroup[] }) {
  let globalIndex = 0;

  return (
    <SectionWrapper
      id="skills"
      sectionKey="Skills"
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>{t.hard_skills.title}</SectionHeading>
      <div className="flex flex-col gap-4">
        {data.map((group: SkillGroup) => (
          <div key={group.category} className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-full text-center mb-1">
              {group.category}
            </span>
            {group.skills.map((skill: string) => {
              const idx = globalIndex++;
              return (
                <AnimatedBadge
                  key={skill}
                  index={idx}
                  className="bg-white borderBlack rounded-xl px-5 py-3 text-lg text-gray-800 dark:bg-white/10 dark:text-white/80"
                >
                  {skill}
                </AnimatedBadge>
              );
            })}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
