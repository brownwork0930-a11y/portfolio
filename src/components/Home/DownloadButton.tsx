"use client";

import { HiDownload } from "react-icons/hi";
import { handleDownloadFile } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DownloadButton({ lang, label, toastSuccess }: { lang: string; label: string; toastSuccess: string }) {
  return (
    <button
      className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
      onClick={() => {
        handleDownloadFile(`/resumes/resume_${lang}.pdf`, `resume_${lang}.pdf`);
        toast.success(toastSuccess);
      }}
    >
      {label}{" "}
      <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
    </button>
  );
}
