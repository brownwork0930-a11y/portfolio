import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import SectionTracker from "@/components/common/SectionTracker";

export default function SoftSkills({ t, data }: { t: any, data: string[] }) {
  return (
    <section
      id="soft_skills"
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionTracker sectionKey="Skills" />
      <SectionHeading>{t.soft_skills.title}</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
        {data.map((skill: string, index: number) => (
          <li
            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80"
            key={index}
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
