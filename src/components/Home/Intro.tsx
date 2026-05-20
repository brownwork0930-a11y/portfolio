import React from "react";
import { FaGithubSquare } from "react-icons/fa";
import { contactEmail } from "@/lib/consts";
import DownloadButton from "./DownloadButton";
import SectionTracker from "@/components/common/SectionTracker";
import FadeInElement from "./FadeInElement";

export default function Intro({ t, lang }: { t: any; lang: string }) {
  return (
    <section
      id="about"
      className="mb-28 max-w-[60rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <SectionTracker sectionKey="About" />
      <div className="flex items-center justify-center">
        <div className="relative"></div>
      </div>

      <FadeInElement tag="h1" className="relative mb-2 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl">
        {t.intro.name}
        <span className="ml-2 text-2xl">👋</span>
      </FadeInElement>

      <FadeInElement tag="p" className="relative mb-10 text-md" delay={0.05}>
        Email: <a className="underline cursor-pointer" href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </FadeInElement>

      <FadeInElement className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium" delay={0.1}>
        <DownloadButton lang={lang} label={t.intro.download_cv} toastSuccess={t.toast.download_success} />

        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://github.com/ireneio"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
      </FadeInElement>
    </section>
  );
}
