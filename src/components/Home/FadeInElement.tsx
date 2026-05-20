"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type Tag = "h1" | "p" | "div";

type Props = HTMLMotionProps<"div"> & {
  tag?: Tag;
  delay?: number;
};

export default function FadeInElement({ tag = "div", delay = 0, children, ...rest }: Props) {
  const Tag = motion[tag] as any;
  return (
    <Tag
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
