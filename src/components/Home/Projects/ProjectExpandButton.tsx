"use client";

import { useAppDispatch } from "@/lib/hooks";
import { setInitalModalImageIndex, setModalImageList, setShowProjectImageModal } from "@/lib/features/project/projectSlice";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { StaticImageData } from "next/image";
import clsx from "clsx";
import { useTheme } from "@/context/theme-context";

type CarouselImage = { src: StaticImageData; alt: string };

export default function ProjectExpandButton({ imageIndex, images }: { imageIndex: number; images: CarouselImage[] }) {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const handleClick = () => {
    dispatch(setInitalModalImageIndex(imageIndex));
    dispatch(setModalImageList(images));
    const tid = setTimeout(() => {
      dispatch(setShowProjectImageModal(true));
      clearTimeout(tid);
    }, 100);
  };

  return (
    <div
      className={clsx(
        "absolute top-[1rem] group-odd:right-[1rem] group-even:left-[1rem] cursor-pointer px-2 py-2 rounded-[4px]",
        theme === "light" ? "bg-gray-300 shadow-md" : "bg-gray-500"
      )}
      onClick={handleClick}
    >
      <FaExpandArrowsAlt />
    </div>
  );
}
