"use client";

import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import { useSectionInView } from "@/lib/useSectionInView";
import { motion } from "framer-motion";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

type SkillGroup = { category: string; skills: string[] };

export default function Skills({ t, data }: { t: any, data: SkillGroup[] }) {
  const { ref } = useSectionInView("Skills");

  let globalIndex = 0;

  return (
    <section
      id="skills"
      ref={ref}
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
                <motion.span
                  className="bg-white borderBlack rounded-xl px-5 py-3 text-lg text-gray-800 dark:bg-white/10 dark:text-white/80"
                  key={skill}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={idx}
                >
                  {skill}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
