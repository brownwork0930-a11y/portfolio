import React from "react";
import { FaGithubSquare } from "react-icons/fa";
import { contactEmail } from "@/lib/consts";
import DownloadButton from "./DownloadButton";

export default function Intro({ t, lang }: { t: any; lang: string }) {
  return (
    <section
      id="about"
      className="mb-28 max-w-[60rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center">
        <div className="relative"></div>
      </div>

      <h1 className="relative mb-2 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl">
        {t.intro.name}
        <span className="ml-2 text-2xl">👋</span>
      </h1>
      <p className="relative mb-10 text-md">
        Email: <a className="underline cursor-pointer" href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium">
        <DownloadButton lang={lang} label={t.intro.download_cv} toastSuccess={t.toast.download_success} />

        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://github.com/ireneio"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
      </div>
    </section>
  );
}
