"use client";

import { useTheme } from "@/context/theme-context";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, show }: { children: React.ReactNode, show: boolean }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false);

  const content =  React.useMemo(() => {
    return (
      <div
        className={clsx(
          "fixed top-0 left-0 right-0 bottom-0 z-[1002] flex items-center justify-center bg-black bg-opacity-[0.5]",
          show ? 'block' : 'hidden'
        )}
      >
        <div
          className={clsx(
            "w-[100vw] h-[100dvh] md:w-[95vw] md:h-[95vh] md:rounded-[8px] relative",
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          )}
        >
          {children}
        </div>
      </div>
    )
  }, [show, theme, children])

  React.useEffect(() => {
    if (!show) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Snapshot styles to restore later
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    // Lock: position fixed pins the page; top offset preserves visible scroll.
    // This is the only reliable way to stop iOS Safari from scrolling the background.
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      // Restore scroll position without smooth-scrolling
      window.scrollTo(0, scrollY);
    };
  }, [show])

  React.useEffect(() => setMounted(true), []);

  return mounted ? createPortal(content, document.body) : null;
}
