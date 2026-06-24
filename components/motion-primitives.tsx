"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal + stagger primitives for Wicket Travel.
 *
 * Reveals are driven by the `animate` prop toggled from a `useInView` hook
 * (IntersectionObserver) rather than framer's `whileInView` gesture — in this
 * Next 16 / React 19 / framer-motion 12 stack `whileInView` does not fire, which
 * left every below-the-fold section stuck at opacity:0. Content must never stay
 * hidden, so a short fallback timer reveals it even if the observer never fires
 * (headless renderers, edge browsers). All motion is transform/opacity only and
 * respects prefers-reduced-motion (renders final state, no animation).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;

export function fadeUp(distance = 20): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION, ease: EASE },
    },
  };
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

/** Reveal once the element scrolls in, with a fallback so it can't stay hidden. */
function useReveal(amount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const [fallback, setFallback] = useState(false);

  // Safety net: if the observer never reports (rare engines), reveal anyway.
  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return { ref, show: inView || fallback };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Single element that fades + rises into view once. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal(0.2);

  if (reduce) {
    return (
      <motion.div ref={ref} className={className} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: DURATION, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  amount = 0.15,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal(amount);

  if (reduce) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

export function StaggerItem({
  children,
  className,
  distance = 20,
  ...rest
}: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={fadeUp(distance)} {...rest}>
      {children}
    </motion.div>
  );
}
