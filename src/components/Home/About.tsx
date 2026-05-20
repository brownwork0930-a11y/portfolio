import React from "react";
import SectionHeading from "@/components/common/SectionHeading";

export default function About({ t }: any) {
  return (
    <section className="max-w-[38rem] text-center leading-8 scroll-mt-28">
      <SectionHeading>{t.about.title}</SectionHeading>
      <p className="mb-3">
        {t.about.introduction}
      </p>
    </section>
  );
}
