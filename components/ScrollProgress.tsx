"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin scroll-progress indicator pinned to the very top edge. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      // This bar transforms (scaleX) on every scroll frame, so it's a genuine
      // (and sole) will-change candidate — keeps it on its own composited layer.
      style={{ scaleX, willChange: "transform" }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent-500 to-accent-400"
    />
  );
}
