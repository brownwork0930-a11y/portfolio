"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import { FaTimes } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setShowProjectImageModal } from "@/lib/features/project/projectSlice";
import { useTheme } from "@/context/theme-context";
import clsx from "clsx";

import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function ProjectsModal() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const showProjectImageModal = useAppSelector(state => state.projectSlice.showProjectImageModal);
  const modalImageList = useAppSelector(state => state.projectSlice.modalImageList);
  const initalModalImageIndex = useAppSelector(state => state.projectSlice.initalModalImageIndex);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    if (carouselRef.current && showProjectImageModal) {
      carouselRef.current.state.currentSlide = initalModalImageIndex;
    }
  }, [carouselRef.current, initalModalImageIndex, showProjectImageModal]);

  return (
    <Modal show={showProjectImageModal}>
      <div className="absolute top-0 right-0 py-[24px] px-[24px] cursor-pointer z-10" onClick={() => dispatch(setShowProjectImageModal(false))}>
        <FaTimes className="text-[24px]" />
      </div>
      <div className="md:px-[24px] py-[72px]">
        <Carousel ref={carouselRef} responsive={responsive} itemClass="flex justify-center">
          {modalImageList.map((image: any, index: number) => (
            <Image
              key={index}
              quality={100}
              src={image.src}
              alt={image.alt}
              className={clsx(
                "h-[82vh] w-auto object-contain",
                theme === "light" ? "bg-gray-300 bg-opacity-[0.3]" : "bg-gray-700 bg-opacity-[0.3]"
              )}
            />
          ))}
        </Carousel>
      </div>
    </Modal>
  );
}
