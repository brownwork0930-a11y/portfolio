"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-context";
import clsx from "clsx";

export default function SectionDivider() {
  const { theme } = useTheme();

  return (
    <motion.div
      className={clsx(
        "my-24 h-16 w-1 rounded-full hidden sm:block dark:bg-opacity-20",
        theme === "light" ? "bg-gray-500" : "bg-gray-200"
      )}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
    />
  );
}
