import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import SectionTracker from "@/components/common/SectionTracker";

type SkillGroup = { category: string; skills: string[] };

export default function Skills({ t, data }: { t: any, data: SkillGroup[] }) {
  return (
    <section
      id="skills"
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionTracker sectionKey="Skills" />
      <SectionHeading>{t.hard_skills.title}</SectionHeading>
      <div className="flex flex-col gap-4">
        {data.map((group: SkillGroup) => (
          <div key={group.category} className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-full text-center mb-1">
              {group.category}
            </span>
            {group.skills.map((skill: string) => (
              <span
                className="bg-white borderBlack rounded-xl px-5 py-3 text-lg text-gray-800 dark:bg-white/10 dark:text-white/80"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
