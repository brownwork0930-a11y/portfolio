"use client";

import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 100 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * index },
  }),
};

export default function AnimatedBadgeLi({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <motion.li
      className={className}
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      custom={index}
    >
      {children}
    </motion.li>
  );
}
